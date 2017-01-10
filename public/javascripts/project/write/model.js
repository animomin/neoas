(function (exports) {
    'use strict';

    function Model(storage) {
        console.log('Model created');
        this.storage = storage;
    }

   

    exports.project = exports.project || {};
    exports.project.Model = Model;

})(window);