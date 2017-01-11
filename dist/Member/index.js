(function () {
  "use strict";

  var query = "";
  var data = {};
  global.neoMembers = null;

  exports.SetNeoMembers = function () {
    query = querys22._NeoMembers;
    if (server22.connection.connected) {
      server22.RecordSet(query, function (err, records) {
        if (err) { return logger.error("Member SetNeoMembers FAILED ::: ", err.stack); }
        neoMembers = records;
        return exports.ConvertArea();
      });
    }
  };

  exports.ConvertArea = function () {
    if (!neoMembers) return false;

    neoMembers.forEach(function (item) {
      item.use_areaName = area[item.user_area];
    });

  };

  exports.login = function (req, callback) {
    var id = req.query.id;
    var pwd = req.query.pwd;
    query = util.format(querys22.UserInfo, id, pwd);
    logger.info('Member login :: ' + JSON.stringify(req.query));
    logger.info('Query :: ' + query);
    
    if (server22.connection.connected) {
      server22.RecordSet(query, function (err, records) {
        if (err) {
          data.err = err;
          data.data = null;
        } else if (!records || records.length <= 0) {
          data.err = 'NODATA';
          data.data = null;
        } else {
          data.err = null;
          data.data = records;
        }
        if (typeof callback === 'function') return callback(data);
        else return data;
      });
    }
  };

  exports.GetHospitalList = function (req, _callback) {
    var params = req.query;
    query = querys22._HospitalList;

    async.waterfall([
      function (callback) {
        var select = 'H.USER_ID, H.user_med_id AS 기관코드, H.user_med_name AS 기관명칭, ';
        select += "ISNULL(C.코드이름,'미정') AS 프로그램, ISNULL(I.info_president, '') AS 대표자, C.데이터1, I.INFO_AREA AS 지사코드 ";

        var where = "";
        if (params.area !== '') {
          if (params.area == '0000') {
            where += " AND I.INFO_AREA IN ('0000', '0008','0026','0029','0030')";
          } else if (params.area.match(/0023|0034/gim)) {
            where += " AND I.INFO_AREA IN ('0023', '0034')";
          } else if (params.area.match(/0028|0035/gim)) {
            where += " AND I.INFO_AREA IN ('0028', '0035')";
          } else if (params.area.match(/0025|0036/gim)) {
            where += " AND I.INFO_AREA IN ('0025', '0036')";
          } else if (params.area.match(/0033|0037/gim)) {
            where += " AND I.INFO_AREA IN ('0033', '0037')";
          } else {
            where += " AND I.INFO_AREA = '" + params.area + "'";
          }

        }

        if (params.manager) {
          where += " AND H.user_담당자 =  " + params.manager;
        }

        if (params.search !== '') where += " AND ( H.user_med_id like '%" + params.search + "%' OR H.user_med_name like '%" + params.search + "%')";
        where += " AND C.데이터1 <> 18 ";
        var sort = " LEN(C.데이터1), C.데이터1 ";

        query = util.format(query, select, where, sort);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server22.connection.connected) {
          server22.RecordSet(query, function (err, records) {
            return callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });

  };

  exports.GetHospitalInfo = function (req, _callback) {
    var params = req.query;

    async.waterfall([
      function (callback) {
        query = querys22._HospitalInfo;
        query = util.format(query, params.id, params.id);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server22.connection.connected) {
          server22.RecordSet(query, function (err, records) {
            console.log(records);
            if (records[1].length > 0) {
              var extra = '';
              for (var i = 0; i < records[1].length; i++) {
                extra += records[1][i]["부가서비스"];
                if (i < records[1].length) {
                  extra += ",";
                }
              }
              records[0][0]["부가서비스"] = extra;
            } else {
              records[0][0]["부가서비스"] = "";
            }
            callback(err, records[0]);
          });
        }
      },
      function (info, callback) {
        query = querys16._HospitalManageInfo;
        query = util.format(query, params.id);
        callback(null, info);
      },
      function (info, callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, info, records);
          });
        }
      }
    ], function (err, info, uniq) {
      if (err) {
        logger.error(err);
        data.err = err;
        data.data = null;
      } else if (!info || info.length <= 0) {
        data.err = 'NODATA';
        data.data = null;
      } else {
        data.err = null;

        if (uniq && uniq.length > 0) {
          for (var key in uniq[0]) {
            info[0][key] = uniq[0][key];
          }
        }

        data.data = info;
      }
      _callback(data);
    });
  };

  exports.SaveHospitalHistory = function (req, _callback) {
    var params = req.body;
    console.log(params);
    async.waterfall([
      function (callback) {
        if (!params.key) {
          query = querys16._HospitalManageHistory_SAVE;
          query = util.format(query,
            params.USER_ID,
            params["기관코드"],
            params["기관명칭"],
            params["프로그램"],
            params["지사코드"],
            params.type, params.contents, params.writer, params.workdate);
        } else {
          query = querys16._HospitalManageHistory_UPDATE;
          query = util.format(query,
            params.contents,
            params.type,
            params.workdate,
            params.key);
        }
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.RemoveHospitalHistory = function (req, _callback) {
    var params = req.body;
    async.waterfall([
      function (callback) {

        query = querys16._HospitalManageHistory_DELETE;
        query = util.format(query, params.key);

        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.SaveHospitalInfo = function (req, _callback) {
    var params = req.body;
    query = querys16._HospitalManageInfo_SAVE;

    async.waterfall([
      function (callback) {
        params.type = params.type || 1;
        var values = params.USER_ID + ",'" +
          params.hospnum + "'," +
          params.type + ",'" +
          params.computation + "','" +
          params.payer + "','" +
          // params.extra + "','" + 
          params.memo + "','" +
          params.writedate + "'," +
          params.writer;
        query = util.format(query, params.USER_ID, params.USER_ID, values);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });

  };

  exports.GetHospitalHistoryList = function (req, _callback) {
    var params = req.query;
    async.waterfall([
      function (callback) {

        var where1 = '', where2 = '';
        query = querys16._HospitalManageHistory;

        if (params.id) {
          where1 = " AND USER_ID = " + params.id;
          where2 = " AND 기관코드 = '" + params["기관코드"] + "' ";
        }
        where1 += " AND CONVERT(char(10),작성일자 ,120) Between '" + params.start + "' AND '" + params.end + "' ";
        where2 += " AND CONVERT(char(10),접수일자 ,120) Between '" + params.start + "' AND '" + params.end + "' ";
        if (params["지사코드"] !== '') {

          if (params['지사코드'] == '0000') {
            where1 += " AND 지사코드 IN ('0000', '0008','0026','0029','0030') ";
            where2 += " AND 지사코드 IN ('0000', '0008','0026','0029','0030') ";
          } else {
            where1 += " AND 지사코드 ='" + params["지사코드"] + "' ";
            where2 += " AND 지사코드 ='" + params["지사코드"] + "' ";
          }
        }

        if (params.keyword && params.keyword !== '') {
          if (params.writer) {
            where1 += " AND 작성자 = " + params.keyword;
            where2 += " AND 처리자ID = " + params.keyword;
          } else {
            var findUser = neoMembers.filter(function (_item) {
              return _item.USER_NAME.match(params.keyword);
            });

            where1 += " AND ( 기관코드 like '%" + params.keyword + "%' ";
            where1 += "    OR 기관명칭 like '%" + params.keyword + "%' ";
            if (findUser.length) {
              var userids;
              if (findUser.length > 1) {
                userids = findUser.map(function (_m) { return _m.USER_ID; });
                userids = userids.join(',');
                where1 += "    OR 작성자 IN (" + userids + ") ";
              } else {
                where1 += "    OR 작성자 = " + findUser[0].USER_ID + " ";
              }
            }
            where1 += "    OR 작성일자 like '%" + params.keyword + "%' ";
            where1 += "    OR 처리일자 like '%" + params.keyword + "%' ";
            where1 += "    OR 내용 like '%" + params.keyword + "%' )";

            where2 += " AND ( 기관코드 like '%" + params.keyword + "%' ";
            where2 += "    OR 기관명칭 like '%" + params.keyword + "%' ";
            where2 += "    OR 접수자 like '%" + params.keyword + "%' ";
            where2 += "    OR 접수일자 like '%" + params.keyword + "%' ";
            where2 += "    OR 처리자 like '%" + params.keyword + "%' ";
            where2 += "    OR 문의내용 like '%" + params.keyword + "%' )";
          }
        }

        query = query.replace(/{{일지조건}}/gim, where1);
        query = query.replace(/{{AS조건}}/gim, where2);


        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.GethospitalHistoryWriters = function (req, _callback) {
    var params = req.query;
    async.waterfall([
      function (callback) {

        var where1 = '', where2 = '';
        query = querys16._HospitalManageHistoryWriters;

        if (params.id) {
          where1 = " AND USER_ID = " + params.id;
          where2 = " AND 기관코드 = '" + params["기관코드"] + "' ";
        }
        where1 += " AND CONVERT(char(10),작성일자 ,120) Between '" + params.start + "' AND '" + params.end + "' ";
        where2 += " AND CONVERT(char(10),접수일자 ,120) Between '" + params.start + "' AND '" + params.end + "' ";
        if (params["지사코드"] !== '') {

          if (params['지사코드'] == '0000') {
            where1 += " AND 지사코드 IN ('0000', '0008','0026','0029','0030') ";
            where2 += " AND 지사코드 IN ('0000', '0008','0026','0029','0030') ";
          } else {
            where1 += " AND 지사코드 ='" + params["지사코드"] + "' ";
            where2 += " AND 지사코드 ='" + params["지사코드"] + "' ";
          }
        }

        query = query.replace(/{{일지조건}}/gim, where1);
        query = query.replace(/{{AS조건}}/gim, where2);


        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.GetHospitalVisitStatus = function (req, _callback) {
    var params = req.query;
    async.waterfall([
      function (callback) {
        query = querys16._HospitalVisitStatus;
        query = query.replace(/{{작성자}}/gim, params.keyword);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            console.log(err, records);
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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

      _callback(data);
    });
  };

  exports.GetHospitalHistoryDetail = function (req, _callback) {
    var params = req.query;
    async.waterfall([
      function (callback) {

        if (params.as === 'true') {
          query = querys16._HospitalManageHistoryDetail_AS;
        } else {
          query = querys16._HospitalManageHistoryDetail;
        }

        query = query.replace('{{KEY}}', params.key);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.GetTodayWorkList = function (req, _callback) {
    var params = req.query;
    var where = ['', ''];
    async.waterfall([
      function (callback) {
        query = querys16._TodayWorkList;
        where[0] = " AND 작성자 = " + params.user;
        where[0] += " AND CONVERT(CHAR(10),처리일자,120) = '" + params.date + "' ";
        where[1] = " AND 처리자ID = " + params.user;
        where[1] += " AND CONVERT(CHAR(10),처리일자,120) = '" + params.date + "' ";

        query = util.format(query, where[0], where[0], where[1]);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.GetDailyReportsList = function (req, _callback) {
    var params = req.query;
    var where = ['', '', '', ''];
    async.waterfall([
      function (callback) {
        query = querys16._DailyReportsList;
        query = query.replace(/{{보고일자}}/gim, params.report_date);
        query = query.replace('{{작성자}}', params.report_user);


        if (params.report_writer) {
          where[0] = " AND M.작성자 = " + params.report_writer;
        }

        if (params.report_position) {
          where[0] = " AND M.부서 = " + params.report_position;
        }
        query = query.replace(/{{보고서조건}}/gim, where[0]);

        // if(params.report_keyword && params.report_keyword !== ''){
        //   where[0] = " AND CONTAINS(기타업무, '" + params.report_keyword + "')";
        //   where[1] = " AND CONTAINS(내용, '" + params.report_keyword + "')";
        //   where[2] = " AND CONTAINS(내용, '" + params.report_keyword + "')";
        //   where[3] = " AND CONTAINS(문의내용, '" + params.report_keyword + "')";            
        // }
        query = util.format(query, where[1], where[2], where[3]);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.SaveDailyReport = function (req, _callback) {
    var params = req.body;
    query = querys16._SaveDailyReport;

    async.waterfall([
      function (callback) {
        query = query.replace('{{기타업무}}', params.memo);
        query = query.replace('{{작성자}}', params.writer);
        query = query.replace('{{작성일자}}', params.write_date);
        query = query.replace('{{보고일자}}', params.report_date);
        query = query.replace('{{부서}}', params.position_kind);
        query = query.replace('{{부서명}}', params.position_name);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }

    ], function (err, records) {
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
      _callback(data);
    });

  };

  exports.EditDailyReport = function (req, _callback) {
    var params = req.body;
    query = querys16._EditDailyReport;

    async.waterfall([
      function (callback) {
        query = query.replace('{{인덱스}}', params.report_index);
        query = query.replace('{{기타업무}}', params.memo);
        query = query.replace('{{작성자}}', params.writer);
        query = query.replace('{{작성일자}}', params.write_date);
        query = query.replace('{{보고일자}}', params.report_date);
        query = query.replace('{{부서}}', params.position_kind);
        query = query.replace('{{부서명}}', params.position_name);
        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }

    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.DeleteDailyReport = function (req, _callback) {
    var params = req.body;
    async.waterfall([
      function (callback) {

        query = querys16._DailyReportDelete;
        query = util.format(query, params.report_id);

        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.GetNewProjectID = function (_callback) {
    async.waterfall([
      function (callback) {
        query = querys16._ProjectID;
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };
  exports.GetProjectList = function (req, _callback) {
    var params = req.query;

    async.waterfall([
      function (callback) {
        query = querys16._ProjectList;
        if (!params.program && !params.keyword) {
          query = query.replace('{{검색조건}}', '');
        } else {

        }

        console.log(query);
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.RecordSet(query, function (err, records) {
            callback(err, records);
          });
        }
      }
    ], function (err, records) {
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
      _callback(data);
    });
  };

  exports.SaveNewProject = function(req, _callback){
    var params = req.body;
    query = querys16._SaveNewProject;

    async.waterfall([
      function (callback) {
        query = query.replace(/{{프로젝트ID}}/gim, params['project-id']);
        query = query.replace(/{{프로젝트명}}/gim, params['project-name']);
        query = query.replace(/{{프로그램}}/gim, params['project-program']);
        query = query.replace(/{{요청거래처}}/gim, params['project-clients']);
        query = query.replace(/{{상세내용}}/gim, params['project-detail']);
        query = query.replace(/{{기대효과}}/gim, params['project-effect']);
        query = query.replace(/{{등록자}}/gim, params['project-writer']);
        
        var uploadFiles = typeof params['project-uploaded-file'] === 'object' ? params['project-uploaded-file'] : [params['project-uploaded-file']];
        var values = '';
        uploadFiles.forEach(function(file){
          if(values !== '') values += ',';
          values += "('" + params['project-id'] + "','" + file + "')";
        });
        
        query = query.replace('{{첨부파일}}', values);
        
        
        callback(null);
      },
      function (callback) {
        if (server16.connection.connected) {
          server16.execute(query, function (err, records) {
            return callback(err, records);
          });
        }
      }

    ], function (err, records) {
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
      _callback(data);
    });

  };
})();
