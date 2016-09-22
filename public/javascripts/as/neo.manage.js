(function() {

    var VIEWMODE = {
        AREA: 0,
        MY: 1
    };

    var NeoManage = function(menu) {
        var _menu = menu;
        var _me = this;
        var manage = null;
        if (_menu === MENU.MANAGE_STATUS) {
            manage = new AsHistory();
        }



        // _me.Initialize = function(callback){
        //   _me.settings.init();
        //   _me.rank.init();
        //   _me.elem.init();
        //   return callback();
        // };
        //
        // _me.Initialize(function(){
        //   var height = $(window).height() - 110;
        //   $('.tabs-container').height(height);
        //   $('a.rank-tabs:eq(0)').tab('show');
        // });

    };

    function AsHistory() {
        this.user_id = neo.user.USER_ID;
        this.user_area = neo.user.user_area;

        var options = localStorage.getItem('as_history_options');
        if (options) {
            this.search_options = JSON.parse(options);
        }

        var elem = this.elem;
        elem.$service_status = $('button.service_status');
        elem.$view_mode = $('input.view_mode');
        elem.$keyword = $('input#keyword');
        elem.$search = $('button#btnSearch');
        elem.$table = $('table#data-table');


        var me = this;
        var statusClick = function(e) { me.events.ServiceStatus_OnClick(e, me); };
        var viewClick = function(e) { me.events.ViewMode_OnClick(e, me); };
        var searchClick = function(e) { me.events.btnSearch_OnClick(e, me); };
        var keywordKeyUp = function(e) { me.events.Keyword_OnKeyUp(e, me); };

        elem.$service_status.bind('click', statusClick);
        elem.$view_mode.bind('click', viewClick);
        elem.$search.bind('click', searchClick);
        elem.$keyword.bind('keyup', keywordKeyUp);

        this.init();
    }

    AsHistory.prototype = {
        user_id: null,
        user_area: null,
        search_options: {
            service_status: [ASSTATUS.ACCEPT, ASSTATUS.CONFIRM, ASSTATUS.TAKEOVER, ASSTATUS.TAKEOVERCONFIRM, ASSTATUS.DONE, ASSTATUS.CANCEL],
            view_mode: VIEWMODE.AREA,
            keyword: ''
        },
        elem: {
            $service_status: null,
            $view_mode: null,
            $keyword: null,
            $search: null,
            $table: null,
            $dataTable: null
        },
        events: {
            ServiceStatus_OnClick: function(e, _this) {
                $(e.target).toggleClass('active');
                var status = $(e.target).data('status');
                var selIndex = -1;
                var isExist = _this.search_options.service_status.some(function(_v, _i) {
                    if (_v == status) {
                        selIndex = _i;
                        return true;
                    }
                });
                if (isExist) {
                    _this.search_options.service_status.splice(selIndex, 1);
                } else {
                    _this.search_options.service_status.push(status);
                }
                console.log(_this.search_options.service_status);
            },
            ViewMode_OnClick: function(e, _this) {
                _this.search_options.view_mode = $(e.target).val();
            },
            Keyword_OnKeyUp: function(e, _this) {
                console.log(e);
            },
            btnSearch_OnClick: function(e, _this) {
                _this.Load();
            }
        },
        init: function() {
            var _this = this;
            var $elem = this.elem.$service_status;
            $elem.each(function(i, v) {
                var selected = _this.search_options.service_status.some(function(_i) {
                    return $(v).data('status') == _i;
                });
                $(v).addClass(selected ? 'active' : '');
            });

            $elem = this.elem.$view_mode;
            $elem.each(function(i, v) {
                if ($(v).val() == _this.search_options.view_mode) {
                    $(v).attr('checked', true);
                }
            });

            _this.Load();
        },
        Load: function() {
            var _this = this;
            var options = _this.search_options;
            options.mode = 0;

            if (options.view_mode === VIEWMODE.AREA) {
                options.view_mode_value = _this.user_area;
            } else {
                options.view_mode_value = _this.user_id;
            }

            neoAJAX.GetAjax({
                url: '/as/history',
                data: options,
                dataType: 'json',
                async: true,
                method: 'GET',
                beforeSend: function() {
                    Pace.start();
                },
                success: function(opt, records) {
                    var $table = _this.elem.$table;

                    if (records.data && records.data.length) {
                        records.data.forEach(function(_item, _index) {
                            var temp = ASSTATUS.ServiceBackGround(_item.서비스상태);
                            temp.value = _item;
                            records.data[_index] = JSON.parse(JSON.stringify(temp));
                        });
                    }

                    $table.footable({
                        "columns": [
                            { 'name': '인덱스', 'title': 'ID', 'style': { 'width': 50, 'maxWidth': 50 } },
                            { 'name': '기관코드', 'title': '기관번호' },
                            { 'name': '기관명칭', 'title': '기관명칭' },
                            {
                                'name': '프로그램',
                                'title': '프로그램',
                                formatter: function(value) {
                                    if (value === "" || typeof value === "undefined") value = 0;
                                    switch (parseInt(value)) {
                                        case 1:
                                            return "<span class='badge badge-eplus'>Eplus</span>";
                                        case 8:
                                            return "<span class='badge badge-medi'>Medi</span>";
                                        case 20:
                                            return "<span class='badge badge-sense'>Sense</span>";
                                    }
                                }
                            },
                            {
                                'name': '지사코드',
                                'title': '담당지사',
                                formatter: function(value) {
                                    if (value === '' || typeof value === 'undefined') value = '0000';
                                    return neo.area[value];
                                }
                            },
                            {
                                'name': '서비스상태',
                                'title': '상태',
                                formatter: function(value) {
                                    value = parseInt(value);
                                    return ASSTATUS.ServiceName(value);
                                }
                            },
                            { 'name': '접수자', 'title': '접수자' },
                            { 'name': '접수일자', 'title': '접수일', 'type': 'date', 'formatString': 'YYYY-MM-DD' },
                            { 'name': '확인자', 'title': '확인자' },
                            { 'name': '확인일자', 'title': '확인일', 'type': 'date', 'formatString': 'YYYY-MM-DD' },
                            { 'name': '인계자', 'title': '인계자' },
                            { 'name': '인계일자', 'title': '인계일', 'type': 'date', 'formatString': 'YYYY-MM-DD' },
                            { 'name': '처리자', 'title': '처리자' },
                            { 'name': '처리일자', 'title': '처리일', 'type': 'date', 'formatString': 'YYYY-MM-DD' },
                        ],
                        "rows": records.data
                    });
                },
                callback: function() {

                }
            });
        }
    };

    // NeoAS();
    $.neoMNG = NeoManage;

})(window);