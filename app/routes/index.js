const express = require('express');
const crypto = require("crypto");
var cookie = require('cookie');
const jwt = require("jsonwebtoken");
const xss = require('xss')

const connection = require('../db');

const secret = 'token';

let router = express.Router();

function isLogin(req, res, next) {
    //检测cookie上面使用username属性 如果有 那么证明登录成功过 否正跳到登录页面
    const {
        username
    } = req.cookies;
    // console.log("加密cookies", cookie.parse(req.headers.cookie))
    if (username) { 
        next();
    } else {
        res.redirect("/login");
    }
}

router.get('/login', function (req, res) {
    res.render("login");
});

router.get('/home', isLogin, function (req, res) {
    res.render("home")
});

router.get("/", isLogin, function (req, res) {
    res.redirect("login")
})

router.post("/login", function (req, res) {
    let {
        username,
        password
    } = req.body;
    password = crypto.createHmac("md5", "cyl54726gsbt$%^$#*&*@").update(password).digest("hex");
    let sql = `
    SELECT *
    FROM user
    WHERE name = '${username}' AND pass = '${password}'`
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results && results.length) {
            var expTime = 60 * 20; //过期时间20分钟
            const token = jwt.sign({
                "id": results[0].id
            }, secret, {
                expiresIn: expTime
            });

            res.cookie('username', username, {
                maxAge: 1 * 86400 * 1000,
                httpOnly: true,
                // sameSite: 'None',
                // secure : true,    //只有https才可以用
                // signed: true,
                // domain:'localhost',
                // path:'/'
            });
            res.status(200).json({
                message: '请求成功',
                data: token
            })
            // res.redirect("/home");
            res.end();
        } else {
            res.render("error");
        }
    });

})


router.get('/xss', isLogin, async (req, res) => {
    let sql = `select * from todo_tbl WHERE author = 'lqp'`
    const {
        query
    } = req;
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results) {
            res.render('xss', {
                from: results[0].title,
                username: results[0].author,
                text: query.text || results[0].data,
                // text: xss(results[0].data),
            })
        } else {
            res.render("error");
        }
    });
});


module.exports = router;