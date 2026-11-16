# SubsidieReady — gebruikersreizen, gratis accountwaarde en NIVO-advies

**Status:** productblauwdruk, eigenaar heeft de richting goedgekeurd; **niet gelijk aan uitontwikkelde features**.
Lees eerst [PRODUCT-STRATEGY-2026-11-16.md](./PRODUCT-STRATEGY-2026-11-16.md). Bij verschillen met oudere prototypes heeft dat productbesluit voorrang. Werkelijke API- en hostingstatus komt uit de actuele code en uit live QA.

## A. De ononderbroken gratis reis

1. Van Google/een link naar een feitelijke pagina of de homepage. Er zijn geen verplichte cookie-, account-, offerte- of betaalstappen om te lezen.
2. Bezoeker start de regelingencheck, kiest rol/woning/maatregel, krijgt echte **informatieroutes** en ontbrekende controles; bronverval en de onvolledigheid van lokale dekking zijn zichtbaar.
3. Bezoeker kan door naar de relevante gratis werkbank, algemene informatie, lokale planfunctie, PDF/ZIP of export. **Geen verborgen automatische POST naar sales.**
4. Op het inhoudelijk passende moment zijn twee extra keuzes zichtbaar: *bewaar/hervat mijn plan* en *vraag vrijblijvend passend installatieadvies*. De primaire gratis taak blijft bereikbaar als geen van beide wordt gekozen.
5. Als iemand vertrekt, ontvangt die zonder eigen verzoek **geen reclame, belletje of follow-up**.

**Acceptatie:** het hele traject werkt op telefoon en desktop zonder naam/e-mail/telefoon, zonder adviesmail en zonder het accepteren van marketing; niet-geautoriseerde endpoints krijgen geen persoonlijke inhoud.

## B. Account als persoonlijke verduurzamingsassistent

### Account-MVP — bewijs vóór uitbreiding

- Behoud gratis gastmodus, lokale planexport en bestaande PDF/ZIP.
- Accountaanmaak/inlog is optioneel via bestaande e-mail-OTP (los van het adviesformulier); éénmalig, tijdgebonden en begrensd.
- Laat accountvoordelen concreet zien vóór registratie: voortgang online terugvinden, meerdere maatregelen volgen, op een ander apparaat verdergaan.
- De gebruiker kiest uitdrukkelijk welke plannen online worden bewaard. Geen stille upload van lokaal plan, bijlagen, subvraagantwoorden of resultaat.
- Cross-browser downloaden/herstellen, conflictmelding bij verouderde revisies, eigen data exporteren, corrigeren en verwijderen dienen met fictieve data werkelijk getest te zijn.
- Bewaar geen wachtwoord of OTP in GitHub/logs. Accounts betekenen **geen** NIVO-adviesaanvraag. De optionele marketingcheckbox is los en standaard uit.

### Daarna: nuttige dagelijkse accountwaarde

- Een projectoverzicht per woning/verduurzamingsproject met maatregelen, relevante statussen en nog te controleren feiten.
- Een beknopte "volgende zinvolle stap" in neutrale taal, met primaire bron, controledatum en waarschuwing bij verval. Geen officieel subsidiebedrag of fictieve haalbaarheid.
- Taken per maatregel en uitvoeringsfase; verantwoorde afbakening van bijlagen/documenten (huidige online kluis uit totdat beveiliging is goedgekeurd).
- Eigen wijzigingen zichtbaar en onomkeerbare handelingen met duidelijke bevestiging.
- Zelf te kiezen herinnering over een eigen deadline, in eerste instantie generieke informatie zonder dossierinhoud in e-mail. Onnodige meldingen of dagelijkse commerciële triggers niet toestaan.
- Relevante geverifieerde wijzigingen in regelgeving: pas na redactiereview, opt-in en duidelijk uitzetten; nooit automatisch claims updaten op basis van een onbevestigde webpagina.

**Definitie van "assistent":** een betrouwbaar taak- en informatiehulpmiddel dat initiatief toont binnen expliciet gekozen functies. Geen zelfhandelende installateur, fiscaal adviseur, juridisch loket of autonome ChatGPT-chat op persoonlijke documenten.

### Account-UX aanbeveling

- **Bij eerste bezoek:** geen accountmodal over het resultaat heen.
- **Na bruikbare uitkomst:** kleine keuze "Wil je dit plan later weer openen? Gratis online bewaren" met zichtbare "Nee, zonder account verder".
- **Na inloggen:** helder overzicht, voortgang, volgende taak en het onderscheid tussen lokaal/online bewaard.
- **Bij contactvraag:** géén automatisch gebruik van accountgegevens voor sales. Bij eventuele toekomstige expliciete voorinvulling: eerst apart besluit, zichtbare preview, uitsluitend noodzakelijke velden en vrijwillig versturen.

## C. Service blueprint NIVO: hulp wanneer de consument dat wil

### Voorwaarden voor iedere aanbodkaart

- De consument heeft de relevante informatie of tooluitkomst al kunnen zien.
- De kaart zegt: *dit is advies over NIVO-installatiediensten*; noemt NIVO Groep Holland B.V. en legt concreet uit wat de consument ontvangt.
- De offerte/adviesvraag is **vrijwillig**, los van account/marketing en zonder verborgen plantransfer.
- Er zijn geen verzonnen prijzen, fictieve voordelen, deadlines of gegarandeerde terugverdientijden.
- Het gratis pad en officiële bronverwijzingen blijven zichtbaar.
- Niet meer dan één primaire, inhoudelijk passende adviesoptie per beslismoment; geen overal identieke banners of pop-ups.

### Aanbevolen kaartinhoud per onderwerp (eerst NIVO-serviceaanbod checken)

| Onderwerp | Zinvolle aanleiding | Waarde van eventueel NIVO-contact | Wat NIET beloven |
| --- | --- | --- | --- |
| Thuisbatterij | Capaciteit, gebruik of technische installatievragen | Oriëntatie over aansluiting, batterijopbouw, EMS, praktische haalbaarheid | Vast rendement, altijd 21% terug |
| Zonnepanelen | Installatie-/systeemvoorbereiding | Oriëntatie over dak, omvormer, opstelling, offertevraag | Gegarandeerde terugleveropbrengst of fiscale goedkeuring |
| Warmtepomp | Onzeker over toestel/afgiftesysteem | Eerste technische oriëntatie passend bij de woning | Zeker subsidie of officieel ISDE-besluit |
| Laadpaal | Aansluiting/laadvermogen | Inzicht in mogelijkheden en installatietraject | Gegarandeerde capaciteit zonder netbeheercheck |
| Airco | Koelen en verwarmen | Inzicht in capaciteit en plaatsing | Exact verbruik zonder situatiegegevens |

Schrijf CTA's als *"Bespreek de mogelijkheden voor jouw woning"* en ondersteun met een zin over de **inhoudelijke waarde**, niet als een blinde knop "Vraag offerte".

### Actuele route (blijft staan)

- `/advies/`: vrijwillige, direct verstuurde aanvraag met NAW, e-mail en telefoon; geen advies-OTP.
- Eén verplichte, standaard lege toestemming voor **contact over deze concrete aanvraag**; niet een nieuwsbrief of ongevraagd vervolg.
- Huidig contract `subsidieready.nivo.portal.request.v2` naar `portal@nivogroepholland.nl`. `request_id` als deduplicatiesleutel; `email_verified=false` en `verification_method=none` moeten in de Portal behouden blijven.
- Eén werkelijke inboxontvangst werd op 16 november 2026 door eigenaar getoond, maar verdere automatische verwerking en algemene aflevergraad zijn niet bewezen.
- Bij aanpassing aan minder formulierverplichting: nieuw copy-/privacy-/meetspec en eigenaar-GO vereist. **Niet stiekem huidig NAW-gedrag wijzigen in het kader van CTA-werk.**

### Vereiste NIVO-operatie vóór nieuwe CTA-beloften

- Leg per product vast welk NIVO-team deze dienst daadwerkelijk kan leveren, wie eigenaar van de opvolging is en welke technische vragen binnen de eerste vrijblijvende oriëntatie vallen.
- Stem ontvangstbevestiging, toegezegde reactieperiode, voorkeur voor e-mail of telefonisch contact, bezwaar/intrekking en overdrachts-/retentiebeleid af. **Geen niet-geverifieerde responstijden publiceren.**
- Laat sales toetsen of er voldoende informatie is voor een *nuttig* eerste gesprek; vergroot de intake pas als dat objectief nodig blijkt, zonder lange drempels.
- Een bezoeker die alleen relevante subsidies zoekt of al klaar is met de installatie blijft nuttige gratis hulp krijgen; geen standaard nieuw verkoopverzoek.

## D. Gescheiden verantwoordelijkheid en privacy

**SubsidieReady (deze repo):** product, gratis tools, optionele account-/projectservice, toestemming- en zendpunt, privacyvriendelijke website-SEO; bewaart alleen wat de gebruiker apart heeft gekozen.

**NIVO Portal (ander project):** inboxparser, idempotente registratie, contactgegevens minimaliseren, first contact, kwalificatie, opvolging, afspraak/offerte/verkoop, bezwaar, retentie en geaggregeerde kwaliteitsterugkoppeling. In deze repo alleen het mailcontract onderhouden; **geen nieuwe Portal-app bouwen**.

**Gebruiker:** bepaalt of, wanneer en hoe contact wordt gevraagd. Geen contact na een alleen informatief toolgebruik.

Zie [METRICS-SEO-TRUST-2026-11-16.md](./METRICS-SEO-TRUST-2026-11-16.md) voor observatie zonder commerciële surveillance.
