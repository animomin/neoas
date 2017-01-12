(function (exports) {
    'use strict';

    function View(template) {
        console.log('View created');
        this.template = template;

        this.$comment = $('textarea#project-comment');
        this.$commentWrite = $('span#project-comment-write');
        this.$historyWrite = $('button#project-history-write');
    }   

    View.prototype.bind = function (event, handler) {
        var self = this;
        var $temp = null;

        if(event === 'commentsave'){
            $temp = self.$commentWrite;
            $temp.bind('click', function(e){
                var comment = self.$comment.val().trim();
                if(!comment.length){
                    self.$comment.parent().attr({
                        'data-toggle' : 'tooltip',
                        'title' : '내용을 입력해주세요.',
                        'data-placement' : 'top'
                    }).tooltip('show');
                    setTimeout(function(){
                        self.$comment.parent().tooltip("destroy");
                    }, 3000);
                }else{
                    handler({
                        projectid : self.$comment.data('projectid'),
                        comment : comment                        
                    });
                }
            });
        }
        else if(event === 'historysave'){

        }

    }

    exports.project = exports.project || {};
    exports.project.View = View;

})(window);