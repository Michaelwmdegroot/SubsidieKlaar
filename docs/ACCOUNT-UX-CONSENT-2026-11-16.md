# Account UX 2.0 — contactprofiel, conversie en toestemming

**Status:** implementatiebranch 16 november 2026; productieacceptatie en onafhankelijke juridische review blijven afzonderlijk te bewijzen.

## Aanleiding en werkelijk productiebewijs

De eigenaar heeft in de eigen browser een optionele accountregistratie met werkelijke 8-cijferige verificatiemail en een ingelogde sessie getoond, plus een export van eigen accountgegevens. De export toont een geregistreerde, vrijwillige marketing-e-mailvoorkeur; geen opgeslagen online projecten. **Het e-mailadres, de verificatiecode, cookies en de export zelf zijn niet naar GitHub gekopieerd.**

De gebruiker vraagt om een netter accountformulier met naam/adres/telefoon, één gecombineerd vinkje en het automatisch benaderen van nieuwe accounts als saleslead. Wij geven prioriteit aan het commerciële doel, maar volgen geen verplichte reclame-/beltoestemming: volgens de officiële AP moet toestemming vrij, specifiek en aantoonbaar zijn. De ACM verlangt sinds juli 2026 expliciete toestemming voor commerciële telefoongesprekken, met product-/kanaalbeperking en intrekking.

Primaire bronnen:
- https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming
- https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/verkoop-telemarketing
- https://www.acm.nl/nl/publicaties/vanaf-1-juli-strengere-regels-voor-telemarketing-alleen-nog-maar-als-klant-toestemming-heeft-gegeven

## Gekozen uitvoering

- Een premium registratie-/login-modal met dezelfde wit/navy/groene huisstijl; responsive tweekolomsindeling voor compactere invoer.
- E-mailadres vereist om de éénmalige code te ontvangen.
- **Optioneel** naam, telefoon, straat, huisnummer, postcode en plaats; nooit vereist voor gratis account of planexport. Geen BSN, geboortedatum, inkomen, energieverbruik, fiscaal dossier of bijlagen verzameld.
- Er blijft **één verplicht checkbox-vinkje** over, uitsluitend voor actuele accountvoorwaarden en kennisneming van de privacyverklaring.
- Commerciële e-mails: afzonderlijk, **standaard uitgevinkt opt-in-vinkje** voor NIVO per e-mail naast het verplichte akkoord met de accountvoorwaarden. Deze keuze wordt als bestaande `marketingEmailOptIn` met versie, tijdstempel, entiteit en intrekbaarheid afgehandeld. Geen verkooptelefonie, geen WhatsApp, geen cross-B.V.-doorgifte.
- Optionele profielvelden worden **pas na succesvolle OTP** opgeslagen in de reeds bestaande AES-256-GCM-versleutelde account-state. Zij zijn zichtbaar in eigen account, rechtstreeks te wijzigen/legen, opgenomen in account-JSON-export en verdwijnen met accountverwijdering.
- Geen bestaande profielwaarden wissen door een hernieuwde login met lege contactvelden. Geen automatische account→leadconversie, geen CRM-koppeling. Vault/leads/staff blijven ongewijzigd UIT.
- Voor een toekomstige vrijwillige aanvraag naar een **genoemde eigen ontvangende B.V.** volgt een afzonderlijke adviesflow met doel, ontvanger, kanaal, privacycopy, verificatie en rechten. Die is niet stiekem in de accountflow ingebouwd.

## Acceptatietests en gates

1. `npm run build`, `npm test`, `npm run package`; sitewide browserregressie en productie-HHTP-gates.
2. Echte MySQL/MariaDB-compatibiliteit, OTP-verificatie, bestaande accountisolatie, ontbrekende commerciële toestemming, proefprofiel, profielwijziging/export/verwijderen.
3. Productiebrowser desktop/mobile: één vereist juridisch akkoord, aanbiedingen standaard NEE, optionele velden, focus en scroll, geen off-site requests/POST bij alleen openen.
4. Werkelijke eigenaaracceptatie van nieuwe registratiegegevens en maildeliverability na merge; bestaande accountgebruiker kan gegevens wijzigen.
5. Juridisch/retentie-review en uitvoerbaar adviescontract vóór telefoonmarketing of first-party leadrouting.

**Niet claimen:** het profiel is geen lead; e-mail-opt-in bewijst geen telefonisch contactrecht; het ingelogde account is nog geen onafhankelijk geteste multi-browser cloud-save.

## Herbruikbaarheid

Houd versies en standaarduitgeschakelde marketingkeuze expliciet in de server en de UI. De profielhelper accepteert alleen een vaste lijst met begrensde tekstvelden en verstuurt geen gegevens bij het tonen van het formulier. Voor volgende websites kan dezelfde auth-/profielbasis worden gebruikt zonder een complexe externe CRM-infrastructuur.

## Stand van de bouw

De wijzigingen worden via een kleine feature-PR beoordeeld; geen Hostinger-secret, database-schema, sleutel, cronjob of SMTP-instelling wordt aangepast. De email-layout krijgt een aparte PR.
