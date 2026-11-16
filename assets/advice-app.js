/* NIVO first-party portal advice: explicit guest request, email OTP, then queued mail.
   No implicit account/profile/plan collection, no analytics or cross-domain transfer. */
(function(){'use strict';
 const api=window.SRCloud,root=document.getElementById('advice-app'),status=document.getElementById('advice-status');
 if(!root||!api||!status)return;
 const VERSION='2026-11-16-nivo-portal-v1';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let challenge='',pendingEmail='',submitting=false;
 const write=t=>{status.textContent=t;status.setAttribute('role',t?'status':'presentation');};
 const topics=[['thuisbatterij','Thuisbatterij'],['zonnepanelen','Zonnepanelen'],['laadpaal','Laadpaal'],['warmtepomp','Warmtepomp'],['airco','Airconditioning'],['algemeen','Overige verduurzamingsvraag']];
 const timeline=[['orientation','Ik oriënteer me'],['now','Zo snel mogelijk'],['3months','Binnen 3 maanden'],['later','Later']];
 function renderForm(){
  root.innerHTML=`<div class="p-advice p-portal">
   <section class="p-heading"><div><div class="eyebrow">VRIJBLIJVEND ADVIES · NIVO GROEP HOLLAND</div><h1>Persoonlijk advies over jouw woning.</h1><p class="p-muted">Vertel kort waarmee we je kunnen helpen. Je stuurt alleen deze aanvraag naar NIVO Groep Holland B.V. — nooit je account, subsidieresultaten of opgeslagen documenten.</p></div></section>
   <div class="p-banner"><strong>Gratis en zonder account.</strong> We controleren eerst je e-mailadres met een eenmalige code. Pas daarna sturen we jouw aanvraag door naar het interne NIVO-team.</div>
   <form id="portal-advice-form" class="p-card p-portal-form">
    <div class="p-portal-section"><span>01</span><strong>Waarover wil je advies?</strong></div>
    <div class="p-fields">
     <label class="p-field"><span>Onderwerp</span><select name="topic" required>${topics.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>
     <label class="p-field"><span>Wanneer?</span><select name="timeline">${timeline.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>
    </div>
    <div class="p-portal-section"><span>02</span><strong>Hoe bereiken we je?</strong></div>
    <div class="p-fields">
     <label class="p-field"><span>Naam</span><input name="name" autocomplete="name" required maxlength="100" placeholder="Voor- en achternaam"></label>
     <label class="p-field"><span>E-mailadres <small>(voor verificatie)</small></span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="jij@voorbeeld.nl"></label>
     <label class="p-field"><span>Gewenste contactwijze</span><select name="channel" id="portal-channel"><option value="email">Neem per e-mail contact met me op</option><option value="phone">Bel me over mijn adviesvraag</option></select></label>
     <label class="p-field" id="portal-phone-field" hidden><span>Telefoonnummer</span><input name="phone" type="tel" autocomplete="tel" maxlength="22" placeholder="06 1234 5678"></label>
     <label class="p-field"><span>Postcodegebied <small>(optioneel, 4 cijfers)</small></span><input name="area" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="1234"></label>
    </div>
    <label class="p-field"><span>Waar wil je meer over weten? <small>(optioneel)</small></span><textarea name="note" maxlength="500" rows="3" placeholder="Omschrijf je vraag kort. Stuur geen persoonsgegevens van anderen, financiële gegevens of bijlagen."></textarea></label>
    <label class="p-toggle p-portal-consent"><input type="checkbox" name="contactRequested" required><span id="portal-consent-text">Ik vraag NIVO Groep Holland B.V. mij per e-mail te benaderen over deze adviesvraag. Ik heb de <a href="/privacy/" target="_blank" rel="noopener noreferrer">privacyverklaring</a> gelezen. Dit is geen toestemming voor nieuwsbrieven of andere reclame.</span></label>
    <div class="p-portal-actions"><button class="p-btn primary" type="submit">Vraag vrijblijvend advies aan <span aria-hidden="true">→</span></button><small>De aanvraag wordt pas doorgestuurd na e-mailverificatie.</small></div>
   </form>
   <p class="p-mini">NIVO Groep Holland B.V. is verantwoordelijk voor deze aanvraag. Het interne team ontvangt je bericht op de eigen Portal-mailbox. Je hoeft geen account aan te maken of je plan te delen.</p>
  </div>`;
  const f=root.querySelector('#portal-advice-form');const channel=f.elements.channel,phone=f.elements.phone,box=f.elements.contactRequested;
  channel.addEventListener('change',()=>{
   const call=channel.value==='phone';
   document.getElementById('portal-phone-field').hidden=!call;
   phone.required=call;if(!call)phone.value='';
   box.checked=false;
   document.getElementById('portal-consent-text').innerHTML=`Ik vraag NIVO Groep Holland B.V. mij ${call?'telefonisch':'per e-mail'} te benaderen over deze adviesvraag. Ik heb de <a href="/privacy/" target="_blank" rel="noopener noreferrer">privacyverklaring</a> gelezen. Dit is geen toestemming voor nieuwsbrieven of andere reclame.`;
  });
 }
 function renderVerify(){
  root.innerHTML=`<section class="p-card p-portal p-portal-verify"><div class="eyebrow">CONTROLEER JE E-MAIL</div>
   <h1>Bijna klaar.</h1><p>We hebben een eenmalige 8-cijferige code verstuurd naar het opgegeven e-mailadres. Vul de code hier in binnen 10 minuten. Pas na een juiste code sturen we je adviesaanvraag naar NIVO.</p>
   <form id="portal-code-form"><label class="p-field"><span>Verificatiecode</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" required placeholder="8 cijfers"></label><button class="p-btn primary" type="submit">Bevestig en verstuur aanvraag</button></form>
   <button class="p-btn quiet" type="button" id="portal-reset">Opnieuw beginnen</button>
  </section>`;
 }
 function renderSuccess(ref){
  root.innerHTML=`<section class="p-card p-portal p-portal-success" role="status"><div class="eyebrow">AANVRAAG BEVESTIGD</div><h1>Bedankt! Je aanvraag is geverifieerd.</h1>
   <p>SubsidieReady heeft je aanvraag in de beveiligde NIVO-verzendwachtrij geplaatst. De ontvangst door de NIVO Portal wordt afzonderlijk verwerkt.</p>
   <p><strong>Referentie:</strong> <code>${esc(ref)}</code></p>
   <p>Je ontvangt geen nieuwsbrief door deze aanvraag. Alleen contact over het onderwerp dat je zelf hebt gekozen.</p>
   <a class="p-btn secondary" href="/regelingen/">Verder met de gratis regelingencheck</a>
  </section>`;
 }
 document.addEventListener('submit',async e=>{
  if(!['portal-advice-form','portal-code-form'].includes(e.target.id))return;
  e.preventDefault();if(submitting)return;
  submitting=true;const submit=e.target.querySelector('[type=submit]');if(submit)submit.disabled=true;write('');
  try{
   if(e.target.id==='portal-advice-form'){
    const f=new FormData(e.target);
    if(!f.has('contactRequested'))throw Error('Vink aan dat je over je adviesvraag wilt worden benaderd.');
    const data={purpose:'portal',privacyVersion:VERSION,contactRequested:true};
    for(const key of ['topic','timeline','name','email','phone','channel','area','note'])data[key]=f.get(key)||'';
    pendingEmail=data.email;
    const result=await api.post('auth-start',data);
    challenge=result.challenge;renderVerify();write('Controleer je mailbox voor de eenmalige code.');
   }else{
    const f=new FormData(e.target);
    const result=await api.post('auth-verify',{challenge,code:f.get('code')||''});
    if(!result.portalQueued)throw Error('Je aanvraag kon niet veilig worden bevestigd.');
    challenge='';pendingEmail='';renderSuccess(result.reference);write('Je aanvraag is geverifieerd en klaargezet voor NIVO.');
   }
  }catch(err){write(err?.message||'Er is iets misgegaan. Probeer het opnieuw.');}
  finally{submitting=false;if(submit&&submit.isConnected)submit.disabled=false;}
 });
 root.addEventListener('click',e=>{if(e.target.id==='portal-reset'){challenge='';pendingEmail='';write('');renderForm();}});
 api.bootstrap().then(state=>{
  if(state.configured&&state.portalAdvice){renderForm();return;}
  root.innerHTML='<div class="p-card"><h1>Advies aanvragen</h1><p>De aanvraagdienst is tijdelijk niet beschikbaar. Je kunt de gratis tools zonder account blijven gebruiken.</p><a class="p-btn primary" href="/regelingen/">Naar regelingencheck</a></div>';
 }).catch(()=>{root.innerHTML='<p class="p-card">Adviesaanvragen zijn tijdelijk niet bereikbaar. De gratis tools blijven werken.</p>';});
})();