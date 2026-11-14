# SubsidieReady — volledige visuele vernieuwing

14 november 2026 · Basis: `523f953d2e97410e138cc86d9c1ec49aa46f3e86` · Visuele build: `5dafe5e90928c9e8`.

## Opdracht en ontwerp

De eigenaar gaf een screenshot van de bestaande website en een gewenste beeldrijke, wit/donkerblauw/groene richting. Dit is een implementatie van die richting in de bestaande website, geen screenshot die over de werkende interface is geplakt.

Aangepast: header/merkbeeld/mobiel menu, volledige homepage, vier dossierstappen, voortgangszijbalk, documentvakken, resultaten, dialogen, alle zeven informatiepagina’s, foutpagina, footer en de bestaande beheerinterface. De website gebruikt systeemlettertypen; er is geen externe fontdienst toegevoegd.

De woningvisual is in deze chat gegenereerd en als lokale WebP opgenomen: `assets/images/home-hero.webp` (1440×960, 199066 bytes) en `home-hero-small.webp` (800×533, 57994 bytes). Het is een illustratie, geen klantproject. De homepage vermeldt dit. Logo en UI blijven echte SVG/HTML/CSS. De productieversie laadt de beelden vanaf het eigen domein; de zelfstandige HTML sluit beide beelden in.

De voorbeeldtekst over maximale subsidie, automatische controle en meerdere maatregelen is bewust niet overgenomen. De tool blijft documentenvoorbereiding voor warmtepompen; er is geen nieuwe subsidiegarantie, OCR, upload, isolatieroute of automatische indiening geïntroduceerd.

## Niet veranderd

`assets/core.js`, `assets/export.js`, `assets/metrics.js`, `server/` en `api/` blijven inhoudelijk en bytegelijk aan de basiscommit. Importcompatibiliteit, gebruikersbevestigingen, fictief-markeringen, originele bestanden en het gesloten beheer blijven intact. Alleen de HTML-presentatie in `admin/index.php` is aangepast. Analytics is niet geactiveerd. Geen klantgegevens, nieuwe accounts, betaalde services of hostinginstellingen gewijzigd.

## Verificatie

- `npm run build`, `npm test`, `npm run package`: 57 tests geslaagd, 0 mislukt, 0 overgeslagen. Dit zijn 51 bestaande controles plus 6 checks voor de visuele release.
- Chromium in-memory: homepage en vier dossierstappen bij 1440, 1024, 768, 390, 360 en 320 pixels; alle zeven informatiepagina’s bij 1440, 390 en 320 pixels. 51 scherm/breedte-combinaties zonder horizontale documentoverflow.
- Demo, PDF, ZIP, projectdownload, projectimport, bevestiging-reset na modelwijziging, Escape op de dialoog en mobiel menu gecontroleerd. Geen JavaScript-page-errors in deze flow.
- De zelfstandige testflow deed geen netwerkverzoeken. Dit is geen vervanging van een aparte productiecontrole van toestemming/telemetrie.
- PDF-download: vier pagina’s gerenderd en visueel gecontroleerd. ZIP-integriteitscheck geslaagd; drie oorspronkelijke fictieve bijlagen aanwezig.
- Native details-menu en reduced-motion behouden. Primaire knop-/tekstkleuren getoetst op minimaal 4,5:1 contrast; dit is geen volledige toegankelijkheidsaudit.

De uitvoeromgeving blokkeert HTTP-browsernavigatie. Browsercontrole is daarom uitgevoerd met de echte gegenereerde zelfstandige HTML in geheugen; alleen de testharness vult `crypto.randomUUID` aan voor die context zonder secure origin. Productiecode bevat die shim niet. Safari, echte telefoons en productieheaders moeten afzonderlijk gecontroleerd worden. Alle testgegevens zijn fictief.

## Publicatie

Via aparte branch en pull request; pas na groene quality/release CI naar `main`. Hostinger volgt de bestaande `main`-koppeling. Publicatie pas als bevestigd benoemen wanneer het echte domein build `5dafe5e90928c9e8` retourneert. De afzonderlijke live-acceptance controle moet na deployment met de **nieuwe** verwachte versie worden uitgevoerd; een rerun van een oude commit verwacht de oude build en is geen juiste acceptatietest voor deze release.

Rollback: herstel de vorige commit/release; private configuratie buiten de webroot blijft staan. Geen datamigratie.
