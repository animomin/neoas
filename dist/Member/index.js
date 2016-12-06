(function(){
    "use strict";

    var query = "";
    var data = {};
    global.neoMembers = null;

    exports.SetNeoMembers = function(){
      query = querys22._NeoMembers;
      if(server22.connection.connected){
        server22.RecordSet(query, function(err, records){
          if(err){ return logger.error("Member SetNeoMembers FAILED ::: ", err.stack);}
          neoMembers = records;
          return exports.ConvertArea();
        });
      }
    };

    exports.ConvertArea = function(){
      if(!neoMembers) return false;

      neoMembers.forEach(function(item){
        item.use_areaName = area[item.user_area];
      });

    };

    exports.login = function(req, callback){
      var id = req.query.id;
      var pwd = req.query.pwd;
      query = util.format(querys22.UserInfo, id, pwd);
      logger.info('Member login :: ' + JSON.stringify(req.query));
      logger.info('Query :: ' + query);

      if(server22.connection.connected){
        server22.RecordSet(query, function(err, records){
          if(err){
            data.err = err;
            data.data = null;
          }else if(!records || records.length <= 0){
            data.err = 'NODATA';
            data.data = null;
          }else{
            data.err = null;
            data.data = records;
          }
          if(typeof callback === 'function') return callback(data);
          else return data;
        });
      }
    };

    exports.GetHospitalList = function(req, _callback){
      var params = req.query;
      query = querys22._HospitalList;

      async.waterfall([
        function(callback){
          var select = 'H.USER_ID, H.user_med_id AS 기관코드, H.user_med_name AS 기관명칭, ';
          select += "ISNULL(C.코드이름,'미정') AS 프로그램, ISNULL(I.info_president, '') AS 대표자, C.데이터1 "

          var where = "";
          if(params.area !== '') where += " AND I.INFO_AREA = '" + params.area + "'";
          if(params.search !== '') where += " AND ( H.user_med_id like '%" + params.search + "%' OR H.user_med_name like '%" + params.search + "%')"
          where += " AND C.데이터1 <> 18 ";
          var sort = " C.데이터1 ";

          query = util.format(query, select, where, sort);
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server22.connection.connected) {
              server22.RecordSet(query, function(err, records) {
                  return callback(err, records);
              });
          }
        }
      ], function(err, records){
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

    }

    exports.GetHospitalInfo = function(req, _callback){
      var params = req.query;
      
      async.waterfall([
        function(callback){
          query = querys22._HospitalInfo;
          query = util.format(query, params.id, params.id);         
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server22.connection.connected) {
              server22.RecordSet(query, function(err, records) {        
                  
                  console.log(records[1][0]);
                  console.log(records[1].length);          
                  if(records[1].length > 0){
                    var extra = '';
                    for(var i = 0; i < records[1].length; i++){
                      extra += records[1][i]["부가서비스"];
                      if(i < records[1].length){
                        extra += ",";
                      }
                    } 
                    records[0][0]["부가서비스"] = extra;
                  }else{
                    records[0][0]["부가서비스"] = "";
                  }
                  callback(err, records[0]);
              });
          }
        },
        function(info,callback){
          query = querys16._HospitalManageInfo;
          query = util.format(query, params.id);
          callback(null, info);
        },
        function(info, callback){
          if (server16.connection.connected) {
              server16.RecordSet(query, function(err, records) {
                  callback(err, info, records);                  
              });
          }
        }
      ], function(err, info, uniq){        
        if (err) {
            logger.error(err);
            data.err = err;
            data.data = null;
        } else if (!info || info.length <= 0) {
            data.err = 'NODATA';
            data.data = null;
        } else {
            data.err = null;

            if(uniq && uniq.length > 0){
              for(var key in uniq[0]){ 
                info[0][key] = uniq[0][key]; 
              }
            }

            data.data = info;
        }
        _callback(data);
      });
    }

    exports.SaveHospitalHistory = function(req, _callback){
      var params = req.body;
      query = querys16._HospitalManageHistory_SAVE;
      async.waterfall([
        function(callback){

          query = util.format(query, 
                              params.USER_ID,
                              params["기관코드"],
                              params["기관명칭"],
                              params["프로그램"], 
                              params.type, params.contents, params.writer);
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server16.connection.connected) {
              server16.execute(query, function(err, records) {
                  return callback(err, records);
              });
          }
        }
      ], function(err, records){
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
    }

    exports.SaveHospitalInfo = function(req, _callback){
      var params = req.body;
      query = querys16._HospitalManageInfo_SAVE;

      async.waterfall([
        function(callback){
          params.type = params.type || 1; 
          var values = params.USER_ID + "," + 
                      params.type + ",'" +
                      params.computation + "','" + 
                      params.payer + "','" + 
                      // params.extra + "','" + 
                      params.memo + "'";
          query = util.format(query, params.USER_ID, params.USER_ID, values);
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server16.connection.connected) {
              server16.execute(query, function(err, records) {
                  return callback(err, records);
              });
          }
        }
      ], function(err, records){
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

    }

    exports.GetHospitalHistoryList = function(req, _callback){
      var params = req.query;
      async.waterfall([
        function(callback){

          var where1 = '', where2 = '';
          query = querys16._HospitalManageHistory

          if(params.id){
            where1 = " AND USER_ID = " + params.id;
            where2 = " AND 기관코드 = '" + params["기관코드"] + "' ";            
          }
          where1 += " AND 작성일자 Between '" + params.start + "' AND '" + params.end + "' ";
          where2 += " AND 접수일자 Between '" + params.start + "' AND '" + params.end + "' ";
          query = query.replace(/{{일지조건}}/gim, where1);
          query = query.replace(/{{AS조건}}/gim, where2);

          
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server16.connection.connected) {
              server16.RecordSet(query, function(err, records) {
                  callback(err, records);                  
              });
          }
        }
      ], function(err, records){
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

    exports.GetHospitalHistoryDetail = function(req, _callback){
      var params = req.query;
      async.waterfall([
        function(callback){
          
          if(params.as === 'true'){
            query = querys16._HospitalManageHistoryDetail_AS;
          }else{
            query = querys16._HospitalManageHistoryDetail;
          }          

          query = query.replace('{{KEY}}', params.key);
          console.log(query);
          callback(null);
        },
        function(callback){
          if (server16.connection.connected) {
              server16.RecordSet(query, function(err, records) {
                  callback(err, records);                  
              });
          }
        }
      ], function(err, records){
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
