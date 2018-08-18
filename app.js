var express = require('express');//加载（引入）express模块
var app = express();//启动Web服务器，生成web应用服务器端的实例

var path = require('path');
//引入path模块的作用：
//因为页面样式的路径放在了bower_componets,告诉express，请求页面里所过来的请求中，如果有请求样式或脚本，都让他们去bower_components中去查找

var mongoose = require('mongoose');
//增加mongoose模块
mongoose.connect('mongodb://localhost/imooc',{useMongoClient:true});//传入本地数据库
mongoose.Promise = global.Promise;
//连接mongodb本地数据库imovie
//关于mongose简要知识点补充
/*
	mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
	Schema（模式）对象定义文档结构，可以定义字段和类型、唯一性、索引和验证。（对数据字段进行定义，定义字段的类型字符串类型、数值类型）
	Model（模型）对象表示集合中的所有文档。（对传入的模式进行编译，会生成构造函数）
	Document（文档）对象作为集合中的单个文档的表示（文档实例化，调用构造函数，传入一条数据，再使用save方法存储到数据库里。数据库批量查询，调用模型的find方法并传入空对象，单条查询传入一个特定的key。数据库单条删除，直接调用模型的remove方法，传入一个特定的key和value）
	mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合
*/

var _ = require('underscore');//用另外一个对象的字段替换老的字段，需要引进这个模块

var Movie = require('./models/movie');//载入mongoose编译后的模型movie

var serveStatic = require('serve-static');//静态文件处理
app.use(serveStatic('public'));//路径：public

var bodyParser = require('body-parser');
//因为后台录入页有提交表单的步骤，故加载此模块方法(bodyParse模块来做文件解析)，将表单里的数据进行格式化
app.use(bodyParser.urlencoded({extended:true}));

var port = process.env.PORT || 3333;//默认环境port 或者 设置端口号：3333
//process.env 返回一个对象，成员为当前 shell 的环境变量（意思就是也可以从命令行里面设置环境变量）
//shell下：PORT = 4000 node app.js
app.listen(port);//监听port[3333]端口
console.log('imooc started on port '+port);

app.set('views','./views/pages');//设置视图默认的文件路径 
app.set('view engine','jade');//设置默认模板（视图）引擎：jade

app.locals.moment = require('moment');//为了加入录入时间，引入了moment模块，格式化日期


//编写主要页面路由
//index page 首页
app.get('/',function(req,res){//使用实例的get方法，请求页面信息。（路由规则，回调方法（req,res））

	//总结：此处fetch方法先排序，后渲染
	Movie.fetch(function(err,movies){//fetch方法执行后，return中的exec(cb)执行了函数function(err,movies),cb拿到了this.find({}).sort('meta.updateAt')返回的movies数据
		if(err){
			console.log(err)
		}	
		res.render('index',{//渲染index首页
			title:'imooc 首页',//向首页传入title变量
			movies:movies 
		})
    });
});
    
		/*{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
			}*/

			
//detail page 详情页
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	
	Movie.findById(id,function(err,movie){
		res.render('detail',{
        	title:'imooc '+movie.title,
			movie:movie
		})/*{
		  doctor:'何塞·帕迪利亚',
		  country:'美国',
		  title:"机械战警",
		  year:2014,
		  poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
		  language:'英语',
		  flash:'http://player.youku.com/player.php/sid/SNJA1Njc0NTUy/v.swf',
		  summary:'《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
		}*/
    });
})

//admin page 后台录入页
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'imooc 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''		
		}
    });
})

//admin update movie （后台更新页，）初始化后台录入页
app.get('/admin/update/id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
})

//admin post movie  拿到从后台录入页post过来的数据
app.post('/admin/movie',function(req,res){
	var id = req.body.movie._id;//拿到隐藏在录入页中的movie_id
	var movieObj = req.body.movie;
	var _movie;
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){//movie是老的电影数据
			if(err){
				console.log(err);
			}
			//更新数据（用post提交过来的数据中更新过的字段替换老的数据）
			_movie = _.extend(movie,movieObj);//复制movieObj对象中所有属性覆盖到movie上，并返回movie对象。复制是按顺序的，所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id);
				//电影数据更新并存储成功，页面就重定向到这部电影对应的详情页面
			})
		})	
	}
	else{ //新加的电影
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/'+movie._id);
		})
	}
})

//list page 列表页
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies: movies
		})
	/*[{
		  title: '机械战警',
		  _id: 1,
		  doctor: '何塞·帕迪利亚',
		  country: '美国',
		  year: 2014,
		  language: '英语',
		  flash: 'http://player.youku.com/player.php/sid/SNJA1Njc0NTUy/v.swf'
		}]*/
    });
})

//list delete movie 列表页删除电影
app.delete('/admin/list',function(req,res){
	var id =req.query.id;//需要使用query来获取，因为参数id使用过url查询字符串的格式传递过来的
	
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);	
			}
			else{
				res.json({success:1});
				//给客户端返回一段json数据						
			}
		})	
	}	
})