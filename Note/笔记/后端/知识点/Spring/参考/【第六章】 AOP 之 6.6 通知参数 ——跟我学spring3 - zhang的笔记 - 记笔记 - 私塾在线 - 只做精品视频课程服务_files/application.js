//
//
//eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(7($){$.Q.P=7(t){8 1={d:0,G:0,e:"o",B:"S",3:5};6(t){$.J(1,t)}8 p=c;6("o"==1.e){$(1.3).v("o",7(e){8 F=0;p.C(7(){6($.s(c,1)||$.x(c,1)){}f 6(!$.n(c,1)&&!$.m(c,1)){$(c).w("u")}f{6(F++>1.G){h E}}});8 H=$.N(p,7(9){h!9.k});p=$(H)})}c.C(7(){8 2=c;6(j==$(2).b("r")){$(2).b("r",$(2).b("i"))}6("o"!=1.e||j==$(2).b("i")||1.z==$(2).b("i")||($.s(2,1)||$.x(2,1)||$.n(2,1)||$.m(2,1))){6(1.z){$(2).b("i",1.z)}f{$(2).Z("i")}2.k=E}f{2.k=D}$(2).11("u",7(){6(!c.k){$("<Y />").v("U",7(){$(2).V().b("i",$(2).b("r"))[1.B](1.W);2.k=D}).b("i",$(2).b("r"))}});6("o"!=1.e){$(2).v(1.e,7(e){6(!2.k){$(2).w("u")}})}});$(1.3).w(1.e);h c};$.n=7(9,1){6(1.3===j||1.3===5){8 4=$(5).y()+$(5).I()}f{8 4=$(1.3).g().q+$(1.3).y()}h 4<=$(9).g().q-1.d};$.m=7(9,1){6(1.3===j||1.3===5){8 4=$(5).A()+$(5).M()}f{8 4=$(1.3).g().l+$(1.3).A()}h 4<=$(9).g().l-1.d};$.s=7(9,1){6(1.3===j||1.3===5){8 4=$(5).I()}f{8 4=$(1.3).g().q}h 4>=$(9).g().q+1.d+$(9).y()};$.x=7(9,1){6(1.3===j||1.3===5){8 4=$(5).M()}f{8 4=$(1.3).g().l}h 4>=$(9).g().l+1.d+$(9).A()};$.J($.10[\':\'],{"T-L-4":"$.n(a, {d : 0, 3: 5})","R-L-4":"!$.n(a, {d : 0, 3: 5})","O-K-4":"$.m(a, {d : 0, 3: 5})","l-K-4":"!$.m(a, {d : 0, 3: 5})"})})(X);',62,64,'|settings|self|container|fold|window|if|function|var|element||attr|this|threshold|event|else|offset|return|src|undefined|loaded|left|rightoffold|belowthefold|scroll|elements|top|original|abovethetop|options|appear|bind|trigger|leftofbegin|height|placeholder|width|effect|each|true|false|counter|failurelimit|temp|scrollTop|extend|of|the|scrollLeft|grep|right|lazyload|fn|above|show|below|load|hide|effectspeed|jQuery|img|removeAttr|expr|one'.split('|'),0,{}))
//
//jQuery(document).ready(
//    function($){
//    $("img").lazyload({
//         placeholder : ctx + "/common/images/no_50_50.gif",
//         effect      : "fadeIn",
//         threshold    : 200
//    });
//});


/*
 * jQuery plugin
 *
 * Options:
 *   message: confirmation message for form submit hook (default: "Please confirm:")
 *
 * Any other options - e.g. 'clone' - will be passed onto the boxy constructor (or
 * Boxy.load for AJAX operations)
 */
jQuery.fn.boxy = function(options) {
    options = options || {};
    return this.each(function() {
        var node = this.nodeName.toLowerCase(), self = this;
        if (node == 'a') {
            jQuery(this).click(function() {
                var active = Boxy.linkedTo(this),
                    href = this.getAttribute('href'),
                    localOptions = jQuery.extend({actuator: this, title: this.title}, options);

                if (active) {
                    active.show();
                } else if (href.indexOf('#') >= 0) {
                    var content = jQuery(href.substr(href.indexOf('#'))),
                        newContent = content.clone(true);
                    content.remove();
                    localOptions.unloadOnHide = false;
                    new Boxy(newContent, localOptions);
                } else { // fall back to AJAX; could do with a same-origin check
                    if (!localOptions.cache) localOptions.unloadOnHide = true;
                    Boxy.load(this.href, localOptions);
                }

                return false;
            });
        } else if (node == 'form') {
            jQuery(this).bind('submit.boxy', function() {
                Boxy.confirm(options.message || 'Please confirm:', function() {
                    jQuery(self).unbind('submit.boxy').submit();
                });
                return false;
            });
        }
    });
};

//
// Boxy Class

function Boxy(element, options) {

    this.boxy = jQuery(Boxy.WRAPPER);
    jQuery.data(this.boxy[0], 'boxy', this);

    this.visible = false;
    this.options = jQuery.extend({}, Boxy.DEFAULTS, options || {});

    if (this.options.modal) {
        this.options = jQuery.extend(this.options, {center: true, draggable: false});
    }

    // options.actuator == DOM element that opened this boxy
    // association will be automatically deleted when this boxy is remove()d
    if (this.options.actuator) {
        jQuery.data(this.options.actuator, 'active.boxy', this);
    }

    this.setContent(element || "<div></div>");
    this._setupTitleBar();

    this.boxy.css('display', 'none').appendTo(document.body);
    this.toTop();

    if (this.options.fixed) {
        if (jQuery.browser.msie && jQuery.browser.version < 7) {
            this.options.fixed = false; // IE6 doesn't support fixed positioning
        } else {
            this.boxy.addClass('fixed');
        }
    }

    if (this.options.center && Boxy._u(this.options.x, this.options.y)) {
        this.center();
    } else {
        this.moveTo(
            Boxy._u(this.options.x) ? this.options.x : Boxy.DEFAULT_X,
            Boxy._u(this.options.y) ? this.options.y : Boxy.DEFAULT_Y
        );
    }

    if (this.options.show) this.show();

};

Boxy.EF = function() {};

jQuery.extend(Boxy, {

    WRAPPER:    "<table cellspacing='0' cellpadding='0' border='0' class='boxy-wrapper'>" +
                "<td class='top'></td></tr>" +
                "<tr><td class='left'></td><td class='boxy-inner'></td></tr>" +
                "<tr><td class='bottom'></tr>" +
                "</table>",

    DEFAULTS: {
        title:                  null,           // titlebar text. titlebar will not be visible if not set.
        closeable:              true,           // display close link in titlebar?
        draggable:              true,           // can this dialog be dragged?
        clone:                  false,          // clone content prior to insertion into dialog?
        actuator:               null,           // element which opened this dialog
        center:                 true,           // center dialog in viewport?
        show:                   true,           // show dialog immediately?
        modal:                  false,          // make dialog modal?
        fixed:                  true,           // use fixed positioning, if supported? absolute positioning used otherwise
        closeText:              '[close]',      // text to use for default close link
        unloadOnHide:           false,          // should this dialog be removed from the DOM after being hidden?
        clickToFront:           false,          // bring dialog to foreground on any click (not just titlebar)?
        behaviours:             Boxy.EF,        // function used to apply behaviours to all content embedded in dialog.
        afterDrop:              Boxy.EF,        // callback fired after dialog is dropped. executes in context of Boxy instance.
        afterShow:              Boxy.EF,        // callback fired after dialog becomes visible. executes in context of Boxy instance.
        afterHide:              Boxy.EF,        // callback fired after dialog is hidden. executed in context of Boxy instance.
        beforeUnload:           Boxy.EF         // callback fired after dialog is unloaded. executed in context of Boxy instance.
    },

    DEFAULT_X:          50,
    DEFAULT_Y:          50,
    zIndex:             1337,
    dragConfigured:     false, // only set up one drag handler for all boxys
    resizeConfigured:   false,
    dragging:           null,

    // load a URL and display in boxy
    // url - url to load
    // options keys (any not listed below are passed to boxy constructor)
    //   type: HTTP method, default: GET
    //   cache: cache retrieved content? default: false
    //   filter: jQuery selector used to filter remote content
    load: function(url, options) {

        options = options || {};

        var ajax = {
            url: url, type: 'GET', dataType: 'html', cache: false, success: function(html) {
                html = jQuery(html);
                if (options.filter) html = jQuery(options.filter, html);
                new Boxy(html, options);

            }
        };

        jQuery.each(['type', 'cache'], function() {
            if (this in options) {
                ajax[this] = options[this];
                delete options[this];
            }
        });

        jQuery.ajax(ajax);

    },

    // allows you to get a handle to the containing boxy instance of any element
    // e.g. <a href='#' onclick='alert(Boxy.get(this));'>inspect!</a>.
    // this returns the actual instance of the boxy 'class', not just a DOM element.
    // Boxy.get(this).hide() would be valid, for instance.
    get: function(ele) {
        var p = jQuery(ele).parents('.boxy-wrapper');
        return p.length ? jQuery.data(p[0], 'boxy') : null;
    },

    // returns the boxy instance which has been linked to a given element via the
    // 'actuator' constructor option.
    linkedTo: function(ele) {
        return jQuery.data(ele, 'active.boxy');
    },

    // displays an alert box with a given message, calling optional callback
    // after dismissal.
    alert: function(message, callback, options) {
        return Boxy.ask(message, ['OK'], callback, options);
    },

    // displays an alert box with a given message, calling after callback iff
    // user selects OK.
    confirm: function(message, after, options) {
        return Boxy.ask(message, ['OK', 'Cancel'], function(response) {
            if (response == 'OK') after();
        }, options);
    },

    // asks a question with multiple responses presented as buttons
    // selected item is returned to a callback method.
    // answers may be either an array or a hash. if it's an array, the
    // the callback will received the selected value. if it's a hash,
    // you'll get the corresponding key.
    ask: function(question, answers, callback, options) {

        options = jQuery.extend({modal: true, closeable: false},
                                options || {},
                                {show: true, unloadOnHide: true});

        var body = jQuery('<div></div>').append(jQuery('<div class="question"></div>').html(question));

        // ick
        var map = {}, answerStrings = [];
        if (answers instanceof Array) {
            for (var i = 0; i < answers.length; i++) {
                map[answers[i]] = answers[i];
                answerStrings.push(answers[i]);
            }
        } else {
            for (var k in answers) {
                map[answers[k]] = k;
                answerStrings.push(answers[k]);
            }
        }

        var buttons = jQuery('<form class="answers"></form>');
        buttons.html(jQuery.map(answerStrings, function(v) {
            return "<input type='button' value='" + v + "' />";
        }).join(' '));

        jQuery('input[type=button]', buttons).click(function() {
            var clicked = this;
            Boxy.get(this).hide(function() {
                if (callback) callback(map[clicked.value]);
            });
        });

        body.append(buttons);

        new Boxy(body, options);

    },

    // returns true if a modal boxy is visible, false otherwise
    isModalVisible: function() {
        return jQuery('.boxy-modal-blackout').length > 0;
    },

    _u: function() {
        for (var i = 0; i < arguments.length; i++)
            if (typeof arguments[i] != 'undefined') return false;
        return true;
    },

    _handleResize: function(evt) {
        var d = jQuery(document);
        jQuery('.boxy-modal-blackout').css('display', 'none').css({
            width: d.width(), height: d.height()
        }).css('display', 'block');
    },

    _handleDrag: function(evt) {
        var d;
        if (d = Boxy.dragging) {
            d[0].boxy.css({left: evt.pageX - d[1], top: evt.pageY - d[2]});
        }
    },

    _nextZ: function() {
        return Boxy.zIndex++;
    },

    _viewport: function() {
        var d = document.documentElement, b = document.body, w = window;
        return jQuery.extend(
            jQuery.browser.msie ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset },
            !Boxy._u(w.innerWidth) ?
                { width: w.innerWidth, height: w.innerHeight } :
                (!Boxy._u(d) && !Boxy._u(d.clientWidth) && d.clientWidth != 0 ?
                    { width: d.clientWidth, height: d.clientHeight } :
                    { width: b.clientWidth, height: b.clientHeight }) );
    }

});

Boxy.prototype = {

    // Returns the size of this boxy instance without displaying it.
    // Do not use this method if boxy is already visible, use getSize() instead.
    estimateSize: function() {
        this.boxy.css({visibility: 'hidden', display: 'block'});
        var dims = this.getSize();
        this.boxy.css('display', 'none').css('visibility', 'visible');
        return dims;
    },

    // Returns the dimensions of the entire boxy dialog as [width,height]
    getSize: function() {
        return [this.boxy.width(), this.boxy.height()];
    },

    // Returns the dimensions of the content region as [width,height]
    getContentSize: function() {
        var c = this.getContent();
        return [c.width(), c.height()];
    },

    // Returns the position of this dialog as [x,y]
    getPosition: function() {
        var b = this.boxy[0];
        return [b.offsetLeft, b.offsetTop];
    },

    // Returns the center point of this dialog as [x,y]
    getCenter: function() {
        var p = this.getPosition();
        var s = this.getSize();
        return [Math.floor(p[0] + s[0] / 2), Math.floor(p[1] + s[1] / 2)];
    },

    // Returns a jQuery object wrapping the inner boxy region.
    // Not much reason to use this, you're probably more interested in getContent()
    getInner: function() {
        return jQuery('.boxy-inner', this.boxy);
    },

    // Returns a jQuery object wrapping the boxy content region.
    // This is the user-editable content area (i.e. excludes titlebar)
    getContent: function() {
        return jQuery('.boxy-content', this.boxy);
    },

    // Replace dialog content
    setContent: function(newContent) {
        newContent = jQuery(newContent).css({display: 'block'}).addClass('boxy-content');
        if (this.options.clone) newContent = newContent.clone(true);
        this.getContent().remove();
        this.getInner().append(newContent);
        this._setupDefaultBehaviours(newContent);
        this.options.behaviours.call(this, newContent);
        return this;
    },

    // Move this dialog to some position, funnily enough
    moveTo: function(x, y) {
        this.moveToX(x).moveToY(y);
        return this;
    },

    // Move this dialog (x-coord only)
    moveToX: function(x) {
        if (typeof x == 'number') this.boxy.css({left: x});
        else this.centerX();
        return this;
    },

    // Move this dialog (y-coord only)
    moveToY: function(y) {
        if (typeof y == 'number') this.boxy.css({top: y});
        else this.centerY();
        return this;
    },

    // Move this dialog so that it is centered at (x,y)
    centerAt: function(x, y) {
        var s = this[this.visible ? 'getSize' : 'estimateSize']();
        if (typeof x == 'number') this.moveToX(x - s[0] / 2);
        if (typeof y == 'number') this.moveToY(y - s[1] / 2);
        return this;
    },

    centerAtX: function(x) {
        return this.centerAt(x, null);
    },

    centerAtY: function(y) {
        return this.centerAt(null, y);
    },

    // Center this dialog in the viewport
    // axis is optional, can be 'x', 'y'.
    center: function(axis) {
        var v = Boxy._viewport();
        var o = this.options.fixed ? [0, 0] : [v.left, v.top];
        if (!axis || axis == 'x') this.centerAt(o[0] + v.width / 2, null);
        if (!axis || axis == 'y') this.centerAt(null, o[1] + v.height / 2);
        return this;
    },

    // Center this dialog in the viewport (x-coord only)
    centerX: function() {
        return this.center('x');
    },

    // Center this dialog in the viewport (y-coord only)
    centerY: function() {
        return this.center('y');
    },

    // Resize the content region to a specific size
    resize: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        this.boxy.css({left: bounds[0], top: bounds[1]});
        this.getContent().css({width: bounds[2], height: bounds[3]});
        if (after) after(this);
        return this;
    },

    // Tween the content region to a specific size
    tween: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        var self = this;
        this.boxy.stop().animate({left: bounds[0], top: bounds[1]});
        this.getContent().stop().animate({width: bounds[2], height: bounds[3]}, function() {
            if (after) after(self);
        });
        return this;
    },

    // Returns true if this dialog is visible, false otherwise
    isVisible: function() {
        return this.visible;
    },

    // Make this boxy instance visible
    show: function() {
        if (this.visible) return;
        if (this.options.modal) {
            var self = this;
            if (!Boxy.resizeConfigured) {
                Boxy.resizeConfigured = true;
                jQuery(window).resize(function() { Boxy._handleResize(); });
            }
            this.modalBlackout = jQuery('<div class="boxy-modal-blackout"></div>')
                .css({zIndex: Boxy._nextZ(),
                      opacity: 0.7,
                      width: jQuery(document).width(),
                      height: jQuery(document).height()})
                .appendTo(document.body);
            this.toTop();
            if (this.options.closeable) {
                jQuery(document.body).bind('keypress.boxy', function(evt) {
                    var key = evt.which || evt.keyCode;
                    if (key == 27) {
                        self.hide();
                        jQuery(document.body).unbind('keypress.boxy');
                    }
                });
            }
        }
        this.boxy.stop().css({opacity: 1}).show();
        this.visible = true;
        this._fire('afterShow');
        return this;
    },

    // Hide this boxy instance
    hide: function(after) {
        if (!this.visible) return;
        var self = this;
        if (this.options.modal) {
            jQuery(document.body).unbind('keypress.boxy');
            this.modalBlackout.animate({opacity: 0}, function() {
                jQuery(this).remove();
            });
        }
        this.boxy.stop().animate({opacity: 0}, 300, function() {
            self.boxy.css({display: 'none'});
            self.visible = false;
            self._fire('afterHide');
            if (after) after(self);
            if (self.options.unloadOnHide) self.unload();
        });
        return this;
    },

    toggle: function() {
        this[this.visible ? 'hide' : 'show']();
        return this;
    },

    hideAndUnload: function(after) {
        this.options.unloadOnHide = true;
        this.hide(after);
        return this;
    },

    unload: function() {
        this._fire('beforeUnload');
        this.boxy.remove();
        if (this.options.actuator) {
            jQuery.data(this.options.actuator, 'active.boxy', false);
        }
    },

    // Move this dialog box above all other boxy instances
    toTop: function() {
        this.boxy.css({zIndex: Boxy._nextZ()});
        return this;
    },

    // Returns the title of this dialog
    getTitle: function() {
        return jQuery('> .title-bar h2', this.getInner()).html();
    },

    // Sets the title of this dialog
    setTitle: function(t) {
        jQuery('> .title-bar h2', this.getInner()).html(t);
        return this;
    },

    //
    // Don't touch these privates

    _getBoundsForResize: function(width, height) {
        var csize = this.getContentSize();
        var delta = [width - csize[0], height - csize[1]];
        var p = this.getPosition();
        return [Math.max(p[0] - delta[0] / 2, 0),
                Math.max(p[1] - delta[1] / 2, 0), width, height];
    },

    _setupTitleBar: function() {
        if (this.options.title) {
            var self = this;
            var tb = jQuery("<div class='title-bar'></div>").html("<h2>" + this.options.title + "</h2>");
            if (this.options.closeable) {
                tb.append(jQuery("<a href='#' class='close'></a>").html(this.options.closeText));
            }
            if (this.options.draggable) {
                tb[0].onselectstart = function() { return false; }
                tb[0].unselectable = 'on';
                tb[0].style.MozUserSelect = 'none';
                if (!Boxy.dragConfigured) {
                    jQuery(document).mousemove(Boxy._handleDrag);
                    Boxy.dragConfigured = true;
                }
                tb.mousedown(function(evt) {
                    self.toTop();
                    Boxy.dragging = [self, evt.pageX - self.boxy[0].offsetLeft, evt.pageY - self.boxy[0].offsetTop];
                    jQuery(this).addClass('dragging');
                }).mouseup(function() {
                    jQuery(this).removeClass('dragging');
                    Boxy.dragging = null;
                    self._fire('afterDrop');
                });
            }
            this.getInner().prepend(tb);
            this._setupDefaultBehaviours(tb);
        }
    },

    _setupDefaultBehaviours: function(root) {
        var self = this;
        if (this.options.clickToFront) {
            root.click(function() { self.toTop(); });
        }
        jQuery('.close', root).click(function() {
            self.hide();
            return false;
        }).mousedown(function(evt) { evt.stopPropagation(); });
    },

    _fire: function(event) {
        this.options[event].call(this);
    }

};


function getElementsByName (name, tagId) {
    var returns = document.getElementsByName(name);
    if(returns.length > 0) return returns;
    returns = new Array();
    var e = document.getElementsByTagName(tagId);
    for(var i = 0; i < e.length; i++) {
        if(e[i].getAttribute("name") == name) {
            returns[returns.length] = e[i];
        }
    }
    return returns;
}

/*
	通用表单验证方法
	Validform version 2.0
	For more information, you can visit http://www.rjboy.cn
	By sean at April 7, 2010 - April 22, 2011

	Demo:
	$(".demoform").Validform({//$(".demoform")指明是哪一表单需要验证,名称需加在from表单上;
		btnSubmit:"#btn_sub", //#btn_sub是该表单下要绑定点击提交表单事件的按钮;如果form内含有submit按钮该参数可省略;
		showRightImg:true, //是否显示验证成功后的图片，true显示
		tiptype:1, //可选项 1=>pop box,2=>side tip，默认为1;
		postonce:true, //可选项 是否开启网速慢时的二次提交防御，true开启，不填则默认关闭;
		ajaxurl:"ajax_post.php", //ajax提交表单数据;
		callback:function(data){
			//返回数据data是json格式，{"info":"demo info","status":"y"}
			//info: 输出提示信息;
			//status: 返回提交数据的状态,是否提交成功。如可以用"y"表示提交成功，"n"表示提交失败，在ajax_post.php文件返回数据里自定字符，主要用在callback函数里根据该值执行相应的回调操作;
			//你也可以在ajax_post.php文件返回更多信息在这里获取，进行相应操作；

			//这里执行回调操作;
		}
	});
*/

(function($){
	var errorobj=null,//指示当前验证失败的表单元素;
		msgobj,
		msghidden=true,
		tipmsg={
			w:"请输入正确信息！",
			r:"",
            c:"正在检测信息…",
            s:"请填入信息！",
            v:"所填信息没有经过验证，请稍后…",
            p:""
		},
		creatMsgbox=function(){
			if($("#Validform_msg").length!=0){return false;}
			msgobj=$('<div id="Validform_msg" tabIndex="0"><div class="Validform_title">提示信息<a class="Validform_close" href="javascript:void(0);">&chi;</a></div><div class="Validform_info"></div><div class="iframe"><iframe frameborder="0" scrolling="no" height="100%" width="100%"></iframe></div></div>').appendTo("body");//提示信息框;
			msgobj.find("a.Validform_close").click(function(){
				msgobj.hide();
				msghidden=true;
				if(errorobj){
					errorobj.focus().addClass("Validform_error");
				}
				return false;
			}).focus(function(){this.blur();});

            msgobj.blur(function(){
                msgobj.hide();
                msghidden=true;
				if(errorobj) {
					errorobj.focus().addClass("Validform_error");
				}
            });

            $(window).bind("scroll resize",function(){

					var left=($(window).width()-msgobj.width())/2;
                    left = left - 200 > 0 ? left - 200 : left;
					var top=($(window).height()-msgobj.height())/2;
					var topTo=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(top>0?top:0);
					msgobj.animate({
						left : left,
						top : topTo
					},{ duration:400 , queue:false });
                if(!msghidden) {
                    msgobj.focus();
				}
			})
		};

	$.fn.Validform=function(settings){
		var defaults={};
		settings=$.extend({},$.fn.Validform.sn.defaults,settings);

        var parentobj = this;
        parentobj.attr('posting', "false"); //防止表单按钮双击提交两次;

		this.each(function(){
			var $this=$(this);
            /*
			$this.find("[tip]").each(function(){//tip是表单元素的默认提示信息,这是点击清空效果;
				var defaultvalue=$(this).attr("tip");
				var altercss=$(this).attr("altercss");
				$(this).focus(function(){
					if($(this).val()==defaultvalue){
						$(this).val('');
						if(altercss){$(this).removeClass(altercss);}
					}
				}).blur(function(){
					if($.trim($(this).val())==''){
						$(this).val(defaultvalue);
						if(altercss){$(this).addClass(altercss);}
					}
				});
			});
			*/
			//绑定blur事件;
			$this.find("[datatype]").blur(function(){
				var flag=true;
				flag=$.fn.Validform.sn.checkform($(this),parentobj,settings.tiptype,"hide");

				if(!flag){return false;}
				if(typeof(flag)!="boolean"){//如果是radio, checkbox, select则不需再执行下面的代码;
					$(this).removeClass("Validform_error");
					return false;
				}

				flag=$.fn.Validform.sn.regcheck($(this).attr("datatype"),$(this).val());

				if(!flag){
					if($(this).attr("ignore")=="ignore" && ( $(this).val()=="" || $(this).val()==$(this).attr("tip") )){
						if(settings.tiptype==2) {

                            var tip = getTip($(this));
							tip.removeClass().addClass("Validform_checktip").text($(this).attr("tip"));
						}
						flag=true;
						return true;
					}
					errorobj=$(this);
					$.fn.Validform.sn.showmsg($(this).attr("errormsg")||tipmsg.w,settings.tiptype,{obj:$(this)},"hide"); //当tiptype=1的情况下，传入"hide"则让提示框不弹出,tiptype=2的情况下附加参数“hide”不起作用;
				}else{
					if($(this).attr("ajaxurl")){
						var inputobj=$(this);
						inputobj.attr("valid",tipmsg.c);
						$.fn.Validform.sn.showmsg(tipmsg.c,settings.tiptype,{obj:inputobj,type:1},"hide");
						$.ajax({
							type: "POST",
							url: inputobj.attr("ajaxurl"),
							data: "param="+$(this).val(),
							dataType: "json",
							success: function(s){
								if(s.status=="y"){
									inputobj.attr("valid","true");
									$.fn.Validform.sn.showmsg(tipmsg.r,settings.tiptype,{obj:inputobj,type:2},"hide");
								}else{
									inputobj.attr("valid",s.info);
									errorobj=inputobj;
									$.fn.Validform.sn.showmsg(s.info,settings.tiptype,{obj:inputobj});
								}
							}
						});
					}else{
						errorobj=null;
						$.fn.Validform.sn.showmsg(tipmsg.r,settings.tiptype,{obj:$(this),type:2},"hide");
					}
				};

			});

			//subform
			var subform=function(){

                if(settings.submitFunction && !settings.submitFunction()){
                    return false;
                }

				var flag=true;
				if(parentobj.attr("posting") == "true"){return false;}

				$this.find("[datatype]").each(function(){
					flag=$.fn.Validform.sn.checkform($(this),parentobj,settings.tiptype);

					if(!flag){
						errorobj.focus();
						return false;
					}

					if(typeof(flag)!="boolean"){
						flag=true;
						return true;
					}

					flag=$.fn.Validform.sn.regcheck($(this).attr("datatype"),$(this).val());

					if(!flag){
						if($(this).attr("ignore")=="ignore" && ( $(this).val()=="" || $(this).val()==$(this).attr("tip") )){
							flag=true;
							return true;
						}
						errorobj=$(this);
						errorobj.focus();
						$.fn.Validform.sn.showmsg($(this).attr("errormsg")||tipmsg.w,settings.tiptype,{obj:$(this)});
						return false;
					}

					if($(this).attr("ajaxurl")){
						if($(this).attr("valid")!="true"){
							flag=false;
							var thisobj=$(this);
							errorobj=thisobj;
							errorobj.focus();
							$.fn.Validform.sn.showmsg(thisobj.attr("valid") || tipmsg.v,settings.tiptype,{obj:thisobj});
							if(!msghidden || settings.tiptype==2){
								setTimeout(function(){
									thisobj.trigger("blur");
								},2000);
							}
							return false;
						}else{
							$.fn.Validform.sn.showmsg(tipmsg.r,settings.tiptype,{obj:$(this),type:2},"hide");
							flag=true;
						}
					}
				})

				if(flag && !(parentobj.attr("posting")=="true")) {
					errorobj=null;
					if(settings.postonce){parentobj.attr("posting", "true")}
					if(settings.ajaxurl) {
						$.fn.Validform.sn.showmsg(tipmsg.p,settings.tiptype,{obj:$(this), type:2},settings.showmsg ? settings.showmsg: "alwaysshow");//传入“alwaysshow”则让提示框不管当前tiptye为1还是2都弹出;
						$.ajax({
							type: "POST",
							dataType:"json",
							url: settings.ajaxurl,
							data: $this.serialize(),
							success: function(data){
								$.fn.Validform.sn.showmsg(data.info,settings.tiptype,{obj:$(this), type:2},settings.showmsg ? settings.showmsg: "alwaysshow");
								(settings.callback)(data);
                                parentobj.attr("posting", "false");
							}
						});
						return false;
                    }else{
                        $this.get(0).submit();
                    }
                }

            }

            settings.btnSubmit && $this.find(settings.btnSubmit).bind("click",subform);
            $this.submit(function(){

				    subform();

				return false;
			});
		})

		//预创建pop box;
		if(settings.tiptype!=2 || settings.ajaxurl){
			creatMsgbox();
		}

	}

	$.fn.Validform.sn={
		defaults:{
			tiptype:1
		},

		regcheck:function(type,gets){
			switch(type){
				case "*":
					return true;
					var repost= /[^\s]{6,16}/;
					return repost.test(gets);
				case "n":
					return !isNaN(gets);
				case "s":
					return isNaN(gets);
				case "s6-18":
					var repost= /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{6,18}$/;
					return repost.test(gets);
				case "p":
					var repost= /^[0-9]{6}$/;
					return repost.test(gets);
				case "m":
					var repost= /^13[0-9]{1}[0-9]{8}$|15[0189]{1}[0-9]{8}$|18[2689]{1}[0-9]{8}$/;
					return repost.test(gets);
				case "e":
					var repost = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
					return repost.test(gets);

				default:
                    //长度匹配
                    if(type.substr(0, 1) == '*') {
                        var splitIndex = type.indexOf('-');
                        var minLength = parseInt(type.substr(1, splitIndex-1));
                        var maxLength = parseInt(type.substr(splitIndex+1));
                        return gets.length>=minLength && gets.length<=maxLength;
                    }
                    //数字长度匹配
                    if(type.substr(0, 1) == 'n') {
                        var splitIndex = type.indexOf('-');
                        var minLength = parseInt(type.substr(1, splitIndex-1));
                        var maxLength = parseInt(type.substr(splitIndex+1));
                        var repost= /^[0-9]{parseInt(minLength), parseInt(maxLength)}$/;
                        return repost.test(gets);
                    }
                    //字符串长度匹配
                    if(type.substr(0, 1) == 's') {
                        var splitIndex = type.indexOf('-');
                        var minLength = parseInt(type.substr(1, splitIndex-1));
                        var maxLength = parseInt(type.substr(splitIndex+1));
                        return gets.length>=minLength && gets.length<=maxLength;
                    }
                    //正则表达式匹配
                    if(type.substr(0, 1) == '!') {
                        var repost = eval(type.substr(1));
                        return !repost.test(gets);
                    }
                    if(type.substr(0, 1) == 'r') {
                        var repost = eval(type.substr(1));
                        return repost.test(gets);
                    }
                    return false;
            }
        },

    showmsg:function(msg,type,o,show){//o:{obj:当前对象, type:1=>正在检测 | 2=>通过}, show用来判断tiptype=1的情况下是否弹出信息框;

			if(errorobj){errorobj.addClass("Validform_error");}

			if(type==1 || show=="alwaysshow"){
				msgobj.find(".Validform_info").html(msg);
			}

			if(type==1 && show!="hide" || show=="alwaysshow") {
				msghidden=false;
				msgobj.find(".iframe").css("height",msgobj.height());
				var left=($(window).width()-msgobj.width())/2;
				var top=($(window).height()-msgobj.height())/2;
                left = left - 200 > 0 ? left - 200 : left;
				top=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(top>0?top:0);
				msgobj.css({
					"left":left
				}).show().animate({
					top:top
				},100);
                msgobj.focus();
			}
			if(type==2) {
                var tip = getTip(o.obj);
				if(o.type) {

					switch(o.type){
						case 1://正在检测;
							tip.removeClass().addClass("Validform_checktip Validform_loading").text(msg);
							break;
						case 2://检测通过;
                            if(tip.showRightImg) {
                                tip.removeClass().addClass("Validform_checktip Validform_right").text(msg);
                            } else {
                                tip.removeClass().addClass("Validform_checktip").text(msg);
                            }

					}
				} else{
					tip.removeClass().addClass("Validform_wrong Validform_checktip").text(msg);
				}
			}

		},

		checkform:function(obj, parentobj, tiptype, show) {//show用来判断是表达提交还是blur事件引发的检测;

            var errormsg=obj.attr("errormsg") || tipmsg.w;

			if(obj.is("[datatype='radio']")){  //判断radio表单元素;
				var inputname=obj.attr("name");
				var radiovalue=parentobj.find(":radio[name="+inputname+"]:checked").val();
				if(!radiovalue){
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
				errorobj=null;
				this.showmsg(tipmsg.r,tiptype,{obj:obj,type:2},"hide");
				return "radio";
			}

			if(obj.is("[datatype='checkbox']")) {  //判断checkbox表单元素;
				var inputname=obj.attr("name");
				var checkboxvalue=parentobj.find(":checkbox[name="+inputname+"]:checked").val();
				if(!checkboxvalue) {
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
				errorobj=null;
				this.showmsg(tipmsg.r,tiptype,{obj:obj,type:2},"hide");
				return "checkbox";
			}

			if(obj.is("[datatype='select']")){  //判断select表单元素;
				if(!obj.val()){
				  errorobj=obj;
				  this.showmsg(errormsg,tiptype,{obj:obj},show);
				  return false;
				}
				errorobj=null;
				this.showmsg(tipmsg.r,tiptype,{obj:obj,type:2},"hide");
				return "select";
			}

			var defaultvalue=obj.attr("tip");
			if((obj.val()=="" || obj.val()==defaultvalue) && obj.attr("ignore")!="ignore"){
				errorobj=obj;
				this.showmsg(obj.attr("nullmsg") || tipmsg.s,tiptype,{obj:obj},show);
				return false;
			}

			if(obj.attr("recheck")){
				var theother=parentobj.find("input[name="+obj.attr("recheck")+"]:first");
				if(obj.val()!=theother.val()){
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
			}

			obj.removeClass("Validform_error");
			errorobj=null;
			return true;
		}

	}

	//公用方法显示&关闭信息提示框;
	$.Showmsg=function(msg){
		creatMsgbox();
		$.fn.Validform.sn.showmsg(msg,1);
	};
	$.Hidemsg=function(){
		msgobj.hide();
		msghidden=true;
	}


    function getTip(o) {
        var tip = o.parent().find(".Validform_checktip");
        if(tip.length == 0) {
            tip = o.parent().parent().find(".Validform_checktip");
        }

        if(tip.length == 0) {
           tip = $(".Validform_checktip");
           tip.showRightImg = false;
        } else {
            tip.showRightImg = true;
        }
        return tip;
    }

})(jQuery);


/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


function leapYear(year, month) {
    switch (parseInt(month)) {
        case 2:
            return ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            return 31;
    }
}

function changeDay(yearObj, monthObj, dayObj) {
    dayObj.options.length = 0;
    for (var i = 1; i <= leapYear(yearObj.value, monthObj.value); i++)
        dayObj.options.add(new Option(i, i));

    if (monthObj.value == iDate.getMonth() + 1 && yearObj.value == iDate.getFullYear())
        dayObj.selectedIndex = iDate.getDate() - 1;
}

function createDateSelect(y, m, d) {
    document.write('<select id="year" name="year" class="select" onchange="changeDay(this, document.getElementById(\'month\'), document.getElementById(\'day\'))">');
    for (var i = 0; i <= 100; i++)
        document.write('<option value="' + (iDate.getFullYear() - i) + '"' + (iDate.getFullYear() - i == y ? ' selected="selected"' : '') + '>' + (iDate.getFullYear() - i) + '</option>');
    document.write('</select>&nbsp;年&nbsp;&nbsp;');

    document.write('<select id="month" name="month" class="select" onchange="changeDay(this, document.getElementById(\'month\'), document.getElementById(\'day\'))">');

    for (var i = 1; i < 13; i++)
        document.write('<option value="' + i + '"' + (i == m ? ' selected="selected"' : '') + '>' + i + '</option>');
    document.write('</select>&nbsp;月&nbsp;&nbsp;');

    document.write('<select id="day" name="day" class="select">');
    for (var i = 1; i <= leapYear(iDate.getFullYear(), iDate.getMonth() + 1); i++)
        document.write('<option value="' + i + '"' + (i == d ? ' selected="selected"' : '') + '>' + i + '</option>');
    document.write('</select>&nbsp;日');
}

//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera.


var scrolltotop={
	//startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
	//scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
	setting: {startline:100, scrollto: 0, scrollduration:1000, fadeduration:[500, 100]},
	controlHTML: '<div class="scroll_to_top" style="width:48px; height:48px;float: left;"></div>', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
	controlattrs: {offsetx:5, offsety:5}, //offset of control relative to right/ bottom of window corner
	anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

	state: {isvisible:false, shouldvisible:false},

	scrollup:function(){
		if (!this.cssfixedsupport) //if control is positioned using JavaScript
			this.$control.css({opacity:0}) //hide control immediately after clicking it
		var dest=isNaN(this.setting.scrollto)? this.setting.scrollto : parseInt(this.setting.scrollto)
		if (typeof dest=="string" && jQuery('#'+dest).length==1) //check element set by string exists
			dest=jQuery('#'+dest).offset().top
		else
			dest=0
		this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
	},

	keepfixed:function(){
		var $window=jQuery(window)
		var controlx=$window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
		var controly=$window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety
		this.$control.css({left:controlx+'px', top:controly+'px'})
	},

	togglecontrol:function(){
		var scrolltop=jQuery(window).scrollTop()
		if (!this.cssfixedsupport)
			this.keepfixed()
		this.state.shouldvisible=(scrolltop>=this.setting.startline)? true : false
		if (this.state.shouldvisible && !this.state.isvisible){
			this.$control.stop().animate({opacity:1}, this.setting.fadeduration[0])
			this.state.isvisible=true
		}
		else if (this.state.shouldvisible==false && this.state.isvisible){
			this.$control.stop().animate({opacity:0}, this.setting.fadeduration[1])
			this.state.isvisible=false
		}
	},

	init:function(){
		jQuery(document).ready(function($){
			var mainobj=scrolltotop
			var iebrws=document.all
			mainobj.cssfixedsupport=!iebrws || iebrws && document.compatMode=="CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
			mainobj.$body=(window.opera)? (document.compatMode=="CSS1Compat"? $('html') : $('body')) : $('html,body')
			mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+'</div>')
				.css({position:mainobj.cssfixedsupport? 'fixed' : 'absolute', bottom:mainobj.controlattrs.offsety, right:mainobj.controlattrs.offsetx, opacity:0, cursor:'pointer'})
				.attr({title:'返回顶部'})
				.click(function(){mainobj.scrollup(); return false})
				.appendTo('body')
			if (document.all && !window.XMLHttpRequest && mainobj.$control.text()!='') //loose check for IE6 and below, plus whether control contains any text
				mainobj.$control.css({width:mainobj.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
			mainobj.togglecontrol()
			$('a[href="' + mainobj.anchorkeyword +'"]').click(function(){
				mainobj.scrollup()
				return false
			})
			$(window).bind('scroll resize', function(e){
				mainobj.togglecontrol()
			})
		})
	}
}

scrolltotop.init();

(function($) {
    $.fn.jCarouselLite = function(o) {
        o = $.extend({
            btnPrev: null, btnNext: null, btnGo: null, mouseWheel: false, auto: null, speed: 200, easing: null, vertical: false, circular: true, visible: 3, start: 0, scroll: 1, beforeStart: null, play: true,
            afterEnd: null
        }, o || {});
        return this.each(function() {
            var b = false, animCss = o.vertical ? "top" : "left", sizeCss = o.vertical ? "height" : "width";
            var c = $(this), ul = $("ul", c), tLi = $("li", ul), tl = tLi.size(), v = o.visible;
            ul.bind("mouseover", function() {
                if (o.play) {
                    o.play = false;
                }
            })
            ul.bind("mouseout", function() {
                if (!o.play) {
                    o.play = true;
                }
            })
            if (o.circular) {
                ul.prepend(tLi.slice(tl - v - 1 + 1).clone()).append(tLi.slice(0, v).clone());
                o.start += v
            }
            var f = $("li", ul), itemLength = f.size(), curr = o.start; c.css("visibility", "visible");
            f.css({ overflow: "hidden", float: o.vertical ? "none" : "left" });
            ul.css({ margin: "0", padding: "0", position: "relative", "list-style-type": "none", "z-index": "1" });
            c.css({ overflow: "hidden", position: "relative", "z-index": "2", left: "0px" });
            var g = o.vertical ? 115 : 110;
            var h = g * itemLength;
            var j = g * v; f.css({ width: 110, height: 115});
            ul.css(sizeCss, h + "px").css(animCss, -(curr * g));
            c.css(sizeCss, j + "px");
            if (o.btnPrev) $(o.btnPrev).click(function() {
                return go(curr - o.scroll)
            });
            if (o.btnNext) $(o.btnNext).click(function() {
                return go(curr + o.scroll)
            });
            if (o.btnGo) $.each(o.btnGo, function(i, a) {
                $(a).click(function() { return go(o.circular ? o.visible + i : i) })
            });
            if (o.mouseWheel && c.mousewheel) c.mousewheel(function(e, d) {
                return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll)
            });
            if (o.auto) {
                setInterval(AutoPlay, o.auto + o.speed);
            }
            function vis() {
                return f.slice(curr).slice(0, v)
            };
            function AutoPlay() { if (o.play) { go(curr + o.scroll); } };
            function go(a) {
                if (!b) {
                    if (o.beforeStart) o.beforeStart.call(this, vis());
                    if (o.circular) {
                        if (a <= o.start - v - 1) {
                            ul.css(animCss, -((itemLength - (v * 2)) * g) + "px");
                            curr = a == o.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - o.scroll
                        }
                        else if (a >= itemLength - v + 1) {
                            ul.css(animCss, -((v) * g) + "px");
                            curr = a == itemLength - v + 1 ? v + 1 : v + o.scroll
                        }
                        else
                            curr = a
                    }
                    else {
                        if (a < 0 ) {
                            $(o.btnPrev).attr("title", "再往前没有了！");
                            return;
                        }
                        else if(a > itemLength - v) {
                            $(o.btnNext).attr("title", "再往后没有了！");
                            return;
                        } else {
                            $(o.btnPrev).attr("title", "往前");
                            $(o.btnNext).attr("title", "往后");
                            curr = a
                        }
                    }
                    b = true;
                    ul.animate(animCss == "left" ? { left: -(curr * g)} : { top: -(curr * g) }, o.speed, o.easing, function() {
                        if (o.afterEnd) o.afterEnd.call(this, vis()); b = false
                    });
                    if (!o.circular) {
                        $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                        $((curr - o.scroll < 0 && o.btnPrev) || (curr + o.scroll > itemLength - v && o.btnNext) || []).addClass("disabled")
                    }
                } return false
            }
        })
    };
    function css(a, b) { return parseInt($.css(a[0], b)) || 0 };
    function width(a) { return a[0].offsetWidth + css(a, 'marginLeft') + css(a, 'marginRight') };
    function height(a) { return a[0].offsetHeight + css(a, 'marginTop') + css(a, 'marginBottom') }

})(jQuery);

    function checkPassword(pwd) {
	    var objLow = $("#pwdLow");
	    var objMed = $("#pwdMed");
	    var objHi = $("#pwdHi");

        objLow.removeClass();
        objMed.removeClass();
        objHi.removeClass();
        objLow.addClass("pwd-strength-unselect");
        objMed.addClass("pwd-strength-unselect");
        objHi.addClass("pwd-strength-unselect");

	    if(pwd.length < 6) {
            objLow.removeClass();
	    	objLow.addClass("pwd-strength-select");
	    } else {
		    var p1= (pwd.search(/[a-zA-Z]/)!=-1) ? 1 : 0;
		    var p2= (pwd.search(/[0-9]/)!=-1) ? 1 : 0;
		    var p3= (pwd.search(/[-_]/)!=-1) && pwd.length >= 8 ? 1 : 0;

		    var pa=p1+p2+p3;
		    if(pa>=1) {
                objLow.removeClass();
		    	objLow.addClass("pwd-strength-select");
		    }
            if(pa>=2) {
                objMed.removeClass();
		    	objMed.addClass("pwd-strength-select");
		    }
            if(pa>=3) {
                objHi.removeClass();
		    	objHi.addClass("pwd-strength-select");
		    }
	    }
}

function addToFavorite() {
    var url = ssonlineUrl;var title = "私塾在线-专业视频课程服务";var error = "对不起，您的浏览器不支持此操作!\n请使用菜单栏或Ctrl+D收藏本站!";
    if(document.all){window.external.AddFavorite(url, title)}else if(window.sidebar){window.sidebar.addPanel(title,url,"")}else {alert(error)}
}

//站内收藏
var favoriteURL = ctx + "/favorite/add";
function favorite(subSystem, subSystemUuid) {
    	var url = favoriteURL + "?callback=?&favorite.subSystem="+subSystem;
    	url = url + "&favorite.subSystemUuid="+subSystemUuid;
    	$.getJSON(url, function(data){
    		$.Showmsg(data.info);
    	});
}


$.ajaxSetup ({
cache: false //close AJAX cache
});




function viewTime(totalTimeId, id){
    var totalTime = eval(totalTimeId);
    if(totalTime >= 0){
        var day=Math.floor((totalTime/3600)/24)
        var hour=Math.floor((totalTime-day*24*3600)/3600);
        var month=Math.floor((totalTime-day*24*3600-hour*3600)/60);
        var second=(totalTime-hour*3600)%60;
        var text = "还剩";
        if(day!=0) text += "[<span>"+day+"</span>]天";
        if(day!=0 || hour!=0) text += "[<span>"+hour+"</span>]小时";
        if(day!=0 || hour!=0 || month!=0) text += "[<span>"+month+"</span>]分";
        if(day==0) text += "[<span>"+second+"</span>]秒";
        text += "结束";
        $("#"+id).html(text);
        totalTime--;
        eval(totalTimeId+"="+totalTime)
    }
    else{
        $("#"+id).html("已结束");
        clearInterval(eval(id));
    }
}

function showFavorable() {
		var favorableShowComp = document.getElementById("favorableShow");
		var favorableShowBtnComp = document.getElementById("favorableShowBtn");
		if(favorableShowComp.style.display == 'none') {
			favorableShowComp.style.display = '';
			favorableShowBtnComp.innerHTML= '-';
		}
		else {
			favorableShowComp.style.display = 'none';
			favorableShowBtnComp.innerHTML= '+';
		}
	}

function showTicket() {
		var ticketShowComp = document.getElementById("ticketShow");
		var ticketShowBtnComp = document.getElementById("ticketShowBtn");
		if(ticketShowComp.style.display == 'none') {
			ticketShowComp.style.display = '';
			ticketShowBtnComp.innerHTML= '-';
		}
		else {
			ticketShowComp.style.display = 'none';
			ticketShowBtnComp.innerHTML= '+';
		}
}

function showCart() {
		var cartShowComp = document.getElementById("cartShow");
		var cartShowBtnComp = document.getElementById("cartShowBtn");
		if(cartShowComp.style.display == 'none') {
			cartShowComp.style.display = '';
			cartShowBtnComp.innerHTML= '-';
		}
		else {
			cartShowComp.style.display = 'none';
			cartShowBtnComp.innerHTML= '+';
		}
}

function useAccount(accountComp) {
    if(accountComp.checked) {
        accountComp.value="true";
    } else {
        accountComp.value="false";
    }
    computeShowMoney();
}

function selectCart(uuid) {
    computeShowMoney();
}

function cancelStudyTicket(uuid) {
    $("#studyTicketUuid_div_"+uuid).css("background", "");
    $("#studyTicketUuid_cancel_"+uuid).css("display", "none");
    $("#studyTicketUuid_"+uuid).attr("checked", "");
    computeShowMoney();
}

//学券
function selectStudyTicket(studyTicket, uuid) {
        //高亮
        $("[name=studyTicketUuid_div]").css("background", "");
        $("[name=studyTicketUuid_cancel]").css("display", "none");
        $("#studyTicketUuid_div_"+uuid).css("background", "#CCC");
        $("#studyTicketUuid_cancel_"+uuid).css("display", "");
        computeShowMoney();
}

//知券
function selectKnowTicket(knowTicket, uuid) {
    computeShowMoney();
}

function computeShowMoney() {
    //总金额
    var totalMoneyComp = $("#totalMoney");
    var totalMoney = parseFloat(totalMoneyComp.text());
    var realTotalMoney = totalMoney;
    var cartMoney = 0;
    var accountMoney = 0;
    var ticketMoney = 0;
    var ticketCount = 0;
    //1、计算学券
    var studyTicketComps = $("[name=wm.studyTicketUuids]");
    studyTicketComps.each(function(){
        if(this.checked) {
            ticketMoney = ticketMoney + parseFloat($(this).attr("canUse"));
            ticketCount = ticketCount + 1;
        }
    });
    //2、计算知券
    var studyTicketComps = $("[name=wm.knowTicketUuids]");
    studyTicketComps.each(function(){
        if(this.checked) {
            ticketMoney = ticketMoney + parseFloat($(this).attr("canUse"));
            ticketCount = ticketCount + 1;
        }
    });
    realTotalMoney = totalMoney - ticketMoney;
    if(ticketMoney > totalMoney) {
        realTotalMoney = 0;
        alert("您使用过多的优惠券进行支付，将浪费["+ (ticketMoney - totalMoney).toFixed(2)+"]学币。");
    }
    //3、计算年卡月卡
    var cartComps = $("[name=wm.cartUuids]");
    cartComps.each(function() {

        var usedCartMoney = parseFloat($(this).attr("used"));
        var canUseCartMoney = parseFloat($(this).attr("canUse"));
        //还原
        var canUseCartMoney = canUseCartMoney + usedCartMoney;
        var usedCartMoney = 0;
        if(this.checked) {
            if(realTotalMoney > 0) {
                 usedCartMoney = realTotalMoney >= canUseCartMoney ? canUseCartMoney :  realTotalMoney;
                 canUseCartMoney = canUseCartMoney - usedCartMoney;
            }
            realTotalMoney = realTotalMoney - usedCartMoney;
            cartMoney = cartMoney + usedCartMoney;
        }
        $(this).attr("used", usedCartMoney);
        $(this).attr("canUse", canUseCartMoney);
        $("#usedCartMoneyDisplay_"+this.value).html(usedCartMoney.toFixed(2)+"学币");
        $("#canUseCartMoneyDisplay_"+this.value).html(canUseCartMoney.toFixed(2)+"学币");

    });

    //4、账户余额
    var accountComps = $("[name=wm.useAccountMoney]");
    accountComps.each(function() {

        var usedAccountMoney = parseFloat($(this).attr("used"));
        var canUseAccountMoney = parseFloat($(this).attr("canUse"));
        //还原
        canUseAccountMoney = canUseAccountMoney + usedAccountMoney;
        usedAccountMoney = 0;
        if(this.checked) {
            if(realTotalMoney > 0) {
                usedAccountMoney = realTotalMoney >= canUseAccountMoney ? canUseAccountMoney :  realTotalMoney;
                canUseAccountMoney = canUseAccountMoney - usedAccountMoney;
            }
            realTotalMoney = realTotalMoney - usedAccountMoney;
            accountMoney = accountMoney + usedAccountMoney;
        }
        $(this).attr("used", usedAccountMoney);
        $(this).attr("canUse", canUseAccountMoney);
        $("#usedAccountMoneyDisplay").html(usedAccountMoney.toFixed(2)+"学币");
        $("#canUseAccountMoneyDisplay").html(canUseAccountMoney.toFixed(2)+"学币");
    });
    //总金额显示
    $("#totalMoneyDisplay").html(realTotalMoney.toFixed(2) + "学币");
    //年卡月卡显示
    $("#cartTotalMoneyDisplay").html(cartMoney.toFixed(2) + "学币");
    //账户显示
    $("#accountTotalMoneyDisplay").html(accountMoney.toFixed(2) + "学币");
    //优惠券数量显示
    $("#ticketCountDisplay").html(ticketCount);
    //优惠券显示
    $("[name=ticketDiscountDisplay]").html(ticketMoney.toFixed(2) + "学币");


}


function selectTag(id) {
        $("[name='select']").attr("class", "");
        $("#select" + id).attr("class", "selecttag_blue");

        $("[name='scroll']").hide();
        $("#scroll"+id).show();
}

function toConfirm(msg, url) {

    if(confirm(msg)) {
        top.window.location.href = url;
    }
}

var submitTemplate = "<div class='in_ope'><img src='"+ctx+"/common/images/loading.gif' alt=''/><span id='submit_info'>{msg}</span></div>";
//正在提交订单，请等待！
function toSubmit(btn, msg, fullMsg) {
    if(msg == "" || msg == null || msg == undefined) {
        msg = "正在执行操作！";
    }
	if(fullMsg) {
		new Boxy($("#"+msg).html(), {modal: true,closeText:""});
	} else {
		new Boxy(submitTemplate.replace("{msg}", msg), {modal: true,closeText:""});
	}
    
}

function countUnReadedMsg(containerId) {
    var url = ctx + "/msg/unReaded/count?callback=?";
    $.getJSON(url, function(data) {
        try {
            if(parseInt(data.info) > 0) {
                var t = setInterval(function(){
                    var msg = $("#top_msg");var cls = msg.attr("class");
                    if(cls == 'msg') {msg.removeClass('msg').addClass('msg_hidden');} else {msg.removeClass('msg_hidden').addClass('msg');}
                },1000);
                $("#" + containerId).html("(<font color='red'>" + data.info + "</font>)");
            }
        }catch(e){}

    });
}

function countTicket(containerId) {
    var url = ctx + "/ticket/unused/count";
    $.getJSON(url, function(data){
        if(data.info == "0") {
            $("#" + containerId).html("");
        } else {
            $("#" + containerId).addClass("red");
            $("#" + containerId).html("(" + data.info + ")");
        }
    });
}

function countBBSTopics(containerId, customerId) {
    var url = forumCtx + "/ajaxInfo/countBBSTopics.html?callback=?&customerId="+customerId;
    $.getJSON(url, function(data) {
        $("#" + containerId).html("(" + data.info + ")");
    });
}

function countBlogTopics(containerId, customerId) {
    var url = forumCtx + "/ajaxInfo/countBlogTopics.html?callback=?&customerId="+customerId;
    $.getJSON(url, function(data) {
        $("#" + containerId).html("(" + data.info + ")");
    });
}


function absPos(node){
    var x=y=0;
    x += $(node).offset().left;
    y += $(node).offset().top;
    return  {'x':x, 'y':y};
}

var customerIndexUrl = ctx + "/customer?customerUuid={id}";
var msgUrl = ctx + "/msg/send?sm.receiveCustomer.uuid={id}";
var questionUrl = ctx + "/qa/";
var blogUrl = forumCtx + "/blogAdmin/list.html?customer_id={id}";
var bbsUrl = forumCtx + "/blogPost/listByUser/-1000.html?customer_id={id}";
function triggerCustomerBar(id, img, currentBtn) {

    var userTip = $('#user_tip');
    userTip.find("img").attr("src", ctx + "/common/images/none_1_1.gif");

    var offset = absPos(currentBtn) ;
    userTip.css("position", "absolute");
    var x = offset.x - 100 > 0 ? offset.x - 100 : offset.x;
    var y = offset.y - 10 > 0 ? offset.y - 10 : offset.y;

    userTip.css("top", (y) + 'px');
    userTip.css("left", (x) + 'px');

    userTip.find("img").attr("src", img);
    userTip.find("#customer_btn_index").attr("target", "_blank").attr("href", customerIndexUrl.replace("{id}", id));
    userTip.find("#customer_btn_index2").attr("target", "_blank").attr("href", customerIndexUrl.replace("{id}", id));
    userTip.find("#customer_btn_msg").attr("target", "_blank").attr("href", msgUrl.replace("{id}", id));
    userTip.find("#customer_btn_ask").attr("target", "_blank").attr("href", msgUrl.replace("{id}", id));
    userTip.find("#customer_btn_question").attr("target", "_blank").attr("href", questionUrl.replace("{id}", id));
    userTip.find("#customer_btn_blog").attr("target", "_blank").attr("href", blogUrl.replace("{id}", id));
    userTip.find("#customer_btn_bbs").attr("target", "_blank").attr("href", bbsUrl.replace("{id}", id));

    userTip.fadeIn();

    userTip.hover(function(){}, function(){$(this).fadeOut()});
}


var roadMapTemplate = "<center><a href='{url}' class='tip'  target='_blank' style='color:#F36523;'>{name}</a><font>（点击去学习）</font></center><br>☆内容：<br><font>{content}</font><br><br>☆建议学习时间：<font>{studyTime}</font>";
function triggerRoadMapTip(name, url, content, studyTime, tag, btnObj) {
    var roadMapTip = $('#roadmap_tip');
    roadMapTip.html(roadMapTemplate.replace("{name}", name).replace("{url}", url).replace("{content}", content).replace("{studyTime}", studyTime));
    btnObjClone = btnObj.clone(true);
    btnObjClone.show();
    btnObjClone.insertAfter(roadMapTip.find('center'));

    var offset = absPos(tag) ;
    roadMapTip.css("position", "absolute");
    var x = offset.x - 100 > 0 ? offset.x - 100 : offset.x;
    var y = offset.y - 10 > 0 ? offset.y - 10 : offset.y;

    roadMapTip.css("top", (y-10) + 'px');
    roadMapTip.css("left", (x+70) + 'px');

    roadMapTip.show();

    roadMapTip.hover(function(){}, function(){$(this).hide()});
}


/*ie f5 锚*/
$(function(){
    var url = window.location.toString();
    var id = url.split("#")[1];
    if(id){
        var t = $("#"+id).offset().top;
        $(window).scrollTop(t);
    }
});



/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.3-pre
 */

(function($){

$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });

// old alias
$.fn.bgIframe = $.fn.bgiframe;

function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}

})(jQuery);


function incrementCreativingCommitCount(uuid){

    $.getJSON(ctx + "/product/creativing/" + uuid, function(data){$.Showmsg("加快进度成功！当前已有"+data.info+"人提交进度请求！");$('#commitCount').text(data.info)});
}

function commitCreateCourseRequest(value) {
    $.post(ctx + "/product/request", {"value":value}, function(){$.Showmsg("提交制作课程请求成功，私塾在线会优先考虑制作相关课程！");});
}

function checkin() {
    $.getJSON(ctx + "/checkin",
            function(data){
                if(data.status=='n'){$.Showmsg(data.info);}
                else {$.Showmsg("签到成功，赠送您10积分！");$("#checkinCount").text(data.info);}
            }
    );
}

function loadCheckinCount() {
    var url = ctx + "/checkin/count";
    $.getJSON(url, function(data) {
        $("#checkinCount").html( data.info );
    });
}


function initFloatHuodong() {
  var _float_move=false;//移动标记
  var _float_x,_float_y;//鼠标离控件左上角的相对位置

  $("#float_div").mousedown(function(e){
      _float_move=true;
      _float_x=e.pageX-parseInt($("#float_div").css("left"));
      _float_y=e.pageY-parseInt($("#float_div").css("top"));
      $("#float_div").css("z-index", "99999");
      $("#float_div").css("cursor", "move");
      $("#float_div").fadeTo(20, 0.25);//点击后开始拖动并透明显示
  });
  $(document).mousemove(function(e){
      if(_float_move){
          var x=e.pageX-_float_x;//移动时根据鼠标位置计算控件左上角的绝对位置
          var y=e.pageY-_float_y;
          $("#float_div").css({top:y,left:x});//控件新位置
      }
  }).mouseup(function(){
      _float_move=false;
      $("#float_div").css("z-index", "100");
      $("#float_div").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
});
}

function jsclicka(id){
    if(document.all)  //this is for ie and firefox
    {
        document.getElementById(id).click();
    }
    else  //this is for chrome
    {
        var event= document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        document.getElementById(id).dispatchEvent(event);
    }
}
