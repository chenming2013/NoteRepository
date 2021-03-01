/* 
	这是我对平时一些比较好的JS方法的封装 
*/


/* 
	页面加载完毕之后执行事件：
		我们一般的做法是 window.onload = function(){ statments goes here... },将各个方法调用写在匿名函数里
			比如：我们要在页面加载完毕之后执行两个方法,一般是这么写：
			window.onload = function(){
				funcA();   //调用自己写的funcA()方法;
				funcB();   //调用自己写的funcB()方法;
			}
		如果我们写成：
			window.onload = funcA();
			window.onload = funcB();
			这样将不会调用两个方法,而是只会调用funcB(),因为funcA()被覆盖了

		那么,如果我就想写成上面的形式呢？(因为这种形式利于插拔),此时可以用下面自己封装的方法
*/
function addLoadEvent(func){  //func是传过来的即将执行的方法
	var oldonload = window.onload;  //保存window.onload属性
	if(typeof window.onload != 'function'){ //如果window.onload属性上没有绑定方法,那么就执行传过来的方法
		window.onload = func;
	}else{
		window.onload = function(){ //如果window.onload属性上有绑定方法,绑定的方法就是oldonload,此时先执行oldonload(),然后再执行我们传过来的方法
			oldonload();
			func();
		}
	}
}


/*
	在指定元素后面插入新元素：
		DOM有一个insertBefore()方法,该方法能在指定元素之前插入一个新元素,但很可惜的是DOM没有提供insertAfter()方法在指定元素之后添加新元素
		所以,这里我们自己实现一个insertAfter()方法

*/
function insertAfter(newElement,targetElement){  //需要两个参数,一个是将被插入的新元素,一个是目标元素
	var parent = targetElement.parentNode;  //获取目标元素的父元素
	if(parent.lastChild==targetElement){  //说明targetElement是当前parent节点的最后一个元素
		parent.appendChild(newElement);
	}else{
		parent.insertBefore(newElement,targetElement.nextSibling);  //将新元素插入到targetElement的下一个兄弟节点之前,也就是插入到了targetElement元素之后(紧跟着targetElement)
	}
}


/*
	HTML标签转义：

*/
function htmlEscape(text){
    return text.replace(/[<>"&]/g,function(match,pos,originalText){
        switch(match){
            case '<':
            return '&lt;';
            case '>':
            return '&gt;';
            case '&':
            return '&amp;';
            case '\"':
            return '&quot;';
        }
    });
}
//console.log(htmlEscape('<p class=\"greeting\">Hello world!</p>'));
//&lt;p class=&quot; greeting&quot;&gt;Hello world!&lt;/p&gt;


/*
	日期格式化：
*/
function formatDate(date){
    return date.replace(/(\d+)\D+(\d+)\D+(\d+)/,'$1年$2月$3日')
}
//var array = ['2015.7.28','2015-7-28','2015/7/28','2015.7-28','2015-7.28','2015/7---28'];
//console.log(result);//["2015年7月28日", "2015年7月28日", "2015年7月28日", "2015年7月28日", "2015年7月28日", "2015年7月28日"]


//判断一个对象是否是类素组对象
function isArrayLike(obj){
	return Array.isArray(Array.prototype.slice().call(obj));
}

//将一个类素组对象转换成真正的数组
function toArrayByArrayLike(){
	return Array.prototype.slice().call(obj);
}


//判断数据的类型
function judgeType(data,type){
	var upperString = type.toLowerCase();
	var result = upperString.slice(0,1).toUpperCase() + upperString.slice(1);
	return Object.prototype.toString.call(data) === '[object '+result+']';
}
//console.log(judgeType({},"Object"));  true
//console.log(judgeType([],"Array"));  true


