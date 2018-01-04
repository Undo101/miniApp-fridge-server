var express = require('express');
var cors = require('cors'); // CORS 跨域资源共享
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
const tools = require('./app_api/common/tools')
require('./app_api/models/db')

const routes = require('./app_api/routes/index')
// var options = {
//   key: fs.readFileSync(''),
//   cert: fs.readFileSync()
// }
// 引入路由文件
// var index = require('./routes/index');
// var users = require('./routes/users');

// 初始化一个express实例
var app = express();
app.use(cors());
// view engine setup

// require('./app_api/config/passport')(passport)
app.use(passport.initialize())
// 服务端只提供api

//设置视图文件夹为views, __dirname 为全局变量，存储当前这在执行的脚本所在的目录（这里也可以用"./views"
// app.set('views', path.join(__dirname, 'views'));
//设置视图渲染模板为 ejs
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 中间件添加
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置public 文件夹为存放静态文件的目录
app.use('static',express.static(path.join(__dirname, 'public')));

// response辅助类工具中间件
app.use(/\/api/, tools);

// 路由控制器
// app.use('/', index);
// app.use('/users', users);
app.use('/api/route', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.json({
    errormsg: err.status + 'Not found'
  });
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    console.log(err);
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
