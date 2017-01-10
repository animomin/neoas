(function (exports) {
    'use strict';

    function View(template) {
        console.log('View created');
        this.template = template;

        this.$writeForm = $('form');    // 프로젝트 등록 폼
        this.$clients = $('div#project-clients');  // 등록된 요청병원 컨테이너
        this.$clientsSearch = $('input#project-clients-name');  // 요청병원 이름
        this.$clientsAdd = $('button#project-clients-add');     // 요청병원 등록
        this.$uploadFile = $('input#project-file'); // 첨부파일
        this.$uploadedFile = $('div#project-files');
        this.$uploadProgress = $('div#project-upload-progress');

        this.init();
    }

    View.prototype.init = function(){
        var self = this;
        this.$uploadFile.fileupload({
            url : '/project/upload',
            dataType: 'json',
            send : function(e, data){
                console.log('send');
                self.$uploadedFile.find('span').addClass('hidden');
            },
            done : function(e, data){
                console.log('done');                
                $.each(data.result.files, function (index, file) {
                    $('<p/>').text(file.name).appendTo(self.$uploadedFile);                    
                });
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                self.$uploadProgress.find('.progress-bar').css(
                    'width',
                    progress + '%'
                );
            },
            fail : function(e, data){                
                console.log('fail');
                self.$uploadProgress.find('.progress-bar').toggleClass('progress-bar-success').toggleClass('progress-bar-danger');
                self.$uploadProgress.find('.progress-bar').text('업로드 실패 / ' + data.errorThrown);
            },
            always : function(e, data){
                console.log('always');                
            }
        }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
        
    };

    View.prototype.render = function(command, data){
        var self = this;
        var viewCommand = {
            
        };
        viewCommand[command]();
    };

    View.prototype.render_loader = function(command, callback){
        var self = this;
        var viewCommand = {
            
        };

        viewCommand[command]();
    };

    exports.project = exports.project || {};
    exports.project.View = View;

})(window);