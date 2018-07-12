var LocalStorage = require('node-localstorage').LocalStorage;
var sessionStorage = require('sessionstorage');
var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var router = express.Router();

localStorage = new LocalStorage('./scratch');

var register_msg = '';
var login_msg = '';

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//register 注册
router.get('/register', function(req, res) {
    if (register_msg === 'user already exist') {
        res.render("register", {
            msg: register_msg
        });
    } else if (register_msg === 'passwd not same') {
        res.render("register", {
            msg: register_msg
        });
    } else {
        register_msg = 'welcome register!';
        res.render("register", {
            msg: register_msg
        });
    }

})

//login登陆
router.get('/', function(req, res) {
    if (login_msg === '') {
        login_msg = 'welcome login'
        res.render("login", {
            msg: login_msg
        });
    } else {
        login_msg = 'welcome login'
        res.render("login", {
            msg: login_msg
        });
    }
})
router.get('/login', function(req, res) {
    if (login_msg === 'register success') {
        res.render("login", {
            msg: login_msg
        });
    } else if (login_msg === 'have no this user') {
        res.render("login", {
            msg: login_msg
        });
    } else if (login_msg === 'password not right') {
        res.render("login", {
            msg: login_msg
        });
    } else {
        login_msg = 'welcome login'
        res.render("login", {
            msg: login_msg
        });
    }

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
            login_msg = 'have no this user'
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
            login_msg = 'password not right';
            res.redirect('/login');
            console.log('password not right');
        }
    } else { //无用户库 注册
        register_msg = '';
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
                register_msg = 'user already exist';
                console.log('user already exist');
            } else { //用户不存在 创建
                let user = {
                    name: name,
                    passwd: passwd1
                };
                dirAcc.push(user);
                localStorage.setItem('users', JSON.stringify(dirAcc));
                login_msg = 'register success';
                res.redirect('/login');
                console.log(name + ' register success');
            }
        } else { //无用户文件
            let user = [{
                name: name,
                passwd: passwd1
            }]
            localStorage.setItem('users', JSON.stringify(user));
            login_msg = 'register success';
            res.redirect('/login');
            console.log(name + ' register success');
        }
    } else {
        register_msg = 'passwd not same';
        res.redirect('/register');
        console.log('passwd not same');
    }
})
module.exports = router;