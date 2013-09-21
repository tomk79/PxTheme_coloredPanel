(function($){

	/**
	 * 文字列を数値に変換
	 */
	function intval(val){
		var type = typeof(val);
		if( type === typeof(0) ){
			return val;
		}
		if( type === typeof('') ){
			val = val.replace(/[^0-9]/, '');
			val = val.replace(/^0+/, '');
			return Number(val);
		}
		if( type === typeof([]) ){
			return val.length;
		}
		return val;
	}

	/**
	 * 数値かどうか調べる
	 */
	function is_int(val){
		if( typeof(val) !== typeof(0) ){
			return false;
		}
		return true;
	}

	/**
	 * 文字列かどうか調べる
	 */
	function is_string(val){
		if( typeof(val) !== typeof('') ){
			return false;
		}
		return true;
	}

	/**
	 * 文字数を調べる
	 */
	function strlen(val){
		if(val === null){ return 0; }
		if(val === undefined){ return 0; }
		val += '';
		return val.length;
	}

	/**
	 * 16進数の色コードからRGBの10進数を得る
	 */
	$.hex2rgb = function( $txt_hex ){
		if( is_int( $txt_hex ) ){
			$txt_hex = $txt_hex.toString(16);
			$txt_hex = '#'.str_pad( $txt_hex , 6 , '0' , STR_PAD_LEFT );
		}
		$txt_hex = preg_replace( '/^#/' , '' , $txt_hex );
		if( strlen( $txt_hex ) == 3 ){
			// 長さが3バイトだったら
			if( !preg_match( '/^([0-9a-f])([0-9a-f])([0-9a-f])$/si' , $txt_hex , $matched ) ){
				return	false;
			}
			$matched[1] = $matched[1].$matched[1];
			$matched[2] = $matched[2].$matched[2];
			$matched[3] = $matched[3].$matched[3];
		}else if( strlen( $txt_hex ) == 6 ){
			// 長さが6バイトだったら
			if( !preg_match( '/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/si' , $txt_hex , $matched ) ){
				return	false;
			}
		}else{
			return	false;
		}
		var $RTN = {
			// "r": eval( 'return 0x' + $matched[1].';' ) ,
			// "g": eval( 'return 0x' + $matched[2].';' ) ,
			// "b": eval( 'return 0x' + $matched[3].';' )
		};
		return	$RTN;
	}

	/**
	 * RGBの10進数の色コードから16進数を得る
	 */
	$.rgb2hex = function( $int_r , $int_g , $int_b ){
		var $hex_r = $int_r.toString(16);
		var $hex_g = $int_g.toString(16);
		var $hex_b = $int_b.toString(16);
		if( strlen( $hex_r ) > 2 || strlen( $hex_g ) > 2 || strlen( $hex_b ) > 2 ){
			return	false;
		}
		var $RTN = '#';
		$RTN += str_pad( $hex_r , 2 , '0' , STR_PAD_LEFT );
		$RTN += str_pad( $hex_g , 2 , '0' , STR_PAD_LEFT );
		$RTN += str_pad( $hex_b , 2 , '0' , STR_PAD_LEFT );
		return	$RTN;
	}

	/**
	 * 色相を調べる
	 */
	$.get_hue = function( $txt_hex , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $rgb = $.hex2rgb( $txt_hex );
		if( $rgb === false ){ return false; }

		// foreach( $rgb as $key=>$val ){
		// 	$rgb[$key] = $val/255;
		// }

		var $hue = 0;
		if( $rgb['r'] == $rgb['g'] && $rgb['g'] == $rgb['b'] ){
			return	0;
		}
		if( $rgb['r'] >= $rgb['g'] && $rgb['g'] >= $rgb['b'] ){
			// R>G>B
			$hue = 60 * ( ($rgb['g']-$rgb['b'])/($rgb['r']-$rgb['b']) );

		}else if( $rgb['g'] >= $rgb['r'] && $rgb['r'] >= $rgb['b'] ){
			// G>R>B
			$hue = 60 * ( 2-( ($rgb['r']-$rgb['b'])/($rgb['g']-$rgb['b']) ) );

		}else if( $rgb['g'] >= $rgb['b'] && $rgb['b'] >= $rgb['r'] ){
			// G>B>R
			$hue = 60 * ( 2+( ($rgb['b']-$rgb['r'])/($rgb['g']-$rgb['r']) ) );

		}else if( $rgb['b'] >= $rgb['g'] && $rgb['g'] >= $rgb['r'] ){
			// B>G>R
			$hue = 60 * ( 4-( ($rgb['g']-$rgb['r'])/($rgb['b']-$rgb['r']) ) );

		}else if( $rgb['b'] >= $rgb['r'] && $rgb['r'] >= $rgb['g'] ){
			// B>R>G
			$hue = 60 * ( 4+( ($rgb['r']-$rgb['g'])/($rgb['b']-$rgb['g']) ) );

		}else if( $rgb['r'] >= $rgb['b'] && $rgb['b'] >= $rgb['g'] ){
			// R>B>G
			$hue = 60 * ( 6-( ($rgb['b']-$rgb['g'])/($rgb['r']-$rgb['g']) ) );

		}else{
			return	0;
		}

		if( $int_round ){
			$hue = Math.round( $hue , $int_round );
		}else{
			$hue = intval( $hue );
		}
		return $hue;
	}

	/**
	 * 彩度を調べる
	 */
	$.get_saturation = function( $txt_hex , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $rgb = $.hex2rgb( $txt_hex );
		if( $rgb === false ){ return false; }

		sort( $rgb );
		var $minval = $rgb[0];
		var $maxval = $rgb[2];

		if( $minval == 0 && $maxval == 0 ){
			// 真っ黒だったら
			return	0;
		}

		var $saturation = ( 100-( $minval/$maxval * 100 ) );

		if( $int_round ){
			$saturation = Math.round( $saturation , $int_round );
		}else{
			$saturation = intval( $saturation );
		}
		return $saturation;
	}

	/**
	 * 明度を調べる
	 */
	$.get_brightness = function( $txt_hex , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $rgb = $.hex2rgb( $txt_hex );
		if( $rgb === false ){ return false; }

		sort( $rgb );
		var $maxval = $rgb[2];

		var $brightness = ( $maxval * 100/255 );

		if( $int_round ){
			$brightness = Math.round( $brightness , $int_round );
		}else{
			$brightness = intval( $brightness );
		}
		return $brightness;
	}

	/**
	 * 16進数のRGBコードからHSB値を得る
	 */
	$.hex2hsb = function( $txt_hex , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $hsb = {
			'h': $.get_hue( $txt_hex , $int_round ) ,
			's': $.get_saturation( $txt_hex , $int_round ) ,
			'b': $.get_brightness( $txt_hex , $int_round )
		};
		return	$hsb;
	}

	/**
	 * RGB値からHSB値を得る
	 */
	$.rgb2hsb = function( $int_r , $int_g , $int_b , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $txt_hex = $.rgb2hex( $int_r , $int_g , $int_b );
		var $hsb = {
			'h': $.get_hue( $txt_hex , $int_round ) ,
			's': $.get_saturation( $txt_hex , $int_round ) ,
			'b': $.get_brightness( $txt_hex , $int_round )
		};
		return	$hsb;
	}

	/**
	 * HSB値からRGB値を得る
	 */
	$.hsb2rgb = function( $int_hue , $int_saturation , $int_brightness , $int_round ){
		var $int_round = intval( $int_round );
		if( $int_round < 0 ){ return false; }

		var $int_hue = Math.round( $int_hue%360 , 3 );
		var $int_saturation = Math.round( $int_saturation , 3 );
		var $int_brightness = Math.round( $int_brightness , 3 );

// console.log($int_hue);
// console.log($int_saturation);
// console.log($int_brightness);

		var $maxval = Math.round( $int_brightness * ( 255/100 ) , 3 );
		var $minval = Math.round( $maxval - ( $maxval * $int_saturation/100 ) , 3 );

// console.log($maxval);
// console.log($minval);

		var $keyname = ['r' , 'g' , 'b'];
		if(      $int_hue >=   0 && $int_hue <  60 ){
			$keyname = ['r' , 'g' , 'b'];
			$midval = $minval + ( ($maxval - $minval) * ( ($int_hue -  0)/60 ) );
		}else if( $int_hue >=  60 && $int_hue < 120 ){
			$keyname = [ 'g' , 'r' , 'b' ];
			$midval = $maxval - ( ($maxval - $minval) * ( ($int_hue - 60)/60 ) );
		}else if( $int_hue >= 120 && $int_hue < 180 ){
			$keyname = [ 'g' , 'b' , 'r' ];
			$midval = $minval + ( ($maxval - $minval) * ( ($int_hue -120)/60 ) );
		}else if( $int_hue >= 180 && $int_hue < 240 ){
			$keyname = [ 'b' , 'g' , 'r' ];
			$midval = $maxval - ( ($maxval - $minval) * ( ($int_hue -180)/60 ) );
		}else if( $int_hue >= 240 && $int_hue < 300 ){
			$keyname = [ 'b' , 'r' , 'g' ];
			$midval = $minval + ( ($maxval - $minval) * ( ($int_hue -240)/60 ) );
		}else if( $int_hue >= 300 && $int_hue < 360 ){
			$keyname = [ 'r' , 'b' , 'g' ];
			$midval = $maxval - ( ($maxval - $minval) * ( ($int_hue -300)/60 ) );
		}

		var $tmp_rgb = {};
		if( $int_round ){
			$tmp_rgb[$keyname[0]] = Math.round( $maxval , $int_round );
			$tmp_rgb[$keyname[1]] = Math.round( $midval , $int_round );
			$tmp_rgb[$keyname[2]] = Math.round( $minval , $int_round );
		}else{
			$tmp_rgb[$keyname[0]] = intval( $maxval );
			$tmp_rgb[$keyname[1]] = intval( $midval );
			$tmp_rgb[$keyname[2]] = intval( $minval );
		}

		var $rgb = {
			'r': $tmp_rgb['r'] ,
			'g': $tmp_rgb['g'] ,
			'b': $tmp_rgb['b']
		};
// console.log( $rgb );
		return	$rgb;
	}
	/**
	 * HSB値から16進数のRGBコードを得る
	 */
	$.hsb2hex = function( $int_hue , $int_saturation , $int_brightness , $int_round ){
		var $rgb = $.hsb2rgb( $int_hue , $int_saturation , $int_brightness , $int_round );
		var $hex = $.rgb2hex( $rgb['r'] , $rgb['g'] , $rgb['b'] );
		return	$hex;
	}

})(jQuery);
