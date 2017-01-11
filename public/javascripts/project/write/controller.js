(function (exports) {
    'use strict';

    function Controller(model, view) {
        console.log('Controller created');
        var self = this;
        this.model = model;
        this.view = view;


        this.view.bind('RemoveUploadedFile', function(param){
            console.log(param);
            self.model.RemoveUploadedFile(param, function(){
                self.view.render('refreshUploadedFile');
            });
        });

        this.view.bind('saveNewProject', function(param){
            console.log(param);
            debugger;
        });
        
    }

    
    exports.project = exports.project || {};
    exports.project.Controller = Controller;

})(window);