/**
 * @typedef {import('../config/config_model')} ConfigModel
 * @typedef {import('../config/config_view')} ConfigView
 */

const http = require('http');
const crossroads = require('crossroads');

const UserView = require('./user/user_view');
const UserController = require('./user/user_controller');
const UserModel = require('./user/user_model');

const result_util = require('../util/result');
const constant = require('../const');

/**
 * @type {ConfigView}
 */
var _configView;
/**
 * @type {ConfigModel}
 */
var _configModel;

/**
 * @type {UserView}
 */
var _userView;

function updateDelegation()
{
    _configView.updateDelegation()
    .then(res => {
        setTimeout(updateDelegation, constant.server.UPDATE_DELEGATION_INTERVAL);
    });
}

crossroads.addRoute('/api/broadcast/account/create/{login}{?keys}',
            (req, res, login, keys) => {
                _userView.createAccount(login, keys)
                .then(result => {
                    res.end(result_util.getSuccessJson(result));
                }).catch(error => {
                    console.log('Err mes: ' + error.message);
                    console.log('Err code: ' + error.code);
                    console.log(JSON.stringify(error));
                    console.log(error);

                    var code = constant.err.public.UNKNOWN;

                    Object.getOwnPropertyNames(constant.err.public).forEach((key) => {
                        if (error.code === constant.err.public[key]) 
                            code = constant.err.public[key];
                    });

                    error.code = code;

                    res.end(result_util.getErrorJson(error));
                });
            });

class Server
{
    /**
     * @param {ConfigView} configView 
     */
    constructor(configView)
    {
        _configView = configView;
        _configModel = configView.getModel();

        _userView = new UserView(new UserModel(), new UserController(), _configModel);
    }

    start()
    {
        http.createServer((req, res) => {
            crossroads.parse(req.url, [req, res])
        }).listen(_configModel.getConfig().server.port);
        console.log('Server run on port: ' + _configModel.getConfig().server.port);

        setTimeout(updateDelegation, constant.server.UPDATE_DELEGATION_INTERVAL);
    }
}

module.exports = Server;