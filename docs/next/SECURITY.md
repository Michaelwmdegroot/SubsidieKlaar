# Next-level testrelease — beveiliging en expliciete grenzen

## Geen productie-upgrade

Deze code is een testrelease op een aparte branch. De gebruiker wil eerst testen, daarna besluiten over main. Er is geen wijziging in Hostinger, DNS, het bestaande beheerdersaccount of productieanalytics uitgevoerd. `SR_NEXT_CONFIG` ontbreekt standaard; de nieuwe API antwoordt dan 503 en de gastfuncties blijven bruikbaar. Het backendconfiguratiemodel accepteert alleen local/staging en weigert subsidieready.nl als online-servicedomein.

## Bewuste beta-opslagkeuze, nog geen SQL-productieplatform

De nieuwe server gebruikt **één vergrendelde, versleutelde JSON-staat en afzonderlijke versleutelde bijlagen** buiten de webroot. Er is geen MySQL/MariaDB-implementatie geleverd. De beschikbare lokale PHP-runtime heeft geen SQLite/PDO-database-driver; de gekozen adapter maakt echte end-to-end backendtests zonder betaalde infrastructuur mogelijk.

Begrenzing: één host, lokale filesystem-locking, maximaal 200 accounts, 500 leads, acht projecten per account, twaalf maatregelen per project, 30 serverbestanden / 50 MB per account, 10 MB per bestand en circa 10 MB database-inhoud. Dit zijn defensieve pilotlimieten, geen capaciteitstest of productie-SLA. De lock is maximaal drie seconden te verkrijgen; fail-closed bij fouten. Dit is **geen** databaseoplossing voor horizontale schaal, gedeelde NFS of een grote publieke campagne.

Vóór productie: Hostinger's permanente opslag en locking bewijzen, benchmarken met verwachte belasting, retentie/quota vaststellen, en de keuze bevestigen of migreren naar transactionele MySQL/MariaDB met dezelfde ownership-, revision- en auditinvarianten. De private configuratie en sleutel moeten redeploys overleven, buiten iedere release/webroot.

## Wat beveiligd is

- Libsodium secretbox authenticated encryption voor staat/bijlagen; sleutel buiten Git en webroot. Encryptie at rest, **niet end-to-end** en geen bescherming tegen volledige server/key-compromittering.
- Cryptografische IDs; echte eigenaarscontrole per plan/file/export/delete; sales kent geen algemene toegang tot consumentendossiers.
- Eenmalige 8-cijferige e-mailcode, tien minuten TTL, maximaal vijf pogingen, HMAC opslag, binding aan aanvragende browsersessie, throttling per contact/IP, sessierotatie.
- HTTPS en `__Host-` Secure/HttpOnly/SameSiteStrict op staging; lokale testcookie uitsluitend op 127.0.0.1. CSRF, Origin en Host-controles; cross-site Fetch Metadata geweigerd; geen tokens in URL of analytics.
- Aparte usergerichte actie voor online plannen en nogmaals per bestand. Inloggen alleen uploadt niets.
- Optimistic revisioncontrole; fout/conflict overschrijft geen andere client. Bewijswijziging maakt gerelateerde taakbevestigingen ongeldig en verhoogt de revisie.
- Upload allowlist PDF/PNG/JPEG, signature/typecheck, bounded payload/quotas, random versleutelde objectbestanden. Authenticated POST-download met attachment/nosniff; geen openbare bestands-URL.
- Stagingvault weigert upload als een werkelijk geconfigureerde `clamscan` ontbreekt/faalt/timeout geeft. Lokale `local_test_files` is alleen voor synthetische testbestanden. Er is geen antiviruscertificaat of sandbox voor PDF-inhoud.
- JSON veldallowlists voor data en leadintake; geen automatische fiscale/inkomensgegevens naar sales. Vrije tekst kan een gebruiker zelf verkeerd invullen: waarschuwing, minimale opslag en menselijke behandeling blijven nodig.
- Adviesverzoek blijft pending tot de contactmail is geverifieerd. Geen account of nieuwsbrief ontstaat uit de aanvraag. Intrekking kan niet door verkoper worden teruggedraaid.
- Rollen komen uit private configuratie. Salesagents alleen toegewezen leads binnen eigen entiteit; manager alleen eigen entiteit; export manager-only. Duidelijke ontvanger/contacttekstversie per aanvraag.
- Snapshot/restoredrill met hash/authenticated decryptcontrole; restore naar nieuwe private map, nooit automatisch actieve data vervangen. Sleutels afzonderlijk bewaren.

## Wat een productie-go blokkeert

- SubsidieReady's exacte juridische exploitant en de ontvangende ondernemingen/rollen zijn nog niet bevestigd. Fake lokale ontvangers zijn geen invulling daarvan.
- Geen bewezen SMTP/Hostinger-aflevering, SPF/DKIM/DMARC, bounce handling of mail-SLA. De code bevat een queue en PHP `mail()`-adapter; lokaal spoolt hij uitsluitend versleuteld. `mail()`-acceptatie is geen afleveringsbewijs. Een provider-/SMTP-adapter kan nodig blijken.
- Stafflogin gebruikt e-mailcode. Voor personeel met echte klantleads is een aanvullende sterke authenticatie/MFA-beslissing en toegangsreview vereist vóór openstelling. Er is geen admin-role-UI, MFA of onafhankelijke penetratietest geleverd.
- Geen goedgekeurde juridische bewaartermijnen, verwerkersovereenkomsten, hostinglocatie/logbeleid en DPIA-triage. De beta verwijdert verlopen codes, oude queueberichten, afgewezen/ingetrokken leads en oude auditregels volgens testdefaults. Automatische accountinactiviteit-delete is bewust niet aangezet.
- De tijdelijke testlimieten en het single-host bestandsmodel zijn geen productiearchitectuur-go. Retentie van gewonnen/open leads en juridische administratie moet passend worden vastgesteld; niet onbeperkt verzamelen omdat de code het toelaat.
- Geen Search Console-activatie, echte CRM/Odoo-routing, financiële bemiddeling, OCR/AI-documentlezing of volledige gemeentelijke dekking.
- Geen native Safari/Firefox/toesteltest of volledige toegankelijkheidsaudit. In-memory Chromium is geen echte CSP/HTTPS/HTTP-browsertest.

## Bron- en claimsbeleid

Werkbanken zijn **voorbereidingscontroles**, geen toekennings- of fiscale beslissingen. Voortgang telt eigen taken, niet kans op subsidie. Bij onbekende gegevens, verouderde bronversie, ander jaar, andere aanvrager of bijzondere constructie wordt extra controle aangegeven. Deadlinefunctionaliteit is begrensd op ondersteunde 2026-warmtepomp/isolatiecontext, nooit algemene krediet- of fiscale termijnen.

Informatie is gebaseerd op RVO en Belastingdienst, gecontroleerd 14 november 2026. Interne reviewdatum 14 december 2026 is geen wettelijke vervaldatum. Een verschil in bronhash is een **review-signaal**, geen bewijs van nieuwe wetgeving. Er is geen automatisch herschrijven of publiceren van regels.

Primaire bronnen:
- https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen
- https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp
- https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21
- https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen
- https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://www.php.net/manual/en/function.sodium-crypto-secretbox.php

Dit ontwerp en de tests zijn geen juridisch oordeel of beveiligingscertificaat. De gebruikersacceptatie volgt eerst; daarna worden de nog open productievoorwaarden afzonderlijk behandeld.
