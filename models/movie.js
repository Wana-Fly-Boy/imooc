//模型编写
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');//引入模式文件，获取导出模块
var Movie = mongoose.model('Movie',MovieSchema);//编译生成movie模型，通过调用mongoose.model，传入模型以及模式

//将movie模型[构造函数]导出
module.exports = Movie