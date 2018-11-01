const Promise = require("bluebird");
const fs = require('fs');

module.exports = {
    readFile: Promise.promisify(fs.readFile),
    convertToViewReturnFormat: function (func, arg)
    {
        return func(arg)
            .then(res => {
                return res;
            }).catch(err => {
                
            });
    }
};