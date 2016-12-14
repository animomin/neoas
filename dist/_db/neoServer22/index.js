var mssql = require('mssql'),
    fs = require('fs'),
    xml_digester = require('xml-digester'),
    digester = xml_digester.XmlDigester({}),
    dbString = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../', 'lib/server.json'), 'UTF-8')),
    connection = new mssql.Connection(dbString.server22);

var xml = fs.readFileSync(path.join(__dirname, 'query.xml'),'utf-8');
    digester.digest(xml, function(err, result){
      global.querys22 = result.query;
    });

function Connect(callback){
  connection.connect(function(err){
    if(!err){
      logger.info('Sever22 is connected');
    }else{
      logger.error('Server22 is disconnected ' + err);
    }
    if(typeof callback === 'function') callback(err);
  });
}

function disConnect(){
  connection.close();
}

exports.RecordSet = function(query, callback){
    var rs = new mssql.Request(connection);
    rs.multiple = query.split(';').length > 1;
  	rs.query(query,function(err, recordset){
  		callback(err, recordset);
  	});
};

exports.execute = function(query, callback){
	var trans = new mssql.Transaction(connection);
	trans.begin(function(err){
		if(err){
			 callback(err);
			 return;
		}

		var rolledback = false;
		trans.on('rollback', function(aborted){
			rolledback = true;
		});

		var rs = new mssql.Request(trans);
		rs.query(query, function(err, recordset){
			if(err){
				if(!rolledback){
					trans.rollback(function(err){
            logger.error("(neoServer22)query is rollbacked because of " +  err);
					});
				}
				callback(err);
				return;
			}

			trans.commit(function(err){
				if(err){
          logger.error("(neoServer22)query is uncommited because of " + err);
					callback(err);
					return;
				}
        logger.info("(neoServer22)query is commited successfully");
				callback(null,recordset);
			});
		});

	});
};

exports.isConnected = function(){
  return connection.connected;
};

Connect(function(){
  member.SetNeoMembers();
	area.SetNeoArea();
});
exports.connection = connection;
exports.connected = connection.connected;
