(function (exports) {
    'use strict';

    function View(template) {
        console.log('View created');
        this.template = template;

        this.$writeForm = $('form');    // 프로젝트 등록 폼
        // this.$clients = $('div#project-clients');  // 등록된 요청병원 컨테이너
        // this.$clientsSearch = $('input#project-clients-name');  // 요청병원 이름
        // this.$clientsAdd = $('button#project-clients-add');     // 요청병원 등록
        this.$uploadFile = $('input#project-file'); // 첨부파일
        this.$uploadedFile = $('div#project-files');
        this.$uploadProgress = $('div#project-upload-progress');

        this.init();
    }

    View.prototype.init = function () {
        var self = this;
        this.$writeForm.validator();
        this.$uploadFile.filer({            
            maxSize : 10,
            fileMaxSize: 5,
            addMore: true,
            // extensions: ["jpg", "png", "gif"],
            showThumbs: true
        });
        // this.$uploadFile.fileupload({
        //     formData : { projectid : self.$writeForm.data('projectid')},
        //     url: '/project/upload',
        //     dataType: 'json',
        //     send: function (e, data) {
        //         console.log('send');
        //         self.$uploadedFile.find('span').addClass('hidden');
        //     },
        //     done: function (e, data) {
        //         console.log('done');
        //         $.each(data.result.files, function (index, file) {
        //             if (!self.$uploadedFile.find('div.chip[data-filename="' + file.originalFilename + '"]').length) {
        //                 self.$uploadedFile.append(self.template.insertUploadedFile(file));
        //             }
        //             // if(!self.$uploadedFile.find('div.chip[data-filename="'+file.originalFilename+'"]').length){
        //             //     var $file = $('<p/>');
        //             //         $file.text(file.originalFilename).appendTo(self.$uploadedFile);                    
        //             //         $file.attr('data-filename', file.originalFilename);                        
        //             // }
        //         });

        //         self.$uploadProgress.find('.progress-bar').removeClass('active progress-bar-danger progress-bar-warning').addClass('progress-bar-success');

        //     },
        //     progressall: function (e, data) {
        //         var progress = parseInt(data.loaded / data.total * 100, 10);
        //         self.$uploadProgress.find('.progress-bar').removeClass('progress-bar-success progress-bar-danger').addClass('active progress-bar-warning').css(
        //             'width',
        //             progress + '%'
        //         );
        //     },
        //     fail: function (e, data) {
        //         console.log('fail');
        //         self.$uploadProgress.find('.progress-bar').removeClass('active').removeClass('progress-bar-success progress-bar-warning').addClass('progress-bar-danger');
        //         self.$uploadProgress.find('.progress-bar').text('업로드 실패 / ' + data.errorThrown);
        //     }
        // }).prop('disabled', !$.support.fileInput)
        //     .parent().addClass($.support.fileInput ? undefined : 'disabled');

    };

    View.prototype.render = function (command, data) {
        var self = this;
        var viewCommand = {
            refreshUploadedFile : function(){
                if(!self.$uploadedFile.find('div.chip').length){
                    self.$uploadedFile.find('span').removeClass('hidden');
                }
            }
        };
        viewCommand[command]();
    };

    View.prototype.render_loader = function (command, callback) {
        var self = this;
        var viewCommand = {

        };

        viewCommand[command]();
    };

    View.prototype.bind = function (event, handler) {
        var self = this;
        var $temp = null;

        if (event === 'saveNewProject') {
            $temp = self.$writeForm;
            $temp.on('submit', function (e) {
                if (e.isDefaultPrevented()) {
                    console.log('error');
                } else {
                    console.log('good');                    
                }
            });         
        }
        else if (event === 'RemoveUploadedFile') {
            $temp = self.$uploadedFile;
            $temp.bind('click', function(e){
                var $target = $(e.target);
                if(e.target.tagName.toLowerCase() === 'i'){
                    if($target.hasClass('chip-close')){
                        $target.parent().fadeOut('fast', function(){
                            $target.parent().remove();
                            // if(self.$writeForm.data('isnew')){
                            //     handler({removeFile : $target.parent().data('filename')});
                            // }else{
                                handler({
                                    removeFile : $target.parent().data('filename'),
                                    projectid : self.$writeForm.data('projectid')
                                });
                            // }
                            
                        });
                    }
                }
            });
        }

    }

    exports.project = exports.project || {};
    exports.project.View = View;

})(window);