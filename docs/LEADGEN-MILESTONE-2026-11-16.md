> **Vervolgproductbesluit 16 november 2026:** deze mijlpaal blijft een **historisch bewijs- en statussnapshot**. De toekomststrategie is nu vastgelegd in [PRODUCT-STRATEGY-2026-11-16.md](./PRODUCT-STRATEGY-2026-11-16.md), [DELIVERY-ROADMAP-2026-11-16.md](./DELIVERY-ROADMAP-2026-11-16.md) en [AGENT-START-HERE-2026-11-16.md](./AGENT-START-HERE-2026-11-16.md). Die documenten hebben voorrang voor toekomstige productprioriteiten; onderstaande echte bewijsgrenzen blijven relevant. Nieuwe productfuncties zijn in deze documentatiefase **niet** gebouwd.

# SubsidieReady — milestone en growth roadmap (16 november 2026)

**Doel:** SubsidieReady is een gratis en betrouwbaar verduurzamingsplatform dat vanuit nuttige, controleerbare tools en SEO-content zelfstandige, kwalitatieve **first-party adviesaanvragen voor NIVO Groep Holland B.V.** genereert. De online regelingencheck blijft bruikbaar zonder account; ingevulde plan-, fiscale, inkomens- en documentgegevens worden niet stilzwijgend aan sales doorgegeven.

## 1. Bewijs: directe NIVO Portal-leadroute is operationeel

**Eigenaaracceptatie 16 november 2026, circa 16:43 CET:** de eigenaar heeft in Outlook, in de mailbox **portal@nivogroepholland.nl**, de ontvangst getoond van een *daadwerkelijk ingediende* vrijwillige SubsidieReady-adviesaanvraag met onderwerp **SubsidieReady | Nieuwe adviesaanvraag**. De e-mail bevat de herkenbare `BEGIN_SUBSIDIEREADY_PORTAL_JSON` / `END_SUBSIDIEREADY_PORTAL_JSON`-markers, een unieke SR-aanvraagreferentie en `schema=subsidieready.nivo.portal.request.v2`. Herkenbaar waren ook `submitted_at_utc`, `address` met NAW, `email_verified=false`, `contact_requested=true`, `verification_method=none` en `marketing_opt_in=false`.

**Bewijsgrens:** dit bewijst ten minste één succesvolle productie-inzending én ontvangst door de bedoelde Portal-mailbox. Het bewijst niet algemene deliverability, een bestendige afleverkans bij piekbelasting, spambeveiliging in het veld, veilige automatische verwerking in de NIVO Portal, een opvolgafspraak of een klantconversie. Geen volledige e-mail, referentie, privétestgegevens, contactgegevens of screenshot met persoonsgegevens in de publieke repository bewaren.

| Onderdeel | Status op 16 november 2026 | Grenzen |
| --- | --- | --- |
| Premium publieke website en gratis basisfuncties | Live, eerdere browser- en sitechecks geslaagd | Regel-/brondekking onvolledig, geen toekenningsbelofte |
| Technische SEO en beperkte kennisbank | Basis gepubliceerd; indexeerbare informatieve routes | Geen bewezen Google-indexering, organisch bereik of Core Web Vitals-velddata |
| Optionele account-/planfunctie | Productieaccountconfig eerder geactiveerd; regressen gescheiden | Account is **geen** saleslead; echte individuele account-E2E blijft apart na te zien |
| Vrijwillige adviesintake met volledige NAW | Live; éénstapsformulier zonder e-mailcode | E-mail en telefoon niet onafhankelijk geverifieerd |
| Versleutelde uitgaande mailqueue en SMTP-worker | In productie gebruikt; eerste V2-mail werkelijk ontvangen | Queue-alerting, dead-letter/retry en leveringsgraad nog meetbaar maken |
| Portal-agent/CRM, kwalificatie, opvolging en omzetterugkoppeling | **Niet geïntegreerd in SubsidieReady** | Apart Portal-project; hier niet bouwen of stilzwijgend CRM-gegevens ophalen |
| Native leads/sales/staff/vault | Productieflags uit | Niet inschakelen zonder nieuwe expliciete P0-acceptatie |
| Privacyvriendelijke conver­siemeting | Geen bewezen end-to-end meetfunnel | Respecteer consent, GPC/DNT en dataminimalisatie |

**Code-/releasebewijs:** PR #47, squash-merge `9e5ba53455a2ef48559aab9f2f355e99e17b9b2e`; quality/release/Chromium CI en read-only [live acceptance run 43883375821](https://github.com/Michaelwmdegroot/SubsidieKlaar/actions/runs/43883375821) geslaagd.

## 2. Productkeuze: Zonnepanelen in plaats van dubbele PV-categorie

De openbare regelingencheck liet naast **Zonnepanelen** ook **PV-constructie** als apart gelijkwaardig selectietegel zien. Dit was bedoeld als aparte fiscale route voor carport, overkapping, nieuwbouwlevering of bouwkundige samenhang en **niet** als tweede soort zonnepaneleninstallatie. De gebruikersbenaming veroorzaakte onnodige dubbeling en twijfel.

**Nieuw ontwerpbesluit:**
- Eén hoofdmaatregel **Zonnepanelen** in de regelingencheck en bij het toevoegen van een nieuw maatregeltype aan *Mijn plan*.
- Als Zonnepanelen is geselecteerd, verschijnt een optionele verdiepende checkbox over carport/overkapping/bijzondere PV-constructie. Alleen dan wordt de extra fiscale specialistenroute getoond. De 0%- en betaalde-btw-routes blijven zichtbaar.
- In de zonnepanelenwerkbank is de bijzondere constructie een **detail bij zonnepanelen**; een apart planitem wordt niet meer aangeboden bij nieuwe plannen.
- Compatibiliteit: bestaande online/lokaal opgeslagen plannen met het historische `pv_constructie`-type blijven importeerbaar en bewerkbaar. Oude regelingenexports worden bij het inlezen genormaliseerd naar één zonnepanelenmaatregel met de bijzondere-constructiemarkering. **Geen mutatie of automatische samenvoeging van bestaande cloudprojecten.**
- Controleer de situatie bij een bijzondere constructie altijd per afzonderlijk bouw-/factuuronderdeel; niet alle bouwkosten krijgen automatisch 0% btw.

## 3. Prioriteiten om een zelfstandige leadmachine te worden

| Fase | Prioriteit en uit te voeren werk | Bewijs van gereedheid |
| --- | --- | --- |
| **P0: betrouwbare leadoperatie** | Overdracht mailcontract V2 aan Portal-agent; idempotente parser voor V1/V2, `request_id`-deduplicatie, status- en retentiebeleid, opt-out/suppressie, eenvoudige queue-, retry- en aflevermonitoring, spam-/misbruikmonitoring | Een ingediende aanvraag is per stap traceerbaar (queued → SMTP-accepted → Portal-received → qualified/invalid → first-contact), zonder privégegevens in openbare logs |
| **P1: SEO-fundament met echte metingen** | Google Search Console-eigendom/sitemap/indexeringsdata verifiëren; technische crawl, title/meta/canonical/noindex, mobiel en CWV beoordelen; prioritering op werkelijke zoekvragen | Inspecteerbare impressie-, klik- en indexeringsbaseline, geen verzonnen verkeerscijfers |
| **P1: converterende inhoud** | Betrouwbare, jaarlijks/maandelijks herbeoordeelde kenniscontent voor warmtepomp, isolatie, zonnepanelen/btw en thuisbatterij; contextuele, duidelijke CTA naar vrijwillige adviesintake; geen subsidies of voorwaarden verzinnen | Publiceerde pagina's hebben officiële bronnen, controledatum, correct disclosure en aantoonbare interne links/CTA's |
| **P1: conversie zonder frictie** | Kwalitatieve UX-review van tools en formulier op telefoon/Safari, sterkere waardepropositie en vertrouwen, juiste context per maatregel, snelheid/toegankelijkheid | Mobiel formulier bruikbaar; sollicitaties/leadrecords krijgen uitsluitend door bezoeker aangeleverde gegevens, geen verborgen profileringsvelden |
| **P2: privacyvriendelijke funnelmeting** | Definieer definitieve funnel en meet alleen toegestane geaggregeerde events met respect voor consent/GPC/DNT; externe zoekprestatie alleen met expliciete koppeling | Meetdefinities en werkelijke nullijn voor bezoeken → CTA → submit → received → qualified; geen gevoelige planinformatie in eventpayload |
| **P2: kwaliteit- en omzetloop** | In latere Portal-agent: topic, regio, valide bereikbaarheid, eerste respons, afspraak, offerte, gewonnen/verloren; terugkoppelen als geaggregeerde KPI's | Leadkwaliteit en daadwerkelijke sales kunnen over perioden worden vergeleken zonder ongevraagd account-/dossierdelen |
| **P3: schaal** | Met echte data een contentkalender en A/B-testhypothesen uitwerken; pas dan meer landingspagina's en automatisering. Herbeoordeel 2027-regels vóór productieclaims. | Continue broncontrole, zoekindexering en aantoonbare verbetering van gekwalificeerde aanvragen in plaats van klikvolume |

## 4. KPI-definities en non-goals

**Kernmaatstaf:** een *gekwalificeerde advieslead* is een uniek, vrijwillig ingestuurd verzoek dat de Portal ontvangt, voor het relevante NIVO-aanbod past en na opvolging een werkend contactkanaal blijkt te hebben. **Ingestuurd ≠ geverifieerd ≠ ontvangen ≠ gekwalificeerd ≠ afspraak ≠ verkocht**. Rapporteer per fase absolute aantallen, percentages alleen met heldere noemers en omzet alleen met werkelijk vastgelegde deals.

Niet als leads meetellen: een nieuwsbriefcheckbox, accountregistratie, lokaal of online bewaard plan, bezoek aan een subsidiepagina of een niet-afgeronde contactflow. Geen directe mail van accountgegevens naar sales; geen leadverkoop aan onbekende partners; geen blinde AI-subsidietoekenningen; geen niet-gevalideerde subsidiebedragen. De optionele commerciële marketingopt-in blijft los van adviesaanvragen.

## 5. Volgende eigenaar-/agentstap

1. Het gestructureerde V2-mailcontract doorgeven aan de afzonderlijke Portal-agent. Bevestig deduplicatie op `request_id`, opslag/retentie en een eerste contactprotocol.
2. Search Console en eerste echte organische cijfers verifiëren. Bij geen toegang of geen historie: markeer **onbekend**.
3. Vervolgens één specifieke, contextuele SEO-/conversieverbetering per kleine PR uitvoeren, zonder account- of dossier privacygrenzen aan te passen.
4. Hercontroleer relevante RVO-, Belastingdienst- en financieringsbronnen voor 2027 en hun ingangsdata. De bestaande controledatum 14 november 2026 is **geen officiële geldigheidsdatum**.

**Gerelateerde resources:** [NIVO Portal-mailcontract](./NIVO-PORTAL-LEAD-MAIL-HANDOFF-2026-11-16.md), [canonieke leadgen-overdracht](./HANDOFF-NIVO-LEADGEN-2026-11-15.md), [Issue #21](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/21), [Issue #9](https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/9).
