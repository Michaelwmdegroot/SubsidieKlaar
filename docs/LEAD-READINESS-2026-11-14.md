# Vrijwillige eigen adviesaanvragen — audit en activatiecontract

> **ACTUELE AANVULLING 16-11-2026 — eerste vrijwillige TBT-uitlinkpilot:** de eerdere status 'pilot voorbereid/niet geactiveerd' hieronder is historisch. De afgebakende route en read-only TBT-ontvangstcontrole staan in [TBT-OUTBOUND-LEAD-PILOT-2026-11-16.md](TBT-OUTBOUND-LEAD-PILOT-2026-11-16.md) en [Issue #12](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/12#issuecomment-6904477332). Alleen de vaste CTA op het thuisbatterij-btw-artikel wordt gepubliceerd; geen PII-overdracht, native saleslead, telefoonmarketing of aangetoonde SubsidieReady-specifieke conversie. Native formulieren/CRM behouden alle P0-gates hieronder.


**Status: voorbereid; geen productieactivatie.** Onderzoek op 14 november 2026, broncodebasis `30be4c0e6bda6c5cdd1a550fb611d71740d3d99f`. Dit document vult [Issue #21](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21), [#5](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5), [#9](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/9), [#10](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/10) en [#12](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/12) concreet in. Het geeft geen toestemming om persoonsgegevens, accounts, tracking, mail of een CRM-koppeling te activeren.

## 1. Vastgesteld en nog te bewijzen

| Onderdeel | Bewijs en grens |
| --- | --- |
| Bestaande adviesbestemming | De publieke [TBT-adviespagina](https://thuisbatterijteam.nl/contact/adviesgesprek/) is via webretrieval gelezen. Zij biedt persoonlijk thuisbatterijadvies over woning, verbruik, zonnepanelen en aansluiting. Het uitgelezen formulier vraagt verplicht een telefoonnummer; naam, e-mail, adres en vraag/opmerking staan ook in het formulier. Geen formulier is ingevuld of verzonden. |
| Ontvanger | Het publieke [TBT-privacybeleid](https://thuisbatterijteam.nl/voorwaarden-beleid/privacybeleid/) noemt **Thuisbatterij Team B.V.** als verantwoordelijke voor de daar beschreven verwerkingen. Dit bewijst niet wie SubsidieReady exploiteert of welke rol NIVO heeft. |
| Contactdoel | De adviespagina zegt gegevens te gebruiken voor de adviesaanvraag. De precieze getoonde contactkeuze, ontvangernaam en privacylink bij het daadwerkelijke verzendmoment vereisen nog een browsercontrole; de tekstextractie toont die niet afdoende. Ontvangst in mailbox/CRM is niet getest. |
| Toestemming op TBT | De tekstextractie toont een cookie-interface met weigeren en accepteren. Daarmee is niet bewezen dat marketingverzoeken vóór toestemming werkelijk worden geblokkeerd. Een vermelde `fbpx`-afbeelding in de extractie is evenmin bewijs dat een browser een pixel vóór toestemming verstuurt. Controleer netwerkgedrag afzonderlijk. |
| Consistentie juridische pagina's | Privacybeleid noemt telefoonnummer eindigend op `565`; de adviespagina en [cookiepagina](https://thuisbatterijteam.nl/voorwaarden-beleid/cookiebeleid/) noemen `563`. Laat de eigenaar het juiste contactpunt bevestigen. Het beleid noemt algemene bewaartermijnen; concrete termijnen per aanvraagstatus zijn hiermee niet vastgesteld. |
| SubsidieReady-backend | `server/next/service.php` accepteert alleen local/staging en weigert het productiedomein. De configuratie vereist een private map en sleutel. De beta is versleutelde bestandsopslag, geen operationele MySQL-omgeving. |
| Gebruiksmeting | `assets/metrics.js` verzendt pas na serverconfiguratie én vrijwillige toestemming; GPC/DNT blokkeert verzending. Alleen tien vooraf bepaalde warmtepomp-toolgebeurtenissen bestaan. Dit meet geen volledige nieuwe funnel. |
| Sales en mail | Beta-leads blijven pending tot contactmailverificatie; rollen zijn per entiteit beperkt. Mailworker gebruikt een queue plus PHP `mail()`. Er is geen SMTP-afleveringsbewijs, CRM-adapter, personeels-MFA of bewezen productieschaal. |

Dit is broncode-inspectie plus publiek inhoudsonderzoek. De aparte technische audit/livecontrole bepaalt de actuele HTTP- en deploystatus. Er is geen omzet, bezoekersbaseline, conversiepercentage of wettelijke goedkeuring uit dit onderzoek af te leiden.

## 2. Eerste pilot: statische uitgaande link

De kleinste bruikbare pilot laat een bezoeker zelf naar het bestaande TBT-formulier gaan. SubsidieReady verzamelt daarbij geen extra contactgegevens. Dit houdt de gratis consumentenroute en de commerciële adviesroute eenvoudig te begrijpen.

### Concrete kaart na goedkeuring

**Label:** Vrijwillig commercieel advies

**Titel:** Past een thuisbatterij bij jouw woning?

**Tekst:** Vraag een vrijblijvend adviesgesprek aan bij Thuisbatterij Team B.V. Je vult je contactgegevens zelf in op hun website.

**Knop:** Vraag thuisbatterijadvies aan

**Toelichting:** Dit is productadvies, geen beoordeling van je recht op subsidie of btw-teruggaaf. SubsidieReady stuurt geen ingevulde antwoorden of documenten mee. De gratis check en downloads blijven beschikbaar.

**Privacylink:** Privacy bij Thuisbatterij Team B.V.

De exacte naam wordt vóór activatie nog door de eigenaar bevestigd. Publiceer daarnaast transparant de juridische exploitant en relatie op de informatie-/privacypagina van SubsidieReady. De kaart mag pas worden getoond nadat de bezoeker zelf het onderwerp thuisbatterij kiest of een inhoudelijke thuisbatterijpagina bezoekt. Gebruik fiscale antwoorden, KOR, inkomen, leninginteresse of ontbrekende subsidie niet als verkoopselectie. Zet de kaart niet op elke isolatie-, warmtepomp- of financieringspagina zonder relevant eigen aanbod.

### Technisch contract

- Eén vaste bestemming: `https://thuisbatterijteam.nl/contact/adviesgesprek/`.
- Geen querystring, fragment, lead-ID, contactveld, URL van het plan, bronantwoord, referrerparameter of dossierinhoud.
- Gewone navigatielink met `rel="noopener noreferrer"` en `referrerpolicy="no-referrer"`. Geen prefetch, iframe, pixel of automatische cross-domain fetch.
- Geen verzending door alleen een kaart te zien, een resultaat te krijgen of een download te maken.
- Geen nieuwe analytics-event tenzij apart goedgekeurd en onder bestaande opt-in/GPC/DNT-regels gebracht.
- De standaardproductiebouw toont de pilot niet zolang de activatiebeslissing ontbreekt. Een feature flag is registratie van een goedgekeurde beslissing; geen vervanging voor die beslissing.
- Gratis gebruik, PDF/ZIP, import, lokale plannen en export blijven volledig beschikbaar zonder aanvraag.

### Gates voor alleen deze pilot

1. Eigenaar bevestigt juridische exploitant van SubsidieReady, publieke contactgegevens en rol/relatie met TBT B.V.
2. Eigenaar bevestigt TBT als ontvanger voor **thuisbatterijadvies**, de verantwoordelijke opvolger en toegestane contactkanalen.
3. Juridische/contactcopy, privacylink en doelgebonden telefoonverzoek zijn beoordeeld. Geen generieke toestemming voor alle eigen bedrijven of toekomstige reclame.
4. Browsercontrole van formulier, mobiele bediening, weigeren/toestaan van tracking, terugnavigeren en netwerkgedrag zonder persoonsgegevensoverdracht.
5. Na toestemming voor een concrete synthetische test: aantoonbare ontvangst bij de bedoelde organisatie, uitsluitend gewenste opvolging, geen nieuwsbrief of onverwachte tweede ontvanger. Testgegevens afvoeren volgens afgesproken procedure.
6. Exacte PR en publicatie worden beoordeeld, gevolgd door liveacceptatie en een eenvoudige revertmogelijkheid.

Documentupload, accountbeheer of een nieuwe database zijn **geen vereiste voor deze uitgaande-linkpilot**. Zij krijgen eigen gates wanneer die functies werkelijk worden aangezet.

### Opgeleverde technische voorbereiding

`scripts/lead-pilot.cjs` is een pure build-time module; `scripts/lead-pilot.config.json` bevat de standaard **uitgeschakelde** configuratie. Er is geen backend, browser-JavaScript, meting, gegevensinvoer of opslag aan toegevoegd. Integratie in uitsluitend een passende thuisbatterijpagina is mogelijk via `render()`; de huidige standaard levert een lege string.

- `validate(config)` controleert het gesloten schema en de vaste ontvanger/URL's. Een ingeschakelde pilot met ontbrekend bewijs breekt de build af.
- `render(config)` geeft alleen na geldige configuratie en zes ingevulde bewijsverwijzingen de statische advieskaart terug. Beide links onderdrukken referrer; geen parameters of verborgen doorgifte.
- `report(config)` geeft uitsluitend `status`, `missingApprovals` en `renderAllowed` terug. Deze status zegt of renderen volgens de configuratie mag, niet dat publicatie of juridische goedkeuring zelfstandig is bewezen.
- `node scripts/lead-pilot.cjs --check` toont de huidige status. Geldig uitgeschakeld eindigt succesvol; ingeschakeld met ontbrekende besluiten of een ongeldige configuratie eindigt met een foutcode.

De zes bewijsvelden (`controller`, `relationship`, `recipient`, `formAndPrivacy`, `receipt`, `ownerPublication`) staan allemaal op `null`. Een geldig bewijs is een concrete issuecomment-/PR-review-URL binnen deze repository; een boolean, losse issue-URL of tekst “approved” voldoet niet. De module controleert uitsluitend het formaat. Een reviewer moet de verwezen beslissing daadwerkelijk lezen en beoordelen. Synthetische referenties komen alleen voor in de expliciet gemarkeerde unit-testfixture en zijn geen eigenaarstoestemming.

De unit-tests bewaken standaard UIT, ieder ontbrekend besluit, onveilige URL's/extra velden, de veilige synthetische render en de CLI. Native leadopslag, accounts, mail, documentkluis en CRM hebben hun eigen latere gates; deze voorbereidende kaart activeert daarvan niets.

## 3. Contactaanvraag en toekomstige marketing gescheiden

Een bewust ingediend adviesverzoek moet aantonen wie over welk onderwerp en via welk kanaal contact mag opnemen. Het is geen toestemming voor algemene campagnes. Laat de juiste AVG-grondslag voor de gevraagde dienstverlening afzonderlijk vaststellen; een checkbox met “ik ga akkoord met privacy” is op zichzelf geen adequate grondslag of bewijs van vrije marketingtoestemming.

De ACM bevestigt dat sinds **1 juli 2026** de algemene klantrelatie-uitzondering voor commerciële telefonie vervalt. De actuele bedrijfsuitleg verlangt bewijs van bewuste, nog geldige toestemming voor het betreffende product/dienst, met eenvoudige intrekking. De AP beschrijft dat toestemming vrij, specifiek, geïnformeerd en ondubbelzinnig moet zijn, en aantoonbaar op basis van de informatie die vooraf is gegeven. Gebruik daarom afzonderlijke doeleinden voor gevraagd advies en eventuele toekomstige aanbiedingen. De oudere AP-telemarketingpagina die nog de algemene bestaande-klantenuitzondering noemt is geen basis om de recentere ACM-uitleg te negeren. [ACM wijziging](https://www.acm.nl/nl/publicaties/vanaf-1-juli-strengere-regels-voor-telemarketing-alleen-nog-maar-als-klant-toestemming-heeft-gegeven), [ACM actuele bedrijfsuitleg](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/verkoop-telemarketing), [AP toestemming](https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming).

Voorbeeld voor een latere native aanvraag, nog te beoordelen:

> Ik vraag Thuisbatterij Team B.V. om mij per [zelf gekozen e-mail/telefoon] te benaderen over mijn thuisbatterijadviesvraag. Ik kan dit verzoek intrekken via [bevestigd contactpunt].

Deze actieve contactkeuze staat los van accountaanmaak, online bewaren, downloads en statistieken. In de eerste native release is toekomstige marketing niet nodig; laat die functionaliteit uit. De AP licht bovendien toe dat een account of nieuwsbriefinschrijving geen klantrelatie bewijst. [AP direct marketing](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/direct-marketing).

## 4. Minimaal gegevenscontract voor een latere eigen inbox

Dit is een implementatiecontract voor een afzonderlijke PR na goedgekeurde gegevensstromen. Het maakt de beta niet productierijp.

| Veldgroep | Toegestaan doel en begrenzing |
| --- | --- |
| Identificatie | Servergegenereerde `request_id`, `schema_version`, `controller_id` en goedgekeurde `recipient_entity_id`. Geen account- of dossierkoppeling als standaard. |
| Vraag | Vooraf bepaalde `topic` (eerste pilot: thuisbatterij), `help_type`, optioneel grof `timeline`. Geen geschatte koopkracht/inkomensscore. |
| Contact | Naam indien noodzakelijk; gekozen contactkanaal en daarvoor noodzakelijk contactgegeven. Als e-mail voor verificatie ook bij telefoon nodig is, leg dat doel vooraf uit. |
| Optionele context | Hooguit postcodegebied van vier cijfers indien een bevestigd servicegebied dit nodig maakt. Korte vraagtekst met waarschuwing geen financiële of andere gevoelige gegevens in te voeren. |
| Bewijs | `contact_requested_at`, kanaal, ontvanger, doel, exacte contacttekst-/privacyversie, verificatiemethode en `verified_at`. Opslaan in private operationele data, niet in analytics. |
| Herkomst | Alleen goedgekeurde vaste categorie, zoals `subsidieready_battery_article`; geen volledige URL, querystring, user-ID, fiscale keuze of browserfingerprint. |
| Lifecycle | Status, tijdstempels, toegestane medewerker-/entiteitstoewijzing, reden voor invalid/withdrawn en vastgestelde `retention_until`. |
| Verboden | Documenten, facturen, BSN, rekeningnummer, inkomen, KOR-/btw-antwoorden, leningsgegevens, particuliere plandata, onnodig volledig adres, advertentie-ID's of automatisch overgenomen notities uit werkbanken. |

### Lifecycle en rechten

`pending_verification` → `verified` → `qualified` → `assigned` → `contacted` → `appointment` → `quote` → `won`/`lost`. `invalid`, `withdrawn` en retentieverwijdering zijn aparte afsluitingen. De operationele status mag niet verhullen dat een contactwens is ingetrokken.

Een geverifieerd contact is nog geen gekwalificeerde lead: kwalificatie vereist een reële vraag, correct eigen aanbod en servicegebied, bruikbaar gekozen contactkanaal en een niet-ingetrokken verzoek. Verificatie van een e-mailadres bewijst geen eigendom van een opgegeven telefoonnummer. Neem dat onderscheid op in verificatie en misbruikafhandeling.

Salesagents zien alleen toegewezen aanvragen binnen hun rechtspersoon; managers uitsluitend hun entiteit. Support heeft geen algemene sales- of documentinzage. Intrekking blokkeert nieuwe contacttaken en retries onmiddellijk. Een salesmedewerker kan dit niet ongedaan maken. Terugzetten van een oude backup mag een ingetrokken verzoek niet heractiveren: reconciliatie met het actuele bezwaar-/intrekkingsregister is een releasegate.

### Transactionele outbox en latere CRM-adapter

- Schrijf een geverifieerde aanvraag en een handoff-event atomair naar duurzame private opslag; stuur geen webhook tijdens de publieke HTTP-request als vervanging voor een duurzaam record.
- Idempotentiesleutel bindt ontvanger, aanvraag-ID en eventversie. Dezelfde sleutel met dezelfde payload geeft hetzelfde resultaat; een andere payload geeft een conflict. Een key bewaart geen telefoonnummer of e-mailadres.
- Worker claimt een taak met lease, verstuurt met dezelfde idempotentiesleutel en legt ontvangstbevestiging vast. Maximaal aantal retries, back-off, timeouts, dead-letterstatus en verantwoordelijke medewerker worden vooraf vastgesteld.
- Controleer vóór iedere poging opnieuw ontvanger, actuele toestemming/contactwens, intrekking, vervaldatum en toegang. Laat een ingetrokken taak niet doorlopen omdat zij al in de queue stond.
- Registreer remote ontvangst-ID; tel alleen geaccepteerde records als ontvangen. Een `mail()`-succes betekent acceptatie door het mailsysteem, geen aflevering of CRM-ontvangst.
- Operational logs bevatten alleen technische IDs, tijd, status en foutcode. Geen contactinhoud, OTP, tokens of e-mailadressen in logs, GitHub, monitoringmeldingen of gewone notificatiemail.
- Onderteken/valideer callbacks, voorkom replay, controleer exacte entiteit/database. Een Odoo-verbinding krijgt uitsluitend de vooraf beoordeelde velden en rechten.
- Een kill switch pauzeert workers zonder reeds geaccepteerde aanvragen te verliezen. Rollback heractiveert geen geschrapte toestemming en verwijdert geen private klantrecords automatisch.

**Concrete beperkingen in de huidige beta:** `lead-create` dedupliceert alleen dezelfde request-ID binnen dezelfde browsersessie; het vergelijkt daarbij geen payloadfingerprint. Mailqueue-deduplicatie bestaat, maar is geen CRM-outbox. De mailworker verstuurt binnen een globale statetransactie; lockduur en externe levering zijn niet productierijp bewezen. `request-revoke` bewaart een status, maar er is nog geen toekomstige CRM-worker die suppression afdwingt. Bestaande tijdelijke retentie verwijdert pending na één dag en lost/invalid/withdrawn na 90 dagen; dit zijn testdefaults, geen goedgekeurd beleid. Open/won-leads en backups hebben nog geen volledige vastgestelde bewaarlifecycle.

## 5. KPI-contract zonder schijnzekerheid

| Meetwaarde | Teller/noemer en bron | Beperking vóór activatie |
| --- | --- | --- |
| Organische zoekprestatie | Werkelijke Search Console-impressies/klikken per datum, canonieke pagina en zoekdimensie | Alleen tonen nadat de juiste property en data zijn bevestigd. Geen ranking- of trafficraming als gerealiseerd resultaat. |
| Toolgebruik | Toegestane enumerated events per periode | Bestaande events tellen gebeurtenissen; page-lifetime deduplicatie bewijst geen unieke bezoeker of sessie. |
| Advieslinkklik | Optionele, apart goedgekeurde klikgebeurtenis | Een klik is geen aanvraag. De pilot werkt ook zonder klikmeting. |
| Geaccepteerde aanvraag | Server heeft één unieke aanvraag duurzaam geaccepteerd | Pas native intake of ontvangende TBT-administratie kan dit bewijzen. Geen client-success als enige waarheid. |
| Verificatie | Contactgeverifieerde aanvragen / geaccepteerde aanvragen uit dezelfde aanmaakcohort | Niet iedere geverifieerde aanvraag is passend; pending en mislukte verificatie blijven herkenbaar. |
| Kwalificatie | Passende, niet-ingetrokken aanvragen / geverifieerde aanvragen uit dezelfde cohort | Vooraf vaste criteria per aanbod en entiteit. Geen fiscale koopkrachtprofilering. |
| Afspraak/offerte/verkoop | Respectieve unieke statusovergangen / gekwalificeerde aanvragen uit dezelfde cohort | Tel periode-overgangen afzonderlijk van cohorten; houd observatievenster en nog open aanvragen zichtbaar. |
| Responstijd | Eerste echte gewenste reactie minus verificatie-/beschikbaarheidsmoment | Automatische ontvangstmail telt niet als menselijke reactie. Gebruik dezelfde definitie voor mediaan en percentielen. |
| Toestemmingsdekking | Toegestane metingen / alle eligible keuzemomenten, alleen als beide toegestaan en meetbaar zijn | Huidige opt-in-telemetrie ziet weigeraars niet. Dekking is nu onbekend; geen heimelijke deny-events toevoegen om de noemer te krijgen. |

**Zonder referrer/parameters is de eerste uitgaande-linkpilot bewust niet end-to-end attribueerbaar.** De eigen TBT-administratie kan later een vrijwillig opgegeven herkomst onderscheiden, of er kan na review een vaste niet-persoonlijke broncode komen. Dat is een afzonderlijke wijziging. Deel GSC-klikken of toegestane tool-events niet door TBT-leads om een conversiepercentage te publiceren: populaties, browsers, toestemming en perioden zijn niet aantoonbaar gekoppeld.

Toon voor niet beschikbare data **nog niet gemeten**, niet `0` alsof er een werkende nulmeting is. Demo's zijn afzonderlijk gelabeld en uitgesloten. Operationele leadregistratie en optionele webanalytics hebben verschillende doeleinden; account-, dossier- of contactIDs verschijnen nooit in publieke analytics.

## 6. Beslissingen en technische bewijsvoering vóór verdere activatie

**Eerst van de eigenaar nodig:**

1. De exacte exploitant/verwerkingsverantwoordelijke van SubsidieReady met KvK, zakelijk contact/privacycontact en de relatie tot Thuisbatterij Team B.V.
2. Bevestiging dat de eerste route uitsluitend thuisbatterijadvies aan TBT B.V. betreft; welke eigen medewerkers volgen dit op en via welke expliciet gekozen kanalen?

**Daarna concreet te beoordelen, geen algemeen “alles akkoord”-vakje:**

- Doel/rechtsgrond, contactcopy, privacypublicatie, verwerking tussen entiteiten, bezwaar-/verwijderroute, termijnen voor aanvraagstatussen, logs en backups.
- Hostinger PHP/sodium/fileinfo/PDO-capaciteit, private opslag die redeploy overleeft, locking, quota, backup-restore en eventuele transactionele databasekeuze. Huidige hosting en bestaande capaciteit onderzoeken; geen betaalde aankoop noodzakelijk maken zonder bewijs.
- Afzender en bestaand SMTP-transport, SPF/DKIM/DMARC, rate limits, bounce/retry-afhandeling en aantoonbare testaflevering.
- Afzonderlijke personeels-MFA/rechtencontrole voordat echte salesgegevens leesbaar worden. Documentkluis pas bij bewezen malware-infrastructuur en ownership-/verwijdertests.
- Synthetische stagingtests voor dubbele submit, gewijzigd payload bij dezelfde sleutel, netwerkuitval na acceptatie, tweede entiteit, intrekking tijdens retry, verlopen contactwens, restore en meerdere browsers.

Alle operationele vervolgacties blijven uit tot de bijbehorende besluiten en technische resultaten vastliggen. SEO/content en lokale gratis tools kunnen ondertussen zelfstandig verder worden verbeterd.

## Bronnen en inspectie

- Repository: `assets/metrics.js`, `api/event.php`, `server/bootstrap.php`, `server/next/service.php`, `scripts/next/mail-worker.php`, `scripts/next/maintenance.php`, `docs/next/config.example.php`, `docs/next/SECURITY.md`, `docs/next/STAGING.md`.
- [TBT adviespagina](https://thuisbatterijteam.nl/contact/adviesgesprek/), [TBT privacybeleid](https://thuisbatterijteam.nl/voorwaarden-beleid/privacybeleid/), [TBT cookiebeleid](https://thuisbatterijteam.nl/voorwaarden-beleid/cookiebeleid/): publiek gelezen, geen formulierverzending.
- [ACM, wijziging telemarketing, gepubliceerd 25 juni 2026](https://www.acm.nl/nl/publicaties/vanaf-1-juli-strengere-regels-voor-telemarketing-alleen-nog-maar-als-klant-toestemming-heeft-gegeven), [ACM actuele bedrijfsregels](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/verkoop-telemarketing).
- [AP, toestemming](https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming), [AP, direct marketing](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/direct-marketing): geraadpleegde officiële zoekresultaatinhoud; direct openen van de toestemmingspagina gaf in deze omgeving HTTP 403. Geen volledige juridische review geclaimd.
