'use strict';

const Model = require('../mvc/model');
const viz = require('viz-world-js');
const config_util = require('../util/config');
const promise_util = require('../util/promise');

var _config = new WeakMap();
var _delegation = new WeakMap();

class ConfigModel extends Model
{
    updateConfig()
    {
        return promise_util.readFile(config_util.getResourcesPath('config/config.json'))
                .then(data => {
                    _config.set(this, JSON.parse(data));
                    return _config.get(this);
                });
    }

    getConfig()
    {
        return _config.get(this);
    }

    updateDelegation()
    {
        return viz.api.getChainPropertiesAsync()
                .then(res => {
                    var delegation_ratio = res.create_account_delegation_ratio;
                    var fee = parseFloat(res.account_creation_fee);

                    _delegation.set(this, delegation_ratio * fee);
                    return _delegation.get(this);
                });
    }

    getDelegation()
    {
        return _delegation.get(this);
    }

    updateAll()
    {
        return this.updateConfig()
                .then(res => this.updateDelegation());
    }
}

module.exports = ConfigModel;