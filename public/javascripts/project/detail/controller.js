(function (exports) {
    'use strict';

    function Controller(model, view) {
        console.log('Controller created');
        var self = this;
        this.model = model;
        this.view = view;


        this.view.bind('commentsave', function(comment){
            self.model.saveComment(comment);
        });
        this.view.bind('historysave');
    }

    
    exports.project = exports.project || {};
    exports.project.Controller = Controller;

})(window);