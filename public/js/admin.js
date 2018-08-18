//处理删除电影数据的逻辑
$(function(){
	$('.del').click(function(e){
		var target = $(e.target);//获取当前点击按钮
		var id = target.data('id');//获取data中保存的id数据
		var tr = $('.item-id-'+id);//删除对应的表格行
		
		$.ajax({
			type:'DELETE',//异步请求类型：删除
			url:'/admin/list?id='+id
		})
		.done(function(results){//删除后返回一个状态
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove();	
				}
			}	
		})
	})	
})