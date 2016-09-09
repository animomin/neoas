var express = require('express');
var session = require('express-session');
global.path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

global.rootPath = path.resolve(__dirname);
console.log(rootPath);
require('./bin/config');

var routes = require('./routes/index');
var users = require('./routes/users');
var clients = require('./routes/clients');
var as = require('./routes/as');

var app = express();
app.locals.pretty = true;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var javascripts = '/javascripts/', stylesheets = '/stylesheets/';
var nodemodules = '/node_modules/';
app.use(javascripts + 'jquery', express.static(path.join(__dirname, nodemodules + 'jquery/dist/')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/clients', clients);
app.use('/as', as);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

console.log(datetime.create().format('Y-m-d H:M:S'));

module.exports = app;
