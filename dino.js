// ABOUT AUTHOR
//NAME : BISWARUP CHAKRABORTY
// MAIL: biswarup.chakraborty00@gmail.com
// version 1.0.0
(function( $ ) {
  "use strict";
    var ver = '1.0.0';
    var _ISDEBUG = true;
    
    // Plugin definition.
    $.fn.dinoSlider = function( option ) {
      return this.each(function() {
        var options = defaultOptions(option);
        var $dom = $( this );
        $dom._MOUSEHOVERMODE = false;
        $dom._STOP_SLIDE = false;
        $dom._CONTROLCLICKTIMEOUT;
        $dom._TIMEOUT;
        $dom._INNERANIMAE = 0;
        $dom._ISANIM;
        $dom._DELAY = options.delay;
        $dom.setDom = function(val){
          $dom = val;
        }
        $dom.getDom = function(){
          return $dom;
        }

        intialize( $dom,options );
        Event($dom);
        
        if(options.mouseHover){
        	$( this ).parent().unbind('mouseenter');
        	$( this ).parent().unbind('mouseleave');
	        $( this ).parent().mouseenter(function(){
	          mouseHoverAction( $dom, true, options );
	        }).mouseleave(function(){
	          mouseHoverAction( $dom, false, options );
	        });
	    }
      
	    if(options.mouseDrag){
         	dragable( $dom );
	    }
      });//END OF EACH FUNCTION
    };
    function defaultOptions(options){
      if( options == undefined){
        options = {};
      }
    	if(options.autoPlay == undefined){
    		options.autoPlay = true;
    	}
    	if(options.autoHeight == undefined){
    		options.autoHeight = false;
    	}
    	if(options.navControlls == undefined){
    		options.navControlls = true;
    	}
    	if(options.sideControlls == undefined){
    		options.sideControlls = true;
    	}
    	
    	if(options.delay == undefined){
    		options.delay = 4500;
    	}
    	if(options.mouseHover == undefined){
    		options.mouseHover = true;
    	}
    	if(options.showLoader == undefined){
    		options.showLoader = true;
    	}
    	if(options.transSpeed == undefined){
       	 options.transSpeed = (options.delay / 1000) - 1;
    	}
    	if(options.mouseDrag == undefined){
     	 options.mouseDrag = false;
    	}
      if(options.itemAnimation == undefined){
       options.itemAnimation = false;
      }
      	return options;
    }

    $.fn.dinoSlider.destroy = function() {
      dom.removeClass('dino');
      dom.removeAttr('style');
      clearInterval();
    }

    // Private function for debugging.
    function debug( debug ) {
      if(_ISDEBUG)
        console.log(debug);
    };

    //INIT Implement dom
    function intialize( dom,options ){
      dom.children().addClass('item_dino');
      var itemLen = dom.find('.item_dino').length;
      
      dom.addClass("dino");
      
      dom.wrap("<div class='dino_cover'></div>");
      //var dinoWidth = parseInt(windowWidth * dom.find('.item_dino').length) + 500;
      var dinoWidth = parseInt(dom.parent().width() * itemLen) + 500;
      
      dom.width(dinoWidth);
      //alert(dom.parent().innerWidth()) 
      dom.find('.item_dino').width(dom.parent().width());
      dom.find('.item_dino').eq(0).addClass('item-active');
      dom.find('.item_dino').find("img").css({"pointer-events":"none"});
      dom.find('.item_dino').children().each(function(){
    	var slide 	= jQuery(this).attr('data-slide');
    		if(slide == 'true'){

    			jQuery(this).addClass('innerItem');
    			var left 	= parseInt(jQuery(this).attr('data-left'));
    			var right 	= parseInt(jQuery(this).attr('data-right'));
    			var top 	= parseInt(jQuery(this).attr('data-top'));
    			jQuery(this).css({'left':left,'top':top, 'right':right});
    		}
    	});
      dom.parent().append("<div class='navControlls' style='display:none'></div>");
      dom.parent().append("<div class='sideControlls' style='display:none'></div>");
      
      if( options.showLoader && options.autoPlay){
      	dom.parent().append("<div class='loader'></div>");
      }

      if(options.navControlls){
        for(var t = 0; t< itemLen ; t++)
        {
          dom.parent().find('.navControlls').show();
          dom.parent().find('.navControlls').remove('span');
          dom.parent().find('.navControlls').append('<span></span>');
          dom.parent().find('.navControlls span').eq(0).addClass('active');
          navClick( dom, options.delay );
        }
      }
      if(options.sideControlls){
        dom.parent().find('.sideControlls').show();
        dom.parent().find('.sideControlls').remove('span')
        dom.parent().find('.sideControlls').append('<span class="right"></span>');
        dom.parent().find('.sideControlls').append('<span class="left"></span>');
        arrowClick( dom, options.delay );
      }
        responssive( dom,options )
        oldSlide( dom,options );
       
    };
    function responssive( dom,options ){
        jQuery(window).on('resize',function(){
          var itemLen = dom.find('.item_dino').length;
          var dinoWidth = parseInt(dom.parent().width() * itemLen) + 500;
          dom.width(dinoWidth);
          debug(dom.parent().innerWidth()) 
          dom.find('.item_dino').width(dom.parent().innerWidth()+10);
          if(options.autoHeight)
          {
            autoHeight( dom );
          }
        })
    }
    //SLIDER OLD
    function oldSlide( dom,options ){
      if( options.autoPlay ){ //IF AUTO PLAY
	      //FIRST SLIDE
	      dom._TIMEOUT = setTimeout(function(){
	        if(!dom._MOUSEHOVERMODE && !dom._STOP_SLIDE){
	          $.fn.dinoSlider.slideNext(dom);
	        }
	      },options.delay);

	      //START LOADER
	      if( dom._TIMEOUT == "" || dom._TIMEOUT == null ){
	      	oldSlide(dom,options);
	      }else{
          if(options.itemAnimation)
            {
             itemAnimate( dom,options,0 );
            }else{
              loader( dom,'start',options.delay );
            }
	      	
	      	if(options.autoHeight)
          {
            setTimeout(function(){
              autoHeight( dom );
            },1500)
          }
		      //SLEDE LOOP
		      dom.on('slide:end',function(){
		      	var current = $.fn.dinoSlider.getActiveItemIndex(dom);
            if(options.itemAnimation)
            {
              resetItemAnimate( dom );
              itemAnimate( dom,options,current );
            }else{
               if(!dom._MOUSEHOVERMODE && !dom._STOP_SLIDE){

                loader( dom,'start',options.delay );
              }
            }
		       if(!dom._MOUSEHOVERMODE && !dom._STOP_SLIDE){

		        dom._TIMEOUT = setTimeout(function(){
		              var index = $.fn.dinoSlider.getActiveItemIndex(dom) + 1;
		              var itemLen = dom.find('.item_dino').length - 1;
		              if(index > itemLen){
		                index = 0;
		              }
		              $.fn.dinoSlider.slideTo(dom,index);
		          },options.delay);
		          //loader( dom,'start',options.delay );
		        }
		      });
	      }
     	}else{ 	//IF NOT AUTO PLAY
		    if(options.autoHeight)
        {
          autoHeight( dom );
        }
        itemAnimate( dom,options,0 );
		    dom.on('slide:end',function(){
          var current = $.fn.dinoSlider.getActiveItemIndex(dom);
            resetItemAnimate( dom );
            itemAnimate( dom,options,current );
		    	 var current2 = $.fn.dinoSlider.getActiveItemIndex(dom);
		    });
     	}
      dom.on('slide:start',function(){
        if(options.autoHeight)
        {
          autoHeight( dom );
          resetItemAnimate( dom );
        }
      });
    }//END SLIDER OLD

    //EVENT GENERATE
    function Event($dom){
        $dom.on('transitionend webkitTransitionEnd', function(e){
          //debug(e.originalEvent.classList);
          //debug(e.originalEvent.target);
          //alert(e.originalEvent.elapsedTime + 's');
          if(jQuery(e.originalEvent.target).hasClass('dino')){  //With out this checking all css transition get effected by this
          	$dom.trigger('slide:end');
          }
          //debug('transitionend EVENT End');
        });
    }
   function autoHeight( $dom )
    {
      var height = $dom.find('.item-active').height();
      $dom.parent().height(height);
    };
    //SLIDE TO
    $.fn.dinoSlider.slideTo = function( $dom,no ){
  		clearTimeout( $dom._TIMEOUT );
      clearTimeout( $dom._CONTROLCLICKTIMEOUT );
  		addActiveClassByIndex( $dom, no );
  		var left = $dom.find('.item_dino').width() * no;
  		var limit = ($dom.find('.item_dino').length-1) * $dom.find('.item_dino').width();
  		//debug('INDEX::'+$.fn.dinoSlider.getActiveItemIndex($dom));
  		if(left <= limit && left >= 0){
  			$dom.css({'left':-left});
  			$dom.trigger('slide:start');
  		}else{
  			$dom.css({'left':0});
        $dom.trigger('slide:start');
  		}
    }

    //SLIDE NEXT
    $.fn.dinoSlider.slideNext = function( $dom ){
      var index = $.fn.dinoSlider.getActiveItemIndex($dom) + 1;
      var itemLen = $dom.find('.item_dino').length - 1;
      //debug('index:::'+index+" len :::"+itemLen);
      if(index > itemLen){
        index = 0;
      }
      $.fn.dinoSlider.slideTo($dom,index);
    }

     $.fn.dinoSlider.pauseSlide = function( $dom ){
      clearTimeout( $dom._TIMEOUT );
      clearTimeout( $dom._CONTROLCLICKTIMEOUT );
      loader( $dom, 'pause', $dom._DELAY);
      $dom._STOP_SLIDE = true; //STOP SLIDE
    }

    $.fn.dinoSlider.stopSlide = function( $dom ){
      //resetItemAnimate( $dom );
      loader( $dom, 'stop', $dom._DELAY);
      clearTimeout( $dom._TIMEOUT );
      clearTimeout( $dom._CONTROLCLICKTIMEOUT );
      $dom._STOP_SLIDE = true; //STOP SLIDE
    }

    $.fn.dinoSlider.restartSlide = function( $dom , delay ){
      if( !$dom._MOUSEHOVERMODE ){   //IS MOUSE HOVER
      var timeOut = delay + 1000;  
      clearTimeout( $dom._TIMEOUT );
      clearTimeout( $dom._CONTROLCLICKTIMEOUT );
        $dom._CONTROLCLICKTIMEOUT = setTimeout(function(){
            $.fn.dinoSlider.slideNext($dom);
            $dom._STOP_SLIDE = false;
        },timeOut);
        $dom = $dom.getDom();
        debug("NEW:::"+$dom._ISANIM)
        if( !$dom._ISANIM ){
          loader( $dom, 'start', timeOut);
        }
        
      }
      $dom._INNERANIMAE = 0;
    }

    $.fn.dinoSlider.getActiveItemIndex = function( $dom ){
      var indo;
      $dom.find('.item_dino').each(function(){
        if(jQuery(this).hasClass('item-active')){
          indo =  jQuery(this).index();
        }
      });
      return indo;
    }

    //ADD ACTIVE CLASS ON SLIDE OF ACTIVE ITEM
    function addActiveClass($dom){
      $dom.find('.item-active').next().addClass('item-active');
      $dom.find('.item-active').eq(0).removeClass('item-active');
      $dom.find('.item-active').nextAll().removeClass('item-active');
      $dom.find('.item-active').prevAll().removeClass('item-active');
      $dom.parent().find('.navControlls .active').next().addClass('active');
      $dom.parent().find('.navControlls .active').eq(0).removeClass('active');
      $dom.parent().find('.navControlls .active').nextAll().removeClass('active');
      $dom.parent().find('.navControlls .active').prevAll().removeClass('active');
    }
    function addActiveClassByIndex($dom, index ){
      $dom.find('.item_dino').removeClass('item-active');
      $dom.find('.item_dino').eq(index).addClass('item-active');
      $dom.parent().find('.navControlls span').removeClass('active');
      $dom.parent().find('.navControlls span').eq(index).addClass('active');
    }
    //NAV CONTROLLS FUNCTION
    function navClick( dom, delay ){
      dom.parent().find('.navControlls span').unbind('click');
      dom.parent().find('.navControlls span').click(function(){
      	if(!jQuery(this).hasClass('active')){
      		
      		$.fn.dinoSlider.stopSlide( dom );
	        var numo = jQuery(this).index();
	        $.fn.dinoSlider.slideTo( dom,numo );
	        //$.fn.dinoSlider.restartSlide( dom,delay );
      	}
      })
    }

    //ARROW CLICk FUNCTION
    function arrowClick( dom, delay ){
      dom.parent().find('.sideControlls .right').unbind('clcik');
      dom.parent().find('.sideControlls .right').click(function(event){ 
        var next = $.fn.dinoSlider.getActiveItemIndex(dom) + 1;
        if(next <= (dom.find('.item_dino').length - 1)){
          $.fn.dinoSlider.stopSlide( dom );
          $.fn.dinoSlider.slideTo( dom,next );
          $.fn.dinoSlider.restartSlide( dom,delay );
        }//END OF IF CONDITION
      });//END OF CLICK

      dom.parent().find('.sideControlls .left').unbind('clcik');
      dom.parent().find('.sideControlls .left').click(function(event){
        var prev = $.fn.dinoSlider.getActiveItemIndex(dom) - 1;
        if(prev >= 0){
        	$.fn.dinoSlider.stopSlide( dom );
        	$.fn.dinoSlider.slideTo(dom,prev);
        	$.fn.dinoSlider.restartSlide( dom,delay );
        }  

      })//END OF CLICK
    }

    //ITEM ANIMATE
    function itemAnimate( $dom , options, index ){
    	//debug("LEN::"+$dom.find('.item_dino').eq(index).find('.innerItem').length);

    	if($dom.find('.item_dino').eq(index).find('.innerItem').length != 0){
    		$.fn.dinoSlider.stopSlide( $dom );
    	   	loader( $dom,'stop',options.delay );
	    	//var transTime = options.delay - 2500;
	    	var totalItemin = $dom.find('.item_dino').eq(index).find('.innerItem').length;
	    	
        $dom.find('.item_dino').eq(index).find('.innerItem').each(function(ind){
	    		var slide 		= jQuery(this).attr('data-slide');
	    		var timeOut 	= parseInt(jQuery(this).attr('data-timeout')) *1000 ;
	    		var transct 	= jQuery(this).attr('data-transanction');
	    		var transTime 	= parseInt(jQuery(this).attr('data-duration')) * 1000;
	    		var movePos 	= jQuery(this).attr('data-moveTo').split(',')[0];
	    		var moveVal 	= jQuery(this).attr('data-moveTo').split(',')[1];
	    		var thiso 		= jQuery(this);
          		$dom._ISANIM 	= true;
          		$dom.setDom($dom);
	    		anime($dom,thiso,slide,timeOut,transct,movePos,moveVal,transTime,options,totalItemin);
	    	});
    	}else{
        	$dom._ISANIM = false;
        	$dom.setDom($dom);
        	if( !$dom._MOUSEHOVERMODE ){
    			loader( $dom,'start',options.delay );
    		}
    	}
    	
    }

    function anime($dom,thiso,slide,timeOut,transct,movePos,moveVal,transTime,options,totalItemin){
		setTimeout(function(){
			if(transct == 'fade'){
				if(movePos == 'left'){
					thiso.animate({
		            	left: moveVal,
		            	opacity: 1,
			        }, transTime ,function(){
                $dom = $dom.getDom();
                
			        	if(totalItemin > 0){
			        		$dom._INNERANIMAE ++;
				        	if( $dom._INNERANIMAE == totalItemin ){
                  		$dom._ISANIM = false;
                  		$dom.setDom($dom);
			           		if( options.autoPlay){
			           			$.fn.dinoSlider.restartSlide( $dom,options.delay );
                  	}
				        	}
			        	}
	        		});
				}else if(movePos == 'top'){
					thiso.animate({		     
		            	top: moveVal,
		            	opacity: 1,
			        }, transTime ,function(){
               $dom = $dom.getDom();
               debug($dom._INNERANIMAE);
		           if(totalItemin > 0){
		        		$dom._INNERANIMAE ++;
			        	if( $dom._INNERANIMAE == totalItemin ){
                  //alert(thiso.index())
                  		$dom._ISANIM = false;
                  		$dom.setDom($dom);
                      
			           		if(options.autoPlay){
			           			$.fn.dinoSlider.restartSlide( $dom,options.delay );
                  	}
			        	}
		        	}
	        		});
				}
			}//IF FADE
		},timeOut);
    }

    function resetItemAnimate( $dom ){
      var index = $.fn.dinoSlider.getActiveItemIndex($dom);
    	$dom.find('.item_dino').find('.innerItem').each(function(){
    		var right 	= parseInt(jQuery(this).attr('data-right'));
    		var left 	= parseInt(jQuery(this).attr('data-left'));
    		var top 	= parseInt(jQuery(this).attr('data-top'));
    		jQuery(this).clearQueue();
        jQuery(this).stop();
        $dom._INNERANIMAE = 0;
        $dom._ISANIM = false;
        $dom.setDom($dom);
    		jQuery(this).removeAttr('style');
    		jQuery(this).css({'left':left, 'top':top, 'right':right , 'opacity':'0'});
    	});
    }

    //ENHANCE / ORNAMENTS
    function loader( $dom, show, delay ){
      debug("DELAY::::"+delay)
      if(delay == undefined)
      {
        delay = 1000;
      }
      if(show == 'start'){
        $dom.parent().find('.loader').show();
        $dom.parent().find('.loader').animate({
            width: '100%',
          }, delay ,function(){
             $dom.parent().find('.loader').width(1);
        });
      }else if(show == 'pause'){
        $dom.parent().find('.loader').clearQueue();
        $dom.parent().find('.loader').stop();
      }else if(show == 'stop'){
        $dom.parent().find('.loader').clearQueue();
        $dom.parent().find('.loader').stop();
        $dom.parent().find('.loader').width(0);
      }
    }

    function mouseHoverAction( $dom, active, options ){
    	if(options.autoPlay){
	      clearTimeout( $dom._TIMEOUT );
	      clearTimeout( $dom._CONTROLCLICKTIMEOUT );
	      $dom._MOUSEHOVERMODE = active;  //TRUE OE FALSE
	      var $dom = $dom.getDom();
        if($dom._ISANIM == undefined){
          $dom._ISANIM = false;
        }
	      if(!$dom._ISANIM){
	        if( $dom._MOUSEHOVERMODE ){
	          $.fn.dinoSlider.pauseSlide( $dom );
	        }else{
	          $.fn.dinoSlider.restartSlide( $dom,options.delay );
	        }
	      }
      	}
    }

var dragable = function(elem) {
  var parent = elem.parent();
  var target = elem;
  var dragDirection;
  var oo;
  var areSlide = false;
  var drag = false;
  var offsetX = 0;
  var offsetY = 0;
  var mousemoveTemp = null;

  if (target) {
    var mouseX = function(e) {
      if (e.pageX) {
        return e.pageX;
      }
      /*if (e.clientX) {
        return e.clientX + (document.documentElement.scrollLeft ?
          document.documentElement.scrollLeft :
          document.body.scrollLeft);
      }*/
      return null;
    };
    
    var move = function (x, y) {
      var xPos = parseInt(target.css("left")) || 0;
      var max = parseInt(target.find(".item_dino").length - 1) * parseInt(target.find(".item_dino").width());
      var min = 80;
      //debug(target.find(".item_dino").width())
      if(xPos + x < min && (xPos + x) > -(max + 80)){
      	//target.css({"transition":"auto"});
      	target.css({"left":(xPos + x)});// + 'px';
      }
     
    };
    
    var mouseMoveHandler = function (e) {
      e = e || window.event;
      if(!drag){return true};

      var x = mouseX(e);
      if(oo != undefined)
      {
      	//debug("xPOs:::"+x+"::oo::"+oo);
      	if(x > oo)
      	{
      		dragDirection = "left";
      	}else{
      		dragDirection = "right";
      	}
      }
      setTimeout(function(){
      	oo = x;
      },50)
      
      if (x != offsetX ) {
        move(x - offsetX);
        offsetX = x;
      }
      areSlide = true;
      //parent.unbind('mouseleave');
      
      
      return false;
    };
    var start_drag = function (e) {
      e = e || window.event;
      offsetX=mouseX(e);
      drag=true; // basically we're using this to detect dragging

      // save any previous mousemove event handler:
      if (document.body.onmousemove) {
        mousemoveTemp = document.body.onmousemove;
      }
      //alert(target.attr("class"))
      target.on('mousemove',function(ev){
      	mouseMoveHandler(ev);
      })
      return false;
    };
    
    var stop_drag = function () {
      drag=false;      

      // restore previous mousemove event handler if necessary:
      if (mousemoveTemp) {
        document.body.onmousemove = mousemoveTemp;
        mousemoveTemp = null;
      }
      return false;
    };
    target.mousedown(function(e){
     	target.css({"transition":"auto"});
     });
    parent.mouseleave(function(et){
        target.unbind('mousemove');
        slide_onDrag(et);
        
      });
    target.unbind("mouseup");
    target.mouseup(function(e){
      slide_onDrag(e);
	   });
     parent.unbind("mousedown");
    parent.mousedown(function(e){
    	start_drag(e)
    });
     parent.unbind("mouseup");
    parent.mouseup(function(e){
    	stop_drag(e);
       target.css({"transition":"left 1s"});
    });
    function slide_onDrag(e){
        debug("wfeaw::"+areSlide);
        if(!areSlide){
          return;
        }
        target.css({"transition":"left 1s"});
        var index = $.fn.dinoSlider.getActiveItemIndex(target);
        var next;
        var check;
        if(index > 0){
          check = parseInt(target.find(".item_dino").width()) * index;
        }else{
          check = parseInt(target.find(".item_dino").width());
        }
        var max2 = parseInt(target.find(".item_dino").length-1 ) * parseInt(target.find(".item_dino").width());
        
        if(dragDirection == "right")
        {
          if( Math.abs(parseInt(target.css("left"))) > check/3 &&  Math.abs(parseInt(target.css("left"))) < max2 ){ 
          
            next = parseInt(index)+ 1;
          
          }else{
            next = index;
            
          }
          //alert(next)
          $.fn.dinoSlider.slideTo( target, next );
        }
        if(dragDirection == "left")
        {
          if( parseInt(target.css("left")) < check/2 &&  parseInt(target.css("left")) < 0 ){  
          
            next = parseInt(index) - 1;
          
          }else{
            next = index;
            
          }
          //alert(next)
          $.fn.dinoSlider.slideTo( target, next );
        }
       
       areSlide = false;
       debug("check::"+check/2+"::::LEFT:::"+Math.abs(parseInt(target.css("left"))));
      } 
      //parent.onmouseup = stop_drag;
    }
  }
  // End of closure.
})( jQuery );


