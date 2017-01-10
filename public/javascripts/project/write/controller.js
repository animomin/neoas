(function (exports) {
    'use strict';

    function Controller(model, view) {
        console.log('Controller created');
        this.model = model;
        this.view = view;

        
    }

    
    exports.project = exports.project || {};
    exports.project.Controller = Controller;

})(window);