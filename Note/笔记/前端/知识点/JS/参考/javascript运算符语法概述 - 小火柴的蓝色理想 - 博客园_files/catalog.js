
//事件处理程序兼容写法
function addEvent(target,type,handler){
    if(target.addEventListener){
        target.addEventListener(type,handler,false);
    }else{
        target.attachEvent('on'+type,function(event){
            return handler.call(target,event);
        });
    }
}
//DOM结构稳定后，再操作
addEvent(window,'load', fnCata);

function fnCata(){
	/*动态样式*/
	function loadStyles(str){
	    loadStyles.mark = 'load';
	    var style = document.createElement("style");
	    style.type = "text/css";
	    try{
	        style.innerHTML = str;
	    }catch(ex){
	        style.styleSheet.cssText = str;
	    }
	    var head = document.getElementsByTagName('head')[0];
	    head.appendChild(style); 
	}
	if(loadStyles.mark != 'load'){
	    loadStyles("h6{margin:0;padding:0;}\
	    	.box{position: fixed; left: 10px;top: 60px;font:16px/30px '宋体'; border: 2px solid #ccc;padding: 4px; border-radius:5px;min-width:80px;max-width:118px;overflow:hidden;cursor:default;background:rgba(0,0,0,0.1);}\
	    	.boxHide{border:none;width:60px;height:30px;padding:0;}\
	    	.box-title{text-align:center;font-size:20px;color:#444;}\
	    	.box-quit{position: absolute;text-align:center; right: 0;top: 4px;cursor:pointer;font-weight:bold;}\
	    	.box-quitAnother{background:#3399ff;left:0;top:0;}\
	    	a.box-anchor{display:block;text-decoration:none;color:black; border-left: 3px solid transparent;padding:0 3px;margin-bottom: 3px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}\
	    	a.box-anchor:hover{color:#3399ff;}\
	    	a.box-anchorActive{color:#3399ff;text-decoration:underline;border-color:#2175bc};");        
	};
	/*设置章节标题函数*/
	function setCatalog(){
		//获取页面中所有的script标题
		var aEle = document.getElementsByTagName('script');
		//设置sel变量，用于保存其选择符的字符串值
		var sel;
		//获取script标签上的data-selector值
		Array.prototype.forEach.call(aEle,function(item,index,array){
			sel = item.getAttribute('data-selector');
			if(sel) return;
		})
		//默认参数为h3标签
		if(sel == undefined){
			sel ='h3';
		}
		//选取博文
		var article = document.getElementById('cnblogs_post_body');
		//选取文章中所有的章节标题
		var tempArray = article.querySelectorAll(sel);
		//为每一个章节标题顺序添加锚点标识
		Array.prototype.forEach.call(tempArray, function(item, index, array) {
  			item.setAttribute('id','anchor' + (1+index));
		});
		//返回章节标题这个类数组
		return tempArray;
	}
	//设置全局变量Atitle保存添加锚点标识的标题项
	var aTitle = setCatalog();

	/*生成目录*/
	function buildCatalog(arr){
		//由于每个部件的创建过程都类似，所以写成一个函数进行服用
		function buildPart(json){
			var oPart = document.createElement(json.selector);
			if(json.id){oPart.setAttribute('id',json.id);}
			if(json.className){oPart.className = json.className;}
			if(json.innerHTML){oPart.innerHTML = json.innerHTML;}
			if(json.href){oPart.setAttribute('href',json.href);}
			if(json.title){oPart.title = json.title;}
			if(json.appendToBox){
				oBox.appendChild(oPart);
			}
			return oPart;
		}
		//取得章节标题的个数
		len = arr.length;
		//创建最外层div
		var oBox = buildPart({
			selector:'div',
			id:'box',
			className:'box boxHide'
		});
		//创建关闭按钮
		buildPart({
			selector:'span',
			id:'boxQuit',
			className:'box-quit box-quitAnother',
			innerHTML:'显示目录',
			appendToBox:true
		});
		//创建目录标题
		buildPart({
			selector:'h6',
			className:'box-title',
			innerHTML:'目录',
			appendToBox:true
		});
		//创建目录项
		for(var i = 0; i < len; i++){
			buildPart({
				selector:'a',
				className:'box-anchor',
				href:'#anchor' + (1+i),
				title:arr[i].innerHTML,
				innerHTML:'['+(i+1)+']'+arr[i].innerHTML,
				appendToBox:true
			});
		}
		//将目录加入文档中
		document.body.appendChild(oBox);
	}
	buildCatalog(aTitle);

	/*点击及滚轮事件*/
	(function(){
		var oBox = document.getElementById('box');
		//设置目录内各组件的点击事件
		oBox.onclick = function(e){
			e = e || event;
			if(oBox.isMove) return;
			var target = e.target || e.srcElement;
			//设置关闭按钮的点击事件
			if(target.id == 'boxQuit'){
				if(target.isHide){
					target.innerHTML = '显示目录';
					target.className = 'box-quit box-quitAnother'
					this.className = 'box boxHide';		
					target.isHide = false;
				}else{
					target.innerHTML = '&times;';
					target.className = 'box-quit';
					this.className = 'box';	
					target.isHide = true;			
				}
			}
			//获取target的href值
			var sHref = target.getAttribute('href');
			//设置目录项的点击事件
			if(/anchor/.test(sHref)){
				anchorActive(target);
			}
		}	

		//由于点击事件和滚轮事件都需要将目录项发生样式变化，所以声明锚点激活函数
		function anchorActive(obj){
			var parent = obj.parentNode;
			var aAnchor = parent.getElementsByTagName('a');
			//将所有目录项样式设置为默认状态
			Array.prototype.forEach.call(aAnchor,function(item,index,array){
				item.className = 'box-anchor';
			})
			//将当前目录项样式设置为点击状态
			obj.className = 'box-anchor box-anchorActive';
		}

		//设置滚轮事件
		var wheel = function(e){
		    //获取列表项
		    var aAnchor = oBox.getElementsByTagName('a');
			//获取章节题目项
			Array.prototype.forEach.call(aTitle,function(item,index,array){
				//获取当前章节题目离可视区上侧的距离
				var iTop = item.getBoundingClientRect().top;
				//获取下一个章节题目
				var oNext = array[index+1];
				//如果存在下一个章节题目，则获取下一个章节题目离可视区上侧的距离
				if(oNext){
					var iNextTop = array[index+1].getBoundingClientRect().top;
				}
				//当前章节题目离可视区上侧的距离小于10时
				if(iTop <= 10){
					//当下一个章节题目不存在， 或下一个章节题目离可视区上侧的距离大于10时，设置当前章节题目对应的目录项为激活态
					if(iNextTop > 10 || !oNext){
						anchorActive(aAnchor[index]);
					}
				}
			});
		}
		addEvent(window,'scroll',wheel)	
	})(); 

	/*拖拽*/
	(function(){
	    var x0,y0,x1,y1,isMoving;
	    var ele = document.getElementById('box');
	    var L0,R0,T0,B0,EH,EW;
	    var mousedownHandler = function(e){
	        e = e || event;
	        //获取元素距离定位父级的x轴及y轴距离
	        x0 = this.offsetLeft;
	        y0 = this.offsetTop;
	        //获取此时鼠标距离视口左上角的x轴及y轴距离
	        x1 = e.clientX;
	        y1 = e.clientY;
	        //按下鼠标时，表示正在运动
	        isMoving = true;
	        //鼠标按下时，获得此时的页面区域
	        L0 = 0;
	        R0 = document.documentElement.clientWidth;
	        T0 = 0;
	        B0 = document.documentElement.clientHeight;
	        //鼠标按下时，获得此时的元素宽高
	        EH = ele.offsetHeight;
	        EW = ele.offsetWidth;
	    }
	    var mousemoveHandler = function(e){
	        //如果没有触发down事件，而直接触发move事件，则函数直接返回
	        if(!isMoving){
	            return;
	        }
	        e = e || event;
	        //获取此时鼠标距离视口左上角的x轴及y轴距离
	        var x2 = e.clientX;
	        var y2 = e.clientY;   
	        //计算此时元素应该距离视口左上角的x轴及y轴距离
	        var X = x0 + (x2 - x1);
	        var Y = y0 + (y2 - y1);        
	        /******范围限定*******/
	        //获取鼠标移动时元素四边的瞬时值
	        var L = X;
	        var R = X + EW;
	        var T = Y;
	        var B = Y + EH;
	        //在将X和Y赋值给left和top之前，进行范围限定。只有在范围内时，才进行相应的移动
	        //如果脱离左侧范围，则left置L0
	        if(L < L0){X = L0;}
	        //如果脱离右侧范围，则left置为R0
	        if(R > R0){X = R0 - EW;}
	        //如果脱离上侧范围，则top置T0
	        if(T < T0){Y = T0;}

	        //将X和Y的值赋给left和top，使元素移动到相应位置
	        ele.style.left = X + 'px';
	        ele.style.top = Y + 'px';
	    }
	    var mouseupHandler = function(e){
	        //鼠标抬起时，表示停止运动
	        isMoving = false;
	        //释放全局捕获
	        if(ele.releaseCapture){
	            ele.releaseCapture();
	        }
	    }
	    var preventDefaultHandler = function(e){
	        e = e || event;
	        if(e.preventDefault){
	            e.preventDefault();
	        }else{
	            e.returnValue = false;
	        }
	        //IE8-浏览器阻止默认行为
	        if(ele.setCapture){
	            ele.setCapture();
	        }

	}
	addEvent(ele,'mousedown',mousedownHandler);
	addEvent(ele,'mousedown',preventDefaultHandler);
	addEvent(document,'mousemove',mousemoveHandler)
	addEvent(document,'mouseup',mouseupHandler)

	})();
};



(function(){
	//生成元素
	var progress = document.createElement('progress');
	progress.id = 'progress';
	progress.style.cssText = 'position:fixed;left:0;right:0;bottom:0;width:100%;height:12px;text-align:center;font:12px/12px "宋体";';
	document.body.appendChild(progress);

	//计算H
	var H;
	addEvent(window,'load',function(){
		progress.max = H = cnblogs_post_body.scrollHeight;
	});

	//计算h及radio
	addEvent(window,'scroll',function(){
		var h = document.documentElement.scrollTop || document.body.scrollTop;
		progress.value =  h;
		var radio = (h/H >= 1) ? 1 : h/H;
		progress.innerHTML = progress.title =  Math.floor(100*radio) + '%';	
	});	
})();

(function(){
	function whichMobile(){
	    var ua = navigator.userAgent;
	    if(/iPhone OS (\d+_\d+)/.test(ua)){
	        return 'iPhone' + RegExp.$1.replace("_",".");
	    }
	    if(/iPad.+OS (\d+_\d+)/.test(ua)){
	        return 'iPad' + RegExp.$1.replace("_",".")
	    }
	    if(/Android (\d+\.\d+)/.test(ua)){
	        return 'Android' + RegExp["$1"];
	    }
	}	
	//如果是非移动端，则执行如下代码
	if(!whichMobile()){
		//获取博文标题
		var oBox = document.getElementById('topics');
		var oTitle = oBox.getElementsByTagName('h1')[0];
		oTitle.style.paddingRight = '0';
		//创建标识图片及外层包装div
		var oImgBox = document.createElement('div');
		oImgBox.style.cssText = 'position:absolute;margin-left:6px;display:inline-block;vertical-align:middle';
		var oImg = new Image();
		oImg.id = 'oImg';
		oImg.style.cursor = 'pointer';
		oImg.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoklEQVQ4T+2T4Q2CMBCFv27CBjgCG+gIjAAbOAIjOIJs4Ai6gRvIBpjXXCOp19T/8pJLoTneXcj3Ah91wAV4bu68xwXoAZ2EzEAmE9AWTB6AelRDyaAx9zgh0wE4ATczcTdIE7wl0oe7wX/8RMHigfQTB3fDdM1IEvYyONdIVEOSqDwCY2Z2NaS/UNbqMSQmvauUPlfbNKpBSdTUVyXSs/XyBlRCNBG20I28AAAAAElFTkSuQmCC";
			oImg.style.margin = '0';
			oImgBox.appendChild(oImg);
			//将标识图片插入标题后面
		oTitle.appendChild(oImgBox);	

		//动态生成script标签，引入qrcode插件
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = 'https://files.cnblogs.com/files/xiaohuochai/qrcode.min.js';
		document.body.appendChild(script);

		//动态生成div标签，用于放置通过qrcode插件生成的二维码大图，默认隐藏显示
		var oDiv = document.createElement('div');
		oDiv.id = 'qrcode';	
		oDiv.mark = false;
		oDiv.style.cssText = 'display:none;position:absolute;left:20px;top:-40px';
		oImgBox.appendChild(oDiv);	

		addEvent(window,'load',function(){
			new QRCode(oDiv, {
				text: location.href,
				width: 80,
				height: 80
			});	  			
		})

		//鼠标移入标识图片外层oImgBox后，在该标识图片的右侧显示二维码图片
		addEvent(oImgBox,'click',function(){
			//如果mark为真，说明二维码图片正在显示，将其隐藏
			if(oDiv.mark){
				oDiv.style.display = 'none';
			//否则说明二维码图片正在隐藏，将其显示
			}else{
				oDiv.style.display = 'block';
			}
			//将mark标识置反
			oDiv.mark  = !oDiv.mark;				
		})
	}
})();
