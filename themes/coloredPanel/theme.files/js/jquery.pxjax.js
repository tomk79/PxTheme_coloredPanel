/**
 * jquery.pxjax.js
 * @author (C)Tomoya Koyanagi.
 */
(function($){
	var _conf = {};
	var _goTo = null;
	var _referer = document.referer;

	$.pxjax = function(conf){
		_conf = conf;
		$('body').pxjaxApply();

		$(window).on('popstate',function(e){
			// console.log('on BACK or FORWARD');
			// console.log(e);
			// console.log(_referer);
			// console.log(window.location.href);
			// console.log(window.location.hash);
			if( typeof(_referer) === typeof('') ){
				var url = _referer.replace(/\#(.*)$/, '');
				if(  url+window.location.hash == window.location.href ){
					return;
				}
			}

			goTo(window.location.href);
			$.pxjaxTrigger('popstate');
		});

	}

	$.pxjaxTrigger = function( eventName ){
		switch( eventName ){
			case 'beforeSend':
				if( typeof(_conf.beforeSend) === typeof(function(){}) ){
					return _conf.beforeSend();
				}else{
					$.pxjaxTrigger('send');
				}
				break;
			case 'send':
				send();
				break;
			case 'success':
				if( typeof(_conf.success) === typeof(function(){}) ){
					return _conf.success();
				}else{
					$.pxjaxTrigger('complete');
				}
				break;
			case 'error':
				if( typeof(_conf.error) === typeof(function(){}) ){
					return _conf.error();
				}else{
					$.pxjaxTrigger('complete');
				}
				break;
			case 'complete':
				if( typeof(_conf.complete) === typeof(function(){}) ){
					return _conf.complete();
				}
				break;
			case 'popstate':
				if( typeof(_conf.popstate) === typeof(function(){}) ){
					return _conf.popstate();
				}
				break;
		}
		return true;
	}

	$.fn.pxjaxApply = function(){
		var target = $(this);
		$('a', target).on('click', function(){
			if( !this.attributes.href ){ return true; }
			var hrefValue = this.attributes.href.value;
			if( hrefValue.indexOf('#',0) === 0 ){
				// アンカーはそのまま飛ばす。
				_referer = window.location.href;
				window.location.hash = hrefValue;
				return false;
			}else if( hrefValue.toLowerCase().indexOf('javascript:',0) === 0 ){
				// JSはそのまま実行。
				return true;
			}else if( hrefValue.match(new RegExp('^(?:[a-zA-Z0-9]+)\:\/\/','i')) ){
				// URLにリンク。そのまま飛ばす
				return true;
			}else if( hrefValue.indexOf('/',0) !== 0 ){
				// 絶対パスではない(=相対パス)
				var hrefCurrent = window.location.href;
				hrefCurrent = hrefCurrent.replace(/^(.*?)\#(?:.*)$/, '$1');
				hrefCurrent = hrefCurrent.replace(/^(.*)\/(?:.*?)$/, '$1/');
				hrefValue = hrefCurrent + './' + hrefValue;
			}
			_referer = window.location.href;
			window.history.pushState('state', 'title', hrefValue);
			// console.log(hrefValue);

			goTo(hrefValue)
			return false;
		});
	}

	function goTo(hrefValue){
		_goTo = hrefValue;
		$.pxjaxTrigger('beforeSend');
		return true;
	}

	function send(){
		$.ajax({
			url: _goTo,
			dataType: 'html',
			success: function(data){
				for( var index in _conf.target ){
					$(_conf.target[index]).html( $(_conf.target[index], data).eq(0).html() ).pxjaxApply();
				}
				var targetTitle = $('<xml>'+data+'</xml>').find('title').eq(0).text();
				document.title = targetTitle;
				$.pxjaxTrigger('success');
			},
			error: function(){
				$.pxjaxTrigger('error');
			},
			complete: function(){
				// console.log('complete');
			}
		});
		_goTo = null;
	}

})(jQuery);
