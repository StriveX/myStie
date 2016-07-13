var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

/*************** Middlewares ***************/
var user = require('./lib/middleware/user');
var page = require('./lib/middleware/page');
var auth = require('./lib/middleware/auth');
/*************** Objects ***************/
var message = require('./lib/messages');
var post = require('./lib/post');
/*************** Routes ***************/
var register = require('./routes/register');
var login = require('./routes/login');
var blog = require('./routes/blogs');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: false,
                  saveUninitialized: false,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middle ware HERE!
app.use(user);
app.use(message);


app.get('/', function(req, res) {
    res.render('index');
});
app.get('/home', function(req, res) {
    res.render('home');
});

app.get('/home/blog/:page?', page(5, post.count), blog.list);
app.get('/home/blog/post/:id', blog.post);

app.get('/home/status', function(req, res) {
    res.render('about');
});
app.get('/home/projects', function(req, res) {
    res.render('projects');
});

app.get('/about', function(req, res) {
    res.render('about');
});
// app.get('/admin', function(req, res) {
//     res.render('about');
// });

app.get('/admin/blog/:id?', blog.form);
app.post('/admin/blog/:id?', blog.submit);



app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);


/****** BLOG Routings. ******/
app.get('/blog', auth.restrict, function(req, res) {res.render('public/blog');});
app.get('/blog/post/:id', blog.post);
app.get('/blog/:type/:page?/', page(5, post.count), blog.list);
app.get('/manage', auth.permission('onwer'), function(req, res) {
    res.render('public/manage');
});
app.post('/manage', auth.restrict, auth.permission('onwer'), blog.submit);
/****************************/


// ERROR HANDLERS
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req.originalUrl);
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

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
