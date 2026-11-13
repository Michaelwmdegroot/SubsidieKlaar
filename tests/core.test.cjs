'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../assets/core.js');

const today = { today: '2026-11-13' };
const invoice = { id: 'invoice-1', category: 'invoice', name: 'factuur.pdf', size: 1000, type: 'application/pdf' };
const payment = { id: 'payment-1', category: 'payment', name: 'betaling.pdf', size: 1000, type: 'application/pdf' };
const technical = { id: 'technical-1', category: 'technical', name: 'techniek.pdf', size: 1000, type: 'application/pdf' };
function fixture(extra = {}) {
  return Object.assign(core.initialState(), {
    ownerType: 'owner_occupier', installed: 'yes', newDevice: 'yes', installerBusiness: 'yes',
    pumpType: 'air_water', buildingRoute: 'before2019', purchaseDate: '2026-08-01', installDate: '2026-09-14',
    applicantName: 'Test Aanvrager', installationAddress: 'Teststraat 12', installationPostcode: '2311 AA', installationCity: 'Leiden',
    installerName: 'Voorbeeld Installatie', installerAddress: 'Werkstraat 2, 2311 AB Leiden', installerContact: 'J. Voorbeeld', installerPhone: '071 1234567',
    brand: 'Voorbeeld', model: 'WP 6000', productRoute: 'known_code', meldcode: 'Code uit officiële lijst', codeConfirmed: true,
    amount: '9500.00', payments: [{ date: '2026-09-15', amount: '9500.00' }], invoiceConfirmed: true, paymentConfirmed: true
  }, extra);
}
function run(extra, docs = [invoice, payment], date = today) { return core.evaluate(fixture(extra), docs, date); }
function item(result, id) { return result.checks.find(x => x.id === id); }
function warning(result, id) { return result.warnings.find(x => x.id === id); }

test('calendar-month deadline clamps leap day and month ends without UTC/DST drift', () => {
  assert.equal(core.addMonthsISO('2024-02-29', 24), '2026-02-28');
  assert.equal(core.addMonthsISO('2026-01-31', 1), '2026-02-28');
  assert.equal(core.addMonthsISO('2024-03-31', -1), '2024-02-29');
  assert.equal(core.addMonthsISO('2023-02-29', 24), null);
  assert.equal(core.addMonthsISO('2024-13-01', 24), null);
  assert.equal(core.addMonthsISO('9999-12-31', 1), null);
});

test('complete describes document preparation, accepts non-pattern meldcode, and does not require photos', () => {
  const result = run({});
  assert.equal(result.status, 'complete');
  assert.match(result.statusLabel, /geen subsidiebesluit/);
  assert.equal(result.deadline, '2028-09-14');
  assert.equal(result.completion.done, result.completion.total);
  assert.equal(result.missingCount, 0);
  assert.ok(warning(result, 'photo_recommended'));
});

test('a code alone cannot satisfy the exact official product-match confirmation', () => {
  const result = run({ codeConfirmed: false });
  assert.equal(result.status, 'review');
  assert.equal(item(result, 'codeConfirmed').status, 'needs_confirmation');
});

test('no-code route needs description and technical file, then can be document-complete with review note', () => {
  const state = { productRoute: 'no_code', meldcode: '', codeConfirmed: false, productDescription: 'Volledige beschrijving van het toestel.' };
  assert.equal(run(state).status, 'incomplete');
  const result = run(state, [invoice, payment, technical]);
  assert.equal(result.status, 'complete');
  assert.ok(warning(result, 'no_code_review'));
  assert.equal(item(result, 'meldcode'), undefined);
  assert.equal(run({ ...state, productDescription: '' }, [invoice, payment, technical]).status, 'incomplete');
});

test('paid invoice route replaces bank file only after explicit payment confirmation', () => {
  assert.equal(run({ paymentMode: 'paid_invoice' }, [invoice]).status, 'complete');
  const unconfirmed = run({ paymentMode: 'paid_invoice', paymentConfirmed: false }, [invoice]);
  assert.equal(unconfirmed.status, 'review');
  assert.equal(item(unconfirmed, 'paymentConfirmed').status, 'needs_confirmation');
  assert.equal(run({ paymentMode: 'paid_invoice' }, []).status, 'incomplete');
  assert.equal(run({}, [invoice]).status, 'incomplete');
});

test('scope exclusions never produce a complete result', () => {
  for (const ownerType of ['landlord', 'business', 'vve', 'second_home', 'monument']) assert.equal(run({ ownerType }).status, 'outside_scope');
  assert.equal(run({ newDevice: 'no' }).status, 'outside_scope');
  assert.equal(run({ installerBusiness: 'no' }).status, 'outside_scope');
  assert.equal(run({ pumpType: 'air_air' }).status, 'outside_scope');
  assert.equal(run({ pumpType: 'heat_pump_boiler' }).status, 'complete');
});

test('planned or future installation cannot be a completed dossier and has no actual deadline', () => {
  const planned = run({ installed: 'no' });
  assert.equal(planned.status, 'preparation');
  assert.equal(planned.deadline, null);
  const future = run({ installDate: '2026-12-01' });
  assert.equal(future.status, 'preparation');
  assert.equal(future.deadline, null);
  assert.ok(warning(future, 'future_installation'));
});

test('2027 actual installation remains provisional even after its date', () => {
  const result = run({ installDate: '2027-01-04' }, [invoice, payment], { today: '2027-02-01' });
  assert.equal(result.status, 'review');
  assert.ok(warning(result, 'rules_2027'));
});

test('late or unknown building route needs review; the permit exception is accepted as a declared route', () => {
  assert.equal(run({ buildingRoute: 'later' }).status, 'review');
  assert.equal(run({ buildingRoute: 'unknown' }).status, 'review');
  assert.equal(run({ buildingRoute: 'permit2018' }).status, 'complete');
  assert.equal(run({ newDevice: 'unknown' }).status, 'review');
});

test('deadline is based on installation, inclusive today, warning within thirty days, then review', () => {
  const state = { purchaseDate: '2024-01-01', installDate: '2024-02-29', payments: [{ date: '2024-03-01', amount: '9500' }] };
  const exact = run(state, [invoice, payment], { today: '2026-02-28' });
  assert.equal(exact.deadline, '2026-02-28');
  assert.equal(exact.status, 'complete');
  assert.ok(warning(exact, 'deadline_soon'));
  const expired = run(state, [invoice, payment], { today: '2026-03-01' });
  assert.equal(expired.status, 'review');
  assert.ok(warning(expired, 'deadline_expired'));
  assert.ok(warning(run(state, [invoice, payment], { today: '2026-01-29' }), 'deadline_soon'));
  assert.equal(warning(run(state, [invoice, payment], { today: '2026-01-28' }), 'deadline_soon'), undefined);
});

test('invalid and future dates, invalid amounts and payment mismatches remain visible', () => {
  assert.equal(item(run({ installDate: '2026-02-30' }), 'installDate').status, 'needs_confirmation');
  assert.equal(item(run({ purchaseDate: '2026-12-01' }), 'purchaseDate').status, 'needs_confirmation');
  assert.equal(item(run({ payments: [{ date: '2026-12-01', amount: '9500' }] }), 'paymentDates').status, 'needs_confirmation');
  assert.equal(item(run({ amount: '-1' }), 'amount').status, 'needs_confirmation');
  assert.equal(item(run({ payments: [{ date: '', amount: '9500' }] }), 'paymentDates').status, 'missing');
  assert.equal(item(run({ payments: [{ date: '2026-10-01', amount: '0' }] }), 'paymentAmounts').status, 'needs_confirmation');
  const partial = run({ payments: [{ date: '2026-10-01', amount: '1000' }] });
  assert.equal(partial.status, 'review');
  assert.ok(warning(partial, 'payment_difference'));
});

test('installments use exact cents and Dutch decimal formats', () => {
  const result = run({ amount: '0,30', payments: [{ date: '2026-09-15', amount: '0,10' }, { date: '2026-09-16', amount: '0,20' }] });
  assert.equal(result.status, 'complete');
  assert.equal(warning(result, 'payment_difference'), undefined);
  assert.equal(core.sanitizeState({ amount: '9.500,50' }).amount, '9500.50');
  assert.equal(core.sanitizeState({ amount: '1,234' }).amount, '');
  assert.equal(core.sanitizeState({ amount: Infinity }).amount, '');
  assert.equal(core.sanitizeState({ amount: '1e6' }).amount, '');
});

test('JSON import is a bounded whitelist with no prototype pollution or inherited/accessor values', () => {
  const malicious = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"version":99,"applicantName":"  Test  ","codeConfirmed":"true","amount":"-2","installDate":"2026-02-30","unknown":"x"}');
  const result = core.sanitizeState(malicious);
  assert.equal({}.polluted, undefined);
  assert.equal(result.version, 1);
  assert.equal(Object.hasOwn(result, '__proto__'), false);
  assert.equal(Object.hasOwn(result, 'constructor'), false);
  assert.equal(Object.hasOwn(result, 'unknown'), false);
  assert.equal(result.applicantName, 'Test');
  assert.equal(result.codeConfirmed, false);
  assert.equal(result.amount, '');
  assert.equal(result.installDate, '');
  assert.equal(core.sanitizeState(Object.create({ applicantName: 'Inherited' })).applicantName, '');
  const accessor = {};
  Object.defineProperty(accessor, 'applicantName', { get() { throw new Error('must not run'); } });
  assert.equal(core.sanitizeState(accessor).applicantName, '');
  assert.equal(core.sanitizeState({ notes: 'x'.repeat(10000) }).notes.length, 6000);
  assert.equal(core.sanitizeState({ payments: Array.from({ length: 50 }, () => ({ date: '2026-09-01', amount: '1' })) }).payments.length, 12);
});

test('fresh state is independent and module works as a browser global', () => {
  const a = core.initialState(), b = core.initialState();
  a.payments[0].amount = '10';
  assert.equal(b.payments[0].amount, '');
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/core.js'), 'utf8'), context);
  assert.equal(typeof context.SKCore.evaluate, 'function');
  assert.equal(context.SKCore.initialState().version, 1);
});

test('missing request asks installer for missing particulars without requesting the user bank statement', () => {
  const state = fixture({ installerAddress: '', model: '', codeConfirmed: false });
  const text = core.missingRequest(state, core.evaluate(state, [invoice, payment], today));
  assert.match(text, /Onderwerp:/);
  assert.match(text, /adres van het installatiebedrijf/);
  assert.match(text, /volledige typenummer/);
  assert.doesNotMatch(text, /stuur.*bankafschrift/i);
  assert.match(core.formatDateNL('2024-02-29'), /^29-02-2024$/);
  assert.equal(core.formatDateNL('2024-02-30'), '—');
  assert.match(core.formatEuro('1250,50'), /1\.250,50/);
});
