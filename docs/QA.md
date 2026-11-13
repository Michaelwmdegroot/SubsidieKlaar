# Verificatie concept v0.1

Uitgevoerd op 13 november 2026. Alleen fictieve invoer en synthetische documenten gebruikt.

## Geautomatiseerd

`npm test`: **20 tests geslaagd, 0 mislukt**.

- Kalendermaanden, maandultimo, schrikkeldagen, aanvraagtermijn en toekomstige installaties.
- Situaties buiten de scope, ontbrekende gegevens, meldcoderoute en technische-documentatieroute.
- Winkelbetaling met als betaald gemarkeerde factuur en meerdere betalingen in gehele centen.
- Begrensde JSON-import, veilige archiefpaden en bescherming tegen invoer die als HTML zou worden geïnterpreteerd.
- Echte PDF-generatie, Unicode-HTML en byte-identieke originele bestanden in ZIP.
- Geen externe upload-, AI- of analyticsaanroepen in de applicatiecode.
- Zelfstandige HTML-build: alle zeven ingebedde modules kunnen worden geparseerd; licentieteksten staan buiten de scripts.

## Interactieve browsercontrole

- Homepage, vier stappen, voorbeeldroute en lokale backoffice op desktop bekeken.
- Mobiele invoer op een 390 pixels brede testweergave gebruikt; geen horizontale documentoverflow.
- Een echte PDF kon worden toegevoegd. Een tekstbestand met `.pdf`-extensie werd geweigerd; het geldige bestand bleef aanwezig.
- Een wijziging van het model wist de eerdere bevestiging van de meldcodematch.
- De bronversie én het zelfstandige HTML-bestand maakten echte PDF- en ZIP-downloads.
- Het laatste PDF-overzicht bevat vier leesbare pagina's, op elke pagina een duidelijke fictief-voorbeeldmarkering. De paginaovergang bij de documentencheck is visueel gecontroleerd.
- De laatste ZIP heeft een geldige integriteitscontrole en bevat PDF, HTML, project-JSON, bestandenindex, toelichting en drie originele voorbeeldbijlagen.
- Backoffice-tellingen veranderden na starten en downloaden. De interface benoemt expliciet dat dit lokale browsersessies zijn, geen centrale bezoekerscijfers.

## Bekende grenzen

Dit is een werkend productconcept, geen productieverklaring. Het concept leest bewijsstukken nog niet inhoudelijk, verifieert meldcodes niet automatisch en beoordeelt geen aanspraak op subsidie. Het heeft geen centrale authenticatie, serveranalytics, automatische bronupdates of ChatGPT-beheerverbinding. Originele bestanden worden niet opgeslagen na het sluiten van de pagina. De publieke hosting en definitieve domeinnaam zijn nog niet aangesloten.

De zelfstandige HTML is via de beheerde browserpreview getest. Het bestand bevat zijn benodigde scripts, stijlen, font en icoon; er zijn geen externe runtime-afhankelijkheden. Gedrag van lokale downloads en opslag kan per browserinstelling verschillen.

Screenshots: [homepage](preview-home.jpg) en [backoffice](preview-backoffice.jpg). De getoonde tellingen zijn afkomstig van de testsessies.
