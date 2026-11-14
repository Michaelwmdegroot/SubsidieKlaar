# SEO-contentstrategie — SubsidieReady

**Onderzoek en redactionele broncontrole:** 14 november 2026 (Europe/Amsterdam).

**Scope:** inhoud voor de eerste SEO-ontwikkelbranch, vanaf main `30be4c0e6bda6c5cdd1a550fb611d71740d3d99f`.

**Geen omzet-, bezoekers-, zoekvolume- of rankingclaims.** De prioriteit hieronder volgt uit de bestaande productfuncties, herkenbare consumentenvragen en controleerbare officiële bronnen. Zoekvraag en prestaties moeten later met echte Search Console-gegevens worden getoetst.

## 1. Eerste inhoudelijke beslissing

De vier aanvullende hulpartikelen op main zijn korte voorbereidingspagina's met `noindex,nofollow`, proefrelease-opmaak en een CTA naar Mijn plan. Alleen deze tag verwijderen levert nog geen zelfstandige kennisbank op.

Deze branch bereidt twee bestaande URL's voor als volwaardige openbare uitleg:

| Bestaande URL | Besluit | Waarde voor de lezer |
| --- | --- | --- |
| `/hulp/zonnepanelen-btw/` | Uitbreiden; indexeerbaar maken bij gecontroleerde integratie | Herkennen of de vraag over het tarief op de factuur of aftrek gaat; een gemengde offerte lezen; een concrete vraag voor leverancier of deskundige voorbereiden. |
| `/hulp/thuisbatterij-btw/` | Uitbreiden; indexeerbaar maken bij gecontroleerde integratie | Voorwaarden en vervolgverplichtingen naast de aankoopbeslissing zetten; een prijs na veronderstelde teruggaaf kunnen beoordelen. |
| `/hulp/isolatie-checklist/` | In deze tranche noindex behouden | Eerst uitwerken tot praktische documentengids met maatregel-, glas-, regio- en jaarspecifieke bronnen. |
| `/hulp/lokale-regelingen/` | In deze tranche noindex behouden | Eerst uitwerken tot nuttige zoek-/controlehulp met uitgewerkte officiële voorbeelden; geen gemeenteregister of volledige dekking suggereren. |

De twee uitgebreide artikelen staan als brondata in `scripts/seo-articles.cjs`. Ze gebruiken de bestaande URL's en huisstijl. Ze sturen als primaire volgende stap naar de gratis regelingencheck. Er is geen betaald aanbod, accountvereiste, automatische fiscale handeling of actief adviesformulier toegevoegd.

**Redactionele status:** primaire bronnen geraadpleegd en claims afgebakend; geen onafhankelijke fiscale of juridische goedkeuring. De teksten formuleren algemene informatie en verwijzen individuele beoordelingen naar de bevoegde bron of deskundige. De code wijzigt geen eligibility-engine, bedragenregeling of fiscale registratie. Publicatie en technische indexeringsgates worden in de PR apart beoordeeld.

## 2. Informatiearchitectuur en volgorde

| Prioriteit | Pijler / taak | Bestemming | Volgende stap voor de consument | Publicatie-eis |
| --- | --- | --- | --- | --- |
| Nu | Zonnepanelen: factuur met 0%, 21% of een combinatie | Bestaand hulpartikel + `/btw/` | Factuurroute herkennen; de officiële route openen | Bronverwijzingen per onderdeel, geen generieke teruggaafclaim |
| Nu | Thuisbatterij: btw en verplichtingen | Bestaand hulpartikel + `/btw/` | Vragen over aanschaf en administratie voorbereiden | KOR en vervolgverplichtingen zichtbaar; geen gegarandeerde korting |
| Vervolgens | ISDE-warmtepomp: van installatie naar dossier | `/subsidies/` + bestaande factuur-, betaalbewijs- en meldcodeartikelen | Bestaande gratis documentenwerkbank | Check presence versus recht op subsidie blijven onderscheiden; overgangsjaren controleren |
| Vervolgens | Isolatie en glas: bewijs tijdens uitvoering | Uitgebreide `/hulp/isolatie-checklist/` | Met uitvoerder afspreken welke gegevens worden vastgelegd | Actuele RVO-voorwaarden per maatregel; relevante regionale route; concrete fotohulp |
| Vervolgens | Ventilatie met isolatie | Afzonderlijk, gericht hulpartikel na uitwerking | Officiële combinatievoorwaarden bekijken | Niet samenvatten als universeel ‘twee maatregelen = dubbel’ |
| Vervolgens | PV-constructies: offerte per onderdeel | Eerst sectie binnen PV-artikel, daarna alleen een eigen pagina bij extra waarde | Gespecificeerde offerte opvragen | Geen 0%-claim voor een volledig bouwproject |
| Vervolgens | Warmtefonds: proces en begrippen | Uitbreiden `/financiering/`; pas later eigen procesartikel | Rechtstreeks bij de aanbieder voorwaarden en aanvraag bekijken | Algemene informatie; geen persoonlijk kredietadvies, documentenoverdracht of inkomensprofiel |
| Later | Lokale regelingen vinden en controleren | Uitgebreide bestaande lokale uitleg, daarna beperkte gecontroleerde catalogus | Regeling bij gemeente/provincie/uitvoerder controleren | Per regeling bron, regio, openstelling, budgetstatus en laatst gecontroleerd; onbekend blijft onbekend |

Gebruik per taak één duidelijke hoofd-URL. Maak geen jaarlijkse kopieën van dezelfde uitleg en geen duizenden plaatsnamenpagina's. Houd artikelen actueel op dezelfde URL; nieuwe jaren of bijzondere situaties krijgen een eigen bronbeoordeling. Een aparte nieuwe pagina is alleen zinvol als zij een andere vraag substantieel beantwoordt.

### Interne links

- De kennisbank toont de nieuwe artikeltitels en benoemt het onderwerp zonder proefrelease-belofte.
- `/btw/` linkt bij de passende PV- en batterijroute naar de verdiepende uitleg.
- Elk artikel linkt naar de centrale gratis regelingencheck, de bovenliggende btw-pijler waar passend en één inhoudelijk aansluitend artikel.
- De officiële bronlinks blijven zichtbaar in de inhoud. Geen vereiste om eerst een aanvraag of account te maken.
- Een toekomstige commerciële CTA komt alleen bij passende installatievragen en nadat ontvanger, exploitant en bestaande intake zijn goedgekeurd. Deze artikelen activeren die CTA niet.

## 3. Opnieuw geraadpleegde primaire bronnen

Alle onderstaande pagina's zijn tijdens deze ronde opgehaald via publieke webresearch. `2026-11-14` is onze raadpleegdatum, niet de ingangsdatum van een wet of de officiële publicatiedatum. Geen pagina wordt als realtime feed gepresenteerd.

| Bron | Rol in onderzoek / tekst | Bronversie indien zichtbaar |
| --- | --- | --- |
| [Belastingdienst: btw-tarief zonnepanelen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen) | PV-artikel: tarief, losse onderdelen en nieuwbouwonderscheid | Geen zichtbare wijzigingsdatum overgenomen |
| [Belastingdienst: zonnepanelen met 0% btw](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-nultarief) | PV-artikel: vervolgstappen na aanschaf tegen nultarief | Geen zichtbare wijzigingsdatum overgenomen |
| [Belastingdienst: zonnepanelen met 21% btw](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21) | PV-artikel: betaalde btw en officiële teruggaafroute | Geen zichtbare wijzigingsdatum overgenomen |
| [Belastingdienst: thuisbatterij en btw](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw) | Batterij-artikel: voorwaarden en aangifte-/gebruikskant | Geen zichtbare wijzigingsdatum overgenomen |
| [Belastingdienst: afmelden KOR](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/afmelden-kor) | Batterij-artikel: bewuste keuze en proces | Geen zichtbare wijzigingsdatum overgenomen |
| [Belastingdienst: herziening bij KOR](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/hoe_werkt_de_btw/kleineondernemersregeling/wat-betekent-meedoen-met-de-kleineondernemersregeling/moet-ik-mijn-btw-aftrek-herzien-vanwege-de-kleineondernemersregeling) | Batterij-artikel: gevolgen buiten één aankoop | Geen zichtbare wijzigingsdatum overgenomen |
| [RVO: ISDE-overzicht](https://www.rvo.nl/subsidies-financiering/isde) | Batterij-artikel: onderscheid van subsidie | RVO vermeldt controle 2026-10-14 |
| [RVO: warmtepomp](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp) | Audit bestaande warmtepomproute en volgende contenttranche | RVO vermeldt controle 2026-06-03 |
| [RVO: isolatiemaatregelen](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen) | Audit isolatie, glas, bewijs en combinaties | RVO vermeldt controle 2026-09-17 |
| [RVO: veelgestelde vragen](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/veelgestelde-vragen) | Specifieke controle van UF-schuim/uitvoeringsdatum | Geen nieuwe algemene versiedatum geclaimd |
| [RVO: ventilatie](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie) | Controle bestaande combinatie-/regiowaarschuwing | Geen zichtbare wijzigingsdatum overgenomen |
| [RVO: Maatregel 29](https://www.rvo.nl/onderwerpen/maatregel-29) | Controle regionale verwijzing | RVO vermeldt controle 2026-04-16 |
| [RVO: ISDE-wijzigingen 2027](https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027) | Jaargate: pagina noemt wijzigingen nog voorgenomen | RVO vermeldt controle 2026-11-12 |
| [Belastingdienst: isoleren van woningen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/diensten_9_btw/werkzaamheden_aan_woningen/isoleren_van_woningen) | Controle btw-arbeid/materialen, toekomstige verdieping | Geen zichtbare wijzigingsdatum overgenomen |
| [Warmtefonds: particulieren](https://www.warmtefonds.nl/particulieren) | Algemene financieringsroute; niet gebruikt om een krediet te adviseren | Geen tarieftabel herpubliceerd |
| [Warmtefonds: 0% rente](https://www.warmtefonds.nl/particulieren/energiebespaarlening-nul-procent) | Controle bestaande inkomensgrens en eigenaar-bewonerroute | Geen persoonlijke aanvraag beoordeeld |
| [Warmtefonds: thuisbatterij](https://www.warmtefonds.nl/particulieren/energiebesparende-maatregelen/thuisbatterij) | Afzonderlijke maatregelvoorwaarden bevestigd | Geen individuele financiering toegezegd |
| [Warmtefonds: zonnepanelen](https://www.warmtefonds.nl/particulieren/energiebesparende-maatregelen/zonnepanelen) | Afzonderlijke maatregelvoorwaarden bevestigd | Geen individuele financiering toegezegd |

### Gerichte inhoudsbevindingen

Geen directe inhoudelijke tegenspraak gevonden tussen de opnieuw geraadpleegde bronnen en de kernwaarschuwingen in de bestaande regelengine. Dit is een gerichte review van de eerste contenttranche, geen volledige juridische certificering.

- De UF-schuimwaarschuwing in de bestaande korte isolatiepagina kan preciezer: het gaat om aanbrengen op of na 1 april 2026. Bij latere uitbreiding die uitvoeringsdatum expliciet formuleren; bron: RVO veelgestelde vragen hierboven.
- De huidige 2027-gate blijft terecht: RVO noemt de wijzigingen nog voorgenomen. Er zijn in deze tranche geen bedragen of berekeningen voor 2027 toegevoegd.
- De bestaande scheiding tussen subsidie, btw-tarief, mogelijke teruggaaf en lening blijft behouden. De artikelen veranderen de inhoudelijke keuzes van de regelingencheck niet.

## 4. Publicatie- en onderhoudscriteria

De twee artikelen zijn technisch pas klaar voor indexering wanneer de PR de volgende punten verifieert:

1. Eén zelfverwijzende canonical per bestaande URL; passende titel/description en precies één zichtbare H1.
2. De proefrelease-strip en proefrelease-titel vervallen uitsluitend voor de inhoudelijk gereviewde artikelen.
3. Alleen deze twee artikelen worden aan sitemap en openbare inhoudsmetadata toegevoegd. Privé-/proefroutes blijven noindex; de overige twee voorbereidingsartikelen blijven noindex.
4. Alle bron- en interne links zijn correct. Primaire vervolgactie is de werkende gratis check. Geen persoonlijk profiel of antwoord in URL, schema of tracking.
5. Broncontroledatum en interne reviewdatum zijn zichtbaar. `reviewer` is ‘SubsidieReady broncontrole’; geen verzonnen auteur, diploma of onafhankelijke deskundigenreview.
6. Artikeltekst, zichtbaar bronblok en eventuele structured data spreken elkaar niet tegen. Geen ratings, reviews, Organization-legalName of FAQ-rich-resultbelofte zonder grondslag.
7. Build/test/package en relevante browser-/linkcontroles slagen op de PR-head. Publicatie-/liveacceptatie volgt het afgesproken proces.

**Interne hercontrole:** uiterlijk 14 december 2026, eerder bij gemelde bronwijzigingen of vóór een relevante inhoudelijke publicatie. Deze datum is geen juridische vervaldatum. De huidige handmatige bronmonitor kan wijzigingen signaleren; gewijzigde tekst of regels wordt nooit automatisch gepubliceerd.

Leg bij elke inhoudelijke wijziging apart vast: bron-URL, raadpleegdatum, zichtbare bronversie, eventuele ingangsdatum, artikelversie, redactionele review en uitgevoerde controles. Bij een onduidelijke of niet-bereikbare bron de claim niet uitbreiden en de onzekerheid zichtbaar houden.

## 5. Wat nog niet aangetoond is

Deze review bewijst niet dat Google de pagina's al geïndexeerd heeft, welke zoekvraag bestaat, hoeveel bezoekers de uitleg aantrekt of hoeveel adviesaanvragen eruit volgen. Daarvoor zijn bevestigde webmastergegevens en een goedgekeurde meetopzet nodig. De artikelen staan inhoudelijk los van de afzonderlijke juridische en technische goedkeuring voor leads, e-mail en CRM. Er worden geen nieuwe diensten of kosten geactiveerd.
