一、项目前期准备

1、需求分析 ：需要几个页面，页面内容，页面交互
2、项目依赖：安装项目模块，初始目录创建
3、入口文件编码：后端创建一个入口文件，进行编码
4、创建视图：创建主要页面的视图、模板
5、测试前端流程：前端发送请求，后台响应并返回数据
6、样式开发，伪造模板数据：页面样式开发，对HTML页面的dom结构进行填充，并伪造页面模板数据
7、设计数据库模型
8、开发后端逻辑
9、配置依赖文件，网站开发结束：前端静态资源版本和后端模块版本的配置文件



pages分析：
    首页：电影列表，存储到数据库中的数据全部取出，并展现，每一条数据有海报、电影名字、播放按钮
    详情页：点击电影列表中的电影，显示相应的电影信息，更加详细的展示字段
    后台录入页：表单提交到后台，后台存储到数据库mongodb里
    列表页：对电影进行（增、删、查、改）更新、删除、增加等


二、项目前后端流程打通
2-1、Node入口文件分析和目录初始化
1）npm install modules（npm基本操作得去看一下）
2）app.js入口文件（node的基本语法得去看一下）
2-2、创建四个jade视图及入口文件中处理
1）入口文件编写（包括路由）
2）jade创建视图（jade语法得去看一下）
2-3、伪造模板数据跑通前后端交互流程
1）jade模板可以实现继承，公共区块的提取和调用
2）layout.jade 布局文件，公用html框架代码
    -include head引入样式区块和body引入页面头部区块
    -block content
3）head.jade和header.jade
4）bower install bootstrap
5）extends 继承layout.jade布局文件
6）在页面中编写不同的block content内容


index.jade
利用了bootstrap的布局，遍历了电影数据，结构包括电影缩略图、电影标题和按钮。

detail.jade
传入一个对象，对象的key是movie，里面有多个字段。embed嵌入一个播放器，允许全屏，设置宽高和质量
然后定义了一个列表，显示电影的具体信息


admin.jade
表单 
form实现

list.jade
从数据库中取出所有的电影，显示到列表中。
table实现



删除操作，使用jquery异步提交一个请求




.bowerrc文件，指定bower安装到哪个目录下
{
    "directory":"public/libs"
}
使用bower安装bootstrap等静态资源时，会查找目录中是否有.bowerrc文件，然后将模块安装到public下的libs里



完成后要对项目进行版本锁定，生成配置文件。

生成配置文件后，别人copy代码时，可以不用copy，node和bower的包，只需在对应目录执行
npm install 和 bower install即可。
                                                     
bower init
npm init