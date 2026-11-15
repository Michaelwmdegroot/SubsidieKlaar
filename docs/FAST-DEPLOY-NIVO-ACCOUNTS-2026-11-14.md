# SubsidieReady — snelle productiepublicatie onder NIVO Groep Holland B.V.

**14 november 2026 · Werkdocument / geen zelfstandig juridisch oordeel**

## Besluit

- Exploitant/verwerkingsverantwoordelijke: **NIVO Groep Holland B.V.**, KvK **95227768**.
- Adres: **Lireweg 52, 2153 PH Nieuw-Vennep**; telefoon **085 800 5240**.
- Privacy- en servicecontact: **info@nivogroepholland.nl** (bestaand openbaar contactadres).
- Ontwikkelrichting: **SubsidieReady → vrijwillig account + online plan → gerichte vrijwillige adviesvraag → in de toekomst NIVO Portal**.
- Geen publieke stagingwebsite, nieuwe betaalde dienst, externe CRM-koppeling of eigen backupcluster nodig voor het publiceren van de **code**.
- De bestaande privacy-/beveiligingsmaatregelen niet verwijderen: persoonlijke plannen vragen minimaal e-mailverificatie, betrouwbare opslag, scheiding tussen gebruikers, HTTPS, veilige sessies, export en verwijdering.

## Product en toestemmingsmodel

Een account geeft uitsluitend toegang tot de gekozen gratis accountdienst en bewaart niet automatisch het huidige lokale plan. De gebruiker vinkt accountvoorwaarden actief aan. Er is een **zelfstandig, vooraf leeg** vakje voor marketingmail van **NIVO Groep Holland B.V.** over zonnepanelen, thuisbatterijen en laadpalen. Dit is geen toestemming voor marketing per telefoon of voor contact door andere vennootschappen. De gegevensbewaring bevat de tekstversie en timestamp van een bevestigde e-mailopt-in en van intrekking. In de accountomgeving kan de gebruiker die toestemming opnieuw wijzigen, gegevens exporteren en het account verwijderen.

De accounts hebben **geen koppeling met de sales-inbox of NIVO Portal**. De huidige beta-leadroute, documentenkluis en personeelsrollen blijven **uit**. Er gaat niets naar Thuisbatterij Team B.V. of een andere rechtspersoon enkel omdat een consument de tool of een account gebruikt.

Gepubliceerde stukken:
- `/privacy/` — data, doelen, grondslag, rechten, ontvangers, sessiecookie, optionele marketing;
- `/voorwaarden/` — optionele accountdienst, gratis toegang, beperkingen, wijzigingen en aparte commerciële toestemming;
- `/over/` — NIVO als exploiterende onderneming.

## Hostinger shared hosting: geen Sodium-installatie nodig

De standaardversleuteling voor nieuwe opgeslagen accounts/plannen is **OpenSSL AES-256-GCM** met authenticatietag en willekeurige nonce. De bestaande 64-tekens hexsleutel blijft ongewijzigd. Eerdere `SRN1`-Sodiumdata kunnen nog worden gelezen wanneer Sodium aanwezig is; ontbreekt Sodium bij bestaande SRN1-data, dan weigert de applicatie die data te lezen in plaats van stilzwijgend te overschrijven.

Geen handmatige PHP-module-installatie of nieuwe hostingomgeving vereist **als** de gebruikte PHP-runtime `openssl` met `aes-256-gcm` aanbiedt. De reeds bekende terminal-PHP's missen Sodium; de productiecheck controleert OpenSSL automatisch.

Na GitHub-main-deploy: vanuit `public_html` uitsluitend `php scripts/next/mysql-check.php --db-only` draaien. Het resultaat geeft bij fout een **vaste fasecode** (private-config, crypto-and-key, mysql-driver, mysql-connect of mysql-schema) maar geen wachtwoorden, bestandspaden of SQL-uitzonderingen. Bij succes blijven de account- en marketingflags onveranderd. Dit is één korte operationele test in plaats van losse hostingconfiguratiestappen.

## Eén publicatietraject op de bestaande Hostinger-hosting

1. Merge de geteste PR op `main`. Hostinger publiceert de statische pagina's en de nieuwe PHP-code via de bestaande GitHub-koppeling. **Zonder private configuratie blijft de API gesloten met HTTP 503**; de bestaande gratis site blijft bereikbaar.
2. Controleer in hPanel dat deze webhosting PHP 8.2+ met `pdo_mysql`, `sodium`, `fileinfo` ondersteunt, en dat het bestaande databaseaccount toegang heeft tot de **bedoelde** database. Gebruik in hPanel/phpMyAdmin alleen deze eigen database, geen andere projecten.
3. Importeer `server/next/schema.sql` met phpMyAdmin. Dit maakt alleen `sr_next_state` met één versleutelde opslagrij. Er worden geen andere tabellen aangeraakt.
4. Maak een privémap **naast `public_html`**, bijvoorbeeld `subsidieready-private`, en plaats daarin `next-config.php`. Dit bestand is niet via de website opvraagbaar en wordt niet in GitHub opgeslagen. Gebruik de op de host gegenereerde 32-byte sleutel (64 hexkarakters); houd de sleutel buiten code, publieke configuraties en tickets.
5. Stel in die private configuratie uitsluitend de bestaande Hostinger-DB-verbindingsgegevens in, de NIVO-contactgegevens, de daadwerkelijk beoordeelde privacyvoorwaarden en de accountflags. Geen FTP/DB-wachtwoord in ChatGPT, GitHub-issues, scripts of screenshots. Het systeem leest bij voorkeur `SR_NEXT_CONFIG` of, zonder environmentvariabele, automatisch `../subsidieready-private/next-config.php` relatief aan de repositoryroot.
   **Databasecheck vóór activering:** voer in de Hostinger-terminal, vanuit `public_html`, `php scripts/next/mysql-check.php --db-only` uit. Deze read-only preflight gebruikt de bestaande private `.env`/`next-config.php`, controleert PDO-MySQL, InnoDB en encryptiesleutel, en werkt met `privacy_reviewed=false`, `legal_reviewed=false`, `mail_ready=false` en `accounts_enabled=false`. Een succes toont `status: database_ready` en `activation_checks: not_performed` — dit is **geen** goedkeuring om accounts of mail aan te zetten. De volledige `--check` blijft pas ná echte juridische- en mailacceptatie bruikbaar.
6. Configureer het **bestaande** account voor uitgaande transactionele e-mail en controleer dat een echte eenmalige code aankomt (vanaf een geautoriseerde afzender, met correcte SPF/DKIM/DMARC). De huidige mail-worker gebruikt PHP `mail()`, niet een bevestigde SMTP-adapter. Plan de mail-worker via de bestaande Hostinger Cron-voorziening zodra bezorging werkt. **Een queue zonder uitvoerende worker bezorgt geen OTP**.
7. Activeer pas dan de flags `privacy_reviewed=true`, `legal_reviewed=true`, `mail_ready=true`, `accounts_enabled=true`. Deze booleans registreren echte beslissingen; ze zijn niet zelf de beoordeling. `vault_enabled=false`, `leads_enabled=false`, `staff_enabled=false` blijven verplicht bij SQL.
8. Controleer één nieuwe fictieve accountregistratie op de echte site en één opgeslagen fictief plan: code ontvangen, inloggen, uitloggen, op een andere browser openen, marketingmail uit/aan/intrekken, exporteren en verwijderen. Gebruik daarna `php scripts/next/mysql-check.php --check` voor read-only DB/sleutel/schemavalidatie en de read-only liveacceptatie. Doe het zonder echte klantdossiers te exporteren.

De Hostinger-database van het screenshot is **nog niet rechtstreeks geverifieerd**; het delen van de databasenaam in een screenshot is geen verbindingstest. Er is geen toegang tot hPanel, SQL-gebruikerswachtwoorden of hostinginstellingen vanuit deze GitHub-connector. De productieaccountdienst blijft daarom gesloten tot bovenstaande private configuratiestappen zijn doorlopen.

### Private configuratie (voorbeeld; geen echte secrets)

```php
<?php
return [
  'mode' => 'production',
  'origin' => 'https://subsidieready.nl',
  'dir' => '/ABSOLUUT-PRIVATE-PAD/subsidieready-private',
  'key' => 'VERVANG_DOOR_PRIVATE_64_HEX_SLEUTEL',
  'controller' => 'NIVO Groep Holland B.V.',
  'contact' => 'info@nivogroepholland.nl',
  'privacy_reviewed' => false, // pas true na inhoudelijke controle
  'legal_reviewed' => false,   // pas true na inhoudelijke controle
  'transport' => 'mail',
  'mail_ready' => false,
  'mail_from' => 'info@nivogroepholland.nl',
  'accounts_enabled' => false,
  'vault_enabled' => false,
  'leads_enabled' => false,
  'staff_enabled' => false,
  'storage_driver' => 'mysql',
  'mysql' => [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'UIT_HOSTINGER_HPANEL',
    'user' => 'UIT_HOSTINGER_HPANEL',
    'password' => 'ALLEEN_HIER_PRIVÉ_INVOEREN',
  ],
];
```

Een verborgen configuratiebestand moet buiten elke webroot en deploydirectory liggen. Als deze privémap ontbreekt of niet klopt, blijft de API gesloten en gaan accountgegevens niet naar een onbedoelde plek.

## Portal-vervolg (los van deze release)

- NIVO Portal wordt het centrale dashboard voor **expliciet aangevraagde** adviescontacten, niet de beheerder van alle SubsidieReady-dossiers.
- De toekomstige API stuurt uitsluitend minimaal noodzakelijke aanvraaggegevens na een concrete, gelogde aanvraag en met de juiste rechtspersoon/ontvanger. Geen documentbytes, complete subsidiecheck, financiële kwetsbaarheid, fiscale gegevens of niet-vrijwillige accountregistraties.
- Vereist: verifieerbare ontvanger, rolgebaseerde toegang, ondertekende/webhook-auth, idempotentie, retry/backpressure, rechten, intrekking en audit. Tot dan: **geen NIVO Portal-credentials of webhook in deze release**.

## Open punten die geen extra stagingproject vereisen

- Een eenvoudige bestaande Hostinger-restoreoptie en het veilig bewaren van de encryptiesleutel moeten bekend zijn voordat klantplannen onherstelbaar verloren kunnen gaan. Er wordt geen aparte back-upinfrastructuur aangeschaft. De huidige SQL-opslag gebruikt nog een versleutelde single-row pilotstructuur. Bij sterke groei moet dit naar genormaliseerde account-/projecttabellen met schaal-/locktesten worden gebracht; de code mag niet als onbeperkt schaalbaar CRM worden gepresenteerd.
- Laat de juridische teksten en toepasselijke NIVO-relatie/contactteksten controleren voordat echte mensen een account registreren. Vooral e-mailmarketing, informatieplichten, opslagtermijnen en hostingverwerkersafspraken moeten feitelijk overeenkomen met de uiteindelijke configuratie.

**Rollback bij fouten:** accountactivering in de private config uitzetten en eerst de feitelijke fout oplossen; gratis werkbank blijft bruikbaar. Bij een fout in de publieke code kan de specifieke release normaal worden gerevert. Stop de online accountdienst niet door de versleutelingssleutel of database te vernietigen.
