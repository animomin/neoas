var mssql = require('mssql'),
	fs = require('fs'),
	xml_digester = require('xml-digester'),
	digester = xml_digester.XmlDigester({}),
	dbString = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../', 'lib/server.json'), 'UTF-8')),
	connection = new mssql.Connection(dbString.server22_dev);

var xml = fs.readFileSync(path.join(__dirname, 'query.xml'), 'utf-8');
digester.digest(xml, function (err, result) {
	global.querys22 = result.query;
});

function Connect(callback) {
	connection.connect(function (err) {
		if (!err) {
			logger.info('Sever22 is connected');
		} else {
			logger.error('Server22 is disconnected ' + err);
		}
		if (typeof callback === 'function') callback(err);
	});
}

function ConnectToIntra(callback) {
	var rs = new mssql.Request(connection);
	rs.query("Select * From NS_Servers Where 인스턴스 = '" + dbString.server22_dev.server + "' ", function (err, recordset) {
	// rs.query("Select * From NS_Servers Where 인스턴스 = '211.238.39.148' ", function (err, recordset) {
		if (err) console.log(err);
		// console.log(recordset);
		var async = require('async');
		var request = require('ajax-request');

		recordset = recordset[0];
		async.parallel([
			function (cb) {
				request({
					url: 'http://www.neochart.co.kr/chiper/v2.asp',
					method: 'GET',
					data: { target: recordset['사용자'], encrypt: 0 }
				}, function (err, res, body) {
					recordset['사용자'] = body.trim();
					cb(null);
				});
			},
			function (cb) {
				request({
					url: 'http://www.neochart.co.kr/chiper/v2.asp',
					method: 'GET',
					data: { target: recordset['패스워드'], encrypt: 0 }
				}, function (err, res, body) {
					recordset['패스워드'] = body.trim();
					cb(null);
				});
			}
		], function () {			
			var config = {
				'user': recordset['사용자'],
				'password': recordset['패스워드'],
				'server': recordset['인스턴스'],
				'port': recordset['포트'],
				'database': 'NEO_COMPANY'
			};
			disConnect(function () {
				connection = new mssql.Connection(config);
				Connect(function(){
					if(err) console.log(err);
					callback();
				});
				// connection.connect(function(err){
				// 	if(err) console.log(err);
				// 	if(!err) callback();
				// });				
			});
		});
	});
}

function disConnect(callback) {
	connection.close();
	callback = callback || function () { };
	callback();
}

exports.RecordSet = function (query, callback) {
	var rs = new mssql.Request(connection);
	rs.multiple = query.split(';').length > 1;
	rs.query(query, function (err, recordset) {
		callback(err, recordset);
	});
};

exports.execute = function (query, callback) {
	var trans = new mssql.Transaction(connection);
	trans.begin(function (err) {
		if (err) {
			callback(err);
			return;
		}

		var rolledback = false;
		trans.on('rollback', function (aborted) {
			rolledback = true;
		});

		var rs = new mssql.Request(trans);
		rs.query(query, function (err, recordset) {
			if (err) {
				if (!rolledback) {
					trans.rollback(function (err) {
						logger.error("(neoServer22)query is rollbacked because of " + err);
					});
				}
				callback(err);
				return;
			}

			trans.commit(function (err) {
				if (err) {
					logger.error("(neoServer22)query is uncommited because of " + err);
					callback(err);
					return;
				}
				logger.info("(neoServer22)query is commited successfully");
				callback(null, recordset);
			});
		});

	});
};

exports.isConnected = function () {
	return connection.connected;
};

Connect(function () {
	ConnectToIntra(function () {
		// console.log(connection);
		console.log('Server 22 connected');
		// 22번 관리자 계정으로 로그인 후 다시 export
		exports.connection = connection;
		exports.connected = connection.connected;
		member.SetNeoMembers();
		area.SetNeoArea();
	});
});
exports.connection = connection;
exports.connected = connection.connected;
