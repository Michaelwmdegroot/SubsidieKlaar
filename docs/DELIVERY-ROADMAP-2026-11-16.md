# SubsidieReady — geprioriteerde ontwikkelroadmap en releasegates

**Status:** uitvoeringsvolgorde, vastgesteld als richting door eigenaar op 16 november 2026. **Geen onmiddellijke bouwopdracht.** Agents voeren steeds één begrensde fase uit, met echte acceptatie vóór de volgende release.
**Startpunt:** [PRODUCT-STRATEGY-2026-11-16.md](./PRODUCT-STRATEGY-2026-11-16.md). **Gebruikersreizen:** [JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md](./JOURNEYS-ACCOUNT-ADVICE-2026-11-16.md). **Meet- en SEO-contract:** [METRICS-SEO-TRUST-2026-11-16.md](./METRICS-SEO-TRUST-2026-11-16.md).

## 0. Bewijsstatus op 16 november 2026

| Component | Bewijskracht en actuele toestand | Wat niet mag worden geclaimd |
| --- | --- | --- |
| Premium site, gasttools, regelingencheck en vrij exporteren | Bestaande productie- en browserchecks groen; sitewide design goedgekeurd | Complete landelijke/lokale dekking of officiële subsidie-uitkomst |
| Vrijwillig NIVO-adviesformulier | PR #47; echte V2-aanvraag op 16 november in Portal-mailbox ontvangen | Algemene deliverability, verkoop, contactkwalificatie |
| Enkele PV-hoofdkeuze met speciale constructiedetail | PR #48, live acceptance geslaagd op main 3686491 | Dat alle bouw-/BTW-vragen automatisch fiscaal juist beslist worden |
| Accounttechniek, MySQL, SMTP en Hostinger-cron | Serverchecks en een echte SMTP-test geslaagd; accounts productiegate aan | Complete real-user registratie/OTP, cross-device opslag/export/delete E2E (nog niet afgetekend) |
| Portal-parser en -salesoperatie | Contract en mailontvangst bewezen | Automatische intake, verwerking, SLA of CRM-opvolging |
| Organische resultaten/conversierapportage | SEO-technische basis en beperkte content gepubliceerd | Search Console-bereik, werkelijke conversieratio's, verkoopbaseline |
| Vault/staff/native sales | Productiegates uit | Publieke cloudvault of eigen salesdashboard |
| Wijzigingen in dit strategische werkpakket | **Uitsluitend documentatie** | Nieuwe appfunctionaliteit, instellen cron/timers, activeren tracking/marketing |

Eerst steeds actuele main, live werkelijke deployment en bestaande issues nalopen; oudere overdrachten uit 14–15 november beschrijven soms vorige releasefasen.

## 1. Beslissende volgorde

### D0 — Strategie vastleggen (DIT DOCUMENTATIEWERKPAKKET)

**Doel:** productgrenzen, verantwoordelijkheden, gebruikerswaarde en uitvoerbare tickets voor elke volgende agent helder hebben. **Geen code, API, UX of productieconfig wijzigen.**
**Definition of Done:** README en AGENTS wijzen naar één canonieke startplek; strategie, journeys, roadmap, KPI's en startprompt zijn linked, gereviewd, op main gemerged; bestaande issues hebben actuele topnotities; oude overdrachten blijven als archief herkenbaar.

### G1 — Betrouwbare bestaande basis + account-E2E (eerst productveiligheid)

**Primair:** issues #6, #7, #5. **Volgorde vóór nieuwe accountfuncties.**

- Echte productie-E2E met fictieve mailbox: registratie, code ontvangen via werkelijke cronworker, geldigheid/hergebruik/ongeldige codes, inloggen/uitloggen, keuze online bewaren, openen in tweede sessie of apparaat, wijzigingsconflict, export en verwijderen.
- Bewijs dat bestaande gast-PDF/ZIP, lokale plannen, import en regelingencheck blijven werken zonder account en zonder commerciële communicatie.
- Controleer veilig of storage/retentie/backup/restore en hostlimieten passen bij voorgestelde groei; private secrets nooit in GitHub. Bestaande een-rij-versleutelde MySQL-state is niet zonder onderzoek een onbeperkt schaalbare CRM/database.
- Controleer consent, metadata, foutpaden, toegankelijkheid en de juiste privacy-/accountteksten.

**G1 GO:** synthetische E2E-bewijsstukken (zonder code of PII) + gebruikersacceptatie van accountwaarde + expliciete vaststelling van restore/privacygates. Bij fail: corrigeer minimaal, niet opnieuw alles bouwen; gratis functies intact laten.

### G2 — De persoonlijke assistent nuttig maken (na G1)

**Primair:** issues #7, #15, #17. **Doel:** aantoonbare waarde vóór verdere salesoptimalisatie.

- Toon in bestaande Mijn plan per woning/maatregel de eerstvolgende relevante taak, eigen voortgang, helder onderscheid "lokaal" versus "online" en vervolgstappen met bronverwijzing.
- Verbeter taakprioritering en statussen vanuit bestaande gecontroleerde regels, zonder subsidie-goedkeuring of eurogarantie.
- Minimaliseer nieuwe vragen: laat bestaande plannen en historische import intact, geen stille migratie of data-overschrijving.
- Ontwerp eerst compacte desktop-/telefoonmockup **binnen bestaande design system**; geen radicale redesign.
- Reminders en geverifieerde regelupdates **als afzonderlijke latere subfase** met bronreview, vrijwillige opt-in, intrekking en operationele controle; geen notificatiecode als basis voor eerste accountwaarde nodig.

**G2 GO:** nieuw account levert aantoonbaar meer gebruikersgemak dan gastmodus, zonder betaalmuur, zonder marketing en met succesvolle regressies voor oud/lokaal/online plan.

### S1 — NIVO-advies als echte dienstverlening (parallel te specificeren; activeren na operationele GO)

**Primair:** issue #9 in deze repo; Portal-agent in apart project.

- Bevestig per onderwerp: wat NIVO écht kan adviseren, welke teams dat oppakken, wie contactpersoon is, welke reactie/afspraak kan worden waargemaakt en hoe een informatievraag anders wordt afgehandeld dan een offerteaanvraag.
- Maak 1–2 contextuele voorstellen voor geschikte plaatsen (bijv. na de thuisbatterij-btw-uitleg, na een gerichte warmtepompstap). Gratis toolresultaten en officiële bronnen blijven primaire informatie; de uitnodiging is secundair en vrijwillig.
- Verklaar expliciet de relatie tussen SubsidieReady (gids) en NIVO (commerciële installateur). Geen overheidssuggestie of onafhankelijkheidsclaim voor installatieadvies.
- **Huidig adviesformulier en ontvanger niet automatisch veranderen.** De latere hypothese "minder contactvelden bij algemene oriëntatie" vergt nieuw eigenaarbesluit en privacyreview.
- Portal-team bouwt V1/V2 parser, idempotentie op `request_id`, suppressie, retentie, kwalificatie/activiteiten en consistente contactvoorkeur buiten deze repository.

**S1 GO:** servicebelofte en operationele capaciteit akkoord, contactcopy juridisch/feitelijk nagezien, geen account-/dossierdata naar sales, voorbeeld van waardevol eerste antwoord en duidelijk bezwaar-/intrekproces.

### SEO1 — Zoekvraag, bronkwaliteit en organische basis (kan parallel aan G1/S1)

**Primair:** issues #21 en #16.

- Zoek werkelijke Search Console-property en actuele sitemap/indexering; analyseer bestaande queries, impressies, clicks, paginaprestaties en technisch mobiele bottlenecks. Geen cijfers verzinnen wanneer toegang ontbreekt.
- Cluster bestaande inhoud rondom *vragen en taken*: warmtepomp/ISDE en bewijsstukken; isolatie/glas/ventilatie; zonnepanelen/btw en complexe constructies; thuisbatterij/btw; financiering als gescheiden informatie.
- Per publicatie originele nuttige uitleg, officiële primaire bron, gecontroleerd tijdvak, uitzonderingen, intern vervolg naar gratis tool en eventueel **geschikte** NIVO-advieskaart.
- 2027-/regionale inhoud pas na daadwerkelijk brononderzoek en menselijke inhoudelijke review. Geen landelijke gemeentelijke volledigheidsclaims en geen massale dunne lokale pagina's.

**SEO1 GO:** inspecteerbare nulmeting, prioriteitenlijst op werkelijk gedrag, geen ongefundeerde claims, correcte canonicals/index/noindex/structured data en sitewide mobiele regressies. Publicatie is geen bewijs van indexering.

### M1 — Conversiemeting en commerciële kwaliteitsloop (na consent-/operational review)

**Primair:** issue #10; gekoppeld aan Portal-agent.

- Stel eventtaxonomie en teldefinities vast vóór technisch meten. Bestaande analytics default-uit/GPC/DNT-grenzen respecteren; website-analytische events zonder geldige toestemming niet stiekem activeren.
- Onderscheid **gratis taakvoltooiing**, account-activatie, vrijwillige NIVO-aanvraag en échte Portal-ontvangst plus kwalificatie/opvolging.
- Eenvoudige, dataminimale monitor voor queue, SMTP-acceptatie, inboxontvangst, retries/failed en misbruik; **geen klantinhoud in CI/logs**.
- Door Portal-team alleen geaggregeerde uitkomsten terugkoppelen voor funnel/kwaliteit, niet individuele subsidiedossiers of verborgen persoonlijke koopprofielen.
- Meet doelgroep-/kanaalverschillen alleen als ze privacyvriendelijk en operationeel uitlegbaar zijn; opt-out/retentie aantoonbaar.

**M1 GO:** definities en guardrails zijn gevalideerd; werkelijke baseline of expliciet "onbekend"; cijfers kloppen met teller/noemer, en geen dubbel tellen van retry/nieuwe sessie of account als lead.

### SCALE — Pas op basis van meetresultaat uitbreiden

- Kleine CTA-/copy-iteraties op echte klantwaarde, geen clickbait.
- Investeren in contentclusters die aantoonbaar kwalitatief verkeer brengen; geen uitrol van honderden templated pagina's zonder bronvalidatie.
- Eerst inschatten of Portal-team voldoende opvolgcapaciteit heeft, daarna traffic vergroten.
- Geen extra infrastructuurkosten, nieuwe opslagdiensten, AI-mailagent of commerciële SDK zonder eigenaar-GO.

## 2. Werkpakketten zijn onafhankelijk maar mogen elkaar niet tegenspreken

| Werkstroom | Primaire eigenaar | Mag parallel? | Vóór merge minimaal |
| --- | --- | --- | --- |
| Account-E2E/security G1 | Account/QA-agent | Ja, met SEO-read-only | Productieacceptatiebewijs zonder PII, gastregressie, herstelplan |
| Assistent-product G2 | Product/UX-agent | Ontwerp kan vóór G1; release pas na G1 | Legible UI, taken uitlegbaar, geen onjuiste rechten |
| NIVO-service S1 | NIVO-sales/Portal-agent + SubsidieReady UX-agent | Ja, afzonderlijk | Werkelijke offertevraag-/adviescapaciteit, consentreview |
| SEO1 / redactie | SEO/content-agent | Ja | Officiële bronreview, zoekintentie en bruikbare toolroute |
| M1 tracking/KPI | Privacy/analytics-agent | Definities parallel; activering na review | Consent/GPC/DNT en cijfers controleerbaar |
| Schaal | Eigenaar/growth lead | Nee, pas na bewijs | Geen druk op follow-up, verbetering gekwalificeerde waarde |

Geen twee agents tegelijk nieuwe schema's, privacycopy of publieke CTA-bestemmingen laten wijzigen zonder gedeelde afstemming. Bewaar handoff/PR-links en exacte main-SHA bij elke taak.

## 3. Algemene Definition of Done per implementatie-PR

1. Beschrijft **consumentenprobleem, hypothese, scope, buiten-scope en wat er niet verandert**.
2. Verwijst naar deze productstrategie; noemt status van eigenaar-/privacy-/bron-/servicebesluiten.
3. Kleine branch, codewijzigingen in juiste generators, geen handmatige drift van gegenereerde pagina's.
4. Relevante tests + `npm run build`, `npm test`, `npm run package`, PHP/MySQL waar nodig, echte Chromium op diverse viewports en na merge alleen read-only livechecks tenzij expliciete toestemming voor een synthetische POST.
5. Bewaakt gratis gast-PDF/ZIP, lokale import/export, toegang/sessies, legacy-plannen, sitewide branding, sitemap/noindex, geen datalek en juiste consent.
6. Eén helder meetbaar gebruikersresultaat met bewijs; geen ongefundeerde "SEO is klaar"/"leads werken altijd"-claim.
7. Documenteert rollback, afhankelijkheden, werkelijke productie-/ontvangsttest, resterende risico's en een nieuwe overdracht voor de volgende agent.
8. Merge naar main pas bij groene gates en actuele eigenaarautorisatie. De bestaande Hostinger-deploy wordt onafhankelijk op exacte versie gecontroleerd.

## 4. Beslisregister: wanneer terug naar de eigenaar?

**Nieuwe toestemming vragen voordat**: verplichte formuliergegevens worden verwijderd/toegevoegd; NIVO-aanbod of reactiegarantie wordt gepubliceerd; accountgegevens direct naar sales gaan (standaard verboden); marketing/analytics wordt geactiveerd; automatische mails/regelnotificaties worden gestart; persoonsgegevens worden gekoppeld aan Portal/Odoo; privacygrondslag/retentie materially wijzigt; extra kosten of nieuw extern systeem ontstaan; betaalfuncties worden geïntroduceerd.

**Zelfstandig binnen de goedgekeurde richting**: beperkte documentatie, niet-privacygevoelige SEO-reviews, ontwerpvoorstellen, testcorrecties, verifieerbare brononderzoeken, duidelijkere informatiecopy die de feitelijke inhoud niet verandert en voorstel-PR's zonder productiegevoelige activering. Geen "stil GO" op basis van het bestaan van code.
