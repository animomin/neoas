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

        elem.$dataTable = elem.$table.DataTable({
            'searching': false,
            'destroy': true
        });

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
                console.log(e);
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
                    console.log(records.data);
                    _this.elem.$dataTable.destroy();

                    _this.elem.$table.DataTable({
                        searching: false,
                        'ajax': records.data
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