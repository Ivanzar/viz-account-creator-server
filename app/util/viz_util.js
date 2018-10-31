module.exports = {
    convertNumToSharesFormat: function (num)
    {
        num += '';

        var index = num.indexOf('.');

        if (index === -1) return num+'.000000 SHARES'

        num += '000000';
        return num.slice(0, (num.indexOf('.')+7)) + ' SHARES';
    }
};