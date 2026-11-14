'use strict';
// Public metadata only. No customer state, analytics, invented ratings or legal entity.
const {escape, category} = require('./site-design.cjs');
const origin = 'https://subsidieready.nl';
const image = origin + '/assets/images/dashboard-home.webp';
function serialize(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
function socialImageTags() {
  return `<meta property="og:image" content="${image}"><meta property="og:image:width" content="1280"><meta property="og:image:height" content="720"><meta property="og:image:alt" content="Illustratie van een woning met verduurzamingsmaatregelen"><meta name="twitter:card" content="summary_large_image">`;
}
function website() {
  return {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'SubsidieReady',inLanguage:'nl-NL'};
}
function application({route, name, description}) {
  return {'@type':'WebApplication','@id':origin+route+'#application',name,url:origin+route,
    applicationCategory:'UtilitiesApplication',operatingSystem:'Web',inLanguage:'nl-NL',description,
    offers:{'@type':'Offer',price:'0',priceCurrency:'EUR'}};
}
function breadcrumb({route, title}) {
  const c = category(route), items = [{name:'Home',url:origin+'/'}];
  if (c.section && c.section !== route) items.push({name:c.label,url:origin+c.section});
  items.push({name:c.section && c.section !== route ? title : c.label,url:origin+route});
  return {'@type':'BreadcrumbList','@id':origin+route+'#breadcrumb',itemListElement:items.map((item,i)=>({
    '@type':'ListItem',position:i+1,name:item.name,item:item.url
  }))};
}
function webPage({route,title,description,checked,sources}) {
  const page = {'@type':route==='/hulp/'?'CollectionPage':'WebPage','@id':origin+route+'#webpage',
    url:origin+route,name:title,description,inLanguage:'nl-NL',isPartOf:{'@id':origin+'/#website'},
    breadcrumb:{'@id':origin+route+'#breadcrumb'}};
  // These describe the visible editorial check, never a fabricated publication date.
  if (checked) page.lastReviewed = checked;
  if (sources?.length) {
    if (sources.some(source=>!source?.url?.startsWith('https://'))) throw Error('SEO citation requires an absolute source URL');
    page.citation = sources.map(source=>source.url);
  }
  return page;
}
function graph(nodes) { return {'@context':'https://schema.org','@graph':nodes}; }
function metadata({route,title,description}) {
  return `<title>${escape(title)} | SubsidieReady</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${origin+route}"><meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta property="og:site_name" content="SubsidieReady"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin+route}">${socialImageTags()}`;
}
module.exports = {origin,serialize,socialImageTags,website,application,breadcrumb,webPage,graph,metadata};
