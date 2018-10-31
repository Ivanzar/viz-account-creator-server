const _http = require('http');
const _crossroads = require('crossroads');
const _result_util = require('../util/result');
const _constant = require('../const');
const _create_user = require('./create_user/create_user_view');

const _db = require('../db/db_view');
const _db_model = require('../db/db_model');

var _configModel, _configView, _dbView;

_crossroads.addRoute('/',
    function (req, res){
        res.statusCode = 404;
        res.statusMessage = 'Not found';

        res.end(_resultUtil.getErrorJson(_constant.err.public.SERVER_API_NOT_FOUND));
    }
);

_crossroads.addRoute('/api/broadcast/account/create/{login}{?keys}',
    function (req, res, login, keys){
        _create_user.create(login, keys, _dbView, _configView)
            .then(res => {
                res.end(_result_util.getSuccessJson(res));
            }).catch(error => {

                var err = error;
                
                console.error('Error mes: ' + err.message);
                console.error('Error code: ' + err.code);
                console.error(err);

                var code = _constant.err.public.UNKNOWN;

                //sort only public allowed codes
                Object.getOwnPropertyNames(_constant.err.public).forEach(key => {
                    console.log(key)
                    if (err.code === _constant.err.public[key]) code = _constant.err.public[key];
                });

                err.code = code;

                res.end(_result_util.getErrorJson(err));
            });
    }
);

function setConfigView(config)
{
    _configModel = config.getModel();
    _configView = config;
}

function setDBView(db)
{
    _dbView = db;
}

function start()
{
    var server = _http.createServer(function (req, res){
                        _crossroads.parse(req.url, [req, res]);
                    });
    server.listen(_configModel.config.server.port);
    
    console.log('Server start on port: ' + _configModel.config.server.port);

    deleteOldAccounts();
    setTimeout(updateDelegation, 3 * 1000);
}

function updateDelegation()
{
    _configView.updateDelegation();

    setTimeout(updateDelegation, 3 * 1000)
}

function deleteOldAccounts()
{
    _create_user.deleteOldAccounts(_dbView, _configView);

    console.log(_dbView);

    setTimeout(deleteOldAccounts, _configModel.config.server.refund_interval_day * 1000);
}

module.exports = {
    setConfigView: setConfigView,
    setConfigView: setConfigView,
    setDBView: setDBView,
    start: start
}