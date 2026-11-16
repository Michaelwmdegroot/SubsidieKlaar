#!/usr/bin/env python3
"""Read-only TBT advice target preflight. No account, submission, PII or tracking."""
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"qa"/"tbt-target"
OUT.mkdir(parents=True,exist_ok=True)
URL="https://thuisbatterijteam.nl/contact/adviesgesprek/"
TRACKING=(
    "facebook.com","facebook.net","google-analytics.com",
    "googletagmanager.com","googleadservices.com",
    "doubleclick.net","googlesyndication.com",
    "analytics.google.com","tiktok.com","bat.bing.com"
)
report={
  "scope":"Read-only remote form, first-visit consent network and fixed recipient; no POST to form",
  "target":"thuisbatterijteam.nl",
  "formValid":False,"privacyCopyVisible":False,
  "consentChoiceVisible":False,"denyAttempted":False,"consentDefaultDenied":False,"externalMeasurementReview":False,
  "trackingBeforeDecision":[],
  "trackingAfterDeny":[],
  "submittedLeadRequests":0,
  "result":"no_go",
}
stage="start"
def tracking_host(host):
    return any(host==d or host.endswith("."+d) for d in TRACKING)

try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True)
        context=browser.new_context(locale="nl-NL",timezone_id="Europe/Amsterdam",viewport={"width":390,"height":844})
        page=context.new_page()
        seen=[]
        def on_request(req):
            u=urlsplit(req.url)
            host=u.hostname or ""
            submit=(req.method!="GET" and
                    (u.path.endswith("/admin-post.php") or "/tbt-leads/v1/submissions" in u.path))
            seen.append({"host":host,"tracking":tracking_host(host),"submit":submit})
        page.on("request",on_request)
        stage="navigate"
        res=page.goto(URL,wait_until="domcontentloaded",timeout=35000)
        assert res and res.status==200
        stage="form"
        page.wait_for_timeout(1200)
        # Safe non-identifying diagnostics: only counts and visibility flags.
        report["httpStatus"]=res.status
        report["formsSeen"]=page.locator("form").count()
        report["targetFormsSeen"]=page.locator("form.tbt-conversion__form").count()
        report["simpleFormsSeen"]=page.locator("form.tbt-leads-simple-contact").count()
        form=page.locator("form.tbt-conversion__form").first
        report["targetFormVisible"]=bool(form.count() and form.is_visible())
        form.wait_for(state="attached",timeout=12000)
        action=form.get_attribute("action") or ""
        action_parts=urlsplit(action)
        required=(
          action_parts.scheme=="https" and action_parts.hostname=="thuisbatterijteam.nl" and
          action_parts.path=="/wp-admin/admin-post.php" and
          form.locator('input[name="action"][value="tbt_lead_submit"]').count()==1 and
          form.locator('input[name="lead_type"][value="adviesgesprek"]').count()==1 and
          form.locator('input[name="phone"][required]').count()==1 and
          form.locator('input[name="name"][required]').count()==1 and
          form.locator('button[type="submit"]').count()==1)
        report["formValid"]=bool(required)
        report["privacyCopyVisible"]=bool(
            page.locator(".tbt-conversion__privacy").first.is_visible()
            and "alleen" in page.locator(".tbt-conversion__privacy").first.inner_text().lower())
        stage="consent_first_visit"
        page.wait_for_timeout(1800)
        report["consentDefaultDenied"]=bool(page.evaluate("""() =>
          [...(window.dataLayer || [])].some(entry => entry &&
            entry[0] === 'consent' && entry[1] === 'default' &&
            entry[2] && entry[2].analytics_storage === 'denied' &&
            entry[2].ad_storage === 'denied' &&
            entry[2].ad_user_data === 'denied' &&
            entry[2].ad_personalization === 'denied')"""))
        before={r["host"] for r in seen if r["tracking"]}
        report["trackingBeforeDecision"]=sorted(before)
        denied=page.locator(".cmplz-cookiebanner:not(.cmplz-hidden) .cmplz-deny")
        if denied.count() and denied.first.is_visible():
            report["consentChoiceVisible"]=True
            stage="deny"
            denied.first.click(timeout=10000)
            report["denyAttempted"]=True
            page.wait_for_timeout(500)
        report["trackingAfterDeny"]=sorted({r["host"] for r in seen if r["tracking"]})
        report["submittedLeadRequests"]=sum(1 for r in seen if r["submit"])
        # Denied-default Consent Mode may send cookieless pings. Record these
        # third-party hosts for a separate owner privacy audit; this probe
        # cannot certify payloads or cookie lawfulness.
        report["externalMeasurementReview"]=bool(report["trackingBeforeDecision"] or report["trackingAfterDeny"])
        report["result"]="pass" if all([
            report["formValid"], report["privacyCopyVisible"],
            report["consentDefaultDenied"], report["consentChoiceVisible"],
            report["denyAttempted"], report["submittedLeadRequests"]==0
        ]) else "no_go"
        context.close()
        browser.close()
except Exception as exc:
    report["failureStage"]=stage
    report["failureType"]=type(exc).__name__
finally:
    (OUT/"report.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps({k:report.get(k) for k in
        ("result","failureStage","failureType","formValid","privacyCopyVisible","consentChoiceVisible","denyAttempted",
         "consentDefaultDenied","externalMeasurementReview","trackingBeforeDecision","trackingAfterDeny","submittedLeadRequests","httpStatus","formsSeen","targetFormsSeen","simpleFormsSeen","targetFormVisible")},ensure_ascii=False))
if report["result"]!="pass":
    raise SystemExit(1)
