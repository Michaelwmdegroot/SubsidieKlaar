# Next-level testrelease — opgeleverd en nog open

**Datum:** 14 november 2026. **Branch:** `feat/nextlevel-testrelease`. **Basis:** `9158e019cbd52340d0fbc0d2d4b834f94b2d3a7d`. **Publicatiebeleid:** eerst eigenaartest; geen merge, deployment of activatie op main.

Dit is een geïntegreerde testrelease van roadmap #17. Niet alle latere groeifuncties zijn af en de online backend is nog geen vrijgegeven productieplatform.

| Onderdeel | Implementatie | Nog vóór echt gebruik |
|---|---|---|
| Mijn verduurzamingsplan | Meerdere projecten/maatregelen, eigen datums/taken, expliciete lokale opslag, JSON-import/export, conflictwaarschuwing | Native browsers/gebruikersacceptatie |
| Werkbanken | Voorbereidingscontroles voor isolatie/glas, PV-btw, PV-constructies, batterij-btw; bestaande volledige warmtepompwerkbank blijft apart | Fiscale/bronreview voor uitzonderingen; geen beschikkings- of bedragengarantie |
| Documenten lokaal | PDF/PNG/JPEG toevoegen, afzonderlijke IndexedDB-bewaarkeuze, exacte filedownload, ZIP met originelen | Browseropslag per browser, quota en echte telefoon testen |
| Planning | Begrensde ISDE-termijnhulp, generieke ICS-export, optionele serviceherinneringcode | Geen algemene btw/kredietdeadlines; werkelijke job/mailconfiguratie |
| Accounts en cloudplannen | OTP, echte sessies, ownership, revisies/autosave, eigen lijst/export/delete | Hostinger/staging, exploitant, retentie, mailaflevering, productieopslagkeuze |
| Private documentenkluis | Encryptie, quota/typechecks, eigenaarstoegang, exact bytes, bewijsreset, gate op scanner | Scanner op host, sleutelbeheer, echte herstel-/deploytest |
| Eigen adviesintake | Afzonderlijke vrijwillige vraag, gekozen entiteit/kanaal, mailverificatie, intrekken | Correcte juridische ontvanger en privacytekst; geen echte aanvragen geactiveerd |
| Sales-inbox | Manager/agent- en entiteitstoegang, toewijzing, status, audit, beperkte export; losse fictieve demo | Sterkere personeelsauthenticatie/MFA-besluit, echte teamrollen, geen Odoo-integratie |
| Inhoud & bronnen | Vier nieuwe brongebaseerde helpartikelen, zichtbaar bronoverzicht, CLI-hashmonitor zonder auto-publicatie | Geen complete gemeenteregistratie, geen ingeschakelde wekelijkse job |
| Backup/herstel | Versleutelde snapshot plus herstel naar aparte private map getest | Real Hostinger-redeploy, keybackup- en bewaartermijnbeleid |
| AI en verdere groei | Geen betaalde of externe AI-afhankelijkheid | OCR/chatassistent, B2B/white-label, volledige lokale dekking, Search Console-activatie en marketingautomatisering niet gebouwd/geactiveerd |

## Verificatie tot aan deze bronversie

- Lokale `npm run build`, `npm test`, `npm run package` uitgevoerd. **128 tests geslaagd, 0 fouten, 0 overgeslagen**; 87 bestaande tests plus nieuwe model-, bronmonitor- en echte PHP API-regressies. De uiteindelijke CI-head wordt apart aan de PR toegevoegd.
- De API-tests starten een echte lokale PHP-server met tijdelijke versleutelde opslag buiten de repository. Ze testen daadwerkelijke requests voor OTP, cookies, CSRF, rollen, twee accounts, twee ontvanger-entiteiten, conflict, upload/download, intrekken, deletion, snapshot/herstel en fail-closed productieconfiguratie. Alle data is synthetisch, adressen `.invalid`, geen echt mailtransport.
- In-memory Chromium: **48 scherm/breedtecombinaties**: 24 plan-tabs, 6 sales-demo en 18 advies/bron/help-pagina's; 320 tot 1440 pixels. Geen horizontale overflow of page errors.
- UI-functies: sample, taakreset, JSON, kalender, ZIP, legacy-projectimport en lokaal bestand roundtrip. De oorspronkelijke warmtepomp-PDF/ZIP-tests blijven groen.
- Extra UI-fixtures simuleren localStorage en online API-antwoorden voor opt-in, herladen, lokale conflicten, login-zonder-upload, autosave en cloud409-behoud. Dit is geen bewijs van native opslag of echte browser/API-netwerkintegratie.
- De browser in de uitvoeromgeving blokkeert HTTP-navigatie met `ERR_BLOCKED_BY_ADMINISTRATOR`. Daardoor is de visuele check in geheugen uitgevoerd. Alleen een testshim voor randomUUID is gebruikt waar about:blank geen secure context heeft; productcode krijgt die shim niet. Geen claim van live HTTPS/CSP-, Safari-, Firefox- of telefoontest.
- De source-monitor is met testresponses getest. Er is geen echte periodieke bronmonitoring, cron of ChatGPT-automation geactiveerd. Brononderzoek is afzonderlijk handmatig uitgevoerd.

## Geen automatische productieclaims

Het gebruik van bestanden als beta-database in plaats van SQL is expliciet vastgelegd in SECURITY.md. Werkelijke mailaflevering, hostingvolumes, exploitant/ontvangerrollen, scanner, personeels-MFA, wettelijke retentie, native browsertests en productieperformance zijn open voorwaarden. Er worden geen fake accounts of fictieve omzetcijfers als echte resultaten gepresenteerd.

Lees TESTEN.md en STAGING.md. Laat main ongemoeid totdat de eigenaar testfeedback en een expliciete publicatieopdracht geeft. De plannen uit PR #11 blijven relevante ontwerpcontext; roadmapissues worden niet allemaal als 'afgerond' gesloten omdat deze beta bestaat.
