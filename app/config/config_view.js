'use strict';

const View = require('../mvc/view');

class ConfigView extends View
{
    updateConfig()
    {
        return this.getController().updateConfig();
    }

    getConfig()
    {
        return this.getController().getConfig();
    }

    updateDelegation()
    {
        return this.getController().updateDelegation();
    }

    getDelegation()
    {
        return this.getController().getDelegation()
    }

    updateAll()
    {
        return this.getController().updateAll();
    }
}

module.exports = ConfigView;