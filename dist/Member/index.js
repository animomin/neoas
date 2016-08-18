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

})();
