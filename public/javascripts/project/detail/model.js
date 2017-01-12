(function (exports) {
    'use strict';

    function Model(storage) {
        console.log('Model created');
        this.storage = storage;
    }

    Model.prototype.saveComment = function(comment){
        $.ajax({
            url : '/project/comment',
            data : comment,
            dataType : 'json',
            method : 'POST'
        });
    }

    exports.project = exports.project || {};
    exports.project.Model = Model;

})(window);