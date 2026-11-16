/* NIVO first-party advice: direct one-step guest request, no OTP or account.
   Explicit request-only contact, strict server validation and queue idempotency. */
(function(){'use strict';
 const api=window.SRCloud,root=document.getElementById('advice-app'),status=document.getElementById('advice-status');
 if(!root||!api||!status)return;
 const VERSION='2026-11-16-nivo-portal-v2';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const topics=[['thuisbatterij','Thuisbatterij'],['zonnepanelen','Zonnepanelen'],['laadpaal','Laadpaal'],['warmtepomp','Warmtepomp'],['airco','Airconditioning'],['algemeen','Anders / algemeen']];
 const times=[['orientation','Ik oriënteer me'],['now','Zo snel mogelijk'],['3months','Binnen 3 maanden'],['later','Op een later moment']];
 const channels=[['email','Graag per e-mail'],['phone','Bel mij liever']];
 const opts=a=>a.map(([v,label])=>'<option value="'+v+'">'+label+'</option>').join('');
 let submitting=false,submissionId='';
 const write=t=>{status.textContent=t;status.setAttribute('role',t?'status':'presentation');};
 const freshId=()=>{if(window.crypto&&window.crypto.randomUUID)return window.crypto.randomUUID();const b=new Uint8Array(16);window.crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);};
 function renderForm(){
  submissionId=freshId();
  root.innerHTML=[
   '<div class="p-advice p-portal">',
   '<div class="sr-lead-hero"><div><div class="eyebrow">GRATIS PERSOONLIJK ADVIES · NIVO GROEP HOLLAND</div>',
   '<h1>Goed advies begint bij jouw woning.</h1>',
   '<p>Vertel wat je wilt verduurzamen. Ons team neemt vrijblijvend contact op over jouw aanvraag.</p></div>',
   '<div class="sr-lead-trust"><span>✓ Zonder account</span><span>✓ Geen verificatiecode</span><span>✓ Rechtstreeks naar NIVO</span></div></div>',
   '<form id="portal-advice-form" class="p-card p-portal-form">',
   '<div class="sr-lead-title"><span>01</span><strong>Waarmee kunnen we je helpen?</strong></div>',
   '<div class="sr-lead-grid">',
   '<label class="p-field sr-span-4"><span>Onderwerp</span><select name="topic" required>'+opts(topics)+'</select></label>',
   '<label class="p-field sr-span-4"><span>Wanneer?</span><select name="timeline" required>'+opts(times)+'</select></label>',
   '<label class="p-field sr-span-4"><span>Contactvoorkeur</span><select name="channel" id="portal-channel" required>'+opts(channels)+'</select></label>',
   '</div>',
   '<div class="sr-lead-title sr-lead-title-contact"><span>02</span><strong>Hoe bereiken we je?</strong><small>Vul je contact- en adresgegevens in</small></div>',
   '<div class="sr-lead-grid">',
   '<label class="p-field sr-span-4"><span>Voor- en achternaam</span><input name="name" autocomplete="name" required maxlength="100" minlength="2" placeholder="Je volledige naam"></label>',
   '<label class="p-field sr-span-4"><span>E-mailadres</span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="naam@voorbeeld.nl"></label>',
   '<label class="p-field sr-span-4"><span>Telefoonnummer</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" minlength="9" maxlength="24" required placeholder="06 1234 5678"></label>',
   '<label class="p-field sr-span-5"><span>Straat</span><input name="street" autocomplete="address-line1" required maxlength="120" placeholder="Straatnaam"></label>',
   '<label class="p-field sr-span-2"><span>Huisnummer</span><input name="houseNumber" required maxlength="20" placeholder="12A"></label>',
   '<label class="p-field sr-span-2"><span>Postcode</span><input name="postalCode" autocomplete="postal-code" required maxlength="7" pattern="[1-9][0-9]{3} ?[A-Za-z]{2}" placeholder="1234 AB"></label>',
   '<label class="p-field sr-span-3"><span>Woonplaats</span><input name="city" autocomplete="address-level2" required maxlength="100" placeholder="Woonplaats"></label>',
   '<label class="p-field sr-span-12 sr-lead-note"><span>Je vraag <small>(optioneel)</small></span><textarea name="note" maxlength="500" rows="2" placeholder="Is er iets dat we vooraf moeten weten?"></textarea></label>',
   '</div>',
   '<label class="sr-honeypot" aria-hidden="true">Website<input type="text" name="website" autocomplete="off" tabindex="-1"></label>',
   '<div class="sr-lead-bottom"><label class="p-toggle p-portal-consent"><input type="checkbox" name="contactRequested" required><span>Ik wil dat NIVO Groep Holland B.V. mij per e-mail of telefoon benadert over deze aanvraag en heb de <a href="/privacy/" target="_blank" rel="noopener noreferrer">privacyverklaring</a> gelezen. Dit geldt niet voor nieuwsbrieven of andere reclame.</span></label>',
   '<div class="sr-lead-actions"><button class="p-btn primary" type="submit">Verstuur mijn aanvraag <span aria-hidden="true">→</span></button><small>Gratis en vrijblijvend. Je hoeft geen code in te vullen.</small></div></div>',
   '</form><p class="sr-lead-footnote">Je aanvraag gaat uitsluitend naar NIVO Groep Holland B.V. Er worden geen accountgegevens, documenten of subsidieresultaten meegestuurd.</p>',
   '</div>'
  ].join('');
 }
 function renderSuccess(ref){
  root.innerHTML=[
   '<section class="p-card p-portal p-portal-success" role="status"><div class="eyebrow">AANVRAAG ONTVANGEN</div>',
   '<h1>Bedankt! Je aanvraag staat klaar voor NIVO.</h1>',
   '<p>Je aanvraag is in de beveiligde verzendwachtrij geplaatst, zonder verificatiecode. Het NIVO-team ontvangt deze via de eigen Portal-mailbox.</p>',
   '<p><strong>Jouw referentie:</strong> <code>'+esc(ref)+'</code></p>',
   '<p>We gebruiken je gegevens alleen om je over deze aanvraag te benaderen, niet voor nieuwsbrieven.</p>',
   '<a class="p-btn secondary" href="/regelingen/">Verder met de gratis regelingencheck</a></section>'
  ].join('');
 }
 document.addEventListener('submit',async e=>{
  if(e.target.id!=='portal-advice-form')return;
  e.preventDefault();if(submitting||!e.target.reportValidity())return;
  submitting=true;const button=e.target.querySelector('[type=submit]');if(button)button.disabled=true;write('');
  try{
   const f=new FormData(e.target);
   if(!f.has('contactRequested'))throw Error('Geef eerst toestemming voor contact over je aanvraag.');
   const data={purpose:'portal',privacyVersion:VERSION,contactRequested:true,submissionId};
   for(const key of ['topic','timeline','channel','name','email','phone','street','houseNumber','postalCode','city','note','website'])data[key]=f.get(key)||'';
   const result=await api.post('portal-submit',data);
   if(!result.portalQueued||!result.reference)throw Error('Je aanvraag kon niet veilig worden opgeslagen. Probeer opnieuw.');
   renderSuccess(result.reference);write('');
  }catch(error){write(error?.message||'Er is iets misgegaan. Probeer het opnieuw.');}
  finally{submitting=false;if(button&&button.isConnected)button.disabled=false;}
 });
 api.bootstrap().then(state=>{
  if(state.configured&&state.portalAdvice){renderForm();return;}
  root.innerHTML='<div class="p-card"><h1>Advies aanvragen</h1><p>De aanvraagdienst is tijdelijk niet beschikbaar. Je kunt de gratis tools zonder account blijven gebruiken.</p><a class="p-btn primary" href="/regelingen/">Naar de regelingencheck</a></div>';
 }).catch(()=>{root.innerHTML='<p class="p-card">Adviesaanvragen zijn tijdelijk niet bereikbaar. De gratis tools blijven werken.</p>';});
})();
