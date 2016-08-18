var winston = require('winston');
require('winston-daily-rotate-file');

if(!require('fs').existsSync('../log')){
  require('fs').mkdirSync('../log');
}

var logOpts = {filename: '../log/neoas.debug.log', json: false};
var exceptOpts = {filename: '../log/neoas.exceptions.log', json: false};

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
