module.exports = {
    getErrorJson: function (err)
    {
        return JSON.stringify({
            result: 'error',
            error: {
                code: err.code,
                payload: err.payload || []
            }
        });
    },
    getSuccessJson: function(res)
    {
        return JSON.stringify({result: res});
    },
    convertError: function(mess, code)
    {
        var err = new Error(mess);
        err.code = code;

        return err;
    }
};