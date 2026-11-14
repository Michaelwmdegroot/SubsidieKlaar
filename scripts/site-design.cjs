'use strict';
// Shared presentational shell. No eligibility logic, storage or network operations.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
 home:'<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
 subsidy:'<path d="M18 5a7 7 0 1 0 0 14M3 10h11M3 14h10"/>',
 vat:'<path d="m6 20 12-16"/><circle cx="6.5" cy="6.5" r="3"/><circle cx="17.5" cy="17.5" r="3"/>',
 finance:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v5c0 4 16 4 16 0V5M4 10v5c0 4 16 4 16 0v-5M4 15v4c0 4 16 4 16 0v-4"/>',
 book:'<path d="M12 5c-4-3-8-2-10-1v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-6-2-10 1Zm0 0v16"/>',
 shield:'<path d="M12 2 3 6v7c0 4 5 8 9 9 4-1 9-5 9-9V6zM8 12l3 3 5-6"/>',
 sources:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 12h8M8 16h6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 plan:'<path d="M9 5H4v17h16V5h-5M9 2h6v5H9zM8 12l1 1 2-2m2 1h3M8 17l1 1 2-2m2 1h3"/>',
 local:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
};
function icon(name){return `<svg class="sr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.book}</svg>`;}
function category(route){
 if(route.startsWith('/hulp/'))return {label:'Kennisbank',icon:'book',section:'/hulp/'};
 return ({'/subsidies/':{label:'Subsidies',icon:'subsidy',section:'/subsidies/'},'/btw/':{label:'Btw & belasting',icon:'vat',section:'/btw/'},'/financiering/':{label:'Financiering',icon:'finance',section:'/financiering/'},'/privacy/':{label:'Privacy',icon:'shield'},'/bronnen/':{label:'Bronnen & grenzen',icon:'sources'},'/over/':{label:'Over SubsidieReady',icon:'home'},'/404.html':{label:'Even de weg kwijt?',icon:'local'}})[route]||{label:'SubsidieReady',icon:'plan'};
}
function navigation(markup, route){
 const section=category(route).section;
 return markup.replace(/<a\b([^>]*?)href="(\/[^"]*)"([^>]*)>/g,(all,before,url,after)=>{
  if(/aria-current=/.test(before+after))return all;
  return url===route ? `<a${before}href="${url}"${after} aria-current="page">` : section&&url===section?`<a${before}href="${url}"${after} aria-current="location">`:all;
 });
}
function hero({route,title,intro=''}){
 const c=category(route);
 return `<section class="sr-page-hero" aria-labelledby="sr-page-title"><div class="sr-hero-art" aria-hidden="true"><img src="/assets/images/dashboard-home-small.webp" width="900" height="506" alt="" decoding="async"></div><div class="sr-hero-content"><nav class="sr-breadcrumb" aria-label="Kruimelpad"><a href="/">Home</a><span aria-hidden="true">/</span>${c.section&&route!==c.section?`<a href="${c.section}">${c.label}</a><span aria-hidden="true">/</span><span>Uitleg</span>`:`<span>${c.label}</span>`}</nav><div class="sr-eyebrow">${icon(c.icon)} ${c.label} <span>· SubsidieReady</span></div><h1 id="sr-page-title">${escape(title)}</h1>${intro?`<div class="sr-hero-description">${intro}</div>`:''}</div><div class="sr-hero-note"><span class="sr-check-medallion">${icon('check')}</span><div><strong>Helder uitgelegd.</strong><small>Jij bereidt voor. De uitvoerder beslist.</small></div></div></section>`;
}
function aside({sections=[],cta,ctaText}){
 return `<aside class="reading-aside" aria-label="Uitleg en vervolgstappen"><div class="article-aside-card sr-action-card"><div class="sr-action-art"><img src="/assets/images/dashboard-dossier.webp" alt="" width="160" height="160" loading="lazy" decoding="async"><span class="sr-action-kicker">JOUW VOLGENDE STAP</span></div><div class="article-aside-body"><h3>Van inzicht<br>naar jouw plan.</h3><p>${ctaText}</p>${cta}<small>Gratis · Geen account nodig</small></div></div>${sections.length?`<nav class="article-nav" aria-label="Op deze pagina"><strong>${icon('book')} In deze uitleg</strong>${sections.map((s,i)=>`<a href="#${s.id}"><span>${String(i+1).padStart(2,'0')}</span>${s.heading}</a>`).join('')}</nav>`:''}</aside>`;
}
function sections(body){
 const items=[];let count=0;
 let content=body.replace(/<h2>([^<]+)<\/h2>/g,(_,heading)=>{const id='onderdeel-'+(++count);items.push({id,heading});return `<h2 id="${id}">${heading}</h2>`;});
 // Keep every paragraph and official source verbatim; only wrap existing sections.
 const parts=content.split(/(?=<h2 id="onderdeel-\d+">)/);
 content=parts.map(part=>part.startsWith('<h2 ')?`<section class="sr-reading-section">${part}</section>`:part).join('');
 return {content,items};
}
module.exports={escape,icon,category,navigation,hero,aside,sections};
