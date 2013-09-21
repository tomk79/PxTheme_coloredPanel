(function(){
	var status = 0;


	function convertString2ASCII(str) {
		var rtn = '';
		if( str.length>0 ){
			for( var i = 0; i < str.length; i++ ){
				rtn += str.charCodeAt(i);
			}
		}
		return rtn;
	}

	$(window).load(function(){
		$.pxjax({
			'beforeSend': function(){
				// console.log('pxjax:beforeSend');
				status = 1;
				$('.theme_outline').fadeOut('fast',function(){
					status = 2;
					$.pxjaxTrigger('send');
				});
			} ,
			'error': function(){
				$.pxjaxTrigger('complete');
			} ,
			'complete': function(){
				if( status != 2 ){
					// console.log(status);
					return;
				}
				// console.log('complete');
				status = 3;
				window.scroll(0,0);

				var hue = Math.floor( Math.random() * 100 );
				var hue = convertString2ASCII( document.title )/7313666355%100;
				// console.log(hue);
				var rgbHex = $.color_hsb2hex(hue,60,100);
				// console.log('rgb('+Math.round(rgb['r'])+','+Math.round(rgb['g'])+','+Math.round(rgb['b'])+')');
				$('body').css({ 'background-color':rgbHex });

				$('.theme_outline').fadeIn('slow', function(){
					status = 0;
				});
			} ,
			'target':[
				'#content',
				'.breadcrumb',
				'h1',
				'.theme_localnavi',
				'.theme_megafooter-inner'
			]
		});
	});

})();
