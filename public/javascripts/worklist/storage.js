(function (exports) {
    'use strict';

    /**
     * Storage Module
     */
    function Storage() {
        console.log('Storage');
    }

    Storage.prototype.setData = function (key, value) {
        this.data = this.data || {};
        this.data[key] = value;
    }

    Storage.prototype.getData = function (key) {
        this.data = this.data || {};
        return this.data[key] || {};
    }

    Storage.prototype.removeData = function (key) {
        this.data = this.data || {};
        if (this.data.hasOwnProperty(key)) {
            delete this.data[key];
        }
    }

    exports.worklist = exports.worklist || {};    
    exports.worklist.Storage = Storage;
})(window);