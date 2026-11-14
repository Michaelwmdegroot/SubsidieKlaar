# Premium regelingen-dashboard — visuele integratie en publicatie

14 november 2026. Eigenaar vraagt na beoordeling van twee screenshots en vier gemaakte GPT Images-assets: **“Laten we het nu bouwen op de website.”** Dit autoriseert de afgewerkte visuele integratie van PR #19 en publicatie na groene controles. De eerdere draft-only instructie voor de functionele dashboardpreview is voor deze visuele release vervangen; geen nieuwe toestemming voor backendactivatie.

## Wat verandert

- De bestaande 3-kolomswerkruimte blijft intact: maatregelen / situatie en gefilterde routes / één geselecteerde toelichting met bron en volgende stap.
- De witte/donkerblauwe/groene referentie is vertaald naar echte HTML/CSS: frisse groene gradients, dunne kaartenranden, beheerste schaduwen, grotere werkruimte, heldere SVG-iconen, directe geselecteerde staten, volledig gestileerde selectievakken en een bedienbare stappenbalk.
- Vier eerder in dit gesprek gegenereerde beelden zijn geïntegreerd als decoratieve, geoptimaliseerde lokale WebP-afgeleiden: woning, duurzaamheidsbadge, checklist/dossierillustratie en groene trust-check. De woning heeft twee resoluties. Alle 5 bestanden samen circa 211 KB, grootste bestand 119 KB. SHA-256 en herkomst in `DASHBOARD-ASSETS.json`.
- Essentiële koppen, labels, aantallen en bronuitleg blijven echte tekst. Geen screenshot als interface, geen rastertekst als enige toegankelijke uitleg.
- Geen fictieve €3.200/€1.200, '21% voordeel', nepbesparingen of 'meest relevant' claim overgenomen uit het visuele voorbeeld. De groene samenvatting toont het werkelijke aantal informatieroutes.
- Drie panelen op brede desktop; tot 1150 CSS-pixels afzonderlijke panelen via tabs, inclusief pijltjestoetsen/Home/End. Lange informatie scrolt alleen in het paneel. Hoofdscroll en horizontale overflow niet aangetroffen in de geteste maten.
- De websiteheader heeft op mobiel alleen leesbare bediening; Mijn plan blijft in het native menu. Geen geplette actieknoppen.
- Stappenbalk richt focus op echte keuzes/profiel/resultaat. Viewporthoogte volgt resize/visualViewport, zonder de vaste export-/planknoppen weg te drukken. Verminderde animatie blijft gerespecteerd.

## Ongewijzigde veiligheids- en inhoudsgrenzen

Geen verandering aan regelengine, fiscale voorwaarden, subsidie-/leningsonderscheid, brondata of disclaimers. Geen centrale opslag, trackingaanpassing, accountinschrijving, upload, email of leadcreatie. `server/`, `api/`, `assets/core.js`, `assets/export.js`, `assets/metrics.js` en de accountgate blijven ongewijzigd. Regelingenantwoorden blijven geheugen-only, behalve de bestaande expliciete, eenmalige overdracht naar Mijn plan. Huidige productieaccount/sales-API blijft 503/fail-closed.

## Testbewijs vóór publicatie

- `npm run build`, `npm test`, `npm run package`, `npm run preview:next`: **148 tests pass, 0 fail, 0 skip** (140 dashboardbaseline + 8 premium-regressies).
- Chromium in-memory op de werkelijk gegenereerde pagina met dezelfde CSS/JS, assets en lettertype: **26 scherm-/formaatcombinaties** op 1680x1050, 1536x960, 1440x900, 1366x768, 1280x800, 1024x768, 768x1024, 390x844, 375x667, 360x740, 320x660 en 667x375. Geen hoofd-/horizontale overflow, ontbrekende beelden of JavaScript-fouten. Actiebalk bleef binnen viewport.
- 16 functionele browsercontroles: lege staat, voorbeeld, belastingwijziging, filters, bron-/jaarwaarschuwing, VvE, uitvoer-JSON, afdrukinhoud, toetsenbordtabs, mobiele menulink, route/detailovergang, reset en veilige no-JS fallback. Geen externe requests bij die geïsoleerde controles; metrics bewust niet geladen in de in-memory test.
- In-memory is geen werkelijke HTTP/CSP-/Safari-/telefoontest. HTTP-navigatie van de browser wordt door deze uitvoeromgeving geblokkeerd. Live bereikbaarheid, precieze bytes, headers en gesloten API worden afzonderlijk door GitHub Actions gecontroleerd na Hostinger-deploy.
- De bestaande warmtepomp-PDF/ZIP-regressies blijven groen. Met de printtest wordt de browser-printactie en inhoud gecontroleerd, niet een nieuw gegenereerd PDF-document.

## Publicatieproces

Werk op de bestaande `feat/regelingen-dashboard-one-screen` / PR #19, vanaf head `7e1787e87434750e09acd54d23a3573176a776fb`. Geen auto-overwrite van concurrent main-werk. Bronbestanden aanpassen, normaal opnieuw bouwen, gegenereerde pagina en versie committen. Versiehash bevat ook de nieuwe beeldbytes. Beeldmanifest en tests bewaken koppeling bron/optimalisatie.

Na succesvolle quality/release op exacte head: PR ready maken, squashmerge naar main en de bestaande Hostinger-koppeling volgen. Geen DNS-, mail-, account-, kosten- of hostingconfiguratie wijzigen. Livecontrole omvat de bestaande 63 checks plus 5 extra byte-exacte nieuwe visuals (verwacht 68 checks). Claim live pas als de nieuwe build en de bestanden werkelijk zijn bevestigd. Rollback is revert van de squashcommit; geen datamigraties betrokken.

## Onderhoud

De nieuwe visuele CSS is bewust alleen gescopeerd op `.regelingen-page` / `body.r-dashboard-ready`; andere websitepagina's en werkbanken behouden hun huidige opmaak. Inhoud blijft geversioneerde regelcode. Blijf toekomstige bronupdates afzonderlijk inhoudelijk toetsen; deze release verandert die regels niet.
