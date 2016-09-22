(function() {
    /**
     * Save Client Browser
     */
    sessionStorage.setItem('browser', checkBrowser());

    function checkBrowser() {
        var word;
        var version = "N/A";

        var agent = navigator.userAgent.toLowerCase();
        var name = navigator.appName;

        // IE old version ( IE 10 or Lower )
        if (name == "Microsoft Internet Explorer") word = "msie ";

        else {
            // IE 11
            if (agent.search("trident") > -1) word = "trident/.*rv:";

            // Microsoft Edge
            else if (agent.search("edge/") > -1) word = "edge/";
        }

        var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");

        if (reg.exec(agent) !== null) version = RegExp.$1 + RegExp.$2;

        var verNumber = parseInt(version, 10);

        return verNumber;
    }


    /**
     *  IE 9 is not have console Object
     */
    if (!(window.console && console.log)) {
        console = {
            log: function() {},
            debug: function() {},
            info: function() {},
            warn: function() {},
            error: function() {}
        };
    }


    /**
     * Date Object Settings
     */
    Date.prototype.GetDate_CustomFormat = function(format) {
        var yyyy = this.getFullYear().toString();
        var MM = pad(this.getMonth() + 1, 2);
        var dd = pad(this.getDate(), 2);
        var hh = pad(this.getHours(), 2);
        var mm = pad(this.getMinutes(), 2);
        var ss = pad(this.getSeconds(), 2);

        function pad(number, length) {
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }

        switch (format) {
            case "YYYY년 MM월":
                return yyyy + '년 ' + MM + "월";
            case "YYYY-MM":
                return yyyy + '-' + MM;
            case "YYYY-MM-DD":
                return yyyy + '-' + MM + '-' + dd;
            case "YYYY-MM-DD HH:MM:SS":
                return yyyy + '-' + MM + '-' + dd + ' ' + hh + ":" + mm + ":" + ss;
            default:
                return yyyy + MM + dd + hh + mm + ss;
        }

    };

    Date.prototype.GetToday = function(format) {
        var d = new Date();
        return d.GetDate_CustomFormat(format);
    };

})(window);

/**
 * 소켓 이벤트 상수
 */
var SOCKETEVENT = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    STATUS: 'status',
    MEMBER: {
        JOIN: 'manager:join',
        LEAVE: 'manager:leave',
        CLIENTS: 'manager:clients',
        ALIVE: 'manager:alive',
        LIVEAS: 'manager:liveas',
        CHECKLIVEAS: 'manager:checkliveas',
        UNLIVEAS: 'manager:unliveas'
    },
    CLIENT: {
        JOIN: 'client:join',
        LEAVE: 'client:leave',
        LIVEAS: 'client:liveas',
        CANCEL: 'client:cancel'
    }
};

/**
 * AS 상태 상수
 */
var ASSTATUS = {
    ACCEPT: 0,
    CONFIRM: 1,
    TAKEOVER: 2,
    TAKEOVERCONFIRM: 3,
    DONE: 4,
    CANCEL: 5,
    ServiceName: function(s) {
        switch (s) {
            case this.ACCEPT:
                return '접수';
            case this.CONFIRM:
                return '확인';
            case this.TAKEOVER:
                return '인계';
            case this.TAKEOVERCONFIRM:
                return '인계확인';
            case this.DONE:
                return '완료';
            case this.CANCEL:
                return '취소';
        }
    }
};

/**
 * MENU ID Collection
 */
var MENU = {
    REQUEST: 501,
    TAKEOVER: 502,
    MYAS: 503,
    MANAGE_STATUS: 504,
    MANAGE_STATISTIC: 505
};

var SETTINGS = {
    LAYOUT: 0
};

/**
 * Modules collections
 */
var neoModules = {
    SetLayout: function(menu, container) {
        var view = '',
            start;
        var m = mobile ? "_m" : "";
        var param = null;
        switch (menu) {
            case MENU.REQUEST:
                view = 'as-request-layout';
                start = $.neoAS;
                break;
            case MENU.TAKEOVER:
                view = 'as-takeover-layout';
                start = $.neoTK;
                break;
            case MENU.MYAS:
                view = 'as-myas-layout';
                start = $.neoMY;
                break;
            case MENU.MANAGE_STATUS:
                alert('A/S처리내역 메뉴는 작업중입니다.');
                view = 'as-manage-layout_status';
                start = $.neoMNG;
                param = menu;
                break;
            case MENU.MANAGE_STATISTIC:
                alert('A/S통계 메뉴는 작업중입니다.');
                view = 'as-manage-layout';
                //start = $.neoMNG(menu);
                start = function() {}
                break;
            default:
                view = 'as-request-layout';
        }
        view += m;
        container.load('/template/' + view, function() {
            return start(param);
        });
        // neoAJAX.GetTemplate(view, function(template){
        //   container.html(template);
        //   return start();
        // });
    },
    SetElementHeight: function() {
        offsetTop = {};
        $('.scroll-container').each(function(index, elem) {
            var name = $(elem).data('name');
            if (typeof offsetTop[name] === 'undefined') offsetTop[name] = [];
            offsetTop[name].push($(elem).offset().top);
            offsetTop[name] = offsetTop[name].sort(function(a, b) { return a - b; });
        });

        var keys = Object.keys(offsetTop);
        keys.forEach(function(item) {
            $('.scroll-container[data-name="' + item + '"]').height($(window).height() - offsetTop[item][offsetTop[item].length - 1] - (mobile ? 10 : 50) + 'px');
            $('.scroll-container[data-name="' + item + '"]').css({
                'overflow': 'auto',
                '-webkit-overflow-scrolling': 'touch'
            });
        });

    }

};

/**
 * AJAX Collection
 */
var neoAJAX = {
    GetTemplate: function(view, callback) {
        var url = '/template/' + view;
        var template;
        $.ajax({
            url: url,
            async: false,
            success: function(data) {
                if (data) {
                    template = data;
                }
            },
            err: function(data) {
                console.log(data);
            },
            complete: function() {
                callback(template);
            }
        });
    },
    GetAjax: function(opts) {
        $.ajax({
            url: opts.url,
            data: opts.data,
            dataType: opts.dataType,
            async: opts.async,
            method: opts.method,
            beforeSend: function() {
                if (typeof opts.beforeSend === 'function') {
                    return opts.beforeSend(opts);
                }
            },
            success: function(data) {
                opts.success(opts, data);
            },
            error: function(err) {
                console.log(err);
            },
            complete: function() {
                if (typeof opts.callback === 'function') return opts.callback(opts);
            }
        });
    },
    as: {

        UpdateAS: function(elem, data, callback) {
            var result;
            $.ajax({
                url: 'clients/updateas',
                data: data,
                dataType: 'json',
                async: true,
                method: 'PUT',
                beforeSend: function() {
                    elem.find('i.fa-hospital-o').removeClass('fa-hospital-o').addClass('fa-refresh fa-spin');
                },
                success: function(data) {
                    result = data;
                },
                error: function(err) {
                    result = data;
                },
                complete: function() {
                    elem.find('i.fa-refresh').removeClass('fa-refresh fa-spin').addClass('fa-hospital-o');
                    if (typeof callback === 'function') return callback(result);
                }
            });
        }
    },
    GetSpinners: function(type) {
        var spinners = {
            fadingCircles: '<div class="spiner-example animated fadeInDown">' +
                '<div class="sk-spinner sk-spinner-fading-circle">' +
                '<div class="sk-circle1 sk-circle"></div>' +
                '<div class="sk-circle2 sk-circle"></div>' +
                '<div class="sk-circle3 sk-circle"></div>' +
                '<div class="sk-circle4 sk-circle"></div>' +
                '<div class="sk-circle5 sk-circle"></div>' +
                '<div class="sk-circle6 sk-circle"></div>' +
                '<div class="sk-circle7 sk-circle"></div>' +
                '<div class="sk-circle8 sk-circle"></div>' +
                '<div class="sk-circle9 sk-circle"></div>' +
                '<div class="sk-circle10 sk-circle"></div>' +
                '<div class="sk-circle11 sk-circle"></div>' +
                '<div class="sk-circle12 sk-circle"></div>' +
                '</div>' +
                '</div>'
        };
        return spinners[type];
    }
};

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var generateColr = function() {

    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;

};