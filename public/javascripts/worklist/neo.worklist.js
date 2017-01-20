(function (exports) {
    'use strict';

    var Worklist = function(){
        this.storage = new worklist.Storage();
        this.model = new worklist.Model(this.storage);
        this.template = new worklist.Template();
        this.view = new worklist.View(this.template);
        this.controller = new worklist.Controller(this.model, this.view);
    }

    
    exports.Worklist = $.Worklist = new Worklist();

})(window);

