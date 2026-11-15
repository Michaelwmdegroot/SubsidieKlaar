# SubsidieReady — SEO-operatie en meetbewijs

**Laatste technische controle:** 16 november 2026. **Productiecode:** GitHub main na accountfix #32.  
**Nieuwe bewaking:** `.github/workflows/seo-weekly.yml`, read-only elke maandag 06:17 UTC en handmatig te starten via GitHub Actions. Geen hosting- of betaalde dienst nodig.

## 1. Wat automatisch wordt gecontroleerd

- De échte HTTPS-site, sitemap.xml en robots.txt worden zonder cookies, formulieracties, tracking of ingelogde sessies gecrawld.
- Maximaal 60 routes, maximaal 2 MB per pagina, gecontroleerde time-outs en alleen eigen site; geen externe bron- of persoonsgegevenscrawls.
- Indexeerbare routes: status, canonicals, titels, descriptions, unieke H1, schema-aanwezigheid, links en ankers, noindex-contradicties.
- Proefroutes (Mijn plan, advies, sales, bronbeheer) blijven apart als bewust noindex bewaakt.
- Een tijdelijk netwerkprobleem krijgt één nieuwe poging. Daarna wordt de uitkomst als niet-geslaagd bewaard, niet als automatisch opgelost.
- Een JSON-bewijsbestand `qa/seo-live.json` wordt als GitHub Actions-artifact 30 dagen bewaard. De workflow wijzigt geen code, regels, account, database of instellingen.

**Deze controle zegt NIETS over daadwerkelijke Google-indexering, klikvolume, zoekwoorden, rankings of mobiele Core Web Vitals.** Voor die feiten is directe Google Search Console nodig.

## 2. Gratis Search Console — nog niet bevestigd

- Property `subsidieready.nl`: eigendom **niet onafhankelijk vastgesteld**.
- Sitemap `https://subsidieready.nl/sitemap.xml`: bevat op 15/16 november 2026 **15 publieke URL's** volgens code en live acceptatie.
- Eigenaarsindiening en Google-verwerking: **niet bevestigd**.
- Klantverkeer, impressies, klikken, crawlproblemen, Search Console Coverage en prestaties: **nog niet gemeten**.
- GSC Wizard-connector geeft `payment_required`; er is **geen abonnement** genomen. De officiële Google Search Console is apart toegankelijk via https://search.google.com/search-console/.

**Eenmalige eigenaaractie, zonder nieuwe infrastructuur:** open Search Console, kies of verifieer de domeinproperty, ga naar *Sitemaps*, dien `https://subsidieready.nl/sitemap.xml` in als dit nog niet is gebeurd. Gebruik *URL-inspectie* voor homepage, /regelingen/, /subsidies/ en de twee uitgebreide btw-artikelen. Leg datum, propertytype, sitemapstatus, geïndexeerde URL's, kliks en impressies apart vast. Geen screenshots van accountgegevens/secrets in issues.

Google legt zelf uit dat een sitemap een ontdekkingshint is en **geen garantie op indexering of positie**:
- https://support.google.com/webmasters/answer/7451001?hl=nl
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## 3. Redactionele kwaliteitsgrenzen

- Verifieer iedere nieuwe subsidie-, btw- of financieringsclaim aan de officiële instantie, met geraadpleegde versie en reviewer. Alleen technische SEO-automatisering mag zonder inhoudelijke review publiceren.
- RVO's bron over **ISDE 2027** noemt op 12 november 2026 de wijzigingen nog **voorgenomen**. Verwerk deze niet als definitief totdat RVO die status wijzigt. Bron: https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027.
- De interne redactionele hercontrole staat voor 14 december 2026; dit is geen wettelijke termijn.
- Publiceer geen honderden lokale pagina's met onbekende gemeentelijke dekking. Eerst nuttige onderwerppagina's met bewijschecklists en echte vervolgstap naar de gratis tools.
- Een account of toolbezoek is geen commerciële lead en wordt nooit automatisch gedeeld met sales.

## 4. Gebruik van de wekelijkse check

**Bekijk:** GitHub → Actions → *SubsidieReady weekly technical SEO monitor*. Bij fouten: download het JSON-artifact en onderscheid echte fouten van onbereikbare host (unknown). Los een definitieve fout in een aparte PR op, voer de gewone quality/release/browser-tests uit en bevestig de nieuwe livecheck. De wekelijkse audit mag geen inhoud van RVO, Belastingdienst of kredietverstrekkers automatisch aanpassen.

**Bewijshiërarchie:** groene CI ≠ live SEO; live crawl ≠ Google indexering; Search Console-weergaven ≠ leadkwaliteit; een aanmelding ≠ een verifieerbare saleslead.
