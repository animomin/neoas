(function (exports) {
    'use strict';

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
            if (window.worklistLoad) self.showDailyReportsList(param);
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

        this.view.bind('listyesterday');

        //////////////////////////////////////////////////////////////////////////////////////////////////


        this.view.init(function () {
            self.showDailyReportsList();
            window.worklistLoad = true;
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
        var option = {
            url : '/worklist/detail',
            dataType: 'json',
            data : {
                kind : param.kind,
                index : param.index
            },
            method : 'GET',
            async : true
        };
        this.model.getWorkDetail(option, function (result) {
            if (result.err) console.log(result.err);
            else {
                result.$target = param.$target             
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
            if (result.err) console.log(result.err);

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
            if (result.err) console.log(result.err);
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

    exports.worklist = exports.worklist || {};
    exports.worklist.Controller = Controller;
    
})(window);