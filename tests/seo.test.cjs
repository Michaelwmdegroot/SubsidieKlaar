'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const root=path.resolve(__dirname,'..');
const origin='https://subsidieready.nl';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const publicRoutes=[
  '/','/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/',
  '/hulp/factuur-warmtepomp/','/hulp/betaalbewijs/','/hulp/meldcode/',
  '/hulp/zonnepanelen-btw/','/hulp/thuisbatterij-btw/',
  '/bronnen/','/privacy/','/over/'
];
const privateRoutes=['/mijn-plan/','/advies/','/sales/','/bronbeheer/'];
const unreviewedRoutes=['/hulp/isolatie-checklist/','/hulp/lokale-regelingen/'];
const fileFor=route=>route==='/'?'index.html':route.slice(1)+'index.html';
const htmlFor=route=>read(fileFor(route));
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function attributes(tag){
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(([,key,,value])=>[key.toLowerCase(),decode(value)]));
}
function tags(html,name){return [...html.matchAll(new RegExp('<'+name+'\\b[^>]*>','gi'))].map(match=>attributes(match[0]));}
function oneMeta(html,key,value,context){
  const matches=tags(html,'meta').filter(attrs=>attrs[key]===value);
  assert.equal(matches.length,1,context+' has one '+value+' meta tag');
  return matches[0].content;
}
function ldScripts(html){
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match=>attributes(match[1]).type==='application/ld+json')
    .map(match=>match[2]);
}
function jsonNodes(html,context){
  const scripts=ldScripts(html);
  assert.ok(scripts.length>0,context+' exposes structured data in initial HTML');
  return scripts.flatMap(body=>{
    const data=JSON.parse(body);
    assert.equal(data['@context'],'https://schema.org',context+' uses the public schema context');
    return data['@graph']||[data];
  });
}
function walk(value,visit){
  if(Array.isArray(value))return value.forEach(item=>walk(item,visit));
  if(value&&typeof value==='object'){
    visit(value);
    Object.values(value).forEach(item=>walk(item,visit));
  }
}
const canonicalOf=(html,context)=>{
  const links=tags(html,'link').filter(attrs=>attrs.rel==='canonical');
  assert.equal(links.length,1,context+' has one canonical');
  return links[0].href;
};

test('SEO: sitemap contains exactly the reviewed public canonical routes',()=>{
  const sitemap=read('sitemap.xml');
  const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>decode(match[1]));
  assert.deepEqual([...locations].sort(),publicRoutes.map(route=>origin+route).sort());
  assert.equal(new Set(locations).size,locations.length,'duplicate canonical URLs do not enter the sitemap');
  for(const location of locations){
    const url=new URL(location);
    assert.equal(url.origin,origin);
    assert.equal(url.search,'');
    assert.equal(url.hash,'');
    assert.equal(canonicalOf(htmlFor(url.pathname),url.pathname),location);
  }
  for(const route of [...privateRoutes,...unreviewedRoutes])assert.ok(!locations.includes(origin+route),route+' is not submitted for indexing');
  assert.match(read('robots.txt'),/Sitemap: https:\/\/subsidieready\.nl\/sitemap\.xml/);
});

test('SEO: each indexable initial HTML has one H1 and unique complete search metadata',()=>{
  const titles=new Set(),descriptions=new Set();
  for(const route of publicRoutes){
    const html=htmlFor(route);
    assert.equal([...html.matchAll(/<h1\b/gi)].length,1,route+' has one H1, including the no-JavaScript response');
    const headings=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    assert.ok(headings[0][1].replace(/<[^>]+>/g,'').trim(),route+' has a readable heading');
    const titleTags=[...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    assert.equal(titleTags.length,1,route+' has one title');
    const title=decode(titleTags[0][1]).trim();
    const description=oneMeta(html,'name','description',route).trim();
    assert.ok(title&&description,route+' has non-empty title and description');
    assert.ok(!titles.has(title),route+' does not reuse another title');
    assert.ok(!descriptions.has(description),route+' does not reuse another description');
    titles.add(title);descriptions.add(description);
    const robots=oneMeta(html,'name','robots',route).split(',').map(token=>token.trim());
    assert.ok(robots.includes('index')&&robots.includes('follow'),route+' allows indexing and following');
    assert.ok(!robots.includes('noindex'),route+' has no conflicting noindex');
    assert.equal(canonicalOf(html,route),origin+route);
    assert.equal(oneMeta(html,'property','og:url',route),origin+route);
  }
});

test('SEO: private and unreviewed pages remain noindex and the 404 is not canonical content',()=>{
  for(const route of [...privateRoutes,...unreviewedRoutes]){
    const html=htmlFor(route);
    const robots=oneMeta(html,'name','robots',route).split(',').map(token=>token.trim());
    assert.ok(robots.includes('noindex'),route+' stays out of search');
    assert.equal(ldScripts(html).length,0,route+' is not described as public indexed content');
  }
  const notFound=read('404.html');
  assert.ok(oneMeta(notFound,'name','robots','404').includes('noindex'));
  assert.equal(tags(notFound,'link').filter(attrs=>attrs.rel==='canonical').length,0,'404 has no canonical public URL');
});

test('SEO: structured data describes the real free tools and public pages without invented business claims',()=>{
  const homeNodes=jsonNodes(htmlFor('/'),'/');
  assert.ok(homeNodes.some(node=>node['@type']==='WebSite'&&node.url===origin+'/'));
  for(const route of publicRoutes){
    const nodes=jsonNodes(htmlFor(route),route);
    if(route==='/'||route==='/regelingen/'){
      const application=nodes.find(node=>node['@type']==='WebApplication');
      assert.ok(application,route+' describes the actual interactive tool');
      assert.equal(application.url,origin+route);
      assert.equal(String(application.offers.price),'0');
      assert.equal(application.offers.priceCurrency,'EUR');
    }else{
      const page=nodes.find(node=>['WebPage','CollectionPage'].includes(node['@type']));
      assert.ok(page,route+' has a public webpage record');
      assert.equal(page.url,origin+route);
      assert.equal(page.isPartOf['@id'],origin+'/#website');
    }
    walk(nodes,node=>{
      const types=Array.isArray(node['@type'])?node['@type']:[node['@type']];
      for(const type of types)assert.ok(!['Organization','LocalBusiness','SearchAction','Review','AggregateRating'].includes(type),route+' does not invent '+type);
      for(const key of ['aggregateRating','ratingValue','ratingCount','reviewCount','legalName'])assert.ok(!Object.hasOwn(node,key),route+' contains no unsupported '+key);
      if(Object.hasOwn(node,'citation')){
        assert.ok(Array.isArray(node.citation)&&node.citation.length>0,route+' citations are an explicit source list');
        for(const citation of node.citation){
          assert.equal(typeof citation,'string',route+' citation resolves to a URL, not a legacy ID');
          const url=new URL(citation);
          assert.equal(url.protocol,'https:',route+' cites secure official sources');
          assert.ok(tags(htmlFor(route),'a').some(attrs=>attrs.href===citation),route+' citation is visible to readers');
        }
      }
    });
  }
});

test('SEO: editorial breadcrumbs use real linked public destinations in the right order',()=>{
  for(const route of publicRoutes.filter(route=>!['/','/regelingen/'].includes(route))){
    const html=htmlFor(route);
    const nodes=jsonNodes(html,route);
    const breadcrumb=nodes.find(node=>node['@type']==='BreadcrumbList');
    assert.ok(breadcrumb,route+' exposes breadcrumbs');
    assert.ok(breadcrumb.itemListElement.length>=2,route+' has a home-to-page trail');
    breadcrumb.itemListElement.forEach((item,index)=>{
      assert.equal(item['@type'],'ListItem');
      assert.equal(item.position,index+1,route+' positions are contiguous and start at 1');
      assert.ok(typeof item.name==='string'&&item.name.trim(),route+' crumb is named');
      const url=new URL(item.item);
      assert.equal(url.origin,origin);
      assert.equal(url.search,'');assert.equal(url.hash,'');
      assert.ok(publicRoutes.includes(url.pathname),route+' does not link an unreviewed/private breadcrumb');
      assert.ok(fs.existsSync(path.join(root,fileFor(url.pathname))),route+' crumb has a real page');
      // A current-page crumb may be text; ancestors must also be navigable in the visible page.
      if(index<breadcrumb.itemListElement.length-1){
        assert.ok(tags(html,'a').some(attrs=>attrs.href===url.pathname||attrs.href===item.item),route+' ancestor is visible and navigable');
      }
    });
    assert.equal(breadcrumb.itemListElement[0].item,origin+'/');
    assert.equal(breadcrumb.itemListElement.at(-1).item,origin+route);
    const page=nodes.find(node=>['WebPage','CollectionPage'].includes(node['@type']));
    assert.equal(page.breadcrumb['@id'],breadcrumb['@id'],route+' webpage references the actual breadcrumb record');
  }
});

test('SEO: CSP permits the exact generated JSON-LD without broadening script execution',()=>{
  const htaccess=read('.htaccess');
  const csp=htaccess.match(/Header always set Content-Security-Policy "([^\n]+)"/);
  assert.ok(csp,'Apache/LiteSpeed sends the Content Security Policy');
  const scriptPolicy=csp[1].split(';').find(part=>part.trim().startsWith('script-src '));
  assert.ok(scriptPolicy,'script-src is explicitly restricted');
  assert.doesNotMatch(scriptPolicy,/'unsafe-inline'|'unsafe-eval'|\s\*(?:\s|$)/);
  for(const route of publicRoutes){
    for(const body of ldScripts(htmlFor(route))){
      const hash="'sha256-"+crypto.createHash('sha256').update(body).digest('base64')+"'";
      assert.ok(scriptPolicy.split(/\s+/).includes(hash),route+' exact JSON-LD hash is allowed');
    }
  }
});

test('SEO: reviewed VAT articles expose their sources, editorial check and useful free next step',()=>{
  const reviewedRoutes=['/hulp/zonnepanelen-btw/','/hulp/thuisbatterij-btw/'];
  const requiredSources={
    '/hulp/zonnepanelen-btw/':[
      'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-nultarief',
      'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/zonnepanelen-21'
    ],
    '/hulp/thuisbatterij-btw/':[
      'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw',
      'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/afmelden-kor'
    ]
  };
  for(const route of reviewedRoutes){
    const html=htmlFor(route),anchors=tags(html,'a');
    assert.doesNotMatch(html,/p-beta-strip|SubsidieReady testrelease|SubsidieReady proefversie/);
    assert.match(html,/14 november 2026|2026-11-14/);
    assert.match(html,/14 december 2026|2026-12-14/);
    assert.match(html,/interne|onderhoud/i,'review date is not represented as a legal expiry');
    assert.match(html,/SubsidieReady broncontrole/,'reviewer is the actual editorial process, not a fictional professional');
    for(const source of requiredSources[route])assert.ok(anchors.some(attrs=>attrs.href===source),route+' links the relevant primary source');
    assert.ok(anchors.some(attrs=>attrs.href==='/regelingen/'),route+' leads to the free working check');
    assert.ok(anchors.some(attrs=>attrs.href===reviewedRoutes.find(other=>other!==route)),route+' offers related VAT context');
    assert.ok(tags(htmlFor('/hulp/'),'a').some(attrs=>attrs.href===route),route+' is discoverable from the knowledge bank');
    assert.ok(tags(htmlFor('/btw/'),'a').some(attrs=>attrs.href===route),route+' is discoverable from its parent subject page');
    const page=jsonNodes(html,route).find(node=>node['@type']==='WebPage');
    assert.equal(page.lastReviewed,'2026-11-14');
    for(const source of requiredSources[route])assert.ok(page.citation.includes(source),route+' schema reflects visible official sources');
  }
});
