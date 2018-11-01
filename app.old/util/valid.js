const _constant  = require('../const');
const _viz = require('viz-world-js');

module.exports = {
    isValidPubKey: function (key)
    {
        return _viz.auth.isPubkey(key);;
    },
    isValidAccount: function (name) {
        let len = name.length;

        if (len < _constant.account.CHAIN_MIN_ACCOUNT_NAME_LENGTH) {
            return false;
        }

        if (len > _constant.account.CHAIN_MAX_ACCOUNT_NAME_LENGTH) {
            return false;
        }

        let begin = 0;

        while (true) {
            let end = name.indexOf('.', begin);

            if (end == -1) {
                end = len;
            }

            if (end - begin < _constant.account.CHAIN_MIN_ACCOUNT_NAME_LENGTH) {
                return false;
            }

            switch (name[begin]) {
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                case 'i':
                case 'j':
                case 'k':
                case 'l':
                case 'm':
                case 'n':
                case 'o':
                case 'p':
                case 'q':
                case 'r':
                case 's':
                case 't':
                case 'u':
                case 'v':
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                    break;
                default:
                    return false;
            }

            switch (name[end - 1]) {
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                case 'i':
                case 'j':
                case 'k':
                case 'l':
                case 'm':
                case 'n':
                case 'o':
                case 'p':
                case 'q':
                case 'r':
                case 's':
                case 't':
                case 'u':
                case 'v':
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    break;
                default:
                    return false;
            }

            for (let i = begin + 1; i < end - 1; i++) {
                switch (name[i]) {
                    case 'a':
                    case 'b':
                    case 'c':
                    case 'd':
                    case 'e':
                    case 'f':
                    case 'g':
                    case 'h':
                    case 'i':
                    case 'j':
                    case 'k':
                    case 'l':
                    case 'm':
                    case 'n':
                    case 'o':
                    case 'p':
                    case 'q':
                    case 'r':
                    case 's':
                    case 't':
                    case 'u':
                    case 'v':
                    case 'w':
                    case 'x':
                    case 'y':
                    case 'z':
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '-':
                        break;
                    default:
                        return false;
                }
            }

            if (end == len) {
                break;
            }

            begin = end + 1;
        }
        return true;
    }
};