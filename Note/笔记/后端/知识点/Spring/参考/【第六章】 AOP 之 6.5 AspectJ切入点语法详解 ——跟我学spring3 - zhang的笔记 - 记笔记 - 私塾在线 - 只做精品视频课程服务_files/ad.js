var count = $.cookie("ad_counter"); if(count == null){count=0;}
if(count <=3 ) {
writeAdCookie(++count);
var ads = new Array();

//ads.push('<a href="http://sishuok.com/board/1001?fromad2" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-2014-spring.jpg"/></a>');
//ads.push('<a href="http://sishuok.com/board/1001?fromad2" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-2014-spring.jpg"/></a>');

ads.push('<a href="http://sishuok.com/product/861" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-2017-project.png"/></a>');
ads.push('<a href="http://sishuok.com/product/861" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-2017-project.png"/></a>');


//ads.push('<a href="http://sishuok.com/product/841" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-arch3.png"/></a>');
//ads.push('<a href="http://sishuok.com/product/841" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-arch3.png"/></a>');

//ads.push('<a href="http://sishuok.com/board/861" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-1212.png"/></a>');
//ads.push('<a href="http://sishuok.com/board/861" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-1212.png"/></a>');


//ads.push('<a href="http://sishuok.com/board/141?fromad" target="_blank"><img src="http://sishuok.com/common/images/ad/ad-5.jpg"/></a>');
//ads.push('<a href="http://javass.cn/javapeixunxinwen/08.html?fromad" target="_blank"><img src="http://sishuok.com/common/images/ad/ad_net.png"/></a>');
    if(ads.length > 0) {
        var msg = ads[new Date() % ads.length];
        document.writeln('<style>.minipage { width: 475px;width: 650px;height: 350px; z-index: 2147483647; position: fixed; _position: absolute; right:10px;bottom: 10px; font: 12px Tahoma,Helvetica,SimSun,sans-serif;  }.minipage_btn { float:right; margin-top: 10px; }.minipage_btn a { float: left; margin-left: 6px; width: 12px; height: 12px; background: url("http://discuz.gtimg.cn/search/images/minipage_btn.png"); text-indent:-9999px;overflow:hidden; }a.minipage_btn_min { background-position: 0 0; }a.minipage_btn_max { background-position: -12px 0; }a.minipage_btn_close { background-position: -24px 0; }.minipage_f { height: 10px; background-position: -334px 100%; font-size: 0px; }.minipage_min { background: none; }.minipage_min .minipage_h { background-position: 0 0; }.minipage_min .minipage_c, .minipage_min .minipage_f { display: none; }</style><div class="minipage" id="div_minipage" style="float:right;right: 10px;">	<div>		<div class="minipage_btn">			<a href="#" id="a_min" class="minipage_btn_min" title="最小化" onclick="minisizeMinipage(5241678);return false;">最小化</a>			<a style="display: none;" href="#" id="a_max" class="minipage_btn_max" title="最大化" onclick="maxsizeMinipage(5241678);return false;">最大化</a>			<a href="#" class="minipage_btn_close" title="关闭" onclick="closeMinipage(5241678);return false;">关闭</a>		</div>		<div class="minipage_t">					</div>	</div>	<div class="minipage_c cl">'+msg+'</div>');
        //document.writeln('<style>.minipage { width: 475px;width: 475px;height: 195px; z-index: 2147483647; position: fixed; _position: absolute; right:10px;bottom: 10px; font: 12px Tahoma,Helvetica,SimSun,sans-serif;  }.minipage_btn { float:right; margin-top: 10px; }.minipage_btn a { float: left; margin-left: 6px; width: 12px; height: 12px; background: url("http://discuz.gtimg.cn/search/images/minipage_btn.png"); text-indent:-9999px;overflow:hidden; }a.minipage_btn_min { background-position: 0 0; }a.minipage_btn_max { background-position: -12px 0; }a.minipage_btn_close { background-position: -24px 0; }.minipage_f { height: 10px; background-position: -334px 100%; font-size: 0px; }.minipage_min { background: none; }.minipage_min .minipage_h { background-position: 0 0; }.minipage_min .minipage_c, .minipage_min .minipage_f { display: none; }</style><div class="minipage" id="div_minipage" style="float:right;right: 10px;">	<div>		<div class="minipage_btn">			<a href="#" id="a_min" class="minipage_btn_min" title="最小化" onclick="minisizeMinipage(5241678);return false;">最小化</a>			<a style="display: none;" href="#" id="a_max" class="minipage_btn_max" title="最大化" onclick="maxsizeMinipage(5241678);return false;">最大化</a>			<a href="#" class="minipage_btn_close" title="关闭" onclick="closeMinipage(5241678);return false;">关闭</a>		</div>		<div class="minipage_t">					</div>	</div>	<div class="minipage_c cl">'+msg+'</div>');
    }
}
function closeMinipage(sId) {	uploadMiniPageAction(sId, 1, 3, '');	document.getElementById("div_minipage").style.display = "none";}function minisizeMinipage(sId) {	uploadMiniPageAction(sId, 1, 2, '');	var div_minipage = document.getElementById("div_minipage");	var client_height = div_minipage.clientHeight;	div_minipage.className += " minipage_min";	var min_button = document.getElementById("a_min");	min_button.style.display = "none";	document.getElementById("a_max").style.display = "block";}
function maxsizeMinipage(sId) {	uploadMiniPageAction(sId, 1, 4, '');	var div_minipage = document.getElementById("div_minipage");	var minipageClass = div_minipage.className;	if (typeof(minipageClass) == "string") {		div_minipage.className = minipageClass.replace(" minipage_min", "");	}	document.getElementById("a_min").style.display = "block";	document.getElementById("a_max").style.display = "none";	}
function uploadMiniPageAction(sId, pos, userAction, a) {	var _sId = sId;	var _page = 1;	var _qs = '';	var _pos = pos;	var _type = '';	var _url = '';		if (userAction == 1) {		_url = a.href;		_type = 'miniList';	} else if(userAction == 2) {		_url = document.location;		_type = 'miniSize';	} else if(userAction == 3) {		_url = document.location;		_type = 'miniClose';	} else if(userAction == 4) {		_url = document.location;		_type = 'maxSize';	}	}
function writeAdCookie(count) {document.cookie=$.cookie("ad_counter", count, {expires:1, path:"/"});}