(function (exports) {
    'use strict';

    // exports.projectlist = exports.projectlist || {};
    // exports.projectlist.Template = Template;
    // exports.projectlist.View = View;
    // exports.projectlist.Controller = Controller;
    // exports.projectlist.Model = Model;
    // exports.projectlist.Storage = Storage;


    var Project = function () {
        this.storage = new project.Storage();
        this.model = new project.Model(this.storage);
        this.template = new project.Template();
        this.view = new project.View(this.template);
        this.controller = new project.Controller(this.model, this.view);
    };

    exports.Project = $.Project = new Project();


})(window);