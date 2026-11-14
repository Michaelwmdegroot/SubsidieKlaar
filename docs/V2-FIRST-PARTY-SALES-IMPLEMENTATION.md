# SubsidieReady 2.0 — besloten richting: eigen leadgeneratie en verkoop

**Eigenaarbesluit:** 14 november 2026. Leads dienen uitsluitend voor de eigen bedrijven en verkooporganisatie. **Geen marktplaats voor leads, geen automatische partnerverkoop en geen onafhankelijke derde-ontvangers.** Dit besluit vervangt de open optie `eigen/partners/beide` uit het oorspronkelijke plan. Account, toestemming en gegevensopslag blijven afzonderlijke keuzes.

**Status:** product- en implementatieontwerp in draft PR #11; geen productcode, toestemming of accountdatabase geactiveerd. Zie ook `V2-PRODUCT-ACCOUNTS-LEADS.md` en `V2-ENGINEERING-SECURITY.md`.

## 1. Het bedrijfsmodel en juridische grens

**Consumentenbelofte:** de volledige individuele warmtepompdocumentencheck, PDF en ZIP blijven gratis en zonder account beschikbaar. Een gratis account helpt uitsluitend om gegevens en **na afzonderlijke keuze** bijlagen online te bewaren en een dossier op een ander apparaat te hervatten. Geen RVO-indiening, garantie of automatische controle van factuurinhoud.

**Commerciële belofte:** SubsidieReady biedt een vrijwillige adviesaanvraag voor een volgende verduurzamingsstap. Een relevante, zelf ingediende aanvraag kan als first-party lead bij een eigen verkoopteam terechtkomen; er wordt niets uit het subsidiedossier tot een verkoopsignaal verwerkt zonder gerichte handeling van de bezoeker.

### Ontvangerkeuze, minimaal en expliciet

| Onderwerp | Voorstel bestemming | Moment van activatie |
| --- | --- | --- |
| Thuisbatterij | **Thuisbatterij Team B.V.** als eerste pilot-ontvanger | Zodra merkrelatie, privacycopy, werkelijk aanbod en verkooptoegang zijn bevestigd |
| Zonnepanelen | Thuisbatterij Team B.V. **uitsluitend als dit aantoonbaar in het eigen actuele aanbod zit** | Na aanbodcheck |
| Particuliere laadpaal | Thuisbatterij Team B.V. **uitsluitend bij eigen verkoopcapaciteit** | Na aanbodcheck |
| Warmtepomp, warmtepompservice, klimaat | NIVO-gerelateerd bedrijf / bevoegde contracterende partij | Pas na bevestiging van exacte rechtspersoon, service en aparte gegevensroute |
| Isolatie | Informatieve content, **nog geen leadbestemming** | Pas indien eigen organisatie dit werkelijk aanbiedt en legal routing is bepaald |
| ISDE-dossierhulp | Gratis zelfservice en e-mailtemplate aan installateur | Geen betaalde adviesdienst suggereren zolang die niet daadwerkelijk wordt aangeboden |

**Belangrijk:** de gebruiker heeft Thuisbatterij Team B.V. eerder expliciet als **aparte B.V.** van NIVO aangeduid. Gedeelde medewerkers, marketing of tools maken het niet automatisch één verwerkingsverantwoordelijke. Welke rechtspersoon SubsidieReady beheert is nog niet vastgesteld. Totdat dit formeel is bepaald: geen datadeling naar TBT, NIVO of Odoo en geen publicatie van een organisatie als verantwoordelijke op basis van een vermoeden.

**Beslisvariant A:** SubsidieReady is juridisch een merk/dienst van Thuisbatterij Team B.V. -> één expliciete verantwoordelijke voor de dienst, maar accountgebruik staat nog altijd los van commercieel contact.

**Beslisvariant B:** een andere rechtspersoon beheert SubsidieReady -> de adviesaanvraag noemt Thuisbatterij Team B.V. vooraf als afzonderlijke ontvangende onderneming; definieer de afzonderlijke doelen/rechtsgronden, transparantie en passende onderlinge afspraken. Geen stille export op basis van het woord 'eigen bedrijf'.

Meer ontvangers in toekomst: kies maximaal één passende, bij naam genoemde commerciële bestemming per aanvraag (of laat de gebruiker duidelijk kiezen); **geen algemene selectie `alle bedrijven van ons`**.

## 2. Productervaring en conversiemomenten

1. **Homepage**: primaire knop `Start gratis documentencheck`; secundair `Mijn dossiers / Inloggen`. Geen verplichte contactvraag.
2. **Na eerste ingevoerde gegevens**: een rustige, wegklikbare CTA `Bewaar mijn voortgang — gratis account`. Leg uit dat accountdata online bewaard wordt en bijlagen alleen na expliciete upload.
3. **Dossieroverzicht**: de primaire actie blijft `Download PDF/ZIP`. Daarnaast één passende CTA: `Wil je ook meer uit je energie halen? Vraag vrijblijvend advies over een thuisbatterij`, alleen als aanbod correct is en rekening houdend met bestaande installatie.
4. **Na download**: een eenmalige uitnodiging tot online opslaan of advies. Geen blokkerende pop-up vóór download en geen herhaald agressief aanbod.
5. **Kennisbank**: contextuele informatieve links; een vrijwillige adviesvraag op aparte pagina, onafhankelijk van account.
6. **Mijn dossiers**: nadruk op voortgang, niet op verkopen. Hooguit één uitzetbare advieskaart buiten de dossierinhoud.
7. **Overige maatregelen**: geen fictieve `Wij controleren je hele subsidie` of `Maximale subsidie gegarandeerd` teksten zolang de tool alleen warmtepompdocumenten voorbereidt.

### Voorbeeld van één eigen sales intake

**Kop:** `Ook benieuwd of een thuisbatterij bij jouw woning past?`

**Uitleg:** `Vraag vrijblijvend informatie aan bij Thuisbatterij Team B.V. Je subsidiedossier en documenten worden niet meegestuurd.`

**Vragen:** `Waarvoor wil je advies?` (thuisbatterij); `Wanneer wil je dit onderzoeken?` (nu / 1-3 maanden / later / oriënteren); `Heb je zonnepanelen?` (ja / nee / weet ik niet, optioneel); `Waar kunnen we contact opnemen?` (e-mailadres en/of telefoon, afhankelijk van gekozen contactvorm); `Postcodegebied?` (optioneel eerste 4 cijfers); `Toelichting` (optioneel, maximaal 500 tekens; toon 'geen bank- of subsidiedocumenten toevoegen').

**Actie voor callback:** knop `Ja, Thuisbatterij Team B.V. mag mij over deze aanvraag bellen`, alleen bij expliciete keuze telefonisch contact. Of `Stuur mij informatie over deze aanvraag` voor e-mailroute.

**Apart, standaard UIT:** `Ik wil daarnaast aanbiedingen/nieuws ontvangen van Thuisbatterij Team B.V.` met duidelijk medium, frequentie/onderwerp, bewijs en afmelden. Accountaanmaak vinkje is nooit reclameconsent. Als informatie op verzoek wordt verstuurd, geen latere ongerelateerde marketing.

**Bevestiging:** `Je aanvraag over [onderwerp] is ontvangen door [genoemd bedrijf]. Je ontvangt alleen berichten die nodig zijn voor dit verzoek; extra aanbiedingen alleen als je daar apart voor hebt gekozen.` Toon ontvangst-ID zonder persoonsgegevens in URL. Verwijzing naar eigen privacyrechten en mogelijkheid verzoek in te trekken.

## 3. Aanvraagtypes die de verkooporganisatie daadwerkelijk kan gebruiken

| Type | Herkenning | Route |
| --- | --- | --- |
| Oriëntatie | informatievraag, geen concrete termijn | informatieve reactie namens de opgegeven onderneming, geen ongevraagde belcampagne |
| Advies | vraag over situatie en oplossingsrichting | salesman/adviseur volgt vraag op binnen afgesproken contactkanaal |
| Offerte-intentie | onderwerp + expliciete offertewens + contactgegevens | eigen verkoopteam, menselijke kwalificatie en afspraak |
| Servicevraag | vraag over bestaand product | eigen serviceproces, niet automatisch als nieuwe sales lead aanmerken |

De gebruiker kan ook zonder account een adviesverzoek doen; identiteit en toestemming zijn gescheiden van login.

## 4. Interne salesworkflow

**Startmodel:** een private SubsidieReady Sales Inbox naast de bestaande statistieken. Bouw geen brede, onveilig gedeelde CRM-database met toegang tot dossierbestanden.

```text
ingediend -> contact geverifieerd -> gekwalificeerd -> toegewezen
          -> eerste reactie -> afspraak -> offerte -> gewonnen/verloren
           \-> ingetrokken / ongeldig / niet bereikbaar
```

**Bij elke lead:**
- uniek ID, gekozen onderwerp, expliciet ingevulde antwoorden, contactgegevens, gekozen medium, ontvangende rechtspersoon, aanvraagdatum, bronklasse (bijv. homepage, kennisbank, na dossier; geen verborgen dossierinhoud) en versie van getoonde privacy-/contacttekst;
- veld voor verantwoordelijke verkoper, contactlog (datum/methode/uitkomst), opvolgdatum, status, factueel gevolg en bezwaar/opt-out;
- geen factuurnummers, subsidiebedragen, rekeninggegevens, bijlagen, meldcodes, volledige dossierstatus, exacte woningadressen of browsergedrag in de sales inbox;
- geverifieerd contact, deduplicatie op dezelfde aanvraag en rekening houden met onderdrukking/uitgeschreven gebruikers;
- e-mailnotificaties alleen `Nieuwe adviesaanvraag #ID` (geen contactdetails in notificatiemail); details alleen na login.

**Voorgestelde serviceafspraak (geen reeds bestaand feit):** nieuwe *door de gebruiker aangevraagde* salescontacten tijdens werkdagen binnen één werkdag oppakken. Geen onbegrensde belpogingen. Follow-up eindigt als de persoon geen contact meer wil of het verzoek intrekt.

**Rollen:**
- `sales_agent`: alleen toegewezen en geautoriseerde aanvragen van de eigen rechtspersoon;
- `sales_manager`: overzicht, toewijzen, rapportages van dat verkoopteam;
- `site_admin`: technische configuratie, audit, toegangstoekenning;
- `support`: alleen serviceverzoeken, geen onnodige verkoopdata;
- **geen enkele salesrol krijgt toegang tot gebruikersdossiers of financiële bijlagen**.

Voor Thuisbatterij Team kan een geautoriseerde medewerker uit het huidige verkoopteam later worden toegewezen; benoem geen individuele medewerker als standaardgebruiker zonder toegangsbesluit.

### CRM-koppeling (optioneel, niet eerste vereiste)

Start met interne sales inbox + handmatige export voor bevoegd personeel. Later een Odoo/CRM-integratie via beveiligde, idempotente outbox, alleen met verkoopgegevens en ontvanger-toestemming. **Verifieer eerst welke Odoo-organisatie/database juridisch de passende ontvanger is.** Geen CRM-automatisering die dossierdata kopieert of tussen B.V.'s vermengt. Credentials nooit in Git, logs of browser.

## 5. Privacy en rechtsgrond per doel

| Gegevensstroom | Doel | Voorlopige AVG-basis / actie |
| --- | --- | --- |
| Gastdossier | Lokale documentenvoorbereiding | Geen serveropslag van dossier/financiële inhoud; noodzakelijke websitefunctionaliteit en transparantie |
| Gratis account | Inloggen en accountservice | Vast te stellen rechtsgrond voor aangevraagde accountdienst (vaak overeenkomst, art. 6(1)(b)); accountmail is niet marketingopt-in |
| Online dossier | Op verzoek synchroniseren | Noodzakelijk voor gekozen opslagdienst; heldere uitleg bij online opslaan |
| Online bijlagen | Specifiek op verzoek bewaren en terughalen | Losse expliciete gebruikersactie + beveiligde private opslag en documentverwijdering |
| Adviesverzoek | Reageren op expliciet gekozen vraag en medium | Bepaal/registreer grondslag (bijv. stappen op verzoek voor offerte of gerechtvaardigd belang bij beantwoorden informatievraag) en volg ACM-regels voor telefonische werving |
| Extra promotie | Nieuwsbrief/herhaalde commerciële e-mail/SMS/telefoon buiten het concrete verzoek | Afzonderlijke voorafgaande, aantoonbare toestemming waar wettelijk vereist, per bedrijf/doel/medium, eenvoudige intrekking |
| Centrale analytics | Gebruikspatronen verbeteren | Huidige opt-in eventmethode blijft apart; geen samensmelting met account of leadidentificatie zonder herbeoordeling |

**ACM-update 2026:** vanaf 1 juli 2026 zijn verkooptelefoontjes aan consumenten voor gewone commerciële bedrijven alleen toegestaan met aantoonbare toestemming; oude klantrelatie is voor die bedrijven geen algemene uitzondering meer. **Een vrijwillig aangevraagd en duidelijk omschreven callback-verzoek is functioneel iets anders dan een ongevraagde telemarketingcampagne**; behandel het uitsluitend voor de concrete vraag, leg de actieve contactwens aantoonbaar vast en vraag voor latere verkoopcampagnes separate toestemming. Laat de definitieve formulering juridisch toetsen.

ACM: een als `gratis` aangeboden tool mag niet verplicht met persoonsgegevens of een commerciële tegenprestatie worden 'betaald'. De volledige gastflow en export blijven daarom zonder account/leadwens beschikbaar.

**Organisaties:** een aparte B.V. is niet automatisch een interne afdeling van de SubsidieReady-controller. Voor elk salesbedrijf: correcte naam, verwerkingsdoel, rechtsgrond, ontvanger, eventuele rol controller/joint-controller/processor, contracten en informatieplicht vastleggen vóór routing.

**AVG-rechten:** privacycontact en inzage, export, rectificatie, verwijdering, intrekking/bezwaar. Beveilig contactverificatie van data-rights-verzoeken. Account verwijderen hoeft niet altijd bewijs van eerdere toestemming meteen te vernietigen: beperkte, apart beveiligde compliance-registratie kan noodzakelijk zijn, juridisch onderbouwd met bewaartermijn.

**Bewaarbeleid — voorlopig:** accounts/dossiers zolang actief, met aangekondigde inactiviteitsregeling (bijvoorbeeld 12 maanden); ongeldig/niet-opgevolgd leadverzoek kort (bijvoorbeeld 90 dagen); afgehandelde leads bijvoorbeeld maximaal 6-12 maanden indien operationeel nodig; marketingonderdrukking beperkt bewaren zolang nodig; technische logs en backups zo kort als mogelijk. **Geen definitieve termijnen zonder onderbouwing en akkoord.**

**Privacy-gates:** rechten-/datastromenkaart, Hostinger verwerkersafspraken, DPIA-triage (hoog-risico-verwerkingen vereisen een DPIA vóór start), verwerkingsregister waar toepasselijk, datalek- en herstelprocedure, back-upversleuteling, geen klantdocumenten in e-mail/CRM.

## 6. Architectuurgrenzen en data

```text
Browser / Gast-tool  -> lokale state + PDF/ZIP (blijft ongewijzigd)
       |
       +-- opt-in account -> PHP auth -> private account DB -> eigen dossiers
       |                                         -> versleutelde private bijlagen
       |
       +-- zelf ingestuurde adviesaanvraag -> publieke, beveiligde intake
                                              -> bewijs contactwens + anti-abuse
                                              -> private Sales Inbox -> geautoriseerde verkoper
                                              -> eventueel later eigen Odoo CRM
```

Geen automatische join van gebruiker `accounts.email` naar sales. Een login, e-mailverificatie, documentupload of deels afgemaakt dossier triggert nooit leadcreatie.

**Tabeluitbreiding ontwerp:** `sales_destinations` (id, legal_name, controller_role, enabled, eligible_topics, verified_at), `lead_requests` (lead_id, receiving_entity_id, topic, request_type, contact_method, contact_value, four_digit_area optional, timeline, submitted_at, verified_at, status), `lead_permissions` (request_id, medium, purpose, exact_copy_version, affirmative_action, recipient_id, consent_status, time, revocation), `sales_assignments`, `sales_activities`, `suppressions`, `outbox`. Geen `dossier_json` of document-FK in de commerciële tabellen.

Dezelfde Hostinger-site mag de API hosten mits PHP/SQL/private file store/backup bewezen zijn. Nieuwe routes gated en fail-closed; CORS dicht, CSRF/origin-controls, per-object authorisatie, audit, geheime bestanden buiten webroot. Bestaande `/admin` niet automatisch salesrechten geven. SMTP alleen voor serviceberichten; verkoopopvolging naar de persoon uitsluitend volgens diens keuze.

## 7. KPI's / sturing

**1. Waarde voor gebruikers:** unieke actieve dossiers per kalenderweek met expliciete update (echte accounts, geen demo); plus geslaagde hervatting na 7/30 dagen. Beschrijf noemers en accountcohorten.

**2. Eerste-partij-leads:** aantal per maand **geverifieerde, niet-ingetrokken aanvragen** voor een actief eigen product, met expliciete naam ontvanger. Niet hetzelfde als accounts of pageviews.

**3. Commerciële opbrengst:** percentage geverifieerde aanvragen dat binnen het afgesproken proces leidt tot een afspraak en daarna een **geregistreerde verkoop** bij het bedrijf dat de lead mocht ontvangen. Stage-to-stage ratios met noemers en perioden; bij kleine aantallen eerst absolute aantallen tonen.

Diagnostiek: time-to-first-response (alleen geldige aanvragen), duplicaten/invalides, off-scope aanvragen, ongeautoriseerde doorgiftepogingen, syncfouten en accountverwijdering. Leadwaarde = **geen** geschatte subsidiehoogte of op dossierdata gebaseerde koopkracht.

Begin zonder verzonnen omzetdoelen of conversieratio's. Zet pas targets na basismeting.

## 8. Praktische bouwvolgorde en zichtbare opleveringen

**P0: juridische, commerciële en infra readiness (blokkeert echte persoonsdata)**:
1. Leg schriftelijk vast onder welke rechtspersoon SubsidieReady wordt aangeboden, inclusief KvK-/contactgegevens, en dat TBT B.V. het eerste (eventueel afzonderlijke) verkoopbedrijf is.
2. Bevestig daadwerkelijk verkochte TBT-productcategorieën, contactkanalen en wie intern salesrechten krijgt.
3. Read-only inventarisatie Hostinger: PHP, MariaDB/PDO, persistent private opslag buiten webroot, storage quota, backups, mailtransport, SPF/DKIM/DMARC, DPA, opslagsituatie onder auto-deploy.
4. Schrijf privacy- en consentcopy voor drie afzonderlijke doelen: account, online documenten, salesadvies/marketing; laat juridisch controleren.
5. Test staging en veilige herstelprocedure; geen productiewijziging.

**P1: accountbasis**: login met veilige 10-minuten-OTP, beveiligde sessie, Mijn dossiers, export/delete, gastflow identiek.

**P2: state sync**: versiebeheer + optimistic locking; expliciete guest-to-cloud import; autosave-status en duidelijke offline fouten, multi-device end-to-end.

**P3: private documentvault**: gebruikerseigen bestanden na afzonderlijke actie, private permanente opslag en keybeheer, quota, veilige downloads, PDF/ZIP compatibel, restore drill.

**P4a: eerste leadpilot** (kan na P0 deels parallel met P1-P3): uitsluitend `Thuisbatterijadvies aanvragen` voor werkelijk eigen TBT-aanbod en geautoriseerd salesbeheer; geen accountvereiste. Begin met handmatige opvolging vanuit private inbox, service-only berichten en afmeld-/intrekroute.

**P4b: tweede eigen bedrijf**: pas als juridische ontvanger, productaanbod en route apart gevalideerd zijn. Geen algemene partner-router.

**P5: productie-acceptatie**: 57+ bestaande regressietests, live domein/sitemap/security headers, twee accounts kunnen niets van elkaar zien, accountverwijdering, mislukte OTP, concurrent autosave, virus-/uploadscenario's, toestemming/marketing, salesrollen, backups en mobile/Safari. Release pas na aparte eigenaar-GO.

### Heldere NO-GO situaties

- Ontbrekende verantwoordelijke rechtspersoon/privacycontact.
- Geen permanent beveiligde opslag of backup/restore.
- Geen goed werkende, veilig configureerbare transactionele e-mail.
- Geen verifieerbare wettelijk juiste contactkeuze; geen scheiding account vs verkoop.
- Dossier-/betaalbewijsdata in sales CRM of public docs.
- Account vereist voor PDF/ZIP of demo als verkooplead geteld.
- Ongeautoriseerde toegang van verkoopmedewerkers tot gebruikersdossiers.

## 9. Externe officiële bronnen (geverifieerd 14 november 2026)

- ACM marketing e-mail/SMS/WhatsApp en consent: https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/spam-voorkomen-uw-reclame
- ACM telemarketing (2026): https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/verkoop-telemarketing
- ACM gratis reclame: https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/iets-gratis-noemen
- AP account is niet automatisch klant: https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/direct-marketing
- AP verantwoordelijke versus verwerker/joint controllers: https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verantwoordelijke-en-verwerker
- AP wettelijke grondslagen: https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/avg-europese-privacywetgeving/mag-u-persoonsgegevens-verwerken
- AP verwerkersovereenkomst: https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst
- AP DPIA: https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/data-protection-impact-assessment-dpia

Dit is product- en engineeringplanning, geen definitief juridisch oordeel. De officiële regels en de concrete bedrijfsstructuur moeten opnieuw worden vastgesteld bij publicatie.
