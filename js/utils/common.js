define([], function(){	
	var commonApi = function(){};
	commonApi.prototype={
	    getConfig:function(){
			return [
				{
					key:"js/index_page.js",
					title:"垃圾分类助手"
				},{
					key:"js/search.js",
					title:"搜索"
				},{
					key:"js/search_result.js",
					title:"搜索结果"
				}
			]
		},
		getgarbageCategoryConfig:function(){
			return [{
				name:"有害垃圾",
				title:"有害垃圾",
				icon:"img/harmful_garbage.png",
				guide:"img/harmful_garbage_guide.png",
				itemImage:"img/harmful_garbage_icon.png"
				},{
				name:"其他垃圾",
				title:"其他垃圾",
				icon:"img/other_garbage.png",
				guide:"img/other_garbage_guide.png",
				itemImage:"img/other_garbage_icon.png"
				},{
				name:"厨余垃圾",
				title:"厨余垃圾",
				icon:"img/kitchen_garbage.png",
				guide:"img/kitchen_garbage_guide.png",
				itemImage:"img/kitchen_garbage_icon.png"
				},{
				name:"可回收垃圾",
				title:"可回收物",
				icon:"img/recyclable_garbage.png",
				guide:"img/recyclable_garbage_guide.png",
				itemImage:"img/recyclable_garbage_icon.png"
				}
			]
		},
		togglePage:function(target,para){
		    console.log(target,para);
			var self=this;
			require([target], function(curpage){
				var getConfig=self.getConfig();
				for(var i = 0; i < getConfig.length; i++){
					if(getConfig[i].key==target){
						document.getElementById("nav_header_title").children[0].innerHTML=getConfig[i].title;
						document.getElementById("nav_header_back").style.display=(i==0?"none":"block");
						break;
					}
				};
				document.getElementById("waste_sorting_body").innerHTML="";
				var curpage = new curpage();
				if(typeof para=="undefined"){
					curpage.init("waste_sorting_body");
				}
				else{
					curpage.init("waste_sorting_body",para);
				}
				window.lastPageList.push(target);
			});
		},
		backPage:function(){
			var self=this;
			var lastPageList=window.lastPageList;
			if(lastPageList.length>1){//不在第一页
				var curPage=lastPageList[lastPageList.length-2];//之前一页
				var getConfig=self.getConfig();
				for(var i = 0; i < getConfig.length; i++){
					if(getConfig[i].key==curPage){
						document.getElementById("nav_header_title").children[0].innerHTML=getConfig[i].title;
						document.getElementById("nav_header_back").style.display=(i==0?"none":"block");
						break;
					}
				};
				require([curPage], function(curpage){
					document.getElementById("waste_sorting_body").innerHTML="";
					var curpage = new curpage();
					curpage.init("waste_sorting_body");
					lastPageList.splice(-1);
				})
			}
		},
		//根据关键字搜索匹配的垃圾分类信息
		searchGarbageClassificationDataByKeyword:function(name,city,callback,failCallback){
			if(name!=""){//name是必填字段
				if(typeof APPCODE!="undefined"){
					if(typeof garbageClassificationByKeywordRequest!="undefined"){
						var url=garbageClassificationByKeywordRequest;
						var name=encodeURIComponent(name);
						url+=("?name="+name);
						if(city!=""){
							url+=("&city="+encodeURIComponent(city));
						};
						var Authorization = 'APPCODE ' + APPCODE;
						jQuery.ajax({
								type: "GET",
								url: url,
								async: true,
								headers: {
								  'Authorization': Authorization,
								  'Accept': 'application/json'
								},
						}).done(function(data) {	
							if(typeof data.data!="undefined"){
								if((data.data instanceof Array)&&(data.data.length==0)){
									failCallback()
								}
								else{
									if(typeof data.data.list!="undefined"){
										if((data.data.list instanceof Array)&&(data.data.list.length==0)){
											failCallback()
										}
										else{
											callback(data)
										}
									}
								}
							}
							else{
								failCallback()
							}
						}).fail(function(){
							failCallback()
						})	
					}
				}
			}
		},
		formatTextSearchData:function(data){
			var result=[];
			try{
				if(data&&data.data&&data.data.list){
					if(data.data.list.length>0){
						var result = data.data.list.map(function (item) {
							return {
								name:item.name||"",
								category:item.category||"",
							};
						});
					}
				}
			}catch(e){
			};
			return result
		}
	};
	return commonApi;
})


