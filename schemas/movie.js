//模式编写
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({//调用方法，传入对象，和电影有关的字段和类型
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{//更新录入数据的时间记录
		createAt:{//创建时
			type:Date,//日期类型
			default:Date.now()//默认值
		},
		updateAt:{//更新时
			type:Date,
			default:Date.now()	
		}
	}			
})

//为模式添加方法，每次存储数据之前调用，判断数据是否新加
MovieSchema.pre('save',function(next){
	if(this.isNew){//创建和更新时间为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{//只做了更新
		this.meta.updateAt = Date.now()	
	}
	next()//将存储流程走下去
})

//添加一些静态方法，这些方法不会与数据库进行交互，只有在模型编译，实例化以后才有这些方法
MovieSchema.statics = {
	//取出目前数据库中所有的数据
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')//排序。按照更新时间
			.exec(cb);//执行回调
	},
	findById:function(id,cb){//查询单条数据
		return this
			.findOne({_id:id})
			.exec(cb);	
	}
}

//movie Schema模式导出
module.exports = MovieSchema