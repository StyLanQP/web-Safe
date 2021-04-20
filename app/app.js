const fs = require('fs');
// const http = require('http');
const util = require('util');
const express = require('express');
//    文档：https://www.npmjs.com/package/jsonwebtoken
const jwt = require("jsonwebtoken");
//    http错误处理插件
const assert = require("http-assert");
// body-parser是一个HTTP请求体解析的中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const secret = 'token';

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").__express);

app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
})); //解析post参数

app.use(cookieParser());
// app.use(cookieParser('88888')); //加密

function checkLogin(req, res, next) {
    /* 使用token校验 */
    const {
        token
    } = req.headers;
    if (!token) {
        // res.status(402).json({
        //     message: '未登录',
        // })
        res.redirect('/login')
    }
    const verified = token && jwt.verify(token, secret, function (err, code) {
        if (err) {
            res.status(403).json({
                message: 'token失效',
            })
            // res.redirect('/login')
        } else {
            next()
        }
    });
    // next()
}

function checkCommon(req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    res.setHeader('X-XSS-Protection', 0);
    // res.setHeader('x-frame-options', 'DENY');
    res.setHeader('Cache-control', 'no-store');
    /* 允许加载自身网站资源和cdn资源 */
    // res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' cdn.bootcdn.net cdn.bootcss.com");
    next()
}
// app.all('/api/*', checkLogin)
app.use(checkCommon)

//添加路由到应用上
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// // //404判断
// app.use(function (req, res) {
//     res.send('404 not found');
// });



module.exports = app;