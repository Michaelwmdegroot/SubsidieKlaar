# SubsidieReady × Thuisbatterij Team — eerste vrijwillige leadpilot

**Start:** 16 november 2026 · **Eerste commerciële route:** alleen gewone uitgaande link vanuit een inhoudelijke thuisbatterijpagina  
**Beoogde ontvangende onderneming:** Thuisbatterij Team B.V. · **SubsidieReady-exploitant:** NIVO Groep Holland B.V.  
**Verslag-/ownerbesluit:** [Issue #12, preflight](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/12#issuecomment-6904477332) · **Systeemgates:** `scripts/lead-pilot.cjs` en `scripts/lead-pilot.config.json`.

## 1. Wat werkelijk is gecontroleerd

- De officiële TBT-adviespagina `https://thuisbatterijteam.nl/contact/adviesgesprek/` heeft een zichtbaar vrijwillig adviesformulier voor thuisbatterijen. Via de bestaande WordPressverbinding is de werkelijke formulieractie read-only gecontroleerd: POST van gebruiker naar TBT's eigen `admin-post.php` met vast type `adviesgesprek`. Het invullen vindt **niet** plaats op SubsidieReady.
- TBT's eigen privacybeleid op `https://thuisbatterijteam.nl/voorwaarden-beleid/privacybeleid/` noemt Thuisbatterij Team B.V. als verantwoordelijke. De adviespagina beschrijft de behandeling van de aanvraag, geen verplichte offerte of aankoop.
- Met een administratieve, **read-only** controle is de TBT-native intake als actief/primary vastgesteld. Het systeem heeft een gejournaliseerde, duurzame leadregistratie en een aparte SMTP-afleverwachtrij. De worker-heartbeat was gezond. Historische adviesaanvraagmeldingen waren daadwerkelijk in de gekoppelde eigen TBT-leadmailbox aanwezig. **Geen klantnamen, adressen, nummers, lead-ID's of inhoud** zijn in deze repository gekopieerd.
- **Aandachtspunt:** het telefoonnummer in TBT's privacybeleid wijkt af van de publieke advies/contact/cookiepagina's. Voor de statische link wordt géén telefoonnummer overgedragen, maar TBT moet dit redactioneel corrigeren. De browsertrackercontrole bij TBT vóór cookieconsent staat nog open.
- Geen nieuwe synthetische formulier-POST uitgevoerd; de eerste echte **specifiek vanaf SubsidieReady** ingestuurde aanvraag is dus nog niet afzonderlijk waargenomen. Zonder herkomstparameter of referrer is die later niet betrouwbaar als SubsidieReady-bron toe te schrijven.

## 2. Wat in deze release live mag

- Uitsluitend op `/hulp/thuisbatterij-btw/` staat de vrij te kiezen kaart **Commercieel productadvies** met concrete vermelding **Thuisbatterij Team B.V.**.
- De gebruiker vertrekt zelf naar de bestaande TBT-adviespagina of de aparte TBT-privacyuitleg in een nieuw tabblad. Beide links gebruiken `noopener noreferrer` en `referrerpolicy=no-referrer`.
- Geen accountregistratie of ingelogde sessie nodig. Er worden **geen** namen, telefoons, inkomens, fiscale gegevens, vragenlijstantwoorden, dossiers, URL-query's of cookies naar TBT verzonden door de kaart te bekijken of een klik.
- De gratis regelingencheck, warmtepomp-PDF/ZIP, lokale planner en accountplan blijven volledig beschikbaar.
- Geen nieuwe browsertracking, pixel, interne click-ID, webhook, API-POST, mailer of CRM-adapter. De native SubsidieReady `leads`, `vault` en `staff` productieflags blijven uit.

**Waarom de pilot geen conversies claimt:** de CTA biedt een werkende route naar de al bestaande ontvangende TBT-formulierdienst. Technisch werkende link ≠ ingestuurde aanvraag ≠ mailontvangst ≠ gekwalificeerde lead/afspraak/verkoop. Deze keten moet later met toestemming en gepaste minimale meting worden gevalideerd.

## 3. Acceptatie en veilige rollback

1. **Build & QA** — `npm run build`, `npm test`, `npm run package`, `npm run audit:seo`, `npm run check:lead-pilot`; gecontroleerde bronverwijzingen in `scripts/lead-pilot.config.json`. Alle andere artikelen mogen de commerciële kaart niet bevatten.
2. **Browser** — overzichtelijk artikel op desktop/390px/320px, correct zichtbare button, beide links zonder query/fragment en met expliciete nieuwe-tab/referrerbeveiliging. Geen ongewenste externe request door het laden, scrollen of niet-klikken.
3. **Live** — exacte `main` deploy op Hostinger; controleer dat de kaart na de inhoudelijke uitleg staat, de beide TBT-pagina's bereikbaar zijn en de oorspronkelijke links en gratis tools nog werken. Verwijs niet naar een chat/screenshot met persoonsgegevens.
4. **Ontvangst en verkoop-GO (vervolg)** — eerste vrijwillige synthetische aanvraag met expliciete toestemming op de TBT-pagina en bevestiging in juiste TBT-inbox, voordat er attributie of funnelconversie wordt geclaimd. Die test moet opnieuw apart worden afgesproken om geen operationele salesfunnel te vervuilen.
5. **Rollback** — verwijder de commerciële kaart zonder verlies van consumentengegevens: zet `enabled:false` in `scripts/lead-pilot.config.json`, laat approvals gedocumenteerd staan, bouw/test en deploy opnieuw. Stop geen bestaande TBT-verzoeken of mailworkers.

### Extra live doelcontrole vóór merge

De aparte, read-only GitHub Actions-workflow `.github/workflows/tbt-target-preflight.yml` opent het **echte TBT-adviesformulier** in een nieuwe Chromium-sessie. Hij controleert de WordPress form-action/ontvangerroute in mobiele browser, zichtbare privacyuitleg en of Google Consent Mode advertentie- en analytics-opslag standaard weigert. De test **verstuurt nooit een formulier** en logt alleen veilige indicatoren en trackerhostnamen, geen URL's, cookies of persoonsgegevens. Een onbruikbaar formulier of ontbrekende denied-defaults is **NO-GO/UNKNOWN**. Bij de eerste browsertest waren er al vóór de cookiekeuze verzoeken naar Google-meetdiensten. Omdat een denied Consent Mode ook cookieless pings kan verzenden, is het **niet bewezen dat dit onrechtmatige cookies zijn en evenmin bewezen dat TBT volledig compliant is**. Deze verzoeken blijven zichtbaar als `externalMeasurementReview=true` en vereisen een aparte TBT-cookie-/payloadaudit, los van de gewone no-referrer-link op SubsidieReady.

De waarneming van bestaande TBT-mailmeldingen en deze browsercontrole vullen elkaar aan: de ene bewijst aflevering van eerdere aanvragen, de andere een bereikbare bestemming. Geen van beide bewijst al een eerste nieuwe conversie vanuit SubsidieReady.

## 4. Juridische afbakening

Het tonen van een gewone link maakt SubsidieReady-accountgebruikers of toolbezoekers **niet** automatisch salesleads. De TBT-website behandelt pas gegevens als de bezoeker daar vrijwillig een aanvraag indient. Algemene marketing-e-mails/telefoongesprekken vereisen een andere, passende en aantoonbare grondslag/toestemming; deze CTA biedt die niet. Een eventueel toekomstig native adviesformulier of CRM-koppeling vereist opnieuw een aparte privacy-, retentie-, rechten- en ontvangstreview.

De expliciet benodigde bewijsvelden van de bestaande code zijn gezamenlijk beoordeeld in [deze issuecomment](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/12#issuecomment-6904477332), zonder te doen alsof de eigenaar nieuw transport/marketing heeft goedgekeurd.

## 5. Bewust niet uitgevoerd

Geen wijziging aan TBT WordPress of mailconfig, geen backend-to-backend-overdracht, geen nieuwe accountvelden, geen subsidie-/btw-rekenregels, geen paid APIs, geen verkoopmail uit SubsidieReady en geen automatische publicatie van nieuwe broninhoud.
