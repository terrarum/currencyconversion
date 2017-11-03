const inputParser = require('./src/inputParser');

const request = `${process.argv[2]} ${process.argv[3]}`;

const parsedRequest = inputParser.parse(request);
console.log(parsedRequest);
