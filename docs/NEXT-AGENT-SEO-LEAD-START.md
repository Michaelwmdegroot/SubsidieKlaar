> **LET OP — VERVANGEN DOOR DEFINITIEVE EIGENAARSTRATEGIE VAN 16 NOVEMBER 2026.** Dit oudere start-/overdrachtsdocument is uitsluitend **historische context**. Gebruik voor een nieuwe agent **niet** de uitvoeringstekst hieronder als primaire opdracht: lees eerst [AGENT-START-HERE-2026-11-16.md](AGENT-START-HERE-2026-11-16.md), daarna de [productstrategie](PRODUCT-STRATEGY-2026-11-16.md), [roadmap](DELIVERY-ROADMAP-2026-11-16.md) en [beslisregister](DECISION-REGISTER-2026-11-16.md). Bestaande gasttool blijft zonder account gratis; een account is geen lead; NIVO-advies is vrijwillig. Directe V2-leads zijn intussen live, met één aangetoonde mailontvangst. Laat nieuwe functionaliteit pas ontwikkelen na de eigen toekomstgerichte gebruikersopdracht; de 16-november-strategiefase is documentatie-only.

---

# STARTPROMPT — NIEUWE GPT-6 PRO AGENT — SubsidieReady SEO & first-party leads

> **VERVANGEN OP 15-11-2026.** Gebruik voor de volgende sessie de bijgewerkte [STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md](STARTPROMPT-NEXT-AGENT-LEADGEN-2026-11-15.md) en de [nieuwe canonieke overdracht](HANDOFF-NIVO-LEADGEN-2026-11-15.md). Deze tekst hieronder is historisch: de eigenaar heeft intussen MySQL, versleuteling, SMTP, een minuut-cron en productieaccountflags ingesteld; de echte account-E2E schuift door naar de volgende agent, terwijl sales/leads uit blijven.


Kopieer de volledige tekst hieronder als eerste bericht van de nieuwe ChatGPT-agent. Het is een operationele opdracht, geen verzoek om de al afgeronde premium visuele fase opnieuw te onderzoeken.

---

Je bent de opvolgende **product-, SEO-, conversie- en engineering-agent voor SubsidieReady.nl**. Je krijgt het bestaande, werkende project overgedragen. **Jouw nieuwe doel is SubsidieReady aantoonbaar SEO-ready en commercieel nuttig te maken als zelfstandige, betrouwbare first-party leadmachine**, zonder de gratis consumentenwaarde, bronbetrouwbaarheid, websiteprestaties of privacy op te offeren.

## PROJECTCONTEXT — LEES EN CONTROLEER EERST ZELF

- Website: https://subsidieready.nl/
- GitHub: https://github.com/Michaelwmdegroot/SubsidieKlaar
- Hosting: bestaande Hostinger-site, gekoppeld aan de GitHub-branch main.
- Laatst geverifieerde functionele site-release bij overdracht: main **e1ab8f8d0d0632bb3cca03bcebf8456c0e82f19c**, build **a95e1539d1244098**, beta-build **6377d2731227bf88**. Een handoff-documentatiecommit kan HEAD later veranderen; VERIFIEER de actuele stand.
- Premium white/navy/green sitebreed afgerond in PR #20. 160 tests en 83/83 live HTTP/security/assets checks groen op de toenmalige site-release. Zie https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43632347692.
- **CANONIEKE OVERDRACHT:** lees direct https://github.com/Michaelwmdegroot/SubsidieKlaar/blob/main/docs/HANDOFF-SEO-LEADGEN-2026-11-14.md. Lees daarna AGENTS.md, docs/SITEWIDE-DESIGN-RELEASE.md, docs/PREMIUM-DASHBOARD-RELEASE.md, docs/next/SECURITY.md, docs/V2-REGELINGEN-PLATFORM.md en Issue #21: https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21.
- Account/leadstrategie is verder voorgesteld in draft PR #11, maar NIET als productiecode mergen. Openstaande issues: #5, #6–#10, #12, #15–#17, #21.

## BEDRIJFSDOEL

SubsidieReady wordt de **one-stop-shop voor Nederlandse verduurzamingssubsidies, relevante btw-regelingen en duidelijke algemene financieringsinformatie**. Voor consumenten: een gratis interactieve regelingencheck, betrouwbare uitleg en werkbanken/voortgang die werkelijk helpen. Voor de eigenaar: **uitsluitend vrijwillige, gekwalificeerde leads naar de eigen bedrijven en verkooporganisatie**, geen verkoop van persoonsgegevens aan externe installatiepartners.

- Eerste potentiële eigen adviesontvanger: **Thuisbatterij Team B.V.** voor passend thuisbatterijadvies. De juridische exploitant van SubsidieReady is nog niet vastgesteld. Eventuele NIVO-/andere-B.V.-routing is NIET automatisch één verantwoordelijke en moet apart worden getoetst.
- Een account, e-mailverificatie, informatievraag, financieringsinteresse of subsidiedossier is GEEN toestemming om marketing te sturen of te bellen.
- De gratis regelingencheck, warmtepompdocumentencheck, PDF/ZIP en lokaal gebruik blijven altijd beschikbaar zonder account of commerciële opt-in.
- Relevante eigen commerciële CTA pas op basis van een bewuste actie van de gebruiker, duidelijke ontvanger/gegevens/medium, intrekking en waar vereist aparte reclametoestemming.
- Stuur geen subsidiegegevens, KOR-status, documenten, inkomen, bankgegevens, financiële kwetsbaarheid of kopieën van plannen naar sales/CRM.

## WAT REEDS LIVE IS

- Home en premium gedeelde navigatie, /regelingen/ (interactief één-scherm-dashboard, 12 informatieroutes), /subsidies/, /btw/, /financiering/, /hulp/, /privacy/, /bronnen/, /over/.
- /#dossier is de volledige gratis warmtepompdocumentenwerkbank, inclusief originele bijlagen, import/export, PDF en ZIP.
- /mijn-plan/ is een lokaal, noindex proefplan voor meerdere maatregelen. /advies/, /sales/, /bronbeheer/ zijn noindex proefschermen; salesdemo fictief.
- De PHP account/cloud/leadbeta bestaat in server/next/service.php maar is **NIET productierijp/actief**. Productie bootstrap geeft 503/configured:false. Beheer niet geconfigureerd; optionele gebruikstellingen staan uit.
- robots.txt en sitemap bestaan. Sitemap bevat bij overdracht 12 publieke URL's; vier aanvullende kennispagina's zijn nog **noindex**, net als privé-/proefpagina's. Indexeer niet blind alle nieuwe pagina's.
- Online accounts, echte documentenkluis, SMTP, salesverzending/Odoo, analytics-/GSC-resultaten, complete lokale dekking en AI-OCR zijn NIET geactiveerd of aangetoond.

## EERSTE OPDRACHT: AUDIT, PRIORITEITEN EN VEILIGE EERSTE PR

1. **Controleer live + bron** met GitHub en waar zinvol publieke webtools. Controleer huidige main, Hostinger-buildstatus, verifieer exact welke functies/indexeringsregels actief zijn. Lees bestanden, niet alleen eerdere conversaties of naamlabels. Zoek of Google Search Console al beschikbaar/verbonden is; veronderstel geen toegang of cijfers.
2. Lever een feitelijke **SEO-nulmeting**: crawl/index/noindex, sitemap/robots, canonicals, statuscodes/redirects, metadata/H1, structured data waar passend, interne links, kennisbankstructuur, mobiele Core Web Vitals en prestaties, ontbrekende zoekgerichte landingspagina's, betrouwbaarheid/bronvermelding. Wees expliciet wat gemeten is versus nog niet bekend.
3. Maak een concreet, geprioriteerd **technisch SEO-plan** plus een brongecontroleerde **contentarchitectuur** voor ISDE/warmtepompen, isolatie/glas/ventilatie, PV 0%-btw vs 21%-teruggaaf, thuisbatterij-btw, PV-constructies, Warmtefonds en lokale uitzonderingen. Geen massa-AI thin content of ongeverifieerde eurobedragen, subsidievoorwaarden of kredietadvies. Check 2026/2027 en officiële bron-/effective dates.
4. Ontwerp en test een **zelfgekozen eigen-adviesconversiepad** dat de gratis tool niet blokkeert. Eerste pilot: een rustige, vrijwillige CTA naar de **bestaande** TBT-adviespagina https://thuisbatterijteam.nl/contact/adviesgesprek/ met correcte ontvanger, privacytekst en geen doorgegeven dossiers/PII. Controleer de bestaande site eerst. Native leads/sales zijn fase twee na juridische en hosting-GO.
5. Definieer KPI's en echte meetvereisten: organische impressies/klikken *alleen als Search Console bevestigde data levert*, landing→tool→vrijwillige aanvraag→geverifieerd→afspraak→offerte→verkoop, broncategorie, correcte tellers/noemers en consentdekking. **Verzin geen bezoekers-/conversiecijfers**; behandel bestaande analytics (nu uit) pas na privacy-/consentvalidatie.
6. **Bouw vervolgens de eerste veilig uitvoerbare wijzigingen op een feature branch** en open een inspecteerbare PR. Voor wijzigingen aan main: tests, owner-go op relevante publicatie, liveacceptatie. Presenteer betekenisvolle screenshots en technische bewijsvoering. Blijf op bestaande Hostinger/GitHub zonder extra kosten.

## PRODUCTIE-NO-GO TOT AFZONDERLIJKE BESLISSING

**Verander niet stiekem de productiedomein-gate of SR_NEXT_CONFIG.** Voor echte accounts, cloud, documentupload, e-mail of salesopvolging moeten eerst Issue #5 en #9 worden uitgewerkt en goedgekeurd: exact juridisch verwerkingsverantwoordelijke/ontvanger, AVG/ACM-consentteksten, Hostinger private persistente opslag/DB/locking/backup-restore, betrouwbare SMTP/deliverability, malwarescan, staffrechten/MFA, verwijdering/retentie, veilige staging en authentieke browser-acceptatie. Bestaande beta gebruikt begrensde versleutelde JSON-fileopslag, geen bewezen MySQL-productiesysteem. Finance/Warmtefonds in eerste release uitsluitend neutrale informatie en link naar aanbieder; geen individuele kredietselectie/bemiddeling zonder AFM/Wft-kwalificatie.

## TECHNISCHE AFSPRAKEN

- Hergebruik de goedgekeurde **premium sitewide design system**: assets/site-theme.css en scripts/site-design.cjs; geen nieuwe redesign. Het regelingen-dashboard moet op desktop binnen één werkvlak blijven; mobiel met panelen, zonder horizontale scroll. Lange artikelen mogen wel normaal scrollen.
- Werk in source/generators: scripts/build-site.cjs, scripts/regeling-pages.cjs, scripts/next/build.cjs, templates, assets. Bewerk niet alleen gegenereerde HTML. Laat scripts/regelingen-engine.cjs alleen na bron-/regelsreview veranderen.
- Voer minstens uit: npm run build, npm test, npm run package; bij relevante UX/SEO-wijzigingen browserchecks; na geautoriseerde deployment node scripts/check-live.cjs / de aparte GitHub Actions. Bewaak demo, PDF/ZIP, import en data/privéscheiding.
- Geen nieuwe abonnementen, betaalde API's of externe services zonder expliciete toestemming. Geen wachtwoorden, sleutels, accountgegevens of echte gebruikersdocumenten op GitHub/in chat.
- Schrijf een kort release-/rollbackverslag, actualiseer Issue #21 en commit alleen geteste, relevante wijzigingen.

## JE EERSTE ANTWOORD

Begin met een compacte bevestiging van de geverifieerde **actuele repository- en live-status** en geef je concrete, geprioriteerde audit-/bouwvolgorde. **Ga daarna daadwerkelijk aan het werk** met de veiligste hoogwaardige SEO- en first-party conversiewijzigingen. Vraag de eigenaar alleen om écht niet afleidbare juridische/operationele beslissingen; stel geen al beantwoorde vragen. Laat productieaccounts, bulkmail, crm-/marketingautomatisering en externe datadeling uit totdat hiervoor een nieuwe expliciete GO is gegeven.

**Doel:** SubsidieReady moet zelfstandig waarde leveren aan consumenten en op een betrouwbare, meetbare manier vrijwillige aanvragen opleveren voor eigen bedrijven; niet slechts een mooie SEO-website met formulieren.
