var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.1',
    user: 'root',
    password: 'root',
    database: 'mytest'
});
module.exports = connection;