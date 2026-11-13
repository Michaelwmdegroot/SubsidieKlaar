# Release-gates: van concept naar een publieke SubsidieKlaar

Stand: 14 november 2026. Werknaam **SubsidieKlaar**; de definitieve merk- en domeinkeuze is **niet genomen**. Dit is een operationele checklist, geen verklaring dat productie klaar is.

## Veilig doorontwikkelen

- `main` bevat concept v0.1 (basiscommit `8da5d2c`).
- Wijzigingen lopen via kleine, controleerbare commits en bij voorkeur een pull request.
- GitHub Actions voert `npm test`, `npm run build` en een vergelijking van de gegenereerde standalone HTML uit.
- De lokale bronapp en het downloadbare HTML-concept moeten functioneel gelijk blijven. Wijzigingen aan `index.html`, `assets/` of `vendor/` vereisen opnieuw bouwen en committen van `concept/SubsidieKlaar-concept.html`.
- De checks bewaken `noindex` totdat de eigenaar expliciet besluit te lanceren. Bij lancering worden deze tests bewust herzien; niet stilzwijgend verwijderd.
- Geen echte klantgegevens, tokens, wachtwoorden of testdossiers committen.

## Gate A — concept en merk

- [x] Werkende vierstappenflow, fictieve demo, PDF/ZIP en lokale opslagoptie.
- [x] Bronnen- en juridische grenzen beschreven.
- [ ] Eigenaar beoordeelt UX en gebruikersflow.
- [ ] Definitieve merknaam kiezen; SIDN-status **opnieuw** controleren en handelsnaam-/merkencheck doen.
- [ ] Definitief domein registreren (geen aankoop in deze fase).

## Gate B — inhoud en veiligheid

- [ ] Kort vóór lancering officiële RVO-bronnen hercontroleren en datum in app, PDF, HTML, README en bronnenregister consequent bijwerken.
- [ ] Voorgestelde 2027-regels niet als geldend recht behandelen; zo nodig een nieuwe, gedateerde regelversie maken.
- [ ] Uitvoer en checkresultaten laten controleren met uitsluitend geanonimiseerde, toegestane dossiers.
- [ ] Toegankelijkheid met toetsenbord en schermlezer toetsen, inclusief dialogen, validatie en foutmeldingen.
- [ ] File-import en ZIP/PDF uitvoer testen voor ongeldige of zeer grote bestanden en onverwachte Unicode.
- [ ] Testen op mobiele browsers, Safari, Firefox en Chromium.
- [ ] Privacyverklaring en bewaartermijnen uitwerken vóór centrale tracking of accounts.

## Gate C — hosting en release

- [ ] Gekozen Hostinger-plan, documentroot, statische assets en eventuele PHP/databaseondersteuning vaststellen.
- [ ] HTTPS, redirects, back-up/herstel, foutafhandeling en rollback aantoonbaar testen.
- [ ] Deploy van GitHub `main` naar staging/releasepad verifiëren zonder de site voortijdig te indexeren.
- [ ] Security-headers beoordelen voor bronversie en standalone HTML; CSP mag de ingebedde scripts niet onbedoeld blokkeren.
- [ ] Alleen na inhoudelijke en technische releasegoedkeuring: `noindex` verwijderen, `robots.txt` aanpassen, canonicals/sitemap/Search Console koppelen en de release-gate tests actualiseren.
- [ ] Controleren dat algemene bronnen, beheerschermen en gebruikersdossiers correct worden onderscheiden voor indexering.

## Gate D — centrale analytics en beveiligde backoffice

De huidige backoffice meet **alleen activiteit van de eigen browser**. Deze cijfers zijn geen bezoekersaantallen van de website.

Ontwerpkeuzes vóór implementatie:

1. Verifieer hostingmogelijkheden; voorkeur voor kleine self-hosted PHP-backend met passende database, **geen verplichte betaalde SaaS**.
2. Ontwerp aggregaten voor paginaweergaven, gestarte dossiers, stappen, voortgang en downloads. Nooit namen, adressen, meldcodes, factuurinhoud of bestandsnamen in analytics versturen.
3. Kies een passende cookieloze/consentstrategie op basis van de Nederlandse privacy- en cookieregels en beschrijf het openbaar. Vraag toestemming waar noodzakelijk.
4. Beperk logs, dataminimalisatie en bewaartermijnen. Beveilig beheer met sessies, CSRF-controles, wachtwoordhashing, rate limiting en audit.
5. Vertrouw geen clientside ingestuurde cijfers als unieke personen of omzet. Rapporteer `events`, `sessies` en `bezoekers` alleen met aantoonbare definities.
6. Houd documentverwerking volledig lokaal. Serverupload vereist een nieuw en expliciet ontworpen beveiligings- en bewaarbeleid.
7. Voor ChatGPT-beheer later: read-only API eerst, expliciete scopes, authenticatie, auditlog; geen openbare admin-API.

De analytics- en backofficecode wordt niet publiek geactiveerd zolang deze gate niet bewezen is.

## Gate E — SEO en verdienmodel

- [ ] Nuttige, brongecontroleerde hulppagina's voor factuur, betaalbewijs, meldcode en ontbrekende documenten.
- [ ] Metadata, schema, interne links, performance en Search Console na domeinbesluit.
- [ ] De complete individuele documentencheck met PDF/ZIP blijft gratis en zonder registratie.
- [ ] Premium uitsluitend als extra waarde voor installateurs/teams: herhaling, samenwerking, sjablonen en workflow.
- [ ] Advertenties en sponsordeals beoordelen op transparantie, onafhankelijkheid en privacy; niet opnemen in vertrouwelijke dossierschermen.

## Handmatige GO/NO-GO bij lancering

Een groene CI-run bewijst uitsluitend dat de geautomatiseerde controles slagen. **Een groene CI-run is geen live-releasetoestemming, juridisch subsidiebesluit of RVO-certificering.** De eigenaar bevestigt afzonderlijk de definitieve naam, privacy, inhoud, hosting en de publieke SEO-lancering.
