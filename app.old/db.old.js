const Client = require('mariasql-promise');
const Promise = require("bluebird");

var client, databse, dbTable;

function init(user, pass, db, table, host, port)
{
    databse = db;
    dbTable = table;

    client = new Client();

    return Promise.try(() => {
        return client.connect(
                {
                    host: host,
                    port: port,
                    user: user,
                    password: pass
                });
    }).then(res => client.query('CREATE DATABASE IF NOT EXISTS ' + databse))
            .then(res => client.query('USE ' + databse))
            .then(res => client.query('CREATE TABLE IF NOT EXISTS ' + dbTable + ' ('
                        + 'login CHAR(25) PRIMARY KEY,'
                        + 'date DATE NOT NULL)'));
}

function insertAuthor(name, date)
{
    return Promise.try(() =>
    {
        if (name.length < 2)
        {
            throw Error('name.leght < ACCOUNT_MIN_LEGHTG');
        } else if (name.length > 25)
        {
            throw Error('name.leght > ACCOUNT_MAX_LEGHTG');
        }

        return client.query('USE ' + databse);
    }).then(res =>
        client.query('INSERT INTO ' + dbTable
                + ' (login, date) VALUES ("' + name + '", "' + date + '")')
    );
}

function deleteAuthor(name)
{
    return Promise.try(() =>
    {
        return client.query('USE ' + databse);
    }).then(
            res => client.query('DELETE FROM ' + dbTable + ' WHERE login="' + name + '"')
    );
}

function getOldAccounts(date)
{
    return Promise.try(() =>
    {
        return client.query('USE ' + databse);
    }).then(
            res => client.query('SELECT login FROM ' + dbTable + ' WHERE DATE(date) < DATE("' + date + '")')
    );
}

function updateNextIteration()
{}

function updateLastIteration()
{}

module.exports = {
    init: init,
    insertAuthor: insertAuthor,
    deleteAuthor: deleteAuthor,
    getOldAccounts: getOldAccounts
};