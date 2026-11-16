#!/usr/bin/env python3
"""Production Chromium smoke test: no account creation, mail, form POST or customer data.

Clicks only synthetic, browser-local guest tools and inspects the optional
registration dialog. OTP, real auth and cross-browser persistence need owner QA.
"""
from pathlib import Path
from urllib.parse import urlsplit
import json
import tempfile
import zipfile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
REPORT_DIR = ROOT / "qa" / "live-account-browser"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
ORIGIN = "https://subsidieready.nl"
report = {
    "scope": "Public Chromium, synthetic guest-only actions, no form submission or OTP",
    "account_e2e": "not_tested",
    "checks": [],
    "request_policy": {"non_get_count": 0, "off_site_count": 0},
    "result": "failed"
}
stage = "start"


def verified(name):
    report["checks"].append(name)


try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            accept_downloads=True,
            locale="nl-NL",
            timezone_id="Europe/Amsterdam"
        )
        page = context.new_page()
        network = []

        def record(request):
            parsed = urlsplit(request.url)
            network.append((request.method, parsed.scheme, parsed.netloc))

        page.on("request", record)
        # The site's opt-in fictional demo may ask for confirmation before
        # replacing the current local draft. Only synthetic QA data is used.
        page.on("dialog", lambda dialog: dialog.accept())

        stage = "production_plan_page"
        response = page.goto(ORIGIN + "/mijn-plan/", wait_until="domcontentloaded", timeout=30000)
        assert response and response.status == 200
        login = page.locator('[data-pa="login"]')
        login.wait_for(state="visible", timeout=20000)
        verified("Live account login button visibly rendered in Chromium")

        stage = "marketing_consent_default"
        login.click()
        terms = page.locator('#login-form input[name="terms"]')
        assert terms.count() == 1
        assert terms.get_attribute("required") is not None
        assert not terms.is_checked()
        # PR runs probe currently deployed production (which may still use the
        # legacy checkbox). New radio cards are verified after deployment.
        updates_none = page.locator('#login-form input[name="updates"][value="none"]')
        if updates_none.count():
            assert updates_none.is_checked()
            assert not page.locator('#login-form input[name="updates"][value="email"]').is_checked()
            assert page.locator('#login-form input[name="updates"]').count() == 2
            for key in ("fullName", "phone", "street", "houseNumber", "postalCode", "city"):
                assert page.locator(f'#login-form input[name="{key}"]').count() == 1
            assert page.locator('#login-form input[type="checkbox"]').count() == 1
        else:
            marketing = page.locator('#login-form input[name="marketingEmail"]')
            assert marketing.count() == 1
            assert not marketing.is_checked()
            assert marketing.get_attribute("required") is None
        assert "NIVO Groep Holland B.V." in page.locator("#plan-dialog").inner_text()
        assert page.locator('#login-form a[href="/voorwaarden/"]').count() == 1
        assert page.locator('#login-form a[href="/privacy/"]').count() == 1
        verified("Registration dialog: required terms, separate unchecked marketing consent")
        page.screenshot(path=str(REPORT_DIR / "account-dialog-empty.png"))
        page.locator('#plan-dialog [data-pa="close"]').click()

        stage = "synthetic_guest_plan"
        page.locator('[data-pa="new"]').first.click()
        page.locator('#new-form [name="title"]').fill("QA fictieve woning")
        page.locator('#new-form input[name="types"][value="isolatie"]').check()
        page.locator('#new-form button[type="submit"]').click()
        assert "QA fictieve woning" in page.locator(".p-content").inner_text()
        verified("Synthetic guest plan created without registration or cloud save")

        with tempfile.TemporaryDirectory() as temp:
            tmp = Path(temp)

            stage = "guest_json"
            with page.expect_download(timeout=30000) as dl:
                page.locator('[data-pa="export"]').click()
            download = dl.value
            download.save_as(str(tmp / "plan.json"))
            envelope = json.loads((tmp / "plan.json").read_text(encoding="utf-8"))
            assert envelope["app"] == "SubsidieReadyPlan"
            assert envelope["projects"][0]["title"] == "QA fictieve woning"
            verified("Guest plan JSON export downloads usable synthetic project")

            stage = "guest_zip"
            with page.expect_download(timeout=45000) as dl:
                page.locator('[data-pa="zip"]').click()
            dl.value.save_as(str(tmp / "plan.zip"))
            with zipfile.ZipFile(tmp / "plan.zip") as z:
                assert z.testzip() is None
                assert "plan.json" in z.namelist()
            verified("Guest plan ZIP integrity and expected plan.json")

            # Open a separate tab so a guest draft's beforeunload prompt cannot
            # interfere with the unrelated warmtepomp export acceptance. Its
            # public #dossier route initializes the real workbench directly.
            stage = "workbench_new_tab"
            page = context.new_page()
            page.on("request", record)
            page.on("dialog", lambda dialog: dialog.accept())
            response = page.goto(ORIGIN + "/#dossier", wait_until="load", timeout=30000)
            assert response and response.status == 200
            stage = "workbench_loaded"
            page.locator('[data-action="step"][data-step="3"]:visible').wait_for(timeout=20000)
            stage = "home_step_three"
            page.locator('[data-action="step"][data-step="3"]:visible').first.click(timeout=15000)
            stage = "home_pdf_button"
            assert page.locator('[data-action="download-pdf"]:visible').count() > 0
            stage = "home_pdf_download"
            with page.expect_download(timeout=60000) as dl:
                page.locator('[data-action="download-pdf"]:visible').first.click()
            dl.value.save_as(str(tmp / "warmtepomp.pdf"))
            assert (tmp / "warmtepomp.pdf").read_bytes().startswith(b"%PDF")
            verified("Original free warmtepomp workspace PDF export is valid")

            stage = "home_guest_zip"
            with page.expect_download(timeout=60000) as dl:
                page.locator('[data-action="download-zip"]').first.click()
            dl.value.save_as(str(tmp / "warmtepomp.zip"))
            with zipfile.ZipFile(tmp / "warmtepomp.zip") as z:
                assert z.testzip() is None
            verified("Original free warmtepomp workspace ZIP downloads intact")

        # No user-generated requests. The allowed bootstrap is a GET that starts
        # an anonymous session and returns no customer data.
        stage = "network_privacy"
        report["request_policy"] = {
            "non_get_count": sum(method != "GET" for method, _, _ in network),
            "off_site_count": sum(
                scheme in ("http", "https") and host != "subsidieready.nl"
                for _, scheme, host in network
            )
        }
        assert report["request_policy"]["non_get_count"] == 0
        assert report["request_policy"]["off_site_count"] == 0
        verified("All browsing requests are first-party GET; no sales or marketing POST")

        context.close()
        browser.close()
        report["result"] = "passed"
except Exception as exc:
    # Only the exception class, not its message (which could contain a URL/token).
    report["failed_stage"] = stage
    report["failure_kind"] = type(exc).__name__
finally:
    (REPORT_DIR / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "result": report["result"],
        "checks_passed": len(report["checks"]),
        "failed_stage": report.get("failed_stage"),
        "account_e2e": report["account_e2e"],
        "request_policy": report["request_policy"],
    }))
if report["result"] != "passed":
    raise SystemExit(1)
