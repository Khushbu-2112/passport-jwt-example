var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
const passport = require('passport');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const expresslayouts = require('express-ejs-layouts');

var app = express();

require('dotenv').config();
require('./config/database');
require('./models/user');
require('./config/passport')(passport);
// This will initialize the passport object on every request
app.use(passport.initialize());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expresslayouts);
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
