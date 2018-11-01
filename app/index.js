const ConfigView = require('./config/config_view');
const ConfigController = require('./config/config_controller');
const ConfigModel = require('./config/config_model');
const Server = require('./server/server');

var configView = new ConfigView(new ConfigModel(), new ConfigController());

configView.updateAll()
.then(res => {
    new Server(configView).start();
});