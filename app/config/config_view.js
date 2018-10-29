const controller = require('./config_controller');
var model = require('./config_model');

controller.setModel(model);

module.exports = {
    setModel: function (model) {controller.setModel(model)},
    updateAll: function () {return controller.updateAll()},
    updateConfig: function () { return controller.updateConfig()},
    updateDelegation: function () { return controller.updateDelegation()}
};