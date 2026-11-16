# SubsidieReady — meetmodel, zoekstrategie en vertrouwensguardrails

**Status:** specificatie voor latere SEO-, growth-, privacy- en Portal-agents. **Geen opdracht om tracking actief te maken.** Meetbaarheid mag geen vrijbrief worden voor automatische profilering of marketing. Lees de [productstrategie](./PRODUCT-STRATEGY-2026-11-16.md).

## 1. Twee North Stars, geen schijnconversie

**Consumentenwaarde:** hoeveel bezoekers kunnen een zinvolle verduurzamingstaak daadwerkelijk afronden of later hervatten? Denk aan regelingencheck afgerond, checklist/PDF/ZIP lokaal gebruikt, relevante vervolgstap gekozen, eigen plan hervat en taak voltooid. Niet afleiden uit een klik alleen.

**Commerciële waarde:** hoeveel **unieke, vrijwillig ingediende en ontvangen** NIVO-adviesverzoeken zijn bereikbaar, vallen binnen het daadwerkelijk geleverde aanbod en leiden uiteindelijk tot een passende afspraak/offerte/verkoop? Niet iedere submission is bereikbaar of gekwalificeerd.

Beide zijn nodig. Optimaliseer nooit alleen contactformulieren terwijl consumentenvertrouwen of bereikbaarheid daalt.

## 2. Definities vóór eventimplementatie

| Naam | Strikte definitie | Wat telt niet mee |
| --- | --- | --- |
| GSC-impressie / klik | Werkelijke propertydata uit Google Search Console voor de juiste site, tijdzone, URL en datumrange | Zelf gesimuleerde zichtbaarheid of site-live-HTTP |
| Vrijwillige advies-CTA | Expliciete klik op herkenbare NIVO-adviesaanbieding, alleen meten waar toegestaan | Automatisch geopende modal of gerenderde kaart |
| Ingediende adviesaanvraag | Server heeft geldige versiegebonden aanvraag geaccepteerd en in versleutelde outbox geplaatst, uniek via `request_id` | Alleen formulieropenen, ongeldige POST, retry dezelfde sleutel |
| SMTP-geaccepteerd | De eigen worker kreeg een bewezen acceptatie van SMTP | Aanvraag in queue, beloofde inboxontvangst |
| Ontvangen in Portal | De NIVO-mailbox/Portal-parser heeft het bericht gezien, uniek op `request_id`, schema vastgesteld | SMTP-geaccepteerd of oude resend zonder uniek verzoek |
| Contacteerbaar | Contactkanaal blijkt daadwerkelijk bruikbaar, na aparte controle door bevoegde Portal-medewerker | `email_verified=false` dat als bewijs wordt gezien |
| Gekwalificeerd | Uniek, vrijwillig verzoek, passende NIVO-dienst/regio en echte opvolgmogelijkheid, met expliciete redenstatus | Accountregistratie, nieuwsbriefopt-in, ingeschatte koopkracht |
| Afspraak / offerte / gewonnen | Door Portal/CRM aantoonbaar geregistreerde uitkomst per uniek verzoek en periode | Klik/CRM-import als verkoopsucces |
| Accountactivatie | Gebruiker koos vrijwillig online registratie, login/planopslag geslaagd | Lead, marketingrecht, salesintentie |
| Accountwaarde | Gebruiker hervatte eigen plan of voltooide zinvolle taak | Automatische systeemsave zonder gebruikersactie |

Reken percentages altijd als **aantal unieke objecten met gebeurtenis / duidelijk benoemde passende cohortnoemer**. Leg datumrange, deduplicatiemethode, attributievenster en bron vast. Geen percentages publiceren waar het noemer-/consentmodel ontbreekt.

## 3. Privacy-/trackingregels

- Huidige publieke analytics staan standaard uit, GPC/DNT wordt gerespecteerd en de app kent een gescheiden expliciete opt-in. Dit blijft het uitgangspunt; juridisch oordeel voor nieuwe events is nodig.
- **Geen volledige URL-parameters met contact- of dossiergegevens**, geen advertentiepixels, geen session recording, geen raw IP, geen inkomen/BSN/lening/factuur-/subsidieresultaat of accountinhoud in webanalytics.
- De bestaande server mag strikt noodzakelijke abuse-/queue-/foutmonitoring doen volgens doelbinding, dataminimalisatie en bewaarbeleid; dit is **niet hetzelfde** als toestemming om gedrag marketinggericht te meten.
- Scheid anonieme/public site events, accountservice-operationele gegevens en Portal-verkoopregistratie. Niet op e-mail of persoons-ID aan elkaar joinen om verborgen commerciële profielen te bouwen.
- Test consent weigeren, intrekken, DNT/GPC en gastflow zonder netwerktracking; type-enumeratie, geen vrije velden of technische identificatoren in openbaar dashboards.
- Gebruik alleen geaggregeerde, niet-identificerende feedback uit de Portal voor content- en servicebesluiten. Geen individuele leadrecords in GitHub.

## 4. Zoekstrategie: nuttige inhoud, niet zoekvolume alleen

Werk met concrete, vraaggedreven clusters met officiële bronnen en tools:
1. **Warmtepomp/ISDE:** toestel en meldcode, bewijsstukken, stappen, aanvraagmoment en bijzondere gevallen.
2. **Isolatie/glas/ventilatie:** maatregel- en combinatievoorwaarden, oppervlak, bewijs, regionale uitzonderingen.
3. **Zonnepanelen en btw:** 0% voor relevante levering, feitelijk betaalde 21%, KOR, nieuwbouw en bijzondere bouwkundige constructies als subonderwerp, niet dubbele productcategorie.
4. **Thuisbatterij:** gebruik, btw-verplichtingen en praktische technische aandachtspunten; geen gegarandeerde teruggaaf/rendement.
5. **Financiering:** neutrale informatie over Warmtefonds, SVn en officiële uitvoerders; lening ≠ subsidie, geen inkomens- of kredietprofilering.
6. **Lokale regelingen:** alleen geverifieerde bronreikwijdte, budget/openstelling/aanvraagmoment; hiaten eerlijk markeren. Geen duizenden generieke gemeente-templates.

### Publicatiecontract per pagina

- Definieer een **échte zoekvraag** en het concrete probleem dat deze pagina oplost.
- Bevat unieke, heldere uitleg en wat de consument concreet kan doen; is geen duplicaat van een hoofdmenu-/productpagina.
- Primaire officiële bron + `checked_at`/reviewdatum, afwijkende `effective_from` als feitelijk bekend en juiste uitzonderingen. Bij verval is er een zichtbare review-/waarschuwingsroute.
- Verwijst eerst naar de relevante gratis tool of uitleg. Een optionele NIVO-servicekaart alleen waar product en bezoekintentie werkelijk aansluiten.
- Correct title/description/H1/canonical, interne links, schema waar passend, bestaand noindex/indexplan, goede mobiel/snelheid/toegankelijkheid.
- Geen automatische AI-publicatie zonder inhoudelijke review. Geen bronclaims uit toekomstige voorstellen als geldend recht.

### Search Console-beslissing

Eerst de eigen property en werkelijke site-metrics inspecteren; als toegang ontbreekt, markeer baseline **onbekend** en maak een concreet aansluit-/verificatiestap. GitHub-liveness, sitemapgeneratie en SEO-audit zijn geen bewijs van Google-indexering. Meet werkelijke prestatie over vergelijkbare perioden; markeer kleine steekproeven en vertragingen.

## 5. Servicekwaliteit, niet alleen marketing

- Een goed ingediende aanvraag is een **verzoek om hulp**. Portal meet eerste reactie, contact via gewenst kanaal, bruikbaar advies, afspraak en afmelding/klacht. Verkoop is een uitkomst, geen vereiste voor een geslaagde informatiehulp.
- Oriënterende bezoekers mogen zonder druk oriënteren; installatieklare bezoekers kunnen gerichter een passende technische beoordeling aanvragen.
- Formulierkwaliteit toetst **bereikbaarheid, passend aanbod, privacy en gebruiksgemak**. Meer NAW kan soms helpen, soms onnodige drempel vormen; wijzig het huidige formulier alleen na aparte validatie/eigenaarbesluit.
- Eerlijke negatieve uitkomsten (bijv. "geen passende NIVO-dienst" of "officiële instantie nodig") beschermen de productreputatie.
- Geen per-verkoper conversiedoelen formuleren die aanzetten tot ongevraagde belacties, spam of sturen van de subsidie-uitkomst.

## 6. Minimale dashboardstructuur (later, privacyreview nodig)

**Tab Consument:** Search Console-organisch bereik, toegestane nuttige taakgebeurtenissen, account-/planvoortgang als goed geaggregeerde servicecijfers, toegankelijkheid/foutpercentages.

**Tab Aanvragen:** gescheiden auditbare totalen voor queue, SMTP, ontvangen Portal, uniek contacteerbaar, gekwalificeerd, eerste contact, afspraak, offerte/verkoop. Maak aantallen en de periode duidelijk; geen dossiers in export.

**Tab Kwaliteit/risico:** bronherzieningen, gevonden fouten/klachten, opt-out/intrekking, bounce/spam, niet-gekwalificeerde aanvragen, privacy-/toegankelijkheidsregressie.

Nog **geen** ontwerp/implementatie van dit dashboard in deze documentatiefase. Data en operatorrechten zijn nog niet aangetoond.

## 7. Experimenten: wanneer wel, wanneer niet?

Eerst stabiele baselines en servicecapaciteit. Experimenteer vervolgens één hypothese per keer, zoals copy die de concrete hulp benoemt versus de algemene CTA. Meet niet alleen klikratio maar **gekwalificeerde** Portal-ontvangsten en consumentenklachten. Vermijd dark patterns en invasieve tracking. Zonder voldoende volume en kwalitatieve data geen significante uplift claimen.

**Releaseblokkades:** ontbreken van toestemming voor niet-noodzakelijke events; geen betrouwbare broncontrole; verborgen profiel-naar-salesjoin; NIVO biedt de beloofde dienst niet; geen plan bij incident/retentie; onvolledige resultaten als zeker presenteren.
