# Eerste SEO- en leadvoorbereiding — SubsidieReady

Onderzoek gestart op **14 november 2026**. Basis: `main` **30be4c0e6bda6c5cdd1a550fb611d71740d3d99f**, met publieke build **a95e1539d1244098** en proefbuild **6377d2731227bf88**. Dit document beschrijft de ontwikkelbranch; een geslaagde build of PR is geen bewijs van publicatie op het domein.

## 1. Wat opnieuw is vastgesteld

De overdracht en startinstructies zijn gelezen, evenals AGENTS.md, release-, bron-, hosting-, beveiligings- en stagingdocumentatie. De actuele main-commit is een documentatiecheckpoint; het enige vooraf openstaande PR was het historische draftontwerp #11. Dat ontwerp is niet overgenomen of gemerged.

| Onderdeel | Feitelijke nulmeting | Betekenis |
| --- | --- | --- |
| Domein en release | HTTPS 200; version.json noemt a95e1539d1244098 | De verwachte functionele release staat op het domein |
| Hosting | Hostinger-headers; PHP-healthroute uitgevoerd | Hosting en PHP zijn bereikbaar; dit bewijst geen private persistence, database of herstelbaarheid |
| Headers | CSP, HSTS, nosniff, frame-denial, no-referrer aanwezig | Bestaande veiligheidsgrenzen blijven uitgangspunt |
| Indexeerbare inhoud | 12 publieke sitemap-URL's met titles, descriptions en self-canonicals | Technisch aangeboden aan crawlers, niet aantoonbaar geïndexeerd |
| Extra kennisartikelen | 4 korte artikelen noindex, met proefrelease-opmaak | Vereisen inhoudelijke selectie vóór indexering |
| Proefomgevingen | Mijn plan, advies, sales en bronbeheer noindex | Niet als actieve account-/verkoopomgeving positioneren |
| Backend | Bootstrap 503/configured:false; beheer 503; analytics:false | Bedoelde gesloten toestand |
| Foutafhandeling | Onbekende pagina geeft echte 404 | Geen soft-404 geobserveerd |
| Redirects | HTTPS-www en HTTP-apex naar HTTPS-apex; /regelingen naar /regelingen/ | Voorkeursdomein en slashroute werken |
| Expliciete index.html | /index.html en /regelingen/index.html geven 200 met correcte canonical | Restpunt met lage prioriteit; geen nieuwe redirect ingevoerd in deze tranche |
| Structured data | WebApplication op home en check; geen schema op redactionele pagina's | De aanwezige kruimelpaden worden nog niet machineleesbaar beschreven |
| Startgewicht homepage | Vier exportlibraries samen 2.064.759 ongecomprimeerde bytes vóór app.js | Bezoekers laden PDF-/ZIP-code vóór zij die gebruiken |
| Afbeelding | Bestaande 1280×720- en 640×360-hero; homepage gebruikt alleen de grote variant | Kleine variant kan mobiel direct worden benut |
| Semantiek | Tweede main/H1 in de homepage-noscriptfallback | Eén duidelijke hoofdinhoud en H1 behouden, ook zonder JavaScript |

De bestaande liveacceptatiescript leverde **40 geslaagde checks van 42**. Beide niet-geslaagde checks betroffen dezelfde HTTP-apexaanroep die vanuit Node een netwerkfout gaf. Een afzonderlijke `curl`-controle bevestigde vervolgens **HTTP 301 → https://subsidieready.nl/**. Dit wordt als apart bewijs bewaard; het is geen achteraf groen gemaakte scriptuitvoer. Het JSON-crawlrapport in `SEO-LIVE-BASELINE-2026-11-14.json` bevat de bredere routecontrole en zijn eigen onbekenden.

De laatste al bestaande volledige productieacceptatie is [run 43632347692](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43632347692), behorend bij de ongewijzigde functionele release vóór deze branch. Dat resultaat bewijst niet dat deze nieuwe branch live staat.

## 2. Metingen die ontbreken

De beschikbare GSC Wizard-connector antwoordde bij de read-only propertylijst met `payment_required` / `subscription_required`. Er is geen abonnement afgesloten of koppeling gewijzigd. Daardoor zijn eigendom, ingediende sitemap, indexdekking, zoekopdrachten, klikken, impressies en posities **onbevestigd**. Dit betekent niet dat Search Console zelf ontbreekt of betaald is: rechtstreeks toegang tot de bestaande Google-property of een export kan deze nulmeting aanvullen.

Er is geen betrouwbare bezoekers-/leadbaseline en geen productie-CWV-veldmeting vastgesteld. Geen fictieve SEO-score, rankings, funnelpercentages of conversiedoelen toegevoegd. De gemeten bestandsreductie is geen claim over LCP, INP, CLS of gecomprimeerd netwerkverkeer. Een latere Search Console-/CrUX-controle moet echte gebruikerservaring scheiden van testresultaten.

Het exacte huidige Hostinger-buildcommando en private opslag-, back-up-, SMTP- en MFA-instellingen zijn niet toegankelijk via het beschikbare hostingbeheer. De oude documenten spreken elkaar over het buildcommando tegen. Geen hostingconfiguratie gewijzigd op basis van een aanname.

## 3. Gebouwde verbeteringen

### Zoekmachinebasis

- Centrale metadatafuncties in `scripts/seo.cjs`: consistente Open Graph-afbeelding en werkelijke afmetingen, WebSite voor de merknaam, WebPage/CollectionPage en BreadcrumbList voor openbare uitleg. De echte gratis tools behouden WebApplication.
- Kruimelpaden tonen de actuele artikeltitel. Schema verwijst uitsluitend naar bestaande pagina's en zichtbare bronlinks. Geen gefingeerde organisatie, auteursexpertise, reviews, ratings, SearchAction of voordelen.
- De CSP bevat hashes van de exacte JSON-LD-bytes; scriptbeveiliging wordt niet verruimd. De uiteindelijke privacytitel is al in de bron correct, zodat een vervolggenerator de schemahash niet ongeldig maakt.
- De homepage heeft ook zonder JavaScript één H1 en één main. De uitleg zonder JavaScript blijft beschikbaar.
- Automatische, begrensde SEO-auditor voor gegenereerde bestanden en read-only livecontrole. CI controleert publieke canonicals, metadata, headings, robots, sitemap, schema en interne doelen.

### Praktische inhoud

Twee bestaande URL's zijn uitgebreid met zelfstandig bruikbare uitleg en primaire bronnen: `/hulp/zonnepanelen-btw/` en `/hulp/thuisbatterij-btw/`. De kennisbank en btw-pijler linken hiernaartoe; de pagina's verwijzen naar elkaar en naar de gratis regelingencheck. De sitemap groeit gecontroleerd van **12 naar 14** URL's.

De isolatie- en lokale-regelingenartikelen blijven noindex, evenals alle vier proefomgevingen. De regelengine en fiscale/subsidievoorwaarden in de tools zijn niet veranderd. Zie [SEO-CONTENT-STRATEGY-2026-11-14.md](SEO-CONTENT-STRATEGY-2026-11-14.md) voor bronnen, onderwerpen, indexeringsbesluit en onderhoud.

### Laadgedrag en bestaande downloads

De homepage laadt een kleine lokale exportloader. PDFLib, fontkit, het PDF-lettertype en JSZip worden pas geladen voor een PDF, ZIP of fictief PDF-voorbeelddossier. Normaal bekijken, bewerken, printen en project-JSON downloaden vragen die vier libraries niet op.

De eerste download bewaart zijn gegevens-/bestandsmomentopname vóór het asynchrone laden. Demo-opbouw bereidt eerst tijdelijke gegevens voor en neemt die alleen over als het bestaande dossier intussen niet veranderd is. Bij een laadfout blijft het dossier behouden en kan de gebruiker opnieuw proberen. Offline HTML blijft volledig zelfstandig met ingebedde libraries. `assets/export.js`, de originele bijlagebehandeling en de kernregels blijven intact.

De mobiele homepage gebruikt de bestaande kleine hero via `picture`; er is geen nieuw beeld of redesign gemaakt. De gedeelde premium stylesheet blijft byte-identiek aan de goedgekeurde basis.

### Vrijwillig advies voorbereiden

`scripts/lead-pilot.cjs` bevat een gewone uitgaande advieskaart voor Thuisbatterij Team B.V., uitsluitend bij het batterijartikel. De vastgelegde configuratie is **enabled:false** en alle goedkeuringsverwijzingen zijn **null**. Er verschijnt dus geen commerciële link door deze release.

De build weigert activering zonder concrete besluiten over exploitant, relatie, ontvanger, formulier/privacy, ontvangst en publicatie. Het verwijzingsformaat is technisch controleerbaar; de inhoud van een juridisch besluit blijft mensenwerk. Geen formulier, account, persoonsgegevensopslag, trackingevent, marketingmail of CRM-adapter geactiveerd. De exacte ontvanger en twee parameterloze links zijn vastgelegd; dossierinhoud gaat nooit mee. Zie [LEAD-READINESS-2026-11-14.md](LEAD-READINESS-2026-11-14.md) voor de daadwerkelijke TBT-controle, KPI-definities, datacontract en open besluiten.

## 4. Verificatie en grenzen

Uitgevoerd vóór de eerste PR-push:

- `npm run build` — geslaagd, inclusief beide portable HTML-bestanden.
- `npm test` — **181 tests geslaagd**, geen fouten of overgeslagen tests; Node 24 en geïsoleerde PHP 8.4.27.
- `npm run package` — **76 webbestanden**, zonder credentials, documenten of statistieken.
- `npm run preview:next` en `git diff --check` — geslaagd.
- Read-only local SEO-audit — 14 sitemaproutes, 20 HTML-pagina's, geen fouten of waarschuwingen op de geteste branchbuild.
- Afzonderlijke backendregressies — 35 geslaagd, inbegrepen in de complete suite; onder meer ownership, authenticatie, gegevensscheiding, intrekking en herstel.

Lokale Chromium-start wordt door de uitvoeromgeving geblokkeerd (`socket(): Operation not permitted`). Daarom komt echte HTTP-browseracceptatie in een afzonderlijke GitHub Actions-job. Die gebruikt uitsluitend synthetische gegevens, de lokale previewserver en de werkelijke CSP. Hij moet netwerkgedrag, fout/herhaalroute, echte downloads, mobiele opmaak en screenshots opleveren. De bestaande in-memory functionele/layoutsuite blijft daarnaast draaien; dat is afzonderlijk bewijs, geen Safari- of echte-telefoontest.

**Vóór publicatie vereist:** groene quality/release/browser-jobs op de definitieve PR-head, inspectie van screenshots en gegenereerde diff. Vul de resultaten in de PR aan. Zonder dat bewijs wordt niet gemerged. Native Safari/Firefox, echte toestellen, privacy-/juridische goedkeuring en een productiepenetratietest worden niet geclaimd.

## 5. Publicatie, rollback en volgende werkpakketten

De overdrachtsafspraak vraagt een afzonderlijke eigenaarspublicatiebeslissing voor main. Deze branch/PR verandert de live site niet. Na die beslissing: normale merge, Hostinger-deploy afwachten, vervolgens `scripts/check-live.cjs`, exacte assetcontrole en live SEO-audit tegen de nieuwe build. Het bestaande liveworkflow is uitgebreid met de nieuwe loader en twee publieke artikelen.

Rollback: revert de feature-merge via een normale PR. Geen force-push, database- of gegevensmigratie. Private opslag of configuratie niet wissen. Terugzetten van code verandert geen externe klantdata. Houd account-/sales-API, analytics en leadpilot uit.

| Volgende stap | Nog nodig | Acceptatie |
| --- | --- | --- |
| Vindbaarheid meten | Rechtstreekse bestaande Search Console-property of export; geen betaald tussensysteem vereist | Verificatie, sitemapstatus, URL-inspectie en echte nulmeting |
| Uitgaande TBT-pilot | Exacte SubsidieReady-exploitant/relatie en bevestigde TBT-ontvanger; concrete privacy-/contactreview en testontvangst | Eén vrijwillige kaart, geen dataoverdracht, juiste intake, bewezen ontvangst |
| Content uitbreiden | RVO-hercontrole isolatie/glas/ventilatie en bruikbare lokale zoekhulp | Zelfstandige uitleg vóór indexering; bron-/jaarversies zichtbaar |
| Brononderhoud | Bestaande handmatige bronchecker met menselijke inhoudsreview gebruiken | Verandering levert reviewtaak op, nooit automatische nieuwe subsidieregels |
| Statistiek/CRM | Goedkeuring van minimale events, lifecycle, retentie en entiteiten | Echte tellers/noemers; idempotente outbox en intrekking vóór verzending |
| Native accounts/leads | De relevante issue #5/#9-gates, hostingpersistence, mail, rollen/MFA en stagingbewijs | Afzonderlijke productie-GO; geen configtoggle als vervanging |

## 6. Primaire technische referenties

Geraadpleegd voor de implementatiekeuzes:

- [Google Search Central — sitenaam](https://developers.google.com/search/docs/appearance/site-names)
- [Google Search Central — breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google Search Central — noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google Search Central — sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [web.dev — LCP en het onderscheid tussen lab- en velddata](https://web.dev/articles/optimize-lcp)

De JSON-LD-controles bewaken structuur, inhoud en CSP. Ze zijn geen garantie dat een zoekmachine een bepaalde weergave, sitenaam of positie kiest.
