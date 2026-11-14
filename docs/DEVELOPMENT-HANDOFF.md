# Overdracht — SubsidieReady 1.0.0, 14 november 2026

## Eigenaarbesluit

De gebruiker heeft het concept goedgekeurd, **SubsidieReady.nl** gekocht via Hostinger en gevraagd om de live versie. Definitieve merknaam SubsidieReady; repository blijft `Michaelwmdegroot/SubsidieKlaar`. Bestaande hosting gebruiken, geen betaalde runtime of extra hosting aankopen.

## Nieuw gebouwd

- Complete rebranding met compatibele SubsidieKlaar-projectimport.
- Bestaande lokale vierstappenwerkbank; ongewijzigde originelen; PDF/ZIP; snapshotfix voor downloads tijdens bewerken.
- Prerendered homepage, zeven statische informatiepagina’s, bronnen/privacy/over, metadata, sitemap, canonicals, foutpagina en headers.
- Echte PHP-backoffice met login/CSRF/sessies/rate limiting en alleen geaggregeerde dagtotalen. Geen fake bezoekerscijfers.
- Opt-in gebruikstellingen, demo uitsluiting, GPC/DNT, strikt één enum-veld per event. Geen documentgegevens verstuurd.
- CLI-only setup: operatornaam, contactmail, wachtwoord en geheimen buiten public_html. Zonder config geen beheer of meting; de tool blijft werken.
- Build/package/tests en duidelijke Hostinger-instructies.

## Verificatie

41 lokale tests slagen. Chromium-rendering/bediening via in-memory standalone HTML werkt, inclusief mobiele breedtes en downloads; echte HTTP-browsernavigatie is in deze testomgeving geblokkeerd. Vier PDF-pagina’s en ZIP gecontroleerd. Zie `QA-v1.md`.

## Wat niet is uitgevoerd

Er is in deze chat geen werkende Hostinger-hosting/DNS/SSH-verbinding gevonden. Hostinger Mail is geen hostingbeheer. Daarom zijn domeinkoppeling, daadwerkelijke deployment, certificaat, live headers, operatorconfiguratie, cron/backups en live acceptatie **niet uitgevoerd of bevestigd**. Een repositorycommit of preview via raw.githack is geen bewijs dat `subsidieready.nl` live staat.

## Eerstvolgende stap

Koppel de repository-root van `main` als PHP/HTML-site aan `subsidieready.nl` op de bestaande Hostinger-hosting. Geen buildcommand op Hostinger nodig. Volg `HOSTINGER-LIVE.md`, verifieer het echte domein, en activeer beheer via `php scripts/setup-admin.php` wanneer de operator/contactgegevens beschikbaar zijn. Nooit om een wachtwoord in de chat vragen of het in Git plaatsen.

Inhoudelijke verdere uitbreiding (isolatie, live meldcodes, OCR, subsidiebedragen) is bewust niet in deze release gepropt. De gehele individuele tool blijft gratis en zonder registratie.
