/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-13 11:25:10
 * @version $Id$
 */

var express = require('express');
// 创建一个路由对象
var router = express.Router();

var userController = require('../controller/userController.js');
var articleController = require('../controller/articleController.js');


router.get('/',userController.showindex)
	.get('/login',userController.showlogin)
	.get('/register',userController.showregister)
	.post('/register.do',userController.doregister)
	.post('/login.do',userController.dologin)
	.get('/logout',userController.logout)
	.get('/article/add',articleController.addpage)//展示添加文章页面
	.post('/addarticle',articleController.addarticle)//添加文章
	.get('/article/info',articleController.articleinfo)//展示文章详情页面
	.get('/article/edit',articleController.editpage)//展示编辑页面
	.post('/article/doedit',articleController.doedit)
	.get('/search',articleController.search)


module.exports = router;
