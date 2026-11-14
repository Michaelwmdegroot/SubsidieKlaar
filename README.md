> **Nieuwe ontwikkelbranch: next-level testrelease.** Nog niet naar `main` mergen. Start bij [de testhandleiding](docs/next/TESTEN.md) en [de releasegrenzen](docs/next/RELEASE-STATUS.md). De onderstaande 1.0-beschrijving betreft de bestaande productie-basis.

> **3.0 proefrelease voor beoordeling:** de eigenaar heeft gevraagd de nieuwe gebruikersinterface op `main` te zetten om het als complete website te testen. `/mijn-plan/` biedt lokale plan-/werkbankfuncties. `/advies/`, `/sales/` en `/bronbeheer/` zijn noindex proefpagina's; de salesdemo is fictief. **Accounts, online bijlagen en echte adviesaanvragen zijn op `subsidieready.nl` niet geactiveerd.** De nieuwe API moet daar 503 retourneren. Zie `docs/next/RELEASE-STATUS.md` en `docs/next/SECURITY.md`. De bestaande gratis warmtepompwerkbank blijft intact.


# SubsidieReady

Gratis regelingenverkenner voor verduurzaming, met een aparte documentenwerkbank voor eigenaar-bewoners die een ISDE-warmtepompaanvraag voorbereiden. **Definitieve naam: SubsidieReady. Domein: `subsidieready.nl`.**

Versie **1.0.0**, 14 november 2026. De eigenaar heeft het concept goedgekeurd, `SubsidieReady.nl` gekocht en om publicatie gevraagd. De code is voorbereid voor Hostinger. **Een geslaagde build is niet hetzelfde als een bevestigde live deployment.** Zie [de actuele overdracht](docs/DEVELOPMENT-HANDOFF.md).

## Geïntegreerde regelingenomgeving

De publieke site heeft een brede ingang naar `/regelingen/`, `/subsidies/`, `/btw/` en `/financiering/`. De bestaande warmtepompwerkbank op `/#dossier`, oude helpartikelen en PDF/ZIP blijven behouden. De regelingencheck bevat twaalf informatieroutes, geen recht-op-geldberekening of kredietadvies. De persoonsgegevensvrije check, gedeelde navigatie en publicatiechecks zijn beschreven in [de integratienotitie](docs/REGELINGEN-LIVE-INTEGRATION.md).

Accounts en eigen sales uit ontwerp-PR #11 zijn hiermee niet geactiveerd.

## Voor bezoekers

Vier stappen: situatie → installatiegegevens → documenten → overzicht. De volledige individuele check, PDF, ZIP en projectexport blijven gratis en zonder account of e-mailadres. Originele bestanden en ingevoerde dossiergegevens blijven in de browser. Er is geen documentupload, betaalde AI-API, DigiD-koppeling of automatische subsidiegoedkeuring.

De website heeft een vooraf gerenderde homepage, zeven informatiepagina’s, canonicals, sitemap, social metadata en beveiligingsheaders. De broncontrole is van 14 november 2026. De voorstellen voor 2027 worden niet als definitieve voorwaarden behandeld.

## Beheer en optionele tellingen

`/admin/` is een echte PHP-beheeromgeving, niet het eerdere openbare conceptdashboard. Configuratie en dagtotalen staan **buiten `public_html`**. Zonder configuratie blijft beheer gesloten (HTTP 503), zijn metingen uit en werkt de documentenwerkbank gewoon.

Na configuratie: gehasht beheerderswachtwoord, beveiligde sessies, CSRF-controles, begrensde inlogpogingen, uitloggen en JSON-export. De meetroute accepteert uitsluitend vaste actietypen. Metingen starten pas na expliciete bezoekerstoestemming; demohandelingen worden niet meegestuurd. De cijfers zijn gebeurtenissen, geen unieke bezoekers of sluitende conversies.

Er is geen standaardwachtwoord, openbare registratieroute of ingebouwde beheer-API voor ChatGPT. Het beheer wijzigt geen dossiers.

## Ontwikkelen en testen

Node.js 22+ voor build/tests. PHP 8.2+ voor beheer; de publieke documentenwerkbank is statisch. Geen `npm install`, Composer of database vereist.

```sh
npm run build
npm test
npm run dev
npm run package
```

`build` maakt de homepage, hulppagina’s, sitemap, headers en standalone distributie opnieuw. `package` maakt een allowlist-gebaseerd Hostinger-pakket in `dist/`. De eigen applicatiecode heeft geen algemene opensourcelicentie; de derde-partijlicenties staan in `vendor/`.

De Node-preview voert geen PHP uit en geeft PHP-broncode nooit als bestand terug. Test het beheer met PHP; de tests maken uitsluitend tijdelijke fictieve configuraties buiten de repository.

## Publiceren

Volg [docs/HOSTINGER-LIVE.md](docs/HOSTINGER-LIVE.md). Publiceer de root van GitHub-branch `main` als PHP/HTML-site op de bestaande Hostinger-hosting voor `subsidieready.nl`. De benodigde webbestanden staan al in Git; op Hostinger is geen Node-build nodig. Zet automatisch deployen vanaf `main` aan na de eerste succesvolle publicatie.

De eenmalige beheerinitialisatie verloopt via de beveiligde hostingterminal:

```sh
php scripts/setup-admin.php
```

De beheerder vult zelf een bereikbare contactmail, de verantwoordelijke persoon/organisatie en een uniek wachtwoord in. Die gegevens worden niet geraden of in Git opgeslagen. Beheercontactgegevens worden bij configuratie zichtbaar in de privacyuitleg. Gebruik een dagelijkse onderhoudstaak voor opruiming; zie het publicatiedocument.

## Zelfstandig beoordelen

Open `concept/SubsidieReady.html` in een browser. Dit is een zelfstandige, offline distributie zonder centrale meting. Het oudere pad `concept/SubsidieKlaar-concept.html` blijft een compatibele kopie. Beide staan op noindex; de publieke website is apart geconfigureerd voor het gekozen domein.

Lees [QA v1](docs/QA-v1.md) voor testresultaten en [bronnen](docs/RVO-sources.md) voor inhoudelijke grenzen. Nooit echte klantbestanden, wachtwoorden, private configuraties of statistieken committen.
