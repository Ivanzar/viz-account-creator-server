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

    refundSharesFromOldAccounts()
    {
        return this.getController().refundSharesFromOldAccounts();
    }
}

module.exports = UserView;