(function (exports) {
    'use strict';

    function Storage() {
        console.log('Storage created');
    }

    exports.project = exports.project || {};
    exports.project.Storage = Storage;

})(window);