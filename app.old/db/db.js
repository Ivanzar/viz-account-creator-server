const MariaSQL = require('mariasql');
const Promise = require('bluebird');

const _client = new MariaSQL();

var db = {};

db.connect = function(config, callback)
{
    function errorListener (err)
    {
        removeListners();
        callback(err, null);
    };

    function successListener (res)
    {
        removeListners();
        db.connected = true;
        callback(null, res);
    };

    function removeListners()
    {
        _client.removeListener('error', errorListener);
        _client.removeListener('ready', successListener);
    }
    
    _client.on('error', errorListener)
    _client.on('ready', successListener);
    _client.connect(config);
}

db.query = function (query, callback)
{
    _client.query(query, function(err, res)
    {
        callback(err, res);
    })
}

Object.getOwnPropertyNames(db).forEach(name => {
    db[name] = Promise.promisify(db[name]);
});

db.end = function ()
{
    _client.end();
    db.connected = false;
}

db.connected = false;

module.exports = db;