# QA — SubsidieReady 1.0.0

Uitgevoerd met uitsluitend fictieve gegevens op 14 november 2026. Status: code/release getest; **Hostinger-deployment en live HTTPS nog niet geverifieerd**.

## Geautomatiseerd

`npm test`: **41 tests geslaagd, 0 mislukt** op lokale Node.js 22 en PHP 8.4. Inclusief de bestaande inhoudelijke regels, PDF/ZIP-integriteit en nieuwe productietests.

Nieuwe controles: indexeerbare gekozen domeinversie versus noindex offline; prerender en bestaande helpbestanden; lokale assets; headers; compatibele oude JSON; consistente snapshots tijdens async export; backend gesloten zonder config; beperkte publieke settings; method/origin/content-type/schema/size checks; dagtotalen; geen ruwe IP in telleropslag; unauthenticated export; CSRF; wachtwoord; sessierotatie; escaping; logout; begrensde login/event-aanroepen; opruiming; private opslag buiten webroot; CLI-only setup.

## Interactieve lokale browsercontrole

De omgeving blokkeert browsernavigatie naar HTTP en lokale bestanden. Daarom is de **exacte gebundelde standalone HTML met `set_content` in Chromium gerenderd**, met alleen een test-UUID-shim voor de beperkte `about:blank`-context. Dit is geen live netwerk- of HTTPS-browsertest.

Gecontroleerd: desktop-homepage, fictieve demo, vierstappenflow, echte PDF/ZIP/projectdownloads, legacy SubsidieKlaar-import, reset van factuurbevestiging bij modelwijziging, weigeren van een tekstbestand met .pdf-extensie, mobiele breedtes 360 en 390 pixels zonder documentoverflow, zeven statische informatiepagina’s. Geen page errors of externe netwerkverzoeken tijdens de lokale documentenflow.

De vier PDF-pagina’s zijn lokaal gerenderd en de derde pagina visueel gecontroleerd; fictief-markeringen en SubsidieReady-branding zijn aanwezig op elke pagina. ZIP-integriteitscheck slaagt; manifest en ongewijzigde voorbeeldbijlagen zijn aanwezig.

## Grenzen en resterende acceptatie

- Productieregels staan in `.htaccess`; ze moeten op het echte Apache/LiteSpeed-Hostinger-account worden bevestigd. De PHP-testserver valideert deze Apache-headers/rewrites niet.
- Native Safari, Firefox, schermlezer en live mobiele apparaten zijn nog niet getest.
- Geen penetratietest of juridisch conformiteitscertificaat. Geen garantie op subsidie.
- Configuratie, beheeridentiteit, bereikbaar e-mailadres, geheime sleutel, wachtwoord, hostinglogretentie, cron, backups en herstel worden op de echte hosting ingericht; geen waarden daarvoor zijn verzonnen.
- Centrale meting blijft zonder die configuratie uit. Statistieken zijn opt-in gebeurtenissen, geen unieke personen of sluitende conversiepercentages.

Zie `HOSTINGER-LIVE.md` voor de nog uit te voeren live acceptatie.
