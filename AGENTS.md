> **PRODUCTBESLUIT / AGENTINSTRUCTIE V16-11-2026 — VERPLICHT EERST LEZEN**
>
> [docs/AGENT-START-HERE-2026-11-16.md](docs/AGENT-START-HERE-2026-11-16.md) is voortaan de enige **canonieke ingang** voor nieuwe agents. Lees in volgorde de gelinkte [productstrategie](docs/PRODUCT-STRATEGY-2026-11-16.md), [gebruikersreizen](docs/JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md), [roadmap met releasegates](docs/DELIVERY-ROADMAP-2026-11-16.md), [SEO-/KPI-/vertrouwensregels](docs/METRICS-SEO-TRUST-2026-11-16.md) en [beslisregister](docs/DECISION-REGISTER-2026-11-16.md). Bestaande oudere handoffs hieronder zijn **historisch** en zijn niet meer leidend waar ze met het latere eigenaarbesluit of de actuele code botsen.
>
> **Geen productherbouw.** Gratis kernfuncties en PDF/ZIP blijven zonder account; optioneel gratis account wordt een persoonlijke verduurzamingsassistent; NIVO biedt alleen op zelfstandig verzoek passend installatieadvies. Geen account→lead, geen automatische dossier-/fiscale data naar sales, geen advertenties/aanmeldmuur/pop-ups, geen onbevestigde subsidies. Huidig V2-adviesformulier naar `portal@nivogroepholland.nl` blijft intact, net als account-OTP; alleen één echte Portal-mailontvangst is bewezen. Echte account-E2E, GSC-baseline, geautomatiseerde Portal-opvolging en conversies staan OPEN. Geen vault/leads/staff/trackingactivatie zonder eigen gate.
>
> **Deze 16-november-opdracht is 100% documentatie en strategische richting. Niets implementeren of liveconfig aanpassen totdat een toekomstige gebruikersopdracht een afgebakende roadmap-slice autoriseert.** Alle bestaande engineering-, security-, bron-, release- en privacyregels blijven gelden. Actuele `main`, CI en live HTTP zijn altijd de technische feitenbron.

---

# SubsidieReady engineering notes

> **NIEUWE CANONIEKE AGENTOVERDRACHT (15-11-2026):** lees eerst [docs/HANDOFF-NIVO-LEADGEN-2026-11-15.md](docs/HANDOFF-NIVO-LEADGEN-2026-11-15.md) en [docs/STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md](docs/STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md). De oudere 14-november-instructies en hieronder genoemde cloud-API-503-status zijn op onderdelen **achterhaald**: NIVO is nu de vastgelegde exploitant, database en SMTP zijn geconfigureerd, echte SMTP-testmail is aangekomen, Hostinger-cron is ingesteld, en de productieaccountflags zijn door eigenaar ingeschakeld en met `--check` gecontroleerd. **Een echte OTP-/registratie-/cross-browser-plannenaccounttest is NOG NIET uitgevoerd.** Vault/leads/staff blijven uit; consent, privacy, gratis gastflow en geen automatische cross-B.V.-deling zijn harde grenzen. Code-first via geteste GitHub-PR's, main → Hostinger; geen extra kosten of onnodige staging.

> **CANONIEKE AFSLUITING / NEXT AGENT (14 november 2026):** premium website breed op productie, commit `e1ab8f8d0d0632bb3cca03bcebf8456c0e82f19c`, builds `a95e1539d1244098` en `6377d2731227bf88`, 160 regressietests + 83/83 livechecks. De eerdere aanwijzing `niet mergen voor testrelease` is HISTORISCH; PR #18/#19/#20 zijn bewust al gemerged. Volgende doel = SEO en gecontroleerde vrijwillige eigen leads. Begin bij [docs/HANDOFF-SEO-LEADGEN-2026-11-14.md](docs/HANDOFF-SEO-LEADGEN-2026-11-14.md), [docs/NEXT-AGENT-SEO-LEAD-START.md](docs/NEXT-AGENT-SEO-LEAD-START.md) en Issue #21. Account-/cloud-/leadbackend blijft op productie uit (503) en mag niet zomaar worden aangezet. Dit is een documentatiecheckpoint; nieuwe HEAD kan veranderen terwijl dezelfde functionele build wordt behouden.


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

## Approved sitewide design rollout (14 November 2026)
- Owner approved the premium dashboard and asked to extend the same style to **all other pages immediately**. Work through a reviewed branch/PR; publish after quality/release checks and then verify the real domain.
- `assets/site-theme.css` is the shared visual layer; `scripts/site-design.cjs` owns editorial heroes, navigation state, contents and sidebar styling markup. Preserve the approved dashboard-specific CSS and behaviour.
- All actual content/eligibility rules, privacy settings, account/sales gates, document data and exports are unchanged. Admin's only PHP-file change is an additional local stylesheet link.
- Keep the existing public/noindex boundaries. The new preparation help pages remain noindex; knowledge-bank links expose their existence without claiming they are full eligibility modules.
- Build generators, offline image inlining, packaging and exact live verification must include the shared layer and the redesigned pages. See `docs/SITEWIDE-DESIGN-RELEASE.md` and `tests/site-theme.test.cjs`.
