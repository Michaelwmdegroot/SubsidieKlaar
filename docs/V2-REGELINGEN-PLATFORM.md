> **Update:** de eigenaar heeft na beoordeling expliciet publicatie en integratie in de bestaande site geautoriseerd. Zie `REGELINGEN-LIVE-INTEGRATION.md`. De hieronder beschreven oorspronkelijke status als lokaal prototype is historisch; inhoudelijke grenzen blijven gelden.

# SubsidieReady 2.0 — platform voor verduurzamingsregelingen

**Eigenaarbesluit 14 november 2026:** de volgende versie wordt breder dan een warmtepomp-documentenplanner: één startpunt voor verduurzamingssubsidies, btw-regelingen, belastingteruggaaf waar toepasselijk en financiering, waaronder Nationaal Warmtefonds. Het eigen leadmodel uit ontwerp-PR #11 blijft gelden. Geen externe leadverkoop.

**Status van deze oplevering:** brononderzoek, platformontwerp en een werkend lokaal routeverkenner-prototype. Geen nieuwe live pagina, accountdienst, leningaanvraag, belastingaangifte of gegevensverzameling geactiveerd. Productie op main (basis 19f34e3) blijft ongewijzigd. De warmtepompwerkbank blijft een bestaande gespecialiseerde module, niet het datamodel voor alle toekomstige maatregelen.

## 1. Productbelofte en afbakening

Positionering: **Vind de regelingen voor jouw verduurzaming. Zie wat je moet doen. Bewaar je plan.**

Vier functies: ontdekken -> voorwaarden begrijpen -> acties/documenten voorbereiden -> voortgang volgen. De website moet bezoekers zowel vóór aankoop als na installatie helpen. 'One-stop-shop' betekent één duidelijk vertrekpunt en samenhangend plan, niet dat SubsidieReady alle beslissingen neemt, alle aanvragen indient of nu al alle gemeenten afdekt.

De volgende publieke introductie gebruikt drie duidelijke categorieën:
- **Subsidie:** mogelijke financiële bijdrage, afhankelijk van regeling en beschikking.
- **Btw/fiscaal:** een tarief, aftrek of teruggaaf met eigen voorwaarden en soms doorlopende verplichtingen.
- **Financiering:** een lening die wordt terugbetaald, ook als de rente 0% is.

Geen gezamenlijk bedrag 'jouw subsidie' waarin een lening wordt opgeteld. Geen teruggaaf van btw die op de betreffende factuurregel niet betaald is. Een offerte met 0% btw krijgt niet nogmaals een fictieve 21%-korting. Bij een prijs inclusief 21% is de btw-component 21/121, niet 21% van het brutobedrag; toekomstige calculators moeten dit expliciet testen.

Gratis kern en PDF/ZIP van de bestaande werkbank blijven zonder account/e-mailadres werken. Accounts zijn optioneel en alleen voor aangevraagde online bewaring. SubsidieReady geeft geen RVO-, Belastingdienst- of kredietgoedkeuring en vraagt geen DigiD-wachtwoord.

## 2. Inhoudspijlers en volwassenheid

| Pijler | Eerste inhoud | Gereedheid in deze stap |
| --- | --- | --- |
| ISDE | Warmtepomp, isolatie/glas, ventilatie, verwijzingen naar zonneboiler/warmtenet/koken | Warmtepomp heeft bestaande werkbank; overige alleen bronroutes, nog geen complete dossiercheck |
| Zonnepanelen | 0%-tarief versus werkelijk betaalde 21%-btw; KOR en teruglevering | Informatieroutes met expliciet onderscheid, geen automatische aangifte |
| PV-constructies | Per onderdeel onderscheid panelen, montagemateriaal, dragende/bouwkundige delen en overige werkzaamheden | Altijd fiscale beoordeling bij bijzondere constructies; geen generieke 0%-belofte |
| Thuisbatterij | Btw-teruggaaf bij belast gebruik en verplichtingen, afzonderlijke financieringsinformatie | Voorwaarden en beperkingen, geen automatische 21%-korting |
| Isolatie-btw | Passende arbeid 9% bij woning ouder dan twee jaar, materialen 21% | Informatieroute, geen herlabeling hele verbouwing |
| Nationaal Warmtefonds | Algemene informatie Energiebespaarlening, mogelijke 0%-rente en verwijzing naar uitvoerder | Geen inkomensprofiel, kredietadvies, bemiddeling of aanvraag |
| Gemeentelijk/provinciaal | Lokale subsidies, SVn-verwijzing, Maatregel 29 | Dekking uitdrukkelijk onvolledig, geen postcodeclaim zonder bron |
| Andere aanvragers | VvE/SVVE en zakelijke verwijzingen zoals EIA | Afzonderlijke ingang; geen particuliere ISDE-logica hergebruiken als beslisser |

Een landelijke catalogus komt vóór automatische gemeentelijke volledigheidsclaims. Huurders, verhuurders, monumenten en zakelijke/VvE-situaties krijgen eigen routes met eigen voorwaarden. We vullen die niet stilzwijgend in met regels voor eigenaar-bewoners.

## 3. Gecontroleerde feitelijke uitgangspunten

Bronnen geraadpleegd op **14 november 2026**. Dit is geen realtime feed. URLs in sectie 10 zijn de primaire bronnen.

### PV-btw en '0% PV-constructie'

Belastingdienst beschrijft 0% voor de levering en installatie van zonnepanelen op of bij een woning, met direct noodzakelijke onderdelen. De bron sluit onder andere dakversteviging, vervanging van de gehele groepenkast, warmtepompen en thuisbatterijen uit van het nultarief. Geïntegreerde panelen die worden geleverd met een nieuwbouwwoning vragen een andere beoordeling dan alleen afzonderlijke levering/installatie van de panelen.

Een volledige carport/overkapping is in dit onderzoek niet als algemene 0%-regeling vastgesteld. Daarom geen stellige uitkomst op basis van de naam 'PV-constructie'. De toekomstige controle vraagt een gespecificeerde offerte, functie en samenhang van onderdelen en verwijst complexe gevallen voor fiscale beoordeling. Ook 'financiële constructie' of leverancierspakket is op zichzelf geen grondslag voor 0%.

De afzonderlijke teruggaafroute geldt bij daadwerkelijk betaalde btw en de daarvoor geldende voorwaarden. Factuur- en contractnaam, teruglevering, KOR, factuurdatum en ingebruikname kunnen van belang zijn. Geen automatische afmelding van de KOR en geen garantie van volledige teruggaaf.

### ISDE en combinatievoordeel

Ventilatie in de 2026-route vraagt een combinatie met isolatie. Ventilatie alleen verdubbelt de isolatiesubsidie niet. 'Twee maatregelen' mag daarom geen universele verdubbelregel worden. Groningen en de Noord-Drentse gemeenten Aa en Hunze, Noordenveld en Tynaarlo vragen aandacht voor Maatregel 29; een standaard landelijke isolatieroute kan daar onjuist zijn.

RVO duidt de 2027-aanpassingen op de geraadpleegde pagina nog als voorgenomen aan. Sla voorstellen apart op; pas ze niet toe als definitieve rechten. Per maatregel zijn opdracht-, aankoop-, installatie-, betaal- en aanvraagdatum afzonderlijke velden. Eén globale projectdatum is onvoldoende voor de productie-beslisregels.

### Thuisbatterij en Warmtefonds

De Belastingdienst koppelt batterijteruggaaf aan belast gebruik voor stroomhandel en noemt onder meer een EMS, dynamisch contract, de namen op documenten en KOR-status bij aankoop. Privégebruik kan btw-correcties meebrengen; er zijn aangifteplichten. Alleen privégebruik levert via deze route geen btw-teruggaaf op.

Nationaal Warmtefonds is financiering, geen subsidie. De officiële 0%-route vermeldt eigenaar-bewoners van bestaande woningen met gezamenlijk verzamelinkomen **lager dan € 60.000**, plus de overige leenvoorwaarden. De aanbieder beslist. Voor zonnepanelen en batterijen bestaan afzonderlijke maatregelvoorwaarden; er wordt geen algemene toezegging 'alles wordt gefinancierd' gedaan. Het prototype gebruikt geen leenbedrag of maandlastenberekening.

## 4. Nieuwe gebruikersreis

**Regelingencheck:** aanvragertype -> maatregel(en) -> woning/locatie -> voortgang -> relevante datums -> routeoverzicht. Vraag vervolginformatie pas wanneer nodig. Maak 'weet ik niet' een geldige uitkomst, nooit een impliciete 'ja'.

**Resultaat per route:** type voordeel, waarom getoond, ontbrekende controles, toepasselijke bronversie, vraagmoment, vervolgstap, welke module werkelijk werkt en wat nog alleen informatie is. Gebruik 'voorwaardelijk', 'aanvullen', 'andere route' en 'broncontrole nodig', niet 'goedgekeurd'.

**Plan:** één woning/project kan meerdere maatregelen hebben. Een maatregel kan meerdere routes hebben, bijvoorbeeld isolatiesubsidie én een btw-tarief op arbeid. Financiering staat financieel apart. Een checklist gaat over de betreffende regeling, niet over generiek 'subsidie klaar'.

**Voorbeeld:** eigenaar overweegt isolatie, zonnepanelen en een batterij. Het overzicht groepeert: isolatievoorwaarden; PV-tarief/evt betaalde btw; batterij-btw inclusief verplichtingen; afzonderlijke algemene financieringsinformatie. Geen gratis subsidie voor zonnepanelen suggereren, geen dubbele btw-teruggaaf, geen lening aftrekken van de investering.

**Navigatievoorstel:** Regelingencheck | Subsidies | Btw & belasting | Financiering | Kennisbank | Mijn plan. De warmtepompwerkbank blijft bereikbaar. Bestaande SEO-URLs behouden of met gecontroleerde redirects migreren.

## 5. Architectuur: inhoud als versieerbare gegevens

Beoogd productiemodel (niet allemaal geïmplementeerd):

```text
Account (optioneel)
  -> Woning / verduurzamingsproject
      -> Maatregelen (soort, voortgang, eigen relevante datums)
          -> Regelingbeoordelingen (rule_id + versie + antwoorden + redenen)
              -> Aanvraagcase / btw-case / informatieroute
                  -> Taken, documentverwijzingen, deadlines, gebruikerstatus
```

Regelingcatalogus: stabiel ID, type (`subsidy`, `vat_rate`, `vat_refund`, `tax_deduction`, `loan`), doelgroepen, maatregeltypen, geografische dekking, noodzakelijke feiten, uitzonderingen, ingangs-/einddata uit de regeling, aanvraagmoment, combinatieregels, benodigde documenten, bron-URL, geraadpleegd-op, reviewdeadline, reviewer en publicatiestatus. Onbekende geldigheidsdatum blijft onbekend; `checked_at` is niet `effective_from`.

Beoordelingen moeten de gebruikte regelversie bewaren. Wijzigingen in voorwaarden maken bestaande dossiers niet ongemerkt anders; toon 'opnieuw controleren'. Bedragen rekenen we pas wanneer de invoer en de regels voldoende compleet zijn. Aftrek/lening/subsidie onderscheiden in type, berekening en presentatie. Maak echte toepasselijkheidstests met officiële bronverwijzingen, niet alleen screenshot-tests.

AI mag later helpen bij zoeken/uitleg of het signaleren van bronwijzigingen, maar bepaalt niet op eigen gezag subsidie- of belastingrechten. Bronwijziging -> redactionele controle -> tests -> nieuwe regelversie -> publicatie. Geen autonome productie-updates van fiscale tekst.

Lokale catalogus gebruikt formele gemeente-/provincie-identiteit; geen giswerk op basis van alleen postcodeprefix. Toon `verified`, `not_reviewed`, `closed` of `unknown` en bron-/budgetdatum. Geen resultaat betekent bij beperkte dekking 'nog niet gecontroleerd', niet 'u krijgt niets'.

## 6. Accounts, privacy en eigen sales

Het accountplan in PR #11 wordt hiermee **multi-maatregel**, niet een tabel met uitsluitend warmtepompvelden. Pas issues #6-#8 hierop aan vóór uitvoering. Houd bestaande project-JSON compatibel; importeert een gebruiker het oude dossier, maak dan een warmtepompmaatregel binnen het nieuwe project.

In de eerste verkenner geen naam, e-mail, exact adres, inkomen, rekeningnummer, BSN, BKR, identiteitsdocument of upload. KOR-/gebruikskeuzes blijven in de lokale pagina, niet in analytics of CRM. Het prototype schrijft ook niet naar browseropslag.

Bij echte accounts: afzonderlijke keuze voor online bewaren, per-object autorisatie, revisiecontrole/autosave, beschermde bijlagen, dataminimalisatie en bewaartermijnen uit het eerdere beveiligingsplan. De financieringsomgeving wordt niet stilzwijgend een opslagplaats voor loonstroken, belastingaangiften of inkomensbewijzen. Eventuele toekomstige verwerking hiervan vereist apart juridisch en beveiligingsontwerp.

**Eigen leads blijven apart:** een bezoeker kan zelf installatieadvies vragen aan de concreet genoemde eigen onderneming. Geef uitsluitend de expliciet daarvoor verstrekte gegevens door. Geen subsidiebedragen, KOR-status, inkomenscategorie, financieringsbehoefte, dossierinhoud of afgeleide koopkracht in verkoopprofielen. Geen andere ranking van overheidsregelingen omdat een eigen bedrijf een maatregel verkoopt. Ook regelingen zonder commerciële opbrengst blijven zichtbaar waar passend.

Financieringsinformatie en installatieadvies krijgen verschillende knoppen. In fase 1 gaat de consument rechtstreeks naar de uitvoerder voor financiering, zonder persoonlijke data in URL of doorgifte. Geen commissie-/leadroute voor leningaanvragen. Hetzelfde bedrijfseigendom is geen uitzondering op privacy- of financiële wetgeving.

## 7. Financiële dienstverlening: expliciete go/no-go

De AFM beschrijft zowel adviseren (een specifieke productaanbeveling aan een klant) als bemiddelen ruim. Ook gegevens doorgeven voor een financieel product kan daaronder vallen. Een disclaimer alleen maakt een feitelijke bemiddelingsdienst niet ongereguleerd.

**Fase 1:** algemene uitleg, neutrale bronverwijzingen en het onderscheid lening/subsidie. Geen kredietselectie op inkomen, 'beste lening', kredietwaardigheidstoets, vooraf ingevulde aanvraag, documenten doorsturen of lening afsluiten namens de gebruiker. Geen aanname dat een vrijstelling geldt omdat de dienst gratis is.

**Vóór uitbreiding:** kwalificeer de feitelijke dienstverlening en toets vergunning/vrijstelling en regels voor kredietreclame met passende expertise en zo nodig AFM. Bepaal rollen en contracten. Pas daarna eventueel extra functionaliteit. Dit is een productgrens, geen oordeel dat elke mogelijke financieringsfunctie altijd verboden is.

## 8. Bouwvolgorde en concrete opleveringen

### Release A — centrale ingang en broncatalogus (nu gestart)
- Twaalf informatieroutes plus aparte verwijzingen voor andere aanvragers.
- Pure selectielogica met sanitization, onzekere antwoorden, jaar-/bronwaarschuwingen en expliciet geen geldsom of toekenningsclaim.
- Zelfstandige responsive ontwikkelpreview; geen nieuwe publicatie op main.
- Volgende stap: inhoudelijke review en gecontroleerde integratie als `/regelingen/`, navigatie/hero aanpassen en bronpagina uitbreiden; normale CSP en noindex/SEO keuzes per omgeving.

### Release B — verdiepende consumentenmodules
- Eerst isolatie/glas met juiste combinaties, oppervlakken, datums en regionale uitzondering.
- PV 0% versus betaalde 21% en een afzonderlijke offerte-regelcontrole voor PV-constructies; complexe gevallen nooit automatisch goedkeuren.
- Batterij-btw als voorwaarden-/verplichtingencheck, geen besparingsgarantie.
- Warmtefonds/SVn informatiepagina's en 'zelf aanvragen bij uitvoerder'; geen inkomens- of kredietadviesmodule zonder gate uit sectie 7.
- Maak per module eigen QA-gevallen, bronversie en hulpteksten. Laat bezoekers zien welke checklists echt klaar zijn.

### Release C — persoonlijk verduurzamingsplan
- Leg eerst multi-maatregelmodel vast; daarna optionele accounts, import van oud warmtepompdossier, autosave en server-side ownership checks.
- Nieuwe metadata- en documenttypen per regeling, niet één uniforme 'compleet'-vlag.
- Geen automatische publicatie van accounts/uploads totdat P0 exploitant/hosting/mail/retentie/backup uit issue #5 rond is.

### Release D — lokale dekking en andere doelgroepen
- Bouw een gecontroleerd gemeenteregister en redactieproces. Registreer dekkingsgaten en wijzigingen in openstellingen/budgetten.
- SVVE/VvE, verhuurders/SVOH en zakelijke EIA/MIA/Vamil later als eigen productlijnen. Alleen geverifieerde modules rekenen; overige tonen officiële verwijzingen.
- Voeg dienstverlening namens gebruikers pas toe na afzonderlijke machtigings-, aansprakelijkheids- en eventuele vergunningstoets. Geen DigiD-inloggegevens verzamelen.

### Release E — eigen verkoop op verzoek
- Eerdere afspraak blijft: uitsluitend eigen bedrijven/verkooporganisatie, genoemd per concrete aanvraag; geen leadmarktplaats.
- Commerciële CTA pas na nuttig resultaat, secundair aan gratis informatie/export.
- Meet geverifieerde vrijwillige installatievragen, niet accounts, regelingenkliks of lenen als verkooptoestemming. Financiële kwetsbaarheid nooit een salesfilter.

## 9. Verificatie van deze oplevering

Lokaal op de herstelde main-broncode: build en package geslaagd; **77 tests pass, 0 fail, 0 skip** (57 bestaande + 20 nieuwe). Nieuwe tests bewaken onder meer PV0/21, KOR, privégebruik batterij, PV-constructie, ventilatiecombinatie, regio, andere aanvragers, bronverval/2027, invoerbegrenzing en ontbreken van privédata/netwerkaanroepen.

De echte gegenereerde HTML is in lokaal Chromium bekeken op 1440/1024/768/390/360/320 px, telkens invoer en resultaat (12 combinaties), zonder horizontale overflow. Voorbeeld, JSON-download, reset van oude resultaten na gewijzigde invoer, 2027-waarschuwing en VvE-route getest; geen page errors of netwerkverzoeken. Geen Safari-/telefoon- of live-domeinverklaring.

```sh
node scripts/build-regelingen-preview.cjs
# Resultaat standaard in qa/SubsidieReady-Regelingencheck-preview.html (niet publiceren)
npm run build
npm test
npm run package
```

Geen productiecode aangepast, geen inkomens- of documentuploads en geen lead-/mailflow geactiveerd. Een succesvolle codecheck vervangt geen fiscale/financieel-juridische review.

## 10. Bronregister

Allemaal geraadpleegd op 2026-11-14; prototype vraagt hercontrole uiterlijk 2026-12-14. Die reviewdeadline is een interne onderhoudskeuze, geen juridische vervaldatum.

- RVO ISDE overzicht: https://www.rvo.nl/subsidies-financiering/isde
- RVO warmtepomp: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp
- RVO isolatie: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen
- RVO ventilatie: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie
- RVO Maatregel 29: https://www.rvo.nl/onderwerpen/maatregel-29
- SNN Isolatie Nij Begun: https://www.snn.nl/subsidies-voor-particulieren/subsidie-isolatie-nij-begun
- RVO voorgenomen 2027-wijzigingen: https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027
- Belastingdienst PV-tarief: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen
- Belastingdienst PV 0%: https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-nultarief
- Belastingdienst PV 21%: https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21
- Belastingdienst batterij: https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw
- Belastingdienst isolatie-btw: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/diensten_9_btw/werkzaamheden_aan_woningen/isoleren_van_woningen
- Warmtefonds algemeen: https://www.warmtefonds.nl/particulieren
- Warmtefonds 0%: https://www.warmtefonds.nl/particulieren/energiebespaarlening-nul-procent
- Warmtefonds batterij: https://www.warmtefonds.nl/particulieren/energiebesparende-maatregelen/thuisbatterij
- Warmtefonds zonnepanelen: https://www.warmtefonds.nl/particulieren/energiebesparende-maatregelen/zonnepanelen
- SVn: https://www.svn.nl/duurzaamheidslening
- RVO SVVE: https://www.rvo.nl/subsidies-financiering/svve
- RVO EIA: https://www.rvo.nl/onderwerpen/eia
- AFM adviseren/bemiddelen: https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/vergunning-nodig/het-verschil-tussen-adviseren-en-bemiddelen

De SVOH-overzichtspagina kon tijdens deze beurt niet rechtstreeks worden opgehaald (timeout). Daarom geen nieuwe SVOH-rekenregels of volledige voorwaarden in het prototype; alleen een toekomstige afzonderlijke productroute in deze planning.
