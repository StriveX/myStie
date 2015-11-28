var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

/***** Middle ware *****/
var user = require('./lib/middleware/user');
var page = require('./lib/middleware/page');
var auth = require('./lib/middleware/auth');

var message = require('./lib/messages');
var entry = require('./lib/entry');
var post = require('./lib/blog/post');

var register = require('./routes/register');
var login = require('./routes/login');
var entries = require('./routes/entries');
var collection = require('./routes/collections');

var blog = require('./routes/blogs');

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

// middle ware HERE!
app.use(user);
app.use(message);

app.get('/', function(req, res) {
  //res.sendFile(path.join(__dirname, 'public/idea'));
  res.render('index', { title: 'Home' });
});

// app.get('/dataloop', page(entry.count, 5), entries.list);
app.get('/dataloop/', entries.list);
app.post('/dataloop/', entries.submit);

app.get('/dataloop/register', register.form);
app.post('/dataloop/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/dataloop/idea', function(req, res) {
  res.render('idea', { title: 'Idea' });
  //res.sendFile(path.join(__dirname, '/public', 'idea.html'));
});

app.get('/dataloop/:name', collection.form);
app.post('/dataloop/:name', collection.submit);
app.delete('/dataloop/:name', collection.remove);


/****** BLOG Routings. ******/
app.get('/blog', auth.restrict, function(req, res) {res.render('public/blog');});
app.get('/blog/:type/:page?/:perpage?', page(post.count), blog.list);
app.get('/manage', auth.permission('onwer'), page(post.count), blog.list);
app.post('/manage', auth.permission('onwer'), function(req, res) {res.render('manage');});
/****************************/


// ERROR HANDLERS
// catch 404 and forward to error handler
app.use(function(req, res, next) {

  res.render('invalid', {
    title: 'Not Found',
    message: 'This page does not exist.'
  });

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
