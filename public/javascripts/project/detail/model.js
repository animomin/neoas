(function (exports) {
    'use strict';

    function Model(storage) {
        console.log('Model created');
        this.storage = storage;
    }

    Model.prototype.saveComment = function (comment) {
        $.ajax({
            url: '/project/comment',
            data: comment,
            dataType: 'json',
            method: 'POST',
            success: function () {

            }
        });
    };

    Model.prototype.deleteComment = function (comment) {
        $.ajax({
            url: '/project/comment',
            data: comment,
            dataType: 'json',
            method: 'DELETE',
            success: function () {
                location.href = '/project/detail/' + comment.projectid + '?ct=' + comment.commentType;
            }
        });
    };

    Model.prototype.updateProjectDevInfo = function(devinfo){
        $.ajax({
            url: '/project/detail/' + devinfo['project-id'],
            data: devinfo,
            dataType: 'json',
            method: 'PUT',
            success: function () {
                location.href = '/project/detail/' + devinfo['project-id'];
            }
        });
    };

    exports.project = exports.project || {};
    exports.project.Model = Model;

})(window);