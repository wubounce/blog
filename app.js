var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
// 导入 session 中间件
var session = require('express-session');
var app = express();


app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.use('/src',express.static('src'));
app.use(bodyParser.urlencoded({ extended: false }));

// 注册 Session 中间件
app.use(session({
  secret: '这是一个加密的盐',
  resave: false, // 强制session保存到session store中【session默认是在内存中的，其实也可以保存到数据库中】
  saveUninitialized: false // 强制没有“初始化”的session保存到storage中【创建了session但是并没有修改这个session，就叫做未初始化】
}));


// 导入 userRouter 模块
// var userRouter = require('./router/router.js');
// 注册路由
// app.use(userRouter);

// 由于将来会有很多的路由模块。所以，每次单独导入并注册路由，比较麻烦
// 解决方案：读取 router 文件夹下所有的文件路径，然后使用 forEach 自动循环注册路由
fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
  if (err) throw err;
  // 自动循环注册路由
  filenames.forEach(filename => {
    // 拼接每个路由模块的路径
    var routerPath = path.join(__dirname, './router', filename);
    // var m = require(routerPath);
    // app.use(m);
    app.use(require(routerPath));
  });
});



app.listen('3008',()=>{
    console.log('http://localhost:3008')
})