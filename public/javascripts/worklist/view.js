(function (exports) {
    'use strict';

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
        this.$listScrollTop = $('a#scroll-top');


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
        this.$listYesterDay = $('button#worklist-date-yesterday')

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
        this.$datepickers.each(function () {
            var tagName = $(this)[0].tagName;
            console.log(tagName);
            if (tagName.toLowerCase() === 'input') {
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


        $('#wrapper').scroll(function () {
            if ($(this).scrollTop() > 50) {
                self.$listScrollTop.fadeIn();
            } else {
                self.$listScrollTop.fadeOut();
            }
        });
        // scroll body to 0px on click
        this.$listScrollTop.click(function () {
            $('#wrapper').animate({ scrollTop: self.$writeReport.position().top + 'px' }, 800);
            return false;
        });



        callback();
    };
    View.prototype.ReportTableInit = function (callback) {
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
                            }).on('hidden.bs.modal', function () {
                                if (window.addContinue) {
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
                            }).on('hidden.bs.modal', function () {
                                if (window.addContinue) {
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
                // rows.forEach(function (row) {
                //     row.delete();
                // });
                for (var i = rows.length - 1; i >= 0; i--) {
                    rows[i].delete();
                }
            }
            callback = callback || function () { };
            callback();
        }
    };
  

    View.prototype.bind = function (event, handler) {
        var self = this;
        if (event === 'todayWorklist') {
        
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
                    param.id = new Date().GetToday() + Math.floor(Math.random() * 100000) + 1;
                    self.$writeReportTableFT.rows.add(param);
                }

                self.$writeReportAdd.modal('hide');
                // handler(param);
            });

            var temp = temp.find('button[data-name="reportAddSaveContinue"]');
            temp.unbind('click').bind('click', function (e) {
                window.addContinue = true;
            });
        }
        else if (event === 'showWorkDetail') {
            console.log('View.bind.showWorkDetail execute');
            

            var temp = self.$listDailyReports;
            temp.bind('click', function (e) {
                var $target = $(e.target);                
                if (e.target.tagName.toLowerCase().match(/td|label|span|tr/gim)) {
                    if(e.target.tagName.toLowerCase() !== 'tr'){
                        if ($target[0].tagName.toLowerCase() !== 'td') {
                            $target = $target.parent().parent();
                        } else {
                            $target = $target.parent();
                        }
                    }
                    if ($target[0].tagName.toLowerCase() === 'tr') {

                        if (!$target.hasClass('loaded')) {
                            $target.addClass('loaded');
                            handler({
                                kind: $target.data('kind'),
                                id: $target.data('id'),
                                index: $target.data('work-index'),
                                $target: $target
                            });
                        } else {
                            $($target.data('target')).slideToggle(500);
                            if (!$target.hasClass('collapsed')) {
                                $target.addClass('collapsed');
                            } else {
                                $target.removeClass('collapsed');
                            }
                        }

                    }
                } else{

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
                                    // $($(v).data('target')).slideToggle(500);
                                    // $(v).removeClass('collapsed');
                                    $(v).trigger('click');
                                }
                            }
                        });
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
                    if (params) {
                        self.$writeReport.fadeOut('fast');
                        handler(params, temp);
                    }
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
        else if (event === 'listyesterday') {
            var temp = self.$listYesterDay;
            temp.bind('click', function (e) {
                self.$listCalendar.datepicker('setDate', moment().add(-1, 'day').format('YYYY-MM-DD'));
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

                var $target = $(data.$target.data('target'));
                $target.html($target.html().replace('{{내용}}', data.data[0]['내용']));
                $target.find('img').css('width', '100%');
                $target.slideToggle(500);
                if (!data.$target.hasClass('collapsed')) {
                    data.$target.addClass('collapsed');
                } else {
                    data.$target.removeClass('collapsed');
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

                    var ids = [], filteredData = [];
                    jsonData.forEach(function (item, index) {
                        if ($.inArray(item.id, ids) === -1) {
                            ids.push(item.id);
                            filteredData.push(item);
                        }
                    });

                    jsonData = filteredData;

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
                        '작성자:' + neo.user.USER_NAME + ' / 작성일자: ' + moment().format('YYYY MMMM Do, a h:mm:ss')
                    );
                    self.$writePositionKind.selectpicker('val', '');
                    self.$writePositionName.val('');
                    self.ReportTableInit();
                }

                self.$writeReport.fadeIn('fast');
            },
            editReport: function () {
                var report_index = data['인덱스'];
                var jsData = JSON.parse(data['기타업무']);
                (function (callback) {
                    self.$writeReport.removeData('reportindex').data('reportindex', report_index);
                    self.$listDailyReports.find('.dailyReports[data-reportindex="' + report_index + '"]').fadeOut();
                    self.$writeReport.find('h5#worklist-write-writer').text(
                        '작성자:' + neo.user.USER_NAME + ' / 작성일자: ' + moment().format('YYYY MMMM Do, a h:mm:ss')
                    );
                    self.$writePositionKind.selectpicker('val', data['부서']);
                    self.$writePositionName.val(data['부서명']);
                    self.ReportTableInit(function () {
                        jsData.forEach(function (item) {
                            self.$writeReportTableFT.rows.add(item);
                        });
                    });
                    setTimeout(function () {
                        callback();
                    }, 800);
                })(function () {
                    self.$writeReport.removeClass('hidden');
                    $('#wrapper').animate({ scrollTop: self.$writeReport.position().top + 'px' }, 1000);
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
        if (report_index) {
            params.report_index = report_index;
            self.$writeReport.removeData('reportindex');
        }

        if (!params.position_kind) {
            self.$writePositionKind.tooltip({
                placement: 'top',
                title: '부서를 선택해주세요!'
            }).tooltip('show')
            self.$writePositionKind.focus();
            return callback(null);
        } else if ((parseInt(params.position_kind) === 0 || parseInt(params.position_kind) === 1) && params.position_name === '') {
            self.$writePositionName.tooltip({
                placement: 'top',
                title: '부서명을 입력해주세요!'
            }).tooltip('show')
            self.$writePositionName.focus();
            return callback(null);
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

    exports.worklist = exports.worklist || {};
    exports.worklist.View = View;

})(window);