# Ontwikkeloverdracht — 14 november 2026

## Waar we begonnen

GitHub: `Michaelwmdegroot/SubsidieKlaar`, branch `main`, conceptcommit `8da5d2c9c8825bd53837ba5fec3e83e9b50cbb3b`.

Doel: gratis no-signup documentenwerkbank voor Nederlandse eigenaar-bewoners die een ISDE-aanvraag voor een warmtepomp voorbereiden. Gebruikers vullen situatie- en toestelgegevens in, voegen documenten lokaal toe en downloaden een overzicht of ZIP. **Geen** AI-documentinterpretatie, DigiD-indiening, subsidiebedragberekening, toezegging van subsidie of upload van documenten.

## Wat v0.1 biedt

1. Vier stappen: situatie, installatiegegevens, documenten, resultaten.
2. Duidelijke `outside_scope`, `preparation`, `review` en `complete` statussen die geen subsidierecht pretenderen.
3. Meldcode of productinformatie plus technische documentatie, meerdere betalingen en een winkelbetalingsuitzondering.
4. Downloadbaar PDF, Unicode-HTML, ZIP met byte-identieke originele bijlagen en een project-JSON.
5. Fictieve voorbeeldflow en lokale browser-backoffice. Centrale bezoekersstatistieken bestaan nog **niet**.
6. Lokale verwerking zonder accounts, remote AI, externe analytics of betaalde runtime.
7. `noindex` en `robots.txt` blokkade tijdens conceptfase.

De vorige QA-notitie rapporteerde 20 geslaagde tests en handmatige browsertests. Dit zijn testresultaten van 13 november 2026; niet automatisch een nieuwe auditverklaring.

## Besluiten die **niet** zijn genomen

- Definitieve naam/domein: **SubsidieKlaar** is werknaam. SubsidieBewijs.nl is slechts voorstel. De SIDN-waarnemingen dateren van 13 november en reserveren niets.
- Geen Hostinger-koppeling, live hostingplan, analytics-database of productieauthenticatie vastgesteld.
- Geen toestemming om de site indexeerbaar te maken of ads/paid features live te zetten.

## Nieuwe stap: kwaliteits- en releasebewaking

Deze overdracht introduceert een GitHub Actions testworkflow, regressietests voor de concept-/offlinegrenzen en `docs/RELEASE-GATES.md`. Het doel is om wijzigingen te kunnen beoordelen zonder ongemerkt de privacy of de standalone HTML-versie te breken.

## Volgende technische prioriteiten

1. CI-resultaten inspecteren; bij groen deze kleine kwaliteitswijzigingen in `main` opnemen.
2. Visuele review en toetsenbord/mobiel-UX-verbeteringen: eerst concrete problemen herstellen, inclusief herstel van bevestigingen.
3. Definitieve naam en hostingmogelijkheden vaststellen vóór serverimplementatie.
4. Een afzonderlijke beveiligde PHP-backoffice met minimale, privacyvriendelijke centrale aggregaten bouwen en op staging testen.
5. Daarna RVO-bronactualisatie, content/SEO en releasevoorbereiding; de volledige individuele tool blijft gratis.

## Lokaal werken

```sh
npm test
npm run build
git diff -- concept/SubsidieKlaar-concept.html
```

Er zijn geen npm-installaties of betaalde licenties vereist. Lees ook `AGENTS.md`, `docs/PLAN.md`, `docs/RVO-sources.md` en `docs/QA.md`. Verander inhoudelijke RVO-regels nooit op basis van een niet-geverifieerd voorstel.
