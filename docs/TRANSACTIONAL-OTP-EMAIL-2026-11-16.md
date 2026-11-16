# SubsidieReady — vernieuwde verificatiemail

**Datum:** 16 november 2026. **Uitvoering:** aparte mail-PR; geen wijziging aan DB, accountgegevens of SMTP-secrets.

## Productverbetering

Op basis van een daadwerkelijk bezorgde 8-cijferige accountmail vroeg de eigenaar om een professionelere presentatie. De oorspronkelijke e-mail was een korte plain-textcode.

De nieuwe OTP-mail heeft:
- Een zelfstandige, e-mailclientvriendelijke HTML-layout in wit/navy/groen met tekstlogo, duidelijke kop en ruime codekaart.
- Een onveranderde **tekstvariant** als eerste onderdeel van een `multipart/alternative`-e-mail; HTML is dus een visuele aanvulling en geen afhankelijkheid.
- Heldere geldigheidsduur van 10 minuten, éénmalig gebruik, veiligheidswaarschuwing om codes nooit te delen, en duidelijke identificatie als servicebericht van SubsidieReady namens NIVO Groep Holland B.V.
- Geen externe afbeeldingen, trackingpixels, scripts, externe fonts, bijlagen, marketinglinks of automatische reclame-toestemming.
- De **bestaande** TLS/STARTTLS-geverifieerde SMTP-config en cron worker blijven; mailregels en authenticatie worden niet opnieuw opgestart of gedowngraded.

## Implementatie

- `server/next/mail-template.php`: output is server-generated, de exacte achtcijferige code komt uitsluitend uit de bestaande plaintext-OTP, geen userprovided HTML.
- `server/next/smtp.php`: ondersteunde HTML-alternatief als vijfde, optionele parameter bij dezelfde transportfunctie; quoted-printable UTF-8 en SMTP DATA dot-stuffing behouden.
- `scripts/next/mail-worker.php`: het OTP-bericht gebruikt de HTML-alternatief; overige serviceherinneringen en de lokale fixture blijven plain-text.
- `tests/next-smtp.test.cjs`: MIME-type, de 2 alternatieven, OTP, geen remote resources, geen code uit ontbrekende body en de bestaande veiligheidsgrenzen.

## QA en deployment

CI quality/release/MySQL (waar van toepassing) plus echte eindtest bij de eigenaar. **Gebruik nooit een echte OTP in GitHub, CI-logs of de chat.** Test met fictieve code in de unit-tests; voor een echte mail gebruikt de eigenaar de normale accountflow en bevestigt alleen visuele ontvangst.

**Eén belangrijke grens:** GitHub CI valideert de MIME-structuur, niet of alle mailclients een specifieke CSS-stijl exact hetzelfde tonen. De gekozen tabel-layout en inline CSS zijn bedoeld voor brede compatibiliteit, maar visuele acceptatie in een echte e-mailapp blijft nodig.
