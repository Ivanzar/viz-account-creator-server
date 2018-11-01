/**
 * @module 'bluebird'
 */

const MariaSQL = require('./db');
const Model = require('../mvc/model');
require('bluebird');
class DBModel extends Model
{
    /**
     * @param {string} account 
     * @returns {Promise}
     */
    addAccount(account)
    {}

    /**
     * @param {string} account
     * @returns {Promise}
     */
    deleteAccount(account)
    {}

    /**
     * @param {Date} date 
     * @returns {Promise}
     */
    getOldAccounts(date)
    {
        this.de
    }
}

module.exports = DBModel;