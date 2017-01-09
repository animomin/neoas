(function (exports) {
    'use strict';

    /**
     * Template Module
     */
    function Template() {
        console.log('template');

        this.defaultWritersContainer = '' +
            '<ul class="tag-list" style="padding :0;">{{작성자}}</ul>';
        this.defaultWritersTag = '' +
            '<li><a href data-writer="{{작성자ID}}" class="tagSearch-writer"><i class="fa fa-tag"></i>{{작성자}}</a></li>';
        this.defaultPositionKindContainer = '' +
            '<ul class="tag-list" style="padding :0;">{{부서}}</ul>';
        this.defaultPositionKindTag = '' +
            '<li><a href data-position="{{부서ID}}" class="tagSearch-position"><i class="fa fa-tag"></i>{{부서명}}</a></li>';


        this.defaultDailyReportTableColumn = [
            { 'name': 'id', 'title': 'id', 'visible': false },
            { 'name': '구분', 'title': '구분' },
            { 'name': '프로그램', 'title': '프로그램' },
            { 'name': '요청자', 'title': '요청자', 'breakpoints': 'xs sm' },
            { 'name': '거래처', 'title': '거래처', 'breakpoints': 'xs sm' },
            { 'name': '상태', 'title': '상태' },
            { 'name': '내용', 'title': '내용', 'breakpoints': 'xs sm md' }
        ];
        // this.defaultDailyReportCounter = '<span class="pull-right small text-muted">{{보고서수}}개의 보고서</span>';

        this.defaultDailyReport = '' +
            '<div class="social-feed-box animated fadeInUp dailyReports" data-reportindex="{{INDEX}}">' +
            '    <div class="pull-right social-action">{{삭제버튼}}</div>' +
            '    <div class="social-body">' +
            '        <h1 style="text-align: left;color:#1a7bb9;" class="breakpoints-xs">{{보고일자}} 업무보고서</h1>' +
            '        <h3 style="text-align: left;color:#1a7bb9;" class="breakpoints-sm breakpoints-md breakpoints-lg">{{보고일자}} 업무보고서</h1>' +
            '        {{부서명}}' +
            '        <p>작성자: {{작성자이름}} / 작성일자: {{작성일자}}</small></p>' +
            '        <hr style="color:#c0c0c0;">' +
            '        <div class="row">' +
            '            <div class="col-lg-4">' +
            '               <div class="ibox">' +
            '                  <div class="ibox-title">' +
            '                       <h5>방문일지 </h5>' +
            '                       <div class="ibox-tools">' +
            '                           <a class="collapse-child-all-link" data-collapse="#work-{{INDEX}}0">' +
            '                                       <i class="fa fa-chevron-up"></i>' +
            '                                   </a>' +
            '                       </div>' +
            '                  </div>' +
            '               <div class="ibox-content no-padding"><table class="table table-hover" id="work-{{INDEX}}0">{{방문일지}}</table></div></div>' +
            '           </div>' +
            '            <div class="col-lg-4">' +
            '               <div class="ibox">' +
            '                  <div class="ibox-title">' +
            '                       <h5>전화일지 </h5>' +
            '                       <div class="ibox-tools">' +
            '                           <a class="collapse-child-all-link" data-collapse="#work-{{INDEX}}1">' +
            '                                       <i class="fa fa-chevron-up"></i>' +
            '                                   </a>' +
            '                       </div>' +
            '                  </div>' +
            '               <div class="ibox-content no-padding"><table class="table table-hover" id="work-{{INDEX}}1">{{전화일지}}</table></div></div>' +
            '           </div>' +
            '            <div class="col-lg-4">' +
            '               <div class="ibox">' +
            '                  <div class="ibox-title">' +
            '                       <h5>AS일지 </h5>' +
            '                       <div class="ibox-tools">' +
            '                           <a class="collapse-child-all-link" data-collapse="#work-{{INDEX}}2">' +
            '                                       <i class="fa fa-chevron-up"></i>' +
            '                                   </a>' +
            '                       </div>' +
            '                  </div>' +
            '               <div class="ibox-content no-padding"><table class="table table-hover" id="work-{{INDEX}}2">{{AS일지}}</table></div></div>' +
            '           </div>' +
            '            <div class="col-lg-12">' +
            '               <h3 class="tag-title">기타업무 {{수정버튼}} </h3>' +
            '               <div class="work-add-table-container">{{기타업무}}</div>' +
            '           </div>' +
            '       </div>' +
            '    </div>' +
            '</div>';

        this.defaultDailyReportDeleteButton = '' +
            '                    <button class="btn btn-danger btn-xs report-delete" data-reportindex={{INDEX}}>' +
            '                        삭제' +
            '                    </button>';
        this.defaultDailyReportEditButton = '<button class="btn btn-primary btn-xs report-edit" data-reportindex={{INDEX}}>수정</button>';


        this.defaultReportsError = '' +
            '<div class="alert alert-danger">{{오류내용}}</div>';
        this.defaultNoReports = '' +
            '<div class="jumbotron no-daily-reports animated fadeInUp">' +
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

    Template.prototype.insertWriters = function (reports) {
        var self = this;
        var view = self.defaultWritersContainer;
        if (reports.err && reports.err !== 'NODATA') {
            view = view.replace('{{작성자}}', '');
            return view;
        }
        if (reports.err === 'NODATA') {
            view = view.replace('{{작성자}}', '');
            return view;
        }
        if (!reports.data[0].length) {
            view = view.replace('{{작성자}}', '');
            return view;
        }

        var tags = [];
        var mainData = reports.data[0];
        mainData.forEach(function (_item) {
            var template = self.defaultWritersTag;
            var writerName = neo.users.GetUserName(_item['작성자']).USER_NAME;
            template = template.replace('{{작성자ID}}', _item['작성자']);
            template = template.replace('{{작성자}}', writerName);


            tags.push(template);

        });

        if (typeof tags[0] !== 'undefined') view = view.replace('{{작성자}}', tags.toString().replace(/,/gim, ''));
        else view = view.replace('{{작성자}}', '');
        return view;
    };

    Template.prototype.insertPositionKinds = function (reports) {
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
        if (!reports.data[1].length) {
            view = view.replace('{{부서}}', '');
            return view;
        }

        var tags = [];
        var mainData = reports.data[1];
        mainData.forEach(function (_item) {
            var template = self.defaultPositionKindTag;
            var positionName = (function () {
                switch (parseInt(_item['부서'])) {                    
                    case 0: return '기타';
                    case 1: return '개발실';
                    case 2: return '영업팀';
                    case 3: return 'QC';
                    case 4: return '부가서비스';
                    case 5: return '총무과';                 
                }
            })();
            template = template.replace('{{부서ID}}', _item['부서']);
            template = template.replace('{{부서명}}', positionName);
            tags.push(template);
        });

        if (typeof tags[0] !== 'undefined') view = view.replace('{{부서}}', tags.toString().replace(/,/gim, ''));
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

        if (!reports.data[2].length && !reports.data[3].length && !reports.data[4].length && !reports.data[5].length) {
            return this.defaultNoReports;
        }
        //여기다가 리스트 추가 코드짜야함

        var mainData = reports.data[2],
            visitData = reports.data[3],
            telData = reports.data[4],
            asData = reports.data[5];


        for (var i = 0; i < mainData.length; i++) {
            var template = this.defaultDailyReport;
            
            template = template.replace(/{{보고일자}}/gim, new Date(mainData[i]['보고일자']).GetDate_CustomFormat('YYYY년 MM월 DD일'));
            template = template.replace('{{작성자이름}}', neo.users.GetUserName(mainData[i]['작성자']).USER_NAME);
            template = template.replace('{{작성일자}}', mainData[i]['작성일자']);
            // template = template.replace('{{방문일지}}', this.insertWorkHistoryTags(0, { err : null, data : [visitData]}));
            // template = template.replace('{{전화일지}}', this.insertWorkHistoryTags(1, { err : null, data : [null,telData]}));
            // template = template.replace('{{AS일지}}', this.insertWorkHistoryTags(2, { err : null, data : [null,null,asData]}));
            var positionName = (function (pos) {
                switch (parseInt(pos)) {
                    case 0: return '기타';
                    case 1: return '개발실';
                    case 2: return '영업팀';
                    case 3: return 'QC';
                    case 4: return '부가서비스';
                    case 5: return '총무과';
                }
            })(mainData[i]['부서']);
            template = template.replace('{{부서명}}', mainData[i]['부서명'] !== '' ? '<h4>' + positionName + ' / ' + mainData[i]['부서명'] + '</h4>' : '<h4>' + positionName + '</h4>');
            template = template.replace('{{기타업무}}', mainData[i]['기타업무']);
            template = template.replace('{{방문일지}}', _worklistTemplate(0, mainData[i]['작성자'], mainData[i]['인덱스'], visitData));
            template = template.replace('{{전화일지}}', _worklistTemplate(1, mainData[i]['작성자'], mainData[i]['인덱스'], telData));
            template = template.replace('{{AS일지}}', _worklistTemplate(2, mainData[i]['작성자'], mainData[i]['인덱스'], asData));


            if (mainData[i]['작성자'] === neo.user.USER_ID) {
                template = template.replace('{{삭제버튼}}', this.defaultDailyReportDeleteButton);
                template = template.replace('{{수정버튼}}', this.defaultDailyReportEditButton);
            } else {
                template = template.replace('{{삭제버튼}}', '');
                template = template.replace('{{수정버튼}}', '');
            }
            template = template.replace(/{{INDEX}}/gim, mainData[i]['인덱스']);

            view += template;
        }

        function _worklistTemplate(kind, writer, index, data) {
            var item = '';
            if (!data.length) return self.defaultNoWorklist;
            for (var i = 0; i < data.length; i++) {
                if(data[i]['작성자'] === writer){
                    var temp = '' +
                        '   <tr data-target="#work-{{KIND}}{{ID}}{{INDEX}}" class="accordion-toggle collapsed">' +
                        '        <td>{{기관명칭}} <label class="label">{{기관코드}}</label> {{프로그램}}</td>' +
                        '    </tr>' +
                        '    <tr>' +
                        '        <td class="no-padding"><div id="work-{{KIND}}{{ID}}{{INDEX}}" class="accordion-body collapse"><div class="well">{{내용}}</div></div></td>' +
                        '    </tr>';



                    var badgename = (function () {
                        var program = data[i].프로그램;
                        if (typeof program !== 'string') {
                            program = neo.emrs[program].name;
                        }
                        if (program.toLowerCase().match('sense')) return 'badge-sense';
                        if (program.toLowerCase().match(/medi|hanimac/gim)) return 'badge-medi';
                        if (program.toLowerCase().match('eplus')) return 'badge-eplus';
                        if (program.toLowerCase().match('echart')) return 'badge-echart';
                        return 'badge-done';
                    })();

                    temp = temp.replace('{{기관명칭}}', data[i]['기관명칭']);
                    temp = temp.replace('{{기관코드}}', data[i]['기관코드']);
                    temp = temp.replace('{{프로그램}}', '<span class="badge ' + badgename + '">' + (typeof data[i]['프로그램'] === 'string' ? data[i]['프로그램'] : neo.emrs[data[i]['프로그램']].name) + '</span>');
                    temp = temp.replace('{{내용}}', data[i]['내용'] || data[i]['문의내용']);
                    temp = temp.replace(/{{KIND}}/gim, kind);
                    temp = temp.replace(/{{INDEX}}/gim, index);
                    temp = temp.replace(/{{ID}}/gim, i);


                    item += temp;
                }
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
        this.$footables = $('.footables');
        // this.$workHistoryTags = $('.work-history-tag-container');       // all tags
        // this.$workHistoryContents = $('.work-history-content-container') // all content

        this.$listSearch = $('input#worklist-search');
        this.$listCalendar = $('div#worklist-datepicker-embed');      // list embed calendar
        this.$listDatePicker = $('input#worklist-datepicker');      // list datepicker when mobile 
        this.$listDailyReports = $('div#worklist-list');
        this.$listPositionKinds = $('div#positionKind');
        this.$listWriters = $('div#writers');


        this.$writeReport = $('div#wroklist-write');
        this.$writeReportAdd = $('div#report-add');
        this.$writeReportAddForm = $('form#report-add-form');
        this.$writeReportAddSave = this.$writeReportAddForm.find('button[type="submit"]');
        this.$writeReportTableFT = null;
        this.$writeReportTable = $('table#worklist-write-reportTable');
        this.$writeReportTableOrigin = $('table#worklist-write-reportTable').clone();
        // this.$writeDialog = $('div#worklist-write');
        // this.$writeDatePicker = $('input#worklist-write-datepicker'); // write modal datepicker
        // this.$writeEditor = $('textarea#worklist-write-memo');
        this.$writePositionKind = $('select#worklist-position-kind');
        this.$writePositionName = $('input#worklist-position-name');
        // this.$writeVisitTags = $('span#visit-history');
        // this.$writeVisitContent = $('li#visit-history-content');
        // this.$writeTelTags = $('span#tel-history');
        // this.$writeTelContent = $('li#tel-history-content');
        // this.$writeASTags = $('span#as-history');
        // this.$writeASContent = $('li#as-history-content');
        this.$writeReportSave = $('button#writeReportSave');

    }

    View.prototype.init = function (callback) {
        var self = this;
        this.$datepickers.datepicker({
            format: 'yyyy-mm-dd',
            language: 'kr',
            keyboardNavigation: false,
            forceParse: true,
            autoclose: true,
            todayHighlight: true,
            todayBtn: 'linked'
        });
        this.$datepickers.each(function(){
            var tagName = $(this)[0].tagName;
            console.log(tagName);
            if(tagName.toLowerCase() === 'input'){
                $(this).attr('readonly', true);
            }
        });
        this.$listCalendar.datepicker('setDate', new Date().GetToday('YYYY-MM-DD'));
        this.$listDatePicker.datepicker('setDate', new Date().GetToday('YYYY-MM-DD'));
        // this.$writeDatePicker.datepicker('setDate',new Date().GetToday('YYYY-MM-DD'));
        // this.$listDatePicker.val(new Date().GetToday('YYYY-MM-DD'));
        // this.$writeDatePicker.val(new Date().GetToday('YYYY-MM-DD'));


        this.$selectpickers.selectpicker('destroy')
            .selectpicker({
                width: 'auto',
                size: 5,
                title: self.$selectpickers.data('title')
            });




        this.ReportTableInit();

        callback();
    };
    View.prototype.ReportTableInit = function () {
        var self = this;
        if (!this.$writeReportTableFT) {
            this.$writeReportTableFT = FooTable.init('#' + this.$writeReportTable.attr('id'),
                {                    
                    editing: {
                        enabled: true,
                        addRow: function () {
                            self.$writeReportAdd.removeData('row');
                            self.$writeReportAddForm[0].reset();
                            self.$writeReportAdd.modal('show').on('shown.bs.modal', function () {
                                self.$writeReportAdd.find('input#report-add-kind').focus();
                            }).on('hidden.bs.modal',function(){
                                if(window.addContinue){
                                    window.addContinue = false;
                                    self.$writeReportAddForm[0].reset();
                                    self.$writeReportAdd.modal('show');
                                }
                            });
                        },
                        editRow: function (row) {
                            var values = row.val();
                            // self.$writeReportAddForm.find('#id').val(values.id);
                            // self.$writeReportAddForm.find('input[data-name]
                            values['내용'] = values['내용'].replace(/<br *\/?>/gi, '\n');
                            self.$writeReportAddForm.find('input, textarea').each(function () {
                                var $this = $(this);
                                $this.val(values[$this.data('name')]);
                            });
                            self.$writeReportAdd.data('row', row);
                            self.$writeReportAdd.modal('show').on('shown.bs.modal', function () {
                                self.$writeReportAdd.find('input#report-add-kind').focus();
                            }).on('hidden.bs.modal',function(){
                                if(window.addContinue){
                                    window.addContinue = false;
                                    self.$writeReportAddForm[0].reset();
                                    self.$writeReportAdd.modal('show');
                                }
                            });
                        },
                        deleteRow: function (row) {
                            row.delete();
                        }

                    }
                }
            );
        } else {
            if (this.$writeReportTableFT.rows.all.length) {
                var rows = this.$writeReportTableFT.rows.all;
                rows.forEach(function (row) {
                    row.delete();
                });
            }
        }
    };
    // View.prototype.editorInit = function () {
    //     var self = this;
    //     var $ed = this.$writeEditor;
    //     tinymce.init({
    //         selector: '#' + $ed.attr('id'),
    //         menubar: false,
    //         statusbar: false,
    //         height: 1000,
    //         min_height: 500,
    //         toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | formatselect',
    //         plugins: [
    //             'advlist autolink lists link image charmap print preview anchor',
    //             'searchreplace visualblocks code fullscreen',
    //             'insertdatetime media table contextmenu paste',
    //             'autoresize nonbreaking'
    //         ],
    //         nonbreaking_force_tab: true,
    //         setup: function (editor) {

    //         }
    //     });
    // };

    View.prototype.bind = function (event, handler) {
        var self = this;
        if (event === 'todayWorklist') {
            // console.log('View.bind.todayWorklist execute!');
            // var temp = self.$writeDialog;
            // temp.bind('show.bs.modal', function () {
            //     console.log('show.bs.modal');
            //     handler();
            // });
            // temp.bind('hidden.bs.modal', function () {
            //     console.log('hidden.bs.modal');
            //     self.$writeDatePicker.datepicker('setDate', new Date().GetToday('YYYY-MM-DD'));//.val(new Date().GetToday('YYYY-MM-DD'));
            //     self.$writePositionKind.selectpicker('val', '');
            //     self.$writePositionName.val('');
            //     self.$writePositionName.attr('disabled', true);
            //     self.$workHistoryTags.empty();
            //     self.$workHistoryContents.empty();
            // });

            // temp = self.$writeDatePicker;
            // temp.bind('changeDate', function () {
            //     console.log('changeDate');
            //     handler({ workDate: $(this).val() });
            // });
        }
        else if (event === 'reportAddSave') {
            console.log('View.bind.reportAddSave execute');
            var temp = self.$writeReportAddForm;
            temp.unbind('submit').bind('submit', function (e) {
                e.preventDefault();
                var row = self.$writeReportAdd.data('row');
                var param = {};
                $(this).find('input, textarea').each(function () {
                    param[$(this).data('name')] = $(this).val().trim();
                });

                param['내용'] = param['내용'].replace(/\r?\n/g, '<br />');
                if (row instanceof FooTable.Row) {
                    row.val(param);
                } else {
                    param.id = new Date().GetToday();
                    self.$writeReportTableFT.rows.add(param);
                }

                self.$writeReportAdd.modal('hide');                
                // handler(param);
            });

            var temp = temp.find('button[data-name="reportAddSaveContinue"]');
            temp.unbind('click').bind('click', function(e){
                window.addContinue = true;
            });
        }
        else if (event === 'showWorkDetail') {
            console.log('View.bind.showWorkDetail execute');
            // var temp = self.$workHistoryTags;
            // temp.unbind('click').bind('click', function (e) {
            //     var $target = $(e.target);
            //     if ($target.hasClass('work-history-tag')) {
            //         handler({
            //             type: 'write',
            //             kind: $target.data('kind'),
            //             index: $target.data('index')
            //         });
            //     }
            // });

            var temp = self.$listDailyReports;
            temp.bind('click', function (e) {
                var $target = $(e.target);

                if ($target[0].tagName.toLowerCase() === 'i') $target = $target.parent();
                if ($target.hasClass('collapse-child-all-link')) {
                    $(e.target).toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    var collapse = $(e.target).hasClass('fa-chevron-up') ? true : false;
                    var $table = temp.find($target.data('collapse'));
                    var $headers = $table.find('tr.accordion-toggle');
                    $headers.each(function (i, v) {
                        if (collapse) {
                            // 닫아라
                            if (!$(v).hasClass('collapsed')) {
                                $($(v).data('target')).slideToggle(500);
                                $(v).addClass('collapsed');
                            }
                        } else {
                            // 열어라
                            if ($(v).hasClass('collapsed')) {
                                $($(v).data('target')).slideToggle(500);
                                $(v).removeClass('collapsed');
                            }
                        }
                    });
                }
                else if (e.target.tagName.toLowerCase().match(/td|label|span/gim)) {
                    if ($target[0].tagName.toLowerCase() !== 'td') {
                        $target = $target.parent().parent();
                    } else {
                        $target = $target.parent();
                    }
                    $($target.data('target')).slideToggle(500);
                    if (!$target.hasClass('collapsed')) {
                        $target.addClass('collapsed');
                    } else {
                        $target.removeClass('collapsed');
                    }
                }

            });

        }
        else if (event === 'positionKind') {
            console.log('View.bind.positionKind execute!');
            var temp = self.$writePositionKind;
            temp.unbind('change').bind('change', function () {
                var selectValue = $(this).selectpicker('val');
                selectValue = parseInt(selectValue);
                if (selectValue === 0 || selectValue === 1) {
                    self.$writePositionName.removeAttr('disabled');
                    self.$writePositionName.focus();
                } else {
                    self.$writePositionName.attr('disabled', true);
                }
            });
        }
        else if (event === 'saveNewWorkList') {
            console.log('View.bind.saveNewWorkList execute!');
            var temp = self.$writeReportSave;
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
        else if (event === 'searchDailyReports') {
            console.log('View.bind.searchDailyReports execute!');
            var temp = self.$listSearch;
            temp.unbind('keyup').bind('keyup', function (event) {
                if (event.type == 'keyup' && (event.keyCode == 13 || event.key == 'Enter')) {
                    var keyword = $(this).val().trim();
                    self.$listDailyReports.removeHighlight();
                    self.$listDailyReports.find('tr.accordion-toggle').each(function () {
                        var $this = $(this);
                        if (!$this.hasClass('collapsed')) {
                            $($this.data('target')).slideToggle(500);
                            $this.addClass('collapsed');
                        }
                    });
                    self.$listDailyReports.find('div.dailyReports').each(function (i, report) {
                        $(report).removeClass('hidden');
                    });
                    self.$listDailyReports.find('.no-daily-reports').remove();
                    if (!keyword || !keyword.length) return;
                    var finds = self.$listDailyReports.highlight(keyword);
                    if (typeof finds.forEach === 'function') {
                        finds.forEach(function (item) {
                            if (item) {
                                var $this = $(item);
                                if ($this.hasClass('collapsed')) {
                                    $this.removeClass('collapsed');
                                    $($this.data('target')).slideToggle(500);
                                }
                            }
                        });
                        self.$listDailyReports.find('div.dailyReports').each(function (i, report) {
                            var $report = $(report);
                            var $highligh = $report.find('span.highlight');
                            if ($highligh && $highligh.length) {

                            } else {
                                $report.addClass('hidden');
                            }
                        });
                    } else {
                        self.$listDailyReports.find('div.dailyReports').each(function (i, report) {
                            $(report).addClass('hidden');
                        });
                        self.$listDailyReports.append(self.template.defaultNoReports)
                    }


                }
            });
        }
        else if (event === 'tagSearch') {
            var temp = self.$listPositionKinds;
            temp.unbind('click').bind('click', function (e) {
                var $target = $(e.target);
                if (e.target.tagName.toLowerCase() === 'i') $target = $target.parent();
                if ($target.hasClass('tagSearch-position')) {
                    e.preventDefault();
                    handler({
                        report_date: self.$listCalendar.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD'),
                        report_position: $target.data('position')
                    });
                }
            });
            temp = self.$listWriters;
            temp.unbind('click').bind('click', function (e) {
                var $target = $(e.target);
                if (e.target.tagName.toLowerCase() === 'i') $target = $target.parent();
                if ($target.hasClass('tagSearch-writer')) {
                    e.preventDefault();
                    handler({
                        report_date: self.$listCalendar.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD'),
                        report_writer: $target.data('writer')
                    });
                }
            });
        }
        else if (event === 'reportDelete') {
            var temp = self.$listDailyReports;
            temp.bind('click', function (e) {
                var $target = $(e.target);
                if (e.target.tagName.toLowerCase() === 'i') $target = $target.parent();
                if ($target.hasClass('report-delete')) {
                    swal({
                        title: '해당 보고서를 삭제할까요?',
                        text: "",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '네, 삭제합니다.'
                    }).then(function () {
                        handler({
                            report_id: $target.data('reportindex'),
                            report_date: self.$listCalendar.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD')
                        });
                    });
                }
            });
        }
        else if (event === 'reportEdit') {
            var temp = self.$listDailyReports;
            temp.bind('click', function (e) {
                var $target = $(e.target);
                if (e.target.tagName.toLowerCase() === 'i') $target = $target.parent();
                if ($target.hasClass('report-edit')) {
                    handler({
                        report_id: $target.data('reportindex'),
                        report_date: self.$listCalendar.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD')
                    });
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
                self.$listWriters.empty().append(self.template.insertWriters(data));
                self.$listPositionKinds.empty().append(self.template.insertPositionKinds(data));
                self.$listDailyReports.empty().append(self.template.insertReports(data));

                self.$listDailyReports.find('div.work-add-table-container').each(function () {
                    var $this = $(this);
                    var jsonData = $this.html();
                    jsonData = jsonData.replace(/\r?\n/g, '<br />');
                    jsonData = JSON.parse(jsonData);
                    $this.empty();
                    var $table = $('<table/>').appendTo($this);
                    $table.addClass('table table-hover daily-report-table').footable({
                        'columns': self.template.defaultDailyReportTableColumn,
                        'rows': jsonData
                    });
                });

                var myReport = data.data[6];

                if (myReport.length || neo.user.user_login_id.toLowerCase() === 'president') {
                    self.$writeReport.addClass('hidden');
                } else {
                    self.$writeReport.removeClass('hidden');
                    self.$writeReport.find('h5#worklist-write-writer').text(
                        '작성자:' + neo.user.USER_NAME + ' / 작성일자: ' + new Date().GetToday('YYYY년 MM월 DD일 오전/오후 HH:MM:SS')
                    );
                    self.$writePositionKind.selectpicker('val', '');
                    self.$writePositionName.val('');
                    self.ReportTableInit();
                }
            },
            editReport : function(){
                var report_index = data['인덱스'];
                var jsData = JSON.parse(data['기타업무']);
                (function(callback){
                    self.$writeReport.removeData('reportindex').data('reportindex', report_index);
                    self.$listDailyReports.find('.dailyReports[data-reportindex="'+report_index+'"]').fadeOut(500);
                    self.$writeReport.find('h5#worklist-write-writer').text(
                        '작성자:' + neo.user.USER_NAME + ' / 작성일자: ' + new Date().GetToday('YYYY년 MM월 DD일 오전/오후 HH:MM:SS')
                    );
                    self.$writePositionKind.selectpicker('val', data['부서']);
                    self.$writePositionName.val(data['부서명']);
                    self.ReportTableInit();

                    jsData.forEach(function(item){
                        self.$writeReportTableFT.rows.add(item);
                    });

                    callback();
                })(function(){
                    self.$writeReport.removeClass('hidden');
                });                
            }
        };
        viewCommands[viewCmd]();
    };

    View.prototype._ParseWorkListData = function (callback) {
        var self = this;
        var params = {            
            report_date: self.$listCalendar.datepicker('getDate').GetDate_CustomFormat('YYYY-MM-DD'),
            position_kind: self.$writePositionKind.selectpicker('val'),
            position_name: self.$writePositionName.val().trim(),
            writer: neo.user.USER_ID,
            write_date: new Date().GetToday('YYYY-MM-DD HH:MM:SS'),
            memo: []
        };

        var report_index = self.$writeReport.data('reportindex');
        if(report_index){
            params.report_index = report_index;
            self.$writeReport.removeData('reportindex');
        }

        if (!params.position_kind) {
            self.$writePositionKind.tooltip({
                placement: 'top',
                title: '부서를 선택해주세요!'
            }).tooltip('show')
            self.$writePositionKind.focus();
            return null;
        } else if ((parseInt(params.position_kind) === 0 || parseInt(params.position_kind) === 1 ) && params.position_name === '') {
            self.$writePositionName.tooltip({
                placement: 'top',
                title: '부서명을 입력해주세요!'
            }).tooltip('show')
            self.$writePositionName.focus();
            return null;
        }

        self.$writeReportTableFT.rows.all.forEach(function (row) {
            params.memo.push({
                'id': row.value['id'],
                '구분': row.value['구분'],
                '프로그램': row.value['프로그램'],
                '요청자': row.value['요청자'],
                '거래처': row.value['거래처'],
                '상태': row.value['상태'],
                '내용': row.value['내용']
            });
        });
        params.memo = JSON.stringify(params.memo);

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

        this.view.bind('reportAddSave');

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

        this.view.bind('searchDailyReports');

        this.view.bind('tagSearch', function (param) {
            self.showDailyReportsList(param);
        });

        this.view.bind('reportDelete', function (param) {
            self.deleteReport(param);
        });

        this.view.bind('reportEdit', function (param) {
            self.editReport(param);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////


        this.view.init(function () {
            self.showDailyReportsList();
        });
    }

    Controller.prototype.showDailyReportsList = function (param) {
        var self = this;
        param = param || {};

        var option = {
            url: '/worklist/list',
            dataType: 'json',
            data: {
                report_date: param.report_date || new Date().GetToday('YYYY-MM-DD'),
                report_keyword: param.report_keyword || self.view.$listSearch.val().trim(),
                report_writer: param.report_writer,
                report_position: param.report_position,
                report_user: neo.user.USER_ID
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
            url: '/worklist/list',
            dataType: 'json',
            data: param,
            method: param.report_index ? 'PUT' : 'POST',
            async: true,
            loader: loader
        };
        this.model.saveDailyWork(option, function (result) {
            if (!result) console.log(result.err);

            self.showDailyReportsList({
                report_date: param.report_date
            });
        });
    };

    Controller.prototype.deleteReport = function (param) {
        var self = this;
        param = param || {};
        var option = {
            url: '/worklist/list',
            dataType: 'json',
            data: param,
            method: 'DELETE',
            async: true
        };

        this.model.deleteDailyReport(option, function (result) {
            if (!result) console.log(result.err);
            self.showDailyReportsList({
                report_date: param.report_date
            });
        });

    };

    Controller.prototype.editReport = function (param) {
        var self = this;
        param = param || {};
        this.model.findEditData(param, function (result) {
            self.view.render('editReport', result);
        });
    }

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

    Model.prototype.deleteDailyReport = function (option, callback) {
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            success: function (result) {
                if (result.err) {
                    neoNotify.Show({
                        text: '보고서 삭제를 실패하였습니다. <br> ' + result.err.message,
                        type: 'error',
                        desktop: false
                    });
                } else if (result.data[0].Status != 0) {
                    neoNotify.Show({
                        text: '보고서 삭제를 실패하였습니다. <br> ' + result.data[0].Message,
                        type: 'error',
                        desktop: false
                    });
                } else {
                    neoNotify.Show({
                        text: '보고서를 삭제하였습니다.',
                        type: 'success',
                        desktop: false
                    });
                }
                callback(result);

            },
        });
    };

    Model.prototype.findEditData = function (option, callback) {
        var dailylist = this.storage.getData('dailylist');
        dailylist = dailylist[2];
        callback(dailylist.find(function (item) {
            return item.인덱스 === option.report_id;
        }));
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
