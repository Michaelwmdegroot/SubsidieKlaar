# SubsidieReady: productieacceptatie optionele accounts

**Start:** 15 november 2026 (Europe/Amsterdam)  
**Status:** OPEN — echte productieaccount-E2E nog niet bewezen  
**Basis:** main dc514c9b6ec609d9ba55f635be45a614a7279094, PR #28 afgerond.  
**Scope:** https://subsidieready.nl/mijn-plan/; testmailbox onder beheer eigenaar; uitsluitend fictieve planinhoud.

Dit document onderscheidt controle van broncode/CI van werkelijke browser-, cron-, mailbox- en databaseacceptatie. Een geslaagde SMTP-test of unit test is geen bewijs van volledige registratie.

## 1. Bevestigd op basis van code

- De accountknop **Inloggen & bewaren** verschijnt alleen als de bootstrap-API configured en accounts beide waar meldt.
- Accountvoorwaarden hebben een verplicht, versiegebonden akkoord. Marketing-e-mail is een afzonderlijk, standaard uitgevinkt keuzevak.
- Een OTP bestaat uit acht cijfers, verloopt na tien minuten, is sessiegebonden, eenmalig en beperkt in verzoeken/pogingen.
- Na verificatie wordt de sessie vernieuwd. Plannen gaan uitsluitend online na expliciete keuze; demo's en bijlagen niet automatisch.
- Online plannen hebben revisiecontrole; account-export en -delete zijn aanwezig. Definitief verwijderen vereist een recent geverifieerde sessie (maximaal tien minuten).
- Productiecode eist vault_enabled=false, leads_enabled=false, staff_enabled=false. Accounts betekenen geen salesverzoek.
- Quality/release/browser CI op basiscommit zijn groen, maar de echte productiemail via cron is nog niet getest.

**Codeverbetering in deze PR:** Wanneer een nieuwe OTP de vorige vervangt, krijgt een nog niet verzonden oud bericht de status superseded en wordt de oude code uit de wachtrij gewist. De mailworker verwerkt alleen queued. Een PHP API-regressietest verifieert dit gedrag en de nieuwe geldige code.

## 2. Live acceptatie — uitsluitend PASS invullen met waarnemingsbewijs

| Stap | Te bewijzen | Status |
| --- | --- | --- |
| Bootstrap en zichtbare knop | /mijn-plan/ geladen, registratieknop; /api/next/?action=bootstrap HTTP 200, mode production, accounts true, leads/vault false | OPEN — agent heeft geen werkende directe live-HTTP/browsertoegang |
| Aanmaken | Registratie met eigen testmailbox, voorwaarden aangevinkt, marketing uit | OPEN |
| OTP via cron | Achtcijferige mail daadwerkelijk binnen tien minuten ontvangen zonder handmatige workeractie | OPEN |
| Login/logout | Correcte code, login, uitloggen en opnieuw aanmelden | OPEN |
| Online opslaan | Zelfbewuste bevestiging op fictief niet-demo project, revisie teruggekoppeld | OPEN |
| Cross-browser | Nieuwe privé-/browsersessie na login toont exact hetzelfde serverplan | OPEN |
| Export en verwijderen | Eigen export-JSON, daarna serveraccount en plan definitief weg | OPEN |
| Gastregressie | Regelingencheck, lokale import/export, PDF-print en dossier-ZIP zonder account | OPEN — bestaande CI-dekking; productie handmatig nog te bewijzen |
| Privacy | Geen automatische verkoopdata, marketing of dossierdeling | Codegate gecontroleerd; live gedrag OPEN |

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
