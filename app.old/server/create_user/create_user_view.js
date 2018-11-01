const _result = require('../../util/result');
const _model = require('./create_user_model');

var _controller = require('./create_user_controller');

_controller.setModel(_model);

function convertToResultPromise(fun, args)
{
    return fun.apply(this, args)
            .then(res => {
                //return _result.getSuccessJson(res)
                return res;
            }).catch(err => {
                //throw _result.getErrorJson(err.code, err.payload);
                throw err;
            });
}

module.exports = {
    setController: function (controller){
        _controller = controller;
    },
    setModel: _controller.setModel,
    setDbView: _controller.setDbView,
    create: _controller.create,
    deleteOldAccounts: _controller.deleteOldAccounts
}