(function($){
	$.fn.themeFitTopImage = function(){
		var $this = $(this);
		var $thisImage = $('img', this);
		var imageOriginalInfo = {
			'width': $thisImage.width() ,
			'height': $thisImage.height()
		};
		imageOriginalInfo.aspect = imageOriginalInfo.width/imageOriginalInfo.height;

		function sizeAjust(){
			var windowInfo = {
				'width': $(window).width(),
				'height': $(window).height()
			};
			windowInfo.aspect = windowInfo.width/windowInfo.height;
// console.log(imageOriginalInfo);
// console.log(windowInfo);

			$this.css({
				'width':windowInfo.width ,
				'height': windowInfo.height
			})

			if( windowInfo.aspect > imageOriginalInfo.aspect ){
				// 画面が横長
				// 画像の幅を合わせ、上下がはみ出す。
// console.log('horizontal');
				$thisImage.css({
					'width':windowInfo.width ,
					'height': windowInfo.width*imageOriginalInfo.aspect,
					'top':(windowInfo.height - windowInfo.width*imageOriginalInfo.aspect)/2,
					'left':0
				})

			}else{
				// 画面が縦長
				// 画像の高さを合わせ、横がはみ出す。
// console.log('vertical');
				$thisImage.css({
					'width':windowInfo.height*imageOriginalInfo.aspect ,
					'height': windowInfo.height,
					'top':0,
					'left':(windowInfo.width - windowInfo.height*imageOriginalInfo.aspect)/2
				})
			}

		}

		$this.css({
			'overflow':'hidden' ,
			'position': 'fixed',
			'max-width':'none',
			'max-height':'none'
		});
		$thisImage.css({
			'max-width':'none',
			'max-height':'none',
			'position':'absolute',
			'top':0,
			'left':0
		});
		sizeAjust();

		$(window).resize(function(){
			sizeAjust();
		});
	}
})(jQuery);
