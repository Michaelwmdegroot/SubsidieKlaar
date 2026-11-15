# CANONIEKE FASEOVERDRACHT — SubsidieReady → NIVO first-party leadmachine

**Snapshot:** 15 november 2026 (Europe/Amsterdam). **Deze overdracht vervangt de statusclaims van 14 november in `docs/HANDOFF-SEO-LEADGEN-2026-11-14.md`, `docs/NEXT-AGENT-SEO-LEAD-START.md` en de historische introducties in `README.md` / `AGENTS.md`.** Die documenten blijven relevant voor ontwerp, uitgangspunten en bewijs van eerdere fasen, maar beschrijven deels de oude fail-closed accounttoestand. Lees dit document **eerst**. Controleer altijd actuele `main` en de live situatie.

**Bedrijfsmissie:** SubsidieReady.nl is een gratis, betrouwbare en premium verduurzamings-/subsidietool voor consumenten, die vanuit inhoud en interactieve tools relevante, uitdrukkelijk aangevraagde en aantoonbaar gekwalificeerde **first-party adviesleads voor NIVO Groep Holland B.V. en vooraf goedgekeurde eigen verkoopentiteiten** moet genereren. Geen doorverkoop aan onafhankelijke installatiepartners; geen account-naar-lead-truc.

**Voorgaande code-HEAD:** `fb9450f6cf001b175a68b10a7c625ff5a1d6afe3`, squash-merge van SMTP PR #27. Een documentatie-merge bovenop deze snapshot wijzigt de GitHub-SHA maar niet de websitecode. Productiebranch `main` → bestaande Hostinger-autodeploy, zonder nieuwe betaalde diensten of nieuwe infrastructuur. Repositorynaam blijft `Michaelwmdegroot/SubsidieKlaar`; domein: https://subsidieready.nl/.

## 1. Hard bewijs vs. nog te bewijzen

### Door broncode/GitHub gecontroleerd
- `main` bevat premium sitebreed wit/navy/groen design, één-scherm regelingen-dashboard, brede maar **informatieve** regelingencheck, volledige gratis warmtepompdocumentencheck met PDF/ZIP en lokale meermaatregelenplanner.
- `sitemap.xml` bevat **15** URL's die aan zoekmachines worden aangeboden. Dat is **geen** bewijs van Google-indexering. Onder meer `/hulp/zonnepanelen-btw/` en `/hulp/thuisbatterij-btw/` hebben de eerste gereviewde inhoudelijke uitbreiding. `/hulp/isolatie-checklist/`, `/hulp/lokale-regelingen/` en de proef-/privéroutes blijven `noindex`. `/voorwaarden/` is sinds PR #24 publiek.
- Technische SEO-tranche van PR #23: metadata, schema waar van toepassing, sitemap/links, verminderde initiële export-assetbelasting, responsive hero en brongecontroleerde btw-inhoud. Geen aangetoonde Search Console-, indexerings-, organisch-verkeer-, leads- of conversiebaseline.
- NIVO-productieaccountcode van PR #24: expliciet verplicht akkoord met accountvoorwaarden, **losse standaard uitgevinkte** marketing-e-mailopt-in, encryptie, SQL-opslag, OTP, account-/planfuncties en productiegates. Geen automatische commerciële toestemming of verkoopdeling.
- PR #25: `scripts/next/mysql-check.php --db-only`. PR #26: OpenSSL AES-256-GCM (SRN2) en leescompatibiliteit met legacy Sodium (SRN1 waar beschikbaar). PR #27: expliciet TLS-beveiligde SMTP-AUTH, transactionele queueworker, `scripts/next/mail-check.php`. De gewijzigde API bevat momenteel uitsluitend account+plan-activatie voor productie; `vault_enabled` / `leads_enabled` / `staff_enabled` zijn door de productiegates verplicht `false`.
- Code voor een **veilige externe eerste thuisbatterijadvies-CTA** is voorbereid in `scripts/lead-pilot.cjs` / `scripts/lead-pilot.config.json`, maar `enabled:false` en zes goedkeuringsverwijzingen staan op `null`. **Geen commerciële CTA of native productie-leadintake actief**.
- Laatste gecontroleerde code-HEAD `fb9450f`: post-merge quality-, release- en Chromium browserjobs **SUCCESS**. Vóór merge waren quality, release, MySQL 8.4, MariaDB 11.4 en Chromium **SUCCESS**. Dit is bewijs voor CI, **niet** voor een daadwerkelijke productie-accountregistratie.

### Door eigenaar op echte Hostinger-host gecontroleerd op 15 november 2026
- Productie-MariaDB/MySQL-config en tabel `sr_next_state` in de bestaande Hostinger-database bestaan; de exacte database-ID staat uitsluitend in de private serverconfiguratie. Terminal `cd public_html && php scripts/next/mysql-check.php --db-only` leverde `database_ready`, `database:connected` en `encrypted_schema:readable`.
- Echte `php scripts/next/mail-check.php --check` leverde `smtp_configured` met `implicit-tls`. `--send-test=info@subsidieready.nl` leverde `accepted_by_smtp`. Eigenaar toonde een screenshot van de **daadwerkelijk ontvangen** testmail met onderwerp "SubsidieReady SMTP-test" in de inbox. Dit bewijst één geaccepteerde/afgeleverde transactie aan het eigen adres; niet de deliverability naar andere providers.
- Hostinger cronjob **opgeslagen**: `* * * * *`, aangepaste PHP-taak `/usr/bin/php <het echte Hostinger-pad>/public_html/scripts/next/mail-worker.php --send`. Er is **nog geen bewezen echte OTP via cron**: het screenshot bewijst de geplande taak, niet de afgeronde verwerking.
- Eigenaar heeft in de bestaande private configuratie de relevante productieflags aangezet, na voorafgaande bespreking van account-/privacyvoorwaarden. Volledige `cd public_html && php scripts/next/mysql-check.php --check` leverde:
  - `status: database_ready` / `mode: production` / `database: connected` / `encrypted_schema: readable`
  - `accounts_flag: true` / `production_enabled: true` / `activation_checks: performed`
  - `vault_flag: false` / `leads_flag: false`.
- **Niet als geslaagd presenteren:** geregistreerd klantaccount, afgeleverd OTP via cron, daadwerkelijk ingelogd, opgeslagen/overgenomen plan, persistente cross-browser sync, accountexport/delete, ontvangst van een echte advieslead. Deze **eerste volledige accounttest schuift volgens uitdrukkelijk besluit van eigenaar naar de volgende agent.**
- Private secrets (`.env`, `next-config.php`, sleutel en wachtwoorden) staan op de Hostinger-host **buiten `public_html`** en zijn niet in GitHub beschikbaar; vraag gebruiker nooit om ze te plakken. Ga niet opnieuw een standaard `.env` uploaden: de bestaande combinatie heeft DB- en mailchecks reeds gehaald. Verander niet ongecontroleerd de bestaande 32-byte encryptiesleutel.

### Juridische/eigen organisatie — vastgesteld, maar onderscheid rollen bewaken
- **Exploitant/verwerkingsverantwoordelijke van SubsidieReady:** **NIVO Groep Holland B.V.**, KvK **95227768**, **Lireweg 52, 2153 PH Nieuw-Vennep**; publiek privacy- en servicecontact **info@nivogroepholland.nl**. Dit is als eigenaarbesluit verwerkt in PR #24 en publieke privacy/voorwaarden. De technische afzender van accountmail is `info@subsidieready.nl`.
- **Thuisbatterij Team B.V.** is een *voorgestelde eigen ontvangende onderneming* voor thuisbatterijadvies bij een latere vrijwillige advieskaart; **niet** dezelfde rechtspersoon als NIVO. De exacte rol, aanboddekking, wettelijke informatieplicht en cross-entity gegevensstroom van een nieuwe leadroute moeten afzonderlijk worden gevalideerd. Andere diensten/entiteiten niet automatisch aannemen.
- De eigenaar heeft de activatieflags aangezet, maar de flags vormen **geen onafhankelijke juridische toets**. Definieer en verifieer passende retentie, rechten, hosting/verwerkerrelatie en contractuele rollen voor daadwerkelijke schaal.
- Marketing-email-opt-in hoort vrijwillig, versie-/tijdstempelgestuurd en intrekbaar te blijven. Inloggen, accountaanmaak, subsidiecheck en rapportexport zijn **geen** toestemming voor commerciële e-mail, telefoon of leadrouting.

## 2. Productinventaris / status

| Werkpakket | Wat werkt / staat in code | Productieacceptatie |
| --- | --- | --- |
| Premium branding/sitebreed UX | Homepage, navigatie, design, mobiele layouts | Visuele fase door eigenaar goedgekeurd |
| Regelingencheck | `/regelingen/` met 12 brongebaseerde informatieroutes, filtering en handoff naar plan | Live als informatieve verkenner; geen definitief recht/besparingsgarantie |
| Gratis warmtepompwerkbank | `/#dossier` met import/export en PDF/ZIP, factuur/betaalbewijs/meldcode | Bestaande gratis gastflow behouden |
| Mijn Verduurzamingsplan | `/mijn-plan/`, multi-maatregelen/taken/datum en lokale projecten | Lokale UX aanwezig, cloud E2E nog NIET geaccepteerd |
| Account/online plan | SQL-code, AES-GCM, OTP, sessies, export/delete, server state | Config/productiegate GO; echte gebruikers-/cron-/crossbrowsertest OPEN |
| SMTP | TLS 465, SMTP AUTH, private `SMTP_*`, handmatige test | Handmatige testmail is bezorgd; OTP-cron en extern mailboxdomein nog OPEN |
| Operationele mailworker | Hostinger cronjob iedere minuut | Taak staat opgeslagen, runtime voor OTP nog OPEN |
| Technische SEO | Sitemap 15 URL's, schema, canonicals, interne links, 2 nieuwe artikelen | Eerste fase live; GSC/velddata/indexering onbekend |
| Bronbeheer | Handmatige CLI-bronmonitor, bronversies/reviewmomenten | Geen automatische betrouwbare bronmonitor of ongecontroleerde publicatie |
| Externe leadpilot | TBT-kaart met 6 bewijs-gates en veilige no-referrer links | **UIT**, geen geaccepteerde leads |
| Native adviesaanvragen / sales | In broncode local/staging-beta en noindex proefschermen | Productiegates **UIT**, geen eigen live leadpipeline |
| Analytics / KPI | Optionele telgebeurtenissen, bestaande PHP-admin | Niet aantoonbaar ingericht/actief; geen echte verkeers-/conversiedata |
| NIVO Portal / Odoo | Toekomstig contractconcept | Niet gekoppeld, geen aangenomen CRM-doorgifte |
| Online bijlagenkluis / staff | Test-/beta-implementatie aanwezig | Productie **UIT**; geen scanner/MFA/productieacceptatie |

Bewuste noindex: `/mijn-plan/`, `/advies/`, `/sales/`, `/bronbeheer/` en twee voorbereidingsartikelen. Niet automatisch alles indexeerbaar maken omdat de accountconfig is aangezet. Versiemetadata `next-version.json` meldt nog `3.0.0-beta.1` / `review-only` / `cloudDefault:disabled`; dit kan verouderde reviewtaal in de UI veroorzaken en moet na de eerste account-E2E gecontroleerd worden, niet blind omgezet.

## 3. De geprioriteerde resterende bouwopdracht

### P0 — volgende agent als eerste: werkelijke accountacceptatie (geen nieuwe infra)
**Doel:** van configuratie-GO naar aantoonbare gebruikerswerking. Gebruik fictieve data en een mailbox in handen van de eigenaar.

- Controleer `main`/Hostinger-deploy, `/api/next/?action=bootstrap`, `/mijn-plan/` en runtimeweergave: verschijnt `Inloggen & bewaren`? Zo niet: browser-/API-fout gericht diagnosticeren.
- Doorloop nieuwe 8-cijferige OTP: termen actief aangevinkt, **marketing standaard uitgevinkt**, mail in inbox, OTP binnen tien minuten, éénmalige geldigheid, foutcode/expired/retry en geen zichtbare code in logs.
- Verifieer dat de cronjob de mail werkelijk afwerkt; controleer alleen niet-gevoelige jobstatus. Test plan opslaan na expliciete keuze, opnieuw ophalen in andere sessie/apparaat, conflicthandling, uitloggen, export en definitief verwijderen. Test gast-PDF/ZIP en lokaal import/export als regressies.
- Controleer dat geen cloudplan automatisch bij sales terechtkomt; `leads=false`/`vault=false`/`staff=false`. Doe geen echte docuploads, geen bulkmail en geen productievestigingstoestanden simuleren door secrets te tonen.
- Meet herstel-/back-upbeschikbaarheid op bestaande Hostinger-hosting en het bewaren van de sleutel (zonder sleutel zichtbaar te maken). Eenvoudige restore-/rollbackcheck vóór grotere campagnes. Let op: de pilot gebruikt **één versleutelde InnoDB-state-rij**, geen onbeperkt schaalbare genormaliseerde account-DB.
- Eindresultaat: account E2E PASS/FAIL met concrete reproducerende stappen in GitHub, liefst synthetische browsercheck/screenshots zonder codes/PII. Alleen bij bewijs mag issue #6 (en de relevante P2-capaciteit uit #7) worden afgehandeld.

**Safe mode bij fout:** laat gratis gastwebsite werken; zet alleen accountflags uit indien nodig, nooit sleutel/schema wissen. De bestaande cron kan zonder nieuwe uitgaande berichten een lege queue verwerken, maar log/noise controleren.

### P1 — SEO en contentdistributie; niet wachten op Portal
- Verifieer actuele live sitemap **15** URL's, Canonical/robots/noindex, redirects, 404/headers, H1, JSON-LD, interne links en mobiele Core Web Vitals. Wees nauwkeurig met veranderingen sinds de eerste nulmeting.
- Kijk rechtstreeks naar Google Search Console-property (alternatief: eigenaar levert export); de betaalde GSC Wizard-connector gaf eerder `payment_required` en is **niet nodig** om een gratis Search Console te gebruiken. Verifieer property, sitemapindiening, URL-inspecties, indexdekking, kliks/impressies/queries waar toegang bestaat; nooit data invullen uit aannames.
- Contentclusters uitbreiden met primaire bronnen: warmtepomp/ISDE-dossier, isolatie/glas/ventilatie, PV 0%-tarief vs betaalde 21%, thuisbatterij/KOR/btw, PV-constructies, Warmtefonds, lokale regelingen. Houd `checked_at`, `effective_from`, versie, reviewer en reviewdatum apart. 2027-voorstellen niet als definitieve regels brengen; geen lokale subsidie "afwezig" verklaren bij ontbrekende dekking.
- `/hulp/isolatie-checklist/` en `/hulp/lokale-regelingen/` pas na echte inhoudelijke uitbreiding/review naar index. Geen massale thin/location pages, geen fiscale of kredietgaranties.
- Meten pas na echte data: SEO-impressies/klikken, klik naar gratis tool, hulpvraag en geverifieerd leadresultaat.

### P2 — eerste werkende vrijwillige leadpiloot (snelle commerciële waarde)
- Valideer **NIVO** als platformcontroller en exact welke **eigen B.V.** voor welk concreet product welke contactaanvragen mag verwerken. Voor thuisbatterijen: TBT B.V. kandidaat, **niet** automatisch ontvanger voor warmtepomp/isolatie of andere vragen.
- Controleer bestaande TBT-formulierwerking en privacy/contactcopy in echte browser, tracking vóór toestemming en ontvangende inbox/CRM met één synthetisch testverzoek. Toestemming voor telefonisch contact is niet hetzelfde als nieuwsbrief/algemene telemarketing.
- Documenteer zes benodigde evidence-/goedkeurings-URL's (owner/publication/controller/relationship/recipient/formAndPrivacy/receipt), vul pas daarna `scripts/lead-pilot.config.json` in en bouw de expliciet gekozen, contextrelevante **optionele** CTA. Eerste voorstel: vaste link `https://thuisbatterijteam.nl/contact/adviesgesprek/`, geen persoons-/dossierwaarden in URL, no-referrer. Vrije gastflow blijft volledig.
- PR, tests, live-acceptatie en eerste werkelijke bron → ontvanger-case meten, onderscheid **klik ≠ formulier ≠ geverifieerde/geschikte lead**.

### P3 — native leadfunnel en eigen NIVO-salesworkflow
- Bouw eigen `/advies/`, alleen na service-/juridische definitie, met minimaal noodzakelijke velden, gekozen contactkanaal, transparante eigen ontvanger, doel-/tekstrevisie, aparte marketingkeuze en intrekking. Maak geen account of marketinginschrijving automatisch aan.
- Bewijs serveraanname, contactverificatie, deduplicatie, kwalificatie, veilige mail/inbox/rollen en lifecycle (nieuw → geverifieerd → gekwalificeerd → toegewezen → gecontacteerd → afspraak → offerte → gewonnen/verloren, of ingetrokken). Personeel MFA/entiteitsautoriteit en retentie zijn daadwerkelijke GO-gates vóór activatie.
- Bouw een duurzame, idempotente outbox met retries, suppression bij intrekking en bewezen ontvangst; **geen** ongeautoriseerde dossier-, fiscale, inkomens-, lening- of documentdata naar sales.
- Gebruik eerst een goedkope first-party workflow op bestaande hosting; **NIVO Portal/Odoo pas integreren** wanneer de ontvangende organisatie, rechten, API en operationele contracten klaar zijn. Niet als prerequisite voor de eerste outbound-linkpilot.

### P4 — meetbaar en zelfstandig draaien
- Definieer heldere KPI's: organische vindbaarheid (GSC), nuttige toolacties (alleen toegestane analytics), bewust verzonden aanvraag, geverifieerd contact, gekwalificeerde lead, eerste reactie, afspraak, offerte, omzet. Geen account of CTA-klik als lead tellen. Geen fictieve baselines of onrechtmatige tracking.
- Beperkte observability: gedeelde host error-/cron-monitoring, queued/failed/expired OTP, databaselock/timeouts, incidentherstel, export/delete/backupcontrole; alarmering zonder PII of OTP.
- Broncontrole RVO/Belastingdienst/Warmtefonds op vaste evaluatiemomenten met **menselijke inhoudsreview vóór regelaanpassing/publicatie**. Bestaande interne redactionele hercontroledatum **14 december 2026**; geen wettelijke deadline.
- Voor publiek volume: performance-/concurrencytest; huidige single-row encrypted state en synchrone SMTP-verzending onder DB-lock kunnen bij schaal knellen. Evalueer normalisatie van account-/plan-/queue-tabellen en een korte outboxlease, pas na daadwerkelijke behoefte, niet voor een eerste pilot als automatisme.

## 4. Technische werkvolgorde en referenties

**Begin:** [startprompt 15-11-2026](STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md), deze overdracht, `AGENTS.md`, actuele `main`, Issue #21. De oude overdracht [14-11-2026](HANDOFF-SEO-LEADGEN-2026-11-14.md) en [SEO-voorbereiding](SEO-FOUNDATION-2026-11-14.md) blijven bron voor eerdere SEO-besluiten, geen actuele accountstatus. De oudere `docs/next/SECURITY.md` spreekt nog over "alleen file/sodium/local/staging" en is op die punten HISTORISCH sinds PRs #24–#27.

**Belangrijkste bronpaden:**
- Generator en site: `scripts/build-site.cjs`, `scripts/next/build.cjs`, `scripts/site-design.cjs`, `assets/site-theme.css`, `scripts/regeling-pages.cjs`.
- SEO: `scripts/seo.cjs`, `scripts/seo-articles.cjs`, `scripts/audit-seo.cjs`, `sitemap.xml`, `docs/SEO-CONTENT-STRATEGY-2026-11-14.md` en `scripts/next/check-sources.cjs`.
- Plan/guest: `assets/plan-app.js`, `assets/plan-core.js`, `assets/next-api.js`, `assets/workbench-rules.js`, `assets/export.js`.
- Productieaccounts: `server/next/service.php`, `server/next/mysql.php`, `server/next/smtp.php`, `api/next/index.php`, `scripts/next/mysql-check.php`, `scripts/next/mail-check.php`, `scripts/next/mail-worker.php`, `scripts/next/maintenance.php`.
- Leadpilot: `scripts/lead-pilot.cjs`, `scripts/lead-pilot.config.json` en `docs/LEAD-READINESS-2026-11-14.md`.
- Testen/publiceren: `npm run build`, `npm test`, `npm run package`, `npm run preview:next`; specifieke SSH-check `cd public_html && php scripts/next/mysql-check.php --check`; secrets buiten Git.

**GitHub-issues:** #21 overkoepelend, #5 governance, #6 account, #7 cloudplannen, #8 online vault (UIT), #9 sales, #10 KPI/privacy, #12 snelle TBT-CTA, #15 werkbanken, #16 bronnen en #17 roadmap. **Open PR #11 is een historische ontwerpbranch; niet zonder herontwerp/rebase in huidige main mergen.** Maak kleine feature-PR's, test en merge bij relevante eigenaarpublicatiebeslissing; herstelbare wijzigingen via revert PR, private data niet wissen.

**Security/UX:** behoud exact goedgekeurde premium vormgeving, geen UI-/regelingen-herbouw; regelingencheck een helder werkvlak, gastgebruik gratis en zonder registratie/lead; account niet gelijk aan sales. Geen aankopen, betaalde API's of externe partijen zonder owner-go. Weiger ongetoetste AI-publicatie van subsidies, btw of kredietvoorwaarden.

## 5. Definitie van "zelfstandige leadmachine" — harde eindacceptatie

- [ ] De gast vindt via indexeerbare, brongecontroleerde pagina's een werkende gratis check/werkbank en kan zonder account/downloadbeperkingen verder.
- [ ] Online optioneel account en plan draaien in productie na bewezen OTP via cron, sessie-/apparaatwisseling, export, verwijderen, privacy.
- [ ] Een relevante bezoeker kan **vrijwillig** om commercieel advies vragen bij een **genoemde eigen onderneming**; geen automatische dataoverdracht bij alleen check/account/export.
- [ ] Server/ontvanger hebben een aantoonbare unieke aanvraag met juiste contactkeuze, contactverificatie en contacttekst/versie; intrekking/suppressie werken.
- [ ] Geautoriseerde salesmedewerker ontvangt de aanvraag en kan binnen de eigen entiteit status/afspraak/offerte vastleggen; geen plandossiers/income/bankgegevens zichtbaar.
- [ ] Werkelijke KPI's kunnen gescheiden worden gemeten: bereik, toolgebruik, geverifieerde leads, afspraken, offertes, verkoop en responstijd, met privacy-respecterende noemers.
- [ ] Monitoring, cronworker, bronhercontrole, herstel-/retentieroutine en foutmelding werken zonder dagelijkse technische handelingen. NIVO Portal-koppeling is **later**, niet een voorwaarde voor de eerste leadpilot.
- [ ] Geen extra kosten of illegitieme commerciële toestemming.

## 6. Afgesloten fase en bewijsrecord

**Fase afgesproken afgesloten:** Hostinger database-/SMTP-/cron- en accountconfiguratiebasis, premium website, eerste SEO-tranche. **Niet afgesloten:** live functionele account-E2E en daadwerkelijke leadgeneratie/salesflow. De eigenaar heeft expliciet gevraagd de accounttest over te dragen aan de volgende agent.

Codebewijs: PR #23 (SEO), #24 (NIVO/legal & accounts), #25 (SQL-preflight), #26 (OpenSSL), #27 (SMTP); main snapshot `fb9450f`. Live DB/SMTP/full-check en cron/inboxbewijs komen rechtstreeks uit Hostinger-uitvoer/screenshots van de eigenaar op 15 november. Geen privésleutels, accountgegevens of OTP's in dit dossier.

**Huidige volgende actie:** de opvolgende agent begint direct met de echte account-E2E, documenteert PASS/FAIL en sluit dan de technische accountfase; daarna doelgericht SEO, eigen leadpilot en daadwerkelijke first-party leadpipeline uitvoeren.
