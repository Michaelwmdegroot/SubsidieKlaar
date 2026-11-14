# SubsidieReady next-level — testhandleiding

14 november 2026 · branch `feat/nextlevel-testrelease` · **niet op main publiceren vóór de eigenaartest**.

Deze release bouwt voort op main `9158e019cbd52340d0fbc0d2d4b834f94b2d3a7d`. De bestaande site blijft werken. De nieuwe server accepteert alleen localhost of expliciet geconfigureerde staging, niet het productiedomein.

## 1. Eerst de interface zonder installatie proberen

`npm run preview:next` maakt twee zelfstandige HTML-bestanden in `qa/`. De bij de chat geleverde bestanden bevatten dezelfde UI-code:

- `SubsidieReady-mijn-plan-test.html`: projecten, werkbanken, lokale bijlagen, planning, JSON/ZIP en afdrukken.
- `SubsidieReady-sales-test.html`: kies de **fictieve demonstratie** om de verkoopinbox te beoordelen. Het zijn geen werkelijke aanvragen of bezoekerscijfers.

Open beide bestanden in een browser. Accountlogin en echte adviesaanvragen zijn in deze standalone-bestanden bewust niet verbonden. Een niet-aangesloten dienst wordt niet als succesvolle registratie gepresenteerd. De normale links naar de bestaande publieke informatiepagina's gaan naar SubsidieReady.nl; nieuwe online functies zijn daar nog niet gepubliceerd.

### Praktijktest voor Mijn plan

1. Klik **Bekijk fictief voorbeeld**. Je ziet isolatie, zonnepanelen en thuisbatterij als afzonderlijke maatregelen.
2. Open **Werkbanken**, bekijk de controles en vink een eigen taak aan. Wijzig vervolgens een relevante waarde: oude bevestigingen horen te vervallen.
3. Maak een **nieuw eigen testplan** met minstens twee maatregelen. Voer per maatregel eigen opdracht-, installatie-, factuur- en betaaldata in.
4. Bewaar met **Planbestand** en open dat bestand opnieuw. Een oud warmtepomp-JSON wordt als maatregel geprojecteerd; bewaar het originele bestand voor de volledige oude warmtepompwerkbank.
5. Voeg onder **Documenten** een fictieve PDF/JPEG/PNG toe. Download hem opnieuw en vergelijk het bestand. Kies apart of je de bijlage ook in deze browser wilt bewaren.
6. Probeer **Dossier-ZIP** en **Afdrukken / PDF**. De ZIP bevat lokale originelen plus plan en overzicht; serverbijlagen moeten eerst afzonderlijk gedownload worden. Afdrukken/PDF gebruikt de browserdialoog, geen nieuw online PDF-systeem.
7. Vul een werkelijk uitgevoerde ondersteunde 2026-ISDE-maatregel in en controleer **Planning**. Download de kalender. Datums zijn te verifiëren herinneringen, geen automatische aanvraag. Voor latere/ongeverifieerde jaren wordt geen wettelijke termijn verzonnen.
8. Kies **Bewaar plannen op dit apparaat**, sluit en open dezelfde browser. Controleer of het plan herstelt. Test ook een tweede tabblad en een wijzigingsconflict.
9. Kies **Lokale opslag wissen**. Dit verwijdert de opgeslagen kopieën in deze browser; de geopende sessie en eigen downloads blijven bestaan. Om alles uit geheugen te wissen sluit je de pagina.

Browsers behandelen lokale HTML-opslag niet allemaal hetzelfde. Bij geblokkeerde opslag blijft export/import beschikbaar. Test native persistentie daarom ook via de lokale website in stap 2. Gebruik geen echte bankafschriften, persoonsgegevens of belastingdocumenten tijdens deze proef.

## 2. Het volledige systeem lokaal draaien

Vereist: Git, Node.js 22+ en PHP 8.2+ met sodium, fileinfo en JSON. Geen nieuwe betaalde API, Composer-package of npm-afhankelijkheid. Deze scripts installeren zelf niets. SQLite/MySQL zijn voor deze beperkte testbackend niet vereist: de beta gebruikt versleutelde, vergrendelde bestanden (zie SECURITY.md).

Gebruik een **nieuwe map**, niet de lokale checkout van een ander actief project:

```sh
git clone --branch feat/nextlevel-testrelease --single-branch \
  https://github.com/Michaelwmdegroot/SubsidieKlaar.git subsidieready-test
cd subsidieready-test
npm run build
npm test
php scripts/next/setup.php --local \
  --dir="$HOME/subsidieready-next-test-private" \
  --origin=http://127.0.0.1:8187
```

De setup weigert bestaande configuratie te overschrijven. Kopieer het door setup getoonde servercommando, bijvoorbeeld:

```sh
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" \
php -d upload_max_filesize=10M -d post_max_size=12M \
  -S 127.0.0.1:8187 -t . scripts/next/router.php
```

Open `http://127.0.0.1:8187/mijn-plan/`. Geen inkomende toegang vanaf het netwerk: uitsluitend loopback. De header geeft aan dat het een testrelease is.

### Lokale inlogcodes lezen

E-mail wordt **niet verstuurd**. De code staat in een versleutelde private testpostbus. Lees deze in een tweede terminal vanuit dezelfde bronmap:

```sh
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" \
php scripts/next/mail-worker.php --local-inbox
```

Dit toont maximaal twintig nog niet gelezen lokale serviceberichten en wist hun berichtinhoud uit de wachtrij na lezen. Gebruik uitsluitend fictieve adressen, bijvoorbeeld `consument@example.invalid`. De code verloopt na tien minuten en werkt alleen in de browser die hem heeft aangevraagd. Vijf foutieve pogingen blokkeren die code. Bij mailthrottling wordt geen nieuwe code verstuurd; wacht op de getoonde beperkingen of gebruik een schone testomgeving.

De bijgeleverde Mac-startfile kan dit lokale serverproces en de testpostbus gelijktijdig openen; ook dat blijft uitsluitend op je eigen computer. Stop met Ctrl+C. Er wordt niets op Hostinger aangepast.

## 3. Accounts en online dossiers op de lokale testserver

Maak twee verschillende testaccounts in twee browserprofielen/private vensters. **Inloggen alleen mag niets uploaden.** Maak een nieuw plan (geen fictieve voorbeeldkopie) en kies expliciet **Bewaar online**. Pas daarna wordt automatisch gesynchroniseerd.

Open **Online plannen** op het tweede apparaat of browserprofiel met hetzelfde geverifieerde account. Controleer naam, maatregelen, revisie en wijzigingen. Voor testen op twee verschillende fysieke apparaten is een beveiligde staging nodig; de lokale server is bewust niet bereikbaar vanaf een andere computer.

Controleer ook:
- twee verschillende accounts zien elkaars plannen en bijlagen niet;
- gelijktijdig wijzigen geeft een conflictmelding en behoudt de lokale versie;
- de aparte bijlageknop vraagt opnieuw toestemming vóór serverupload;
- wijziging van bewijsstukken maakt eerdere vinkjes ongeldig en verhoogt de projectrevisie;
- account-/projectexport, afzonderlijke filedownload en verwijderen werken;
- account verwijderen vraagt een recente verificatie. Serverbestanden verdwijnen; browserkopieën en downloads worden niet heimelijk gewist.

De lokale uploadtest accepteert alleen PDF/PNG/JPEG met typecontrole, maar heeft **geen malwarecertificering**. Staginguploads worden geweigerd als een geconfigureerde scanner ontbreekt.

## 4. Een eigen verkoopaanvraag van begin tot eind

Open `/advies/`. Op de lokale fixture zie je uitsluitend **Fictief testbedrijf**. Deze test maakt geen aanvraag bij Thuisbatterij Team, NIVO, Odoo of een andere echte ontvanger.

1. Vul onderwerp, testnaam en testmail in; kies het contactkanaal en vink de specifieke contactwens aan. Geen nieuwsbriefinschrijving.
2. Verstuur en lees de lokale code. Zolang de contactmail niet is geverifieerd, verschijnt de aanvraag niet in sales.
3. Open `/sales/` in een ander browserprofiel en verifieer `manager@example.invalid`. De private lokale configuratie geeft dit adres een managerrol. Er is geen standaardwachtwoord.
4. Bekijk/toewijs aan `verkoper@example.invalid`; diens rol ziet alleen toegewezen aanvragen. Er is geen toegang tot consumentendossiers.
5. Verplaats de aanvraag naar afspraak/offerte/gewonnen. Dit zijn zelf ingevoerde statussen, geen gemeten omzet.
6. Trek de aanvraag in via `/advies/` → Mijn aanvragen. Sales mag hem daarna niet heropenen.

Rollen en ontvangende entiteiten komen alleen uit private serverconfiguratie, nooit uit een browserformulier. De productie-ontvanger en juridische exploitant moeten nog worden vastgelegd.

## 5. Herinneringen, back-up en bronbeheer

Een kalenderbestand werkt zonder account. Een generieke serviceherinnering vereist een online opgeslagen project én een expliciete datumkeuze. Geen marketinginhoud. Lokaal maakt onderhoud de herinnering aan; de testpostbus laat hem zien:

```sh
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" php scripts/next/maintenance.php
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" php scripts/next/mail-worker.php --local-inbox
```

Er is geen cronjob of ChatGPT-automation geactiveerd. Voor snapshots/herstel:

```sh
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" \
php scripts/next/snapshot.php --to="$HOME/subsidieready-test-backup-1"
SR_NEXT_CONFIG="$HOME/subsidieready-next-test-private/config.php" \
php scripts/next/restore.php --from="$HOME/subsidieready-test-backup-1" \
  --to="$HOME/subsidieready-test-restored-1"
```

Doelmappen moeten nieuw zijn. Het herstel wijzigt geen draaiende server. De originele sleutel moet apart veilig worden bewaard; een snapshot bevat de sleutel niet. Nooit private mappen of configuratie uploaden naar GitHub of in deze chat plakken.

`/bronbeheer/` laat bronregistratie en dekkingsgrenzen zien. De CLI `check-sources.cjs` vergelijkt officiële broninhoud en markeert verschillen; hij verandert nooit zelfstandig regelcode. Zie de release-/securitynotities voor grenzen.

## 6. Wat daarna naar main mag

Pas na jouw functionele beoordeling volgt een afzonderlijk besluit over publicatie. Een groene testset is geen akkoord voor productieaccounts. Private hostingopslag, juridische identiteit, bewaartermijnen, bewezen mailaflevering, scanner, personeelsauthenticatie en back-upherstel moeten eerst zijn afgetekend. Verander nu niet de Hostinger-mainkoppeling naar deze testbranch.
