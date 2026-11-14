# SubsidieReady engineering notes

- The owner approved the concept and bought **SubsidieReady.nl** on 14 November 2026. Working-name phase is over. Keep the existing repository `Michaelwmdegroot/SubsidieKlaar`.
- Target: existing Hostinger PHP/HTML hosting, root of `main`, no paid dependencies or additional hosting purchases. Do not claim live status until domain/HTTPS/production checks actually succeed.
- The public site is indexable for `https://subsidieready.nl/`. Admin/API/internal paths and standalone distribution are not indexable. Never add private dossiers to URLs, sitemap or analytics.
- The complete individual tool stays free, without signup. Documents and dossier data stay browser-local. No remote AI, OCR, uploads or automatic DigiD submission.
- Read `docs/RVO-sources.md` before changing rules. Presence/confirmation is not eligibility. Missing meldcode has a technical-documentation route; photo absence alone is not a mandatory failure.
- Preserve legacy SubsidieKlaar JSON imports and explicit fictitious-demo markings. Original bytes stay unchanged. Async exports snapshot state and file descriptors before awaiting PDF work.
- The former public local-analytics dashboard is removed. `/admin/` is PHP and fails closed until configured. Do not publish temporary QA credentials.
- Optional analytics: default off; explicit user opt-in; respect GPC/DNT; send only one enumerated event field. Demo events are excluded. Counts are events, never unique people or guaranteed conversions.
- Config, password hashes, rate limits, sessions and aggregate counts must remain outside the document root. No publicly reachable setup script. Do not deploy test environment flags.
- `scripts/build-site.cjs` and `templates/index.html` generate public HTML, headers, sitemap and version. Modify the generator rather than hand-editing generated pages.
- After changes: `npm run build`, `npm test`, `npm run package`. PHP must be present for the backend tests. Inspect generated diffs and keep the portable HTML synchronized.
- Never expose `.git`, `.env`, source tests, templates or configuration through the Node preview or public server. Retain .htaccess on Hostinger.
- Preserve bundled third-party notices. No global application licence is implied by dependency licences.
- Read `docs/HOSTINGER-LIVE.md`, `docs/DEVELOPMENT-HANDOFF.md` and `docs/QA-v1.md`. Live hosting and admin activation remain separate verifiable operations.

## Approved public integration (14 November 2026)
- The owner approved integrating PR #13 and publishing it to `main`. The public routes are `/regelingen/`, `/subsidies/`, `/btw/`, `/financiering/` alongside the existing warmtepomp workspace `/#dossier`.
- Read `docs/REGELINGEN-LIVE-INTEGRATION.md`. The preview-era draft-only instruction in older notes is historical, not a prohibition on this explicitly authorized integration.
- `scripts/regelingen-engine.cjs` is the single source for the browser engine. `build-site.cjs` generates `assets/regelingen-engine.js`; never let it diverge.
- Preserve subsidy/VAT/loan distinctions, incomplete local coverage, date/source warnings, unknown answers and guest document export. No loan or money-total recommendations.
- Regelingen answers stay in the page; no storage, URL parameters, CRM or telemetry. Accounts/uploads/first-party leads in PR #11 remain separate and inactive.
- New public pages/assets must stay in packaging, sitemap and exact live acceptance. Update generators rather than generated HTML.

## Next-level testrelease — owner instruction (14 November 2026)
- The owner explicitly wants to test the whole integrated next-level experience BEFORE any new merge to main. Work on `feat/nextlevel-testrelease`; do not merge or switch Hostinger's live branch.
- Read `docs/next/TESTEN.md`, `docs/next/SECURITY.md`, `docs/next/STAGING.md` and `docs/next/RELEASE-STATUS.md`. This is beta functionality, not an activated production account platform.
- New online API requires private configuration outside every webroot; only loopback/staging accepted. No real messages, leads, credentials, new subscriptions or cloud data are authorized by merely opening the preview.
- Preserve the free local guest flow. One-time scanner handoff requires an explicit click. Online account/plan/file choices remain separate; account != sales permission.
- The beta uses encrypted single-host file storage, NOT SQL. Do not hide the capacity/locking/production-readiness limits. SMTP delivery, malware infrastructure, legal controller, retention, staff MFA and real hosting restore remain go/no-go decisions.
- Build generators remain authoritative: `npm run build`, `npm test`, `npm run package`, `npm run preview:next`. Do not hand-edit generated HTML. `next-version.json` is the beta build, separate from existing `version.json`.
- Keep local files, financial/eligibility answers and dossier contents out of sales. Recipients/staff only come from approved private configuration. Fictitious demo must stay labelled and never become an actual lead.
- Source monitor is manual CLI and never publishes content. No background schedule is activated. Checklists show preparation, not official approval; dates/source expiry remain visible.

## Nieuwe expliciete publicatieopdracht — 14 november 2026
- De eigenaar heeft na de aparte testrelease gevraagd de complete **testervaring** op de bestaande live website te beoordelen door deze branch naar `main` te brengen. De hierboven genoemde oude `do not merge` grens is voor het publiceren van de **lokaal werkende, duidelijk gemarkeerde proefpagina's** vervangen door dit besluit.
- Dat is **geen** toestemming om echte accounts, online dossiers, documentenkluis, mailverificatie, reminders of advies/leadbackend te activeren. `SR_NEXT_CONFIG` blijft absent; de beta API weigert bovendien de echte `subsidieready.nl`-origin.
- `/mijn-plan/`, `/advies/`, `/sales/` en `/bronbeheer/` zijn noindex proefpagina's. Op de live website kan de gebruiker de lokale planner en de fictieve salesdemo beoordelen, niet een echte cloudaccount of verkoopintake.
- De bestaande gratis gasttool en documentdownloads blijven beschikbaar, bron-/financieringsclaims ongewijzigd. `scripts/check-live.cjs` moet niet alleen de exacte versie en proefpagina's maar ook een **503** voor de ongeconfigureerde nieuwe API bevestigen.
- Productieaccounts en echte leads vragen afzonderlijke eigenaarstoestemming na Hostinger persistence/mail/malwarecontrole, juridische verwerkingsverantwoordelijke, bewaartermijnen, rollen/MFA en hersteltest.

## Approved premium dashboard publication (14 November 2026)
- Owner approved the image-led concept and generated assets and explicitly asked to build it on the website. Complete PR #19's premium dashboard implementation and publish only after quality/release checks. The earlier draft-only review boundary for that UI is superseded by this request.
- Read `docs/PREMIUM-DASHBOARD-RELEASE.md`. Keep sources, rates, loan boundaries, privacy and backend gates unchanged. No example money/guarantees from the mockup; real route counts only.
- Generated optimized visuals are local assets with byte/hash provenance in `docs/DASHBOARD-ASSETS.json`. Important UI remains HTML, decorative imagery has empty alt text, no external fonts or APIs introduced.
- Test narrow/short viewports and keyboard. Header must not squeeze CTA labels. Internal panel scroll is intentional; desktop workspace and action bar remain within viewport.
- No production account/lead activation or storage migration is part of this visual deployment.
