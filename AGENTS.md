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
