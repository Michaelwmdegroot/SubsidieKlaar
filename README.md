> **G1 ACCOUNTACCEPTATIE — uitvoeringsdossier 16 november 2026:** [G1 status, regressies en gecontroleerde productieacceptatie](docs/G1-ACCOUNT-ACCEPTANCE-2026-11-16.md) · [code- en test-PR #50](https://github.com/Michaelwmdegroot/SubsidieKlaar/pull/50). Controleer de actuele PR-/main-status voordat je dit als productiecode beschouwt. De hersteltests zijn synthetisch; volledige account-/cloudplan-E2E in productie, restore en privacy-/retentiegates blijven apart te bewijzen. De definitieve consumentenstrategie blijft leidend.

> **DEFINITIEVE PRODUCTRICHTING / VERPLICHT STARTPUNT (16 november 2026)** — [Start hier voor elke agent](docs/AGENT-START-HERE-2026-11-16.md) · [Productstrategie](docs/PRODUCT-STRATEGY-2026-11-16.md) · [Consumentenreizen en account-/advieswaarde](docs/JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md) · [Roadmap met GO-gates](docs/DELIVERY-ROADMAP-2026-11-16.md) · [SEO/meting & vertrouwen](docs/METRICS-SEO-TRUST-2026-11-16.md) · [Beslisregister](docs/DECISION-REGISTER-2026-11-16.md).
>
> **VASTGESTELD:** SubsidieReady blijft een gratis, betrouwbare tool zonder e-mail-/accountdwang; het optionele gratis account groeit naar een persoonlijke verduurzamingsassistent; NIVO-contact is alleen vrijwillig en inhoudelijk passend. **DIT IS UITSLUITEND EEN DOCUMENTATIE-/STRATEGIEFASE: er is geen nieuwe websitefunctie gebouwd of goedgekeurd om direct te activeren.** Het bestaande NIVO V2-adviesformulier op `/advies/` is live; één echte inzending werd ontvangen in `portal@nivogroepholland.nl`. Een volledige account-OTP + cross-browser save/export/delete E2E is nog **niet** bewezen; Search Console en verkoopcijfers ook niet. Native sales/vault/staff blijven uit, account en planinhoud worden niet automatisch salesdata. Alle eerdere statusblokken hieronder zijn historische snapshots die niet als actuele productopdracht gelezen mogen worden.

---

> **ACTUELE OVERDRACHT — 15 NOVEMBER 2026:** [Nieuwe canonieke status en roadmap](docs/HANDOFF-NIVO-LEADGEN-2026-11-15.md) · [Startprompt volgende agent](docs/STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md) · [Issue #21](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21). **Live Hostinger-check: database en accountconfig productie-gereed, SMTP-testmail werkelijk ontvangen, cronjob ingesteld. Echte accountregistratie/OTP via cron, planbewaring, export en verwijdering worden met de volgende agent getest. Native leads/kluis/sales zijn UIT.** Alle statusclaims van 14 november hieronder zijn historische context; begin met de nieuwe overdracht.

> **ACTUELE STATUS & OVERDRACHT (14 november 2026):** de premium, sitebreed ontworpen SubsidieReady is live op `main` en de visuele fase is afgesloten. Productie-release **e1ab8f8d**, sitebuild **a95e1539d1244098**, 160 regressietests en 83/83 livecontroles geslaagd. **Volgende fase: SEO-ready en vrijwillige first-party leadgeneratie.** Lees eerst de [canonieke overdracht](docs/HANDOFF-SEO-LEADGEN-2026-11-14.md), vervolgens de [volledige startprompt voor de nieuwe agent](docs/NEXT-AGENT-SEO-LEAD-START.md) en [Issue #21](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21). Bestaande oude release- en beta-notities hieronder zijn historische context; `main` is altijd de gezaghebbende bron. **Accounts, online dossiers en echte leads zijn nog niet actief.**

## Eén premium stijl op alle pagina's

De goedgekeurde dashboardstijl wordt gedeeld door de homepage, regelingeninformatie, kennisbank, privacy/bronnen/over, Mijn plan, voorbereidingswerkbanken, advies/sales-proefpagina's, bronbeheer, 404 en beheer. De visuele basis staat in `assets/site-theme.css`; de editorial shell in `scripts/site-design.cjs`. De regelengine, data-/privacygrenzen en niet-geactiveerde backendfuncties blijven behouden. Zie [release en QA](docs/SITEWIDE-DESIGN-RELEASE.md).


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
