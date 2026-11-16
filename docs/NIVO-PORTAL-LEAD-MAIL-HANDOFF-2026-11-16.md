# SubsidieReady → NIVO Portal | directe adviesleads V2

**Eigenaarbesluit (16 november 2026):** schaf de e-mailverificatie voor vrijwillige adviesaanvragen af; vraag direct NAW, e-mail en telefoon. De ontvanger blijft **portal@nivogroepholland.nl**, onder NIVO Groep Holland B.V. Deze overdracht vervangt het OTP-contract V1 uit PR #45/#46. De bestaande accountlogin houdt wel zijn OTP.

## Flow

1. Een bezoeker kiest vrijwillig /advies/, zonder account of gekoppeld verduurzamingsdossier.
2. Het compacte formulier vraagt onderwerp, tijdspad, contactvoorkeur, volledige naam, e-mail, telefoon, straat, huisnummer, volledige Nederlandse postcode, woonplaats en optioneel een korte vraag.
3. Een standaard niet-aangevinkte, verplichte contactcheckbox geldt alleen voor deze aanvraag, niet voor reclame. Na de klik gaat POST /api/next/?action=portal-submit rechtstreeks naar de backend, **zonder OTP**.
4. Backend controleert Origin, CSRF, vaste schema- en consentversie, veldvalidatie, een verborgen honeypot en limieten (3 per e-mailadres / uur en 10 per IP / uur). Herhaalde POST met dezelfde sessiegebonden submissionId is idempotent.
5. Er volgt één SR-referentie en één bericht in de bestaande versleutelde MySQL-mailwachtrij. De Hostinger-cronworker verzendt via bestaande SMTP-AUTH naar het vaste, server-side Portal-adres. Er is geen Portal-API-koppeling of draaiende Mac nodig.
6. De succesmelding betekent **veilig in de verzendwachtrij geplaatst**, niet bewezen SMTP-acceptatie, inboxontvangst of opvolging.

## Mailcontract voor toekomstige Portal-agent

**Onderwerp:** SubsidieReady | Nieuwe adviesaanvraag

**Markers:** BEGIN_SUBSIDIEREADY_PORTAL_JSON en END_SUBSIDIEREADY_PORTAL_JSON

**Schema:** subsidieready.nivo.portal.request.v2

De JSON bevat:
- request_id (unieke SR-... sleutel), submitted_at_utc
- controller=NIVO Groep Holland B.V., receiver=portal@nivogroepholland.nl, source=subsidieready
- topic, timeline, preferred_channel (email / phone), question (maximaal 500 tekens)
- name, email, phone, postcode_area
- address: street, house_number, postal_code (genormaliseerd tot 1234AB), city
- email_verified=false, verification_method=none
- contact_requested=true, contact_consent_at_utc, request_text_version=2026-11-16-nivo-portal-v2
- marketing_opt_in=false

**Migratie V1 → V2:** V1 had verified_email en verified_at_utc na een e-mailcode; V2 gebruikt email, email_verified=false en submitted_at_utc. De Portal-parser moet beide schema's expliciet onderscheiden. Markeer V2-leads nooit als geverifieerd; het opgegeven telefoonnummer is evenmin geverifieerd. Gebruik request_id voor deduplicatie.

## Privacy- en veiligheidsgrenzen

- De vrijwillige aanvraag heeft geen toegang tot accountprofielen, plannen, documenten, fiscale gegevens, marketingvoorkeuren of de native salesdatabase.
- De ontvanger staat vast in de code. Alleen lokale testconfig of productie met NIVO-controller, gereedstaande transactiemail en versleutelde MySQL voldoet aan de productiegate.
- De browser bewaart de formulierinhoud niet via localStorage of sessionStorage; berichtinhoud wordt na succesvolle SMTP-acceptatie door de mailworker uit de queue verwijderd.
- De toekomstig Portal-agent beheert de verdere bewaartermijnen, bezwaar, verwijdering, eerste contact, kwalificatie en opvolging. Geen generieke nieuwsbrief of verkooptelefoontjes buiten deze vraag.
- Zonder OTP wordt de drempel lager, maar neemt het risico op verkeerd getypte of valse gegevens toe. Bewaak spamvolume en afleverbaarheid; voeg niet opnieuw standaard een code toe zonder eigenaarbesluit.

## QA, release en echte ontvangst

- Vereist: npm run build, npm test, npm run package, SEO-check, PHP/SQL-regressie en echte Chromium-regressie.
- Browserdoel: op desktop 1440×900 staat de volledige vorm inclusief verzendknop binnen de viewport; mobiel 390/320 px heeft geen horizontale overflow.
- API-doel: een geldige aanvraag queued direct één Portal-mail met NAW; een herhaling met dezelfde submissionId geeft dezelfde referentie. Ongeldige schema's, consent, honeypot, postcode, e-mail, telefoon of Origin/CSRF falen.
- **Productieacceptatie nog afzonderlijk nodig:** na merge en Hostinger-deploy een fictieve aanvraag met een beheerd testadres indienen en in portal@nivogroepholland.nl controleren of exact één mail met V2-schema aankomt. Geen test-NAW of echte klantdata in GitHub.
- Rollback: revert van de PR herstelt eerdere code, maar reeds verzonden mails en openstaande queue-items worden niet automatisch teruggedraaid.

## Volgende fase: zelfstandige organische leadmachine

Bouw door op broncontrole, Search Console, betrouwbare SEO-landingspagina's per maatregel, contextuele contact-CTA's, premium mobiel formulier, privacyvriendelijke funnelmeting en echte leadkwaliteit-/verkoopfeedback uit de toekomstige NIVO Portal. Een accountaanmaak of advertentieklik telt niet als gekwalificeerde lead.
