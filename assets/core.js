/* SubsidieKlaar — deterministic preparation checks; no eligibility decision.
 * Rules reviewed against RVO on 2026-11-13. No network requests or dependencies.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SKCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var SOURCES = {
    pump: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp',
    faq: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/veelgestelde-vragen',
    codes: 'https://www.rvo.nl/subsidies-financiering/isde/meldcodelijsten/warmtepompen'
  };
  var ENUMS = {
    ownerType: ['owner_occupier', 'landlord', 'business', 'vve', 'second_home', 'monument'],
    installed: ['yes', 'no', 'unknown'],
    newDevice: ['yes', 'no', 'unknown'],
    installerBusiness: ['yes', 'no', 'unknown'],
    pumpType: ['air_water', 'ground_water', 'water_water', 'heat_pump_boiler', 'air_air', 'unknown'],
    buildingRoute: ['before2019', 'permit2018', 'later', 'unknown'],
    productRoute: ['known_code', 'no_code', 'unknown'],
    paymentMode: ['bank', 'paid_invoice']
  };
  var TEXT_LIMITS = {
    applicantName: 160, installationAddress: 240, installationPostcode: 12,
    installationCity: 120, installerName: 200, installerAddress: 300,
    installerContact: 160, installerPhone: 40, brand: 120, model: 160,
    meldcode: 80, productDescription: 4000, notes: 6000
  };

  function initialState() {
    return {
      version: 1, ownerType: '', installed: '', newDevice: '', installerBusiness: '',
      pumpType: '', buildingRoute: '', purchaseDate: '', installDate: '',
      applicantName: '', installationAddress: '', installationPostcode: '', installationCity: '',
      installerName: '', installerAddress: '', installerContact: '', installerPhone: '',
      brand: '', model: '', productRoute: '', meldcode: '', codeConfirmed: false,
      productDescription: '', amount: '', payments: [{ date: '', amount: '' }],
      paymentMode: 'bank', invoiceConfirmed: false, paymentConfirmed: false, notes: ''
    };
  }

  function plainObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  // Read only own data properties. JSON fields never become code or prototypes.
  function own(value, key) {
    if (!value || typeof value !== 'object') return undefined;
    var descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;
  }

  function cleanText(value, limit) {
    if (typeof value !== 'string') return '';
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, limit);
  }

  function leap(year) { return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0); }
  function monthLength(year, month) { return [31, leap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]; }
  function parseISO(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    var p = value.split('-').map(Number);
    if (p[0] < 1 || p[1] < 1 || p[1] > 12 || p[2] < 1 || p[2] > monthLength(p[0], p[1])) return null;
    return { year: p[0], month: p[1], day: p[2] };
  }
  function iso(year, month, day) {
    return String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }

  function addMonthsISO(value, months) {
    var p = parseISO(value);
    if (!p || !Number.isInteger(months) || Math.abs(months) > 120000) return null;
    var index = p.year * 12 + p.month - 1 + months;
    var year = Math.floor(index / 12), month = index - year * 12 + 1;
    if (year < 1 || year > 9999) return null;
    return iso(year, month, Math.min(p.day, monthLength(year, month)));
  }

  function dayNumber(value) {
    var p = parseISO(value), d = new Date(0);
    if (!p) return NaN;
    d.setUTCFullYear(p.year, p.month - 1, p.day);
    d.setUTCHours(0, 0, 0, 0);
    return d.getTime() / 86400000;
  }

  function formatDateNL(value) {
    var p = parseISO(value);
    return p ? String(p.day).padStart(2, '0') + '-' + String(p.month).padStart(2, '0') + '-' + String(p.year).padStart(4, '0') : '—';
  }

  // Amounts are converted to integer cents before summing. Ambiguous comma-
  // thousands formats and more than two decimal places are deliberately rejected.
  function moneyCents(value) {
    if (typeof value === 'number') {
      if (!Number.isFinite(value) || value < 0 || value > 1000000000) return null;
      var rounded = Math.round(value * 100);
      return Math.abs(value * 100 - rounded) < 0.00001 ? rounded : null;
    }
    if (typeof value !== 'string' || value.length > 40) return null;
    var s = value.trim().replace(/^€\s*/, '').replace(/\s/g, '');
    if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d+(?:,\d{1,2})?$/.test(s)) s = s.replace(',', '.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(s)) return null;
    var bits = s.split('.');
    var cents = Number(bits[0]) * 100 + Number((bits[1] || '').padEnd(2, '0'));
    return Number.isSafeInteger(cents) && cents <= 100000000000 ? cents : null;
  }
  function canonicalMoney(value) {
    var cents = moneyCents(value);
    return cents !== null && cents > 0 ? (cents / 100).toFixed(2) : '';
  }
  function formatEuro(value) {
    var cents = moneyCents(value);
    return cents === null ? '—' : new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  function sanitizeState(input) {
    var out = initialState();
    if (!plainObject(input)) return out;
    Object.keys(ENUMS).forEach(function (key) {
      var value = own(input, key);
      if (typeof value === 'string' && ENUMS[key].indexOf(value) !== -1) out[key] = value;
    });
    Object.keys(TEXT_LIMITS).forEach(function (key) { out[key] = cleanText(own(input, key), TEXT_LIMITS[key]); });
    ['purchaseDate', 'installDate'].forEach(function (key) {
      var value = own(input, key);
      out[key] = parseISO(value) ? value : '';
    });
    ['codeConfirmed', 'invoiceConfirmed', 'paymentConfirmed'].forEach(function (key) { out[key] = own(input, key) === true; });
    out.amount = canonicalMoney(own(input, 'amount'));
    var postcode = out.installationPostcode.replace(/\s/g, '').toUpperCase();
    if (/^[1-9]\d{3}[A-Z]{2}$/.test(postcode)) out.installationPostcode = postcode.slice(0, 4) + ' ' + postcode.slice(4);
    var entries = own(input, 'payments');
    if (Array.isArray(entries)) {
      out.payments = [];
      for (var i = 0; i < Math.min(entries.length, 12); i += 1) {
        var row = own(entries, String(i));
        if (!plainObject(row)) continue;
        var date = own(row, 'date');
        out.payments.push({ date: parseISO(date) ? date : '', amount: canonicalMoney(own(row, 'amount')) });
      }
      if (!out.payments.length) out.payments.push({ date: '', amount: '' });
    }
    return out;
  }

  function evaluate(input, docs, options) {
    var raw = plainObject(input) ? input : {};
    var state = sanitizeState(raw);
    var today = options && parseISO(options.today) ? options.today : new Date().toISOString().slice(0, 10);
    var checks = [], warnings = [], required = [], deadline = null;
    var outside = false, planned = state.installed === 'no', forceReview = false;
    var files = Array.isArray(docs) ? docs.filter(function (doc) {
      return plainObject(doc) && typeof own(doc, 'category') === 'string' && cleanText(own(doc, 'name'), 500) !== '';
    }) : [];
    function has(category) { return files.some(function (doc) { return own(doc, 'category') === category; }); }
    function check(id, label, status, detail, source, mandatory) {
      var item = { id: id, label: label, status: status, detail: detail };
      if (source) item.source = source;
      checks.push(item);
      if (mandatory !== false) required.push(item);
      if (status === 'outside_tool_scope') outside = true;
    }
    function warn(id, title, detail, tone) { warnings.push({ id: id, title: title, detail: detail, tone: tone || 'info' }); }
    function textCheck(key, label, detail) {
      check(key, label, state[key] ? 'present' : 'missing', state[key] ? 'Ingevuld. Controleer of dit overeenkomt met de bewijsstukken.' : detail, SOURCES.pump);
    }
    function yesCheck(key, label, outsideDetail) {
      var value = state[key];
      check(key, label, value === 'yes' ? 'present' : value === 'no' ? 'outside_tool_scope' : value === 'unknown' ? 'needs_confirmation' : 'missing',
        value === 'yes' ? 'Door jou bevestigd; de tool verifieert dit niet zelfstandig.' : value === 'no' ? outsideDetail : 'Bevestig dit aan de hand van de aankoop- en installatiegegevens.', SOURCES.pump);
    }
    function dateCheck(key, label, missingDetail) {
      var original = own(raw, key);
      if (original !== undefined && original !== '' && !parseISO(original)) {
        check(key, label, 'needs_confirmation', 'Deze datum is ongeldig. Gebruik een bestaande kalenderdatum.', SOURCES.pump);
        return null;
      }
      if (!state[key]) {
        check(key, label, 'missing', missingDetail, SOURCES.pump);
        return null;
      }
      if (state[key] > today) {
        check(key, label, 'needs_confirmation', 'Deze datum ligt in de toekomst. Dit is nog geen bewijs van een afgeronde aankoop of installatie.', SOURCES.pump);
        return state[key];
      }
      check(key, label, 'present', 'Datum: ' + formatDateNL(state[key]) + '.', SOURCES.pump);
      return state[key];
    }

    var ownerDetail = {
      landlord: 'Voor een verhuurde woning geldt een aparte subsidieroute. Bekijk bij RVO onder meer de SVOH. Dit concept behandelt alleen de gewone route voor eigenaar-bewoners.',
      business: 'Zakelijke aanvragen vallen buiten dit concept.',
      vve: 'Een aanvraag door een VvE vraagt een andere route, buiten dit concept.',
      second_home: 'Dit concept behandelt de woning waarin je zelf woont, geen tweede woning.',
      monument: 'Voor monumenten kunnen afwijkende voorwaarden gelden. Gebruik de specifieke RVO-informatie; dit concept behandelt die route niet.'
    };
    check('ownerType', 'Route voor een eigenaar-bewoner', state.ownerType === 'owner_occupier' ? 'present' : state.ownerType ? 'outside_tool_scope' : 'missing',
      state.ownerType === 'owner_occupier' ? 'Je geeft aan eigenaar te zijn en zelf in de woning te wonen.' : ownerDetail[state.ownerType] || 'Kies wie de aanvraag doet en om welke woning het gaat.', SOURCES.pump);
    check('installed', 'Installatie is uitgevoerd', state.installed === 'yes' ? 'present' : state.installed === 'no' || state.installed === 'unknown' ? 'needs_confirmation' : 'missing',
      state.installed === 'yes' ? 'Door jou bevestigd. De daadwerkelijke installatiedatum bepaalt de aanvraagtermijn.' : state.installed === 'no' ? 'Je kunt het dossier voorbereiden. Een woningeigenaar vraagt na installatie aan.' : 'Bevestig of de installatie daadwerkelijk is afgerond.', SOURCES.pump);
    yesCheck('newDevice', 'Nieuw toestel', 'Een gebruikt of tweedehands toestel valt buiten deze voorbereidingsroute.');
    yesCheck('installerBusiness', 'Installatie door een bouwinstallatiebedrijf', 'Zelf installeren valt buiten deze voorbereidingsroute.');
    check('pumpType', 'Ondersteund type warmtepomp', state.pumpType === 'air_air' ? 'outside_tool_scope' : state.pumpType === 'unknown' ? 'needs_confirmation' : state.pumpType ? 'present' : 'missing',
      state.pumpType === 'air_air' ? 'Een lucht-luchtwarmtepomp/airco valt buiten de ISDE-warmtepomproute in dit concept.' : !state.pumpType || state.pumpType === 'unknown' ? 'Controleer het type op de offerte, factuur of productdocumentatie.' : 'Type vastgelegd. Dit bevestigt nog niet dat het specifieke toestel voldoet.', SOURCES.pump);
    var buildingStatus = state.buildingRoute === 'before2019' || state.buildingRoute === 'permit2018' ? 'present' : state.buildingRoute ? 'needs_confirmation' : 'missing';
    check('buildingRoute', 'Bestaande woning / vergunningroute', buildingStatus,
      state.buildingRoute === 'before2019' ? 'Je geeft aan dat de woning vóór 1 januari 2019 is gebouwd.' : state.buildingRoute === 'permit2018' ? 'Je geeft aan dat de omgevingsvergunning vóór 1 juli 2018 is aangevraagd. Bewaar de onderbouwing.' : state.buildingRoute === 'later' ? 'Een latere bouwdatum vraagt controle van de vergunninguitzondering en de actuele RVO-voorwaarden. De tool kan deze route niet bevestigen.' : 'Controleer bouwdatum en, indien relevant, de datum waarop de omgevingsvergunning is aangevraagd.', SOURCES.pump);
    if (state.buildingRoute === 'later' || state.buildingRoute === 'unknown') {
      warn('building_review', 'Woningroute nog beoordelen', 'Controleer de bestaande-bouwvoorwaarde of vergunninguitzondering bij RVO voordat je het dossier gebruikt.', 'warning');
    }

    textCheck('applicantName', 'Naam aanvrager', 'Vul de naam van de aanvrager in voor het overzicht.');
    textCheck('installationAddress', 'Adres van de installatie', 'Vul straat en huisnummer van de woning in.');
    var postcodeValid = /^[1-9]\d{3}\s?[A-Z]{2}$/i.test(state.installationPostcode);
    check('installationPostcode', 'Postcode van de installatie', !state.installationPostcode ? 'missing' : postcodeValid ? 'present' : 'needs_confirmation',
      !state.installationPostcode ? 'Vul de postcode van de woning in.' : postcodeValid ? 'Postcodeformaat klopt; het adres is niet extern gecontroleerd.' : 'Controleer de postcode: vier cijfers en twee letters.', SOURCES.pump);
    textCheck('installationCity', 'Plaats van de installatie', 'Vul de woonplaats van de installatie in.');
    textCheck('installerName', 'Naam installatiebedrijf', 'Vul de bedrijfsnaam van de installateur in.');
    textCheck('installerAddress', 'Adres installatiebedrijf', 'Vul het adres van het installatiebedrijf in.');
    textCheck('installerContact', 'Contactpersoon installatiebedrijf', 'Vul de naam van de contactpersoon bij het installatiebedrijf in.');
    var phoneDigits = state.installerPhone.replace(/\D/g, '');
    check('installerPhone', 'Telefoonnummer installatiebedrijf', !state.installerPhone ? 'missing' : phoneDigits.length >= 6 && phoneDigits.length <= 20 ? 'present' : 'needs_confirmation',
      !state.installerPhone ? 'Vul een telefoonnummer van het installatiebedrijf in.' : phoneDigits.length >= 6 && phoneDigits.length <= 20 ? 'Ingevuld; de bereikbaarheid is niet gecontroleerd.' : 'Controleer het telefoonnummer.', SOURCES.pump);
    textCheck('brand', 'Merk warmtepomp', 'Vul het merk in zoals vermeld op de productdocumentatie.');
    textCheck('model', 'Type / model warmtepomp', 'Vul het volledige typenummer in, inclusief relevante binnen- en buitenunit.');

    var purchaseDate = dateCheck('purchaseDate', 'Aankoopdatum', 'Neem de aankoopdatum over uit de aankoopdocumenten.');
    var installDate = dateCheck('installDate', 'Werkelijke installatiedatum', 'Vul de datum in waarop de warmtepomp daadwerkelijk is geïnstalleerd.');
    if (installDate && installDate > today) {
      planned = true;
      warn('future_installation', 'Installatie ligt nog in de toekomst', 'De ingevulde datum is een planning. Vervang deze na uitvoering door de werkelijke installatiedatum.', 'warning');
    }
    if (purchaseDate && purchaseDate > today) warn('future_purchase', 'Aankoopdatum controleren', 'De aankoopdatum ligt in de toekomst. Controleer of dit een geplande datum is.', 'warning');
    if (purchaseDate && installDate && purchaseDate > installDate) {
      forceReview = true;
      warn('date_order', 'Volgorde van de datums controleren', 'De aankoopdatum ligt na de installatiedatum. Controleer of je de juiste datums hebt overgenomen.', 'warning');
    }
    if (installDate && installDate >= '2027-01-01') {
      forceReview = true;
      warn('rules_2027', 'Installatie vanaf 2027: voorwaarden opnieuw controleren', 'Dit concept is gecontroleerd op 13 november 2026. De definitieve voorwaarden voor jouw installatiejaar moeten opnieuw worden gecontroleerd; het dossier krijgt daarom geen gewone gereedstatus.', 'warning');
    }
    if (installDate && state.installed === 'yes' && installDate <= today) {
      deadline = addMonthsISO(installDate, 24);
      if (deadline) {
        var remaining = dayNumber(deadline) - dayNumber(today);
        if (remaining < 0) {
          forceReview = true;
          warn('deadline_expired', 'Berekende aanvraagtermijn verstreken', '24 kalendermaanden na installatie komt uit op ' + formatDateNL(deadline) + '. Die datum is verstreken. Controleer je situatie met RVO; dit is geen inhoudelijk besluit van RVO.', 'danger');
        } else if (remaining <= 30) {
          warn('deadline_soon', 'Aanvraagtermijn nadert', remaining === 0 ? 'De berekende uiterste aanvraagdatum is vandaag (' + formatDateNL(deadline) + '). Controleer de termijn bij RVO en handel tijdig.' : 'De berekende uiterste aanvraagdatum is ' + formatDateNL(deadline) + ' (over ' + remaining + ' dagen). Controleer de termijn bij RVO.', 'warning');
        }
      }
    }

    var amount = moneyCents(own(raw, 'amount'));
    check('amount', 'Aankoopbedrag', amount !== null && amount > 0 ? 'present' : own(raw, 'amount') !== undefined && own(raw, 'amount') !== '' ? 'needs_confirmation' : 'missing',
      amount !== null && amount > 0 ? 'Vastgelegd: ' + formatEuro(amount / 100) + '. Controleer welk bedrag bij deze warmtepomp hoort.' : 'Vul een positief aankoopbedrag in, met maximaal twee decimalen.', SOURCES.pump);
    var paymentRows = own(raw, 'payments');
    if (!Array.isArray(paymentRows)) paymentRows = [];
    var activeRows = paymentRows.slice(0, 12).filter(function (row) {
      return plainObject(row) && (own(row, 'date') !== '' && own(row, 'date') !== undefined || own(row, 'amount') !== '' && own(row, 'amount') !== undefined);
    });
    var invalidPaymentDates = [], missingPaymentDates = [], futurePaymentDates = [], invalidPaymentAmounts = [], totalPaid = 0;
    activeRows.forEach(function (row, index) {
      var date = own(row, 'date'), cents = moneyCents(own(row, 'amount'));
      if (!date) missingPaymentDates.push(index + 1);
      else if (!parseISO(date)) invalidPaymentDates.push(index + 1);
      else if (date > today) futurePaymentDates.push(index + 1);
      if (cents === null || cents <= 0) invalidPaymentAmounts.push(index + 1);
      else totalPaid += cents;
    });
    var dateStatus = !activeRows.length || missingPaymentDates.length ? 'missing' : invalidPaymentDates.length || futurePaymentDates.length ? 'needs_confirmation' : 'present';
    check('paymentDates', 'Betaaldatum / betaaldata', dateStatus,
      !activeRows.length ? 'Voeg minimaal één werkelijk uitgevoerde betaling met datum en bedrag toe.' : missingPaymentDates.length ? 'Betaaldatum ontbreekt bij betaling ' + missingPaymentDates.join(', ') + '.' : invalidPaymentDates.length ? 'Ongeldige betaaldatum bij betaling ' + invalidPaymentDates.join(', ') + '.' : futurePaymentDates.length ? 'Een toekomstige betaaldatum bewijst geen uitgevoerde betaling. Controleer betaling ' + futurePaymentDates.join(', ') + '.' : activeRows.length === 1 ? 'De ingevulde betaaldatum is geldig en ligt niet in de toekomst.' : 'De ' + activeRows.length + ' ingevulde betaaldata zijn geldig en liggen niet in de toekomst.', SOURCES.faq);
    check('paymentAmounts', 'Bedragen van de betalingen', !activeRows.length ? 'missing' : invalidPaymentAmounts.length ? 'needs_confirmation' : 'present',
      !activeRows.length ? 'Vul het bedrag per uitgevoerde betaling in.' : invalidPaymentAmounts.length ? 'Vul een positief bedrag in bij betaling ' + invalidPaymentAmounts.join(', ') + '.' : 'Opgeteld: ' + formatEuro(totalPaid / 100) + '.', SOURCES.faq);
    if (paymentRows.length > 12) {
      forceReview = true;
      warn('payment_limit', 'Meer dan twaalf betalingen', 'Dit concept verwerkt maximaal twaalf betalingen. Bundel geen bedragen zonder de onderliggende betaaldata te behouden; laat dit dossier eerst beoordelen.', 'warning');
    }
    if (amount !== null && amount > 0 && activeRows.length && !invalidPaymentAmounts.length && totalPaid !== amount) {
      forceReview = true;
      warn('payment_difference', 'Betaaltotaal wijkt af van het aankoopbedrag', 'Betalingen: ' + formatEuro(totalPaid / 100) + '; aankoopbedrag: ' + formatEuro(amount / 100) + '. Controleer deelbetalingen, ontbrekende betalingen of een gecombineerde factuur. Het verschil is geen automatische afwijzing.', 'warning');
    }

    check('productRoute', 'Product identificeren', state.productRoute === 'unknown' ? 'needs_confirmation' : state.productRoute ? 'present' : 'missing',
      state.productRoute === 'known_code' ? 'Je gebruikt de route met meldcode; exacte matching blijft noodzakelijk.' : state.productRoute === 'no_code' ? 'Zonder gevonden meldcode beoordeelt RVO het toestel aan de hand van productdocumentatie.' : 'Controleer of het exacte toestel op de officiële meldcodelijst staat.', SOURCES.codes);
    if (state.productRoute === 'known_code') {
      check('meldcode', 'Meldcode', state.meldcode ? 'present' : 'missing', state.meldcode ? 'Meldcode overgenomen: ' + state.meldcode + '. De tekst is niet tegen de lijst geverifieerd.' : 'Neem de meldcode over uit de officiële RVO-lijst.', SOURCES.codes);
      check('codeConfirmed', 'Exacte match met de officiële meldcodelijst', state.codeConfirmed && state.meldcode ? 'present' : 'needs_confirmation',
        state.codeConfirmed && state.meldcode ? 'Jij hebt bevestigd dat merk, volledig model en eventuele toestelcombinatie exact overeenkomen. Dit is geen zelfstandige verificatie door SubsidieKlaar.' : 'Open de officiële lijst en bevestig de exacte match. Alleen een ingevulde code is onvoldoende.', SOURCES.codes);
    } else if (state.productRoute === 'no_code') {
      check('productDescription', 'Productomschrijving zonder meldcode', state.productDescription ? 'present' : 'missing', state.productDescription ? 'Omschrijving aanwezig; de inhoudelijke productbeoordeling blijft bij RVO.' : 'Beschrijf het exacte product, de combinatie en relevante technische kenmerken.', SOURCES.codes);
      check('technicalDocument', 'Technische productdocumentatie', has('technical') ? 'present' : 'missing', has('technical') ? 'Technisch document toegevoegd. Controleer dat het over jouw exacte toestel gaat.' : 'Voeg technische documentatie toe over het exacte toestel.', SOURCES.codes);
      warn('no_code_review', 'RVO moet het toestel inhoudelijk beoordelen', 'Een dossier zonder gevonden meldcode kan qua stukken compleet zijn. Dat betekent niet dat het toestel subsidiabel is; RVO beoordeelt de productdocumentatie.', 'info');
    }

    check('invoiceDocument', 'Aankoopfactuur toegevoegd', has('invoice') ? 'present' : 'missing', has('invoice') ? 'Er is een factuurbestand toegevoegd. De tool leest of verifieert de inhoud niet.' : 'Voeg de aankoopfactuur toe.', SOURCES.pump);
    check('invoiceConfirmed', 'Inhoud van de factuur gecontroleerd', state.invoiceConfirmed && has('invoice') ? 'present' : 'needs_confirmation',
      state.invoiceConfirmed && has('invoice') ? 'Jij hebt de inhoud handmatig gecontroleerd op de benodigde aankoop-, toestel- en installatiegegevens.' : 'Controleer handmatig de factuur en bevestig dat de benodigde gegevens erin staan of met bijlagen zijn aangevuld.', SOURCES.pump);
    if (state.paymentMode === 'paid_invoice') {
      check('paymentDocument', 'Factuur met betalingsvermelding', has('invoice') ? 'present' : 'missing', has('invoice') ? 'De factuur is gekozen als betaalbewijs. De vermelding dat betaald is moet daadwerkelijk op de factuur staan.' : 'Voeg de factuur met een expliciete betalingsvermelding toe.', SOURCES.faq);
    } else {
      check('paymentDocument', 'Betaalbewijs toegevoegd', has('payment') ? 'present' : 'missing', has('payment') ? 'Betaalbewijs toegevoegd; leg de relatie met de factuur en de ingevulde betalingen vast.' : 'Voeg een betaalbewijs toe dat aansluit op de factuur, of kies bewust de route met een als betaald gemarkeerde factuur.', SOURCES.faq);
    }
    var paymentEvidence = state.paymentMode === 'paid_invoice' ? has('invoice') : has('payment');
    check('paymentConfirmed', 'Betaling handmatig gecontroleerd', state.paymentConfirmed && paymentEvidence ? 'present' : 'needs_confirmation',
      state.paymentConfirmed && paymentEvidence ? 'Jij hebt bevestigd dat het bewijs de uitgevoerde betaling(en), datum/data en aansluiting op de factuur onderbouwt.' : state.paymentMode === 'paid_invoice' ? 'Bevestig expliciet dat de factuur daadwerkelijk als betaald is gemarkeerd en de ingevulde betalingen onderbouwt.' : 'Controleer en bevestig de aansluiting tussen betaalbewijs, betaaldata, bedragen en factuur.', SOURCES.faq);
    if (!has('photo')) warn('photo_recommended', 'Installatiefoto aanbevolen', 'Een duidelijke foto van het geplaatste toestel en typeplaatje kan helpen bij het dossier. In dit concept blokkeert het ontbreken van een foto de documentstatus niet.', 'info');
    if (state.installed === 'no') warn('preparation_only', 'Voorbereiding vóór installatie', 'Bewaar nu offertes en productgegevens. Voeg na uitvoering de werkelijke installatiedatum, definitieve factuur en betaalbewijzen toe.', 'info');

    var missingCount = required.filter(function (item) { return item.status === 'missing'; }).length;
    var reviewCount = required.filter(function (item) { return item.status === 'needs_confirmation'; }).length;
    var status = outside ? 'outside_scope' : planned ? 'preparation' : missingCount ? 'incomplete' : forceReview || reviewCount ? 'review' : 'complete';
    var labels = {
      complete: 'Documenten voorbereid — geen subsidiebesluit', incomplete: 'Dossier nog niet compleet',
      preparation: 'Dossier in voorbereiding', outside_scope: 'Buiten de scope van dit concept', review: 'Nog handmatig controleren'
    };
    return {
      checks: checks, warnings: warnings, status: status, statusLabel: labels[status], deadline: deadline,
      completion: { done: required.filter(function (item) { return item.status === 'present'; }).length, total: required.length },
      missingCount: missingCount
    };
  }

  function missingRequest(input, result) {
    var state = sanitizeState(input);
    var report = result && Array.isArray(result.checks) ? result : evaluate(input, []);
    var requests = {
      installerName: 'De volledige bedrijfsnaam van het installatiebedrijf.',
      installerAddress: 'Het adres van het installatiebedrijf.',
      installerContact: 'De naam van de contactpersoon bij het installatiebedrijf.',
      installerPhone: 'Het telefoonnummer van het installatiebedrijf.',
      brand: 'Het merk van de geïnstalleerde warmtepomp.',
      model: 'Het volledige typenummer, inclusief de relevante binnen- en buitenunit of toestelcombinatie.',
      purchaseDate: 'Een bevestiging van de aankoopdatum.',
      installDate: 'Een bevestiging van de daadwerkelijke installatiedatum, na uitvoering.',
      amount: 'Het aankoopbedrag dat bij deze warmtepomp hoort, met toelichting bij een gecombineerde factuur.',
      meldcode: 'De meldcode uit de officiële RVO-lijst die exact bij dit toestel hoort, indien het toestel op de lijst staat.',
      codeConfirmed: 'Een controle of merk, volledig model en toestelcombinatie exact overeenkomen met de officiële RVO-meldcode.',
      productDescription: 'Een volledige productomschrijving voor de route zonder gevonden meldcode.',
      technicalDocument: 'Technische productdocumentatie van het exacte toestel en eventuele combinatie.',
      invoiceDocument: 'De definitieve aankoopfactuur met de benodigde aankoop-, toestel- en installatiegegevens.'
    };
    var lines = [];
    report.checks.forEach(function (item) {
      if (item.status !== 'present' && requests[item.id]) lines.push(requests[item.id]);
    });
    if (!state.invoiceConfirmed && lines.indexOf(requests.invoiceDocument) === -1) lines.push('Controle van de aankoop-, toestel- en installatiegegevens op de factuur, met een aanvulling als er gegevens ontbreken.');
    if (state.paymentMode === 'paid_invoice' && !state.paymentConfirmed) lines.push('Indien de factuur als betaalbewijs dient: een expliciete betalingsvermelding die aansluit op de uitgevoerde betalingen en betaaldata.');
    if (!lines.length) return 'Volgens de huidige checklist ontbreken geen gegevens die je met dit verzoek bij de installateur hoeft op te vragen. Controleer zelf nog je betaalbewijzen en eventuele aandachtspunten.';
    var product = [state.brand, state.model].filter(Boolean).join(' ');
    var location = [state.installationAddress, state.installationPostcode, state.installationCity].filter(Boolean).join(', ');
    return 'Onderwerp: Aanvullende gegevens voor mijn ISDE-dossier' + (product ? ' – ' + product : '') + '\n\n' +
      'Beste ' + (state.installerContact || 'installateur') + ',\n\n' +
      'Ik bereid mijn ISDE-aanvraag voor de warmtepomp voor' + (location ? ' op ' + location : '') + '. Kunnen jullie mij helpen met de volgende gegevens of documenten?\n\n' +
      lines.map(function (line) { return '- ' + line; }).join('\n') + '\n\n' +
      'Graag de gegevens laten aansluiten op het daadwerkelijk geleverde en geïnstalleerde toestel. RVO beoordeelt uiteindelijk de aanvraag; dit verzoek is bedoeld om de stukken compleet te maken.\n\n' +
      'Alvast bedankt.\n\nMet vriendelijke groet,\n' + (state.applicantName || '[Je naam]');
  }

  return Object.freeze({
    initialState: initialState, sanitizeState: sanitizeState, evaluate: evaluate,
    addMonthsISO: addMonthsISO, formatDateNL: formatDateNL, formatEuro: formatEuro,
    missingRequest: missingRequest
  });
}));
