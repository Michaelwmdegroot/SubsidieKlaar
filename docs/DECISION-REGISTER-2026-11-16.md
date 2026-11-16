# SubsidieReady — productbesluiten en open beslissingen

**Besluitmoment:** 16 november 2026, door eigenaar expliciet akkoord gegeven op de besproken productfilosofie. **Doel:** voorkomen dat toekomstige agents hypotheses, historische tekst en productieacceptatie door elkaar halen. Een code-merge geeft niet automatisch goedkeuring aan een nieuwe marketing- of privacytoepassing.

## A. Vastgesteld / bindend voor verdere richting

| ID | Besluit | Consequentie |
| --- | --- | --- |
| D-01 | Behoud SubsidieReady-naam, goedgekeurde premium vormgeving, bestaande werkbanken, gratis consumentenplatform. **Geen conceptuele herbouw.** | Kleine hoogwaardige iteraties, geen nieuw productconcept of redesign zonder nieuw eigenaarbesluit |
| D-02 | De volledige bestaande gasttool, officiële uitleg en PDF/ZIP blijven bruikbaar zonder account en contactgegevens. | Geen paywall, e-mailgate, pop-updwang of verborgen leadcreate op toolgebruik |
| D-03 | Een gratis account is een **persoonlijke verduurzamingsassistent**: plan online bewaren/hervatten, relevante taken, voortgang en later alleen optionele gecontroleerde herinneringen. | Begin met bewijzen bestaande account-E2E; UX-waarde boven marketing |
| D-04 | NIVO Groep Holland B.V. is zichtbaar exploitant en potentiële **commerciële installatieadviesdienst**. | Officiële regelingeninformatie is neutraal en juist, NIVO-servicekaart transparant en optioneel |
| D-05 | NIVO-contact ontstaat alleen na zelfstandige, expliciete, relevante adviesaanvraag; gegevens uit account, fiscale vragen, projectinhoud, bestanden en inkomensvragen gaan niet automatisch naar sales. | Isolatie van datastromen, geen account=lead, echte consent, vaste server-side ontvanger |
| D-06 | Advies moet een concreet consumentprobleem oplossen; niet alleen "offerteformulier tonen". | Contextuele kaart *na* nuttige hulp, met werkelijke operationele NIVO-waarde; geen nep-SLA |
| D-07 | Huidige formulierroute en mailcontract V2 blijven operationeel totdat een apart besluit een wijziging toestaat. | `/advies/`, NAW/e-mail/telefoon, expliciet verzoek, geen advies-OTP, `portal@nivogroepholland.nl`, `email_verified=false` |
| D-08 | Eerst productstrategie volledig documenteren zodat iedere agent kan voortbouwen, **in dit werkpakket geen functies bouwen**. | Documentation-only PR, geen website-, backend-, betaal-, marketing- of productieconfigwijziging |
| D-09 | Langetermijndoel is **consumentenwaarde én gekwalificeerde vrijwillige NIVO-hulp**, niet zoveel mogelijk inschrijvingen of ruwe leads. | Meet beide uitkomsten, geen dark patterns of schadelijke salesdruk |
| D-10 | De persoonlijke assistent mag informatie en eigen taken verduidelijken, maar geen niet-getoetste automatische subsidie-/btw-/kredietbesluiten doen. | Menselijke bronreview, versie-/datumgrenzen en officiële uitvoerder blijft beslissend |
| D-11 | NIVO Portal-agent verwerkt mail/opvolging in eigen project, niet als verborgen koppeling in SubsidieReady. | Idempotent mailcontract en geaggregeerde feedback; geen eigen verkoopsysteem in deze repo |
| D-12 | Open-source/laagkosttechniek en zelfstandigheid op bestaande Hostinger/PHP/HTML/GitHub blijven uitgangspunt. | Geen kosten-/abonnement-/infra-upgrade zonder nieuw eigenaarbesluit |

## B. Bestaande bewezen mijlpalen, geen nieuwe beloftes

- PR #47: directe afzonderlijke NIVO-adviesroute; minimaal één vrijwillige V2-aanvraag daadwerkelijk ontvangen in NIVO Portal-mailbox op 16 november 2026. Niet hetzelfde als bulkdeliverability/Portal-parser/uitgebreide salesopvolging.
- PR #48: Zonnepanelen en PV-constructie als één hoofdmaatregel + optionele special-case; behouden legacy-plannen. Gebouwde code- en livechecks groen na herhaling.
- Database, account-gates en SMTP zijn eerder technisch gecontroleerd, maar echte accountregistratie/inlog/plansync/export/delete E2E blijft nog afzonderlijk te bewijzen.
- SEO/Google Search Console-trends en echte conversies blijven onbekend totdat iemand met echte bron toegang meet.

## C. Richting goedgekeurd, uitvoering/performance nog niet bewezen

| Hypothese / feature | Eerst vereist |
| --- | --- |
| Gedetailleerde persoonlijke actielijst in Mijn plan | Werkende account-E2E, gecontroleerde bron- en taakstatussen, klein UX-bewijs |
| Geautomatiseerde herinneringen/regelmails | Opt-in, redactiereview, source freshness, mailcapaciteit, uitschrijven, security/privacy |
| Contextuele NIVO-advieskaarten op extra pagina's | Werkelijke adviesdienst per onderwerp, bruikbare copy, operationele acceptatie en gratis vervolg |
| Korter adviesformulier voor oriëntatie | Nieuw eigenaarbesluit, gegevensminimalisatie, tests en effect op bereikbaarheid |
| NIVO Portal-opvolgproces met meetbare servicekwaliteit | Apart Portal-team en idempotente V1/V2-parser, retentie, contactvoorkeur/suppressie |
| Gedrags- en conversieanalytics | Consent-/GPC-/DNT-review, enumerated events, geen identificeerbare data |
| SEO-uitbreiding incl. lokale pagina's en 2027-regels | Werkelijke Search Console-baseline en actuele primaire bronreview |
| Online bijlagen/AI/DigiD-/belastingkoppeling | Expliciete nieuwe product-, juridische, security-, kosten- en DPIA/risico-go |

## D. Expliciet NIET besloten / uitgesloten

Geen abonnement of premium betaalmuur, geen verplichte accountregistratie, geen autonome AI-salesberichten, geen automatische account-/plan-naar-Portal-doorgifte, geen verkoop aan onafhankelijke installatiepartners, geen rangschikking van overheidsinformatie naar NIVO-marge, geen financieringsbemiddeling, geen fictieve subsidies, geen marketingtracking zonder rechtmatige toestemming, geen nieuwe directe Portal-API-vereiste.

Niet-aangetoonde NIVO-reactietijden, korting/prijs of producten mogen niet publiek worden beloofd. Een nieuwe agent mag deze alleen als voorstel uitwerken.

## E. Wijzigingsproces

1. Verwijs naar besluit-ID en exact huidig bewijs.
2. Beschrijf consumentenbelang, risico en gevolgen voor gratis pad/privacystromen.
3. Markeer voorgestelde wijziging eerst "PENDING OWNER GO".
4. Pas dit register **pas na expliciete eigenaaracceptatie** aan, met datum en gelinkte issue/PR.
5. Bouw en activeer pas na de fasegates in [DELIVERY-ROADMAP-2026-11-16.md](./DELIVERY-ROADMAP-2026-11-16.md).
