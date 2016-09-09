var winston = require('winston');
require('winston-daily-rotate-file');

if(!require('fs').existsSync(path.join(__dirname, '../../', 'log'))){
  require('fs').mkdirSync(path.join(__dirname, '../../', 'log'));
}

var logOpts = {filename: path.join(__dirname, '../../', 'log/neoas.debug.log'), json: false};
var exceptOpts = {filename: path.join(__dirname, '../../', 'log/neoas.exceptions.log'), json: false};

var logger = new (winston.Logger)({
  transports: [
    // new (winston.transports.Console)({ json: false, timestamp: true }),
    new (winston.transports.DailyRotateFile)(logOpts)
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: true, timestamp: true }),
    new (winston.transports.DailyRotateFile)(exceptOpts)
  ],
  exitOnError: false
});
//
// var logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)({ json: false, timestamp: true }),
//     new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
//   ],
//   exceptionHandlers: [
//     new (winston.transports.Console)({ json: false, timestamp: true }),
//     new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
//   ],
//   exitOnError: false
// });

module.exports = logger;
