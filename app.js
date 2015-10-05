var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var message = require('./lib/messages');

var user = require('./lib/middleware/user');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');

var register = require('./routes/register');
var login = require('./routes/login');
var entries = require('./routes/entries');
var collection = require('./routes/collections');

var app = express();

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: false,
                  saveUninitialized: false,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(user);
app.use(message);

app.get('/', function(req, res) {
  res.sendFile('/dataloop/index.html');
});
app.get('/dataloop/idea', function(req, res) {
  console.log("idea");
  res.render('idea', { title: 'Post' });
});


// app.get('/dataloop', page(Entry.count, 5), entries.list);
app.get('/dataloop/', entries.list);
app.post('/dataloop/', entries.submit);

app.get('/dataloop/register', register.form);
app.post('/dataloop/register', register.submit);

app.get('/dataloop/login', login.form);
app.post('/dataloop/login', login.submit);
app.get('/dataloop/logout', login.logout);

app.get('/dataloop/repository', entries.form);
//app.post('/dataloop/repository', entries.submit);

app.get('/dataloop/:name', collection.form);
app.post('/dataloop/:name', collection.submit);
app.delete('/dataloop/:name', collection.remove);

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
    console.log(err.message);
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
  console.log(err.message);
});

// http.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// })
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
