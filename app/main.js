const http = require('http');
const fs = require('fs');
const crossroads = require('crossroads');
const util = require('util');
const viz = require('viz-world-js');
const Promise = require("bluebird");
const db = require('./db');

var config, delegation;
var resourcesPath = __dirname + '/../resources/';

if (process.env.NODE_ENV === 'dev')
{
    resourcesPath += 'dev/';
}
var readFile = Promise.promisify(fs.readFile);

readFile(getResourcesPath('config/config.json'))
        .then(data => {
            init(data);
            return updateDelegation();
        })
        .then(res => {
            crossroads.addRoute('/api/broadcast/account/create/{login}{?keys}',
                    function (req, res, login, keys)
                    {
                        //console.log(login + ': ' + util.inspect(keys, false, null, true));
                        //res.end('hi');

                        createAccount(login,
                                {
                                    owner: keys.owner,
                                    active: keys.active,
                                    posting: keys.posting,
                                    memo: keys.memo
                                },
                                res);
                    }
            );

            crossroads.addRoute('/',
                    function (req, res, login, keys)
                    {
                        res.statusCode = 404;
                        res.statusMessage = 'Not found';
                        res.end('404 Not found');
                    }
            );

            http.createServer(function (req, res)
            {
                crossroads.parse(req.url, [req, res]);
            }).listen(config.server.port);

            console.log('Account creation fee: ' + delegation);
            console.log('Account creator: ' + config.blockchain.creator);
            console.log('Server start on port ' + config.server.port);
        });

function init(confifData)
{
    confifData = JSON.parse(confifData);
    config = confifData;
    
    db.init(config.db.user, config.db.password,
    config.db.databse, config.db.table, config.db.host, config.db.port)
            .then(res => db.insertAuthor());
}

function getResourcesPath(path)
{
    return resourcesPath + path;
}

function updateDelegation()
{
    return viz.api.getChainProperties()
            .then(res => {

                var delegation_ratio = res.create_account_delegation_ratio;
                var fee = parseFloat(res.account_creation_fee);
                delegation = delegation_ratio * fee;
                console.log('Delegation: ' + delegation);
                return delegation;
            });
}

function createAccount(name, keysObj, response)
{
    var wif = config.blockchain.creator_key;
    var fee = '0.000 VIZ';
    var delegation = '1.000000 SHARES';
    var creator = config.blockchain.creator;
    var newAccountName = name;

    var owner = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[keysObj.owner, 1]]
    };

    var active = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[keysObj.active, 1]]
    };

    var posting = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[keysObj.posting, 1]]
    };

    var memoKey = keysObj.memo;
    var jsonMetadata = '{}';
    var referer = '';
    var extensions = [];

    return viz.broadcast.accountCreateAsync(
            wif, fee, delegation,
            creator, newAccountName,
            owner, active, posting, memoKey,
            jsonMetadata, referer, extensions)
            .then(res => {
                console.log(util.inspect(res, false, null, true));
            })
            .catch(err => {
                var errMess = err.payload.error.message.split('\n');

                if (errMess[1].startsWith('current_delegation >= target_delegation'))
                {
                    //response.end(JSON.stringify({error: 'current_delegation >= target_delegation'}));
                    config.blockchain.creator = 'megatester';
                    config.blockchain.creator_key = '5KN3JswdW53BR6qd9NzN7U98neM5tRW8pL9mgyTSUTtjRFyHcau';

                    return updateDelegation()
                            .then(res => {
                                return createAccount(name, keysObj, response);
                            });

                }

                if (errMess[1].startsWith('creator.available_vesting_shares(true) >= o.delegation'))
                {
                    response.end(JSON.stringify({error: 'creator.available_vesting_shares(true) >= o.delegation'}));
                }

                console.error(util.inspect(err, false, null, true));
            });

}

