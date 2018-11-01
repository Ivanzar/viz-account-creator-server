'use strict';

/**
 * @typedef {import('./controller')} Controller
 * @typedef {import('./model')} Model
 */

/**
 * @type {WeakMap<View, Model>}
 */
var _model = new WeakMap();
/**
 * @type {WeakMap<View, Controller>}
 */
var _controller = new WeakMap();

class View
{
    constructor(model, controller)
    {

        this.setModel(model);
        this.setController(controller);

        this.getController().setModel(model);
        this.getController().setView(this);
    }

    setModel(model){
        _model.set(this, model);
    }

    getModel()
    {
        return _model.get(this);
    }

    setController(controller)
    {
        _controller.set(this, controller);
    }

    getController()
    {
        return _controller.get(this);
    }
}

module.exports = View;