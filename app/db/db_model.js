const db = require('./db');

var model = {
    config: {},
    addUser: function (login)
    {
        return query('INSERT INTO ' + this.config.table + ' (login) VALUES ("' + login + '")');
    },
    deleteUser: function (login)
    {
        return query('DELETE FROM ' + this.config.table + ' WHERE login="' + login + '"');
    },
    /**
     * 
     * @param {Date} date 
     */
    getOldAccounts: function (date)
    {
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return query('SELECT login FROM ' + this.config.table + ' WHERE DATE(date) < DATE("' + date + '")');
    },
    init: init
};


function query(q)
{
    if (!db.connected)
    {        return init().then(res => db.query(q));
    } 
    return db.query('USE ' + model.config.databse).then(res => db.query(q));
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
        + ' (login CHAR(25) PRIMARY KEY, date DATE DEFAULT CURRENT_TIMESTAMP)');
    });
}

module.exports = model;