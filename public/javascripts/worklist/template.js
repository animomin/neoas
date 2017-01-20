(function (exports){
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
            template = template.replace('{{작성일자}}', moment(mainData[i]['작성일자']).format('YYYY MMMM Do, a h:mm:ss'));
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
            template = template.replace('{{방문일지}}', _worklistTemplate(3, mainData[i]['작성자'], mainData[i]['인덱스'], visitData));
            template = template.replace('{{전화일지}}', _worklistTemplate(4, mainData[i]['작성자'], mainData[i]['인덱스'], telData));
            template = template.replace('{{AS일지}}', _worklistTemplate(5, mainData[i]['작성자'], mainData[i]['인덱스'], asData));


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
                
                if (data[i]['작성자'] === writer) {
                    var temp = '' +
                        '   <tr data-target="#work-{{KIND}}{{ID}}{{INDEX}}" data-kind="{{KIND}}" data-id="{{ID}}" data-index="{{INDEX}}" data-work-index="{{인덱스}}" class="accordion-toggle collapsed">' +
                        '        <td>[{{인덱스}}] {{기관명칭}} <label class="label">{{기관코드}}</label> {{프로그램}}</td>' +
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
                    // temp = temp.replace('{{내용}}', data[i]['내용'] || data[i]['문의내용']);
                    temp = temp.replace(/{{KIND}}/gim, kind);
                    temp = temp.replace(/{{INDEX}}/gim, index);
                    temp = temp.replace(/{{ID}}/gim, i);
                    temp = temp.replace(/{{인덱스}}/gim, data[i]['인덱스']);


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

    exports.worklist = exports.worklist || {};
    exports.worklist.Template = Template;
    

})(window);
    