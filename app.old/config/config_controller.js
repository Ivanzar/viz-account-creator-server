const promise_util = require('../util/promise');
const config_util = require('../util/config');
const viz = require('viz-world-js');

var config_model;

function setModel(model)
{
    config_model = model;
}

function getModel()
{
    return config_model;
}

function updateAll()
{
    return updateConfig(config_model)
            .then(conf => updateDelegation(config_model))
            .then(cong => config_model);
}

function updateConfig()
{
    return promise_util.readFile(config_util.getResourcesPath('config/config.json'))
            .then(data => {
                config_model.config = JSON.parse(data);
                return config_model.config;
            });
}

function updateDelegation()
{
    return viz.api.getChainPropertiesAsync()
            .then(res => {

                var delegation_ratio = res.create_account_delegation_ratio;
                var fee = parseFloat(res.account_creation_fee);

                config_model.delegation = delegation_ratio * fee;
                return config_model.delegation;
            });
}

module.exports = {
    setModel: setModel,
    getModel: getModel,
    updateAll: updateAll,
    updateConfig: updateConfig,
    updateDelegation: updateDelegation
};