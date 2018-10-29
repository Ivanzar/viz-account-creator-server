const Promise = require("bluebird");

var db_model;

function setModel(model)
{
    db_model = model;
}

function addUser(login)
{
    return db_model.addUser(login);
}

function deleteUser(login)
{
    return db_model.deleteUser(login);
}

function getOldAccounts(date)
{
    return db_model.getOldAccounts(date);
}

module.exports = {
    setModel: setModel,
    addUser: addUser,
    getOldAccounts: getOldAccounts
}