(function(){
    "use strict";

    global.multiparty = require('multiparty');
    global.async = require('async');
    global.util = require('util');
    global.fs = require('fs');
    global.datetime = require('node-datetime');
    global.logger = require('./logger');
    

    global.server16 = require('../dist/_db/neoServer16');
    global.server22 = require('../dist/_db/neoServer22');
    global.member = require('../dist/Member');
    global.client = require('../dist/Client');
    var neoConst = require('./const');
    global.area = neoConst.area;
    global.emrs = neoConst.emrs;
    neoConst.settings._loadLayouts();


    var extend = util._extend;

    global.ASSTATUS = {
        ACCEPT : 0,
        CONFIRM : 1,
        TAKEOVER : 2,
        TAKEOVERCONFIRM : 3,
        DONE : 4,
        CANCEL : 5
    };

    global.page = {
      MENU : {
        // as menu
        CLIENTACCEPT : 401,
        CLIENTROOM : 402,
        CLIENTHISTORY : 403,
        REQUEST : 501,
        TAKEOVER : 502,
        MYAS : 503,
        MANAGE: 504
      },
      users : {
        index : "users",
        login : "users/login"
      },
      as : {
        index : "as",
        request : "as/request",
        takeover : "as/takeover",
        myas : "as/myas"
      }
    };

    global.params = {
      options : {
        STATUS : false,
        title : "",
        body : "",
        menu : 0,
        user : null,
      },
      GetLoginParam : function(status){
        var option = extend({},this.options);

        option = {
          STATUS : status,
          title : "AS예약 관리 로그인",
          body : "",
          menu : 0,
          user : null,
        };

        return option;
      },
      GetASParams : function(req){
        var option = extend({},this.options);
        option = {
          STATUS : true,
          title : 'NeoSoftBank AS',
          body : "gray-bg fixed-nav",
          menu : req.params.menu || page.MENU.REQUEST,
          user : req.session.user
        };

        return option;
      },
      GetASClientParams : function(req){
        var option = extend({},this.options);
        option = {
          STATUS : true,
          title : '',
          body : 'gray-bg text-muted',
          menu : page.MENU.CLIENTACCEPT
        };

        return option;
      }
    };


})();
