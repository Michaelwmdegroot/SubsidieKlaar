# Regelingencheck — één-scherm dashboard (ontwerp- en testrelease)

**Aanleiding:** eigenaarsscreenshots 14 november 2026 van `/regelingen/`: lange situatiecheck, grote teksten, uitgebreide resultaatkaarten onder elkaar en veel verticaal scrollen. De gebruiker vroeg een duidelijke interactieve ervaring in één venster. **Deze wijziging is UX/productwerk, geen nieuwe wettelijke regeling of fiscale uitkomst.**

## Nieuw gebruikspatroon

- **Links:** direct één of meer verduurzamingsmaatregelen aanklikken. Door selectie verschijnen regelingen meteen, zonder doorsturen/submit.
- **Midden:** compacte profielvelden voor aanvragertype, woning, voortgang en jaar; relevante btw/KOR/batterijvelden verschijnen alleen waar passend. Onderin staat een filterbaar lijstje met route-info. Alle wijzigingen evalueren direct opnieuw.
- **Rechts:** één geselecteerde route met korte uitleg, *specifieke vervolgstap*, bijzondere waarschuwing en officiële bronnen. Andere routes openen met één klik. Warmtepompdocumentenwerkbank alleen waar de bestaande engine het toestaat.
- **Onderaan:** opslaan/afdrukken (lokaal), en een expliciete eenmalige overdracht van grof gekozen profiel en maatregelen naar **Mijn plan**. Dat laatste vraagt een klik en schrijft niet automatisch naar een server.
- **Mobiel/tablet:** drie duidelijk benoemde schermen ‘Jouw keuzes’, ‘Regelingen’, ‘Uitleg’; één zichtbare tegelijk, sticky onderaan. Geen lange hoofdpagina. Binnen een paneel kan, als veel informatie aanwezig is of het toestel klein is, alleen die paneelinhoud scrollen.
- **Geen JS:** formulier blijft disabled en verwijst naar gewone informatiepagina’s. Er worden geen formulierantwoorden via GET verstuurd.

## Wat bewust niet verandert

- Officiële regel-engine `scripts/regelingen-engine.cjs` blijft bytegelijk. `source_checked`, vervaldatum, verschillen tussen subsidie/btw/lening, KOR, uitzonderingen en lokale dekking blijven bestaan.
- De regelingencheck doet geen servercalls en heeft geen browseropslag, accountregistratie, inkomensvraag, tracking of verkoopflow. Resultaat-JSON bevat het gekozen globale profiel en wordt alleen na downloadklik lokaal opgeslagen.
- Alle routecards zijn nog **informatieroutes**, geen subsidietoekenning, fiscale afhandeling of persoonlijk kredietadvies.
- Bestaande warmtepompwerkbank, legacy projectimport, PDF/ZIP, PHP backend, account-/salesafscherming en Hostinger-inrichting blijven ongewijzigd.
- Oorspronkelijke HTML-template, CSS en browser-JS worden vervangen; de generator blijft gezaghebbend. Aanpassing van de next-build is beperkt tot het verwijderen van een vroeger onder de werkruimte appended tweede ‘Maak mijn plan’-sectie. De knop staat nu meteen in de dashboardactiebar.

## Reviewcriteria

1. Bij een normale desktopviewport (1280×800, 1440×900): alle drie de hoofdpanelen zichtbaar in het scherm, zonder hoofdpagina-scroll; de resultatenlijst en rechteruitleg mogen afzonderlijk scrollen voor langere inhoud.
2. Bij 390×844, 360×740 en 320×660: geen horizontale overflow of pagina-scroll; duidelijke tabs, enkel de actieve paneelinhoud scrollt indien nodig.
3. Selecteer de voorbeeldmaatregelen: routeaantal en gekozen maatregelen verschijnen direct, filter wisselt zonder pagina te verversen, klikken route verandert rechts de uitleg en bron.
4. Wijzig btw van 0% naar 21% en batterijgebruik van privé naar stroomhandel: status en waarschuwingen veranderen met de bron-engine; nooit onvoorwaardelijk teruggaafadvies.
5. VvE/zakelijk, onbekend jaar, Groningen/N-Drenthe en 2027 tonen passende verwijzing/waarschuwing, geen goedkeuring.
6. De downloadbare JSON en afdrukweergave bevatten alle actuele informatieroutes, niet alleen het huidige filter.
7. De knop ‘Maak mijn plan’ wordt pas actief bij geselecteerde maatregelen en vereist expliciete klik. Geen impliciete account, dossierupload of lead. Voor een gast blijft de bestaande warmtepompwerkbank gratis.
8. Test keyboard/tabnavigatie, focus, schermlezerlabels en native Safari/telefoon vóór eventuele merge op main.

## Technische tests

- `npm run build && npm test && npm run package`.
- Browser check in gecontroleerde Chromium in-memory context (echte lokale browsernavigatie is binnen deze agentomgeving geblokkeerd; test is dus geen HTTPS/CSP-certificaat). Onderzochte viewports: 1440×900, 1366×768, 1280×800, 1024×768, 390×844, 360×740, 320×660.
- QA-bestand `qa/dashboard-browser-check.json` registreert afmetingen, routeaantal, selectie en eventfouten. Geen persoonsgegevens.
- Bronstatus 14 november 2026; interne review voor 14 december 2026 blijft vereist. Geen automatische inhoudsupdate.

**Releasebeleid:** aparte design/UX-PR, eerst eigenaarstest, niet zelfstandig wijzigen naar `main`. De bestaande productievariant blijft zichtbaar totdat de eigenaar deze nieuwe dashboardervaring goedkeurt.
