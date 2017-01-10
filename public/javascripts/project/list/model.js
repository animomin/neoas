(function (exports) {
    'use strict';

    function Model(storage) {
        console.log('Model created');
        this.storage = storage;
    }

    Model.prototype.getProjectList = function(item, callback){
        var self = this;
        $.ajax({
            url : '/project/list',
            method : 'GET',
            data : item,
            dataType : 'json',
            async : true,            
            success : function(result){
                callback(result);
            }
        });
    };

    exports.project = exports.project || {};
    exports.project.Model = Model;

})(window);