/**
 *
 *
 * @param requestedAmount
 * @param baseSymbol
 * @param results
 * @param symbols
 * @returns {string}
 */
const build = function(requestedAmount, baseSymbol, results, symbols) {
  let responseString = `${requestedAmount} ${baseSymbol} is`;
  const processedResults = [];

  results.forEach((result) => {
    if (result.response == null) return;

    if (result.source === 'fixer') {
      // Loop through requested symbols, get value out of Fixer response.
      symbols.forEach((symbol) => {
        processedResults.push({
          amount: (requestedAmount * result.response.rates[symbol]).toFixed(2),
          symbol,
        });
      });
    }

    if (result.source === 'coindesk') {
      processedResults.push({
        amount: (requestedAmount / result.response.bpi[baseSymbol].rate_float).toFixed(5),
        symbol: 'BTC',
      });
    }
  });

  // Build response string.
  processedResults.forEach((processedResult) => {
    responseString += ` ${processedResult.amount} ${processedResult.symbol},`;
  });

  // Replace last comma with a full stop.
  responseString = responseString.slice(0, -1);
  responseString += '.';

  return responseString;
};

module.exports = {
  build,
};
