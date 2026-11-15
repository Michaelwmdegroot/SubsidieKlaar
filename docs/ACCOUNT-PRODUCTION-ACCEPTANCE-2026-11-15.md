# SubsidieReady: productieacceptatie optionele accounts

**Start:** 15 november 2026 (Europe/Amsterdam)  
**Status:** OPEN — echte productieaccount-E2E nog niet bewezen  
**Basis:** startcommit `dc514c9` (PR #28); actuele account-/browsercontrole op `main` na PRs #29–#34, laatst `f64e932`.  
**Scope:** https://subsidieready.nl/mijn-plan/; testmailbox onder beheer eigenaar; uitsluitend fictieve planinhoud.

Dit document onderscheidt controle van broncode/CI, de **uitgevoerde echte productie-Chromiumtest** en nog niet uitgevoerde mailbox-, cron- en geregistreerde-accountacceptatie. Een geslaagde SMTP-test of browserknop is geen bewijs van werkelijke registratie.

## 1. Bevestigd op basis van code

- De accountknop **Inloggen & bewaren** verschijnt alleen als de bootstrap-API configured en accounts beide waar meldt.
- Accountvoorwaarden hebben een verplicht, versiegebonden akkoord. Marketing-e-mail is een afzonderlijk, standaard uitgevinkt keuzevak.
- Een OTP bestaat uit acht cijfers, verloopt na tien minuten, is sessiegebonden, eenmalig en beperkt in verzoeken/pogingen.
- Na verificatie wordt de sessie vernieuwd. Plannen gaan uitsluitend online na expliciete keuze; demo's en bijlagen niet automatisch.
- Online plannen hebben revisiecontrole; account-export en -delete zijn aanwezig. Definitief verwijderen vereist een recent geverifieerde sessie (maximaal tien minuten).
- Productiecode eist vault_enabled=false, leads_enabled=false, staff_enabled=false. Accounts betekenen geen salesverzoek.
- Quality/release/browser CI op basiscommit zijn groen, maar de echte productiemail via cron is nog niet getest.

**Codeverbetering in PR #29:** Wanneer een nieuwe OTP de vorige vervangt, krijgt een nog niet verzonden oud bericht de status superseded en wordt de oude code uit de wachtrij gewist. De mailworker verwerkt alleen queued. Een PHP API-regressietest verifieert dit gedrag en de nieuwe geldige code.

### Productiebewijs 16 november 2026

- **PR #32**, commit `1faebff`: slechts de te strenge case-sensitive Secure-cookiecontrole in de audit gecorrigeerd; echte Secure-vlag blijft verplicht. [Live acceptance](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43773670176) was groen: bootstrap HTTP 200, geldig JSON, 0 afgekeurde contractvoorwaarden.
- **PR #34**, commit `f64e932`: echte productie-Chromiumtest met acht geslaagde controles in [PR-run 43774473213](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774473213), uitsluitend fictieve browser-lokale gegevens: accountknop en toestemmingvelden zichtbaar, JSON- en ZIP-download van plan, PDF/ZIP van warmtepompwerkbank; **0 POST-verzoeken, 0 externe domeinen**. Een geplande worker of mailbox is niet gebruikt. Screenshots en geanonimiseerd QA-rapport zijn als GitHub Actions-artifact vastgelegd.
- **Technische SEO afzonderlijk:** [wekelijkse siteaudit](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774333587) controleerde 15 sitemap-URL's en 21 routes zonder fouten/waarschuwingen; geen bewijs van Google-indexering.
- **Nog geen PASS voor productieaccount-E2E:** echte 8-cijferige OTP-bezorging via cron, login/logout, expliciete plancloudopslag, tweede sessie, accountexport en accountverwijdering. De eigenaar beheert de testmailbox en voert de code zelf in.

## 2. Live acceptatie — uitsluitend PASS invullen met waarnemingsbewijs

| Stap | Te bewijzen | Status |
| --- | --- | --- |
| Bootstrap en zichtbare knop | /mijn-plan/ geladen, registratieknop; /api/next/?action=bootstrap HTTP 200, mode production, accounts true, leads/vault false | **PASS** — live HTTP [run 43773670176](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43773670176), cookiecontract 0 fouten; echte Chromium [run 43774473213](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774473213) bevestigt zichtbaar formulier en aparte uitgevinkte marketingkeuze |
| Aanmaken | Registratie met eigen testmailbox, voorwaarden aangevinkt, marketing uit | OPEN |
| OTP via cron | Achtcijferige mail daadwerkelijk binnen tien minuten ontvangen zonder handmatige workeractie | OPEN |
| Login/logout | Correcte code, login, uitloggen en opnieuw aanmelden | OPEN |
| Online opslaan | Zelfbewuste bevestiging op fictief niet-demo project, revisie teruggekoppeld | OPEN |
| Cross-browser | Nieuwe privé-/browsersessie na login toont exact hetzelfde serverplan | OPEN |
| Export en verwijderen | Eigen export-JSON, daarna serveraccount en plan definitief weg | OPEN |
| Gastregressie | Regelingencheck, lokale import/export, PDF-print en dossier-ZIP zonder account | **DEELS PASS:** echte Chromium op productie bevestigt fictief gastproject, JSON-plan en dossier-ZIP, en originele gratis warmtepomp-PDF en ZIP. Lokale herimport en cross-browser persistente gastdata nog niet op echte productie met eigenaar geaccepteerd |
| Privacy | Geen automatische verkoopdata, marketing of dossierdeling | **PASS voor beperkte read-only/gastscope:** Chromium zag 0 niet-GET en 0 off-site verzoeken; vault/leads/staff bleven uit in servergate. Marketinginstelling na echte accountverificatie blijft OPEN |

## 3. Eenvoudig stappenprotocol voor eigenaar

1. Open https://subsidieready.nl/mijn-plan/ en controleer de knop rechtsboven; controleer eerst dat de gratis gastplanner werkt.
2. Vraag met een door jou beheerde testmailbox een accountcode aan. Accepteer alleen de verplichte voorwaarden; laat marketing uit. Deel nooit e-mailadres, code, token, cookies, account-export of mailboxinhoud in chat/GitHub.
3. Wacht op mail van de gewone Hostinger-cron; voer de ontvangen code zelf op de site in. Noteer alleen of de code binnenkwam en of de login slaagde. Herhaal aanvraag niet zonder reden wegens rate limits.
4. Maak handmatig een project 'QA fictieve woning' aan, kies isolatie en zonnepanelen, gebruik verzonnen gegevens. **Niet** de knop 'Fictief voorbeeld' gebruiken: demo-projecten mogen niet cloudgesynchroniseerd worden. Klik Bewaar online en bevestig.
5. Log uit, log met een nieuwe OTP weer in. Controleer Online plannen. Herhaal met een privévenster of andere browser en open dezelfde projectinhoud.
6. Download Mijn gegevens exporteren. Log kort vóór de verwijderactie zo nodig nogmaals in om de veiligheidsperiode van tien minuten te respecteren. Verwijder het account en controleer dat de servergegevens niet meer beschikbaar zijn.
7. Controleer zonder account opnieuw JSON-planexport, PDF via Afdrukken / PDF, Dossier-ZIP en de regelingencheck. Ruim lokale QA-bestanden afzonderlijk op.

**Gevraagd bewijs:** alleen per stap PASS/FAIL, browsernaam, indicatieve e-mailvertraging, en een eventuele geanonimiseerde foutboodschap. Géén OTP, accountadres, cookies of documenten.

### Als de mail uitblijft

Controleer eerst inbox/spam, wacht minimaal een croncyclus en controleer via Hostinger de cron-taakstatus. Verander geen .env, encryptiesleutel of database. Alleen als de cron zelf faalt, kan een eigenaar handmatig de worker diagnosticeren met: cd public_html && php scripts/next/mail-worker.php --send. Een op deze manier ontvangen code bewijst **niet** dat de cron zelfstandig draait. Deel geen ruwe jobuitvoer met identificerende waarden.

## 4. GO/NO-GO

Accounts zijn pas E2E PASS wanneer alle relevante live stappen doorlopen zijn. Tot die tijd blijven Issue #6 en de accountsectie van Issue #21 OPEN. Ook na accountacceptatie blijven native leads, documentkluis, staff en NIVO Portal-integratie uit totdat hun afzonderlijke gates bewezen zijn.
