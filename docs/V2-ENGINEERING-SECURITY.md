# SubsidieReady 2.0 — Technisch ontwerp en security release-gates

> **Architectuurbesluit 14 november 2026:** uitsluitend eigen salesontvangers, geen generieke partner-router. Elke aparte B.V. is een afzonderlijk te beoordelen mogelijke verantwoordelijke/ontvanger. Zie [first-party salesplan](V2-FIRST-PARTY-SALES-IMPLEMENTATION.md); geen automatische join van dossiers naar CRM.


**Status:** ontwerpvoorstel, niet gedeployed. Lees eerst `V2-PRODUCT-ACCOUNTS-LEADS.md`. Bestaande site op `main` blijft live en guest-only totdat product, privacy en security volledig akkoord zijn.

## 0. Huidige productarchitectuur (review 14 november 2026)

- `assets/core.js`: onafhankelijk geversioneerde formulierstate `version:1` en `sanitizeState` allowlist. Bewerk deze logica niet onnodig.
- `assets/app.js`: 4-stappen-SPA, browserlokale conceptdraft onder `sk.concept.draft.v1`; project JSON kan worden geimporteerd, originele bestanden worden alleen in geheugen gehouden.
- `assets/export.js`: lokaal PDF en ZIP; byte-identieke originelen; geen serveranalyse.
- `api/event.php`, `assets/metrics.js`: uitsluitend optionele, consent-gated enumgebeurtenissen zonder dossierdata.
- `/admin/`, `server/bootstrap.php`: PHP beveiligde beheerroute met externe private configuratie; huidige stats zijn geaggregeerd. Hergebruik beveiligingsprimitieven waar geschikt, **niet** blind de beheerlogin als gebruikersaccount.
- Hostinger deploys van GitHub `main`; private operationele data mag nooit onder een wisselende code-release-directory staan.

## 1. Afhankelijkheden vóór implementatie (Gate INFRA)

**Niet veronderstellen dat er al SQL, persistente files of SMTP is.** Verifieer in het bestaande Hostinger-dashboard:
- huidige website- en deploytype (PHP/HTML, Node of hybride), daadwerkelijke PHP-uitvoering, PHP/ext-sodium/PDO ondersteuning, MySQL/MariaDB beschikbaarheid, max upload/post sizes, database quota, cron, back-ups;
- een permanent privaat pad dat **bij nieuwe GitHub-deploys behouden blijft** en buiten elke mogelijke webroot valt;
- Hostinger Mail SMTP of andere reeds beschikbare transactionele mailmogelijkheid met SPF, DKIM, DMARC en goede deliverability;
- relevante Hostinger verwerkersovereenkomst, opslaglocatie en logging-retentie;
- veilige staging zonder echte klantgegevens.

Kies bij aanwezige SQL-capaciteit PHP 8.2+ + PDO + MariaDB/MySQL (InnoDB) als eenvoudige, transactionele backend op bestaande hosting. SQLite alleen indien locking, backups en werkelijke deploypersistente opslag aantoonbaar voldoende zijn. Geen externe auth/analytics/CRM-SaaS verplicht. Elke onverwachte kost vooraf aan eigenaar voorleggen.

## 2. Datamodel met harde scheiding

| Entiteit | Minimale velden / doel |
| --- | --- |
| `accounts` | id(UUID), email_normalized, verified_at, created_at, last_used_at, deletion_requested_at, status |
| `auth_challenges` | account_id/email, **hash** van eenmalige code, expires_at (max 10 min), used_at, attempt_count, send_count |
| `sessions` | account_id, session_key_hash, expires_at, rotated_at, revoked_at, csrf_secret_hash, last_seen_at |
| `dossiers` | id(UUID), owner_id, title (door gebruiker), validated_state_json, schema_version, state_revision, last_step, updated_at, archived_at |
| `attachments` | id, dossier_id, owner_id, category, safe_display_name, random_object_key, mime_verified, bytes, sha256, encryption_key_version, uploaded_at, deleted_at |
| `service_preferences` | account_id, reminder_opt_in, reminder_schedule, updated_at |
| `consents` | person/contact ref, consent_purpose, value, exact_text_version, identity_of_recipient, purpose_scope, timestamp, revocation_timestamp |
| `leads` | id, account_id nullable, contact_verified, chosen_interest, requested_support, preferred_channel, region_coarse, timeline, consent_id, lead_state, assigned_partner_id nullable |
| `lead_audit` | lead_id, action, actor, timestamp, destination; geen dossier of documentinhoud |
| `outbox` | type, destination, rate/attempt metadata, idempotency key, queued_at, sent_at, error_category |

**Afscheiding:** accounts/dossiers/attachments mogen niet zonder doelbinding in leads of marketingexports worden gejoined. Geen factuur-/betaalbedragen, RVO-meldcodes, exacte woning-/bankgegevens of uploads in de leadtabellen.

## 3. Geauthenticeerde API (voorstel)

```text
POST /api/auth/start             (email invoeren; neutrale response)
POST /api/auth/verify            (eenmalige code POST; geen inlog via scanner-GET)
POST /api/auth/logout            (sessie ongeldig)
GET  /api/me                     (alleen eigen sessie)
GET  /api/dossiers               (alleen eigen)
POST /api/dossiers               (nieuw of expliciete lokale import)
GET  /api/dossiers/{id}          (eigen en geverifieerd)
PATCH /api/dossiers/{id}         (sanitized v1 state, revision/If-Match)
DELETE /api/dossiers/{id}        (bevestiging, verwijderopdracht)
POST /api/dossiers/{id}/files    (expliciet; uitsluitend bij geauthenticeerd account)
GET  /api/dossiers/{id}/files/{id}   (eigen bestand, attachment)
DELETE /api/dossiers/{id}/files/{id} (hard delete + check reset)
GET  /api/accounts/export        (eigen, zonder externe exportlinks)
POST /api/accounts/delete        (geauthenticeerde herbevestiging)
POST /api/leads/request          (zelfstandig, ook guest, met specifieke toestemming)
POST /api/leads/revoke           (auth of eenmalige veilige link)
```

**Niet automatisch letterlijk implementeren** voordat routing/.htaccess op de daadwerkelijke Hostingeromgeving bewezen werkt; file endpoint mapping kan queryparameters of PHP-front controller gebruiken, zolang autorisatie identiek is.

### Beveiligingsregels

- HTTPS verplicht, `__Host-` HttpOnly Secure SameSite cookie, sessierotatie, beperkte levensduur, logout overal, CSRF op alle mutaties en Origin/Referer controles.
- Geen account enumeration: identieke niet-onthullende response op `start`, dubbele accounts worden niet vrijgegeven. Hash van OTP, cryptografisch veilige random, 10-minuten TTL, limiet per email/IP/recipient, resend-cooldown, expire-on-use.
- Bij magic-link auto-click door mailsecurityscanner geen login accepteren via GET. Laat een expliciete POST-bevestiging vanuit browser gebruiken, of gebruik OTP-code.
- CORS standaard dicht; data noindex/no-store; geen tokens in querystrings, analytics of referer; adequate CSP; UI escapes alle data.
- Database-account alleen vereiste rechten, prepared statements, server-side ownership validation vóór elk lezen/schrijven en ook vóór iedere bestandsdownload.
- Revisions/collision handling: update alleen op actuele `state_revision`; bij conflict vraag gebruiker te kiezen / merge alleen niet-conflicterende velden. Toon autosave-failure, stop niet stilzwijgend.
- Server opnieuw `SKCore.sanitizeState` equivalenter whitelist (in PHP of gedeelde tests), nooit blind JSON aannemen. Stel maximale payload, nesting en lengte in.
- Private opslag versleutelen met libsodium of bewezen veilige library; sleutel buiten webroot en Git, gescheiden van DB-credentials; back-ups eveneens veilig en herstelbaar. Niet claimen dat er end-to-end encryptie is.
- Upload alleen expliciet toegestane signaturen (o.a. PDF/JPEG/PNG als toepasselijk); size-quota per file, dossier en account; random identifiers, nooit client-bestandspad; safe `Content-Disposition: attachment`, `nosniff`; geen publiek pad of rechtstreekse webrootdownload.
- Bestandscontent niet indexeren, OCR'en, profileren of doorsturen. Zorg voor passende scanning/misbruikbeperking voor onbeheerde uploads; met name PDF.
- Geen uploads / inlog in bestaande `api/event.php` of algemene metrics; geen persoonlijke gegevens in logs. Controleer foutmeldingen en serverheaders op lekken.
- Data-portabiliteit/export en accountverwijdering: server-side delete van dossiers, attachments, sessies en tokens en gecontroleerde backup-expiratie; duidelijke uitzonderingen voor wettelijk vereiste minimale consent- of bedrijfsadministratie.

## 4. Cross-browser hervatten en data-invariant

De online dossierstaat is een user-only schema met expliciet `schemaVersion` en `revision`. Behoud dezelfde checkvoorwaarden van `assets/core.js`.

Bij omschakeling guest -> account:
1. Leg uit welke persoonsgegevens en bijlagen online worden opgeslagen.
2. Toon selecteerbare lokale dossierdata.
3. Verifieer de account voordat er wordt geimporteerd.
4. Maak cloud dossier pas na expliciete bevestiging. Originele documenten optioneel per stuk uploaden.
5. Toon succes pas na commit naar server. Blijf gastdraft behouden tot gebruiker die expliciet verwijdert.
6. Bij verwijderen/vervangen van bewijs: markeer documentcheck en eerdere bevestiging opnieuw als te controleren.

Bij wisselen van browser: inloggen, dossier opnieuw openen, exact dezelfde sanitization/evaluatie toepassen, autorisatie voor elke file; bestandbytes intact. Problemen met offline verbinding duidelijk opvangen. Plaats geen klantdata in publieke routing of browsertelemetrie.

## 5. Opt-in lead-API

**Onafhankelijk** van account: gebruiker kan altijd een hulpverzoek indienen zonder account. Voor partnerdoorgifte is de expliciete keuze specifiek voor zichtbaar genoemde ontvanger en datacategorie. Algemene accounttoestemming of marketingvinkje is niet genoeg.

Verzend alleen: onderwerp, hulpvraag, contactmethode en passend contactgegeven, optionele globale regio/timing, tekstversie/identiteit van toestemming. Geen stilzwijgende import van adres, e-mail of bestandsinhoud uit dossier; préfill mag alleen met expliciete review/bevestiging van de gebruiker.

Admin ziet enkel aanvragen met status en herkomst: `requested`, `verified`, `qualified`, `assigned`, `contacted`, `closed`, `withdrawn`. Export naar partner beperkt en auditeerbaar. Commerciële contactverzoeken moeten worden gerouteerd naar genoemde partij(en) en kunnen worden ingetrokken/afgemeld.

Verifieer contactmethode en suppress dubieuze duplicaten zonder onnodige profilering. Bewaar toestemmingstekstversie + doel + recipient + tijdstippen, zodat later aantoonbaar is wat is gevraagd. Houd juridische grondslag per verwerking apart vast.

## 6. Bewaartermijnen en werking

**Voorgestelde defaults, niet wettelijk voorgeschreven:**
- Account: totdat gebruiker verwijdert of bijvoorbeeld 12 maanden inactief is na aangekondigde verwijdering, afhankelijk van definitieve privacyvoorwaarden.
- Dossiers/bijlagen: gedurende actieve account / expliciete gebruikerskeuze, met limiet; maximaal één maand extra in herstelbackups na verwijdering indien technisch haalbaar.
- Leads: voorstel 6-12 maanden na afhandeling, tenzij ingetrokken of langer nodig wegens wettelijke geschil-/bewijsverplichtingen; documenteer doel en rechtsgrond.
- Eventaggregaten: huidige 90 dagen; service-auth logs korter, minimale informatie.
- Consent-audit: zolang aantoonbaarheid van verzonden reclame/gegevensdoorgifte redelijkerwijs vereist is; afzonderlijke termijn juridisch toetsen.

Account-export, wissen, rectificatie, intrekken commerciële toestemming en inzage moeten via begrijpelijke selfservice bereikbaar zijn; geen supportticket als enige route.

## 7. Test- en launchcriteria

**Geen GO** zonder alle gates:
- Guest check, projectexport/import, PDF/ZIP en huidige bronregels blijven identiek functioneren.
- E-mailverificatie: expired/duplicate/cross-browser OTP, bruteforce/rate-limits, server errors, device theft, lost inbox.
- Twee echte accounts kunnen elkaars dossier, bestandsnamen, download of export niet lezen. Test IDOR met manipulatie van elk object-ID.
- Browser A/B autosave/conflict en re-login; onderbroken verbinding/upload; herstart van Hostinger/deploy zonder dataverlies; backup en restore drill.
- Uploadmanipulatie: verkeerde MIME/signatuur, oversized bestand, path traversal, XSS in namen, polyglot bestanden, zip bombs; quota en virusbeleid.
- AVG-productgedrag: geen auto opt-in marketing; geen lead na registreren; geen documenten in netwerkverkeer tenzij expliciet geupload; geen data in analytics.
- Contact toestemming: default OFF, juiste partner/tekst, revoke, geen doorgifte na revoke, auditeerbare sending.
- CSP/headers/CSRF/secure cookies/redirects; admin en private API noindex; zero data in publicly accessible static URLs.
- Performance op mobiel, Safari/Firefox/Chromium, toetsenbord en screenreader; echte PDF/ZIP op Hostinger.
- Verantwoordelijke rechtspersoon, privacystatement, verwerkersovereenkomst, hosting back-ups/retentie, incidentprocedure en eventueel DPIA afgetekend.

## 8. Implementatievolgorde (maak afzonderlijke issues)

1. Feasibility (Hostinger SQL/private persistent storage/SMTP, privacy owner).
2. Aanmeldflow en accountbeheer zonder documentuploads.
3. Stateful dossier sync, guest import, autosave en conflict safety.
4. Uploadvault, redownload, uitgestelde documenten, migratie, deletion and backup.
5. Separate opt-in adviesverzoek en interne lead backoffice.
6. Instrumentatie, security, performance & staging release acceptance.

## 9. Geen automatische productie-upgrade

De live-site gebruikt nu de visuele 1.0. Nieuwe account- en opslagAPI's moeten initieel achter een expliciete server-side feature flag staan en nooit vooraf live persoonsgegevens accepteren. Merge met `main` gebeurt pas na gerichte tests en eigenaarsbesluit. Een groen CI-resultaat is geen privacy- of securitycertificering.
