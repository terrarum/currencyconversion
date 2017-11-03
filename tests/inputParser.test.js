const inputParser = require('../src/inputParser');

const validInputs = [
  '100 GBP',
  '100 gbp',
  'GBP 100',
  '100GBP',
  '100.GBP',
  '100.0GBP',
  '-100 GBP',
  '-100GBP',
  '£100',
  {
    request: '100.5GBP',
    expectedAmount: 100.5,
    expectedCurrency: 'GBP',
  },
  {
    request: '$100',
    expectedAmount: 100,
    expectedCurrency: 'USD',
  },
  {
    request: '€100',
    expectedAmount: 100,
    expectedCurrency: 'EUR',
  },
  {
    request: '1,000,000 GBP',
    expectedAmount: 1000000,
    expectedCurrency: 'GBP',
  },
  {
    request: '-1,000,000 GBP',
    expectedAmount: 1000000,
    expectedCurrency: 'GBP',
  },
  {
    request: '-85.49GBP',
    expectedAmount: 85.49,
    expectedCurrency: 'GBP',
  },
  {
    request: '-85.49 GBP',
    expectedAmount: 85.49,
    expectedCurrency: 'GBP',
  },
  {
    request: '85.49GBP',
    expectedAmount: 85.49,
    expectedCurrency: 'GBP',
  },
  {
    request: '85.49 GBP',
    expectedAmount: 85.49,
    expectedCurrency: 'GBP',
  },
];

const invalidOld = [
  'Infinity GBP',
  '100gbp100',
  'gbp-100gbp',
  'gbp100gbp',
  'gbp100gbp100',
  '100gbp100gbp100',
  '100 100',
  '100 -100',
  '100 100USD',
  '100USD 100',
  '100USD 100USD',
  '100',
  'hello there',
  '',
  'null gbp',
  'undefined gbp',
  'gbp null',
  'gbp undefined',
  'too many args',
  null,
  NaN,
  undefined,
  Infinity,
];

// Test valid input.
validInputs.forEach((testValues) => {

  // Convert into object with defaults if necessary.
  testValues = testValues.request === undefined ? { request: testValues } : testValues;
  testValues.expectedAmount = testValues.expectedAmount === undefined ? 100 : testValues.expectedAmount;
  testValues.expectedCurrency = testValues.expectedCurrency === undefined ? 'GBP' : testValues.expectedCurrency;

  // Run test.
  test(`Should parse '${testValues}' correctly`, () => {
    const parsedInput = inputParser.parse(testValues.request);
    expect(parsedInput.error).toBeNull();
    expect(parsedInput.amount).toBe(testValues.expectedAmount);
    expect(parsedInput.currency).toBe(testValues.expectedCurrency);
  });
});

// Test invalid input.
invalidOld.forEach((value) => {
  test(`Should halt on invalid format '${value}'`, () => {
    const parsedInput = inputParser.parse(value);
    expect(parsedInput.error).not.toBeNull();
    expect(parsedInput.amount).toBeUndefined();
    expect(parsedInput.currency).toBeUndefined();
  });
});