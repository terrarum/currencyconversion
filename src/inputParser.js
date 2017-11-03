/**
 * Attempts to turn a valid but spaceless input like '100GBP' into '100 GBP'.
 * Runs parseInt against each character. If it's NaN it appends it to `currency`.
 * If it's a number, or it's a '.' or a ',', it appends it to `amount`.
 * Won't handle stuff like '10E5GBP', you'll just get '105 EGBP'.
 *
 * @param value
 * @return {Array}
 */
const splitSingleArg = function(value) {
  const valueArr = value.split('');

  let amount = '';
  let currency = '';

  let isValid = true;
  let previousType = null;
  let currentType = null;

  // For each character, run it through parseInt.
  valueArr.forEach((character) => {
    let characterType = null;
    // If the parseInt(character) is NaN or it's not the string '.', it's probably part of the
    // currency string.
    if (Number.isNaN(parseInt(character)) && character !== '.' && character !== ',') {
      characterType = 'string';
      currency += character;
    }
    // It's a number.
    else {
      characterType = 'number';
      amount += character;
    }

    // Check for too many type switches.
    if (characterType !== currentType) {
      if (previousType !== null) {
        isValid = false;
      }
      previousType = currentType;
      currentType = characterType;
    }
  });

  if (isValid) {
    return `${amount} ${currency}`.split(' ');
  }
  else {
    return {
      error: 'Too many type changes; malformed single string.'
    }
  }
};

const replaceCurrencySymbol = function(request) {
  const pairs = {
    '$': 'USD',
    '£': 'GBP',
    '€': 'EUR',
  };

  request = request.replace(/\$|£|€/gi, function(matched){
    return pairs[matched];
  });

  return request;
};

/**
 * Correctly convert the input string into usable values. Stop if invalid values have been returned.
 *
 * @param request
 * @return {{error: *, amount: *, currency: *}}
 */
const parse = function(request) {
  const response = {
    error: null,
    amount: null,
    currency: null
  };

  // If it's not a string, bail.
  if (typeof request !== 'string') {
    return {
      error: 'Argument is not a string.'
    }
  }

  // Remove all commas.
  request = request.replace(/,/g, '');

  // Remove all hyphens.
  request = request.replace(/-/g, '');

  // Convert currency symbol into TLA.
  request = replaceCurrencySymbol(request);

  // Make it uppercase.
  request = request.toUpperCase();

  // Split string by spaces.
  let requestParts = request.split(' ');

  // Check length of array to see if we need to do further processing.
  if (requestParts.length === 1) {
    // Might be valid but missing a space.
    const singleArgSplit = splitSingleArg(requestParts[0]);

    if (singleArgSplit.error !== undefined) {
      return singleArgSplit;
    }
    else {
      requestParts = singleArgSplit;
    }

    if (requestParts.length !== 2 || requestParts[1] === '') {
      return {
        error: 'Single argument could not be parsed correctly.'
      }
    }
  }
  else if (requestParts.length > 2) {
    // Definitely wrong.
    return {
      error: 'Too many arguments.'
    }
  }

  // Now we know we've got two args, process each part.
  // If it's a number, assign it to `amount`.
  // If it's a string, assign it to `currency`.
  requestParts.forEach((part) => {
    if (Number.isNaN(parseFloat(part))) {
      response.currency = part;
    }
    else {
      response.amount = Math.abs(parseFloat(part));
    }
  });

  // Do we have an amount and a currency?
  if (response.amount === null) {
    return {
      error: 'Amount is not valid.'
    }
  }
  if (response.currency === null) {
    return {
      error: 'Currency is not valid.'
    }
  }

  return response;
};

module.exports = {
  parse,
};
