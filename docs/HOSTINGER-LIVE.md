# SubsidieReady naar Hostinger

Doel: `https://subsidieready.nl/`, GitHub `Michaelwmdegroot/SubsidieKlaar`, branch `main`. Geen extra abonnement, VPS, database of betaalde API nodig voor deze code. Gebruik een bestaand passend Hostinger-webhostingplan; een domeinregistratie op zichzelf is geen hosting.

## Publieke documentenwerkbank publiceren

1. Open Hostinger → Websites. Voeg een **PHP/HTML-website** toe voor **subsidieready.nl** op je bestaande plan, of open die website als hij al bestaat. Gebruik geen WordPress, Website Builder of Node-app voor dit project.
2. Kies **Import site → Deploy from GitHub** (of bij een bestaande PHP/HTML-site: Advanced → Git). Autoriseer uitsluitend de benodigde repository.
3. Repository: `https://github.com/Michaelwmdegroot/SubsidieKlaar`; branch: **main**. Publiceer de repository-root in de lege documentroot **public_html**. Install path leeg. Er is geen buildcommando nodig: `index.html` en alle benodigde webbestanden staan al in Git. Kies PHP 8.2 of nieuwer, bij voorkeur een ondersteunde recente versie.
4. Verwijder alleen de standaardplaceholder van deze nieuwe site als die de lege documentroot blokkeert. Overschrijf geen bestaande inhoud of andere website zonder backup. Laat `.htaccess` meegaan.
5. Activeer HTTPS voor dit domein. Verifieer domeinkoppeling en de `www`-redirect. Raak e-mail/DNS van andere domeinen niet aan. Koop of upgrade niets zonder aparte toestemming.
6. Controleer onderstaande tests. Schakel daarna automatische deploys vanaf `main` in. Bewaar de vorige release voor terugzetten.

Officiële Hostinger-handleiding, gecontroleerd 14 november 2026:
https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

Hostinger biedt ook een eigen deploy-agent. Gebruik daarvan alleen de bestaande hosting en de juiste repository/branch. Een prompt of ingestelde koppeling is nog geen bewijs dat de deployment is voltooid.

## Eenmalig beheer activeren (niet nodig voor de gratis tool)

Open de beveiligde SSH/hostingterminal in de documentroot:

```sh
php scripts/setup-admin.php
```

Voer zelf de verantwoordelijke persoon/organisatie, een bereikbaar e-mailadres en een uniek wachtwoord van 16–128 tekens in. Het wachtwoord wordt niet weergegeven of in Git gezet. De verantwoordelijke en contactmail worden gepubliceerd in de privacyuitleg zodra configuratie geladen kan worden. Activeer optionele gebruikstellingen alleen wanneer het contactadres en de hostingprivacy-instellingen correct zijn.

De standaardopslag is `../subsidieready-private` (dus naast, niet in `public_html`). De CLI maakt deze met beperkte rechten. Een afwijkende `SUBSIDIEREADY_PRIVATE_DIR` moet eveneens buiten de documentroot liggen. Het beheer bevat geen standaardwachtwoord en geen publieke setup-URL.

Open daarna `/admin/` via HTTPS. De eerste echte tellingen ontstaan pas na bezoekers die expliciet toestemming geven. Het beheer is geen bewijs van uniek bereik.

Dagelijkse onderhoudstaak via Hostinger Cron Jobs:

```sh
php /volledig/pad/naar/public_html/scripts/maintenance.php
```

Gebruik het echte pad van deze website, niet letterlijk het voorbeeld. Dagtotalen ouder dan 90 kalenderdagen en verlopen abuse-limieten worden ook bij normale meet-/beheeractiviteit opgeruimd. Stel hostinglogretentie en back-ups afzonderlijk in. Maak een hersteltest; publiceer de private backup nooit in de webroot.

## Live acceptatie

- HTTPS-root toont **SubsidieReady**; `version.json` meldt versie 1.0.0 en de verwachte build-ID.
- Zonder JavaScript zijn homepage en informatiepagina’s leesbaar. De werkbank vraagt terecht om JavaScript.
- `/hulp/`, de drie artikelen, `/privacy/`, `/bronnen/`, `/over/` en sitemap werken; onbekende pagina geeft HTTP 404.
- `/.git/config`, `/server/bootstrap.php`, `/scripts/setup-admin.php` en `/tests/` zijn via web geweigerd. PHP wordt uitgevoerd, niet gedownload.
- API health werkt. API settings bevat geen geheimen. Zonder private configuratie: analytics false en admin 503.
- Na configuratie: admin vraagt een wachtwoord, unauthenticated export toont geen cijfers, cookie is Secure + HttpOnly + SameSite, logout werkt.
- Zonder toestemming worden geen event-POSTs verstuurd. Daarna bevat een event uitsluitend `event`. Weigeren/intrekken stopt nieuwe event-POSTs.
- Test uitsluitend een fictief dossier: PDF/ZIP, terugstappen, nieuwe gegevens en projectimport. Geen echte persoonlijke documenten in testbewijs.
- HTTP en www verwijzen naar HTTPS op het apex-domein. Controleer CSP, X-Content-Type-Options en noindex voor beheer.
- Test op een echte telefoon en Safari/Firefox. Lokale Chromium-tests vervangen deze live controle niet.

## Rollback

Zet de vorige geverifieerde code-release terug; laat de externe private configuratie staan. De huidige versie heeft geen databasemigratie. Schakel optionele meting zo nodig uit door `analytics_enabled` in de private configuratie op `false` te zetten. Verander nooit authenticatie of privacy om een deployfout te omzeilen.
