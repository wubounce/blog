/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-14 11:23:00
 * @version $Id$
 */

var connection = require('../seting.js');

module.exports =  {
    getAllarticle(page, pageSize, callback) { // 根据页码去获取文章列表信息,降序 //获取文章分类和标题
      var offset = (page - 1) * pageSize; // (nowPage-1)*pageSize
      //var sqlStr = 'select article.*, users.nickname from article LEFT JOIN users on article.authorId=users.id ORDER BY article.createTime desc limit ?,?; select count(*) as totalCount from article;select g.category,g.id as pid,a.title,a.id from articlecategroy as g join article as a on g.id = a.categoryid';
      var sqlStr = 'select article.*, users.nickname from article LEFT JOIN users on article.authorId=users.id ORDER BY article.createTime desc limit ?,?; select count(*) as totalCount from article';

      connection.query(sqlStr, [offset, pageSize], callback);
    },
   	getUserByUsername(name, callback) { // 根据用户名，查询相关的用户信息
	    var sqlStr = 'select * from users where username=?';
	    connection.query(sqlStr, [name], callback);
  	},
  	addNewUser(user,callback){ //插入用户
  		var sqlStr = 'insert into users set ?';
  		connection.query(sqlStr,user,callback);
  	},
  	getUser(userinfor, callback) { // 根据用户名和密码去获取用户信息
	    var sqlStr = 'select * from users where username=? and password=?';
	    connection.query(sqlStr, [userinfor.username, userinfor.password], callback);
	  },
    addarticle(article,callback){
      var sqlStr = 'insert into article set ?';
      connection.query(sqlStr, article, callback)
    },
    getarticleDetails(id,callback){//查询文章信息
      var sqlStr = 'select article.*, users.nickname from article LEFT JOIN users on article.authorId=users.id where article.id=?';
      connection.query(sqlStr, [id] ,callback)
    },
    getedit(id,callback){
      var sqlStr = 'select article.*, users.nickname from article LEFT JOIN users on article.authorId=users.id where article.id=?';
      connection.query(sqlStr, [id] ,callback)
    },
    doedit(article,callback){
      var sqlStr = 'update article set ? where id=?';
      connection.query(sqlStr,[article,article.id], callback)
    },
    search(keyword,callback){       
       var sqlStr = 'select * from article where title or content like "%'+keyword+'%" ';      
       connection.query(sqlStr,callback)
    }
};
