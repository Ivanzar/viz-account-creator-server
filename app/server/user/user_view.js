const View = require('../../mvc/view');

class UserView extends View
{
    constructor(model, controller, configModel)
    {
        super(model, controller);
        
        this.getController().setConfigModel(configModel);
    }

    createAccount(login, keys)
    {
        return this.getController().createAccount(login, keys);
    }
}

module.exports = UserView;