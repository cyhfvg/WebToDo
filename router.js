var LocalStorage = require('node-localstorage').LocalStorage;
var sessionStorage = require('sessionstorage');
var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var router = express.Router();

localStorage = new LocalStorage('./scratch');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//静态资源
router.use(express.static('assests'));


//register 注册
router.get('/register', function(req, res) {
    res.sendfile(__dirname + "/views/" + "register.html");
})

//login登陆
router.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/" + "login.html");
})
router.get('/login', function(req, res) {
    res.sendFile(__dirname + "/views/" + "login.html");
})

//注销
router.get('/logout', function(req, res) {
    sessionStorage.removeItem('userState');
    res.sendFile(__dirname + "/views/" + "login.html");
})

//index首页
router.get('/home', function(req, res) {
    const UserInfoState = sessionStorage.getItem('userState');
    if (UserInfoState) {
        res.sendFile(__dirname + "/views/" + "home.html");
        res.render('home', {
            name: JSON.parse(sessionStorage.getItem('userState')).name
        });
    } else {
        res.redirect('/login');
    }

})

//

//表单提交数据处理

//登陆
router.post('/login_post', urlencodedParser, function(req, res) {

    var name = req.body.name;
    var passwd = req.body.passwd;
    var dirAcc = JSON.parse(localStorage.getItem('users'));
    if (dirAcc) {
        let id = -1;
        for (let i = 0; i < dirAcc.length; i++) {
            if (dirAcc[i].name === name) {
                id = i;
            }
        }
        if (id === -1) { //无此用户
            res.redirect('/login');
            console.log('have no this user:' + name);
        } else if (passwd === dirAcc[id].passwd) { //密码正确 存储session
            const UserInfoNow = {
                name: name,
                passwd: passwd
            }
            sessionStorage.setItem('userState', JSON.stringify(UserInfoNow));
            res.redirect('/home');
            console.log(name + ' login success');
        } else {
            res.redirect('/login');
            console.log('password not right');
        }
    } else { //无用户库 注册
        res.redirect('/register');
        console.log('have no user,register');
    }
    res.end();
})

//注册
router.post('/register_post', urlencodedParser, function(req, res) {
    var name = req.body.name;
    var passwd1 = req.body.passwd1;
    var passwd2 = req.body.passwd2;
    var dirAcc = JSON.parse(localStorage.getItem('users'));

    if (passwd1 === passwd2) {
        if (dirAcc) { //有任何用户文件
            let existSate = false;
            for (let i = 0; i < dirAcc.length; i++) {
                if (dirAcc[i].name === name) {
                    existSate = true;
                }
            }
            if (existSate) { //用户存在
                res.redirect('/register');
                console.log('user already exist');
            } else { //用户不存在 创建
                let user = {
                    name: name,
                    passwd: passwd1
                };
                dirAcc.push(user);
                localStorage.setItem('users', JSON.stringify(dirAcc));
                res.redirect('/login');
                console.log(name + ' register success');
            }
        } else { //无用户文件
            let user = [{
                name: name,
                passwd: passwd1
            }]
            localStorage.setItem('users', JSON.stringify(user));
            res.redirect('/login');
            console.log(name + ' register success');
        }
    } else {
        res.redirect('/register');
        console.log('passwd not same');
    }
})
module.exports = router;