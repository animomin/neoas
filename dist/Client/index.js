(function() {
    "use strict";

    var query = "",
        where = "",
        orderby = "",
        set = "";
    var data = {};

    exports.Accept = function(req, callback) {
        logger.info('AS INSERT ACCESS ::: _Request');
        logger.info('Parameter Info =============================== ');
        logger.info(req);
        logger.info('============================================== ');

        async.waterfall([
            function(callback2) {
                if (req.area + '' === '') {
                    _GetHospInfo(req.hospnum, 'info_area', function(data) {
                        req.area = data;
                        return callback2();
                    });
                } else {
                    return callback2();
                }
            },
            function(callback2) {

                if (req.client_contact2) req.client_contact += ":" + req.client_contact2;
                var comment = req.comment + "";
                comment = comment.trim();

                var query = util.format(
                    global.querys16._Request,
                    req.hospnum, req.hospname, req.area, req.program, req.pcinfo,
                    req.client_name, req.client_contact, comment, req.curversion,
                    req.bohum, req.hosp_contact, req.pacs, req.servername, req.serverid,
                    req.serverpw, req.dbname, req.certpw, req.openperson, req.sutak, req.exe,
                    req.os, req.sqlversion, req.astype, req.masterDrug, req.masterSuga, req.masterMaterial,
                    req.manager
                );
                logger.info('Ready to Execute :::');
                logger.info(query);
                if (server16.connection.connected) {
                    server16.execute(query, function(err, records) {
                        callback2(err, records);
                    });
                } else {
                    logger.error('Server16 is disconnected so can not execute Query');
                }
            }
        ], function(err, data) {
            return callback(err, data);
        });
    };

    exports.GetASItem = function(req, callback) {
        query = querys16._RequestList;
        where = " AND 인덱스 = " + req.query.id;
        orderby = " 인덱스 ASC ";
        query = util.format(query, where, orderby);
        query = query.replace('{문의내용}', '문의내용');
        if (server16.connection.connected) {
            server16.RecordSet(query, function(err, records) {
                if (err) {
                    logger.error(err);
                    data.err = err;
                    data.data = null;
                } else if (!records || records.length <= 0) {
                    data.err = 'NODATA';
                    data.data = null;
                } else {
                    data.err = null;
                    data.data = records;
                }
                return callback(data);
            });
        }
    };

    exports.GetASList = function(req, callback) {
        var params = req.query;
        params.area = params.area === 'true';
        params.status = parseInt(params.status);
        async.waterfall([
            function(callback2) {
                query = querys16._RequestList;
                if (params.type === 'TAKEOVER') {
                    query = query.replace('{문의내용}','문의내용');
                    where = ' AND 서비스상태 = ' + ASSTATUS.TAKEOVER;
                    where += ' AND ISNULL(처리자ID,0) = 0 ';
                    where += ' AND 프로그램 = ' + params.emr;
                    orderby = ' 응급여부 DESC, CONVERT(char(10),접수일자,120) DESC ';
                } else if (params.type === 'MYAS') {
                    query = query.replace('{문의내용}',"'' AS 문의내용");
                    where = ' AND 서비스상태 IN (' + params.status + ') ';
                    where += ' AND ISNULL(처리자ID,0) = ' + params.user;
                    orderby = ' 응급여부 DESC, CONVERT(char(10),접수일자,120) DESC ';
                } else if (params.type === 'HISTORY') {
                    query = query.replace('{문의내용}',"'' AS 문의내용");
                    where = " And ( ";
                    where += "        접수자 like '%" + params.search + "%' Or ";
                    where += "        확인자 like '%" + params.search + "%' Or ";
                    where += "        처리자 like '%" + params.search + "%' Or ";
                    where += "        문의내용 like '%" + params.search + "%' )  ";
                    // where += "        인덱스 In ( Select AS인덱스 From N_ServiceReply Where 처리내용 like '%"+params.search+"%'))";
                    orderby = " 접수일자 DESC ";
                } else if (params.type === 'DATAVIEW') {

                    //where = " AND CONVERT(char(10), 접수일자, 120) Between '" + params.startDate + "' AND '" + params.endDate + "' ";
                  where = " AND (접수일자 >= '" + params.startDate + "' AND 접수일자 <= '" + params.endDate + "') ";
                    if (params.area) {
                        where += " AND 지사코드 = '" + params.area + "' ";
                    }

                    orderby = " 접수일자 DESC, 서비스상태";

                } else {
                    query = query.replace('{문의내용}',"'' AS 문의내용");
                    switch (params.status) {
                        case ASSTATUS.ACCEPT:
                            where = " AND ( CONVERT(char(10), 접수일자, 120) = '" + params.date + "' OR 서비스상태 = " + ASSTATUS.ACCEPT + ") ";
                            where += " AND 서비스상태 = " + ASSTATUS.ACCEPT;
                            orderby = " 접수일자 DESC ";
                            break;
                        case ASSTATUS.CANCEL:
                            where = " AND 서비스상태 = " + ASSTATUS.CANCEL;
                            orderby = " 접수일자 DESC ";
                            break;
                        default:
                            where = " AND 서비스상태 NOT IN (" + ASSTATUS.ACCEPT + "," + ASSTATUS.DONE + "," + ASSTATUS.CANCEL + ")";
                            orderby = " 접수일자 DESC ";
                    }

                    var area = "";
                    if (!params.user_area) area = req.session.user.user_area;
                    else area = params.user_area;
                    if (area.trim() === '0000' || area.trim() === '0030') area = "'0000','0030'";
                    if (!params.area) {
                        where += " And 지사코드 IN (" + area + ")";
                    }
                    area = null;
                }

                if (params.type !== "HISTORY") {
                    if (params.search !== "") {
                        where += " And ( ";
                        where += "        기관코드 like '%" + params.search + "%' Or ";
                        where += "        기관명칭 like '%" + params.search + "%' Or ";
                        where += "        CONVERT(char(18), 접수일자, 21) like '%" + params.search + "%' Or ";
                        where += "        접수자 like '%" + params.search + "%' ) ";
                    }
                }
                query = util.format(query, where, orderby);
                logger.info(query);
                console.log(query);
                return callback2();
            },
            function(callback2) {
                if (server16.connection.connected) {
                    server16.RecordSet(query, function(err, records) {
                        return callback2(err, records);
                    });
                }
            }
        ], function(err, records) {
            if (err) {
                logger.error(err);
                data.err = err;
                data.data = null;
            } else if (!records || records.length <= 0) {
                data.err = 'NODATA';
                data.data = null;
            } else {
                data.err = null;
                data.data = records;
            }

            return callback(data);
        });

    };

    exports.Cancel = function(req, callback) {
        logger.info('ACCEPT CANCEL=====================================');
        logger.info(req);
        query = querys16._UpdateAs;
        set = ", 취소사유 = '" + req.comment + "' ";
        query = util.format(query, req.status, set, req.id);
        logger.info(query);
        if (server16.connection.connected) {
            server16.execute(query, function(err, records) {
                if (err) {
                    logger.error(err);
                    data.err = err;
                    data.data = null;
                } else {
                    if (records.Status !== 200) {
                        data.err = records.Status;
                    } else {
                        data.err = null;
                    }
                    data.data = records;
                }
                return callback(data);
            });
        }
    };

    exports.UpdateAs = function(req, callback) {
        query = querys16._UpdateAs;

        set = "";
        set += ", 확인자 = '" + req.확인자 + "' ";
        set += ", 확인자ID = '" + req.확인자ID + "' ";
        set += ", 확인자지사 = '" + req.확인자지사 + "' ";
        set += ", 확인자연락처 = '" + req.확인자연락처 + "' ";
        if(req.확인일자.trim() === ''){
          set += ", 확인일자 = NULL ";
        }else{
          set += ", 확인일자 = '" + req.확인일자.trim() + "' ";
        }
        set += ", 인계자 = '" + req.인계자 + "' ";
        set += ", 인계자ID = '" + req.인계자ID + "' ";
        set += ", 인계자지사 = '" + req.인계자지사 + "' ";
        set += ", 인계자연락처 = '" + req.인계자연락처 + "' ";
        if(req.인계일자.trim() === ''){
          set += ", 인계일자 = NULL ";
        }else{
          set += ", 인계일자 = '" + req.인계일자.trim() + "' ";
        }
        set += ", 처리자 = '" + req.처리자 + "' ";
        set += ", 처리자ID = '" + req.처리자ID + "' ";
        set += ", 처리자지사 = '" + req.처리자지사 + "' ";
        set += ", 처리자연락처 = '" + req.처리자연락처 + "' ";
        if(req.처리일자.trim() === ''){
          set += ", 처리일자 = NULL ";
        }else{
          set += ", 처리일자 = '" + req.처리일자.trim() + "' ";
        }

        set += ", 응급여부 = " + req.응급여부 + " ";
        set += ", 문의내용 = '" + req.문의내용 + "' ";
        set += ", 실행메뉴 = '" + req.실행메뉴 + "' ";
        set += ", 세부화면 = '" + req.세부화면 + "' ";
        set += ", 본사AS = " + req.본사AS;

        query = util.format(query, req.서비스상태, set, req.인덱스);
        logger.info(query);
        if (server16.connection.connected) {
            server16.execute(query, function(err, records) {
                if (err) {
                    logger.error(err);
                    data.err = err;
                    data.data = null;
                } else {
                    if (records.Status !== 200) {
                        data.err = records.Status;
                    } else {
                        data.err = null;
                    }
                    data.data = records;
                }
                return callback(data);
            });
        }
    };

    exports.GetRank = function(q, req, callback) {
        var params = req.query;
        async.waterfall([
            function(callback2) {
                query = q;

                where = "";
                // if (parseInt(params.total) === 0) {
                if(params.month){
                    where += " AND LEFT(convert(varchar(10), 접수일자, 120),7) = '" + params.month + "'";
                }else if(params.day){
                    where += " AND convert(varchar(10), 접수일자, 120) = '" + params.day + "'";
                }
                // }

                // if (req.params.mode !== 'emr') {
                    query = util.format(query, where);
                // } else {
                //     query = util.format(query, where, where);
                // }
                if(req.params.mode === 'member'){
                    if(params.month){
                        query = query + ';' + query.replace('--','');
                    }
                }

                logger.info(query);
                console.log(query);
                return callback2();
            },
            function(callback2) {
                if (server16.connection.connected) {
                    server16.RecordSet(query, function(err, records) {
                        return callback2(err, records);
                    });
                }
            }
        ], function(err, records) {
            if (err) {
                logger.error(err);
                data.err = err;
                data.data = null;
            } else if (!records || records.length <= 0) {
                data.err = 'NODATA';
                data.data = null;
            } else {
                data.err = null;
                data.data = records;
            }
            data.query = query;
            return callback(data);
        });
    };

    exports.GetASHistory = function(req, callback) {
        var params = req.query;
        var temp = "";

        async.waterfall([
            function(callback2) {
                console.log(params);
                query = querys16._ASHistory;
                if (parseInt(params.mode) === 0) { // 직원용

                    if (params.index){
                      // if (params.index > 0) {
                        query = query.replace('{문의내용}', '문의내용');
                        where = ' AND 인덱스 = ' + params.index;
                        orderby = ' 인덱스 ASC ';
                      // }
                    }else{
                      query = query.replace('{문의내용}', '\'\' AS 문의내용');
                      where = " AND 서비스상태 IN (" + params.service_status.toString() + ')';
                      if (parseInt(params.view_mode) === 0) { // 내가 속한 지사 A/S
                          where += " AND 지사코드 = '" + params.view_mode_value + "' ";
                      } else if (parseInt(params.view_mode) === 1) { // 내가 처리한 A/S
                          temp = " AND ( 확인자ID = {ID} OR 인계자ID = {ID} OR 처리자ID = {ID} )"
                          temp = temp.replace(/{ID}/gi, params.view_mode_value);
                          where += temp;
                      }

                      where += " AND (CONVERT(char(10), 접수일자, 120) Between '" + params.startDate + "' AND '" + params.endDate + "') ";
                      //where += " AND (접수일자 >= '" + params.startDate + "' AND 접수일자 <= '" + params.endDate + "') ";

                      if (params.keyword !== '') {

                          where += " And ( ";
                          where += "        기관코드 like '%" + params.keyword + "%' Or ";
                          where += "        기관명칭 like '%" + params.keyword + "%' Or ";
                          where += "        CONVERT(char(18), 접수일자, 21) like '%" + params.keyword + "%' Or ";
                          where += "        접수자 like '%" + params.search + "%' Or ";
                          where += "        확인자 like '%" + params.search + "%' Or ";
                          where += "        처리자 like '%" + params.search + "%' Or ";
                          where += "        문의내용 like '%" + params.search + "%' ) ";

                      }

                      orderby = " 접수일자 DESC ";

                    }
                } else { //병원용

                }
                query = util.format(query, where, orderby);
                logger.info(query);
                return callback2();
            },
            function(callback2) {
                if (server16.connection.connected) {
                    server16.RecordSet(query, function(err, records) {
                        return callback2(err, records);
                    });
                }
            }
        ], function(err, records) {
            if (err) {
                logger.error(err);
                data.err = err;
                data.data = null;
            } else if (!records || records.length <= 0) {
                data.err = 'NODATA';
                data.data = null;
            } else {
                data.err = null;
                data.data = records;
            }
            data.query = query;
            return callback(data);
        });

    };

    function _GetHospInfo(hospnum, fieldname, callback) {
        var query = querys22._HospInfo;
        if (!fieldname) fieldname = " * ";
        query = util.format(query, fieldname, hospnum);
        console.log(query);

        async.waterfall([
            function(callback2) {
                if (server22.connection.connected) {
                    server22.RecordSet(query, function(err, records) {
                        if (records.length) {
                            if (fieldname) {
                                return callback2(records[0][fieldname]);
                            } else {
                                return callback2(records);
                            }
                        } else { return callback('0000'); }
                    });
                } else {
                    console.log('neoServer22 is disconnected');
                }
            }
        ], function(data) {
            return callback(data);
        });
    }

})();
