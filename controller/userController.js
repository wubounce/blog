/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-13 11:42:25
 * @version $Id$
 */
 var UserModel = require('../model/users.js');
 // 导入 MD5 加密模块
const md5 = require('blueimp-md5');
var moment = require('moment');
var mditor = require("mditor");
var markdown = require( "markdown" ).markdown;
const config = require('../config.js');
// 加载 moment 的本地化语言
moment.locale('zh-cn');

module.exports={
	showindex(req, res) { // 展示用户注册页面
		// 获取用户管理下的用户列表，并渲染用户管理页面 
	    // 屏蔽一些非法的页码值
	    var page = parseInt(req.query.page);
	    if (page <= 0) {
	      page = 1;
	    }
	    //当前要显示的页码值
	    var currentPage = page || 1;
	    // 每页显示的记录条数
	    var pageSize = parseInt(req.query.pageSize) || 3;
	    // 根据页码值和每页的记录条数，获取分页数据
		UserModel.getAllarticle(currentPage, pageSize,(err, results) => {
		    if (err) throw  err; 
		    // 在渲染页面之前，先格式化时间
			results[0].forEach(item => { 
			    item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'); 		     
	            // 将 文章内容从 markdown 语法 转换成 HTML 字符串
		      	 item.content = markdown.toHTML(item.content)     
		    })		    
		    var totalCount = results[1][0].totalCount;
		    res.render('index',{
		    	islogin: req.session.islogin,
          		user: req.session.user,
		      	result:results[0],
		      	//category: results[2],
		      	totalCount: totalCount, // 获取总页数
		      	totalPage: Math.ceil(totalCount / pageSize), // 获取总页数
		      	currentPage: currentPage // 当前的页码值
		    });
	  	});    
	},
	showlogin(req, res) { // 展示用户注册页面
	    res.render('./user/login');
	},
	showregister(req, res) { // 展示用户注册页面
	    res.render('./user/register');
	},
	doregister(req,res){//用户登录
		//获取用户输入的信息
		//对比数据库是否存在这条数据
		//插入数据
		var newUser = req.body;
		UserModel.getUserByUsername(newUser.username,function(err,results){
			if (err) return res.json({
		   	   err_code: 1,
		   	   msg: '注册失败，请稍后再试！'
		   	});
			// 如果 results 的长度不等于0，表示用户已经存在！
		   	if (results.length !== 0) return res.json({
		   	   err_code: 1,
		   	   msg: '用户已存在'
		   	});
		   	// 如果能走到这里，表示此用户名可以用：
        	// 在将用户写入到数据库之前，先使用MD5模块进行一下密码加密
	        newUser.password = md5(newUser.password, config.pwdSalt);
	        // 将加盐加密后的用户信息，保存到数据库中
	        UserModel.addNewUser(newUser, (err, results) => {
	            if (err) throw err;	        
	            // 没有发生错误，直接返回注册成功
	            res.json({
	              err_code: 0,
	              msg:'注册成功'
	            });
	        }); 
		})
	},
	dologin(req,res){
		var userInfo = req.body;
		//如果密码填写正确，那么加密后的结果和数据库中保存的密码相等
  		userInfo.password = md5(userInfo.password, config.pwdSalt);  		
  		// 根据加密后 密码字符串， 去尝试登录
		UserModel.getUser(userInfo,function(err,results){
			if (err) return res.json({
		   	   err_code: 1,
		   	   msg: '登录失败，请稍后再试！'
		   	});
			 // 如果 results 的长度不等于1，表示用户登录失败！
		   	if (results.length !== 1) return res.json({
		   	   err_code: 1,
		   	   msg: '用户名或密码错误！'
		   	});
		   	// 登录成功：
		    // 在将登录结果返回给浏览器之间，需要先将登录 状态 和 登录用户信息保存到 session中
		    // console.log(req.session);
		    // 将登录成功的状态保存到 session 中
		    req.session.islogin = true;
		    // 将登录人的信息对象，保存到 session 中
		    req.session.user = results[0];
		    // 把登录的结果返回给客户端
		   	//如果以上反向判断都不满足。说明密码正确，跳转到首页
		   	res.json({
		   		err_code: 0,
		   		msg:"登录成功"
		   	});		
		})
	},
	logout(req,res){//注销登录
		req.session.destroy((err)=>{
			if(err) throw err;
			res.redirect('/login')
		})
	}	
}
