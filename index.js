const inputParser = require('./src/inputParser');
const getConversionRates = require('./src/getConversionRates');

const arg1 = process.argv[2];
const arg2 = process.argv[3] === undefined ? '' : process.argv[3];

const request = `${arg1} ${arg2}`.trim();

// TODO test consistent input.

const parsedRequest = inputParser.parse(request);
const requestedAmount = parsedRequest.amount;
const baseSymbol = parsedRequest.currency;

console.log(requestedAmount, baseSymbol);

// Build list of symbols; exclude requested symbol if in list.
const symbols = [
  'GBP',
  'USD',
  'EUR',
  'CHF'
].filter((defaultCurrency) => {
  return defaultCurrency !== baseSymbol;
});

const processResults = function (results) {
  let rates = null;
  let btcRate = null;

  // TODO handle unexpected responses.

  results.forEach((result) => {
    if (result.source === 'fixer') {
      rates = result.response.rates;
    }
    if (result.source === 'coindesk') {
      btcRate = result.response.bpi[baseSymbol].rate_float;
    }
  });

  // Start of response message.
  let conversionMsg = `${requestedAmount} ${baseSymbol} is`;

  // Build fiat currency conversion.
  symbols.forEach((symbol) => {
    const rate = rates[symbol]
    const value = (requestedAmount * rate).toFixed(2);
    conversionMsg += ` ${value} ${symbol},`;
  });

  // Build BTC conversion.
  const btcValue = requestedAmount / btcRate;
  conversionMsg += ` BTC ${btcValue.toFixed(5)}`;

  // Return final string.
  console.log(conversionMsg);
};

Promise.all(
  getConversionRates.getRates(baseSymbol, symbols))
    .then((results) => processResults(results)
  );
