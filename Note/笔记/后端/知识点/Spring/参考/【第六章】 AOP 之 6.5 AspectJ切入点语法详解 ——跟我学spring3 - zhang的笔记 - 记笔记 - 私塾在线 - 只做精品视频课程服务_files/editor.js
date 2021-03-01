function newEditor(name) {
	tinyMCE.init({
		mode : "exact",
		theme : "advanced",
		elements : name,
		auto_resize:true,
		extended_valid_elements: "textarea[name|class|cols|rows],pre[cols|rows|disabled|name|readonly|class]",   
	    remove_linebreaks : false, 
	    plugins : 'autolink,lists,style,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,syntaxhl',
		skin : "o2k7",
		skin_variant : "silver",
	    theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

	    theme_advanced_buttons1_add : "fontselect,fontsizeselect,zoom",
	    theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,charmap,emotions,iespell,media,|,forecolor,backcolor",
	    theme_advanced_buttons3_add_before : "tablecontrols",
	    theme_advanced_buttons3_add : "blockquote,|,syntaxhl,|,code,preview,fullscreen,|,restoredraft",
			formats : {
				alignleft : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'left'},
				aligncenter : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'center'},
				alignright : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'right'},
				alignfull : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'full'},
				bold : {inline : 'span', 'classes' : 'bold'},
				italic : {inline : 'span', 'classes' : 'italic'},
				underline : {inline : 'span', 'classes' : 'underline', exact : true},
				strikethrough : {inline : 'del'}
			},
		    theme_advanced_styles : "代码=codeStyle;引用=quoteStyle",
		    theme_advanced_fonts:"宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆; Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
		    add_unload_trigger : false,
		    inline_styles : false,
		    convert_fonts_to_spans : false,
		    convert_urls : false,
			language:"zh-cn",
            content_css : "/tinymce/css/content.css"
		});

	  dp.SyntaxHighlighter.ClipboardSwf = '/tinymce/syntaxHighlighter/Scripts/clipboard.swf';
	  dp.SyntaxHighlighter.HighlightAll("code");
}


function highlightAll() {
	dp.SyntaxHighlighter.ClipboardSwf = '/tinymce/syntaxHighlighter/Scripts/clipboard.swf';
    dp.SyntaxHighlighter.HighlightAll("code");
}

function insertImage(file) {
	args = {};
	tinymce.extend(args, {
		src : file,
		alt : ""
	});
	var ed = tinyMCE.editors[0];
	ed.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo : 1});
	ed.dom.setAttribs('__mce_tmp', args);
	ed.dom.setAttrib('__mce_tmp', 'id', '');
	ed.undoManager.add();
	ed.execCommand('mceRepaint');
	ed.focus();
}

function deleteFile(id, deleteUrl, fileName) {
    if(confirm("确定删除【"+fileName+"】吗?")) {
    	$.ajax({
    		type:"GET",
    		url:deleteUrl,
    		async:true,
    		success: function(msg){
    			document.getElementById("attachment_"+id).innerHTML = msg;
    		}
    	});

    	document.getElementById("uploading_"+id).style.display="";


    }
}