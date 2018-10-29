const Promise = require("bluebird");
const fs = require('fs');

module.exports = {
    readFile: Promise.promisify(fs.readFile)
};