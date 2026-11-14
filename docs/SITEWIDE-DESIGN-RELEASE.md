# Eén premium stijl voor heel SubsidieReady

14 november 2026. De eigenaar heeft de premium regelingencheck goedgekeurd en expliciet gevraagd dezelfde stijl direct op alle overige pagina's toe te passen. Baseline: main `c7a3d31e239ca1734674ad2c97457e054ffa7d2e`. Branch: `feat/sitewide-premium-design`.

## Wat verandert

- Eén gedeelde visuele laag `assets/site-theme.css`: kleuren, gradients, typografie, kaartvormen, shadows, knoppen, formuliervelden, focus, responsieve navigatie, desktop/mobile en print.
- Homepage: dezelfde goedgekeurde woningvisual, vrijstaande dossierkaart, consistente voordeel-/stappen-/kennisbankkaarten, contrasterende CTA's en footer. De daadwerkelijke content blijft leesbare HTML.
- Subsidies, btw, financiering, alle bestaande en vier nieuwe helpartikelen, privacy, bronnen, over en 404: gedeelde beeldrijke header, kruimelpad, semantische secties, inhoudsnavigatie en expliciete vervolgstap. Bronnen/voorwaarden staan ongewijzigd op de pagina.
- Mijn plan en zijn vier panelen: dezelfde kaarten, groene tabnavigatie, semantische SVG-maatregeliconen, projectkaarten, actielijsten, formulieren en exports.
- Warmtepompwerkbank: dezelfde groene stappenbalk, dossierillustratie, invoervelden, geselecteerde opties, resultaatkaart en dialoogvensters. De vier stappen en alle gegevensfuncties blijven intact.
- Salesdemo, inactieve adviesomgeving, bronbeheer en beheer/login: dezelfde huisstijl; geen echte data of functies geactiveerd.
- De kennisbank linkt nu ook naar de vier al aanwezige voorbereidingsartikelen. De bestaande noindex-status van die pagina's blijft staan. Geen nieuwe regeling of wettelijke claim toegevoegd.
- Header, mobiel menu en footer verbinden Mijn plan en alle informatieroutes. Actieve paginamarkering is ook zonder JavaScript beschikbaar. Het goedgekeurde regelingen-dashboard behoudt zijn viewportgedrag en eigen componentstyling.

## Implementatie en beheer

`site-design.cjs` wordt door de bestaande buildgenerators gebruikt, niet als nieuwe netwerkafhankelijke runtime. De CSS wordt éénmaal lokaal geladen per pagina. Geen nieuwe bibliotheken, betaalde dienst, externe fonts of AI-API. De bestaande GPT Images-afbeeldingen worden hergebruikt; geen nieuwe afbeeldingen geproduceerd of ongeverifieerde voorbeeldbedragen overgenomen.

Alle gegenereerde pagina's komen uit hun brongeneratoren. De zelfstandige HTML-builds nemen het gedeelde ontwerp en decoratieve beelden inline mee, zodat ze offline blijven. `scripts/package.cjs` neemt de nieuwe CSS via de bestaande assets-allowlist mee.

## Wat inhoudelijk niet verandert

SHA256-regressietests bewaken byte-identieke subsidie/btw-route-engine, warmtepompkern/export, metrics, multi-maatregelmodel, checklistregels, plan-bridge, cloudclient, API- en serverimplementaties en de saleslogica. De warmtepomp-/plan-UI verandert uitsluitend markup/iconen. In de admin-PHP zijn alleen lokale CSS-links toegevoegd; een test verwijdert die links en eist exact dezelfde oorspronkelijke bytes.

Geen cookies, opslagkeuzes, mail, accounts, cloudbijlagen of sales activeren. Geen inkomensgegevens, nieuwe subsidie-/belastingberekeningen of wijzigingen aan bron-/controledatums. `SR_NEXT_CONFIG` blijft niet ingesteld, de productiedomeingate blijft bestaan, en liveacceptatie moet 503/configured:false bevestigen. Een ontwerp is geen beveiligings- of juridisch certificaat.

## Uitgevoerde verificatie

- Build, test, package en offline previews lokaal geslaagd: **160 tests pass, 0 fail, 0 skip** (148 bestaande + 12 nieuwe gedeelde-stijltests).
- **132 layoutcontroles**: 22 pagina's op 1440×960, 1280×800, 1024×768, 768×1024, 390×844 en 320×740.
- **36 aanvullende scherm-/toestandcontroles**: alle vier warmtepompstappen en planpanelen, salesdemo en het behouden dashboard. Totaal **168**, zonder horizontale overflow of ontbrekende afbeeldingen.
- **15 functionele controles**: echte lokale PDF/ZIP/projectdownloads, plan-JSON/ZIP, ongeldig maken van handmatige bevestigingen na een wijziging, fictieve sales, behoud gesloten cloud, mobiele navigatie, inhoudsankers en reduced-motion. ZIP-integriteit en demo-labels gecontroleerd.
- Geen JavaScript-fouten of externe requests in deze geïsoleerde visuele test. Bestaande tests gebruiken apart echte tijdelijke lokale PHP-requests met synthetische data.
- Primaire foreground/backgroundcombinaties en groene gradient-endpoints worden op contrast getest. Dit is geen volledige WCAG-audit.

### Testgrens

Browsernavigatie naar HTTP/localhost wordt hier geblokkeerd met `ERR_BLOCKED_BY_ADMINISTRATOR`. De visuele suite rendert de **echte gegenereerde HTML/CSS/JS** in geheugen en gebruikt een expliciete offlineflag; de admin-HTML komt uit een ongeconfigureerde PHP-uitvoering met synthetische HTTPS-omgeving. Dit is **geen** native Safari/Firefox/telefoontest of volledige live CSP-browsercertificering. Elke nieuwe in-memory pagina krijgt een nieuw browserdocument, zodat eventhandlers uit eerdere scenario's niet blijven hangen.

Reproduceerbare aanvullende tests (vereisen beschikbare Chromium en Playwright; geen productie-afhankelijkheid):

```sh
npm run build
npm test
npm run package
npm run preview:next
ONLY_LAYOUT=1 python scripts/sitewide/browser_check.py
ONLY_FUNCTIONS=1 python scripts/sitewide/browser_check.py
```

## Publicatie en rollback

Merge pas na groene quality/release op de definitieve head; de eigenaar heeft deze visuele publicatie gevraagd. Hostinger volgt main. Geen DNS, hostinginstellingen of nieuwe accounts nodig. De bestaande livecontrole wordt uitgebreid met de gedeelde CSS, alle gewijzigde artikelen en publieke HTML-bestanden. Exacte hashes, PHP/headers, het gesloten beheer en de ongeconfigureerde account-API moeten groen zijn vóór een liveclaim.

Een eventuele rollback gebeurt met een normale revert van deze visuele merge, niet door een branch geforceerd terug te zetten. Er is geen data-/schema-/opslagmigratie in deze release. Publicatieresultaten en de uiteindelijke merge-SHA worden aan de PR toegevoegd.
