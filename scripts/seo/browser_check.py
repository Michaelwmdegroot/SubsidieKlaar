"""Real-HTTP Chromium checks for the reviewed SEO pages and lazy guest exports.

Uses synthetic inputs, a loopback Node preview and the actual generated CSP.
No live hosting, accounts, external APIs, analytics activation or user documents.
Run after npm run build. Reports describe lab behavior, not field Core Web Vitals.
"""
from collections import Counter
from pathlib import Path
import base64
import json
import os
import socket
import subprocess
import time
import urllib.request
import urllib.error
from urllib.parse import urlsplit
import zipfile

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "qa" / "seo-browser"
OUT.mkdir(parents=True, exist_ok=True)
VENDORS = {
    "pdf": "/vendor/pdf-lib-1.17.1.min.js",
    "font": "/vendor/fontkit-1.1.1.min.js",
    "glyphs": "/vendor/noto-sans-font.js",
    "zip": "/vendor/jszip-3.10.1.min.js",
}
PDF_VENDORS = {VENDORS[key] for key in ("pdf", "font", "glyphs")}
REPORT = {
    "method": "Chromium over loopback HTTP with the generated CSP; synthetic data only",
    "fieldPerformanceMeasured": False,
    "checks": [], "screens": [], "requests": [], "errors": [],
    "cspViolations": [], "expectedFailures": [], "ok": False,
}


def check(condition, label, details=None):
    if not condition:
        raise AssertionError(f"{label}: {details!r}")
    REPORT["checks"].append(label)
    print("PASS", label, flush=True)


def start_server():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    base = f"http://127.0.0.1:{port}"
    log = (OUT / "preview-server.log").open("w")
    server = subprocess.Popen(
        ["node", "scripts/serve.cjs", "--port", str(port)], cwd=ROOT,
        stdout=log, stderr=subprocess.STDOUT,
    )
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError("Preview stopped: " + (OUT / "preview-server.log").read_text())
        try:
            with opener.open(base + "/", timeout=1) as response:
                csp = response.headers.get("Content-Security-Policy", "")
                check(response.status == 200 and "script-src 'self'" in csp,
                      "real HTTP preview sends the generated CSP")
                return server, log, base
        except urllib.error.URLError:
            time.sleep(0.1)
    server.terminate()
    raise RuntimeError("Loopback preview did not become ready")


def vendor_counts(requests):
    return Counter(item["path"] for item in requests if item["path"] in VENDORS.values())


def save_download(page, action, name):
    with page.expect_download(timeout=30000) as download:
        page.locator(f'[data-action="{action}"]').first.click()
    target = OUT / name
    download.value.save_as(target)
    return target


def pdf_info(page, data):
    check(data.startswith(b"%PDF-"), "download has a real PDF header")
    return page.evaluate("""async encoded => {
      const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const pdf = await PDFLib.PDFDocument.load(bytes);
      return {pages: pdf.getPageCount(), title: pdf.getTitle(), subject: pdf.getSubject()};
    }""", base64.b64encode(data).decode())


def wait_for_page_state(page, predicate, label, timeout_ms=8000):
    """Poll in Playwright's isolated execution context, never with CSP-blocked wait_for_function()."""
    deadline = time.monotonic() + timeout_ms / 1000
    while time.monotonic() < deadline:
        if page.evaluate(predicate):
            return
        page.wait_for_timeout(75)
    raise AssertionError("Timed out waiting for " + label)


def overview(page):
    page.locator('[data-action="step"][data-step="3"]').click()


def edit_name(page, value):
    page.locator('[data-action="step"][data-step="1"]').click()
    page.locator('[data-field="applicantName"]').fill(value)


def run(browser, base):
    contexts = []

    def context_for(label, java_script=True):
        context = browser.new_context(
            viewport={"width": 1440, "height": 960}, accept_downloads=True,
            java_script_enabled=java_script, service_workers="block",
        )
        contexts.append(context)
        requests = []

        def request_seen(request):
            parsed = urlsplit(request.url)
            item = {"scenario": label, "path": parsed.path, "method": request.method,
                    "local": parsed.scheme in ("http", "https") and
                    parsed.netloc == urlsplit(base).netloc}
            requests.append(item)
            REPORT["requests"].append(item)

        def allow_local(route):
            parsed = urlsplit(route.request.url)
            if parsed.scheme in ("http", "https") and parsed.netloc == urlsplit(base).netloc:
                route.continue_()
            else:
                route.abort("blockedbyclient")

        context.on("request", request_seen)
        context.route("**/*", allow_local)
        context.expose_binding("reportCsp", lambda source, value: REPORT["cspViolations"].append({"scenario": label, **value}))
        context.add_init_script("""
          addEventListener('securitypolicyviolation', event => {
            window.reportCsp({directive: event.effectiveDirective, blocked: event.blockedURI});
          });
          // Inspect the real printable document; no OS print dialog is needed in CI.
          window.print = () => { window.__printCalled = true; };
        """)

        def page_seen(page):
            page.set_default_timeout(15000)
            page.on("pageerror", lambda error: REPORT["errors"].append({"scenario": label, "message": str(error)}))
            page.on("dialog", lambda dialog: dialog.accept())

        context.on("page", page_seen)
        return context, requests

    # Search content must exist without executing the interactive application.
    context, requests = context_for("no-javascript", java_script=False)
    page = context.new_page()
    page.goto(base + "/", wait_until="load")
    check(page.locator("h1").count() == 1 and page.locator("h1").is_visible(),
          "home has one visible H1 without JavaScript")
    check(not vendor_counts(requests), "no-JavaScript homepage does not request export vendors")
    context.close()

    # Capture the actual HTTP-rendered home/articles at representative widths.
    context, requests = context_for("public-pages")
    page = context.new_page()
    for route in ("/", "/hulp/zonnepanelen-btw/", "/hulp/thuisbatterij-btw/"):
        page.goto(base + route, wait_until="networkidle")
        if route == "/hulp/thuisbatterij-btw/":
            pilot = page.locator('#lead-pilot-title')
            target = page.locator('a[href="/advies/"]')
            privacy = page.locator('a[href="/privacy/"]')
            check(pilot.count() == 1 and target.count() == 1 and privacy.count() >= 1,
                  "published battery article has exactly one voluntary NIVO Portal CTA and internal privacy link")
            check(target.get_attribute("target") is None and
                  "?" not in target.get_attribute("href") and
                  "#" not in target.get_attribute("href"),
                  "NIVO request remains same-origin with no query or fragment")
            check(page.locator('a[href^="https://thuisbatterijteam.nl/contact/adviesgesprek/"]').count()==0,
                  "old TBT destination is absent")
            check(page.locator('#lead-pilot-title').is_visible(),
                  "the voluntary commercial label is readable in the article")
        check(page.locator("h1").count() == 1, route + " has one rendered H1")
        check(page.locator('link[rel="canonical"]').get_attribute("href") == "https://subsidieready.nl" + route,
              route + " keeps its absolute production canonical")
        for width, height in ((1440, 960), (390, 844), (320, 740)):
            page.set_viewport_size({"width": width, "height": height})
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(80)
            dimensions = page.evaluate("""() => ({width: innerWidth,
              scroll: document.documentElement.scrollWidth,
              brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).length})""")
            REPORT["screens"].append({"route": route, "height": height, **dimensions})
            check(dimensions["scroll"] <= width and dimensions["brokenImages"] == 0,
                  f"{route} fits {width}px without broken images", dimensions)
            if width in (1440, 390):
                stem = route.strip("/").replace("/", "-") or "home"
                page.screenshot(path=OUT / f"{stem}-{width}.png", full_page=True)
        page.set_viewport_size({"width": 1440, "height": 960})
    check(not vendor_counts(requests), "public home and articles do not load PDF/ZIP dependencies")
    context.close()

    # Real browser/layout verification of the optional account form with a local,
    # synthetic bootstrap reply. No credentials, user POST, OTP or production mail.
    context, requests = context_for("one-screen-account-form")
    page = context.new_page()
    bootstrap_data = json.dumps({
        "mode": "production", "accounts": True, "vault": False, "leads": False,
        "controller": "NIVO Groep Holland B.V.", "contact": "info@nivogroepholland.nl",
        "user": None, "csrf": "0" * 64
    })
    page.route("**/api/next/?action=bootstrap", lambda route: route.fulfill(
        status=200, content_type="application/json", body=bootstrap_data
    ))
    page.goto(base + "/mijn-plan/", wait_until="networkidle")
    page.locator('[data-pa="login"]').click()
    checkbox = page.locator('#login-form input[name="marketingEmail"]')
    terms = page.locator('#login-form input[name="terms"]')
    check(checkbox.count() == 1 and not checkbox.is_checked() and
          checkbox.get_attribute("required") is None,
          "marketing email consent is one unchecked optional checkbox")
    check(terms.count() == 1 and not terms.is_checked() and
          terms.get_attribute("required") is not None,
          "account terms are the only required checkbox")
    check(page.locator("#login-form input[type=checkbox]").count() == 2 and
          page.locator("#login-form input[type=radio]").count() == 0,
          "signup uses two separate checkboxes and no radio-choice cards")
    for key in ("email", "fullName", "phone", "street", "houseNumber", "postalCode", "city"):
        check(page.locator(f'#login-form input[name="{key}"]').count() == 1,
              "signup contact field " + key + " is present")
    for width, height in ((1440, 900), (1280, 720), (390, 844), (375, 667), (320, 740)):
        page.set_viewport_size({"width": width, "height": height})
        page.wait_for_timeout(110)
        dims = page.evaluate("""() => {
          const d = document.querySelector('#plan-dialog');
          const b = d.querySelector('.p-dialog-body');
          const f = d.querySelector('#login-form');
          const submit = f.querySelector('[type=submit]');
          const r = d.getBoundingClientRect();
          const sr = submit.getBoundingClientRect();
          return {
            viewportW: innerWidth, viewportH: innerHeight,
            dialogLeft: r.left, dialogRight: r.right, dialogTop: r.top,
            dialogBottom: r.bottom, submitBottom: sr.bottom,
            dialogOverflow: d.scrollHeight > d.clientHeight + 1,
            bodyOverflow: b.scrollHeight > b.clientHeight + 1,
            submitVisible: sr.width > 0 && sr.height > 0
          };
        }""")
        REPORT["screens"].append({"route": "/mijn-plan/", "state": "compact-signup",
                                  "width": width, "height": height, **dims})
        check(dims["dialogTop"] >= 0 and dims["dialogBottom"] <= height - 2 and
              dims["dialogLeft"] >= -1 and dims["dialogRight"] <= width + 1 and
              dims["submitBottom"] <= height - 4 and dims["submitVisible"] and
              not dims["dialogOverflow"] and not dims["bodyOverflow"],
              f"full account form and submit fit {width}x{height} without scrolling", dims)
        if (width, height) in ((1440, 900), (390, 844), (375, 667)):
            page.screenshot(path=OUT / f"account-signup-{width}x{height}.png", full_page=False)
    check(not any(req["method"] != "GET" for req in requests),
          "opening account form never submits customer data")
    context.close()

    # Real Chromium regression of the NIVO Portal advice UI with a synthetic
    # public bootstrap. This does not submit a lead, request OTP or send email.
    context, portal_requests = context_for("portal-advice")
    page = context.new_page()
    portal_bootstrap = json.dumps({
      "mode":"production", "accounts":True, "portalAdvice":True, "leads":False,
      "vault":False, "controller":"NIVO Groep Holland B.V.",
      "contact":"info@nivogroepholland.nl", "user":None, "csrf":"0"*64
    })
    page.route("**/api/next/?action=bootstrap", lambda route: route.fulfill(
        status=200, content_type="application/json", body=portal_bootstrap))
    page.goto(base + "/advies/", wait_until="networkidle")
    form = page.locator("#portal-advice-form")
    form.wait_for(state="visible")
    check(form.locator('input[name="contactRequested"][required]').count()==1 and
          not form.locator('input[name="contactRequested"]').is_checked(),
          "NIVO direct advice requires one unchecked request-only contact permission")
    for key in ("topic","timeline","name","email","channel","phone","street","houseNumber","postalCode","city","note"):
        check(form.locator(f'[name="{key}"]').count()==1,
              "NIVO direct advice field "+key+" is present")
    for key in ("name","email","phone","street","houseNumber","postalCode","city"):
        check(form.locator(f'[name="{key}"][required]').count()==1,
              "NIVO lead identification is required: "+key)
    check(page.locator('a[href="/privacy/"]').count()>0,
          "NIVO advice links to privacy disclosure")
    check("NIVO Groep Holland B.V." in page.locator("#advice-app").inner_text(),
          "NIVO controller is named")
    check(form.locator('input[name="website"]').count()==1 and
          form.locator('input[name="website"]').is_hidden(),
          "a non-intrusive spam trap is hidden from real visitors")
    check(page.locator('#portal-code-form').count()==0 and
          'verificatiecode' in page.locator("#advice-app").inner_text().lower(),
          "advice is one step and explicitly needs no verification code")
    for width,height in ((1440,900),(390,844),(320,740)):
        page.set_viewport_size({"width":width,"height":height})
        page.wait_for_timeout(80)
        values=page.evaluate("""() => ({
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            submitVisible: (()=>{const b=document.querySelector('#portal-advice-form [type=submit]');return !!(b && b.getBoundingClientRect().width>0)})(),
            formBottom: Math.ceil(document.querySelector('#portal-advice-form').getBoundingClientRect().bottom)
        })""")
        REPORT["screens"].append({"route":"/advies/","state":"nivo-portal",**values})
        check(values["scrollWidth"]<=width and values["submitVisible"],
              f"NIVO Portal advice form fits {width}px without horizontal scrolling",values)
        if width==1440:
            check(values["formBottom"]<=height-8,
                  "desktop 1440x900 direct lead form fits within one screen",values)
        if width in (1440,390):
            page.screenshot(path=OUT/f"portal-advice-{width}.png",full_page=True)
    check(all(item["method"]=="GET" and item["local"] for item in portal_requests),
          "opening NIVO Portal advice form makes no POST or external request")
    context.close()

    # First PDF/ZIP requests: real UI, real files, no dependency mocks.
    context, requests = context_for("lazy-exports")
    page = context.new_page()
    page.goto(base + "/", wait_until="networkidle")
    check(not vendor_counts(requests), "initial homepage requests none of the four export vendors")
    page.locator('.hero-actions [data-action="start"]').click()
    edit_name(page, "Synthetische Browser Test")
    overview(page)
    project = json.loads(save_download(page, "download-project", "guest-project.json").read_text())
    check(project["state"]["applicantName"] == "Synthetische Browser Test" and project["demo"] is False,
          "project JSON preserves synthetic input")
    with page.expect_popup() as popup_event:
        page.locator('[data-action="print"]').click()
    popup = popup_event.value
    popup.get_by_text("Synthetische Browser Test", exact=False).first.wait_for()
    wait_for_page_state(popup, "() => window.__printCalled === true", "print callback")
    check(popup.locator("h1").inner_text() == "Mijn warmtepompdossier", "print opens the real dossier HTML")
    popup.close()
    check(not vendor_counts(requests), "editing, project JSON and printing request no export vendors")
    pdf_path = save_download(page, "download-pdf", "first-pdf.pdf")
    info = pdf_info(page, pdf_path.read_bytes())
    check(info["pages"] > 0 and "documentenoverzicht" in info["title"], "first PDF parses as a document")
    check(vendor_counts(requests) == Counter({path: 1 for path in PDF_VENDORS}),
          "first PDF requests only the three PDF dependencies once", dict(vendor_counts(requests)))
    zip_path = save_download(page, "download-zip", "first-dossier.zip")
    with zipfile.ZipFile(zip_path) as archive:
        check(archive.testzip() is None, "dossier ZIP passes CRC integrity")
        check(json.loads(archive.read("03-SubsidieReady-project.json"))["state"]["applicantName"] == "Synthetische Browser Test",
              "ZIP contains the matching project state")
        check(b"Synthetische Browser Test" in archive.read("02-Documentenoverzicht.html"),
              "ZIP contains the matching HTML overview")
    save_download(page, "download-zip", "repeat-dossier.zip")
    check(vendor_counts(requests) == Counter({path: 1 for path in VENDORS.values()}),
          "ZIP adds only JSZip and repeat exports reuse all four dependencies", dict(vendor_counts(requests)))
    context.close()

    # Direct demo navigation must await its dependencies and keep fictional labels.
    context, requests = context_for("direct-demo")
    page = context.new_page()
    page.goto(base + "/#voorbeeld", wait_until="load")
    page.locator(".demo-banner").wait_for(timeout=30000)
    check("fictief" in page.locator(".demo-banner").inner_text().lower(), "direct demo remains visibly fictional")
    check(vendor_counts(requests) == Counter({path: 1 for path in PDF_VENDORS}),
          "direct demo loads its actual PDF dependencies without JSZip")
    demo_zip = save_download(page, "download-zip", "demo-dossier.zip")
    with zipfile.ZipFile(demo_zip) as archive:
        check(archive.testzip() is None, "demo ZIP passes CRC integrity")
        project = json.loads(archive.read("03-SubsidieReady-project.json"))
        manifest = json.loads(archive.read("04-Bestandenindex.json"))
        check(project["demo"] is True and manifest["demo"] is True, "demo flags survive both JSON exports")
        check("FICTIEVE GEGEVENS" in archive.read("LEESMIJ.txt").decode() and
              "NIET INDIENEN" in archive.read("02-Documentenoverzicht.html").decode(),
              "demo README and HTML explicitly forbid real submission")
        for name in ["01-Documentenoverzicht.pdf"] + [item["archivePath"] for item in manifest["files"]]:
            info = pdf_info(page, archive.read(name))
            check(info["pages"] > 0 and "VOORBEELD" in info["title"], name + " retains its PDF demo title")
    context.close()

    # Simulated single dependency failure: keep the entered dossier and retry safely.
    context, requests = context_for("dependency-retry")
    page = context.new_page()
    pattern = "**" + VENDORS["font"]
    page.route(pattern, lambda route: route.abort("failed"))
    page.goto(base + "/#dossier", wait_until="networkidle")
    edit_name(page, "Bewaar Mijn Testgegevens")
    overview(page)
    downloads = []
    page.on("download", lambda download: downloads.append(download.suggested_filename))
    page.locator('[data-action="download-pdf"]').click()
    page.locator("#toast").filter(has_text="Je gegevens blijven behouden").wait_for(state="visible")
    wait_for_page_state(page, "() => !!window.PDFLib && !!window.SK_FONT_BASE64",
                        "remaining PDF dependencies after the intentionally failed font")
    check(not downloads, "failed dependency produces no broken download")
    REPORT["expectedFailures"].append({"scenario": "dependency-retry", "path": VENDORS["font"], "kind": "one intentional network abort"})
    page.locator('[data-action="step"][data-step="1"]').click()
    check(page.locator('[data-field="applicantName"]').input_value() == "Bewaar Mijn Testgegevens",
          "input remains available after a dependency failure")
    page.unroute(pattern)
    overview(page)
    retry_pdf = save_download(page, "download-pdf", "retry-pdf.pdf")
    check(pdf_info(page, retry_pdf.read_bytes())["pages"] > 0, "retry creates a readable PDF")
    expected = Counter({path: 1 for path in PDF_VENDORS})
    expected[VENDORS["font"]] = 2
    check(vendor_counts(requests) == expected, "retry fetches only the failed dependency again", dict(vendor_counts(requests)))
    check(json.loads(save_download(page, "download-project", "retry-project.json").read_text())["state"]["applicantName"] == "Bewaar Mijn Testgegevens",
          "successful retry preserves the entered dossier")
    context.close()

    # Hold the first PDF response while editing state/files: export uses the click-time snapshot.
    context, requests = context_for("snapshot-during-load")
    page = context.new_page()
    held = []
    page.route("**" + VENDORS["pdf"], lambda route: held.append(route))
    page.goto(base + "/#dossier", wait_until="networkidle")
    edit_name(page, "Snapshot Voor")
    page.locator('[data-action="step"][data-step="2"]').click()
    original_bytes = pdf_path.read_bytes()
    page.locator('[data-upload="invoice"]').set_input_files({"name": "voor.pdf", "mimeType": "application/pdf", "buffer": original_bytes})
    page.locator('.file-name[title="voor.pdf"]').wait_for()
    overview(page)
    page.locator('[data-action="download-zip"]').click()
    deadline = time.monotonic() + 5
    while not held and time.monotonic() < deadline:
        page.wait_for_timeout(20)
    check(len(held) == 1, "snapshot test holds the first PDF vendor response")
    edit_name(page, "Snapshot Na")
    page.locator('[data-action="step"][data-step="2"]').click()
    page.locator('[data-action="remove-file"]').first.click()
    page.locator('[data-upload="invoice"]').set_input_files({"name": "na.pdf", "mimeType": "application/pdf", "buffer": original_bytes})
    page.locator('.file-name[title="na.pdf"]').wait_for()
    with page.expect_download(timeout=30000) as download:
        held[0].continue_()
    snapshot_zip = OUT / "snapshot-dossier.zip"
    download.value.save_as(snapshot_zip)
    with zipfile.ZipFile(snapshot_zip) as archive:
        check(archive.testzip() is None, "snapshot ZIP passes CRC integrity")
        project = json.loads(archive.read("03-SubsidieReady-project.json"))
        manifest = json.loads(archive.read("04-Bestandenindex.json"))
        check(project["state"]["applicantName"] == "Snapshot Voor", "pending export keeps click-time input")
        check([item["originalName"] for item in manifest["files"]] == ["voor.pdf"],
              "pending export keeps click-time attachment descriptors")
        check(archive.read(manifest["files"][0]["archivePath"]) == original_bytes,
              "pending export preserves exact original attachment bytes")
        html = archive.read("02-Documentenoverzicht.html").decode()
        check("Snapshot Voor" in html and "Snapshot Na" not in html, "HTML overview matches the snapshot JSON")
    overview(page)
    after = json.loads(save_download(page, "download-project", "after-snapshot-project.json").read_text())
    check(after["state"]["applicantName"] == "Snapshot Na", "editing during export remains in the current session")
    context.close()

    check(not REPORT["errors"], "all browser scenarios have no uncaught page errors", REPORT["errors"])
    check(not REPORT["cspViolations"], "all browser scenarios honor the actual CSP", REPORT["cspViolations"])
    check(all(item["local"] for item in REPORT["requests"]), "no external request leaves the browser test")
    check(all(item["method"] == "GET" for item in REPORT["requests"]), "guest work and exports issue no POST or analytics events")
    check(not any(item["path"] == "/api/event.php" for item in REPORT["requests"]), "analytics remain disabled")
    REPORT["ok"] = True


server = log = None
try:
    server, log, base = start_server()
    with sync_playwright() as playwright:
        launch = {"headless": True}
        if os.getenv("SR_CHROMIUM"):
            launch["executable_path"] = os.environ["SR_CHROMIUM"]
        with playwright.chromium.launch(**launch) as browser:
            run(browser, base)
except Exception as error:
    REPORT["failure"] = str(error)
    raise
finally:
    if server:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait(timeout=5)
    if log:
        log.close()
    REPORT["summary"] = {"checks": len(REPORT["checks"]), "screens": len(REPORT["screens"]),
                         "requests": len(REPORT["requests"]), "errors": len(REPORT["errors"]),
                         "cspViolations": len(REPORT["cspViolations"])}
    (OUT / "report.json").write_text(json.dumps(REPORT, indent=2))
    print(json.dumps({"ok": REPORT["ok"], **REPORT["summary"]}), flush=True)
