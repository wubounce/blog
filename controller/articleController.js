/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-08-14 14:08:39
 * @version $Id$
 */
var UserModel = require('../model/users.js');
var config = require('../config.js');
var moment = require('moment');
var mditor = require('mditor');
module.exports = {
    addpage(req,res) {//展示添加文章页面
      if (!req.session.islogin) { // 证明是非法访问 这个文章添加页面的
        res.redirect('/login');
      } else {
        // 渲染文章添加页面
        res.render('./article/add', {
          islogin: req.session.islogin,
          user: req.session.user
        });
      }
    },
   addarticle(req,res){//添加文章
  	    var articleinfo = req.body               
  	    UserModel.addarticle(articleinfo,(err,results)=>{
          console.log(results)
  	    	if (err) return res.json({
	       	   err_code: 1,
	       	   msg: '发表文章失败，请稍后再试！'
	       	});
  	    	res.json({
  	    	    err_code: 0,
	        	  id: results.insertId
  	    	})
  	    })
    },
    articleinfo(req,res){//展示文章详情
  	    // 获取 URL 地址中的Id参数
        var id = req.query.id;  //  从URL地址栏中获取参数
        UserModel.getarticleDetails(id,(err,results)=>{        	
        	// 如果展示文章详情出错，直接跳转到首页	   
	        if (err || results.length !== 1) return res.redirect('/')
	        var articleInfo = results[0];
	        articleInfo.createTime = moment(articleInfo.createTime).format('YYYY-MM-DD HH:mm:ss');
	        // 将 文章内容从 markdown 语法 转换成 HTML 字符串
	        articleInfo.content = (new mditor.Parser()).parse(articleInfo.content);
	        res.render('./article/info', {
	          islogin: req.session.islogin,
	          user: req.session.user,
	          article: articleInfo // 把文章信息传递进去进行渲染
	        });
        }) 	
    },
    editpage(req,res){//展示编辑页面
    	var id = req.query.id
    	UserModel.getedit(id,(err,results)=>{
        	// 如果展示文章详情出错，直接跳转到首页	 
        	if (err || req.session.islogin !== true) return res.redirect('/')  
	        //if (err || results.length !== 1) return res.redirect('/')
	    	if (req.session.user.id !== results[0].authorId) {
	    		return res.redirect('/')  
	    	}
	        var articleInfo = results[0]; 
	        res.render('./article/edit', {
	          islogin: req.session.islogin,
	          user: req.session.user,
	          article: articleInfo // 把文章信息传递进去进行渲染
	        });
        }) 
    },
    doedit(req,res){
    	  var articleinfo = req.body;       
  	    UserModel.doedit(articleinfo,(err,results)=>{
  	    	if (err) return res.json({
	       	   err_code: 1,
	       	   msg: '编辑文章失败，请稍后再试！'
	       	});
  	    	res.json({
  	    	    err_code: 0
  	    	})
  	    })
    },
    search(req,res){//搜索
      var keyword = req.query.search;      
      UserModel.search(keyword,function(err,results){
        if (err) throw err;
        // res.render('index',{
        //   islogin: req.session.islogin,
        //       user: req.session.user,
        //       result:results
        // });       
      })
    }
};

