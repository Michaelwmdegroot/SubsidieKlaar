# Afgeschermde staging — alleen na de lokale eigenaartest

**Niet** de bestaande Hostinger-koppeling van main naar deze branch veranderen. De live site blijft op main. Gebruik alleen een afzonderlijke testwebsite/subdomein en bestaande beschikbare hostingcapaciteit; niets aankopen zonder opdracht.

## Eerst aantonen

1. Bescherm de staging met server-/hostingauthenticatie en noindex. `noindex` is geen toegangsbeveiliging.
2. Bevestig PHP 8.2+, sodium, fileinfo, uploads, HTTPS en een permanent privaat pad dat bij redeploy/rollback behouden blijft. Geen realpath onder een webroot en geen symlink naar public_html.
3. Zet private maprechten op 0700 en bestanden op 0600. Genereer de 32-byte sleutel op de host zelf; zet hem nooit in een ticket, chat, browser of GitHub.
4. Stel exploitant, privacycontact, rolverdeling, testpersonen, retentie, logging, backup/restore en DPA vast. De configuratie eist expliciete privacyreview voor staging; dit boolean is registratie van een werkelijk besluit, niet de review zelf.
5. Sluit mailtransport correct aan en bewijs verificatieaflevering. De ingebouwde `mail()`-adapter kan onvoldoende zijn; implementeer een passend bestaand SMTP-transport als Hostinger dat nodig heeft. Geen marketingmail.
6. Laat de documentenkluis uit totdat clamscan/versie/updates en scanfunctionaliteit zijn bewezen. Dit vereist beschikbare infrastructuur; de release installeert niets.
7. Personeelstoegang met echte leads vereist extra sterke-authenticatie/MFA- en rechtenreview; huidige OTP is testfunctionaliteit.

Zie `config.example.php` voor het contract. De placeholderwaarden maken de configuratie bewust ongeldig. Maak het echte bestand buiten de repository en zet het **absolute bestandspad** in `SR_NEXT_CONFIG`. Het voorbeeld publiceert geen echte bedrijfsnaam of wachtwoord. De backend weigert het productiedomein in deze beta.

## Routes en statische assets

De normale build blijft `npm run build`, gevolgd door tests en package. Nieuwe assets staan lokaal in `/assets`; er is geen betaald runtimepakket of externe AI. Routes `/mijn-plan/`, `/advies/`, `/sales/`, `/bronbeheer/` en de nieuwe artikelen zijn testmateriaal en noindex. Gebruik de Apache/LiteSpeed `.htaccess` van deze branch; deze blokkeert bron/private directories. Verifieer dit zelf op staging. Node preview voert geen PHP uit.

## Jobs zijn code, niet geactiveerde taken

Onderhoud (opruimen, door gebruiker gekozen serviceherinneringen) en mailworker worden alleen door een operator/cron gestart. Er is niets gepland in Hostinger of ChatGPT. Stel jobs pas in na test en privacybesluit. Controleer mislukte runs zonder persoonsgegevens in logs.

- `scripts/next/maintenance.php` schrijft onderhoudsuitkomsten en maakt generieke reminder-events.
- `scripts/next/mail-worker.php --send` vereist expliciet bruikbare mailconfiguratie, schrijft alleen bericht-ID/resultaat, geen code in operationele output. Het lokale `--local-inbox` werkt niet op staging.
- `scripts/next/check-sources.cjs` gebruikt uitsluitend vaste officiële bron-URLs en bewaart output buiten webroot. Zie CLI-code voor parameters; geen internetcredentials nodig. Geen contentwijziging wordt automatisch gepubliceerd.
- `snapshot.php` en `restore.php` werken in private nieuwe mappen. Eerst herstel naar aparte omgeving bewijzen. Sleutel apart beveiligd beheren.

## Acceptatietest op de echte server

Voer de volledige handleiding TESTEN.md uit met synthetische gegevens op twee browserprofielen en een echte telefoon. Test mailverificatie, cookieflags, CSRF/Origin, uploadlimieten, malware-gate, twee accounts, twee juridische entiteiten, salesrollen, opt-out, accountverwijdering, filesystem-rechten en herstel na een nieuwe code-deploy. Native Safari/Firefox en netwerkonderbreking horen bij de test.

Er volgt pas een productievoorstel nadat deze resultaten en de productkeuzes zijn beoordeeld. Publiceer geen testcodes, staffadressen, geheime keys, state.bin of snapshotbestanden. De fictieve demo mag nooit voor echte salesstatistieken doorgaan.
