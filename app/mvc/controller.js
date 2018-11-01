'use strict';

var _model = new WeakMap();
var _view = new WeakMap();

class Controller
{
    setModel(model){
        _model.set(this, model);
    }

    getModel()
    {
        return _model.get(this);
    }

    setView(view)
    {
        _view.set(this, view);
    }

    getView()
    {
        return _view.get(this);
    }
}

module.exports = Controller;