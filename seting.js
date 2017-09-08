'use strict';
//mongodb版
/*module.exports = {
    appRootPath: __dirname,
    db_host: '127.0.0.1',
    db_port: '27017',
    db_database: 'crm'

}*/

var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'blog',
	multipleStatements: true // 开启执行多条Sql语句的功能
});
connection.connect();

module.exports = connection;