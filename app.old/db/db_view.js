var _controller = require('./db_controller');

module.exports = {
    setController: function (controller){
        _controller = controller;
    },
    setModel: _controller.setModel,
    addUser: _controller.addUser,
    deleteUser: _controller.deleteUser,
    getOldAccounts: _controller.getOldAccounts
};