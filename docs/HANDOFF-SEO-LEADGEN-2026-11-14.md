> **LET OP — VERVANGEN DOOR DEFINITIEVE EIGENAARSTRATEGIE VAN 16 NOVEMBER 2026.** Dit oudere start-/overdrachtsdocument is uitsluitend **historische context**. Gebruik voor een nieuwe agent **niet** de uitvoeringstekst hieronder als primaire opdracht: lees eerst [AGENT-START-HERE-2026-11-16.md](AGENT-START-HERE-2026-11-16.md), daarna de [productstrategie](PRODUCT-STRATEGY-2026-11-16.md), [roadmap](DELIVERY-ROADMAP-2026-11-16.md) en [beslisregister](DECISION-REGISTER-2026-11-16.md). Bestaande gasttool blijft zonder account gratis; een account is geen lead; NIVO-advies is vrijwillig. Directe V2-leads zijn intussen live, met één aangetoonde mailontvangst. Laat nieuwe functionaliteit pas ontwikkelen na de eigen toekomstgerichte gebruikersopdracht; de 16-november-strategiefase is documentatie-only.

---

# PROJECTOVERDRACHT — SubsidieReady → SEO en automatische eigen leadgeneratie

> **HISTORISCHE OVERDRACHT VAN 14 NOVEMBER — STATUS VERVANGEN OP 15 NOVEMBER 2026.** Voor een nieuwe agent eerst [HANDOFF-NIVO-LEADGEN-2026-11-15.md](HANDOFF-NIVO-LEADGEN-2026-11-15.md) lezen. De vroegere 'accounts/SQL/SMTP nog uit/ontbrekend'-claims gelden inmiddels niet meer: productieconfig is aangezet en MySQL en SMTP zijn echt getest, maar registratie/OTP via cron, planopslag en alle eigen lead- en salesfunctionaliteit wachten nog op acceptatie. Dit historische document blijft nuttig voor design/SEO-besluiten uit de vorige fase.


**Canoniek overdrachtsdocument, vastgelegd op 14 november 2026.** Dit document is het startpunt voor de volgende ChatGPT-agent. Het beschrijft de toestand vóór de documentatie-PR; haal bij elke nieuwe werkronde eerst de *actuele* main op. De historische README/oudere handoffs bevatten nog teksten die bij vroegere fasen hoorden. **Deze overdracht gaat bij tegenstrijdigheid over de actuele status; de code en actuele live-controles blijven uiteindelijk leidend.**

## 1. Opdracht en gesloten fase

De eigenaar heeft de brede regelingencheck en daarna de sitebrede **premium wit/navy/groene stijl** goedgekeurd. De laatste opdracht was de visuele fase netjes af te ronden zodat een nieuwe agent de volgende fase zelfstandig kan oppakken: **SEO-ready maken én een betrouwbare, grotendeels geautomatiseerde first-party leadmachine bouwen voor eigen bedrijven**. De volgende agent moet niet weer een volledige redesign voorstellen of de productbasis opnieuw bouwen.

- **Merk/domein:** SubsidieReady, https://subsidieready.nl/
- **GitHub:** https://github.com/Michaelwmdegroot/SubsidieKlaar (repositorynaam blijft bewust SubsidieKlaar).
- **Productiebron:** branch main, Hostinger GitHub-deployment. Base productiesnapshot bij overdracht: **e1ab8f8d0d0632bb3cca03bcebf8456c0e82f19c** (PR #20 sitebrede stijl). Een latere *documentatie-only* merge geeft een nieuwe commit; gebruik dan die als nieuwe referentie, terwijl de websitebytes ongewijzigd zouden moeten blijven.
- **App-release:** version.json = product SubsidieReady, versie 1.0.0, build **a95e1539d1244098**, source_checked 2026-11-14, documents browser-only.
- **Test/beta-release:** next-version.json = 3.0.0-beta.1, build **6377d2731227bf88**, mode review-only, cloudDefault disabled. Dit is géén productierijp accountplatform.
- **Hosting:** Hostinger, bron main. In eerdere feitelijke deploylog van de eigenaar draaide Hostinger npm run build; oudere documentatie zegt dat de statische webbestanden reeds in Git staan. **Controleer het actuele Hostinger-buildcontract in plaats van op één van die historische beschrijvingen blind te varen.** Geen nieuwe betaalde infrastructuur autoriseren.
- **CI bewijs laatste functionele release:** quality run https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43632347674 ; release run https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43632347664 ; live acceptance https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43632347692. Resultaat: **160 geautomatiseerde tests geslaagd (0 mislukte)**, 168 lokale Chromium scherm-/toestandcontroles en **83/83 live-HTTP/asset/securitychecks groen** op de gepubliceerde build.
- **Belangrijkste grens van dat bewijs:** Chromium-rendering was in-memory wegens geblokkeerde HTTP-browsernavigatie in de agentomgeving. Het is geen echte Safari-/Firefox-/fysieke-telefoon-, toegankelijkheids- of productiebeveiligingscertificering. Owner heeft wel visuals bekeken/goedgekeurd. Laat de volgende agent aanvullende browser- en funnelacceptatie doen waar nodig.

## 2. Wat er echt staat: functionele kaart

| Onderdeel | URL / implementatie | Actuele status |
| --- | --- | --- |
| Homepage/brand | / | **LIVE**, volledige premium huisstijl, responsive, bronlinks en CTA's |
| Regelingencheck | /regelingen/ | **LIVE**, interactief one-screen/dashboard, 12 brongebaseerde informatieroutes, maatregel-/profielkeuze, directe filters/detail, print/JSON en expliciete handoff naar Mijn plan |
| Informatiepijlers | /subsidies/, /btw/, /financiering/ | **LIVE**; subsidies, btw/fiscaliteit en leningen afzonderlijk. Geen financieel/kredietadvies of recht-op-subsidiegarantie |
| Kennisbank | /hulp/ + artikelen | **LIVE**, premium artikelopmaak; oorspronkelijke 3 hulp-URL's indexeerbaar. Vier aanvullende voorbereidingsartikelen bestaan maar zijn **nog noindex** |
| Warmtepompdocumenten | /#dossier en /#voorbeeld | **LIVE**, vier stappen, lokale bijlagen, demo, JSON-import/export en PDF/ZIP. Volledig gratis zonder account/contact |
| Mijn Verduurzamingsplan | /mijn-plan/ | **LIVE als noindex proef-UI**, lokaal multi-maatregelplannen, tabs/taken/datums, lokaal export/import en optionele browseropslag; geen geactiveerde cloudaccount |
| Advies/Sales | /advies/, /sales/ | **LIVE als noindex proefschermen**; echte adviesaanvragen/sales zijn **UIT**, salesdemo is expliciet fictief |
| Bronbeheer | /bronbeheer/ en scripts/next/check-sources.cjs | **LIVE als noindex uitleg/handmatige reviewcode**, geen geplande/automatisch publicerende monitor |
| Bestaand beheerdersportaal | /admin/ | PHP login/aggregatietechniek aanwezig, maar **nog niet geconfigureerd/actief** volgens liveacceptatie |
| Analytics | assets/metrics.js, api/event.php | **Standaard UIT**; opt-in telgebeurtenissen mogelijk na afzonderlijke configuratie en privacycheck; geen gekende actuele bezoekersbaseline |
| Account/cloud API | /api/next/?action=bootstrap | **Productie fail-closed HTTP 503**, JSON configured:false; geen echte accounts/online dossiers/bijlagen |
| Salesbackend | server/next/service.php | **Implementatie aanwezig als beschermde local/staging-beta**, niet productie-geactiveerd, geen echte CRM-/Odoo-koppeling |

**Nooit presenteren als geleverd:** volledige gemeentelijke dekking, definitieve subsidierechtencheck, geautomatiseerde RVO- of Belastingdienst-indiening, particuliere kredietbemiddeling, AI-OCR/privédocumentanalyse, SEO-ranking, echte salesconversies, actieve accounts, live maillogistiek of volledig geautomatiseerde leads.

## 3. Technische samenhang

- Stack: statische/prerendered HTML + browser-JS/CSS en beperkte PHP-routes, Node.js voor build/test/package; geen verplicht betaald SaaS-platform.
- **Bouwcommando's:** npm run build, npm test, npm run package, npm run preview:next. Aanvullend voor echte serverregressies draait npm test tijdelijke PHP-tests. Vereist Node.js 22+ voor de ontwikkelomgeving en geschikte PHP-runtime.
- **Gezaghebbende bestanden, niet de gegenereerde kopieën handmatig bewerken:**
  - scripts/build-site.cjs + templates/index.html: homepage, public pages, sitemap, headers, versie.
  - scripts/regeling-pages.cjs + templates/regelingen-page.html: informatie-/regelingenpagina's.
  - scripts/regelingen-engine.cjs: vaste regelengine; assets/regelingen-engine.js wordt gegenereerd. Bewaak bytegelijkheid.
  - scripts/site-design.cjs + assets/site-theme.css: gedeelde premium UI-stijl.
  - scripts/next/build.cjs: Mijn plan, beta-/testpagina's, extra kennisartikelen, next-version.
  - assets/regelingen-app.js / assets/regelingen.css: interactieve regelingencheck.
  - assets/plan-core.js / assets/workbench-rules.js / assets/plan-app.js: lokale planlogica en werkbanken.
  - assets/core.js / assets/app.js / assets/export.js: bestaande warmtepompwerkbank en export, niet per ongeluk breken.
  - scripts/package.cjs: allowlist Hostinger-pakket; bestaande release telt 75 webbestanden.
  - scripts/check-live.cjs + .github/workflows/live-check.yml: alleen-lezen domeincontrole, byte-exacte publieke assets en fail-closed routes.
  - server/next/service.php, api/next/index.php: beta account/vault/sales API; **niet activeren zonder GO**.
- Deployment: wijzigingen via feature branch → PR → quality/release op exacte head → expliciete review indien relevant → merge main → Hostinger deploy → liveacceptatie. Geen secrets, state, bestanden van echte bezoekers of testcredentials in repository.
- Rollback: revert de specifieke feature-merge via PR en laat eventuele externe private data intact; nooit force-push main of permissies verzwakken.
- Preserve: legacy SubsidieKlaar JSON, vierstappenwarmtepomp, echte originele bijlagebytes, offline/guest PDF/ZIP, demo-markeringen, strikte CSP, HTML alt/semantiek, noindex voor private routes, lokale bewaring op expliciete keuze, GPC/DNT en privacy.

## 4. SEO: exact vastgesteld versus onbekend

**Bestaande basis bevestigd in main:**
- HTTPS/canonical domein en HTTP/www redirects werden op de laatste release geverifieerd.
- robots.txt: Allow /; blokkeert admin, API, server, docs, scripts, templates, tests, concept; verwijst naar sitemap.
- sitemap.xml bevat **12 publieke URL's**: /, /regelingen/, /hulp/, drie oorspronkelijke hulp-artikelen, /bronnen/, /privacy/, /over/, /subsidies/, /btw/, /financiering/. Controleer bij latere wijzigingen live en source opnieuw.
- De vier aanvullende voorbereidingsartikelen onder /hulp/isolatie-checklist/, /hulp/zonnepanelen-btw/, /hulp/thuisbatterij-btw/, /hulp/lokale-regelingen/ bestaan, zijn intern vindbaar, maar bleven bij de visuele release **bewust noindex**.
- /mijn-plan/, /advies/, /sales/ en /bronbeheer/ blijven **noindex** en niet in de sitemap zolang het review-/privé- of fictieve functies zijn.
- De site heeft metadata, gedeelde navigatie, bronoverzichten, beeldoptimalisatie, beveiligingsheaders en een lokale gedeelde stylesheet.

**NIET geverifieerd/NIET claimen:**
- Of Google Search Console of Bing Webmaster Tools gekoppeld zijn, of de sitemap ingediend is, welke URL's werkelijk geïndexeerd zijn, zoekverkeer/impressies/rankings of Core Web Vitals uit echte gebruikers.
- Of bestaande Search Console-, hosting- of analytics-accounts en GA/Matomo-toestemming al beschikbaar zijn.
- SEO-compleetheid, structured-data-validiteit, lokale schemaresultaten, inhoudelijke rankingkansen, crawlbudget en conversieratio's.

**Volgende agent eerst:** crawl/technische audit van *live* en broncode; robots/noindex/canonicals, indexeringskeuzes, titles/descriptions/H1, structured data alleen waar werkelijk passend, sitemap, 404, interne links, mobiele bruikbaarheid/CLS/LCP/INP, images, stale claims, nieuw artikeloverzicht. Daarna een brongecontroleerde inhoudsarchitectuur rond ISDE/warmtepomp/isolatie/glas, PV-0%-tarief vs 21%-btw, batterij-btw, PV-constructies, Warmtefonds, plaatselijke uitzonderingen. Geen massaal gegenereerde thin content/ongeverifieerde postcodepagina's of automatische regels. Beslis *inhoudelijk* welke van de vier extra artikelen na review indexeerbaar worden.

**Brononderhoud:** RVO, Belastingdienst, Warmtefonds en waar relevant regionale bronnen; officiële voorwaarden opnieuw beoordelen voor inhoudelijke publicatie. De huidige broncontrole is **2026-11-14** en interne reviewdatum **2026-12-14** — geen wettelijke einddatum. Voorstellen voor 2027 niet als definitief publiceren. Het systeem is geen overheidsdienst. Leg rule versie, ingangsdatum, broncontroledatum en reviewer afzonderlijk vast.

## 5. Conversie/leadmodel (besloten eigenaarstrategie)

**Alle leads uitsluitend voor de eigen bedrijven/verkooporganisatie. Geen doorverkoop aan externe installatiepartners.** Eerste *voorgestelde* eigen leadbestemming voor thuisbatterijvragen: **Thuisbatterij Team B.V.** De exacte juridische exploitant/verwerkingsverantwoordelijke van SubsidieReady en de eventuele rol van NIVO Groep Holland zijn **nog niet vastgesteld**. Een andere B.V. is juridisch niet automatisch een interne afdeling.

**Voorkeursfunnel:**
1. Zoekverkeer → een eerlijke, nuttige gratis regelingenpagina of tool.
2. Regelingencheck / warmtepompwerkbank / Mijn plan, zonder account of verkoopcontact verplicht te maken.
3. Eén passende, duidelijke **vrijwillige** commerciële CTA — alleen bij aantoonbaar eigen product en met de concrete ontvanger/het doel.
4. Bezoeker stuurt eigen adviesverzoek in → juiste contactverificatie / doel/medium en aantoonbare aparte toestemming indien vereist.
5. Eigen sales-inbox met rol-/entiteitstoegang en lifecycle: nieuw → gekwalificeerd → contact → afspraak → offerte → gewonnen/verloren, plus intrekking/bezwaar.
6. Rapportage: geverifieerde geldige hulpaanvragen, lead→afspraak→offerte→verkoop en responstijd; pas doelwaarden op basis van echte nulmeting.

**Laagrisico eerste pilot:** bestaande TBT-adviespagina **https://thuisbatterijteam.nl/contact/adviesgesprek/** als gewone optionele uitgaande link, na controleren van actuele formulierwerking, wettelijk juiste naam/relatie, privacytekst, doel en ontvangende organisatie. **Geen** dossierdata, fiscale antwoorden, bankgegevens, account-/privé-ID's, refererquery of PII via URL; de bezoeker beslist zelf en voert daar zelf zijn gegevens in. Aanvraag mag niet nodig zijn voor gratis gebruik of downloads.

**Directe interne sales** pas na goedgekeurde gegevensstromen: Beta /advies/ en /sales/ bestaan, maar de productie-API is **niet** te activeren met alleen een configtoggle. Hij weigert het productiedomein; ook opslag/SMTP/malware/rollen/retentie/governance zijn niet productierijp. Kies/valideer eventueel later Odoo of eigen CRM per rechtspersoon; niet automatisch delen tussen B.V.'s en nooit documenten/fiscale-/inkomensgegevens naar sales.

**Privacyregels:** account = geen lead of reclame-toestemming. Houd gratis gastflow volledig; optionele online opslag met aparte documentkeuze; aparte doelgebonden contactwens en opt-in voor *toekomstige* marketing. Geen vooraangevinkte toestemming, ongevraagde mail/belcampagnes, fiscale koopkrachtprofilering of inkomens-/kredietgegevens in CRM. Volg toepasselijke Nederlandse AVG/ACM-regels incl. aangescherpte telemarketingvereisten; laat concrete contactteksten toetsen.

## 6. Harde blockers (issue #5 = P0)

**Eerst formeel vaststellen, vóór echte persoonsgegevens/marketing in nieuwe flows:**
1. SubsidieReady's juridische exploitant, KvK/contact/privacyverantwoordelijke, ontvangende verkooprechtspersoon en eventuele afspraken tussen verschillende eigen ondernemingen.
2. Hostinger-capaciteiten: PHP/SQL, **persistente privéopslag buiten elke webroot die deploys overleeft**, locking/concurrency, quota, backups, versleuteling en een echte restore/redeploy-rehearsal. Huidige testbackend gebruikt beperkte single-host encrypted JSON-File-store, **niet MySQL**; dit is geen bewezen productiedatabase.
3. Betrouwbare transactionele e-mail (Hostinger SMTP of passend bestaand transport), SPF/DKIM/DMARC, bounce/rate-limit, dienstafzender en privacy van mailinhoud.
4. Malwarescanner voor echte documentuploads en controles voor type/size/auth/IDOR/CSRF/Origin; personeelsrollen/MFA voor echte sales.
5. Rechtsgronden, publicatieprivacyteksten, doel-/mediumtoestemming, rechten inzage/export/verwijderen/bezwaar, termijnen, logging-/backupretentie, verwerkersovereenkomsten en DPIA-triage.
6. Synthetische end-to-end stagingtesten in browser A/B, Safari, telefoon, stress/failure scenarios en live/rollback acceptance.
7. Bevestigde interne verkoopontvangers en geldige product-/servicecategorieën. Warmtepompen, isolatie, batterijen, PV niet automatisch toewijzen zonder eigen aanbod/toestemmingsroute.

**Actieve status bij handoff:** /api/next/?action=bootstrap geeft 503, configured:false; bestaande /admin/ ongeconfigureerd (503), analytics false. Dit is bedoelde fail-closed toestand, geen te repareren bug. Geen credentials of keys in chat, GitHub, scripts of screenshots. Bouw eerst geïsoleerd, geen ongevraagde publicatie.

## 7. Prioriteiten voor de nieuwe agent

| Volgorde | Werkpakket | Deliverable / acceptatie |
| --- | --- | --- |
| P0 | Baseline & read-only audit | Bevestig HEAD/live build/routekaart/SEO status/privacy, zoek beschikbare Search Console/analytics-verbindingen. Feiten vs open punten. |
| P1 | Technische SEO | PR voor gecontroleerde metatags, interne linking, semantiek, crawl/robots/noindex-keuzes, performance, schema (alleen gerechtvaardigd); geen bezoekerdata of fiscale regels wijzigen. |
| P2 | Leadpilot zonder nieuwe persoonsgegevensopslag | Vrijwillige, juiste eigen advies-CTA naar bestaand TBT-formulier; eerst legal/contact- en ontvangstcheck; geen verborgen doorsturen/marketing. Voorzie veilige bronmeting zonder PII. |
| P3 | SEO-content als duurzame assets | Bron-/jaarversie-gecontroleerde evergreen + taakgerichte artikelen, koppeling aan passende werkbank, updates/onderhoud en beheersbare lokale dekking. Geen massa-AI-pagina's. |
| P4 | KPI & eerste-partij salesproces | Definieer baseline, consentmeting, gekwalificeerde aanvraag, sales lifecycle; kies geschikte eigen Sales Inbox/Odoo-ontvanger. Echte activatie pas na GO. |
| P5 | Account/cloud/volledige automatisering | P0 technische/juridische GO → staging → migratie productiestorage/mail/scanner/MFA → gecontroleerde live-uitrol, e-mails/reminders/rollen/sales, monitoring. Geen stap overslaan. |

**Vervolg-issue:** https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21

**Reeds open gebleven:** #5 infra/legal, #6 account, #7 autosave, #8 documentenkluis, #9 eigen sales, #10 KPI/privacy, #12 low-risk leadpilot, #15 multi-maatregelinhoud, #16 bronbeheer, #17 algemene roadmap. Het oude accounts/first-party-sales ontwerp zit in **open draft PR #11** op de aparte branch plan/v2-accounts-leads, **niet blind mergen**: het bevat historische scenario's en moet met de nieuwste main in lijn worden gebracht.

## 8. Werkwijze voor de opvolgende agent

- Gebruik de beschikbare GitHub-connector voor repository-inhoud en PR's; verifieer eerst actuele HEAD, open PR's/issues en live deploy. Geen verouderde handoff als codewaarheid gebruiken.
- Houd **de premium UI** consistent: wit/navy/groen, lokale assets, heldere driepaneelregelingencheck en kleine schermen zonder onnodige hoofdpaginas-scroll. Inhoudelijke artikelen mogen wel scrollen.
- De wijziging hoort in generator/source, **niet in gegenereerde HTML alleen**. Houd gegenereerde diff/sitemap en testdekkingen inspecteerbaar.
- Werk in feature branches met PR, bewijs, acceptatie en rollback. Mutaties aan main na expliciete eigenaarspublicatiebeslissing. Owner gaf de nieuwe agent nog geen carte blanche voor productieaccounts, mail of kosten.
- Hergebruik waar passend officiële bronnen en toon bronversies/onzekerheid; niet uit eigen aannames subsidies, btw of leningen berekenen.
- De vorige visuele fase is als **geslaagd afgesloten**; start geen nieuw totaalredesign of website-herbouw zonder onderbouwde noodzaak.

## 9. Leesvolgorde — links naar de echte repo-bestanden

1. **docs/NEXT-AGENT-SEO-LEAD-START.md** — copy-paste startprompt.
2. **AGENTS.md** en **README.md** — repositoryconventies, met historische opmerkingen.
3. **docs/SITEWIDE-DESIGN-RELEASE.md** — definitieve premium UI-fase, tests en grenzen.
4. **docs/PREMIUM-DASHBOARD-RELEASE.md** — dashboardimages, layout en interactie.
5. **docs/V2-REGELINGEN-PLATFORM.md** en **docs/RVO-sources.md** — programma's/voorwaarden/bronbeleid.
6. **docs/next/SECURITY.md**, **docs/next/STAGING.md**, **docs/next/TESTEN.md** — local/staging-beta en productie-NO-GO.
7. **docs/HOSTINGER-LIVE.md**, **scripts/check-live.cjs**, **.github/workflows/** — deployment en verificatie.
8. **docs/DASHBOARD-ASSETS.json** — gegenereerde decoratieve assets en herkomst.
9. **PR #11** en Issues #5/#9/#10/#12/#16/#17/#21 — open beslissingen en verantwoordelijkheden.

**Eindtoestand van deze overdracht:** ontwerp/UX/live release afgesloten met controlebewijs; volgende fase begint bij gecontroleerde SEO-/funnel-audit. Account- en salesfunctionaliteit blijft gescheiden en inactief totdat de eigenaar een afzonderlijk GO geeft.
