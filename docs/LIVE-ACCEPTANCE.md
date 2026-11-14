# SubsidieReady: releasecontrole en daadwerkelijke publicatie

Stand: 14 november 2026. Publieke release 1.0.0, build `f2b88f1ca008499e`. De bestaande release is op `main` vastgelegd als `ba8ee203611049c135704c6a1c15e691b39c0d76`.

## Vastgesteld bij hervatten

De samenvatting met 18 build-package-tests liep achter op de repository. `main` bevat al SubsidieReady-branding, de complete lokale werkbank, zeven informatiepagina's, SEO-bestanden, PHP-beheer en optionele meting. De publieke conceptbackoffice is verwijderd. Meting en beheer blijven zonder private configuratie uit/afgeschermd.

De relevante herstelde bronbestanden zijn op Git-blobhash vergeleken met `main`, inclusief app, core, export, metrics, CSS, headers en overdrachtsdocumentatie. De broncode is niet opnieuw ontworpen of vervangen.

## Nieuw geverifieerd

- `npm run build`, `npm test`, `npm run package`: **51 tests geslaagd, 0 mislukt, 0 overgeslagen** op Node 22 en PHP 8.4. Dit zijn de bestaande 41 tests plus 10 tests voor de nieuwe livecontrole.
- De standalone HTML is in Chromium in geheugen gerenderd. Demo, PDF/ZIP/projectdownloads, herstel van handmatige bevestiging na modelwijziging, zeven informatiepagina's en alle vier stappen bij 360/390/768 pixels zijn gecontroleerd. Geen horizontale documentoverflow, page errors, event-POSTs of externe verzoeken in deze testflow.
- Browsernavigatie naar HTTP is in de uitvoeromgeving geblokkeerd. De bovenstaande controle is daarom uitdrukkelijk **geen live HTTP/HTTPS-, CSP-, Safari- of echte-telefoontest**. Alleen de offline testcontext gebruikt een UUID-shim; de applicatiecode is niet aangepast.
- Het gedownloade PDF-overzicht heeft vier pagina's; alle pagina's zijn gerenderd en visueel gecontroleerd. SubsidieReady en fictief-markeringen zijn aanwezig. De ZIP-integriteitscontrole slaagt en bevat drie oorspronkelijke voorbeeldbijlagen.
- Het Hostinger-pakket bevat 36 webbestanden, geen klantdocumenten, wachtwoorden of statistieken. SHA-256 van deze build: `4ce01f0b0a6dfb360570f7996a47d41547b3764449a591c21affa175c0681b7f`.

## Nieuwe read-only livecontrole

```sh
node scripts/check-live.cjs
```

De probe leest uitsluitend publieke routes van `subsidieready.nl` en de HTTP/www-redirects. Geen login, cookies doorsturen, event-POSTs, documenten, DNS-aanpassingen of hostingmutaties. Redirects worden niet gevolgd; bij een onbereikbare of verkeerde homepage stopt de probe. Antwoorden zijn begrensd in omvang en tijd. Het JSON-verslag bevat alleen controle-uitkomsten, geen responsebody, wachtwoord of contactgegevens.

Controlepunten: homepage-identiteit, exacte build, canonicals, veiligheidsheaders, PHP-uitvoering, beperkte settings, informatiepagina's, assets, robots/sitemap, echte 404, afgeschermde interne bestanden, afgesloten beheer/export en HTTPS/www-redirects. Niet-geconfigureerd beheer en uitgeschakelde meting zijn toegestaan wanneer de backend veilig gesloten blijft.

GitHub Actions **SubsidieReady live acceptance** voert deze controle apart van de kwaliteitsworkflow uit en bewaart `qa/live-check.json` als artifact. De workflow draait bij wijzigingen aan deze probe/workflow op `main`, of handmatig via **Run workflow** na een Hostinger-deploy. Er is geen periodieke taak ingesteld. Een geslaagde build of unit-test is nooit een geslaagde domeincontrole.

## Wat nog buiten deze chat moet gebeuren

De beschikbare Hostinger-app biedt mailbeheer, geen geauthenticeerd hosting-/DNS-/SSH-beheer. Er is geen hostingwijziging uitgevoerd. Een mislukte fetch vanuit deze chat bewijst op zichzelf niet dat het domein niet bestaat of wereldwijd onbereikbaar is.

Gebruik de bestaande Hostinger-hosting, zonder upgrade/aankoop. Publiceer een **PHP/HTML-website**, repository `Michaelwmdegroot/SubsidieKlaar`, branch `main`, repository-root naar `public_html`. Geen npm-installatie of buildcommando op Hostinger nodig; de webbestanden zijn al gebouwd. Autoriseer alleen deze repository. Bewaar bestaande inhoud eerst, behoud `.htaccess` en raak andere sites/e-mail niet aan.

Officiële Hostinger-instructie, gecontroleerd 14 november 2026:
https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

Zie `HOSTINGER-LIVE.md` voor HTTPS, automatische deploy, rollback en afzonderlijke beheeractivatie. De verantwoordelijke beheerder/contactgegevens en hostingprivacy-instellingen moeten worden gecontroleerd vóór publieke promotie en eventuele activering van meting. Vraag nooit om een wachtwoord of toegangstoken in de chat. De werkbank zelf vereist geen beheerdersaccount.

**Eindstatus blijft: code-release gereed; live publicatie pas bevestigd na daadwerkelijke deployment en acceptatie.** Ook na groene HTTP-controles blijven browserdownloads, Safari/telefoon, hostingconfiguratie en herstel afzonderlijke acceptatiepunten.
