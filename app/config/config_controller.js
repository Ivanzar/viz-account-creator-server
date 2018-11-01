'use strict';

const Controller = require('../mvc/controller');

class ConfigController extends Controller
{
    updateConfig()
    {
        return this.getModel().updateConfig();
    }

    getConfig()
    {
        return this.getModel().getConfig();
    }

    updateDelegation()
    {
        return this.getModel().updateDelegation()
    }

    getDelegation()
    {
        return this.getModel().getDelegation()
    }

    updateAll()
    {
        return this.getModel().updateAll();
    }
}

module.exports = ConfigController;