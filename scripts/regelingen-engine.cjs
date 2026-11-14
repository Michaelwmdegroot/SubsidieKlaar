/* SubsidieReady routeverkenner. General information, not eligibility or credit advice. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SRRegelingen = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const checked = '2026-11-14', reviewBy = '2026-12-14';
  const sources = {
    isde: ['RVO — ISDE', 'https://www.rvo.nl/subsidies-financiering/isde'],
    pump: ['RVO — warmtepomp', 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp'],
    insulation: ['RVO — isolatiemaatregelen', 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen'],
    ventilation: ['RVO — ventilatie', 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie'],
    pv0: ['Belastingdienst — btw-tarief zonnepanelen', 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen'],
    pv21: ['Belastingdienst — zonnepanelen met 21% btw', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21'],
    battery: ['Belastingdienst — thuisbatterij en btw', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw'],
    vatInsulation: ['Belastingdienst — btw bij isoleren', 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/diensten_9_btw/werkzaamheden_aan_woningen/isoleren_van_woningen'],
    warmth: ['Nationaal Warmtefonds — Energiebespaarlening', 'https://www.warmtefonds.nl/particulieren'],
    warmth0: ['Nationaal Warmtefonds — voorwaarden 0% rente', 'https://www.warmtefonds.nl/particulieren/energiebespaarlening-nul-procent'],
    warmthBattery: ['Nationaal Warmtefonds — thuisbatterij', 'https://www.warmtefonds.nl/particulieren/energiebesparende-maatregelen/thuisbatterij'],
    svn: ['SVn — Duurzaamheidslening', 'https://www.svn.nl/duurzaamheidslening'],
    region: ['RVO — Maatregel 29 / SNN', 'https://www.rvo.nl/onderwerpen/maatregel-29'],
    vve: ['RVO — SVVE', 'https://www.rvo.nl/subsidies-financiering/svve'],
    business: ['RVO — EIA', 'https://www.rvo.nl/onderwerpen/eia'],
    nextYear: ['RVO — voorgenomen ISDE-wijzigingen 2027', 'https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027']
  };
  const catalogue = [
    {id:'isde-pump',kind:'subsidie',title:'ISDE voor je warmtepomp',measures:['warmtepomp'],sources:['pump'],summary:'Een route voor eigenaar-bewoners. Eerst installeren, daarna aanvragen. Het toestel en de uitvoering moeten aan de voorwaarden voldoen.',action:'Controleer meldcode of technische stukken, installatie en aanvraagtermijn. Gebruik daarna de bestaande documentenwerkbank.',workspace:true},
    {id:'isde-insulation',kind:'subsidie',title:'ISDE voor isolatie en glas',measures:['isolatie'],sources:['insulation','region'],summary:'Isolatietype, oppervlak, isolatiewaarde, woning en uitvoering bepalen de route. Een combinatie met een tweede maatregel kan relevant zijn.',action:'Leg per maatregel datum, oppervlak, technische gegevens en bewijs vast. Controleer eerst de regionale uitzondering; tel regelingen niet blind op.'},
    {id:'isde-ventilation',kind:'subsidie',title:'ISDE voor ventilatie',measures:['ventilatie'],sources:['ventilation','region'],summary:'De 2026-route voor ventilatie vraagt een combinatie met isolatie. Alleen ventilatie verdubbelt de isolatiesubsidie niet.',action:'Controleer installatie vanaf 1 januari 2026, het systeem, de isolatiecombinatie en beide termijnen. Bij Maatregel 29 is aparte broncontrole nodig.'},
    {id:'isde-other',kind:'subsidie',title:'Andere ISDE-maatregelen',measures:['zonneboiler','warmtenet','koken'],sources:['isde'],summary:'Ook zonneboilers, aansluiting op een warmtenet en bepaalde elektrische kookvoorzieningen hebben eigen voorwaarden.',action:'Bekijk de maatregel bij RVO. De warmtepompchecklist is hiervoor geen volledige documentencheck.'},
    {id:'pv-zero',kind:'btw',title:'Zonnepanelen: het 0%-tarief',measures:['zonnepanelen','pv_constructie'],sources:['pv0'],summary:'Voor levering en installatie op of bij een woning geldt onder voorwaarden 0% btw. Direct noodzakelijke montagematerialen kunnen meevallen.',action:'Controleer de afzonderlijke factuurregels. Dakversteviging, een volledige groepenkast en een thuisbatterij vallen niet automatisch mee onder 0%. Bij geïntegreerde nieuwbouwpanelen hangt het af van wat wordt geleverd.'},
    {id:'pv-refund',kind:'btw',title:'Zonnepanelen: betaalde btw terugvragen',measures:['zonnepanelen','pv_constructie'],sources:['pv21'],summary:'Dit is een andere route dan het nultarief. Werkelijk betaalde 21% btw kan onder voorwaarden geheel of gedeeltelijk aftrekbaar zijn.',action:'Controleer factuur, energiecontract, teruglevering, KOR en data. Vraag niet opnieuw btw terug als er 0% op de factuur staat.'},
    {id:'pv-construction',kind:'btw',title:'PV-constructie: beoordeling per onderdeel',measures:['pv_constructie'],sources:['pv0'],summary:'Geen algemene belofte dat een hele carport, overkapping of bouwconstructie 0% btw krijgt doordat er zonnepanelen op komen.',action:'Splits panelen, specifiek montagemateriaal, draagconstructie en overige bouwwerkzaamheden. Een afwijkend totaalconcept vraagt fiscale beoordeling; de term PV-constructie is op zichzelf geen bewijs.'},
    {id:'battery-vat',kind:'btw',title:'Thuisbatterij: btw en verplichtingen',measures:['thuisbatterij'],sources:['battery'],summary:'Teruggaaf kan bij belast gebruik voor stroomhandel, met onder meer EMS, dynamisch contract en passende KOR-status. Privégebruik kan btw-correcties geven.',action:'Controleer gebruik, namen op factuur en contract, KOR en aangifteplichten. Geen automatische 21% korting en geen ISDE-warmtepompsubsidie.'},
    {id:'insulation-vat',kind:'btw',title:'Isolatie: 9% btw op passende arbeid',measures:['isolatie'],sources:['vatInsulation'],summary:'Bij energiebesparend isoleren van een woning ouder dan twee jaar kan het 9%-tarief gelden voor de arbeid. Materialen blijven 21%.',action:'Laat arbeid, materiaal en overige werkzaamheden apart beoordelen. Dit is niet 9% op de complete verbouwing.'},
    {id:'warmth',kind:'financiering',title:'Nationaal Warmtefonds',measures:[],sources:['warmth','warmth0','warmthBattery'],summary:'Algemene informatie: een Energiebespaarlening moet worden terugbetaald. Voor eigenaar-bewoners met gezamenlijk verzamelinkomen onder € 60.000 kan 0% rente gelden, met overige voorwaarden.',action:'Lees de voorwaarden rechtstreeks bij Warmtefonds. De aanbieder beoordeelt de aanvraag. We vragen hier geen inkomen, BKR-gegevens of loonstroken en adviseren geen specifiek krediet.'},
    {id:'svn',kind:'financiering',title:'Gemeentelijke financiering via SVn',measures:[],sources:['svn'],summary:'Het gemeentelijke aanbod verschilt. Voor een Duurzaamheidslening is een toewijzing nodig; SVn beoordeelt daarna de aanvraag.',action:'Controleer beschikbaarheid bij de gemeente en SVn. Een toewijzing is geen kredietgoedkeuring; een lening is geen subsidie.'},
    {id:'local',kind:'lokaal',title:'Lokale en regionale regelingen',measures:[],sources:['region'],summary:'De lokale dekking van deze verkenner is onvolledig. Niet gevonden betekent niet dat er geen regeling bestaat.',action:'Controleer je gemeente of provincie vóór opdrachtverlening. Voor Groningen en Aa en Hunze, Noordenveld en Tynaarlo kan Maatregel 29 relevant zijn.'}
  ];
  const enums = {
    role:['owner','vve','landlord','tenant','business','unknown'],
    home:['existing','new','unknown'], area:['m29','other','unknown'],
    stage:['planning','ordered','installed','unknown'], year:['2026','2027','earlier','unknown'],
    pvVat:['zero','paid21','unknown'], kor:['yes','no','unknown'], batteryUse:['trade','private','unknown']
  };
  const measures = ['warmtepomp','isolatie','ventilatie','zonnepanelen','pv_constructie','thuisbatterij','zonneboiler','warmtenet','koken'];
  function own(obj,key) {const d=obj && typeof obj==='object'?Object.getOwnPropertyDescriptor(obj,key):null;return d && 'value' in d?d.value:undefined;}
  function sanitize(input) {
    const out={};for(const [key,values] of Object.entries(enums)){const v=own(input,key);out[key]=values.includes(v)?v:'unknown';}
    const selected=own(input,'measures');out.measures=[];
    if(Array.isArray(selected))for(let i=0;i<Math.min(selected.length,12);i++){const v=own(selected,String(i));if(measures.includes(v)&&!out.measures.includes(v))out.measures.push(v);}
    return out;
  }
  function validDate(value) {if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
  function evaluate(input, today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())) {
    if(!validDate(today))throw new Error('Ongeldige controledatum');
    const profile=sanitize(input), notices=[];
    const outdated=today<checked||today>reviewBy;
    if(outdated)notices.push('Broncontrole verlopen of controledatum vóór deze bronversie. Gebruik de actuele officiële voorwaarden; geen toepasselijkheidsuitkomst.');
    if(profile.year!=='2026')notices.push('Alleen de bronversie voor 2026 is uitgewerkt. Eerdere jaren en 2027 vragen een afzonderlijke controle; voorstellen zijn geen definitieve regels.');
    if(profile.role!=='owner')notices.push('Deze voorbeeldcheck is uitgewerkt voor eigenaar-bewoners. Voor andere aanvragers tonen we verwijzingen, geen particuliere ISDE-uitkomst.');
    if(profile.home==='new')notices.push('Nieuwbouw vraagt aparte voorwaarden. De eigenaar-bewonerroute voor bestaande woningen is niet automatisch toepasbaar.');
    if(profile.stage==='planning'||profile.stage==='ordered')notices.push('Controleer per regeling wanneer je moet aanvragen: niet iedere regeling volgt de ISDE-volgorde. Een opdracht kan al gevolgen hebben.');
    notices.push('Lokale dekking is niet compleet. Dit is een routeverkenner, geen recht op subsidie, fiscaal besluit of kredietadvies.');
    let selected=catalogue.filter(r=>!r.measures.length||r.measures.some(m=>profile.measures.includes(m)));
    if(profile.role!=='owner')selected=selected.filter(r=>r.kind==='lokaal');
    const routes=selected.map(r=>{
      let status=r.kind==='financiering'?'information':'review',reason='Controleer de volledige voorwaarden bij de uitvoerder.';
      if(r.id==='pv-refund'&&profile.pvVat==='zero'){status='not_applicable';reason='Over factuurregels met 0% btw is geen aanschaf-btw betaald om terug te vragen. Andere factuurregels moet je apart beoordelen.';}
      if(r.id==='pv-refund'&&profile.pvVat==='paid21')reason='Betaalde 21% btw is een startpunt, geen garantie op aftrek. De reden voor 21%, KOR, gebruik en termijnen moeten kloppen.';
      if(r.id==='pv-refund'&&profile.kor==='yes'&&profile.pvVat!=='zero')reason='De KOR kan de aftrek blokkeren; datum en eventuele herziening vragen een afzonderlijke beoordeling.';
      if(r.id==='battery-vat'&&profile.batteryUse==='private'){status='not_applicable';reason='Uitsluitend privégebruik biedt volgens deze route geen btw-teruggaaf.';}
      if(r.id==='battery-vat'&&profile.kor==='yes'&&profile.batteryUse!=='private')reason='KOR bij aankoop kan aftrek blokkeren. Geen automatische teruggaaf; laat data en mogelijke herziening beoordelen.';
      if(r.id==='isde-ventilation'&&!profile.measures.includes('isolatie'))reason='Je hebt geen isolatie geselecteerd. Controleer of er een kwalificerende eerdere isolatiemaatregel is; alleen ventilatie is niet genoeg voor deze route.';
      if((r.id==='isde-insulation'||r.id==='isde-ventilation')&&profile.area==='m29'){status='regional_route';reason='Controleer Maatregel 29 bij SNN. Gebruik de gewone landelijke isolatieroute hier niet als automatische uitkomst.';}
      if(r.id==='local')reason=profile.area==='m29'?'Begin bij RVO Maatregel 29 en de officiële SNN-route; controleer adres, opdrachtdata en openstelling.':'Gemeentelijke dekking is nog niet geverifieerd. Doe een officiële gemeentelijke controle; geen claim dat alles gevonden is.';
      if(r.id==='pv-construction'){status='specialist';reason='Een offerte per onderdeel en fiscale onderbouwing zijn nodig. Geen automatische toepassing van 0% op het hele project.';}
      if(outdated||profile.year!=='2026'){status='source_review';reason='Nieuwe bron-/jaarcontrole vereist vóór je deze informatie toepast. '+reason;}
      return {...r,status,reason,checked,reviewBy,sources:r.sources.map(id=>({id,title:sources[id][0],url:sources[id][1],checked})),workspace:r.workspace===true&&!outdated&&profile.year==='2026'&&profile.role==='owner'};
    });
    const referrals=[];
    if(profile.role==='vve')referrals.push({title:'Bekijk de afzonderlijke SVVE-route voor VvE’s',url:sources.vve[1]});
    if(profile.role==='business')referrals.push({title:'Zakelijke regelingen hebben een eigen route, bijvoorbeeld EIA',url:sources.business[1]});
    if(['landlord','tenant','unknown'].includes(profile.role))referrals.push({title:'Controleer de passende aanvragersroute bij RVO; verhuur en huurders zijn niet hetzelfde',url:'https://www.rvo.nl/subsidies-financiering'});
    return {schemaVersion:1,ruleVersion:'2026.11.14-public.1',profile,routes,referrals,notices,coverage:'partial',eligibilityAssessed:false,creditAdvice:false,totalBenefit:null};
  }
  function listSources(){return Object.entries(sources).map(([id,[title,url]])=>({id,title,url,checked,reviewBy}));}
  function listRoutes(){return catalogue.map(r=>({...r,measures:[...r.measures],sources:r.sources.map(id=>({id,title:sources[id][0],url:sources[id][1],checked,reviewBy}))}));}
  return Object.freeze({checked,reviewBy,sanitize,evaluate,listSources,listRoutes,measures:Object.freeze(measures),catalogueSize:catalogue.length});
});
