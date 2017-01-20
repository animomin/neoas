(function (exports) {
    'use strict';

    function View(template) {
        console.log('View created');
        this.template = template;

        this.$projectid = $('h3#project-id');

        this.$comment = $('textarea#project-comment');
        this.$commentWriteSpan = $('span#project-comment-write');
        // this.$commentWriteBtn =  $('button#project-comment-write');
        this.$commentWriteForm = $('form#project-comment-form');
        this.$historyWriteSpan = $('span#project-history-write');
        this.$historyWriteForm = $('form#project-history-form');
        this.$commentList = $('div#project-comment-list');
        this.$historyList = $('ul#project-history-list');

        this.$projectDevInfo = $('button.project-devinfo-save');
        this.$projectManager = $('select#project-dev-manager');
        // 총책임자가 로그인한사람일 경우에만 엘리먼트를 찾아온다        
        this.$projectCost = $('input#project-dev-cost');
        this.$projectStartDate = $('input#project-dev-startdate');
        this.$projectEndDate = $('input#project-dev-enddate');
        this.$projectDeveloper = $('select#project-dev-developer');
        this.$projectStatus = $('select#project-dev-status');

        this.$projectTerm = $('input.project-dev-term');

        this.$projectDelete = $('button#project-delete');

        $('form').validator();
        this.$projectTerm.datepicker({
            format: 'yyyy-mm-dd',
            language: 'kr',
            startView: 2,
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
            todayHighlight: true,
            todayBtn: 'linked'
        });
    }

    View.prototype.bind = function (event, handler) {
        var self = this;
        var $temp = null;

        if (event === 'commentsave') {
            $temp = self.$commentWriteSpan;
            $temp.bind('click', function (e) {
                self.$commentWriteForm.submit();
            });
        }
        else if (event === 'commentdelete') {
            $temp = self.$commentList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('project-comment-delete')) {
                    handler({
                        commentid: $target.data('commentid'),
                        commentType: 0,
                        projectid: $target.data('projectid')
                    });
                }
            });
        }
        else if (event === 'commentedit') {
            $temp = self.$commentList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('project-comment-edit')) {
                    var $container = $target.parent().parent();
                    $target.fadeOut('fast');
                    $container.find('div.well').fadeOut('fast', function () {
                        var commentEditTemplate = self.template.commentEditForm;
                        commentEditTemplate = commentEditTemplate.replace('{{인덱스}}', $target.data('projectid'));
                        commentEditTemplate = commentEditTemplate.replace('{{COMMENTID}}', $target.data('commentid'));
                        commentEditTemplate = commentEditTemplate.replace(
                            '{{내용}}',
                            $container.find('div.well').html().replace(/<br *\/?>/gi, '\n')
                        );

                        $container.append(commentEditTemplate);
                        $container.find('textarea').focus()
                            .bind('focusout', function () {
                                $temp.find('span#project-comment-cancel').trigger('click');
                            });
                    });
                }
            });
        }
        else if (event === 'commenteditcancel') {
            $temp = self.$commentList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.attr('id') === 'project-comment-cancel') {
                    var $container = $target.parent().parent().parent().parent().parent();
                    $container.find('form').fadeOut('fast', function () {
                        $container.find('form').remove();
                        $container.find('div.well').fadeIn('fast');
                        $container.find('button.project-comment-edit').fadeIn('fast');
                    });
                }
            });
        }
        else if (event === 'commenteditsave') {
            $temp = self.$commentList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.attr('id') === 'project-comment-edit-save') {
                    var $form = $target.parent().parent().parent().parent();
                    $form.submit();
                }
            });
        }
        else if (event === 'historysave') {
            $temp = self.$historyWriteSpan;
            $temp.bind('click', function (e) {
                self.$historyWriteForm.submit();
            });
        }
        else if (event === 'historydelete') {
            $temp = self.$historyList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('project-history-delete')) {
                    handler({
                        commentid: $target.data('historyid'),
                        commentType: 1,
                        projectid: $target.data('projectid')
                    });
                }
            });
        }
        else if (event === 'historyedit') {
            $temp = self.$historyList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('project-history-edit')) {
                    var $container = $target.parent().parent();
                    $target.fadeOut('fast');
                    $container.find('div.col-sm-1').fadeOut('fast');
                    $container.find('div.col-sm-11').fadeOut('fast', function () {
                        var historyEditTemplate = self.template.historyEditForm;
                        historyEditTemplate = historyEditTemplate.replace('{{인덱스}}', $target.data('projectid'));
                        historyEditTemplate = historyEditTemplate.replace('{{COMMENTID}}', $target.data('historyid'));
                        historyEditTemplate = historyEditTemplate.replace('{{COMMENTTYPE1}}', parseInt($target.data('commenttype')) === 1 ? "selected" : '');
                        historyEditTemplate = historyEditTemplate.replace('{{COMMENTTYPE2}}', parseInt($target.data('commenttype')) === 2 ? "selected" : '');
                        historyEditTemplate = historyEditTemplate.replace(
                            '{{내용}}',
                            $container.find('p.history-well').html().replace(/<br *\/?>/gi, '\n')
                        );

                        $container.append(historyEditTemplate);
                        $container.find('textarea').focus()
                            .bind('focusout', function () {
                                // $temp.find('span#project-histo-cancel').trigger('click');
                            });
                        $container.find('select#project-history-type').selectpicker();
                        $container.find('form').validator();
                    });
                }
            });
        }
        else if (event === 'historyeditcancel') {
            $temp = self.$historyList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.attr('id') === 'project-history-cancel') {
                    var $container = $target.parent().parent().parent().parent().parent();
                    $container.find('form').fadeOut('fast', function () {
                        $container.find('form').remove();
                        $container.find('div.col-sm-2').fadeIn('fast');
                        $container.find('div.col-sm-10').fadeIn('fast');
                        $container.find('button.project-history-edit').fadeIn('fast');
                    });
                }
            });
        }
        else if (event === 'historyeditsave') {
            $temp = self.$historyList;
            $temp.bind('click', function (e) {
                var $target = $(e.target);
                if ($target.attr('id') === 'project-history-edit-save') {
                    var $form = $target.parent().parent().parent().parent();
                    $form.submit();
                }
            });
        }
        else if (event === 'devinfosave') {
            $temp = self.$projectDevInfo;
            $temp.bind('click', function (e) {
                var $target = e.target.tagName.toLowerCase() === 'i' ? $(e.target).parent() : $(e.target);
                var type = $target.data('devinfo');
                type = type.replace('project-', '').toLowerCase();
                var value = '';
                switch (type) {
                    case "manager":
                        value = self.$projectManager.selectpicker('val');
                        break;
                    case "cost":
                        value = self.$projectCost.val();
                        break;
                    case "term":
                        if (self.$projectStartDate.datepicker('getDate') && self.$projectEndDate.datepicker('getDate')) {
                            value = {
                                startdate: self.$projectStartDate.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD'),
                                enddate: self.$projectEndDate.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD')
                            };
                        } else {
                            value = '';
                        }
                        break;
                    case "developer":
                        value = self.$projectDeveloper.selectpicker('val');
                        break;
                    case "status":
                        value = self.$projectStatus.selectpicker('val');
                        break;
                }

                if (value === '') {
                    neoNotify.Show({
                        title: '프로젝트 수정',
                        text: '값이 입력되지 않았습니다.',
                        type: 'error'
                    });
                    return;
                }
                if (typeof value === 'object') {
                    if (type === 'term') {
                        if (value.startdate > value.enddate) {
                            neoNotify.Show({
                                title: '프로젝트 수정',
                                text: '종료일은 시작일 이후 날짜를 선택하셔야 합니다.',
                                type: 'error'
                            });
                            return;
                        }
                    }
                }

                handler({ 'project-id': self.$projectid.data('projectid'), devinfotype: type, value: value });

            });
        }
        else if (event === 'projectdelete') {
            $temp = self.$projectDelete;
            $temp.bind('click', function (e) {
                var $this = $(this)
                swal({
                    title: '프로젝트를 삭제하시겠습니까?',                    
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText : '아니요',
                    confirmButtonText: '네, 삭제합니다',
                    showLoaderOnConfirm : true
                }).then(function () {
                    handler({ 'project-id': $this.data('projectid') });
                })  
                
            });
        }
    }

    exports.project = exports.project || {};
    exports.project.View = View;

})(window);