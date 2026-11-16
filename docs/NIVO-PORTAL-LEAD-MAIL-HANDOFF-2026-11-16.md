# SubsidieReady → NIVO Portal-mailbox | geverifieerde adviesaanvragen

**Opdracht:** 16 november 2026. **Bestemming:** `portal@nivogroepholland.nl` (eigen NIVO Groep Holland B.V.).  
**Eigenaarbesluit:** [Issue #9, centrale mailroutering](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/9#issuecomment-6905282062).  
**Vervangt:** de eerdere TBT B.V.-adviesverwijzing op de thuisbatterijpagina. Deze wordt in `scripts/lead-pilot.config.json` weer uitgeschakeld en de TBT-monitor blijft alleen handmatig beschikbaar.

## Werkelijke flow

1. Bezoeker gebruikt gratis SubsidieReady-informatie en **kiest zelf** `Vraag vrijblijvend advies aan` op `/hulp/thuisbatterij-btw/`.
2. `/advies/` laat een zelfstandig, vrijwillig formulier zien; **geen account nodig**. De bezoeker kiest het onderwerp, gewenste contactkanaal en eventueel tijdspad, vult naam en e-mail in, eventueel telefoon bij gekozen belcontact, optioneel postcodegebied (vier cijfers) en een korte vraag (maximaal 500 tekens). Geen documenten, fiscaal profiel, inkomen, accountdata, tracker-id, volledige woning-/energiedossieropslag of automatische profielvooraanvulling.
3. Na een **afzonderlijk verplicht akkoord voor specifiek gevraagd contact**, maar zonder toestemming voor marketing, maakt de bestaande `auth-start`-API met `purpose=portal` een tijdgebonden OTP aan. Alleen de contactvraag is maximaal tien minuten in de bestaande versleutelde private challenges opgeslagen. Aanvraag is dan **nog niet verzonden naar sales**.
4. Alleen na de juiste **eenmalige, sessiegebonden achtcijferige e-mailcode** stuurt `auth-verify` een klein, getypeerd `portal`-bericht naar de bestaande versleutelde MySQL-mailwachtrij, gericht aan de op serverniveau vaste mailbox `portal@nivogroepholland.nl`. De respons `portalQueued=true` betekent **in de wachtrij opgenomen**, geen bewijs van aflevering.
5. De al bestaande Hostinger-cronworker verzendt via de huidige beveiligde SMTP-AUTH-verbinding. De mail heeft een generiek onderwerp zonder persoonsgegevens, een unieke `SR-`-referentie en uitsluitend een versiegebonden JSON-blok voor de toekomstige NIVO Portal-agent.
6. Zodra SMTP het bericht accepteert, wist de bestaande worker de volledige berichtinhoud uit de eigen wachtrij. De gebruiker ontvangt geen automatische reclame of account.
7. Een latere, aparte **Portal-agent** verwerkt de mailbox, dedupliceert op `request_id`, registreert verificatie en gekozen contactkanaal, voert opvolging/retentie/bezwaar uit en koppelt eventuele afspraak/offerte/verkoop. **Geen Portal-API of draaiende Mac nodig om een aanvraagmail te versturen.**

## Stabiel mailcontract

**Onderwerp:** `SubsidieReady | Nieuwe geverifieerde adviesaanvraag`  
**Nodige kenmerken:** `BEGIN_SUBSIDIEREADY_PORTAL_JSON` en `END_SUBSIDIEREADY_PORTAL_JSON`.

Het JSON-blok bevat exact:
- `schema=subsidieready.nivo.portal.request.v1`
- `request_id=SR-...` — uniek en te gebruiken als idempotentiesleutel
- `verified_at_utc`
- `controller=NIVO Groep Holland B.V.`, `receiver=portal@nivogroepholland.nl`, `source=subsidieready`
- `topic` (eigen aanbod), `name`, `verified_email`, `preferred_channel`
- `phone` uitsluitend bij zelf gekozen telefonisch contact
- `postcode_area` (optioneel), `timeline`, `question` (maximaal 500 tekens)
- `contact_requested=true`, `request_text_version=2026-11-16-nivo-portal-v1`
- `marketing_opt_in=false` — expliciet géén nieuwsbrief of algemene reclame.

**Let op:** de e-mailbevestiging bewijst toegang tot e-mail, **niet** bezit van het opgegeven telefoonnummer. Bij gekozen belcontact mag NIVO alleen over dat concrete gevraagde advies spreken. De Portal-agent mag niet automatisch andere aanbiedingen versturen of dossiers inzien.

## Bewijs en privacygrenzen

- MySQL/AES-GCM-config en SMTP zijn eerder op de echte Hostinger-server geverifieerd. In deze wijziging worden **geen bestaande private secrets, databasegegevens, cronfrequenties, accountflags of encryptiesleutels aangepast**.
- De native `leads_enabled=false`, `vault_enabled=false`, `staff_enabled=false` productiegates blijven vereist; dit is een **apart, klein transactioneel e-mailpad**, geen CRM-/salesinboxactivatie.
- Formulier/subsidiebezoek, accountaanmaak, accountprofiel, opt-in voor marketing en opgeslagen project zijn geen adviesaanvraag.
- OTP- en submitlimieten, same-origin / CSRF, de bestaande mailqueue met idempotent `portal:<challenge-id>` en gescheiden account-/requestpurpose blijven behouden.
- De private mailwachtrij bevat noodzakelijke contactdata alleen totdat het bericht is verzonden, verlopen of mislukt. Het mailbericht zelf en verdere bewaartermijnen vallen daarna onder de NIVO Portal/mailbox; die retentie en eventuele back-upverwerking moeten door de Portal-agent worden vastgelegd. Een gebruiker kan bij `info@nivogroepholland.nl` om inzage, correctie of intrekking van gewenste opvolging verzoeken.
- SMTP-acceptatie is **niet** hetzelfde als ontvangst in de mailbox. Dat moet na de eerste echte synthetische, geverifieerde aanvraag van de eigenaar afzonderlijk worden aangetoond. Geen persoonsgegevens, voorbeeld-OTP of bestaande klantenmail in GitHub.

## Release- en herstelprocedure

1. Quality, PHP-test, MySQL/MariaDB, browser, gegenereerde publieke assets, privacytekst, endpoint- en consenttesten zijn geslaagd op een kleine PR.
2. Productie-URL `/advies/` toont de juiste NIVO-ontvanger; e-mailcode wordt via bestaande worker bezorgd; géén aanvraagmail vóór verificatie.
3. Eenmalige eigenaarstest met fictieve naam/onderwerp en een eigen testmailadres; controleer inbox `portal@nivogroepholland.nl` op onderwerp, referentie, juiste JSON-velden, één uniek bericht en geen ongevraagde extra afleveringen. Deel nooit echte code of klantinhoud via GitHub/chat.
4. Daarna kan de **Portal-agent** de parser, duplicaten, opvolging en rechtensysteem bouwen zonder dat deze SubsidieReady-code opnieuw moet worden gekoppeld.

**Rollback bij fouten:** een gecontroleerde revert van de PR herstelt de eerdere publieke advieskaart en stuurt geen nieuwe native NIVO-mails meer. Al verzonden e-mails blijven in de Portal-mailbox bestaan en mogen niet als onderdeel van een Git rollback worden verwijderd. Een eventuele private mailwachtrij moet apart worden geïnventariseerd voordat een rollback uitgevoerde aanvragen raakt.

## Open vervolg

- Bestaande account-E2E: werkelijk online plan ophalen in tweede browsersessie en accountdelete.
- Echte Portal-inboxontvangst en veilige mailverwerking, retries/monitoring per afzender en formulierafhandeling onder consent.
- Beheer van wettelijke bewaartermijnen, bezwaar en rechten door de toekomstige Portal-agent.
- Echte funnelstatistieken uit eigen NIVO-verwerkingen, niet uit fictieve klik-/leadcounts.
- Google Search Console/indexering en de daadwerkelijke organische conversie.

