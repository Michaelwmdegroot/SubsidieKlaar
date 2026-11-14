# Regelingencheck geïntegreerd in de bestaande website

14 november 2026. De eigenaar keurde het werkende prototype goed en vroeg expliciet om integratie met de bestaande website en samenvoegen naar `main`. Dit is de publieke integratiestap van PR #13, niet activering van accounts, documentenopslag of leadopvolging uit draft PR #11.

## Wat deze release bevat

- De homepage introduceert de brede regelingencheck en behoudt een duidelijke ingang naar de bestaande warmtepompwerkbank.
- `/regelingen/` is een echte, vooraf opgebouwde pagina met gedeelde header/footer en afzonderlijke lokale JavaScript/CSS. Geen ingebedde losse demo of iframe.
- `/subsidies/`, `/btw/` en `/financiering/` bieden rechtstreeks leesbare informatie, officiële bronnen en aansluiting op beide tools.
- Navigatie, kennisbank, bronnen, over-pagina, privacy, 404 en sitemap zijn bijgewerkt. Oude artikel-URLs en `/#dossier` blijven werken. `/#voorbeeld` opent het fictieve warmtepompvoorbeeld.
- Bij de regelingencheck werken voorbeeld, lokale JSON-download, print en het ongeldig maken van een resultaat zodra antwoorden veranderen. De warmtepompwerkbank opent vanuit een resultaat in een nieuw tabblad, zonder antwoorden in URL of overdracht.
- De scanner stuurt geen antwoorden, KOR-/gebruikskeuzes of fiscale informatie naar server/analytics. Alleen de bestaande afzonderlijke opt-in gebruikstellingen blijven aanwezig; deze release activeert ze niet.
- De gegenereerde `assets/regelingen-engine.js` is bytegelijk aan de geteste bron in `scripts/regelingen-engine.cjs`. Inhoud wordt niet dubbel onderhouden.

## Uitdrukkelijke grenzen

Twaalf **informatieroutes**, geen toekennings- of bedragencalculator. Lening, btw en subsidie zijn gescheiden. Andere jaren, verlopen broncontrole en bijzondere situaties vragen aanvullende verificatie. Lokale dekking is onvolledig. De complete documentenwerkbank is nu alleen voor warmtepompen.

Financiering blijft algemene informatie met officiële links. Geen inkomen, BKR, loonstroken, kredietaanvraag, productselectie op financiële situatie of aanvraagdoorgifte. Geen sales/marketing geactiveerd. De online account- en multi-maatregel-dossierplannen blijven aparte werkzaamheden.

## Inhoudelijke hercontrole vóór deze code-release

De officiële publieke bronnen zijn op 14 november 2026 opnieuw geraadpleegd voor PV 0% / PV 21%, thuisbatterij-btw, isolatiearbeid, ventilatie/isolatiecombinatie, Maatregel 29, Warmtefonds, SVn en voorgenomen ISDE 2027. Belangrijkste onderscheidingen uit het prototype blijven behouden. De algemene fiscale/financieringsinformatie is geen persoonlijk advies of juridisch conformiteitscertificaat. Gepersonaliseerde financieringsdiensten vereisen eerst afzonderlijke kwalificatie; issue #16 blijft voor dat verdere werk relevant.

Bronnen staan in `V2-REGELINGEN-PLATFORM.md` en in de publieke `/bronnen/`-pagina. Bronreview uiterlijk 14 december 2026 is een interne onderhoudsdatum, geen wettelijke vervaldatum. Geen automatische bronaanpassingen of nieuwe monitoringtaak geactiveerd.

## Verificatie

- `npm run build`, `npm test`, `npm run package`: 87 tests pass, geen failures/skips. Inclusief de 57 oorspronkelijke tests, 20 routeverkenner-tests en 10 integratietests.
- Het Hostinger-pakket bevat 45 webbestanden; de nieuwe publieke pagina's en assets zijn opgenomen. Geen private configuratie, klantdocumenten, accounts, logs of testuitvoer.
- 86 in-memory Chromium viewport/schermcombinaties: 12 publieke pagina's op 1440/1024/768/390/360/320px (72), resultaten van de check op dezelfde 6 breedtes, vier werkbankstappen op 1440/390px (8). Geen horizontale documentoverflow.
- Voorbeeld, echte lokale JSON-download, wijziging van antwoorden, 2027-waarschuwing, VvE-verwijzing, mobiele navigatie en werkelijke synthetische PDF/ZIP-downloads gecontroleerd. ZIP-integriteitscontrole slaagt. Geen JavaScript-fouten of netwerkverzoeken in deze geïsoleerde visuele/functionele test.
- Zonder JavaScript blijft de informatie leesbaar en staat het scanformulier uit, zodat antwoorden niet ongemerkt als query naar de server worden gestuurd. De scanner wordt pas na installatie van zijn eventhandlers aangezet.
- Exacte source bytes van warmtepomp-core/export, API, metrics en server/auth zijn onveranderd. De UI waarschuwt nu ook voor onopgeslagen invulgegevens zonder bestanden bij het verlaten van de werkbank.

**Testbeperking:** HTTP-browsernavigatie is in deze uitvoeromgeving geblokkeerd. Chromium gebruikte de werkelijke pagina- en scriptbytes in geheugen met lokale assets ingevoegd en metrics niet geladen; alleen in de testcontext bestaat een UUID-shim. Dit is geen Safari-, fysieke telefoon- of productie-CSP-certificering. Lokale statische linkchecks bewaken de verbindende URLs. Live HTTP/asset-acceptatie volgt afzonderlijk na de merge en Hostinger-deploy.

## Release en rollback

Werk via PR #13 en merge pas na groene GitHub quality/release-controles op de exacte nieuwe head. De eigenaar heeft publicatie geautoriseerd. De bestaande Hostinger-koppeling volgt `main`; geen DNS-/hostingconfiguratie of nieuwe kosten nodig.

De livecontrole is uitgebreid met de 4 nieuwe pagina's en byte-exacte controles van de nieuwe JS/CSS/HTML naast het bestaande logo en de beelden. Kijk naar het nieuwe `version.json` build-ID; een oude groene run is geen bewijs voor deze release. Een tijdelijke mislukking door nog lopende deployment moet opnieuw tegen dezelfde merge worden gecontroleerd, niet genegeerd.

Rollback: de vorige `main`-release `19f34e3d7d4f735c94ac638eec382aacc024cedb` herstellen. Er zijn geen datamigraties of private opslagwijzigingen. Backoffice en optionele meting blijven volgens de bestaande configuratie werken.
