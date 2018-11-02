var account = {}

account.CHAIN_MIN_ACCOUNT_NAME_LENGTH = 2;
account.CHAIN_MIN_CREATE_ACCOUNT_NAME_LENGTH = 3;
account.CHAIN_MAX_ACCOUNT_NAME_LENGTH = 25;

var server = {};
server.UPDATE_DELEGATION_INTERVAL = 30*60*1000;

var err = {}

err.public = {}
err.db = {}
err.bch = {}

err.bch.BCH_PRIVATE_KEY_REQUIRED = 11403;

err.db.DB_ER_DUP_ENTRY = 21062;
err.db.DB_ER_DISK_FULL = 21021;

err.public.UNKNOWN = -57575;
err.public.OK = 0;
err.public.INVALID_LOGIN = 51401;

err.public.SERVER_API_NOT_FOUND = 404;

err.public.BCH_INSUFFICIENT_FUNDS = 51402;
err.public.BCH_INVALID_PUB_KEY = 51403;
err.public.BCH_KEY_NOT_BEGIN_WITH_VIZ = 51404;

err.public.ACCOUNT_EXIST = 51501;

err.public.TEST = -57878;

Object.freeze(err);
Object.freeze(account);
Object.freeze(server);

module.exports = {
    account: account,
    err: err,
    server: server
};