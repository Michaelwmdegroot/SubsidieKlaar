# SubsidieReady 2.0 — Productstrategie: accounts, dossierbehoud en vrijwillige leads

> **Eigenaarsbesluit 14 november 2026:** commerciële opvolging uitsluitend door eigen bedrijven; geen leadverkoop aan externe partijen. Thuisbatterij Team B.V. is de voorgestelde eerste salesbestemming, na bevestiging juridische rol en werkelijk aanbod. Het [first-party implementatieplan](V2-FIRST-PARTY-SALES-IMPLEMENTATION.md) is vanaf nu leidend voor leadrouting. De oorspronkelijke partnerscenario's hieronder zijn alleen historische opties.


**Status:** voorstel voor review, geen toestemming om het product aan te passen of persoonsgegevens te verzamelen. Opgesteld 14 november 2026. Basis: bestaande 1.0 code op `main`, visuele release en PHP-backoffice. De volledige anonieme documentencheck blijft gratis.

## 1. Productmissie en spanningsveld

Voor de woningeigenaar: in korte sessies een goed voorbereide ISDE-documentenset opbouwen, per apparaat hervatten en zelf beslissen of hulp nodig is. Geen suggestie van RVO-toekenning, inhoudelijke documentcontrole of automatische indiening.

Voor de eigenaar: terugkerend gebruik, aantoonbaar door bezoekers gevraagde ondersteuning en kwalitatieve, **vrijwillige** partner-/adviesaanvragen. Een e-mailadres voor een account is **geen** toestemming voor marketing of het delen van dossiergegevens.

### Expliciete principes

1. Geen account nodig voor de volledige individuele check en PDF/ZIP-export. Geen marketingtoestemming als tegenprestatie voor gratis gebruik.
2. Account is optioneel, gratis en gericht op bewaren/hervatten. Eerst concrete waarde tonen; daarna rustige CTA `Bewaar mijn dossier online`.
3. Het dossier en documenten zijn strikt gescheiden van commerciële leadinformatie. Nooit automatisch inhoud scannen of delen voor leadgeneratie.
4. Bewaar echte uploads alleen nadat de gebruiker expliciet kiest voor online documenten bewaren; anders blijven bestanden alleen lokaal.
5. Geen ongevraagde marketingmail. Een afzonderlijke toestemming geldt per concreet doel en de daadwerkelijke ontvanger(s), en moet altijd ingetrokken kunnen worden.
6. Dit product biedt documentvoorbereiding en ondersteuning; geen betaalde subsidiemakelaar, subsidiegarantie, automatische RVO-check of live meldcodeverificatie.
7. Introduceer geen nieuwe betaalde infrastructuur zonder eigenaarsbesluit. Verifieer eerst Hostinger PHP/database/opslag en veilige mailaflevering.

## 2. Gebruikersreis

### Zonder account (bestaande ervaring)

Landing -> start -> situatiecheck -> invullen -> bijlagen lokaal kiezen -> checklist -> PDF/ZIP of project-JSON. De sessie blijft volledig functioneel en zonder e-mail. Browserlokale optionele draft blijft bruikbaar. De huidige lokale opslag wordt niet zonder gebruikersactie gesynchroniseerd.

### Met gratis account

- Bezoeker ziet na eerste zinvolle gegevens de CTA: **`Bewaar mijn voortgang. Gratis.`** en toelichting: `Werk op je telefoon of laptop verder. Met een account bewaar je je dossier online.`
- Aanmelden met e-mail en een eenmalige verificatiecode/link, **mits** Hostinger SMTP betrouwbaar en veilig configureerbaar is. Alternatief: veilig gehasht wachtwoord en verificatie-e-mail. Geen marketingvinkje in de accountflow.
- Bij eerste koppeling: expliciete keuze `Dit huidige dossier in mijn account bewaren`, overzicht van welke persoonsgegevens online komen en aparte keuze `Ook mijn bijlagen online bewaren`.
- Na aanmelding: **Mijn dossiers**, maximaal aantal en bewaartermijn zichtbaar. Kaart per dossier met titel, voortgang `x/y punten`, aantal bijlagen, laatste wijziging en CTA `Verdergaan`.
- In de werkbank: `Opgeslagen` / `Opslaan bezig` / `Niet opgeslagen — probeer opnieuw`; geen stilzwijgende verdringing van wijziging op een ander apparaat.
- Stappen en eerdere bevestigingen blijven bestaan, maar relevant gewijzigde waarden of gewijzigde bestanden moeten de juiste bevestigingen opnieuw ongeldig maken.
- Bij terugkeer via nieuw apparaat: alleen na succesvolle verificatie toegang tot eigen dossiers. Bijlagen met geauthenticeerde downloads/preview, nooit openbare URL's.
- `Exporteren`, `Verwijderen`, `Online bewaren uitzetten` en `Account verwijderen` zijn helder aanwezig.
- Zonder account behoudt de gebruiker de oorspronkelijke lokale privacybelofte. Met account wijzigen teksten naar `Je gegevens worden beveiligd online bewaard als je daarvoor kiest`.

### Geen koppeling tussen demo en echte leads

Fictieve demo-dossiers worden nooit gesynchroniseerd met een echte account zonder heldere expliciete `kopieer demo`-actie, niet in commerciële pipelines geteld en nooit als echte klantgegevens gebruikt.

## 3. Leadstrategie

Een account = `geregistreerde gebruiker`, niet `verkoopbare lead`. Een lead ontstaat pas na een concrete, door de bezoeker ingezonden aanvraag met passende privacy-informatie en specifieke toestemming voor eventuele doorgifte.

### Primaire mogelijkheden (fase 1)

**A. Verduurzamingsadvies op verzoek:** na een bruikbaar dossierresultaat of op een relevante informatiepagina:
`Wil je ook iets verbeteren aan je woning?`
Bezoeker kiest zelf een onderwerp (isolatie, zonnepanelen, thuisbatterij, energieadvies, warmtepomp/onderhoud alleen waar passend), gewenste termijn, globaal gebied en een contactmethode. We gebruiken géén factuurbedrag, bankgegevens, exacte documenten of impliciete financiële profielen.

**B. Hulp bij ontbrekende documenten:** gebruiker kan het huidige conceptbericht voor de eigen installateur gebruiken. Later optioneel `Ik wil hulp van een expert`, uitsluitend wanneer er een daadwerkelijk ondersteuningsaanbod met naam, reikwijdte en voorwaarden bestaat. Geen valse indruk dat partners bij RVO kunnen goedkeuren.

**C. Installateur-/professional-intake:** aparte B2B-landing met verzoek om een demo, professionele herhaalworkflow of partnerinformatie. Niet vermengen met particuliere dossiers.

### Extra kansen (later)

- Nieuwsbrieven met subsidie-informatie, uitsluitend opt-in en aparte afmelding.
- Professionele teams/white-label intake als premium B2B-feature (geen blokkade van gratis consumentenproduct).
- Geen generieke verkoop van geregistreerde accountgegevens. Geen partnerfeed van dossierbestanden of ongevraagde opvolging.

### Lead formulier: zo klein mogelijk

Voorgestelde velden: onderwerp (verplicht), gewenste hulp (verplicht), contact via e-mail/telefoon (verplicht keuze), e-mail of telefoon (verplicht conform keuze), regio op basis van optionele eerste vier postcodecijfers, gewenste termijn (optioneel), optionele korte toelichting zonder documentupload.

Toon vóór verzenden de feitelijke verantwoordelijke organisatie, eventuele concreet genoemde partner en exact welke velden die ontvangt. Een ongekende partnergroep mag niet achter een algemene `wij delen met partners` verdwijnen. Als de lead bij SubsidieReady blijft voor eigen opvolging, maak dat eveneens expliciet.

Afzonderlijke, standaard uitgevinkte keuzes voor:
- adviesaanvraag/benadering of doorgifte: specifieke actie voor het gekozen doel;
- nieuwsbrieven / aanbiedingen;
- optionele productanalytics, los van bovenstaande.

Serviceberichten zoals inlogcodes en beveiligingsmeldingen zijn functioneel; geen commerciële aanbiedingen verstoppen in die berichten. Optionele herinneringen over voortgang volgen de keuze van de gebruiker en bevatten geen documenten of gevoelige details.

### Levenscyclus lead

`requested -> verified -> qualified -> assigned -> contacted -> closed` (met aparte `withdrawn`/ `invalid`). Een eigenaar/beheerder moet de bestemming en toestemming kunnen zien. Partnerexport/doorsturen alleen na expliciete, toepasselijke toestemming en met auditeerbare ontvanger. De afzender van marketingberichten is transparant; intrekken/afmelden werkt.

## 4. Conversie zonder druk

- Startpagina: CTA `Start gratis` en secundair `Inloggen / Mijn dossiers`.
- Tijdens stap 1 of na waarde: `Bewaar dit dossier en ga later verder` (geen fullscreen blokkade).
- Na statusoverzicht: duidelijk `Download je documenten`; daarnaast een kleinere `Wil je vrijblijvend advies?` wanneer inhoudelijk relevant.
- Op `Mijn dossiers`: geen voortdurende partnerverkoop, hooguit één rustige, dismissible persoonlijke CTA buiten het dossier.
- Informatieve pagina's: optioneel zelfstandig adviesverzoek, ook mogelijk **zonder account**; wees helder dat het gegevens delen inhoudt.
- Geen verborgen vinkjes, nepurgentie, automatische toestemming of afhankelijkheid van leadgegevens om dossier te exporteren.

## 5. Eerste KPI-framework

**Primaire uitkomst 1: waarde voor gebruiker.** `Actieve dossiers`: aantal unieke echte dossiers met minimaal één betekenisvolle wijziging per week, bron: server-side accountoperatie; anonieme gebruikers afzonderlijk en alleen voor zover gemeten met hun toestemming. Geen demo's.

**Primaire uitkomst 2: vrijwillige kwalitatieve vraag.** `Geaccepteerde hulpaanvragen`: aantal afzonderlijke door bezoekers ingediende en geverifieerde adviesverzoeken die voldoen aan minimale contact-/relevantiecriteria, exclusief ingetrokken aanvragen. Pas later afspraken over billable leads maken.

**Primaire uitkomst 3: hervatbaarheid.** `7-/30-dagen hervatting`: aandeel geverifieerde accounts met een opgeslagen dossier dat in een latere browsersessie werkelijk is hervat; cohortmeting alleen waar operationeel nodig en op accountniveau afgeschermd.

Diagnostiek: accountaanmaak na eerste check, e-mailverificaties, uploadsucces, syncfouten, documentvoltooiing, adviesverzoekpercentages per expliciet gekozen onderwerp, leads per partner en uitval. Noem percentages altijd met duidelijke teller/noemer en privacydekking.

Guardrails: 0 openbaar toegankelijke dossiers/uploads; 0 ongevraagde marketingberichten; 0 ongeautoriseerde partnerdoorgiften; monitoring van syncfouten, ongeldige leads en verwijderverzoeken. Geen fictieve conversiedoelen zonder baseline.

## 6. Planning in productincrementen

**Gate 0 — beslissingen & infrastructuur:** bepaal verwerkingsverantwoordelijke en contactpunt, toegestane partnerbestemming(en), privacyverklaring, verwerkersafspraken, mail- en DB-capaciteit en opslaglocatie op Hostinger. Doe privacyrisicoanalyse, bepaal of DPIA vereist is. Geen wijzigingen in productie.

**Increment 1 — geverifieerde accounts:** beveiligde registratie/inlog, noodzakelijk sessiebeheer, `Mijn dossiers`-shell, account/export/delete, eerste e-mailtemplates. Registreer geen marketingtoestemming impliciet.

**Increment 2 — cross-device dossier:** strikt geserialiseerde/gevalideerde state, autosave, revisiebeheer, expliciete migratie van lokale gegevens en test op twee browsers. Geen automatische upload van lokale bestanden.

**Increment 3 — beveiligde bijlagen:** private opslag buiten webroot, gescheiden bestandsmetadata, versleuteling en veilige toegang, quota, integriteit, opschonen en hersteltest. **Eerst dan** de volledige claim `Je documenten blijven bewaard tussen sessies` in de UX.

**Increment 4 — vrijwillige leadintake:** gescheiden aanvraagformulier, consent/audit, contactverificatie, een interne lead inbox/kanban en optioneel partner-routing op concrete toestemming. Nooit dossierinhoud in CRM.

**Increment 5 — effectmeting & kwaliteit:** gecontroleerde funnels, beperkte serveraggregaten, privacyrechten, backups, incidentprocedures, beveiligingsreview, staged rollout, live acceptatie. Daarna SEO en marketing optimaliseren op echte data.

Bouw elk increment eerst op een non-prod omgeving. Laat nieuwe tabellen en endpoints fail-closed. Bestaande `main` en de gastflow mogen niet regressief worden.

## 7. Beslissingen voor eigenaar vóór activering

1. **Verwerkingsverantwoordelijke**: welke rechtspersoon/handelsnaam staat in privacy, accounts en alle commerciële contacten? SubsidieReady is een merk, geen automatisch vastgestelde rechtspersoon.
2. **Leadbestemming**: alleen een eigen organisatie, of ook onafhankelijk geselecteerde partnerinstallateurs? Als partners: wie, welke data en welke doelbinding.
3. **Hostingmogelijkheden**: PHP, SQL, private permanente opslag, backup/herstel en veilige transactionele e-mail; verifieer vooral dat private bestanden niet verdwijnen bij Git-deploy.
4. **Bewaartermijnvoorstel**: zolang actief, waarschuwing vóór automatische verwijdering na lange inactiviteit (bijvoorbeeld 12 maanden), plus verwijdering op verzoek, beperkte backup-retentie. Definitieve termijnen vastleggen na juridische/technische toets.
5. **Openstaande productkeuze**: krijgt de eerste release één dossier per account of meerdere? Vooruitbouwen op meerdere, maar visueel overzicht eenvoudig houden.

## 8. Bronnen voor juridische productgrenzen (te hercontroleren vóór release)

- AP — toestemming: https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming
- AP — marketing en account is niet automatisch klant: https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/direct-marketing
- ACM — spamberichten: https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/spam-voorkomen-uw-reclame
- ACM — gratis aanbod en persoonsgegevens: https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden
- AP — verwerkersovereenkomst: https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst
- AP — DPIA waar waarschijnlijk hoog risico: https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/europese-privacywetgeving/data-protection-impact-assessment-dpia
- Hostinger Git deployment: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

Dit is product- en engineeringplanning, geen definitief juridisch advies. Wijs verantwoordelijke toe voor privacy- en contractcontrole.
