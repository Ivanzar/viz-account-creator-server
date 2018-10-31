var _controller = require('./config_controller');
var _model = require('./config_model');

_controller.setModel(_model);

module.exports = {
    setController: function (controller){
        _controller = controller;
    },
    setModel: _controller.setModel,
    getModel: _controller.getModel,
    updateAll: _controller.updateAll,
    updateConfig: _controller.updateConfig,
    updateDelegation: _controller.updateDelegation
};