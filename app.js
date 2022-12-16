var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//set-1(require))
var hbs = require('express-handlebars');
var app = express();
var fileUpload = require('express-fileupload')
//set-2(require)
var db = require('./config/connection');
const { done } = require('express-hbs/lib/resolver');
//session
var session = require('express-session')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//set-1
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout', partialsDir: __dirname + '/views/partials/' }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//thing
app.use(fileUpload())
//session
app.use(session({ secret: "Key", cookie: { maxAge: 600000 } }))
//db connection
db.connect((err) => {
  if (err) console.log("Connection Error" + err);
  else console.log("Database Connected to port 27017")
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
