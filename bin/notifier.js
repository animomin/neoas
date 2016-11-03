var request = require('request');
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var uuid = '4e5540984d63a374';
var secret_key = 'M4scl7JziW';

var testPush = {
  uuid : 'C3DD8E20-C90E-4E6F-8851-B737D8ED1E8A',
  secret_key  : 'vqfxwd34Yb'
};

exports.sendPush = function(type, area, summary, callback){
  var body = '';
  var _summary = '';
  switch (type) {
    case 'JOIN':

      body = '새로운 A/S 요청이 접수되었습니다.\n' + summary + '\nhttp://115.68.114.16:4183';
      break;
    case 'STATUS':

      _summary = summary['인덱스'];
      _summary += ' [' + (summary['서비스타입'] == 1 ? '장애' : (summary['서비스타입'] == 2 ? '사용법' : '선택없음')) + '] ';
      _summary += summary['기관명칭'];


      switch (parseInt(summary['서비스상태'])) {
        case global.ASSTATUS.TAKEOVER:
          body = 'A/S 요청건이 인계접수되었습니다.\n';
          _summary += '\n 인계자 : ' + summary['인계자'];
          _summary += '\n 연락처 : ' + summary['인계자연락처'];
          break;
        case global.ASSTATUS.DONE:
          body = 'A/S 요청건이 처리완료되었습니다.\n';
          _summary += '\n 처리자 : ' + summary['처리자'];
          _summary += '\n 연락처 : ' + summary['처리자연락처'];
        default:

      }

      body += _summary + '\nhttp://115.68.114.16:4183';
      break;
    default:
  }

  if(area === '0030') area = '0000';
  if(area === '0034') area = '0023';
  if(area === '0035') area = '0028';
  if(area === '0036') area = '0025';
  if(area === '0037') area = '0033';

  // if(global.debugMode){
    body = '지사코드 : ' + area + '\n' + body;
  // }

  // Configure the request
  var options = {
      url: 'http://push.doday.net/api/push',
      method: 'POST',
      headers: headers,
      form: {
        'uuid' : global.debugMode ? testPush.uuid : uuid,
        'secret_key' : global.debugMode ? testPush.secret_key : secret_key,
        'code' : global.debugMode ? 'neotest0000' : typeof summary === 'undefined' ? 'neotest0000' : 'neosoftbank' + area,
        'body' : body
      }
  };

  // Start the request
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          console.log(body)
          console.log(options);
          callback();
      }
  })
}
