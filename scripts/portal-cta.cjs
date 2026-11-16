'use strict';
// A static same-origin CTA. It never reads or transmits account/plan data.
function render(){
 return `<aside class="info-box" aria-labelledby="lead-pilot-title" style="min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere">
  <p class="eyebrow">Vrijblijvend advies van NIVO Groep Holland B.V.</p>
  <h2 id="lead-pilot-title">Past een thuisbatterij bij jouw woning?</h2>
  <p>Wil je verder kijken dan btw-regels? Stel jouw vraag rechtstreeks aan <strong>NIVO Groep Holland B.V.</strong>. Je vult zelf alleen de noodzakelijke contactgegevens in en bevestigt je e-mailadres voordat onze NIVO Portal-mailbox de aanvraag ontvangt.</p>
  <div class="button-row" style="box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;max-width:100%;min-width:0;padding:0;border:0;background:transparent">
    <a class="btn btn-secondary" style="white-space:normal;overflow-wrap:anywhere;min-width:0;max-width:100%;box-sizing:border-box;text-align:center" href="/advies/">Vraag vrijblijvend advies aan</a>
    <a style="white-space:normal;overflow-wrap:anywhere;min-width:0;max-width:100%;box-sizing:border-box" href="/privacy/">Privacy bij SubsidieReady</a>
  </div>
  <p>Dit is productadvies, geen beoordeling van een subsidie- of btw-recht. SubsidieReady stuurt geen ingevulde regelingencheck, accountgegevens of documenten mee. Alle gratis tools blijven beschikbaar.</p>
 </aside>`;
}
module.exports={render};
