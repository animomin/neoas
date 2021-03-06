(function (exports) {
    'use strict';

    function Controller(model, view) {
        console.log('Controller created');
        var self = this;
        this.model = model;
        this.view = view;

        this.view.bind('projectProgram', function(program){
            self.showProjectList(program);
        });

        this.showProjectList();
    }

    Controller.prototype.showProjectList = function(item){
        var self = this;
        item = item || {
            program : null,
            keyword : null
        };        
        this.view.render_loader('showProjectList', function(){
            self.model.getProjectList(item, function(result){
                if(result.err) console.log(result.err);
                self.view.render('showProjectList', result);
            });
        });
    };

    exports.project = exports.project || {};
    exports.project.Controller = Controller;

})(window);