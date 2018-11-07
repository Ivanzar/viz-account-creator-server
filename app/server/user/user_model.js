/**
 * @typedef {import('../../config/config_model')} ConfigModel
 */

const Promise = require('bluebird');
const viz = require('viz-world-js');

const Model = require('../../mvc/model');
const viz_util = require('../../util/viz_util');
const valid_util = require('../../util/valid');
const constant = require('../../const');

class UserModel extends Model
{
    /**
     * @param {string} login 
     * @param {object} keys 
     * @param {ConfigModel} config_model 
     */
    createAccount(login, keys, config_model)
    {   
        var wif = config_model.getConfig().blockchain.creator_key;
        var fee = '0.000 VIZ';
        var delegation = viz_util.convertNumToSharesFormat(config_model.getDelegation());
                
        var creator = config_model.getConfig().blockchain.creator;
        var newAccountName = login;

        var owner = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[keys.owner, 1]]
        };

        var active = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[keys.active, 1]]
        };

        var posting = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[keys.posting, 1]]
        };

        var memoKey = keys.memo;
        var jsonMetadata = '{}';
        var referer = '';
        var extensions = [];

        var promise = Promise.try(() => {
            var val = valid_util.isValidAccount(login);

            if (!val){
                let err = new Error('Invalid account name ' + login);
                err.code = constant.err.public.INVALID_LOGIN;
                throw err;
            }

            return true;
        }).then(res => {
            var isValMemo = valid_util.isValidPubKey(keys.memo);
            var isValPosting = valid_util.isValidPubKey(keys.posting);
            var isValActive = valid_util.isValidPubKey(keys.active);
            var isValOwner = valid_util.isValidPubKey(keys.owner);

            if (!isValActive  && !isValMemo && !isValOwner && !isValPosting)
            {
                let err = new Error('Invalid keys ');
                err.code = constant.err.public.BCH_INVALID_PUB_KEY;
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
        }).catch(error => {

            var err = new Error(error.message);
            err.code = error.code;
            err.payload = error.payload;

            var errMessage = err.message;
            // console.log('EERRRRRRRRVVRPV<PR<VPVP<');
            // console.log(err);

            if (errMessage.startsWith('Assert Exception (10)\ncurrent_delegation >= target_delegation'))
            {
                return config_model.updateDelegation()
                        .then(delegation => {
                            return this.createAccount(login, keys, config_model);
                        });
            }

            if (errMessage.startsWith('Assert Exception (10)\ncreator.available_vesting_shares(true) >= o.delegation'))
            {
                err.code = constant.err.public.BCH_INSUFFICIENT_FUNDS;
            }

            if (errMessage.startsWith('could not insert object, most likely a uniqueness constraint was violated'))
            {
                err.code = constant.err.public.ACCOUNT_EXIST;
            }

            if (errMessage.startsWith('transaction.operations = account_create'))
            {
                err.code = constant.err.public.BCH_KEY_NOT_BEGIN_WITH_VIZ;
            }

            throw err;
        });

        return promise;
    }

    /**
     * @param {ConfigModel} config_model 
     */
    refundSharesFromOldAccounts(config_model)
    {
        var that = this;

        //console.log('refundSharesFromOldAccounts');

        var creator = config_model.getConfig().blockchain.creator;

        function clearVestingDelegations(fromAccount, offset){
            var lastAccount = '';

            var isCancle = false
            var clearPromise = viz.api.getVestingDelegationsAsync(creator, fromAccount, 1000, 'delegated')
                                .then(res => {
                                    if (res.length - offset === 0) 
                                    {
                                        //console.log('return null;');
                                        isCancle = true;
                                        return;
                                    }
                                    return res.slice(offset, res.length);
                                }).then(res => {
                                    if (isCancle) return;

                                    var accounts = [];

                                    res.forEach(el => {
                                        accounts.push(el.delegatee);
                                    });

                                    return accounts;
                                }).then(accounts => {
                                    if (isCancle) return;
                                    lastAccount = accounts[accounts.length - 1];
                                    return viz.api.getAccountsAsync(accounts);
                                }).then(accounts => {
                                    if (isCancle) return;

                                    var timeNow =  parseInt(new Date(Date.now()).getTime() / 1000);
                                    var newAccountsArr = [];

                                    accounts.forEach(el => {
                                        let createdTime = parseInt(new Date(el.created).getTime() / 1000);
                                        let timeDifferent = timeNow - createdTime;
                                        
                                        var refund_interval = config_model.getConfig().server.refund_interval_sec;
                                        
                                        if (timeDifferent >= refund_interval)
                                        {
                                            //console.log('### REFUND ###');
                                            //console.log(el.name + ' ' + timeDifferent);
                                            newAccountsArr.push(el.name);
                                        }
                                    });

                                    newAccountsArr.forEach(name => { 
                                        that.removeSharesFromAccount(name, config_model);
                                    });

                                    clearVestingDelegations(lastAccount, 1);

                                    return true;
                                });
            return clearPromise;
        }

        return clearVestingDelegations('', 0);
    }

    /**
     * 
     * @param {string} name 
     * @param {ConfigModel} config_model
     */
    removeSharesFromAccount(name, config_model)
    {
        //console.log('removeSharesFromAccount');

        var creator = config_model.getConfig().blockchain.creator;
        var wif = config_model.getConfig().blockchain.creator_key;

        return viz.broadcast.delegateVestingSharesAsync(wif, creator,
                                                        name, '0.000000 SHARES');
    }

}

module.exports = UserModel;