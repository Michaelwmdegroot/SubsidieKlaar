# SubsidieReady — MySQL-accountopslag, veilige stagingpilot

**Opgesteld 14 november 2026. Status: ontwikkelbranch, niet in productie.**

## Wat de nieuwe database wél en niet bewijst

De eigenaar heeft in Hostinger een database met een aparte gebruiker aangemaakt. Het Hostinger-overzicht is bewijs van **aanmaak**, niet van PHP/PDO-bereikbaarheid, privileges, correcte schema-inrichting, persistente hosting na redeploy, back-ups, e-mailaflevering of AVG-goedkeuring. Leg nooit wachtwoorden, databaseconfiguratie, echte e-mails of testcodes vast in GitHub, issues of chat.

De bestaande `server/next/service.php` bevat al OTP-authenticatie, sessies, rate limits, eigenaarstoegang per project, optimistic revisions, export en accountverwijdering. We bouwen **geen tweede accountlaag**. Deze eerste adapter wisselt alleen de backend-state-opslag om van versleuteld bestand naar **één met libsodium versleuteld object in een InnoDB-rij**, atomair bijgewerkt met `SELECT ... FOR UPDATE`. Bestaande checks, de gratis gasttool en bestaande onboarding-UI blijven leidend.

**Dit is geen relationeel CRM of production-ready user database**. De bestaande capaciteit-/groottelimieten en privacybeperkingen blijven. Normalisatie, querybare account-/projecttabellen, retentie, indexering en eventuele marketing/CRM zijn latere afzonderlijke beslissingen. Een account is **geen lead**. De SQL-adapter accepteert in deze tranche géén kluis, salesleads of personeelsinbox.

## Veilige reikwijdte

- Alleen `mode=local` of `mode=staging`. Bestaande code weigert `subsidieready.nl` en `www.subsidieready.nl` als nieuwe backend-origin, **ook als er een geldige MySQL-database is**.
- Zonder `SR_NEXT_CONFIG` blijft de online API HTTP **503/configured:false** retourneren. De gratis regelingencheck, PDF/ZIP, lokale plannen en SEO-release blijven functioneren.
- Config buiten iedere webroot met directoryrechten 0700 en bestandsrechten 0600. De 32-byte encryptiesleutel moet onafhankelijk van Git/code-updates beschikbaar blijven. Database-back-ups zonder sleutel zijn niet herstelbaar.
- De DB is alleen vanaf dezelfde Hostinger-host/loopback `localhost` of `127.0.0.1` bereikbaar in deze pilot. **Geen externe MySQL-verbinding zonder apart getoetste TLS-configuratie**.
- Gebruik uitsluitend een aparte **lege testdatabase** en **fictieve accounts/plannen** totdat de P0-vragen uit issue #5 en daadwerkelijke stagingontvangst/restore zijn afgetekend.
- Niets aanzetten door alleen een `enabled`-vlag om te zetten: zonder gecontroleerde afleverbaarheid van verificatiemail kan inloggen niet betrouwbaar werken.

## Procedure voor Hostinger (test, niet productie)

1. Controleer in hPanel het precieze **databasehostadres**, de **databasenaam**, de **gebruikersnaam** en de rechten. Een screenshot met alleen database- en gebruikersnaam is onvoldoende. Controleer op de server PHP 8.2+, `pdo_mysql`, `sodium` en `fileinfo`. Als Hostinger een externe SQL-host vereist, **stop dan deze pilot**; de huidige adapter accepteert uitsluitend een DB op dezelfde server.
2. Reserveer een afgeschermde stagingwebsite/subdomein op bestaande hosting. Zet HTTP Basic Auth en `noindex` aan; test niet met echte bezoekers. Gebruik **niet** de bestaande productiebranch/automatische deployment om de branch direct te activeren. De bestaande `.htaccess` en PHP moeten aantoonbaar uitgevoerd worden.
3. Importeer `server/next/schema.sql` met phpMyAdmin **in de geselecteerde lege stagingdatabase**. Dit creëert uitsluitend `sr_next_state` met één leeg record. Importeer niets in een database met bestaande klantgegevens. Er wordt geen productietabel aangeraakt.
4. Maak op de hosting een permanente private map aan buiten `public_html` en iedere release-directory. Plaats daar een alleen-door-PHP-leesbaar `config.php` met onderstaand **voorbeeldcontract**. Vervang placeholders *rechtstreeks op Hostinger*, niet in een GitHub-commit/chat. Genereer de hex-32-bytesleutel lokaal op die host (`php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'`) en borg hem in een afzonderlijk beheerde geheime back-up. De voorbeeldconfiguratie hoort nooit in een publiek pad.
5. Laat de web-PHP-runtime het **absolute pad** naar de private configuratie lezen via de veilige omgevingsvariabele `SR_NEXT_CONFIG` (Hostingerinstelling; eerst aantonen dat `getenv()` hem beschikbaar maakt). Zet alle accounts-/lead-/vaultflags eerst uit. Vul `privacy_reviewed` pas als `true` in na echte privacyreview en bevestigde verantwoordelijkheidsrollen.
6. Draai vanaf de beschermde hostingterminal `SR_NEXT_CONFIG=/PRIVATE/PAD/config.php php scripts/next/mysql-check.php --check`. Dit is read-only: resultaat `ready_for_synthetic_staging_tests` bevestigt slechts de verbinding, schema en decryptbaarheid. Het log toont geen databasewachtwoord, staat of dossiers.
7. Pas na bewezen mailtransport en correcte juridische/service-copy: zet uitsluitend `accounts_enabled=true` en `mail_ready=true` **op staging**. Controleer OTP-aflevering, inloggen, browser- en eigenaarisolatie, planopslaan/conflict, export, verwijdering en herstel met uitsluitend fictieve gegevens.
8. Simuleer een nieuwe code-deploy, controleer dat database, key en sessies blijven werken, en maak een onafhankelijke read-only restore/rollback-oefening. Bekijk daarnaast betaalde/niet-betaalde backups, termijnen en DB-userrechten. Doe de tests uit `docs/next/TESTEN.md`, inclusief Safari en echte mobiele browser.

### Voorbeeld van private serverconfig (geen echte credentials)

Dit fragment staat uitsluitend in een lokaal/private Hostingerbestand. Placeholderwaarden maken staging bewust onbruikbaar.

```php
<?php
return [
  'mode' => 'staging',
  'origin' => 'https://STAGING-SUBDOMEIN.example.invalid',
  'dir' => '/PRIVAAT-PAD/subsidieready-next',
  'key' => getenv('SR_NEXT_KEY'),          // exact 64 hex-tekens, 32 random bytes
  'controller' => 'NA JURIDISCHE BEVESTIGING',
  'contact' => 'privacy@example.invalid',
  'privacy_reviewed' => false,             // alleen na werkelijk besluit wijzigen
  'transport' => 'mail',
  'mail_ready' => false,
  'mail_from' => 'no-reply@example.invalid',
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
    'password' => getenv('SR_MYSQL_PASSWORD'),
  ],
];
```

Het voorbeeld is geen deploy-instructie om SMTP zonder verificatie aan te zetten: `mail_ready=false` is de veilige start. Of Hostinger per-site environmentvariabelen voor PHP correct beschikbaar maakt, moet daadwerkelijk worden getest; plaats geen secrets in publiek bereikbare `.htaccess` of GitHub. Alleen een bestaand passend hostingplan gebruiken, geen kosten maken.

## Technische acceptatie en bewijs

- `server/next/mysql.php`: PDO MySQL, voorbereide update, `InnoDB SELECT FOR UPDATE`, versleutelde JSON-state en rollback bij fout. Geen automatisch schema aanmaken vanuit publieke requests.
- `server/next/service.php`: driver wordt alleen bij expliciet `storage_driver=mysql` gekozen. Oud bestandspad blijft onveranderd voor bestaande lokale tests.
- `server/next/schema.sql`: apart, idempotent staging-schema, één encrypted blob.
- `scripts/next/mysql-check.php --check`: CLI-only, geen wachtwoorden/planinformatie in resultaten.
- `tests/mysql-integration.cjs` en `.github/workflows/mysql-staging.yml`: eigen synthetische MySQL 8.4-database, echte PHP-HTTP-flow voor OTP, sessies, twee accounts, revisions, cross-user 404, encrypted SQL, process-restart, export/deletion en productieorigin-NO-GO.
- `scripts/next/snapshot.php` kan de versleutelde inhoud naar een nieuwe externe map exporteren. `restore.php` maakt bewust uitsluitend een **aparte lokale bestandopslag** en verwijdert SQL-config uit het herstelresultaat, zodat een restore nooit onbedoeld terugschakelt naar de actieve database. Herstel naar MySQL is **nog niet gebouwd** en vereist een aparte gecontroleerde procedure.

## Nog vóór echte klantaccounts

- Issue #5: verantwoordelijke rechtspersoon, KvK/contact, Hostinger-verwerking/DPA, DPIA-triage, rechtsgrond, privacy/cookies, rechten, retentie en backupbeleid.
- Echte SMTP-ontvangst, bounce-/rate-limitgedrag en SPF/DKIM/DMARC. Een geslaagde `mail()`-aanroep is geen bezorgbewijs.
- Permanente key/DB-back-up, restore in een nieuw geïsoleerd doel en cred/role-rotatie.
- Onafhankelijke code-/appsecurityreview, SQL-service-test plus echte Safari/mobile-acceptatie.
- Voor sales apart issue #9/#12: ontvanger, expliciete advieswens, geen automatisch delen van account-/planinformatie, geen account-als-lead en geen toegang tot financiële/documentdata.

**Publicatiebeslissing:** deze branch is gereed voor code-review en geïsoleerde synthetische MySQL-tests. Een merge naar `main` of activering van echte accounts is **niet** door databaseaanmaak alleen goedgekeurd. Pas na P0-evidence en expliciet eigenaars-GO.
