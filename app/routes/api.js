const express = require('express');
const URL = require('url');
const connection = require('../db');
const getAES = require('../password')

let router = express.Router();

router.get('/getDataList', function (req, res) {
    const {
        cookies,
        name,
        headers,
        body
    } = req;
    // res.setHeader("Content-Type", 'text/palin;charset=utf-8');
    if (cookies.username) {
        let sql = `
        select * from todo_tbl WHERE author = '${cookies.username}'`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            if (results) {
                // res.json(200,{message:'请求成功'})
                res.status(200).json({
                    message: '请求成功',
                    data: results,
                })
            } else {
                res.render("error");
            }
        });

    } else {
        res.json(401, {
            message: '未登录'
        })
    }
})
router.post('/setDataList', function (req, res) {
    let {
        cookies,
        body,
        headers: {
            referer,
            times,
            nonce,
            token
        },
    } = req;
    var p = URL.parse(referer);
    // console.log('哈哈哈哈', p)
    /* 校验referer */
    // if(p.href !== 'http://localhost:4000/home') throw '校验referer-非法请求'
    /* 校验nonce */
    // const bol = getAES(token, times) === nonce;
    // if (!bol) throw '校验nonce-非法请求'

    /* 不做任何校验 */
    let sql = `
        UPDATE todo_tbl SET data='${body.value}' WHERE author = '${cookies.username}'`
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results) {
            res.status(200).json({
                message: '请求成功',
            })
        } else {
            res.render("error");
        }
    });

})

module.exports = router;