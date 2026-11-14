'use strict';

// Reviewed editorial pages. No eligibility calculation, tracking or lead submission.
// Source verification is editorial; it is not a tax opinion or legal approval.
const sources = {
  pvRate: {name:'Belastingdienst: btw-tarief zonnepanelen',url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen'},
  pvZero: {name:'Belastingdienst: zonnepanelen gekocht met 0% btw',url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-nultarief'},
  pvPaid: {name:'Belastingdienst: zonnepanelen gekocht met 21% btw',url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21'},
  battery: {name:'Belastingdienst: thuisbatterij en btw',url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw'},
  korExit: {name:'Belastingdienst: afmelden voor de KOR',url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/afmelden-kor'},
  korRevision: {name:'Belastingdienst: btw-aftrek herzien bij de KOR',url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/hoe_werkt_de_btw/kleineondernemersregeling/wat-betekent-meedoen-met-de-kleineondernemersregeling/moet-ik-mijn-btw-aftrek-herzien-vanwege-de-kleineondernemersregeling'},
  isde: {name:'RVO: maatregelen binnen de ISDE',url:'https://www.rvo.nl/subsidies-financiering/isde'}
};
const link=(key,label)=>`<a href="${sources[key].url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const reviewed={checked:'2026-11-14',reviewBy:'2026-12-14',reviewer:'SubsidieReady broncontrole'};

const articles=[
  {
    ...reviewed,
    route:'/hulp/zonnepanelen-btw/',
    slug:'zonnepanelen-btw',
    title:'Zonnepanelen en btw: 0% of btw terugvragen?',
    description:'Controleer de btw op je zonnepanelenfactuur. Begrijp het verschil tussen 0%, betaalde 21%, KOR en de vervolgstappen bij nieuwbouw of een combinatiepakket.',
    sources:[sources.pvRate,sources.pvZero,sources.pvPaid],
    body:`<p class="lead">Het btw-tarief op je zonnepanelenfactuur en het terugvragen van betaalde btw zijn twee verschillende vragen. Deze uitleg helpt je herkennen welke informatie je nodig hebt. Je hoeft hiervoor geen account aan te maken of contactgegevens achter te laten.</p>
<h2>Begin bij de factuur</h2>
<p>Pak je offerte of factuur erbij en bekijk ieder onderdeel afzonderlijk. Een totaalbedrag met het woord ‘zonnepanelenpakket’ vertelt nog niet welke behandeling voor elke factuurregel geldt.</p>
<table><caption>Welke vervolgstap past bij de factuur?</caption><thead><tr><th scope="col">Wat zie je?</th><th scope="col">Wat controleer je?</th></tr></thead><tbody><tr><th scope="row">Een regel met 0% btw</th><td>Er is op die regel geen aanschaf-btw betaald om terug te vragen. Controleer wel eventuele aangifteplichten.</td></tr><tr><th scope="row">Een regel met 21% btw</th><td>Controleer waarom dit tarief geldt en of je aan de voorwaarden voor aftrek voldoet.</td></tr><tr><th scope="row">Meerdere onderdelen of tarieven</th><td>Vraag om een uitsplitsing. Beoordeel panelen, bouwkundige werkzaamheden en een batterij afzonderlijk.</td></tr></tbody></table>
<h2>Wanneer kan het 0%-tarief gelden?</h2>
<p>Voor de levering en installatie van zonnepanelen op of bij een woning geldt onder voorwaarden het nultarief. Direct noodzakelijke onderdelen, zoals montagemateriaal en een omvormer bij de installatie, kunnen daarbij horen. Dakversteviging, vervanging van de volledige groepenkast en een thuisbatterij vallen daar niet onder.</p>
<p>Bij geïntegreerde panelen op nieuwbouw is de levering bepalend: alleen de panelen leveren en installeren is iets anders dan een nieuwbouwwoning inclusief die panelen opleveren. Ook een hele carport wordt niet vanzelf een levering met 0% btw. Laat onduidelijke onderdelen toelichten voordat je een offerte vergelijkt.</p>
<p>Bron: ${link('pvRate','Bekijk wat de Belastingdienst onder het nultarief rekent')}.</p>
<h2>0% betaald: soms toch een aangifteplicht</h2>
<p>Wie 0% betaalt, hoeft zich niet aan te melden om aanschaf-btw terug te vragen. Dat zegt nog niet alles over de btw op teruggeleverde stroom. De Belastingdienst onderscheidt onder meer mensen met en zonder bestaand btw-identificatienummer, ondernemers, KOR-deelnemers en de omvang van de installatie. Gebruik daarom de officiële route die bij jouw situatie past.</p>
<p>Bron: ${link('pvZero','Kies je situatie bij zonnepanelen met 0% btw')}.</p>
<h2>21% betaald: teruggaaf is voorwaardelijk</h2>
<p>Bij betaalde btw noemt de Belastingdienst onder meer jouw naam op de factuur én het energiecontract, stroom terugleveren en je KOR-situatie. Het terug te vragen bedrag kan geheel of gedeeltelijk aftrekbaar zijn. Een factuur met 21% is dus geen toezegging dat je alles terugkrijgt.</p>
<p>Controleer ook het aankoopjaar, het moment van ingebruikname en eventuele KOR-ingangsdatums. De Belastingdienst vraagt om zo snel mogelijk actie te nemen, uiterlijk binnen zes maanden na het aankoopjaar. Bij nieuwbouw kunnen betaling en ingebruikname in verschillende jaren vallen. Laat zulke situaties afzonderlijk beoordelen.</p>
<p>Bron: ${link('pvPaid','Lees de voorwaarden en stappen voor betaalde 21% btw')}.</p>
<h2>Een rekenvoorbeeld is geen teruggaafbesluit</h2>
<p>Stel dat één factuurregel € 6.050 inclusief 21% btw bedraagt. Het btw-deel is dan € 6.050 × 21/121 = € 1.050. Het is niet 21% van € 6.050. Dit voorbeeld laat alleen de rekensom zien; je fiscale situatie bepaalt of en hoeveel aftrek mogelijk is.</p>
<h2>Maak je volgende stap concreet</h2>
<ol><li>Noteer welke factuurregel je wilt controleren en welk tarief erop staat.</li><li>Bewaar de uitleg van de leverancier bij die regel, vooral bij een combinatiepakket.</li><li>Open de passende officiële bron hierboven en schrijf op welke vraag nog onbeantwoord is.</li><li>Vraag bij twijfel eerst een toelichting aan de leverancier of een fiscaal deskundige. Pas zelf geen factuur of fiscale registratie aan op basis van deze checklist.</li></ol>
<p>Je kunt met de <a href="/regelingen/">gratis regelingencheck</a> de verschillende informatieroutes bekijken. Lees voor een afzonderlijke batterij ook <a href="/hulp/thuisbatterij-btw/">thuisbatterij-btw en de verplichtingen daarna</a>. Het <a href="/btw/">btw-overzicht</a> houdt tarieven en teruggaaf van elkaar gescheiden.</p>`
  },
  {
    ...reviewed,
    route:'/hulp/thuisbatterij-btw/',
    slug:'thuisbatterij-btw',
    title:'Thuisbatterij: btw terugvragen en verplichtingen',
    description:'Bekijk de voorwaarden voor btw-teruggaaf bij een thuisbatterij, de rol van de KOR en de verplichtingen na aankoop. Zonder gegarandeerde korting.',
    sources:[sources.battery,sources.korExit,sources.korRevision,sources.isde],
    body:`<p class="lead">Kijk bij een thuisbatterij verder dan een bedrag ‘na btw-teruggaaf’. Teruggaaf vraagt een passende fiscale situatie en kan verplichtingen meebrengen. Deze uitleg helpt je vragen voorbereiden; SubsidieReady doet geen belastingaangifte en beslist niet over jouw aftrek.</p>
<h2>Welke voorwaarden noemt de Belastingdienst?</h2>
<p>De beschreven route gaat over stroom in- en verkopen, met vergoeding van de energiemaatschappij. De batterij moet een geschikt Energie Management Systeem (EMS) hebben en je hebt een dynamisch energiecontract nodig. De aanschaffactuur en het energiecontract moeten op jouw naam staan. Ook de KOR-status bij aanschaf en installatie telt mee. Bij uitsluitend privégebruik biedt deze route geen teruggaaf.</p>
<h2>Wat gebeurt er na een teruggaaf?</h2>
<p>Bij belast gebruik hoort btw-aangifte over de vergoeding voor teruggeleverde stroom. Voor de thuisbatterij bestaat geen vast forfait zoals in bepaalde zonnepanelensituaties. Trek je de aanschaf-btw volledig af en gebruik je de batterij ook privé, dan moet je rekening houden met btw over dat privégebruik. Bewaar daarom de gegevens waarmee je dit kunt onderbouwen.</p>
<p>Bron voor deze voorwaarden en de uitwerking: ${link('battery','Thuisbatterij en btw bij de Belastingdienst')}.</p>
<h2>Controleer de KOR vóór je een beslissing neemt</h2>
<p>Afmelden voor de kleineondernemersregeling is geen automatische stap in deze tool. Vrijwillige afmelding gebeurt via Mijn Belastingdienst Zakelijk en gaat in bij het begin van een aangiftetijdvak. Houd rekening met de verwerkingstijd; de Belastingdienst noemt uiterlijk vier weken vóór de gewenste ingangsdatum. Controleer de definitieve datum in de bevestiging.</p>
<p>In- of uitstappen kan daarnaast gevolgen hebben voor eerder afgetrokken btw. Dat heet herziening. Bekijk daarom je gehele btw-situatie, inclusief eerdere investeringen, voordat je kiest. De gevolgen van de KOR zijn niet beperkt tot één nieuwe batterij.</p>
<p>Bronnen: ${link('korExit','Afmelden voor de KOR')} en ${link('korRevision','Wanneer btw-aftrek opnieuw wordt beoordeeld')}.</p>
<h2>Houd subsidie, btw en financiering apart</h2>
<p>RVO vermeldt dat de ISDE geen subsidie voor een thuisbatterij biedt. Een mogelijke btw-teruggaaf is een andere route. Een eventuele lening blijft een bedrag dat je moet terugbetalen. Zet deze daarom als drie verschillende onderwerpen naast je aankoopbeslissing.</p>
<p>Bron: ${link('isde','Bekijk de maatregelen binnen de ISDE')}. Voor algemene informatie over lenen kun je naar <a href="/financiering/">financiering</a>; SubsidieReady selecteert geen krediet en vraagt hier geen inkomensgegevens.</p>
<h2>Lees een offerte zonder de korting aan te nemen</h2>
<p>Vergelijk eerst de volledige prijs die je moet betalen. Vraag daarna welke aannames achter het bedrag ‘na teruggaaf’ zitten. Een eenvoudig rekenvoorbeeld: bij € 7.260 inclusief 21% btw is het btw-deel € 1.260, want € 7.260 × 21/121 = € 1.260. Dat bedrag is nog geen persoonlijk recht op teruggaaf of voorspelling van je uiteindelijke kosten.</p>
<p>Zet ook werkzaamheden, garantie en diensten die je later apart betaalt overzichtelijk naast elkaar. Zo vergelijk je offertes op dezelfde basis, ook wanneer een verkoper een verwacht voordeel in de kopprijs verwerkt.</p>
<h2>Vier vragen voor je vervolggesprek</h2>
<ol><li>Welk gebruik is in de aangeboden prijs of berekening aangenomen?</li><li>Welke werkzaamheden en eventuele doorlopende diensten zijn inbegrepen?</li><li>Wie licht de fiscale aannames toe en wie helpt als mijn situatie afwijkt?</li><li>Welke informatie moet ik na de aankoop zelf blijven bewaren?</li></ol>
<p>Schrijf de antwoorden naast je offerte en controleer onduidelijkheden voordat je tekent. Je hoeft je offerte of fiscale gegevens hiervoor niet naar SubsidieReady te sturen. Met de <a href="/regelingen/">gratis regelingencheck</a> kun je de informatieroutes verkennen. Lees bij een combinatie met panelen ook <a href="/hulp/zonnepanelen-btw/">zonnepanelen: 0% of btw terugvragen?</a></p>`
  }
];
module.exports={articles};
