const _config_view = require('./config/config_view');
const _db_view  = require('./db/db_view');
const _db_model = require('./db/db_model');
const _server = require('./server/server');

_config_view.updateAll()
.then(configModel => {

    _db_model.config = configModel.config.db;
    _db_view.setModel(_db_model);

    _server.setConfigView(_config_view);
    _server.setDBView(_db_view);

    _server.start();
});