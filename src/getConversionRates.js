var fetch = require('node-fetch');

const getJson = function (url, source) {
  return fetch(url)
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if(contentType && (contentType.includes("application/json") || contentType.includes("application/javascript"))) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    })
    .then((response) => {
      return {
        source,
        response
      }
    })
    .catch((err) => {
      return {
        source,
        response: null
      }
    });
};

const getFixerRates = function (baseSymbol, symbols) {
  const url = `http://api.fixer.io/latest?base=${baseSymbol}&symbols=${symbols.join(',')}`;

  return getJson(url, 'fixer');
};

const getCoindeskRates = function (baseSymbol) {
  const url = `https://api.coindesk.com/v1/bpi/currentprice/${baseSymbol}.json`;

  return getJson(url, 'coindesk');
};

const getRates = function (baseSymbol, symbols) {
  return [
    getFixerRates(baseSymbol, symbols),
    getCoindeskRates(baseSymbol),
  ];
};

module.exports = {
  getRates,
};
