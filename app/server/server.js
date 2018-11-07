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

var _refund_interval;

function updateDelegation()
{
    _configView.updateDelegation()
    .then(res => {
        setTimeout(updateDelegation, constant.server.UPDATE_DELEGATION_INTERVAL);
    });
}

function refund()
{
    _userView.refundSharesFromOldAccounts()
    .then(res => {
        setTimeout(() => {refund();}, _refund_interval);
    });
}

crossroads.addRoute('/api/broadcast/account/create/{login}{?keys}',
            (req, res, login, keys) => {
                _userView.createAccount(login, keys)
                .then(result => {
                    //console.log(result);

                    //console.log(result.operations[0][1].new_account_name);

                    res.end(result_util.getSuccessJson(result));

                    if (_refund_interval <= 0)
                    {
                        _userView.removeSharesFromAccount(result.operations[0][1].new_account_name);
                    }

                }).catch(error => {
                    // console.error('#### ERROR LOG START ####');
                    // console.error('Err mes: ' + error.message);
                    // console.error('Err code: ' + error.code);
                    // console.error(JSON.stringify(error));
                    // console.error(error);
                    // console.error('==== ERROR LOG END ====');

                    var code = constant.err.public.UNKNOWN;

                    Object.getOwnPropertyNames(constant.err.public).forEach((key) => {
                        if (error.code === constant.err.public[key]) 
                            code = constant.err.public[key];
                    });

                    error.code = code;

                    if (code === constant.err.public.UNKNOWN)
                    {
                        console.error('#### ERROR LOG START ####');
                        console.error('Err mes: ' + error.message);
                        console.error('Err code: ' + error.code);
                        console.error(JSON.stringify(error));
                        console.error(error);
                        console.error('==== ERROR LOG END ====');
                    }

                    res.end(result_util.getErrorJson(error));
                });
            });

crossroads.addRoute(':rest*:',
                    (req, res) => {
                        var error = new Error();
                        error.code = constant.err.public.SERVER_API_NOT_FOUND;
                        res.end(result_util.getErrorJson(error));
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

        _refund_interval = _configView.getConfig().server.refund_interval_sec * 1000;

        _userView = new UserView(new UserModel(), new UserController(), _configModel);
    }

    start()
    {
        http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
            //console.log(req.url);
            crossroads.ignoreState = true;
            crossroads.parse(req.url, [req, res])
        }).listen(_configModel.getConfig().server.port, _configModel.getConfig().server.host);
        console.log('Server run on: ' + _configModel.getConfig().server.host+':'+_configModel.getConfig().server.port);


        if (_refund_interval > 0)
        {
            refund();
            setTimeout(updateDelegation, constant.server.UPDATE_DELEGATION_INTERVAL);
        }
    }
}

module.exports = Server;