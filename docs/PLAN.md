# Van concept naar een zelfstandige tool

Status: **Planning / werkend concept**, 13 november 2026. Idee gekozen: ISDE-documentenwerkbank. Repository: `Michaelwmdegroot/SubsidieKlaar`, branch `main`.

## Productkeuze

De gratis gebruiker moet een individuele documentencheck kunnen doorlopen en het bruikbare resultaat kunnen downloaden zonder account of betaling. Professionele herhaling, samenwerking en historie kunnen later extra waarde bieden. Een ontbrekende meldcode, foto of ongebruikelijke situatie mag niet zonder de juiste nuance tot een fictieve subsidieafwijzing leiden.

Eerste doelgroep: eigenaar-bewoners met een warmtepomp in een gewone bestaande woning. De tool organiseert bewijs, controleert aanwezigheid en maakt de volgende stap duidelijk. Subsidiebedragen, indiening met DigiD en volledige juridische/toesteltechnische beoordeling behoren niet tot het concept.

## 1. Concept beoordelen

Beoordeel de startpagina, de vier stappen, de fictieve voorbeeldflow, echte PDF/ZIP-uitvoer en backofficeweergave. Kies de definitieve naam uit een opnieuw te controleren .nl-shortlist. Er is nog geen domein geregistreerd of DNS gewijzigd.

Verificatie van het concept:

- Regellogica: schrikkeldag, 24 kalendermaanden, planning, 2027, andere routes, meldcode-alternatief, betalingen en bevestigingen.
- Uitvoer: leesbare PDF, veilige ZIP-paden, ongewijzigde originele bytes, volledige Unicode-HTML-uitvoer en ontsnapte HTML-invoer.
- Bediening: echte downloads, mobiele invoer en herstel na wijzigen van eerder bevestigde gegevens.
- Privacy: geen uploadendpoint, geen externe analytics, lokaal bewaren uitsluitend op keuze.

## 2. Productie op Hostinger

Selecteer een passend bestaand of gekozen Hostinger-plan en controleer ondersteuning voor custom HTML/PHP en GitHub-deploy vanaf `main`. Configureer het definitieve domein, HTTPS, redirects en documentroot. Verifieer één deployment plus een terugzetmogelijkheid.

Voor de serverfuncties is de voorkeur een kleine zelf beheerde backoffice op PHP met de database die het hostingplan ondersteunt. Geen verplichte SaaS-abonnementen. Maak pas een definitieve stackkeuze na die plancontrole.

Beveiliging en beheer:

- Centrale login met correct wachtwoordbeheer, sessiebeveiliging, CSRF-bescherming en begrensde beheerrechten.
- Geen publiek toegankelijke beheerdata. Applicatielogboeken bevatten geen documentinhoud.
- Geautomatiseerde back-ups, foutrapportage, bewaartermijnen en een hersteltest.
- Documenten lokaal verwerken zolang serveropslag niet nodig is. Gedeelde professionele dossiers vragen een afzonderlijk opslag- en toegangsontwerp.
- Beveiligde, afgebakende API voor ondersteunde ChatGPT-beheerfuncties; eerst leesfuncties, daarna doelgerichte wijzigingen met auditlog.

## 3. Volledige gratis versie testen

Test met geanonimiseerde echte warmtepompdossiers, waaronder meerdere betalingen, geen meldcode, een betaalde winkelfactuur, onvolledige documenten en een overgangssituatie. Gebruik uitsluitend pilotdossiers die hiervoor met passende toestemming beschikbaar worden gesteld.

Overweeg browserlokale tekstextractie uit leesbare PDF's, altijd met bevestiging van de gebruiker. Scan-OCR mag geen verplichte betaalde API worden en onzekere extracties mogen niet worden ingevuld alsof ze zeker zijn.

Gebruik versiebeheer voor regels, broncontrole en ondersteunde installatiedata. Een geautomatiseerde bronwijzigingsmelding vervangt geen inhoudelijke beoordeling.

## 4. SEO en centrale meting

Begin met de tool en enkele nuttige pagina's voor concrete taken: ISDE-factuureisen, benodigd betaalbewijs, meldcode zoeken, ontbrekende installatiegegevens en dossier voorbereiden. Houd bron- en wijzigingsdatums zichtbaar. Indexeer geen persoonlijke resultaten, bijlagen of beheerpagina's.

Na de definitieve naam: metadata, canonicals, sitemap, robots, nette mobiele prestaties en Search Console. De noindex-blokkade gaat pas weg wanneer de publieke versie inhoudelijk en technisch klaar is.

Meet paginaweergaven, gestarte checks, uitval per stap, voltooide overzichten, downloads en technische fouten. Scheid sessies, gebeurtenissen en bezoekers; presenteer browserlokale tellingen niet als landelijke bezoekersstatistieken. Stel privacy en bewaartermijnen vast voordat centrale meting actief wordt.

## 5. Monetisatieplan

Na een werkende gratis kern: onderzoek installerprofielen, herbruikbare toestellen, klantdossiers, merkuitvoer, teams en een overdrachtslink. Betaalde functies moeten professionele herhaling gemakkelijker maken. Houd de individuele complete download gratis.

Advertenties, sponsoring en eventuele verwijzingen volgen pas na beoordeling van gebruik, onafhankelijkheid en gebruikerservaring. Prijzen uit de onderzoeksfase zijn hypotheses, geen gevalideerde omzetverwachting. De eigenaar beoordeelt eerst het monetisatieplan.

## 6. Marketingplan en automatisering

Daarna pas het uitgewerkte marketingplan: behulpzame demonstraties, vraaggestuurde informatie, installateurs als distributiekanaal en sociale content die naar een werkende taak leidt. Geen betaalde marketingsoftware als noodzakelijke afhankelijkheid.

Plan automatische contentvoorbereiding en een beheerde publicatiewachtrij; koppel publicatie alleen via daadwerkelijk beschikbare gratis API's met passende toestemming. Accounttoegang en platformvoorwaarden moeten per verbinding worden bevestigd. Er is in dit concept geen marketingactie, automatische e-mail of socialepublicatie gestart.
