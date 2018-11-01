var account = {}

account.CHAIN_MIN_ACCOUNT_NAME_LENGTH = 2;
account.CHAIN_MAX_ACCOUNT_NAME_LENGTH = 25;

var err = {}

err.public = {}
err.db = {}
err.bch = {}

err.bch.BCH_PRIVATE_KEY_REQUIRED = 1403;

err.db.DB_ER_DUP_ENTRY = 1062;
err.db.DB_ER_DISK_FULL = 1021;

err.public.UNKNOWN = -7575;
err.public.OK = 0;
err.public.INVALID_LOGIN = 1;

err.public.SERVER_API_NOT_FOUND = 404;

err.public.BCH_INSUFFICIENT_FUNDS = 1401;
err.public.BCH_INVALID_PUB_KEY = 1402;

err.public.ACCOUNT_EXIST = 1501;

err.public.TEST = -7878;

Object.freeze(err);
Object.freeze(account);

module.exports = {
    account: account,
    err: err
};