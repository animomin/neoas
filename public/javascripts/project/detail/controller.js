(function (exports) {
    'use strict';

    function Controller(model, view) {
        console.log('Controller created');
        var self = this;
        this.model = model;
        this.view = view;


        // this.view.bind('commentsave', function(comment){
        //     self.model.saveComment(comment);
        // });
        this.view.bind('commentsave');
        this.view.bind('commentdelete', function (comment) {
            self.model.deleteComment(comment);
        });

        this.view.bind('commentedit');
        this.view.bind('commenteditcancel');
        this.view.bind('commenteditsave');

        this.view.bind('historysave');
        this.view.bind('historydelete', function (history) {
            self.model.deleteComment(history);
        });
        this.view.bind('historyedit');
        this.view.bind('historyeditcancel');
        this.view.bind('historyeditsave');

        this.view.bind('devinfosave', function(devinfo){
            self.model.updateProjectDevInfo(devinfo);
        });

    }


    exports.project = exports.project || {};
    exports.project.Controller = Controller;

})(window);
