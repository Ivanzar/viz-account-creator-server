const Promise = require('bluebird');
const viz = require('viz-world-js');
const _constant = require('../../const');
const _valid = require('../../util/valid');

const _viz_util = require('../../util/viz_util');

var _model;

function setModel(model)
{
    _model = model;
}

function create(login, keysObj, db, config_view)
{
    var config_model = config_view.getModel();

    var wif = config_model.config.blockchain.creator_key;
    var fee = '0.000 VIZ';
    var delegation = _viz_util.convertNumToSharesFormat(config_model.delegation);
    
    console.log(delegation);
    
    var creator = config_model.config.blockchain.creator;
    var newAccountName = login;

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

    return Promise.try(() => {
            var res = _valid.isValidAccount(login);

            if (!res)
            {
                let err = new Error('Invalid account name' + login);
                err.code = _constant.err.public.INVALID_LOGIN;
                throw err;
            }

            return true;
        }).then(res => {
            var isValMemo = _valid.isValidPubKey(keysObj.memo);
            var isValPosting = _valid.isValidPubKey(keysObj.posting);
            var isValActive = _valid.isValidPubKey(keysObj.active);
            var isValOwner = _valid.isValidPubKey(keysObj.owner);

            if (!isValActive  && !isValMemo && !isValOwner && !isValPosting)
            {
                let err = new Error('Invalid keys ');
                err.code = _constant.err.public.BCH_INVALID_PUB_KEY;
                err.payload = [];

                if (!isValActive) err.payload.push('active');
                if (!isValMemo) err.payload.push('memo');
                if (!isValOwner) err.payload.push('owner');
                if (!isValPosting) err.payload.push('posting')

                err.message += err.payload.join();

                throw err;
            }

            return true;
        }).then(res => {
            return viz.broadcast.accountCreateAsync(
                wif, fee, delegation,
                creator, newAccountName,
                owner, active, posting, memoKey,
                jsonMetadata, referer, extensions);
        }).then(chainRes => {
            db.setModel(config_model.config.db);

            return db.addUser(login)
                    .then(dbRes => chainRes);
        }).then(res => {
            _model.result = res;
            return _model;
        }).catch(err => {

            let errMess = err.message.split('\n');

            if (!errMess[0]) errMess[0] = 'UNKNOWN';

            if (errMess[0].startsWith('current_delegation >= target_delegation'))
            {
                return config_view.updateDelegation()
                        .then(deligation => {
                            create(login, keysObj, config_model);
                        });
            }

            let error = new Error(err.message);
            error.payload = err.payload;

            if (errMess[0].startsWith('creator.available_vesting_shares(true) >= o.delegation'))
            {
                err.code = _constant.err.public.BCH_INSUFFICIENT_FUNDS;
            }

            if (errMess[0].startsWith('could not insert object, most likely a uniqueness constraint was violated'))
            {
                err.code = _constant.err.public.ACCOUNT_EXIST;
            }

            throw err;
        });
}


function deleteOldAccounts(db, config_view)
{
    var config_model = config_view.getModel();
    var delegator = config_model.config.blockchain.creator;
    var wif = config_model.config.blockchain.creator_key;

    return db.getOldAccounts(new Date(Date.now() - 7*24*60*60*1000))
            .then(res => {
                var len = res.length;
                var resPromise;

                for (let i = 0; i < len; i++)
                {
                    if (!resPromise)
                    {
                        resPromise = viz.broadcast.delegateVestingSharesAsync(wif, delegator, res[i])
                                    .then(res => db.deleteUser(res[i]));
                    } else {
                        resPromise.then(res => viz.broadcast.delegateVestingSharesAsync(wif, delegator, res[i]))
                        .then(res => db.deleteUser(res[i]));
                    }
                }

                return resPromise;
            });
}


module.exports = {
    setModel: setModel,
    create: create,
    deleteOldAccounts: deleteOldAccounts
};