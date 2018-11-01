const db = require('./db');
const constant = require('../const');
const valid = require('../util/valid');

var model = {
    config: {},
    addUser: function (login)
    {
        if (!valid.isValidAccount(login))
        {
            let err = new Error('Invalid account name' + login);
            err.code = constant.err.public.INVALID_LOGIN;

            throw err;
        }

        return query('INSERT INTO ' + this.config.table + ' (login) VALUES ("' + login + '")');
    },
    deleteUser: function (login)
    {
        return query('DELETE FROM ' + this.config.table + ' WHERE login="' + login + '"');
    },
    getOldAccounts: function (date)
    {
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return query('SELECT login FROM ' + this.config.table
         + ' WHERE DATE(date) < DATE("' + date + '")');
    },
    init: init
};


function query(q)
{
    if (!db.connected)
    {        
        return init().then(res => db.query(q));
    } 
    return db.query(q);
}

function init()
{
    return db.connect({
        host: model.config.host,
        port: model.config.port,
        user: model.config.user,
        password: model.config.password
    }).then(res => {
        return db.query('CREATE DATABASE IF NOT EXISTS ' + model.config.databse);
    }).then(res => {
        return db.query('USE ' + model.config.databse);
    }).then(res => {
        return db.query('CREATE TABLE IF NOT EXISTS ' + model.config.table 
        + ' (login CHAR('+ constant.account.CHAIN_MAX_ACCOUNT_NAME_LENGTH +') PRIMARY KEY,'
        + 'date DATE DEFAULT CURRENT_TIMESTAMP)');
    });
}

module.exports = model;