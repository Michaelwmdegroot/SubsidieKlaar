# G1 — accountacceptatie, codeonderzoek en regressieherstel

**Datum:** 16 november 2026. **Status:** G1 **DEELS PASS / PRODUCTIE-E2E OPEN**.  
**Productbesluit:** [Productstrategie](./PRODUCT-STRATEGY-2026-11-16.md) en [G1-releasegate](./DELIVERY-ROADMAP-2026-11-16.md).  
**Bron-main bij start:** `d4e971b0c523027acf620d70192f1c3f2333a24b`.  
**Werkbranch:** `fix/g1-plan-roundtrip-pv-checks-20261116`. **PR:** [#50](https://github.com/Michaelwmdegroot/SubsidieKlaar/pull/50) (draft).  
**Scope:** bestaande account-/planimplementatie, geen nieuwe accountarchitectuur, geen productieconfiguratie, geen e-mails naar echte adressen.

## 1. Bewijsstatus en feitelijke beperkingen

Bewijssoorten mogen niet worden samengevoegd: code/CI, een synthetische PHP-HTTP/SQL-run, read-only live browserchecks, en eigenaarbewijs uit echte productie zijn verschillende niveaus.

| Gebruikersfunctie / controle | Huidig bewijs | G1-status |
| --- | --- | --- |
| Gratis gastomgeving: bestaande plan/PDF/ZIP-functies | Eerdere echte Chromium-run [43774473213](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774473213), geen POST en geen externe domeinen; bestaande algemene regressies | **DEELS PASS**, niet alle mogelijke gastimport-/browsercombinaties handmatig getoetst |
| Accountbootstrap / zichtbare optionele registratie | Eerdere echte live HTTP-run [43773670176](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43773670176) en browser-run hierboven | **PASS voor gecontroleerde publieke status**, geen accountmutatie |
| Registratie en e-mail-OTP | Eigenaar heeft op 16 november echt een 8-cijferige code ontvangen, zich aangemeld en accountgegevens geëxporteerd; [oude acceptatienotitie](./ACCOUNT-PRODUCTION-ACCEPTANCE-2026-11-15.md). Code-, timeout-, hergebruik-, sessie- en rate-limit-tests in lokale PHP-HTTP tests | **DEELS PASS**; mail is ontvangen, maar cronjob-herkomst/nieuwe branded HTML-mail, verkeerde/verlopen code op productie en hernieuwde login zijn nog niet apart geaccepteerd |
| Veilige logout / sessies / CSRF / isolatie | Backend- en SQL-regressies met fictieve accounts en token-/origincontroles. Code voor logout en sessie-intrekking aanwezig | **PASS synthetisch**, nog te bevestigen in echte tweede browser |
| Expliciet cloudplan opslaan en weer openen | PHP-HTTP plus SQL/MySQL/MariaDB-regressies; nieuwe PV-field- en checklistfidelity-test in PR #50 | **PASS synthetisch na fix**, **productie-E2E OPEN** |
| Multi-device hervatten en wijzigen | Een aparte synthetische sessie logt opnieuw in en opent dezelfde serverinhoud; revision-2 save en 409 op oude revisie. Geen fysieke tweede productie-browser gebruikt | **PASS synthetisch na fix**, **productie-E2E OPEN** |
| Account-/planexport | Eerdere echte account-JSON door eigenaar (0 online projecten), plus synthetische account-export mét project | **DEELS PASS**; productiedossierexport met eigen testproject OPEN |
| Project/account definitief verwijderen | Lokale PHP-/SQL-tests verwijderen eigen project/account en blokkeren latere toegang; nog geen echte productieverwijdering | **PASS synthetisch**, **productie-E2E OPEN** |
| Privacy- en salesisolatie | Eigen autorisatie per project/IDOR-tests; alleen expliciete online plan-save; account != Portal-advies. `leads_enabled`, `vault_enabled`, `staff_enabled` blijven productie-uit volgens code/configcontract | **PASS in gecontroleerde code/config- en synthetische scope**; geen productie-privacy-/restorereview afgetekend |
| Hostinger backup/restore, bewaartermijn en sleutelherstel | Lokale versleutelde file-snapshot/restore-test bestaat. MySQL-statedump/restore naar nieuw SQL-doel is **niet** als onafhankelijke Hostinger-run bewezen | **OPEN / expliciete P0-gate** |

**Belangrijk:** het enige echte historische accountscreenshot/export bevatte *nul online projecten*. Een ontvangst van één OTP bewijst noch autonome cron-aflevering noch andere e-mailclients. De bestaande, daadwerkelijk ontvangen **aparte NIVO V2-adviesmail** is geen bewijs voor de account-mailflow.

## 2. Gereproduceerde fout — verlies van PV-constructie bij cloudopslag

**Consumentenprobleem:** wie in een zonnepanelenproject aangeeft dat sprake is van een bijzondere PV-constructie, moet dit antwoord na expliciet online bewaren en hervatten behouden. Een ongewijzigde eigen checklist mag niet spontaan haar voltooide status verliezen.

**Oorzaak:** `assets/plan-core.js` normaliseert de browsergegevens in de vaste `SELECTS`-volgorde, met het **optionele** veld `specialConstruction` aan het einde. `server/next/service.php` werkte met een andere veldvolgorde en kende `specialConstruction` niet. De allowlist verwijderde de waarde bij `project-save`. Ook de serialisatievolgorde van andere `details`-velden veranderde. `P.fingerprint()` bepaalt de geldigheid van eigen checklistbevestigingen met `JSON.stringify` van die details. De verschillende volgorde veroorzaakte een onbedoelde mismatch, zelfs als geen inhoudelijke keuze gewijzigd was.

**Test vóór reparatie:**
- Commit `2f662b001140b9cc843504588300facfdc73f4fd` voegde alleen regressies toe.
- [Quality-run 43920231089](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43920231089): nieuwe PHP-HTTP-test faalt op `undefined !== 'yes'`; vóór reparatie andere checks groen.
- [SQL-run 43920230999](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43920230999): dezelfde verliesfout in MySQL.

**Minimale correctie:**
- Serverallowlist volgt exact de bestaande browsermodelvolgorde, dus geen nieuw formaat/schema.
- `specialConstruction` wordt alleen bewaard als het expliciet `yes` of `no` is; ontbrekende/legacy-plannen krijgen niet stilzwijgend een nieuwe verplichte waarde.
- Geen verandering aan plaintext/SQL-schema, encryptie, accounts, API-doelen of consent.
- Nieuwe regressies dekken twee sessies van hetzelfde account, waarde-/checklistbehoud, revisieconflict `409`, export, serververwijdering en `404` na verwijdering.
- Een extra synthetische tweede login wordt geïsoleerd van de gedeelde mail-IP-testfixture; de aparte OTP-rate-limit-tests blijven gehandhaafd.
- `next-version.json` is opnieuw gegenereerd met de bestaande buildgenerator (nieuwe fingerprint `91887c7fc2f31198`).

**Grenzen:** een antwoord dat al door de **vorige productiecode** uit de serverkopie was verwijderd, is niet terug te reconstrueren. Bestaande lokale export/kopie kan dat antwoord nog bevatten. Gebruik vóór elke herstelactie de huidige serverkopie en lokale export; nooit stilzwijgend lokale gegevens overschrijven.

## 3. Bouw-, test- en QA-gates op PR #50

- `npm run build`, `npm test`, `npm run package` en gegenereerde-bestanden-integriteit via GitHub Actions.
- Echte lokale PHP-HTTP API (fictieve accounts, 8-cijferige OTP uit uitsluitend private fixture, geen live SMTP).
- Geïsoleerde SQL-tests tegen **MySQL 8.4** en **MariaDB 11.4** met bestaande AES-256-GCM-opslag, eigenaarisolatie, logout/export/delete en herstart.
- Echte Chromium-browserregressie via GitHub Actions, zonder persoonsgegevens in de productieomgeving.
- **Nog te bewijzen op productie:** fysieke account-E2E plus serverdata-eigenaarsrechten en restore/retentievoorwaarden.

**CI-links op het eerste groene codeherstel:**
- [Quality 43921496934](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43921496934)
- [Release 43921497114](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43921497114)
- [MySQL/MariaDB 43921496940](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43921496940)
- [Chromium-browserregressie 43921496889](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43921496889) (controleer eindconclusie op de definitieve PR-head).

Geen productie-POST, echt account, MySQL-mutatie, echte OTP of daadwerkelijke accountverwijdering is door deze branch/tests uitgevoerd.

## 4. Productieacceptatie — eigenaar-GO nodig vóór enige wijzigende test

**Vooraf laten bevestigen:** de concrete test op `subsidieready.nl` met een door de eigenaar beheerde mailbox, uitsluitend fictieve woning en maatregelen, maximaal de noodzakelijke OTP's, geen commerciële opt-in, geen echte persoonsgegevens in documentatie, en toestemming voor het **aanmaken, wijzigen, exporteren en definitief verwijderen** van dit synthetische productieaccount. Productie-HOSTINGER-instellingen, SMTP-, DB-, encryptie- en cronsecrets blijven onaangeraakt.

1. Eigenaar opent in browser A `/mijn-plan/` en doorloopt bestaande gastcheck en gastplanexport/PDF/ZIP zonder account.
2. Eigenaar vraagt normale accountcode aan, bevestigt ontvangsttijd en opmaak, verifieert zelf de code; geen code/mailadres/session-cookie delen. Controleer herhaald inloggen/uitloggen en mislukte code zonder onnodige rate-limitbelasting.
3. Maak `QA fictieve woning` als **niet-demo** project met zonnepanelen + `specialConstruction=yes` en isolatie, vink eigen taken af. Kies **bewust** `Bewaar online`, bekijk bevestigde revisie. Fictieve inhoud, geen bijlagen.
4. Open hetzelfde account in nieuwe privé-browser/B of op ander apparaat, met eigen OTP. Controleer titel, beide maatregelen, bijzondere constructie, taken. Wijzig vervolgens in B, probeer oud revisie-opslaan in A; verwacht `409` zonder overschrijven en met mogelijkheid tot exporteren.
5. Exporteer account mét opgeslagen plan. Verwijder eerst het serverproject (controle `404`); verwijder vervolgens account in een pas geverifieerde sessie (max. tien minuten). Controleer uitloggen, geen toegang of serverproject meer. Lokale kopieën expliciet apart verwijderen.
6. Controleer gastregelingen, warmtepomp-PDF/ZIP en lokale import/export nogmaals. Deel alleen PASS/FAIL, browsers, tijdvertraging en geanonimiseerde foutnaam. Geen OTP/PII/screenshots met mailadres naar GitHub.

**NO-GO zolang**: productie-OTP via cron, browser A/B roundtrip, conflict, serverproject/account delete, sleutel/backup/restore en privacy-/retentieafspraken niet voldoende zijn afgetekend. Herstel alleen via minimale nieuwe branch/PR en nieuwe regressie, nooit handmatig productiedatabase repareren.

## 5. Scope, rollback en overdracht

- **In scope:** PHP-planfilter, regressietests, bijgewerkte deterministische buildversie, documentatie.
- **Buiten scope:** nieuw registratie-/sales-/Portal-gedrag, marketing, SQL-schema, nieuwe bestandskluis, SEO-publicaties, assistent-G2 of projectmigraties.
- **Rollback:** niet mergen als releasegates of acceptatie rood zijn. Na een eventuele expliciet geautoriseerde merge: via normale GitHub/Hostinger-releaseprocedure terugzetten naar laatste bekende goede servercode; database of encryptiesleutel **niet** terugdraaien/wissen. Bestaande opgeslagen planversies niet stilzwijgend herschrijven.
- **Risico's:** oude serverplannen met reeds eerder verwijderde `specialConstruction` blijven incompleet; SQL-pilot is één versleutelde state-rij met limieten/locks; Hostinger echte restore en retentie blijven eigenaar-/privacygate; browser-G1 live nog niet afgetekend.
- **Vervolg:** na CI-review en expliciete vrijgave eigenaar eerst gerichte productieacceptatie; **pas na G1 GO** doorgaan met nuttige G2-assistentfuncties.

Links: [issue #6](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/6), [issue #7](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/7), [issue #5](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5), [master #21](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21).
