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

            throw err;
        });

        return promise;
    }

    refundSharesFromOldAccounts()
    {
        function getVesting();
    }

}

module.exports = UserModel;