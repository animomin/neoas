(function (exports) {
    'use strict';

    function Model(storage) {
        console.log('Model created');
        this.storage = storage;
    }

    Model.prototype.RemoveUploadedFile = function(param, callback){
        $.ajax({
            url : '/project/upload',
            method : 'DELETE',
            data : param,
            dataType : 'json',
            complete : function(){
                callback();
            }            
        });
    }

   

    exports.project = exports.project || {};
    exports.project.Model = Model;

})(window);