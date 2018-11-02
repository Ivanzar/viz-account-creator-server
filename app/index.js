const viz = require('viz-world-js');

const ConfigView = require('./config/config_view');
const ConfigController = require('./config/config_controller');
const ConfigModel = require('./config/config_model');
const Server = require('./server/server');

var configView = new ConfigView(new ConfigModel(), new ConfigController());



configView.updateConfig()
.then(res => {
    var node = res.server.node;
    viz.config.set('websocket', node);
    console.log('API node: ' + viz.config.get('websocket'));

    return configView.updateDelegation();
}).then(res => {
    new Server(configView).start();
});