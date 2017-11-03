const inputParser = require('./src/inputParser');
const getConversionRates = require('./src/getConversionRates');
const buildResponse = require('./src/buildResponse');

/**
 * Get input string.
 */
const arg1 = process.argv[2];
const arg2 = process.argv[3] === undefined ? '' : process.argv[3];
const request = `${arg1} ${arg2}`.trim();

/**
 * Parse input string.
 *
 * @type {{error: *, amount: *, currency: *}}
 */
const parsedRequest = inputParser.parse(request);
const requestedAmount = parsedRequest.amount;
const baseSymbol = parsedRequest.currency;

/**
 * Get conversion rates.
 */
// Build list of symbols and exclude baseSymbol if it's in the default list.
const symbols = [
  'GBP',
  'USD',
  'EUR',
  'CHF'
].filter((defaultCurrency) => {
  return defaultCurrency !== baseSymbol;
});

// Get the rates.
Promise.all(
  getConversionRates.getRates(baseSymbol, symbols)).then((results) => processResults(results)
);

/**
 * Build response.
 *
 * @param results
 */
const processResults = function (results) {
  const responseString = buildResponse.build(requestedAmount, baseSymbol, results, symbols);
  console.log(responseString);
};
