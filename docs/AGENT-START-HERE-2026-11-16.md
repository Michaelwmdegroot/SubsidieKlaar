# START HIER — SubsidieReady, overdracht voor iedere volgende agent

**Datum besluit:** 16 november 2026. **Eigenaar:** gebruiker / SubsidieReady. **Status:** *canoniek productbesluit + routekaart, geen nieuwe bouwopdracht*. Dit is de aanbevolen eerste pagina voor een nieuwe ChatGPT-, Codex-, GitHub-, SEO-, design-, data- of Portal-coördinatieagent.

## 1. Leesvolgorde (verplicht)

1. [PRODUCT-STRATEGY-2026-11-16.md](./PRODUCT-STRATEGY-2026-11-16.md) — **WAT** SubsidieReady moet zijn, wat gratis blijft en waarom mensen vrijwillig NIVO zouden vragen.
2. [JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md](./JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md) — **VOOR WIE**, accountwaarde, advieskaart en concrete consumentenreizen.
3. [DELIVERY-ROADMAP-2026-11-16.md](./DELIVERY-ROADMAP-2026-11-16.md) — **IN WELKE VOLGORDE** ontwikkelen, afhankelijkheden, eigenaar-GO en definitie van gereed.
4. [METRICS-SEO-TRUST-2026-11-16.md](./METRICS-SEO-TRUST-2026-11-16.md) — **HOE** nuttige resultaten, SEO en kwalitatieve aanvragen beoordelen zonder verborgen tracking.
5. [DECISION-REGISTER-2026-11-16.md](./DECISION-REGISTER-2026-11-16.md) — definitieve besluiten tegenover hypothesen en expliciet nog open besluiten.
6. [LEADGEN-MILESTONE-2026-11-16.md](./LEADGEN-MILESTONE-2026-11-16.md) en [NIVO-PORTAL-LEAD-MAIL-HANDOFF-2026-11-16.md](./NIVO-PORTAL-LEAD-MAIL-HANDOFF-2026-11-16.md) — eerdere live-ontvangst en het echte operationele mailcontract.
7. De huidige [AGENTS.md](../AGENTS.md), [README.md](../README.md), werkelijke source code en bestaande GitHub-issues #21, #17, #6, #7, #9, #10, #16.

**Prioriteit bij tegenstrijdigheid:** nieuw eigenaarbesluit (dit pakket) > de fasegebonden nieuwe uitvoeringsacceptatie > oudere productideeën uit 14–15 november. Voor technisch gedrag en bewezen status gelden altijd **huidige main, echte code, actuele CI en live-acceptatie**, niet een historische belofte of ontwerptekst. Bestaande juridische/security gates worden niet door een productbesluit opgeheven.

## 2. Huidige geverifieerde productbasis

- Website: https://subsidieready.nl/, GitHub: Michaelwmdegroot/SubsidieKlaar, productie volgt `main` via bestaande Hostinger-PHP/HTML-deploy.
- Laatste inhoudelijke code-/productiesnapshot vóór dit docs-pakket: merge [PR #48](https://github.com/Michaelwmdegroot/SubsidieKlaar/pull/48), commit `36864910451f6cb114c9a74a5be8e2c6b0904bf3`; quality, release, browser en live-acceptatie na rerun geslaagd. De SHA van de docs-merge zal later hoger zijn; de productcode hoeft daardoor niet te veranderen.
- Premium sitewide ontwerp, informatie-/regelingencheck, gratis gastfunctionaliteit, lokale planfunctie en warmtepomp-PDF/ZIP bestaan. Eén hoofdmaatregel Zonnepanelen met optionele bijzondere PV-constructie is ingevoerd.
- De aparte vrijwillige adviesroute `/advies/` is live en stuurt naar `portal@nivogroepholland.nl`; een V2-aanvraag werd op 16 november daadwerkelijk in Outlook getoond. **Dit is bewijs van één echt ontvangen mailbericht, niet van opvolging of algemene deliverability.**
- Accounts/MySQL/SMTP en een cronjob zijn technisch geconfigureerd; een echte account-E2E inclusief online plansync en verwijderen is **nog niet als geslaagd bewezen** in bestaande overdrachten. Controleer dat eerst.
- Online vault, native sales/staff en algemene gedragsanalyses staan niet vrij voor productie; Marketing-/contacttoestemming blijft strikt gescheiden van account en regelingengebruik.
- Zoekindexering, Search Console-conversie en daadwerkelijke afspraken/offertes/verkoop zijn **nog niet bewezen**; claims op basis van CI of logica alleen zijn niet toegestaan.
- Geen dubbele uitvoeringsomgeving, geen nieuw accountstelsel, geen eigen Portal-app in deze repository.

## 3. Opdracht aan toekomstige agents

**Doe eerst een zelfstandige intake:**

- Controleer de laatste main-SHA, bestaande open PR's/issues, release- en browserstatus en huidige specifieke gebruikersopdracht. Lees de vijf nieuwe canonieke docs.
- Formuleer **één concrete slice** uit de roadmap, het consumentenprobleem, meetbaar resultaat, afhankelijkheden, wat je niet gaat doen en wat eerst door de eigenaar goedgekeurd moet worden.
- Verifieer de actuele bron-/security-/operationele aannames vóór inhoudelijke regels of persoonsgegevens aan te raken.
- Lever code alleen wanneer de gebruiker in een **nieuwe opdracht** duidelijk om implementatie heeft gevraagd. De opdracht van 16 november aan deze agent is **documenteren en richting bepalen, niets bouwen**.

**Standaard uitvoering bij een latere, wél geautoriseerde bouwopdracht:**

1. Maak een kleine GitHub-branch vanaf actuele main en verwijs naar een issue/roadmap-slice.
2. Onderzoek huidige generatoren, componenten en tests; hergebruik bestaande architectuur, stijl en infrastructuur.
3. Bouw de kleinste aantoonbaar waardevolle verbetering; introduceer geen frictie, verborgen datastroom of onreviewde markt-/belastingclaims.
4. Test inclusief regressie voor gastmodus, bestaande plannen, consent en privacy; voer build/Node/PHP/MySQL/Chromium waar relevant uit.
5. Documenteer productnut, voor/na, testbewijs, deploycriteria, rollback en bewust niet inbegrepen zaken in PR en issue. Merge of activeer alleen volgens de bestaande eigenaar- en productie-GO.
6. Controleer live na publicatie read-only op de **exacte build**. Een echte contact-POST of account-/mailtest vraagt gecontroleerde synthetische data en toestemming; CI mag niet automatisch klanten aanschrijven.
7. Sluit af met een nieuwe concrete handoff: wat werkt, wat niet is bewezen, welke beslissing openstaat en welk ticket de volgende agent moet oppakken.

## 4. Toewijzing per specialist

| Agenttype | Geschikte eerstvolgende taak | Niet doen |
| --- | --- | --- |
| Account / platform / QA | G1: echte account-OTP en tweede-apparaat/plan-E2E, zonder PII | Nieuwe vault-/marketing-/salesfeatures activeren |
| Product & UX | G2: bestaande Mijn plan-workbench eenvoudiger en nuttiger maken, op ontwerp/acceptatie niveau beginnen | Product vervangen, gastflow paywallen |
| SEO / redactie | SEO1: Google Search Console, broncontrole en unieke vraaggedreven content | "SEO afgerond" zonder echte index-/zoekdata |
| NIVO-sales / Portal | S1: concreet NIVO-adviesaanbod en V1/V2-mailparser + opvolgbeleid in **apart** Portal-project | Veronderstellen dat accountgebruik een belverzoek is |
| Data / analytics | M1: definities, consentregels, meetplan, daarna pas minimaal implementeren | Identificeerbare web-/CRM-profielen koppelen zonder rechtsgrond |
| Security / privacy | G1/S1/M1: rechten, retentie, origin, abuse, restore, terugtrekking en risk controls | Enigszins gevoelige bestaande productieconfig zonder incident wijzigen |

## 5. PR-/owner-GO-checklist

- [ ] Consumentenwaarde concreet omschreven, gratis gastgebruik intact.
- [ ] Scope en non-goals, risico's, correct rechtspersoon en dataflow expliciet.
- [ ] Officiële bronnen en reviewer/versiedatum voor financieel/juridisch gevoelige content.
- [ ] Marketing/privacy-/account-/contactscheiding door tests aangetoond.
- [ ] NIVO-servicebelofte waar nodig intern bevestigd, geen fictieve SLA.
- [ ] Geen oude plan-/documentversies of lokale exports gebroken; compatibiliteit bewezen.
- [ ] Bestaande style/design system gerespecteerd; mobiel, Safari/keyboard/toegankelijkheid beoordeeld.
- [ ] Build/package/tests + passende server-/browser- en livechecks; geen echte klant-POST door testautomaat.
- [ ] Indien monitoring: toestemming/retentie/aggregate/no-PII en meetdefinitie.
- [ ] Rollback/incidentpad, bewijsgrens en volgende handoff vastgelegd.

## 6. Startprompt om in nieuwe agentchat te plakken

> Jij bent de nieuwe GPT-6 lead product-/ontwikkelagent voor SubsidieReady.nl, repository Michaelwmdegroot/SubsidieKlaar. **Wij veranderen het goedgekeurde premium concept niet.** SubsidieReady moet consumenten aantoonbaar gratis helpen met officiële regelingeninformatie en voorbereiding, een vrijwillig gratis account ontwikkelen tot een persoonlijke verduurzamingsassistent en **alleen na expliciete keuze** passende adviesvragen bij NIVO Groep Holland B.V. bezorgen.
>
> **Lees eerst daadwerkelijk en in volgorde** de zes canonieke strategiedocumenten vanaf docs/AGENT-START-HERE-2026-11-16.md (productstrategie, journeys, roadmap, metrics, beslisregister, milestone/mailcontract). Lees AGENTS.md en controleer laatste main, live release, relevante open issues/PR's, exacte bestaande functionaliteit en eerdere testbewijzen. Maak nooit accountregistratie tot een lead. Gratis tools/PDF/ZIP blijven zonder e-mail beschikbaar, geen automatische plan-/fiscale data naar sales en geen misleidende subsidie- of rendementbeloften.
>
> Kies na deze audit de **eerste nog niet bewezen, verantwoordelijke roadmap-slice**, met de hoogste prioriteit G1 (echte account-E2E) tenzij mijn nieuwe opdracht een andere slice aanwijst. Leg scope, echte consumentenwaarde, afhankelijkheden, risico's, acceptatiecriteria en owner-GO vast. Als ik om uitvoering vraag, implementeer direct in een aparte GitHub-branch, test zorgvuldig, rapporteer feiten versus aannames en lever een inspecteerbare PR met goede overdracht. Geen kosten, marketingactivation, nieuwe databron, contacten of productieconfigwijziging zonder expliciet akkoord.

## 7. Beslis- en wijzigingsdiscipline

Nieuwe ideeën komen eerst als **hypothese/voorstel** in issue of beslisregister, niet als "is al afgesproken". Vooral nieuwe mailmomenten, upsell, financieringsadvies, leadrouting tussen B.V.'s, premium functies of nieuwe leveranciers vragen eerst aparte eigenaarbeslissing. Blijf zelf kritisch: hogere formulierconversie zonder betere hulp is geen productverbetering.

**Dit document en het roadmap-pakket maken van SubsidieReady geen af product; ze maken verantwoord doorbouwen voor iedere agent mogelijk.**
