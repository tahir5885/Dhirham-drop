import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanTitle } from '../src/cleaner.js';
import { extractAttributes, normalizeProductTitle } from '../src/extractor.js';
import { fuzzyMatch } from '../src/matcher.js';

test('cleanTitle strips UAE retailer noise and shipping fluff', () => {
  const amazonRaw = 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Version] Free Delivery 2023 version';
  const cleanedAmazon = cleanTitle(amazonRaw);

  assert.ok(!cleanedAmazon.includes('UAE Version'));
  assert.ok(!cleanedAmazon.includes('Free Delivery'));
  assert.ok(!cleanedAmazon.includes('2023 version'));
  assert.ok(cleanedAmazon.includes('256GB'));
  assert.ok(cleanedAmazon.includes('Natural Titanium'));

  const noonRaw = 'Apple iPhone 15 Pro Max 256GB Dual SIM Natural Titanium 5G with FaceTime - Middle East Version (Noon Express)';
  const cleanedNoon = cleanTitle(noonRaw);

  assert.ok(!cleanedNoon.includes('Middle East Version'));
  assert.ok(!cleanedNoon.includes('with FaceTime'));
  assert.ok(!cleanedNoon.includes('Dual SIM'));
  assert.ok(!cleanedNoon.includes('Noon Express'));
});

test('extractAttributes accurately identifies brand, model, storage, and color', () => {
  const raw = 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Version]';
  const attrs = extractAttributes(raw);

  assert.equal(attrs.brand, 'Apple');
  assert.equal(attrs.model, 'iPhone 15 Pro Max');
  assert.equal(attrs.storage, '256GB');
  assert.equal(attrs.color, 'Natural Titanium');
  assert.equal(attrs.isAccessory, false);
});

test('fuzzyMatch successfully pairs Amazon and Noon titles for identical products', () => {
  const amazonTitle = 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium [UAE Version] Free Delivery';
  const noonTitle = 'Apple iPhone 15 Pro Max 256GB Dual SIM Natural Titanium 5G with FaceTime - Middle East Version';

  const result = fuzzyMatch(amazonTitle, noonTitle);

  assert.equal(result.isMatch, true);
  assert.ok(result.score >= 0.85);
  assert.ok(result.confidence === 'EXACT' || result.confidence === 'HIGH');
});

test('fuzzyMatch pairs Sony headphones across Amazon and Noon', () => {
  const amazonSony = 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black - 2023 version';
  const noonSony = 'Sony WH-1000XM5 Wireless Over-Ear Active Noise Cancelling Headphones Black (UAE Official Warranty)';

  const result = fuzzyMatch(amazonSony, noonSony);

  assert.equal(result.isMatch, true);
  assert.ok(result.score >= 0.75);
});

test('CRITICAL SAFEGUARD: Rejects accessory vs device match (e.g. phone case vs phone)', () => {
  const phone = 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium';
  const phoneCase = 'Spigen Ultra Hybrid MagFit Case Designed for Apple iPhone 15 Pro Max (Clear)';

  const result = fuzzyMatch(phone, phoneCase);

  assert.equal(result.isMatch, false);
  assert.equal(result.score, 0.0);
  assert.ok(result.reason.includes('Accessory vs Device mismatch'));
});

test('CRITICAL SAFEGUARD: Rejects storage capacity mismatches', () => {
  const item128 = 'Apple iPhone 15 Pro Max 128GB Black';
  const item512 = 'Apple iPhone 15 Pro Max 512GB Black';

  const result = fuzzyMatch(item128, item512);

  assert.equal(result.isMatch, false);
  assert.ok(result.reason.includes('Storage mismatch'));
});

test('CRITICAL SAFEGUARD: Rejects brand mismatches', () => {
  const apple = 'Apple iPhone 15 Pro Max 256GB Natural Titanium';
  const samsung = 'Samsung Galaxy S24 Ultra 256GB Phantom Black';

  const result = fuzzyMatch(apple, samsung);

  assert.equal(result.isMatch, false);
  assert.equal(result.score, 0.0);
  assert.ok(result.reason.includes('Brand mismatch'));
});

test('fuzzyMatch pairs Samsung Galaxy S24 Ultra across Amazon and Noon', () => {
  const amazonSamsung = 'Samsung Galaxy S24 Ultra, AI Smartphone, 256GB, Titanium Black [UAE Version] Free Delivery';
  const noonSamsung = 'Samsung Galaxy S24 Ultra 5G Dual SIM Titanium Black 12GB RAM 256GB - Middle East Version (Noon Express)';

  const result = fuzzyMatch(amazonSamsung, noonSamsung);

  assert.equal(result.isMatch, true);
  assert.ok(result.score >= 0.75);
  assert.equal(result.product1.attributes.brand, 'Samsung');
  assert.equal(result.product2.attributes.brand, 'Samsung');
});

test('fuzzyMatch pairs Dyson Airwrap Multi-Styler across Amazon and Noon', () => {
  const amazonDyson = 'Dyson Airwrap Multi-Styler Complete Long - Nickel/Copper - 2023 edition';
  const noonDyson = 'Dyson Airwrap Multi-Styler Complete Long Nickel and Copper (Official UAE Warranty)';

  const result = fuzzyMatch(amazonDyson, noonDyson);

  assert.equal(result.isMatch, true);
  assert.ok(result.score >= 0.75);
  assert.equal(result.product1.attributes.brand, 'Dyson');
});

test('CRITICAL SAFEGUARD: Rejects Smartwatch vs Replacement Band accessory match', () => {
  const watch = 'Apple Watch Ultra 2 (GPS + Cellular, 49mm) - Titanium Case';
  const watchBand = 'Spigen DuraPro Armor Band Strap Designed for Apple Watch Ultra 2 49mm';

  const result = fuzzyMatch(watch, watchBand);

  assert.equal(result.isMatch, false);
  assert.equal(result.score, 0.0);
  assert.ok(result.reason.includes('Accessory vs Device mismatch'));
});

