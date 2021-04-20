const connection = require('../db');
const crypto = require("crypto");

/* 创建存储用户名密码的表 */
connection.query(
    `CREATE TABLE user(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        pass VARCHAR(255) NOT NULL,
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`,function(error, res){
        if (error) throw error;
        console.log('res', res)
    }
)
/* 创建存储用户列表的表 */
connection.query(
    `CREATE TABLE todo_tbl(
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        data VARCHAR(255),
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8`,function(error, res){
        if (error) throw error;
        console.log('res', res)
    }
)

/* 添加一个用户 用户名：lqp 密码：kkkkkkkk */
var password = crypto.createHmac("md5", "cyl54726gsbt$%^$#*&*@").update('kkkkkkkk').digest("hex");
connection.query(
    `INSERT INTO USER ( name, pass ) VALUES("lqp", "${password}")`,function(error, res){
        if (error) throw error;
        console.log('res', res)
    }
)

/* 添加用户名lqp的列表数据 */
connection.query(
    `INSERT INTO todo_tbl ( author, title, data ) VALUES("lqp", "好评", "哈哈哈哈哈哈哈")`,function(error, res){
        if (error) throw error;
        console.log('res', res)
    }
)

// connection.end();