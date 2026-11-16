# SubsidieReady: productieacceptatie optionele accounts

**Start:** 15 november 2026 (Europe/Amsterdam)  
**Status:** DEELS PASS — eigenaar heeft nieuwe OTP ontvangen, ingelogd en accountdata geëxporteerd; cloud-planwissel en verwijdering nog OPEN  
**Basis:** oorspronkelijke PR #28, accountbewijs 16 november 2026, verbeterde premium account-UX PR #38 en branded mail PR #39.  
**Scope:** https://subsidieready.nl/mijn-plan/; testmailbox onder beheer eigenaar; uitsluitend fictieve planinhoud.

Dit document onderscheidt broncode/CI, echte productie-Chromiumtest en de **door eigenaar getoonde nieuwe accountregistratie met ontvangen OTP, geslaagde login en uitgevoerde accountexport**. Er is nog geen onafhankelijk bewijs van een in een andere browser teruggehaald online plan of definitieve accountverwijdering.

## 1. Bevestigd op basis van code

- De accountknop **Inloggen & bewaren** verschijnt alleen als de bootstrap-API configured en accounts beide waar meldt.
- Accountvoorwaarden hebben een verplicht, versiegebonden akkoord. Sinds PR #38 bestaat één verplicht juridisch vinkje en een afzonderlijke e-mailvoorkeurskeuze die standaard op 'geen aanbiedingen' staat. Telefoonmarketing is hiermee niet toegestaan.
- Een OTP bestaat uit acht cijfers, verloopt na tien minuten, is sessiegebonden, eenmalig en beperkt in verzoeken/pogingen.
- Na verificatie wordt de sessie vernieuwd. Plannen gaan uitsluitend online na expliciete keuze; demo's en bijlagen niet automatisch.
- Online plannen hebben revisiecontrole; account-export en -delete zijn aanwezig. Definitief verwijderen vereist een recent geverifieerde sessie (maximaal tien minuten).
- Productiecode eist vault_enabled=false, leads_enabled=false, staff_enabled=false. Accounts betekenen geen salesverzoek.
- De eigenaar heeft een echte OTP per e-mail ontvangen en daarna ingelogd; de exacte Hostinger-cronuitvoeringslog is niet onafhankelijk ingezien.

**Codeverbetering in PR #29:** Wanneer een nieuwe OTP de vorige vervangt, krijgt een nog niet verzonden oud bericht de status superseded en wordt de oude code uit de wachtrij gewist. De mailworker verwerkt alleen queued. Een PHP API-regressietest verifieert dit gedrag en de nieuwe geldige code.

### Productiebewijs 16 november 2026

- **PR #32**, commit `1faebff`: slechts de te strenge case-sensitive Secure-cookiecontrole in de audit gecorrigeerd; echte Secure-vlag blijft verplicht. [Live acceptance](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43773670176) was groen: bootstrap HTTP 200, geldig JSON, 0 afgekeurde contractvoorwaarden.
- **PR #34**, commit `f64e932`: echte productie-Chromiumtest met acht geslaagde controles in [PR-run 43774473213](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774473213), uitsluitend fictieve browser-lokale gegevens: accountknop en toestemmingvelden zichtbaar, JSON- en ZIP-download van plan, PDF/ZIP van warmtepompwerkbank; **0 POST-verzoeken, 0 externe domeinen**. Een geplande worker of mailbox is niet gebruikt. Screenshots en geanonimiseerd QA-rapport zijn als GitHub Actions-artifact vastgelegd.
- **Technische SEO afzonderlijk:** [wekelijkse siteaudit](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774333587) controleerde 15 sitemap-URL's en 21 routes zonder fouten/waarschuwingen; geen bewijs van Google-indexering.
- **Eigenaarbewijs, 16 november:** screenshot van vrijwillige registratie, daadwerkelijk ontvangen eenmalige code en daaropvolgend ingelogde weergave; eigen account-JSON geëxporteerd. Die export registreert een actieve, door gebruiker aangevinkte marketing-e-mailvoorkeur en bevat **nul online projecten**. Persoonlijke gegevens en de achtcijferige code zijn niet in dit dossier overgenomen.
- **Nog OPEN voor volledige E2E:** expliciete online opslag van een niet-demo-plan, terughalen vanuit tweede browsersessie, eventuele accountherregistratie, verwijdering; cronjob-uitvoer niet apart gezien. Nieuwe HTML-mail uit PR #39 moet in echte inbox visueel worden beoordeeld. Geen account automatisch naar sales.

## 2. Live acceptatie — uitsluitend PASS invullen met waarnemingsbewijs

| Stap | Te bewijzen | Status |
| --- | --- | --- |
| Bootstrap en zichtbare knop | /mijn-plan/ geladen, registratieknop; /api/next/?action=bootstrap HTTP 200, mode production, accounts true, leads/vault false | **PASS** — live HTTP [run 43773670176](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43773670176), cookiecontract 0 fouten; echte Chromium [run 43774473213](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43774473213) bevestigt zichtbaar formulier en aparte uitgevinkte marketingkeuze |
| Aanmaken | Registratie met eigen testmailbox, voorwaarden en eigen marketingkeuze | **PASS (eigenaarbewijs)** — registratie is getoond; in de test werd vrijwillig voor marketing-e-mails gekozen, dus geen bewijs van de default-NEE-keuze uit de oude UI |
| OTP via cron | Achtcijferige mail daadwerkelijk ontvangen; afzonderlijk bewijs dat cron vanzelf mailde | **DEELS PASS:** echte code ontvangen, maar geen afzonderlijk cronlog overgelegd. De code en het adres zijn niet bewaard in documentatie |
| Login/logout | Correcte code, login, uitloggen en opnieuw aanmelden | **DEELS PASS:** screenshot ingelogde en uitgelogde toestand; aparte herlogin met nieuwe OTP niet onafhankelijk gezien |
| Online opslaan | Zelfbewuste bevestiging op fictief niet-demo project, revisie teruggekoppeld | OPEN |
| Cross-browser | Nieuwe privé-/browsersessie na login toont exact hetzelfde serverplan | OPEN |
| Export en verwijderen | Eigen export-JSON, daarna serveraccount en plan definitief weg | **DEELS PASS:** export-JSON is geleverd, geen projecten aanwezig; volledige serververwijdering nog niet met onafhankelijke handeling aangetoond |
| Gastregressie | Regelingencheck, lokale import/export, PDF-print en dossier-ZIP zonder account | **DEELS PASS:** echte Chromium op productie bevestigt fictief gastproject, JSON-plan en dossier-ZIP, en originele gratis warmtepomp-PDF en ZIP. Lokale herimport en cross-browser persistente gastdata nog niet op echte productie met eigenaar geaccepteerd |
| Privacy | Geen automatische verkoopdata, marketing of dossierdeling | **PASS voor beperkte gastscope en consent-opslag:** Chromium zag 0 niet-GET en 0 off-site verzoeken; account-export bevestigde eigen e-mailvoorkeur. Geen toestemming voor telefonie of cross-B.V.-sales. Leadvault/staff blijven uit |

### Volgende UX- en mailrelease

- **PR #38:** premium formulier met optionele naam/telefoon/straat/huisnummer/postcode/plaats, één verplicht akkoord met accountvoorwaarden en aparte (standaard NEE) keuze voor NIVO-aanbiedingen per e-mail. Profiel na OTP versleuteld in bestaande account-state; eigenaar kan wijzigen, exporteren en verwijderen.
- **PR #39:** verificatiemail in professioneel SubsidieReady-design met HTML- en platte-tekstversie via bestaande TLS-SMTP-worker. Nog geen daadwerkelijke mobiele mailappacceptatie op deze nieuwe versie gemeld.
- De commerciële waarde ontstaat alleen na een afzonderlijk, vrijwillig adviesverzoek bij de correct genoemde ontvangende rechtspersoon. Een account of optioneel telefoonnummer wordt **niet** automatisch een saleslead.

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
