var bodyParser = require('body-parser');
var express = require('express');
var router = require('./router');
var config = require('./config');
var ejs = require('ejs');
var path = require('path');
var app = express();


//静态资源
app.use(express.static('assests'));

//router调用路由
app.use('/', router);

//使用ejs转html模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

// app.post('/userData_post', function(req, res) {
//     let tableBackup = req.body.uploadData;
//     let user = req.body.user;
//     console.log(user)
// })

//服务器监听
var server = app.listen(config.port, function() {

    console.log("应用实例，访问地址为" + config.port);

})