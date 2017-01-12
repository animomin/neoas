(function (exports) {
    'use strict';

    function View(template) {
        console.log('View created');
        this.template = template;

        this.$searchKeyword = $('input#search-keyword'); // 프로젝트 검색
        this.$projectList = $('#project-list'); // 프로젝트 리스트 컨테이너

    }

    View.prototype.render = function(command, data){
        var self = this;
        var viewCommand = {
            showProjectList : function(){
                self.$projectList.empty().append(
                    self.template.insertProjectItem(data)                    
                );
                
            }
        };
        viewCommand[command]();
    };

    View.prototype.render_loader = function(command, callback){
        var self = this;
        var viewCommand = {
            showProjectList : function(){
                var $target = self.$projectList;
                var $loader = $('<div />').css({
                    'width' : $target.width() + 'px',
                    'height' : $target.height() + 'px'
                }).append(self.template.defaultSpinner);
                $target.empty().append($loader);
                callback();
            }
        };

        viewCommand[command]();
    };

    exports.project = exports.project || {};
    exports.project.View = View;

})(window);