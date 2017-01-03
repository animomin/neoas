(function (exports) {
    'use strict';

    /**
     * Template Module
     */
    function Template() {
        console.log('template');

        this.defaultPositionKindContainer = '' +
        '<ul class="tag-list" style="padding :0;">{{부서}}</ul>';
        this.defaultPositionKindTag = '' +
        '<li><a href data-position="{{부서ID}}"><i class="fa fa-tag"></i>{{부서명}}</a></li>';


        // this.defaultDailyReportCounter = '<span class="pull-right small text-muted">{{보고서수}}개의 보고서</span>';


        this.defaultDailyReport = '' +
            '<div class="social-feed-box animated fadeInUp">' +
            '    <div class="social-body">' +
            '        <h1 style="text-align: left;color:#1a7bb9;">{{보고일자}} 업무보고서</h1>' +
            '        {{부서명}}' +
            '        <p>작성자: {{작성자이름}} / 작성일자: {{작성일자}}</small></p>' +
            '        <hr style="color:#c0c0c0;">' +
            '        <h5 class="tag-title">방문일지 </h5>' +
            '        <div class="panel-group" id="accordion0">{{방문일지}}</div>' +
            '        <h5 class="tag-title">전화일지 </h5>' +
            '        <div class="panel-group" id="accordion1">{{전화일지}}</div>' +
            '        <h5 class="tag-title">A/S일지 </h5>' +
            '        <div class="panel-group" id="accordion2">{{AS일지}}</div>' +
            '        <h5 class="tag-title">기타업무 </h5>' +
            '        <div class="well">{{기타업무}}</div>' +
            '    </div>' +
            '</div>';

        this.defaultReportsError = '' +
            '<div class="alert alert-danger">{{오류내용}}</div>';
        this.defaultNoReports = '' +
            '<div class="jumbotron">' +
            '    <h1>검색된 업무보고서가 없습니다.</h1>' +
            '    <p>해당날짜에 작성된 업무보고서가 없습니다!</p>' +
            '</div>';
        this.defaultNoWorklist = '' +
            '<div class="alert alert-info">업무일지가 없습니다.</div>';

        this.defaultWorkItemTag = '' +
            ' <button class="btn btn-xs btn-default work-history-tag" data-kind={{일지구분}} data-index="{{인덱스}}">{{기관명칭}}</button>';
        this.defaultWorkItemContent = '' +
            '<div class="alert alert-warning alert-dismissable animated fadeInRight">' +
            '   <button aria-hidden="true" data-dismiss="alert" class="close" type="button">x</button>' +
            '   {{내용}}' +
            '</div>';

    }

    Template.prototype.insertPositionKinds = function(reports){
        var self = this;
        var view = self.defaultPositionKindContainer;
        if (reports.err && reports.err !== 'NODATA') {
            view = view.replace('{{부서}}', '');
            return view;
        }
        if (reports.err === 'NODATA') {
            view = view.replace('{{부서}}', '');
            return view;
        }
        if (!reports.data[0].length && !reports.data[1].length && !reports.data[2].length && !reports.data[3].length) {
            view = view.replace('{{부서}}', '');
            return view;
        }

        var tags = [];
        var mainData = reports.data[0];
        mainData.forEach(function(_item){            
            var template = self.defaultPositionKindTag;
            var positionName = (function(){
                switch(parseInt(_item['부서'])){
                    case 0: return '개발실';
                    case 1: return '영업팀';
                    case 2: return 'QC';
                    case 3: return '부가서비스';
                    case 4: return '기타';
                }
            })();
            template = template.replace('{{부서ID}}', _item['부서']);
            template = template.replace('{{부서명}}', positionName);

            if(!tags.find(function(tag){
                return tag === template
            })){
                tags.push(template);
            }
        });
        
        if(typeof tags[0] !== 'undefined') view = view.replace('{{부서}}', tags.toString().replace(/,/gim,''));
        else view = view.replace('{{부서}}', '');
        return view;
        
    };

    Template.prototype.insertReports = function (reports) {
        var self = this;
        var view = '';
        if (reports.err && reports.err !== 'NODATA') {
            view = this.defaultReportsError;
            view = view.replace('{{오류내용}}', ' 업무보고서를 로드하지 못하였습니다. <br> ' + reports.err);
            return view;
        }

        if (reports.err === 'NODATA') {
            return this.defaultNoReports;
        }

        if (!reports.data[0].length && !reports.data[1].length && !reports.data[2].length && !reports.data[3].length) {
            return this.defaultNoReports;
        }
        //여기다가 리스트 추가 코드짜야함

        var mainData = reports.data[0],
            visitData = reports.data[1],
            telData = reports.data[2],
            asData = reports.data[3];
        
        
        for (var i = 0; i < mainData.length; i++) {
            var template = this.defaultDailyReport;
            template = template.replace('{{보고일자}}', new Date(mainData[i]['보고일자']).GetDate_CustomFormat('YYYY년 MM월 DD일'));
            template = template.replace('{{작성자이름}}', neo.users.GetUserName(mainData[i]['작성자']).USER_NAME);
            template = template.replace('{{작성일자}}', new Date(mainData[i]['작성일자']).GetDate_CustomFormat('YYYY년 MM월 DD일'));
            // template = template.replace('{{방문일지}}', this.insertWorkHistoryTags(0, { err : null, data : [visitData]}));
            // template = template.replace('{{전화일지}}', this.insertWorkHistoryTags(1, { err : null, data : [null,telData]}));
            // template = template.replace('{{AS일지}}', this.insertWorkHistoryTags(2, { err : null, data : [null,null,asData]}));
            template = template.replace('{{부서명}}', mainData[i]['부서명'] !== '' ? '<h4>' + mainData[i]['부서명'] + '</h4>' : '' );
            template = template.replace('{{기타업무}}', mainData[i]['기타업무']);
            template = template.replace('{{방문일지}}', _worklistTemplate(0, mainData[i]['인덱스'], visitData));
            template = template.replace('{{전화일지}}', _worklistTemplate(1, mainData[i]['인덱스'], telData));
            template = template.replace('{{AS일지}}', _worklistTemplate(2, mainData[i]['인덱스'], asData));
            template = template.replace('{{INDEX}}', mainData[i]['인덱스']);

            view += template;
        }
        

        function _worklistTemplate(kind, index, data) {
            var item = '';
            if (!data.length) return self.defaultNoWorklist;
            for (var i = 0; i < data.length; i++) {
                var temp = '' +
                    '        <div class="panel panel-default">' +
                    '            <div class="panel-heading">' +
                    '                <h5 class="panel-title">' +
                    '                    <a data-toggle="collapse" data-parent="#accordion{{INDEX}}" href="#panel{{KIND}}-{{INDEX}}-{{ID}}">{{기관명칭}} / {{기관코드}}</a>                                    ' +
                    '                </h5>' +
                    '            </div>' +
                    '            <div id="panel{{KIND}}-{{INDEX}}-{{ID}}" class="panel-collapse collapse">' +
                    '                <div class="panel-body">{{내용}}</div>' +
                    '            </div>' +
                    '        </div>';


                temp = temp.replace('{{기관명칭}}', data[i]['기관명칭']);
                temp = temp.replace('{{기관코드}}', data[i]['기관코드']);
                temp = temp.replace('{{프로그램}}', data[i]['프로그램']);
                temp = temp.replace('{{내용}}', data[i]['내용']);
                temp = temp.replace(/{{KIND}}/gim, kind);
                temp = temp.replace(/{{INDEX}}/gim, index);
                temp = temp.replace(/{{ID}}/gim, i);
                item += temp;
            }
            return item;
        }


        return view;
    };

    Template.prototype.insertWorkHistoryTags = function (kind, tags) {
        var view = '';
        if (tags.err && tags.err !== 'NODATA') {
            view = defaultReportsError;
            if (kind === 0) {
                view = view.replace('{{오류내용}}', ' 해당날짜 방문일지를 로드하지 못하였습니다. <br> ' + reports.err);
            } else if (kind === 1) {
                view = view.replace('{{오류내용}}', ' 해당날짜 전화일지를 로드하지 못하였습니다. <br> ' + reports.err);
            } else if (kind === 2) {
                view = view.replace('{{오류내용}}', ' 해당날짜 A/S처리내역을 로드하지 못하였습니다. <br> ' + reports.err);
            }
            return view;
        }

        if (tags.err === 'NODATA') {
            return this.defaultNoReports;
        }

        if (!tags.data[kind].length) {
            return this.defaultNoWorklist;
        }

        var tag = tags.data[kind];
        for (var i = 0; i < tag.length; i++) {
            var template = this.defaultWorkItemTag;
            template = template.replace('{{기관명칭}}', tag[i].기관명칭);
            template = template.replace('{{인덱스}}', tag[i].인덱스);
            template = template.replace('{{일지구분}}', kind);
            view += template;
        }

        return view;
    };

    Template.prototype.insertHistoryContent = function (contents) {
        var view = '';

        if (!contents) {
            view = defaultReportsError;
            if (kind === 0) {
                view = view.replace('{{오류내용}}', ' 해당날짜 방문일지를 로드하지 못하였습니다.');
            } else if (kind === 1) {
                view = view.replace('{{오류내용}}', ' 해당날짜 전화일지를 로드하지 못하였습니다.');
            } else if (kind === 2) {
                view = view.replace('{{오류내용}}', ' 해당날짜 A/S처리내역을 로드하지 못하였습니다.');
            }
            return view;
        }

        view = this.defaultWorkItemContent;
        view = view.replace('{{내용}}', contents['내용']);
        return view;

    }


    /**
     * View Module
     */
    function View(template) {
        console.log('View');
        var self = this;
        this.template = template;

        this.$datepickers = $('.worklist-date');    // all datepicker
        this.$selectpickers = $('.selectpicker');    // all selectpicker
        this.$workHistoryTags = $('.work-history-tag-container');       // all tags
        this.$workHistoryContents = $('.work-history-content-container') // all content

        this.$listSearch = $('input#worklist-search');
        this.$listCalendar = $('div#worklist-datepicker-embed');      // list embed calendar
        this.$listDatePicker = $('input#worklist-datepicker');      // list datepicker when mobile 
        this.$listDailyReports = $('div#worklist-list');
        this.$listPositionKinds = $('div#positionKind');

        this.$writeDialog = $('div#worklist-write');
        this.$writeDatePicker = $('input#worklist-write-datepicker'); // write modal datepicker
        this.$writeEditor = $('textarea#worklist-write-memo');
        this.$writePositionKind = $('select#worklist-position-kind');
        this.$writePositionName = $('input#worklist-position-name');
        this.$writeVisitTags = $('span#visit-history');
        this.$writeVisitContent = $('li#visit-history-content');
        this.$writeTelTags = $('span#tel-history');
        this.$writeTelContent = $('li#tel-history-content');
        this.$writeASTags = $('span#as-history');
        this.$writeASContent = $('li#as-history-content');
        this.$writeSave = $('button[data-name="worklistSave"]');

    }

    View.prototype.init = function (callback) {
        var self = this;
        this.$datepickers.datepicker({
            format: 'yyyy-mm-dd',
            language: 'kr',
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
            todayHighlight: true,
            todayBtn: 'linked'
        });
        this.$listDatePicker.val(new Date().GetToday('YYYY-MM-DD'));
        this.$writeDatePicker.val(new Date().GetToday('YYYY-MM-DD'));


        this.$selectpickers.selectpicker('destroy')
            .selectpicker({
                width: 'auto',
                size: 5,
                title: self.$selectpickers.data('title')
            });

        this.editorInit();

        callback();
    };

    View.prototype.editorInit = function () {
        var self = this;
        var $ed = this.$writeEditor;
        tinymce.init({
            selector: '#' + $ed.attr('id'),
            menubar: false,
            statusbar: false,
            height: 1000,
            min_height: 500,
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | formatselect',
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste',
                'autoresize nonbreaking'
            ],
            nonbreaking_force_tab: true,
            setup: function (editor) {

            }
        });
    };

    View.prototype.bind = function (event, handler) {
        var self = this;
        if (event === 'todayWorklist') {
            console.log('View.bind.todayWorklist execute!');
            var temp = self.$writeDialog;
            temp.unbind('show.bs.modal').bind('show.bs.modal', function () {
                handler();
            });
            temp.unbind('hidden.bs.modal').bind('hidden.bs.modal', function () {
                self.$writeDatePicker.datepicker('setDate', new Date().GetToday('YYYY-MM-DD'));//.val(new Date().GetToday('YYYY-MM-DD'));
                self.$writePositionKind.selectpicker('val', '');
                self.$writePositionName.val('');
                self.$writePositionName.attr('disabled', true);
                self.$workHistoryTags.empty();
                self.$workHistoryContents.empty();
            });

            temp = self.$writeDatePicker;
            temp.unbind('changeDate').bind('changeDate', function () {
                handler({ workDate: $(this).val() });
            });
        }

        else if (event === 'showWorkDetail') {
            console.log('View.bind.showWorkDetail execute');
            var temp = self.$workHistoryTags;
            temp.unbind('click').bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('work-history-tag')) {
                    handler({
                        type: 'write',
                        kind: $target.data('kind'),
                        index: $target.data('index')
                    });
                }
            });

            var temp = self.$listDailyReports;
            temp.unbind('click').bind('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('work-history-tag')) {
                    handler({
                        type: 'list',
                        kind: $target.data('kind'),
                        index: $target.data('index')
                    });
                }
            });

        }
        else if (event === 'positionKind') {
            console.log('View.bind.positionKind execute!');
            var temp = self.$writePositionKind;
            temp.unbind('change').bind('change', function () {
                var selectValue = $(this).selectpicker('val');
                selectValue = parseInt(selectValue);
                if (selectValue === 0 || selectValue === 4) {
                    self.$writePositionName.removeAttr('disabled');
                    self.$writePositionName.focus();
                } else {
                    self.$writePositionName.attr('disabled', true);
                }
            });
        }
        else if (event === 'saveNewWorkList') {
            console.log('View.bind.saveNewWorkList execute!');
            var temp = self.$writeSave;
            temp.unbind('click').bind('click', function () {
                self._ParseWorkListData(function (params) {
                    if (params) handler(params, temp);
                });
            });
        }
        else if (event === 'switchDate') {
            console.log('View.bind.switchDate execute!');
            var temp = self.$listDatePicker;
            var selDate = '';
            temp.unbind('changeDate').bind('changeDate', function () {
                if (!window.worklistDateChange) {
                    window.worklistDateChange = true;
                    selDate = $(this).val()
                    self.$listCalendar.datepicker('setDate', selDate);
                    handler({ report_date: selDate });
                }
            });
            var temp = self.$listCalendar
            temp.unbind('changeDate').bind('changeDate', function () {
                if (!window.worklistDateChange) {
                    window.worklistDateChange = true;
                    selDate = $(this).datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD');
                    self.$listDatePicker.datepicker('setDate', selDate);
                    handler({ report_date: selDate });
                }
            });
        }
    };

    View.prototype.render = function (viewCmd, data) {
        var self = this;
        var viewCommands = {
            showTodayWorklist: function () {
                console.log('View.render.showTodayWorklist execute');
                self.$writeVisitTags.empty().append(self.template.insertWorkHistoryTags(0, data));
                self.$writeTelTags.empty().append(self.template.insertWorkHistoryTags(1, data));
                self.$writeASTags.empty().append(self.template.insertWorkHistoryTags(2, data));
            },
            showWorkDetail: function () {
                console.log('View.render.showWorkDetail execute');
                if (data.type === 'write') {
                    if (data.kind === 0) {
                        self.$writeVisitContent.empty().append(self.template.insertHistoryContent(data));
                    } else if (data.kind === 1) {
                        self.$writeTelContent.empty().append(self.template.insertHistoryContent(data));
                    } else {
                        self.$writeASContent.empty().append(self.template.insertHistoryContent(data));
                    }
                } else {
                    if (data.kind === 0) {
                        self.$writeVisitContent.empty().append(self.template.insertHistoryContent(data));
                    } else if (data.kind === 1) {
                        self.$writeTelContent.empty().append(self.template.insertHistoryContent(data));
                    } else {
                        self.$writeASContent.empty().append(self.template.insertHistoryContent(data));
                    }
                }
            },
            showDailyReportsList: function () {
                console.log('View.render.showDailyReportsList execute');
                self.$listPositionKinds.empty().append(self.template.insertPositionKinds(data));
                self.$listDailyReports.empty().append(self.template.insertReports(data));
            }
        };
        viewCommands[viewCmd]();
    };

    View.prototype._ParseWorkListData = function (callback) {
        var self = this;

        var params = {
            report_date: self.$writeDatePicker.val(),
            position_kind: self.$writePositionKind.selectpicker('val'),
            position_name: self.$writePositionName.val().trim(),
            writer: neo.user.USER_ID,
            write_date: new Date().GetToday('YYYY-MM-DD HH:MM:SS'),
            memo: tinymce.get(self.$writeEditor.attr('id')).getContent(),
            visit: null,
            tel: null,
            as: null
        };

        var tDate = new Date(params.report_date);
        if (tDate.toString() === 'Invalid Date') {
            self.$writeDatePicker.tooltip({
                placement: 'top',
                title: '보고일자를 선택해주세요!'
            }).tooltip('show');
            self.$writeDatePicker.focus();
            return null;
        }

        if (!params.position_kind) {
            self.$writePositionKind.tooltip({
                placement: 'top',
                title: '부서를 선택해주세요!'
            }).tooltip('show')
            self.$writePositionKind.focus();
            return null;
        } else if (parseInt(params.position_kind) === 4 && params.position_name === '') {
            self.$writePositionName.tooltip({
                placement: 'top',
                title: '부서명을 입력해주세요!'
            }).tooltip('show')
            self.$writePositionName.focus();
            return null;
        }

        if (typeof callback === 'function') callback(params);
        else {
            return params;
        }


    };

    /**   
     * Controller
     */
    function Controller(model, view) {
        console.log('controller');
        var self = this;
        this.model = model;
        this.view = view;
        //////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 일일 업무보고서 작성창
         */
        //////////////////////////////////////////////////////////////////////////////////////////////////
        /** 
         * 보고서 작성창 클릭시 오늘 처리내용 가져오기 바인딩     
         */
        this.view.bind('todayWorklist', function (param) {
            self.getTodayWorkList(param);
        });

        /** 
         * 보고서 방문일지, 전화일지, AS처리내역 클릭 이벤트 바인딩
         */
        this.view.bind('showWorkDetail', function (param) {
            self.getWorkDetail(param);
        });

        /**
         * 부서구분 선택이벤트 바인딩
         */
        this.view.bind('positionKind');

        /** 
         * 일일 업무보고서 저장버튼 클릭 이벤트 바인딩
         */
        this.view.bind('saveNewWorkList', function (param, loader) {
            self.saveNewDailyWork(param, loader);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 일일 업무보고서 리스트
         */
        //////////////////////////////////////////////////////////////////////////////////////////////////
        this.view.bind('switchDate', function (param) {
            window.worklistDateChange = false;
            self.showDailyReportsList(param);
        });

        // this.view.bind('showWorkDetailInList', function(param){
        //     self.getWorkDetail(param);
        // });



        this.view.init(function () {
            self.showDailyReportsList();
        });
    }

    Controller.prototype.showDailyReportsList = function (param) {
        var self = this;
        param = param || {};

        var option = {
            url: '/worklist/dailylist',
            dataType: 'json',
            data: {
                report_date: param.report_date || new Date().GetToday('YYYY-MM-DD'),
                report_keyword: param.report_keyword || self.view.$listSearch.val().trim(),
                report_writer: param.report_writer || ''
            },
            method: 'GET',
            async: true,
            save: true
        };


        this.model.getDailyReportsList(option, function (result) {
            if (result.err) console.log(result.err);
            self.view.render('showDailyReportsList', result);
        });
    };

    Controller.prototype.getTodayWorkList = function (param) {
        var self = this;
        param = param || {};
        var option = {
            url: '/worklist/today',
            dataType: 'json',
            data: {
                user: neo.user.USER_ID,
                date: param.workDate || new Date().GetToday('YYYY-MM-DD')
            },
            method: 'GET',
            async: false,
            save: true
        };
        this.model.getTodayWorkList(option, function (result) {
            if (result.err) console.log(result.err);
            self.view.render('showTodayWorklist', result);
        });
    };

    Controller.prototype.getWorkDetail = function (param) {
        var self = this;
        this.model.getWorkDetail(param, function (result) {
            if (!result) console.log('NOT FOUND');
            else {
                result.type = param.type;
                result.kind = param.kind;
                self.view.render('showWorkDetail', result);
            }
        });
    };

    Controller.prototype.saveNewDailyWork = function (param, loader) {
        var self = this;
        param = param || {};
        var option = {
            url: '/worklist/save',
            dataType: 'json',
            data: param,
            method: 'POST',
            async: false,
            loader: loader
        };
        this.model.saveDailyWork(option, function (result) {
            if (!result) console.log(result.err);
            self.view.$writeDialog.modal('hide');
            self.showDailyReportsList({
                report_date : param.report_date
            });
        });
    };

    /**   
     * Model
     */
    function Model(storage) {
        console.log('Model');
        this.storage = storage;
    }

    Model.prototype.getDailyReportsList = function (option, callback) {
        var self = this;
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.save && self.storage) {
                    self.storage.removeData('dailylist');
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function (result) {
                if (option.save) {
                    self.storage.setData('dailylist', result.responseJSON.data);
                }
            }
        })
    };

    Model.prototype.getTodayWorkList = function (option, callback) {
        var self = this;
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.save && self.storage) {
                    self.storage.removeData('worklist');
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function (result) {
                if (option.save) {
                    self.storage.setData('worklist', result.responseJSON.data);
                }
            }
        });
    };

    Model.prototype.getWorkDetail = function (param, callback) {
        var worklist = this.storage.getData('worklist');
        callback(worklist[param.kind].find(function (_item) {
            return _item.인덱스 === param.index;
        }));
    };

    Model.prototype.saveDailyWork = function (option, callback) {
        var worklist = this.storage.getData('worklist');
        option.data.visit = worklist[0].map(function (_item) {
            return _item.인덱스;
        });
        option.data.tel = worklist[1].map(function (_item) {
            return _item.인덱스;
        });
        option.data.as = worklist[2].map(function (_item) {
            return _item.인덱스;
        });
        option.data.visit = option.data.visit.toString();
        option.data.tel = option.data.tel.toString();
        option.data.as = option.data.as.toString();



        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.loader.length) {
                    if (!option.loader.find('i').length) {
                        option.loader.prepend('<i class="fa fa-spinner fa-spin"></i>').addClass('disabled').attr('disabled', true);
                    }
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function () {
                if (option.loader.length) {
                    if (option.loader.find('i').length) {
                        option.loader.find('i').remove();
                        option.loader.removeClass('disabled').removeAttr('disabled');
                    }
                }
            }
        });
    };

    /**
     * Storage Module
     */
    function Storage() {
        console.log('Storage');
    }

    Storage.prototype.setData = function (key, value) {
        this.data = this.data || {};
        this.data[key] = value;
    }

    Storage.prototype.getData = function (key) {
        this.data = this.data || {};
        return this.data[key] || {};
    }

    Storage.prototype.removeData = function (key) {
        this.data = this.data || {};
        if (this.data.hasOwnProperty(key)) {
            delete this.data[key];
        }
    }

    exports.worklist = exports.worklist || {};
    exports.worklist.Template = Template;
    exports.worklist.View = View;
    exports.worklist.Controller = Controller;
    exports.worklist.Model = Model;
    exports.worklist.Storage = Storage;



})(window);
