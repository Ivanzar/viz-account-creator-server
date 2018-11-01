/**
 * @typedef import('../../config/model') ConfigModel
 */

const Controller = require('../../mvc/controller');

/**
 * @type {WeakMap<UserController, ConfigModel>}
 */
var _configModel = new WeakMap();

class UserController extends Controller
{
    createAccount(login, keys)
    {
        this.getModel().createAccount(login, keys, this.getConfigModel);
    }

    setConfigModel(model)
    {
        _configModel.set(this, model);
    }

    getConfigModel()
    {
        return _configModel.get(this);
    }

    createAccount(login, keys)
    {
        return this.getModel().createAccount(login, keys, this.getConfigModel());
    }
}

module.exports = UserController;