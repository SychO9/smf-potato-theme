/* Any changes to this file will be overwritten. To change the content
of this file, edit the source files from which it was compiled. */
(function($){$.fn.SMFtooltip=function(oInstanceSettings){$.fn.SMFtooltip.oDefaultsSettings={followMouse:1,hoverIntent:{sensitivity:10,interval:300,timeout:50},positionTop:12,positionLeft:12,tooltipID:'smf_tooltip',tooltipTextID:'smf_tooltipText',tooltipClass:'tooltip',tooltipSwapClass:'smf_swaptip',tooltipContent:'html'};var oSettings=$.extend({},$.fn.SMFtooltip.oDefaultsSettings,oInstanceSettings||{});$(this).each(function()
{var sTitle=$('<span class="'+oSettings.tooltipSwapClass+'">'+htmlspecialchars(this.title)+'</span>').hide();$(this).append(sTitle).attr('title','')});var positionTooltip=function(event)
{var iPosx=0;var iPosy=0;if(!event)
var event=window.event;if(event.pageX||event.pageY)
{iPosx=event.pageX;iPosy=event.pageY}
else if(event.clientX||event.clientY)
{iPosx=event.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;iPosy=event.clientY+document.body.scrollTop+document.documentElement.scrollTop}
var oPosition={x:iPosx+oSettings.positionLeft,y:iPosy+oSettings.positionTop,w:$('#'+oSettings.tooltipID).width(),h:$('#'+oSettings.tooltipID).height()}
var oLimits={x:$(window).scrollLeft(),y:$(window).scrollTop(),w:$(window).width()-24,h:$(window).height()-24};if((oPosition.y+oPosition.h>oLimits.y+oLimits.h)&&(oPosition.x+oPosition.w>oLimits.x+oLimits.w))
{oPosition.x=(oPosition.x-oPosition.w)-45;oPosition.y=(oPosition.y-oPosition.h)-45}
else if((oPosition.x+oPosition.w)>(oLimits.x+oLimits.w))
{oPosition.x=oPosition.x-(((oPosition.x+oPosition.w)-(oLimits.x+oLimits.w))+24)}
else if(oPosition.y+oPosition.h>oLimits.y+oLimits.h)
{oPosition.y=oPosition.y-(((oPosition.y+oPosition.h)-(oLimits.y+oLimits.h))+24)}
$('#'+oSettings.tooltipID).css({'left':oPosition.x+'px','top':oPosition.y+'px'})}
var showTooltip=function(){$('#'+oSettings.tooltipID+' #'+oSettings.tooltipTextID).show()}
var hideTooltip=function(valueOfThis){$('#'+oSettings.tooltipID).fadeOut('slow').trigger("unload").remove()}
function htmlspecialchars(string)
{return $('<span>').text(string).html()}
return this.each(function(index)
{if($.fn.hoverIntent)
{$(this).hoverIntent({sensitivity:oSettings.hoverIntent.sensitivity,interval:oSettings.hoverIntent.interval,over:smf_tooltip_on,timeout:oSettings.hoverIntent.timeout,out:smf_tooltip_off})}
else{$(this).hover(smf_tooltip_on,smf_tooltip_off)}
function smf_tooltip_on(event)
{if($(this).children('.'+oSettings.tooltipSwapClass).text())
{$('body').append('<div id="'+oSettings.tooltipID+'" class="'+oSettings.tooltipClass+'"><div id="'+oSettings.tooltipTextID+'" style="display:none;"></div></div>');var tt=$('#'+oSettings.tooltipID);var ttContent=$('#'+oSettings.tooltipID+' #'+oSettings.tooltipTextID);if(oSettings.tooltipContent=='html')
ttContent.html($(this).children('.'+oSettings.tooltipSwapClass).html());else ttContent.text($(this).children('.'+oSettings.tooltipSwapClass).text());tt.show();showTooltip();positionTooltip(event)}
return!1};function smf_tooltip_off(event)
{hideTooltip(this);return!1};if(oSettings.followMouse)
{$(this).on("mousemove",function(event){positionTooltip(event);return!1})}
$(this).on("click",function(event){hideTooltip(this);return!0})})};$.fn.fadeOutAndRemove=function(speed){if(typeof speed==='undefined')speed=400;$(this).fadeOut(speed,function(){$(this).remove()})};$.fn.rangeToPercent=function(number,min,max){return((number-min)/(max-min))};$.fn.percentToRange=function(percent,min,max){return((max-min)*percent+min)}})(jQuery);(function($){$.fn.animaDrag=function(o,callback){var defaults={speed:400,interval:300,easing:null,cursor:'move',boundary:document.body,grip:null,overlay:!0,after:function(e){},during:function(e){},before:function(e){},afterEachAnimation:function(e){}}
if(typeof callback=='function'){defaults.after=callback}
o=$.extend(defaults,o||{});return this.each(function(){var id,startX,startY,draggableStartX,draggableStartY,dragging=!1,Ev,draggable=this,grip=($(this).find(o.grip).length>0)?$(this).find(o.grip):$(this);if(o.boundary){var limitTop=$(o.boundary).offset().top,limitLeft=$(o.boundary).offset().left,limitBottom=limitTop+$(o.boundary).innerHeight(),limitRight=limitLeft+$(o.boundary).innerWidth()}
grip.mousedown(function(e){o.before.call(draggable,e);var lastX,lastY;dragging=!0;Ev=e;startX=lastX=e.pageX;startY=lastY=e.pageY;draggableStartX=$(draggable).offset().left;draggableStartY=$(draggable).offset().top;$(draggable).css({position:'absolute',left:draggableStartX+'px',top:draggableStartY+'px',cursor:o.cursor,zIndex:'1010'}).addClass('anima-drag').appendTo(document.body);if(o.overlay&&$('#anima-drag-overlay').length==0){$('<div id="anima-drag-overlay"></div>').css({position:'absolute',top:'0',left:'0',zIndex:'1000',width:$(document.body).outerWidth()+'px',height:$(document.body).outerHeight()+'px'}).appendTo(document.body)}
else if(o.overlay){$('#anima-drag-overlay').show()}
id=setInterval(function(){if(lastX!=Ev.pageX||lastY!=Ev.pageY){var positionX=draggableStartX-(startX-Ev.pageX),positionY=draggableStartY-(startY-Ev.pageY);if(positionX<limitLeft&&o.boundary){positionX=limitLeft}
else if(positionX+$(draggable).innerWidth()>limitRight&&o.boundary){positionX=limitRight-$(draggable).outerWidth()}
if(positionY<limitTop&&o.boundary){positionY=limitTop}
else if(positionY+$(draggable).innerHeight()>limitBottom&&o.boundary){positionY=limitBottom-$(draggable).outerHeight()}
$(draggable).stop().animate({left:positionX+'px',top:positionY+'px'},o.speed,o.easing,function(){o.afterEachAnimation.call(draggable,Ev)})}
lastX=Ev.pageX;lastY=Ev.pageY},o.interval);($.browser.safari||e.preventDefault())});$(document).mousemove(function(e){if(dragging){Ev=e;o.during.call(draggable,e)}});$(document).mouseup(function(e){if(dragging){$(draggable).css({cursor:'',zIndex:'990'}).removeClass('anima-drag');$('#anima-drag-overlay').hide().appendTo(document.body);clearInterval(id);o.after.call(draggable,e);dragging=!1}})})}})(jQuery);(function($,w){"use strict";var methods=(function(){var c={bcClass:'sf-breadcrumb',menuClass:'sf-js-enabled',anchorClass:'sf-with-ul',menuArrowClass:'sf-arrows'},ios=(function(){var ios=/^(?![\w\W]*Windows Phone)[\w\W]*(iPhone|iPad|iPod)/i.test(navigator.userAgent);if(ios){$('html').css('cursor','pointer').on('click',$.noop)}
return ios})(),wp7=(function(){var style=document.documentElement.style;return('behavior' in style&&'fill' in style&&/iemobile/i.test(navigator.userAgent))})(),unprefixedPointerEvents=(function(){return(!!w.PointerEvent)})(),toggleMenuClasses=function($menu,o){var classes=c.menuClass;if(o.cssArrows){classes+=' '+c.menuArrowClass}
$menu.toggleClass(classes)},setPathToCurrent=function($menu,o){return $menu.find('li.'+o.pathClass).slice(0,o.pathLevels).addClass(o.hoverClass+' '+c.bcClass).filter(function(){return($(this).children(o.popUpSelector).hide().show().length)}).removeClass(o.pathClass)},toggleAnchorClass=function($li){$li.children('a').toggleClass(c.anchorClass)},toggleTouchAction=function($menu){var msTouchAction=$menu.css('ms-touch-action');var touchAction=$menu.css('touch-action');touchAction=touchAction||msTouchAction;touchAction=(touchAction==='pan-y')?'auto':'pan-y';$menu.css({'ms-touch-action':touchAction,'touch-action':touchAction})},applyHandlers=function($menu,o){var targets='li:has('+o.popUpSelector+')';if($.fn.hoverIntent&&!o.disableHI){$menu.hoverIntent(over,out,targets)}
else{$menu.on('mouseenter.superfish',targets,over).on('mouseleave.superfish',targets,out)}
var touchevent='MSPointerDown.superfish';if(unprefixedPointerEvents){touchevent='pointerdown.superfish'}
if(!ios){touchevent+=' touchend.superfish'}
if(wp7){touchevent+=' mousedown.superfish'}
$menu.on('focusin.superfish','li',over).on('focusout.superfish','li',out).on(touchevent,'a',o,touchHandler)},touchHandler=function(e){var $this=$(this),o=getOptions($this),$ul=$this.siblings(e.data.popUpSelector);if(o.onHandleTouch.call($ul)===!1){return this}
if($ul.length>0&&$ul.is(':hidden')){$this.one('click.superfish',!1);if(e.type==='MSPointerDown'||e.type==='pointerdown'){$this.trigger('focus')}else{$.proxy(over,$this.parent('li'))()}}},over=function(){var $this=$(this),o=getOptions($this);clearTimeout(o.sfTimer);$this.siblings().superfish('hide').end().superfish('show')},out=function(){var $this=$(this),o=getOptions($this);if(ios){$.proxy(close,$this,o)()}
else{clearTimeout(o.sfTimer);o.sfTimer=setTimeout($.proxy(close,$this,o),o.delay)}},close=function(o){o.retainPath=($.inArray(this[0],o.$path)>-1);this.superfish('hide');if(!this.parents('.'+o.hoverClass).length){o.onIdle.call(getMenu(this));if(o.$path.length){$.proxy(over,o.$path)()}}},getMenu=function($el){return $el.closest('.'+c.menuClass)},getOptions=function($el){return getMenu($el).data('sf-options')};return{hide:function(instant){if(this.length){var $this=this,o=getOptions($this);if(!o){return this}
var not=(o.retainPath===!0)?o.$path:'',$ul=$this.find('li.'+o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),speed=o.speedOut;if(instant){$ul.show();speed=0}
o.retainPath=!1;if(o.onBeforeHide.call($ul)===!1){return this}
$ul.stop(!0,!0).animate(o.animationOut,speed,function(){var $this=$(this);o.onHide.call($this)})}
return this},show:function(){var o=getOptions(this);if(!o){return this}
var $this=this.addClass(o.hoverClass),$ul=$this.children(o.popUpSelector);if(o.onBeforeShow.call($ul)===!1){return this}
$ul.stop(!0,!0).animate(o.animation,o.speed,function(){o.onShow.call($ul)});return this},destroy:function(){return this.each(function(){var $this=$(this),o=$this.data('sf-options'),$hasPopUp;if(!o){return!1}
$hasPopUp=$this.find(o.popUpSelector).parent('li');clearTimeout(o.sfTimer);toggleMenuClasses($this,o);toggleAnchorClass($hasPopUp);toggleTouchAction($this);$this.off('.superfish').off('.hoverIntent');$hasPopUp.children(o.popUpSelector).attr('style',function(i,style){return style.replace(/display[^;]+;?/g,'')});o.$path.removeClass(o.hoverClass+' '+c.bcClass).addClass(o.pathClass);$this.find('.'+o.hoverClass).removeClass(o.hoverClass);o.onDestroy.call($this);$this.removeData('sf-options')})},init:function(op){return this.each(function(){var $this=$(this);if($this.data('sf-options')){return!1}
var o=$.extend({},$.fn.superfish.defaults,op),$hasPopUp=$this.find(o.popUpSelector).parent('li');o.$path=setPathToCurrent($this,o);$this.data('sf-options',o);toggleMenuClasses($this,o);toggleAnchorClass($hasPopUp);toggleTouchAction($this);applyHandlers($this,o);$hasPopUp.not('.'+c.bcClass).superfish('hide',!0);o.onInit.call(this)})}}})();$.fn.superfish=function(method,args){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1))}
else if(typeof method==='object'||!method){return methods.init.apply(this,arguments)}
else{return $.error('Method '+method+' does not exist on jQuery.fn.superfish')}};$.fn.superfish.defaults={popUpSelector:'ul,.sf-mega',hoverClass:'sfHover',pathClass:'overrideThisToUse',pathLevels:1,delay:800,animation:{opacity:'show'},animationOut:{opacity:'hide'},speed:'normal',speedOut:'fast',cssArrows:!0,disableHI:!1,onInit:$.noop,onBeforeShow:$.noop,onShow:$.noop,onBeforeHide:$.noop,onHide:$.noop,onIdle:$.noop,onDestroy:$.noop,onHandleTouch:$.noop}})(jQuery,window);(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:7,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}
var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}
if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover},cfg.selector)}})(jQuery);$(function(){if(smf_member_id>0)
$('div.boardindex_table div.cat_bar').each(function(index,el)
{var catid=el.id.replace('category_','');new smc_Toggle({bToggleEnabled:!0,bCurrentlyCollapsed:$('#category_'+catid+'_upshrink').data('collapsed'),aHeader:$('#category_'+catid),aSwappableContainers:['category_'+catid+'_boards'],aSwapImages:[{sId:'category_'+catid+'_upshrink',msgExpanded:'',msgCollapsed:''}],oThemeOptions:{bUseThemeSettings:!0,sOptionName:'collapse_category_'+catid,sSessionVar:smf_session_var,sSessionId:smf_session_id}})})});$(function(){$('.mobile_act').click(function(){$('#mobile_action').show()});$('.hide_popup').click(function(){$('#mobile_action').hide()});$('.mobile_mod').click(function(){$('#mobile_moderation').show()});$('.hide_popup').click(function(){$('#mobile_moderation').hide()});$('.mobile_user_menu').click(function(){$('#mobile_user_menu').show()});$('.hide_popup').click(function(){$('#mobile_user_menu').hide()})});(function($){$.fn.customScrollbar=function(options,args){var defaultOptions={skin:undefined,hScroll:!0,vScroll:!0,updateOnWindowResize:!1,animationSpeed:300,onCustomScroll:undefined,swipeSpeed:1,wheelSpeed:40,fixedThumbWidth:undefined,fixedThumbHeight:undefined,preventDefaultScroll:!1}
var Scrollable=function(element,options){this.$element=$(element);this.options=options;this.addScrollableClass();this.addSkinClass();this.addScrollBarComponents();if(this.options.vScroll)
this.vScrollbar=new Scrollbar(this,new VSizing());if(this.options.hScroll)
this.hScrollbar=new Scrollbar(this,new HSizing());this.$element.data("scrollable",this);this.initKeyboardScrolling();this.bindEvents()}
Scrollable.prototype={addScrollableClass:function(){if(!this.$element.hasClass("scrollable")){this.scrollableAdded=!0;this.$element.addClass("scrollable")}},removeScrollableClass:function(){if(this.scrollableAdded)
this.$element.removeClass("scrollable")},addSkinClass:function(){if(typeof(this.options.skin)=="string"&&!this.$element.hasClass(this.options.skin)){this.skinClassAdded=!0;this.$element.addClass(this.options.skin)}},removeSkinClass:function(){if(this.skinClassAdded)
this.$element.removeClass(this.options.skin)},addScrollBarComponents:function(){this.assignViewPort();if(this.$viewPort.length==0){this.$element.wrapInner("<div class=\"viewport\" />");this.assignViewPort();this.viewPortAdded=!0}
this.assignOverview();if(this.$overview.length==0){this.$viewPort.wrapInner("<div class=\"overview\" />");this.assignOverview();this.overviewAdded=!0}
this.addScrollBar("vertical","prepend");this.addScrollBar("horizontal","append")},removeScrollbarComponents:function(){this.removeScrollbar("vertical");this.removeScrollbar("horizontal");if(this.overviewAdded)
this.$element.unwrap();if(this.viewPortAdded)
this.$element.unwrap()},removeScrollbar:function(orientation){if(this[orientation+"ScrollbarAdded"])
this.$element.find(".scroll-bar."+orientation).remove()},assignViewPort:function(){this.$viewPort=this.$element.find(".viewport")},assignOverview:function(){this.$overview=this.$viewPort.find(".overview")},addScrollBar:function(orientation,fun){if(this.$element.find(".scroll-bar."+orientation).length==0){this.$element[fun]("<div class='scroll-bar "+orientation+"'><div class='thumb'></div></div>")
this[orientation+"ScrollbarAdded"]=!0}},resize:function(keepPosition){if(this.vScrollbar)
this.vScrollbar.resize(keepPosition);if(this.hScrollbar)
this.hScrollbar.resize(keepPosition)},scrollTo:function(element){if(this.vScrollbar)
this.vScrollbar.scrollToElement(element);if(this.hScrollbar)
this.hScrollbar.scrollToElement(element)},scrollToXY:function(x,y){this.scrollToX(x);this.scrollToY(y)},scrollToX:function(x){if(this.hScrollbar)
this.hScrollbar.scrollOverviewTo(x,!0)},scrollToY:function(y){if(this.vScrollbar)
this.vScrollbar.scrollOverviewTo(y,!0)},scrollByX:function(x){if(this.hScrollbar)
this.scrollToX(this.hScrollbar.overviewPosition()+x)},scrollByY:function(y){if(this.vScrollbar)
this.scrollToY(this.vScrollbar.overviewPosition()+y)},remove:function(){this.removeScrollableClass();this.removeSkinClass();this.removeScrollbarComponents();this.$element.data("scrollable",null);this.removeKeyboardScrolling();if(this.vScrollbar)
this.vScrollbar.remove();if(this.hScrollbar)
this.hScrollbar.remove()},setAnimationSpeed:function(speed){this.options.animationSpeed=speed},isInside:function(element,wrappingElement){var $element=$(element);var $wrappingElement=$(wrappingElement);var elementOffset=$element.offset();var wrappingElementOffset=$wrappingElement.offset();return(elementOffset.top>=wrappingElementOffset.top)&&(elementOffset.left>=wrappingElementOffset.left)&&(elementOffset.top+$element.height()<=wrappingElementOffset.top+$wrappingElement.height())&&(elementOffset.left+$element.width()<=wrappingElementOffset.left+$wrappingElement.width())},initKeyboardScrolling:function(){var _this=this;this.elementKeydown=function(event){if(document.activeElement===_this.$element[0]){if(_this.vScrollbar)
_this.vScrollbar.keyScroll(event);if(_this.hScrollbar)
_this.hScrollbar.keyScroll(event)}}
this.$element.attr('tabindex','-1').keydown(this.elementKeydown)},removeKeyboardScrolling:function(){this.$element.removeAttr('tabindex').off("keydown",this.elementKeydown)},bindEvents:function(){if(this.options.onCustomScroll)
this.$element.on("customScroll",this.options.onCustomScroll)}}
var Scrollbar=function(scrollable,sizing){this.scrollable=scrollable;this.sizing=sizing
this.$scrollBar=this.sizing.scrollBar(this.scrollable.$element);this.$thumb=this.$scrollBar.find(".thumb");this.setScrollPosition(0,0);this.resize();this.initMouseMoveScrolling();this.initMouseWheelScrolling();this.initTouchScrolling();this.initMouseClickScrolling();this.initWindowResize()}
Scrollbar.prototype={resize:function(keepPosition){this.overviewSize=this.sizing.size(this.scrollable.$overview);this.calculateViewPortSize();this.sizing.size(this.scrollable.$viewPort,this.viewPortSize);this.ratio=this.viewPortSize/this.overviewSize;this.sizing.size(this.$scrollBar,this.viewPortSize);this.thumbSize=this.calculateThumbSize();this.sizing.size(this.$thumb,this.thumbSize);this.maxThumbPosition=this.calculateMaxThumbPosition();this.maxOverviewPosition=this.calculateMaxOverviewPosition();this.enabled=(this.overviewSize>this.viewPortSize);if(this.scrollPercent===undefined)
this.scrollPercent=0.0;if(this.enabled)
this.rescroll(keepPosition);else this.setScrollPosition(0,0);this.$scrollBar.toggle(this.enabled)},calculateViewPortSize:function(){var elementSize=this.sizing.size(this.scrollable.$element);if(elementSize>0&&!this.maxSizeUsed){this.viewPortSize=elementSize;this.maxSizeUsed=!1}
else{var maxSize=this.sizing.maxSize(this.scrollable.$element);this.viewPortSize=Math.min(maxSize,this.overviewSize);this.maxSizeUsed=!0}},calculateThumbSize:function(){var fixedSize=this.sizing.fixedThumbSize(this.scrollable.options)
var size;if(fixedSize)
size=fixedSize;else size=this.ratio*this.viewPortSize
return Math.max(size,this.sizing.minSize(this.$thumb))},initMouseMoveScrolling:function(){var _this=this;this.$thumb.mousedown(function(event){if(_this.enabled)
_this.startMouseMoveScrolling(event)});this.documentMouseup=function(event){_this.stopMouseMoveScrolling(event)};$(document).mouseup(this.documentMouseup);this.documentMousemove=function(event){_this.mouseMoveScroll(event)};$(document).mousemove(this.documentMousemove);this.$thumb.click(function(event){event.stopPropagation()})},removeMouseMoveScrolling:function(){this.$thumb.off();$(document).off("mouseup",this.documentMouseup);$(document).off("mousemove",this.documentMousemove)},initMouseWheelScrolling:function(){var _this=this;this.scrollable.$element.mousewheel(function(event,delta,deltaX,deltaY){if(_this.enabled){var scrolled=_this.mouseWheelScroll(deltaX,deltaY);_this.stopEventConditionally(event,scrolled)}})},removeMouseWheelScrolling:function(){this.scrollable.$element.off("mousewheel")},initTouchScrolling:function(){if(document.addEventListener){var _this=this;this.elementTouchstart=function(event){if(_this.enabled)
_this.startTouchScrolling(event)}
this.scrollable.$element[0].addEventListener("touchstart",this.elementTouchstart);this.documentTouchmove=function(event){_this.touchScroll(event)}
this.scrollable.$element[0].addEventListener("touchmove",this.documentTouchmove);this.elementTouchend=function(event){_this.stopTouchScrolling(event)}
this.scrollable.$element[0].addEventListener("touchend",this.elementTouchend)}},removeTouchScrolling:function(){if(document.addEventListener){this.scrollable.$element[0].removeEventListener("touchstart",this.elementTouchstart);document.removeEventListener("touchmove",this.documentTouchmove);this.scrollable.$element[0].removeEventListener("touchend",this.elementTouchend)}},initMouseClickScrolling:function(){var _this=this;this.scrollBarClick=function(event){_this.mouseClickScroll(event)};this.$scrollBar.click(this.scrollBarClick)},removeMouseClickScrolling:function(){this.$scrollBar.off("click",this.scrollBarClick)},initWindowResize:function(){if(this.scrollable.options.updateOnWindowResize){var _this=this;this.windowResize=function(){_this.resize()};$(window).resize(this.windowResize)}},removeWindowResize:function(){$(window).off("resize",this.windowResize)},isKeyScrolling:function(key){return this.keyScrollDelta(key)!=null},keyScrollDelta:function(key){for(var scrollingKey in this.sizing.scrollingKeys)
if(scrollingKey==key)
return this.sizing.scrollingKeys[key](this.viewPortSize);return null},startMouseMoveScrolling:function(event){this.mouseMoveScrolling=!0;$("body").addClass("not-selectable");this.setUnselectable($("body"),"on");this.setScrollEvent(event);event.preventDefault()},stopMouseMoveScrolling:function(event){this.mouseMoveScrolling=!1;$("body").removeClass("not-selectable");this.setUnselectable($("body"),null)},setUnselectable:function(element,value){if(element.attr("unselectable")!=value){element.attr("unselectable",value);element.find(':not(input)').attr('unselectable',value)}},mouseMoveScroll:function(event){if(this.mouseMoveScrolling){var delta=this.sizing.mouseDelta(this.scrollEvent,event);this.scrollThumbBy(delta);this.setScrollEvent(event)}},startTouchScrolling:function(event){if(event.touches&&event.touches.length==1){this.setScrollEvent(event.touches[0]);this.touchScrolling=!0;event.stopPropagation()}},touchScroll:function(event){if(this.touchScrolling&&event.touches&&event.touches.length==1){var delta=-this.sizing.mouseDelta(this.scrollEvent,event.touches[0])*this.scrollable.options.swipeSpeed;var scrolled=this.scrollOverviewBy(delta);if(scrolled)
this.setScrollEvent(event.touches[0]);this.stopEventConditionally(event,scrolled)}},stopTouchScrolling:function(event){this.touchScrolling=!1;event.stopPropagation()},mouseWheelScroll:function(deltaX,deltaY){var delta=-this.sizing.wheelDelta(deltaX,deltaY)*this.scrollable.options.wheelSpeed;if(delta!=0)
return this.scrollOverviewBy(delta)},mouseClickScroll:function(event){var delta=this.viewPortSize-20;if(event["page"+this.sizing.scrollAxis()]<this.$thumb.offset()[this.sizing.offsetComponent()])
delta=-delta;this.scrollOverviewBy(delta)},keyScroll:function(event){var keyDown=event.which;if(this.enabled&&this.isKeyScrolling(keyDown)){var scrolled=this.scrollOverviewBy(this.keyScrollDelta(keyDown));this.stopEventConditionally(event,scrolled)}},scrollThumbBy:function(delta){var thumbPosition=this.thumbPosition();thumbPosition+=delta;thumbPosition=this.positionOrMax(thumbPosition,this.maxThumbPosition);var oldScrollPercent=this.scrollPercent;this.scrollPercent=thumbPosition/this.maxThumbPosition;if(oldScrollPercent!=this.scrollPercent){var overviewPosition=(thumbPosition*this.maxOverviewPosition)/this.maxThumbPosition;this.setScrollPosition(overviewPosition,thumbPosition);this.triggerCustomScroll(oldScrollPercent);return!0}
else return!1},thumbPosition:function(){return this.$thumb.position()[this.sizing.offsetComponent()]},scrollOverviewBy:function(delta){var overviewPosition=this.overviewPosition()+delta;return this.scrollOverviewTo(overviewPosition,!1)},overviewPosition:function(){return-this.scrollable.$overview.position()[this.sizing.offsetComponent()]},scrollOverviewTo:function(overviewPosition,animate){overviewPosition=this.positionOrMax(overviewPosition,this.maxOverviewPosition);var oldScrollPercent=this.scrollPercent;this.scrollPercent=overviewPosition/this.maxOverviewPosition;if(oldScrollPercent!=this.scrollPercent){var thumbPosition=this.scrollPercent*this.maxThumbPosition;if(animate)
this.setScrollPositionWithAnimation(overviewPosition,thumbPosition);else this.setScrollPosition(overviewPosition,thumbPosition);this.triggerCustomScroll(oldScrollPercent);return!0}
else return!1},positionOrMax:function(p,max){if(p<0)
return 0;else if(p>max)
return max;else return p},triggerCustomScroll:function(oldScrollPercent){this.scrollable.$element.trigger("customScroll",{scrollAxis:this.sizing.scrollAxis(),direction:this.sizing.scrollDirection(oldScrollPercent,this.scrollPercent),scrollPercent:this.scrollPercent*100})},rescroll:function(keepPosition){if(keepPosition){var overviewPosition=this.positionOrMax(this.overviewPosition(),this.maxOverviewPosition);this.scrollPercent=overviewPosition/this.maxOverviewPosition;var thumbPosition=this.scrollPercent*this.maxThumbPosition;this.setScrollPosition(overviewPosition,thumbPosition)}
else{var thumbPosition=this.scrollPercent*this.maxThumbPosition;var overviewPosition=this.scrollPercent*this.maxOverviewPosition;this.setScrollPosition(overviewPosition,thumbPosition)}},setScrollPosition:function(overviewPosition,thumbPosition){this.$thumb.css(this.sizing.offsetComponent(),thumbPosition+"px");this.scrollable.$overview.css(this.sizing.offsetComponent(),-overviewPosition+"px")},setScrollPositionWithAnimation:function(overviewPosition,thumbPosition){var thumbAnimationOpts={};var overviewAnimationOpts={};thumbAnimationOpts[this.sizing.offsetComponent()]=thumbPosition+"px";this.$thumb.animate(thumbAnimationOpts,this.scrollable.options.animationSpeed);overviewAnimationOpts[this.sizing.offsetComponent()]=-overviewPosition+"px";this.scrollable.$overview.animate(overviewAnimationOpts,this.scrollable.options.animationSpeed)},calculateMaxThumbPosition:function(){return Math.max(0,this.sizing.size(this.$scrollBar)-this.thumbSize)},calculateMaxOverviewPosition:function(){return Math.max(0,this.sizing.size(this.scrollable.$overview)-this.sizing.size(this.scrollable.$viewPort))},setScrollEvent:function(event){var attr="page"+this.sizing.scrollAxis();if(!this.scrollEvent||this.scrollEvent[attr]!=event[attr])
this.scrollEvent={pageX:event.pageX,pageY:event.pageY}},scrollToElement:function(element){var $element=$(element);if(this.sizing.isInside($element,this.scrollable.$overview)&&!this.sizing.isInside($element,this.scrollable.$viewPort)){var elementOffset=$element.offset();var overviewOffset=this.scrollable.$overview.offset();var viewPortOffset=this.scrollable.$viewPort.offset();this.scrollOverviewTo(elementOffset[this.sizing.offsetComponent()]-overviewOffset[this.sizing.offsetComponent()],!0)}},remove:function(){this.removeMouseMoveScrolling();this.removeMouseWheelScrolling();this.removeTouchScrolling();this.removeMouseClickScrolling();this.removeWindowResize()},stopEventConditionally:function(event,condition){if(condition||this.scrollable.options.preventDefaultScroll){event.preventDefault();event.stopPropagation()}}}
var HSizing=function(){}
HSizing.prototype={size:function($el,arg){if(arg)
return $el.width(arg);else return $el.width()},minSize:function($el){return parseInt($el.css("min-width"))||0},maxSize:function($el){return parseInt($el.css("max-width"))||0},fixedThumbSize:function(options){return options.fixedThumbWidth},scrollBar:function($el){return $el.find(".scroll-bar.horizontal")},mouseDelta:function(event1,event2){return event2.pageX-event1.pageX},offsetComponent:function(){return "left"},wheelDelta:function(deltaX,deltaY){return deltaX},scrollAxis:function(){return "X"},scrollDirection:function(oldPercent,newPercent){return oldPercent<newPercent?"right":"left"},scrollingKeys:{37:function(viewPortSize){return-10},39:function(viewPortSize){return 10}},isInside:function(element,wrappingElement){var $element=$(element);var $wrappingElement=$(wrappingElement);var elementOffset=$element.offset();var wrappingElementOffset=$wrappingElement.offset();return(elementOffset.left>=wrappingElementOffset.left)&&(elementOffset.left+$element.width()<=wrappingElementOffset.left+$wrappingElement.width())}}
var VSizing=function(){}
VSizing.prototype={size:function($el,arg){if(arg)
return $el.height(arg);else return parseInt($el.css("height"))||0},minSize:function($el){return parseInt($el.css("min-height"))||0},maxSize:function($el){return parseInt($el.css("max-height"))||0},fixedThumbSize:function(options){return options.fixedThumbHeight},scrollBar:function($el){return $el.find(".scroll-bar.vertical")},mouseDelta:function(event1,event2){return event2.pageY-event1.pageY},offsetComponent:function(){return "top"},wheelDelta:function(deltaX,deltaY){return deltaY},scrollAxis:function(){return "Y"},scrollDirection:function(oldPercent,newPercent){return oldPercent<newPercent?"down":"up"},scrollingKeys:{38:function(viewPortSize){return-10},40:function(viewPortSize){return 10},33:function(viewPortSize){return-(viewPortSize-20)},34:function(viewPortSize){return viewPortSize-20}},isInside:function(element,wrappingElement){var $element=$(element);var $wrappingElement=$(wrappingElement);var elementOffset=$element.offset();var wrappingElementOffset=$wrappingElement.offset();return(elementOffset.top>=wrappingElementOffset.top)&&(elementOffset.top+$element.height()<=wrappingElementOffset.top+$wrappingElement.height())}}
return this.each(function(){if(options==undefined)
options=defaultOptions;if(typeof(options)=="string"){var scrollable=$(this).data("scrollable");if(scrollable)
scrollable[options](args)}
else if(typeof(options)=="object"){options=$.extend(defaultOptions,options);new Scrollable($(this),options)}
else throw "Invalid type of options"})}})(jQuery);(function($){var types=['DOMMouseScroll','mousewheel'];if($.event.fixHooks){for(var i=types.length;i;){$.event.fixHooks[types[--i]]=$.event.mouseHooks}}
$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;i;){this.addEventListener(types[--i],handler,!1)}}else{this.onmousewheel=handler}},teardown:function(){if(this.removeEventListener){for(var i=types.length;i;){this.removeEventListener(types[--i],handler,!1)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn){return fn?this.on("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn){return this.off("mousewheel",fn)}});function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=!0,deltaX=0,deltaY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta){delta=orgEvent.wheelDelta/120}
if(orgEvent.detail){delta=-orgEvent.detail/3}
deltaY=delta;if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;deltaX=delta}
if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120}
if(orgEvent.wheelDeltaX!==undefined){deltaX=orgEvent.wheelDeltaX/120}
args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}})(jQuery);var smf_formSubmitted=!1;var lastKeepAliveCheck=new Date().getTime();var smf_editorArray=new Array();var ua=navigator.userAgent.toLowerCase();var is_opera=ua.indexOf('opera')!=-1;var is_ff=(ua.indexOf('firefox')!=-1||ua.indexOf('iceweasel')!=-1||ua.indexOf('icecat')!=-1||ua.indexOf('shiretoko')!=-1||ua.indexOf('minefield')!=-1)&&!is_opera;var is_gecko=ua.indexOf('gecko')!=-1&&!is_opera;var is_chrome=ua.indexOf('chrome')!=-1;var is_safari=ua.indexOf('applewebkit')!=-1&&!is_chrome;var is_webkit=ua.indexOf('applewebkit')!=-1;var is_ie=ua.indexOf('msie')!=-1&&!is_opera;var is_ie11=ua.indexOf('trident')!=-1&&ua.indexOf('gecko')!=-1;var is_iphone=ua.indexOf('iphone')!=-1||ua.indexOf('ipod')!=-1;var is_android=ua.indexOf('android')!=-1;var ajax_indicator_ele=null;if(!('forms' in document))
document.forms=document.getElementsByTagName('form');if(!('getElementsByClassName' in document))
{document.getElementsByClassName=function(className)
{return $('".'+className+'"')}}
function getServerResponse(sUrl,funcCallback,sType,sDataType)
{var oCaller=this;return oMyDoc=$.ajax({type:sType,url:sUrl,cache:!1,dataType:sDataType,success:function(response){if(typeof(funcCallback)!='undefined')
{funcCallback.call(oCaller,response)}},})}
function getXMLDocument(sUrl,funcCallback)
{var oCaller=this;return $.ajax({type:'GET',url:sUrl,cache:!1,dataType:'xml',success:function(responseXML){if(typeof(funcCallback)!='undefined')
{funcCallback.call(oCaller,responseXML)}},})}
function sendXMLDocument(sUrl,sContent,funcCallback)
{var oCaller=this;var oSendDoc=$.ajax({type:'POST',url:sUrl,data:sContent,beforeSend:function(xhr){xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')},dataType:'xml',success:function(responseXML){if(typeof(funcCallback)!='undefined')
{funcCallback.call(oCaller,responseXML)}},});return!0}
String.prototype.oCharsetConversion={from:'',to:''};String.prototype.php_to8bit=function()
{if(smf_charset=='UTF-8')
{var n,sReturn='';for(var i=0,iTextLen=this.length;i<iTextLen;i++)
{n=this.charCodeAt(i);if(n<128)
sReturn+=String.fromCharCode(n);else if(n<2048)
sReturn+=String.fromCharCode(192|n>>6)+String.fromCharCode(128|n&63);else if(n>=55296&&n<=56319)
{n=65536+((n&1023)<<10)+(this.charCodeAt(i+1)&1023);sReturn+=String.fromCharCode(240|n>>18)+String.fromCharCode(128|n>>12&63)+String.fromCharCode(128|n>>6&63)+String.fromCharCode(128|n&63);i++}
else sReturn+=String.fromCharCode(224|n>>12)+String.fromCharCode(128|n>>6&63)+String.fromCharCode(128|n&63)}
return sReturn}
else if(this.oCharsetConversion.from.length==0)
{switch(smf_charset)
{case 'ISO-8859-1':this.oCharsetConversion={from:'\xa0-\xff',to:'\xa0-\xff'};break;case 'ISO-8859-2':this.oCharsetConversion={from:'\xa0\u0104\u02d8\u0141\xa4\u013d\u015a\xa7\xa8\u0160\u015e\u0164\u0179\xad\u017d\u017b\xb0\u0105\u02db\u0142\xb4\u013e\u015b\u02c7\xb8\u0161\u015f\u0165\u017a\u02dd\u017e\u017c\u0154\xc1\xc2\u0102\xc4\u0139\u0106\xc7\u010c\xc9\u0118\xcb\u011a\xcd\xce\u010e\u0110\u0143\u0147\xd3\xd4\u0150\xd6\xd7\u0158\u016e\xda\u0170\xdc\xdd\u0162\xdf\u0155\xe1\xe2\u0103\xe4\u013a\u0107\xe7\u010d\xe9\u0119\xeb\u011b\xed\xee\u010f\u0111\u0144\u0148\xf3\xf4\u0151\xf6\xf7\u0159\u016f\xfa\u0171\xfc\xfd\u0163\u02d9',to:'\xa0-\xff'};break;case 'ISO-8859-5':this.oCharsetConversion={from:'\xa0\u0401-\u040c\xad\u040e-\u044f\u2116\u0451-\u045c\xa7\u045e\u045f',to:'\xa0-\xff'};break;case 'ISO-8859-9':this.oCharsetConversion={from:'\xa0-\xcf\u011e\xd1-\xdc\u0130\u015e\xdf-\xef\u011f\xf1-\xfc\u0131\u015f\xff',to:'\xa0-\xff'};break;case 'ISO-8859-15':this.oCharsetConversion={from:'\xa0-\xa3\u20ac\xa5\u0160\xa7\u0161\xa9-\xb3\u017d\xb5-\xb7\u017e\xb9-\xbb\u0152\u0153\u0178\xbf-\xff',to:'\xa0-\xff'};break;case 'tis-620':this.oCharsetConversion={from:'\u20ac\u2026\u2018\u2019\u201c\u201d\u2022\u2013\u2014\xa0\u0e01-\u0e3a\u0e3f-\u0e5b',to:'\x80\x85\x91-\x97\xa0-\xda\xdf-\xfb'};break;case 'windows-1251':this.oCharsetConversion={from:'\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u2122\u0459\u203a\u045a\u045c\u045b\u045f\xa0\u040e\u045e\u0408\xa4\u0490\xa6\xa7\u0401\xa9\u0404\xab-\xae\u0407\xb0\xb1\u0406\u0456\u0491\xb5-\xb7\u0451\u2116\u0454\xbb\u0458\u0405\u0455\u0457\u0410-\u044f',to:'\x80-\x97\x99-\xff'};break;case 'windows-1253':this.oCharsetConversion={from:'\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u2030\u2039\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u2122\u203a\xa0\u0385\u0386\xa3-\xa9\xab-\xae\u2015\xb0-\xb3\u0384\xb5-\xb7\u0388-\u038a\xbb\u038c\xbd\u038e-\u03a1\u03a3-\u03ce',to:'\x80\x82-\x87\x89\x8b\x91-\x97\x99\x9b\xa0-\xa9\xab-\xd1\xd3-\xfe'};break;case 'windows-1255':this.oCharsetConversion={from:'\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u2039\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u203a\xa0-\xa3\u20aa\xa5-\xa9\xd7\xab-\xb9\xf7\xbb-\xbf\u05b0-\u05b9\u05bb-\u05c3\u05f0-\u05f4\u05d0-\u05ea\u200e\u200f',to:'\x80\x82-\x89\x8b\x91-\x99\x9b\xa0-\xc9\xcb-\xd8\xe0-\xfa\xfd\xfe'};break;case 'windows-1256':this.oCharsetConversion={from:'\u20ac\u067e\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0679\u2039\u0152\u0686\u0698\u0688\u06af\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u06a9\u2122\u0691\u203a\u0153\u200c\u200d\u06ba\xa0\u060c\xa2-\xa9\u06be\xab-\xb9\u061b\xbb-\xbe\u061f\u06c1\u0621-\u0636\xd7\u0637-\u063a\u0640-\u0643\xe0\u0644\xe2\u0645-\u0648\xe7-\xeb\u0649\u064a\xee\xef\u064b-\u064e\xf4\u064f\u0650\xf7\u0651\xf9\u0652\xfb\xfc\u200e\u200f\u06d2',to:'\x80-\xff'};break;default:this.oCharsetConversion={from:'',to:''};break}
var funcExpandString=function(sSearch){var sInsert='';for(var i=sSearch.charCodeAt(0),n=sSearch.charCodeAt(2);i<=n;i++)
sInsert+=String.fromCharCode(i);return sInsert};this.oCharsetConversion.from=this.oCharsetConversion.from.replace(/.\-./g,funcExpandString);this.oCharsetConversion.to=this.oCharsetConversion.to.replace(/.\-./g,funcExpandString)}
var sReturn='',iOffsetFrom=0;for(var i=0,n=this.length;i<n;i++)
{iOffsetFrom=this.oCharsetConversion.from.indexOf(this.charAt(i));sReturn+=iOffsetFrom>-1?this.oCharsetConversion.to.charAt(iOffsetFrom):(this.charCodeAt(i)>127?'&#'+this.charCodeAt(i)+';':this.charAt(i))}
return sReturn}
String.prototype.php_strtr=function(sFrom,sTo)
{return this.replace(new RegExp('['+sFrom+']','g'),function(sMatch){return sTo.charAt(sFrom.indexOf(sMatch))})}
String.prototype.php_strtolower=function()
{return typeof(smf_iso_case_folding)=='boolean'&&smf_iso_case_folding==!0?this.php_strtr('ABCDEFGHIJKLMNOPQRSTUVWXYZ\x8a\x8c\x8e\x9f\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde','abcdefghijklmnopqrstuvwxyz\x9a\x9c\x9e\xff\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe'):this.php_strtr('ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')}
String.prototype.php_urlencode=function()
{return escape(this).replace(/\+/g,'%2b').replace('*','%2a').replace('/','%2f').replace('@','%40')}
String.prototype.php_htmlspecialchars=function()
{return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
String.prototype.php_unhtmlspecialchars=function()
{return this.replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&')}
String.prototype.php_addslashes=function()
{return this.replace(/\\/g, '\\\\').replace(/'/g,'\\\'')}
String.prototype._replaceEntities=function(sInput,sDummy,sNum)
{return String.fromCharCode(parseInt(sNum))}
String.prototype.removeEntities=function()
{return this.replace(/&(amp;)?#(\d+);/g,this._replaceEntities)}
String.prototype.easyReplace=function(oReplacements)
{var sResult=this;for(var sSearch in oReplacements)
sResult=sResult.replace(new RegExp('%'+sSearch+'%','g'),oReplacements[sSearch]);return sResult}
String.prototype.replaceAll=function(find,replace)
{var str=this;return str.replace(new RegExp(find,'g'),replace)}
function reqWin(desktopURL,alternateWidth,alternateHeight,noScrollbars)
{if((alternateWidth&&self.screen.availWidth*0.8<alternateWidth)||(alternateHeight&&self.screen.availHeight*0.8<alternateHeight))
{noScrollbars=!1;alternateWidth=Math.min(alternateWidth,self.screen.availWidth*0.8);alternateHeight=Math.min(alternateHeight,self.screen.availHeight*0.8)}
else noScrollbars=typeof(noScrollbars)=='boolean'&&noScrollbars==!0;window.open(desktopURL,'requested_popup','toolbar=no,location=no,status=no,menubar=no,scrollbars='+(noScrollbars?'no':'yes')+',width='+(alternateWidth?alternateWidth:480)+',height='+(alternateHeight?alternateHeight:220)+',resizable=no');return!1}
function reqOverlayDiv(desktopURL,sHeader,sIcon)
{var sAjax_indicator='<div class="centertext"><img src="'+smf_images_url+'/loading_sm.gif"></div>';var sIcon=smf_images_url+'/'+(typeof(sIcon)=='string'?sIcon:'helptopics.png');var sHeader=typeof(sHeader)=='string'?sHeader:help_popup_heading_text;var oContainer=new smc_Popup({heading:sHeader,content:sAjax_indicator,icon:sIcon});var oPopup_body=$('#'+oContainer.popup_id).find('.popup_content');$.ajax({url:desktopURL,type:"GET",dataType:"html",beforeSend:function(){},success:function(data,textStatus,xhr){var help_content=$('<div id="temp_help">').html(data).find('a[href$="self.close();"]').hide().prev('br').hide().parent().html();oPopup_body.html(help_content)},error:function(xhr,textStatus,errorThrown){oPopup_body.html(textStatus)},statusCode:{500:function(){if(sHeader=='Login')
oPopup_body.html(banned_text);else oPopup_body.html('500 Internal Server Error')}}});return!1}
function smc_PopupMenu(oOptions)
{this.opt=(typeof oOptions=='object')?oOptions:{};this.opt.menus={}}
smc_PopupMenu.prototype.add=function(sItem,sUrl)
{var $menu=$('#'+sItem+'_menu'),$item=$('#'+sItem+'_menu_top');if($item.length==0)
return;this.opt.menus[sItem]={open:!1,loaded:!1,sUrl:sUrl,itemObj:$item,menuObj:$menu};$item.click({obj:this},function(e){e.preventDefault();e.data.obj.toggle(sItem)})}
smc_PopupMenu.prototype.toggle=function(sItem)
{if(!!this.opt.menus[sItem].open)
this.close(sItem);else this.open(sItem)}
smc_PopupMenu.prototype.open=function(sItem)
{this.closeAll();if(!this.opt.menus[sItem].loaded)
{this.opt.menus[sItem].menuObj.html('<div class="loading">'+(typeof(ajax_notification_text)!=null?ajax_notification_text:'')+'</div>');this.opt.menus[sItem].menuObj.load(this.opt.menus[sItem].sUrl,function(){if($(this).hasClass('scrollable'))
$(this).customScrollbar({skin:"default-skin",hScroll:!1,updateOnWindowResize:!0})});this.opt.menus[sItem].loaded=!0}
this.opt.menus[sItem].menuObj.addClass('visible');this.opt.menus[sItem].itemObj.addClass('open');this.opt.menus[sItem].open=!0;$(document).on('click.menu',{obj:this},function(e){if($(e.target).closest(e.data.obj.opt.menus[sItem].menuObj.parent()).length)
return;e.data.obj.closeAll();$(document).off('click.menu')})}
smc_PopupMenu.prototype.close=function(sItem)
{this.opt.menus[sItem].menuObj.removeClass('visible');this.opt.menus[sItem].itemObj.removeClass('open');this.opt.menus[sItem].open=!1;$(document).off('click.menu')}
smc_PopupMenu.prototype.closeAll=function()
{for(var prop in this.opt.menus)
if(!!this.opt.menus[prop].open)
this.close(prop)}
function smc_Popup(oOptions)
{this.opt=oOptions;this.popup_id=this.opt.custom_id?this.opt.custom_id:'smf_popup';this.show()}
smc_Popup.prototype.show=function()
{popup_class='popup_window '+(this.opt.custom_class?this.opt.custom_class:'description');if(this.opt.icon_class)
icon='<span class="'+this.opt.icon_class+'"></span> ';else icon=this.opt.icon?'<img src="'+this.opt.icon+'" class="icon" alt=""> ':'';$('body').append('<div id="'+this.popup_id+'" class="popup_container"><div class="'+popup_class+'"><div class="catbg popup_heading"><a href="javascript:void(0);" class="main_icons hide_popup"></a>'+icon+this.opt.heading+'</div><div class="popup_content">'+this.opt.content+'</div></div></div>');this.popup_body=$('#'+this.popup_id).children('.popup_window');this.popup_body.parent().fadeIn(300);var popup_instance=this;$(document).mouseup(function(e){if($('#'+popup_instance.popup_id).has(e.target).length===0)
popup_instance.hide()}).keyup(function(e){if(e.keyCode==27)
popup_instance.hide()});$('#'+this.popup_id).find('.hide_popup').click(function(){return popup_instance.hide()});return!1}
smc_Popup.prototype.hide=function()
{$('#'+this.popup_id).fadeOut(300,function(){$(this).remove()});return!1}
function storeCaret(oTextHandle)
{if('createTextRange' in oTextHandle)
oTextHandle.caretPos=document.selection.createRange().duplicate()}
function replaceText(text,oTextHandle)
{if('caretPos' in oTextHandle&&'createTextRange' in oTextHandle)
{var caretPos=oTextHandle.caretPos;caretPos.text=caretPos.text.charAt(caretPos.text.length-1)==' '?text+' ':text;caretPos.select()}
else if('selectionStart' in oTextHandle)
{var begin=oTextHandle.value.substr(0,oTextHandle.selectionStart);var end=oTextHandle.value.substr(oTextHandle.selectionEnd);var scrollPos=oTextHandle.scrollTop;oTextHandle.value=begin+text+end;if(oTextHandle.setSelectionRange)
{oTextHandle.focus();var goForward=is_opera?text.match(/\n/g).length:0;oTextHandle.setSelectionRange(begin.length+text.length+goForward,begin.length+text.length+goForward)}
oTextHandle.scrollTop=scrollPos}
else{oTextHandle.value+=text;oTextHandle.focus(oTextHandle.value.length-1)}}
function surroundText(text1,text2,oTextHandle)
{if('caretPos' in oTextHandle&&'createTextRange' in oTextHandle)
{var caretPos=oTextHandle.caretPos,temp_length=caretPos.text.length;caretPos.text=caretPos.text.charAt(caretPos.text.length-1)==' '?text1+caretPos.text+text2+' ':text1+caretPos.text+text2;if(temp_length==0)
{caretPos.moveStart('character',-text2.length);caretPos.moveEnd('character',-text2.length);caretPos.select()}
else oTextHandle.focus(caretPos)}
else if('selectionStart' in oTextHandle)
{var begin=oTextHandle.value.substr(0,oTextHandle.selectionStart);var selection=oTextHandle.value.substr(oTextHandle.selectionStart,oTextHandle.selectionEnd-oTextHandle.selectionStart);var end=oTextHandle.value.substr(oTextHandle.selectionEnd);var newCursorPos=oTextHandle.selectionStart;var scrollPos=oTextHandle.scrollTop;oTextHandle.value=begin+text1+selection+text2+end;if(oTextHandle.setSelectionRange)
{var goForward=is_opera?text1.match(/\n/g).length:0,goForwardAll=is_opera?(text1+text2).match(/\n/g).length:0;if(selection.length==0)
oTextHandle.setSelectionRange(newCursorPos+text1.length+goForward,newCursorPos+text1.length+goForward);else oTextHandle.setSelectionRange(newCursorPos,newCursorPos+text1.length+selection.length+text2.length+goForwardAll);oTextHandle.focus()}
oTextHandle.scrollTop=scrollPos}
else{oTextHandle.value+=text1+text2;oTextHandle.focus(oTextHandle.value.length-1)}}
function isEmptyText(theField)
{if(typeof(theField)=='string')
var theValue=theField;else var theValue=theField.value;while(theValue.length>0&&(theValue.charAt(0)==' '||theValue.charAt(0)=='\t'))
theValue=theValue.substring(1,theValue.length);while(theValue.length>0&&(theValue.charAt(theValue.length-1)==' '||theValue.charAt(theValue.length-1)=='\t'))
theValue=theValue.substring(0,theValue.length-1);return theValue==''}
function submitonce(theform)
{smf_formSubmitted=!0;for(var i=0;i<smf_editorArray.length;i++)
smf_editorArray[i].doSubmit();}
function submitThisOnce(oControl)
{var oForm='form' in oControl?oControl.form:oControl;var aTextareas=oForm.getElementsByTagName('textarea');for(var i=0,n=aTextareas.length;i<n;i++)
aTextareas[i].readOnly=!0;return!smf_formSubmitted}
function setInnerHTML(oElement,sToValue)
{oElement.innerHTML=sToValue}
function getInnerHTML(oElement)
{return oElement.innerHTML}
function setOuterHTML(oElement,sToValue)
{if('outerHTML' in oElement)
oElement.outerHTML=sToValue;else{var range=document.createRange();range.setStartBefore(oElement);oElement.parentNode.replaceChild(range.createContextualFragment(sToValue),oElement)}}
function in_array(variable,theArray)
{for(var i in theArray)
if(theArray[i]==variable)
return!0;return!1}
function array_search(variable,theArray)
{for(var i in theArray)
if(theArray[i]==variable)
return i;return null}
function selectRadioByName(oRadioGroup,sName)
{if(!('length' in oRadioGroup))
return oRadioGroup.checked=!0;for(var i=0,n=oRadioGroup.length;i<n;i++)
if(oRadioGroup[i].value==sName)
return oRadioGroup[i].checked=!0;return!1}
function selectAllRadio(oInvertCheckbox,oForm,sMask,sValue,bIgnoreDisabled)
{for(var i=0;i<oForm.length;i++)
if(oForm[i].name!=undefined&&oForm[i].name.substr(0,sMask.length)==sMask&&oForm[i].value==sValue&&(!oForm[i].disabled||(typeof(bIgnoreDisabled)=='boolean'&&bIgnoreDisabled)))
oForm[i].checked=!0}
function invertAll(oInvertCheckbox,oForm,sMask,bIgnoreDisabled)
{for(var i=0;i<oForm.length;i++)
{if(!('name' in oForm[i])||(typeof(sMask)=='string'&&oForm[i].name.substr(0,sMask.length)!=sMask&&oForm[i].id.substr(0,sMask.length)!=sMask))
continue;if(!oForm[i].disabled||(typeof(bIgnoreDisabled)=='boolean'&&bIgnoreDisabled))
oForm[i].checked=oInvertCheckbox.checked}}
var lastKeepAliveCheck=new Date().getTime();function smf_sessionKeepAlive()
{var curTime=new Date().getTime();if(smf_scripturl&&curTime-lastKeepAliveCheck>900000)
{var tempImage=new Image();tempImage.src=smf_prepareScriptUrl(smf_scripturl)+'action=keepalive;time='+curTime;lastKeepAliveCheck=curTime}
window.setTimeout('smf_sessionKeepAlive();',1200000)}
window.setTimeout('smf_sessionKeepAlive();',1200000);function smf_setThemeOption(theme_var,theme_value,theme_id,theme_cur_session_id,theme_cur_session_var,theme_additional_vars)
{if(theme_cur_session_id==null)
theme_cur_session_id=smf_session_id;if(typeof(theme_cur_session_var)=='undefined')
theme_cur_session_var='sesc';if(theme_additional_vars==null)
theme_additional_vars='';var tempImage=new Image();tempImage.src=smf_prepareScriptUrl(smf_scripturl)+'action=jsoption;var='+theme_var+';val='+theme_value+';'+theme_cur_session_var+'='+theme_cur_session_id+theme_additional_vars+(theme_id==null?'':'&th='+theme_id)+';time='+(new Date().getTime())}
function expandPages(spanNode,baseLink,firstPage,lastPage,perPage)
{var replacement='',i,oldLastPage=0;var perPageLimit=50;if((lastPage-firstPage)/perPage>perPageLimit)
{oldLastPage=lastPage;lastPage=firstPage+perPageLimit*perPage}
for(i=firstPage;i<lastPage;i+=perPage)
replacement+=baseLink.replace(/%1\$d/,i).replace(/%2\$s/,1+i/ perPage).replace(/%%/g,'%');$(spanNode).before(replacement);if(oldLastPage)
spanNode.onclick=function()
{expandPages(spanNode,baseLink,lastPage,oldLastPage,perPage)};else $(spanNode).remove()}
function smc_preCacheImage(sSrc)
{if(!('smc_aCachedImages' in window))
window.smc_aCachedImages=[];if(!in_array(sSrc,window.smc_aCachedImages))
{var oImage=new Image();oImage.src=sSrc}}
function smc_Cookie(oOptions)
{this.opt=oOptions;this.oCookies={};this.init()}
smc_Cookie.prototype.init=function()
{if('cookie' in document&&document.cookie!='')
{var aCookieList=document.cookie.split(';');for(var i=0,n=aCookieList.length;i<n;i++)
{var aNameValuePair=aCookieList[i].split('=');this.oCookies[aNameValuePair[0].replace(/^\s+|\s+$/g,'')]=decodeURIComponent(aNameValuePair[1])}}}
smc_Cookie.prototype.get=function(sKey)
{return sKey in this.oCookies?this.oCookies[sKey]:null}
smc_Cookie.prototype.set=function(sKey,sValue)
{document.cookie=sKey+'='+encodeURIComponent(sValue)}
function smc_Toggle(oOptions)
{this.opt=oOptions;this.bCollapsed=!1;this.oCookie=null;this.init()}
smc_Toggle.prototype.init=function()
{if('bToggleEnabled' in this.opt&&!this.opt.bToggleEnabled)
return;if('oCookieOptions' in this.opt&&this.opt.oCookieOptions.bUseCookie)
{this.oCookie=new smc_Cookie({});var cookieValue=this.oCookie.get(this.opt.oCookieOptions.sCookieName)
if(cookieValue!=null)
this.opt.bCurrentlyCollapsed=cookieValue=='1'}
if('aSwapImages' in this.opt)
{for(var i=0,n=this.opt.aSwapImages.length;i<n;i++)
{this.opt.aSwapImages[i].isCSS=(typeof this.opt.aSwapImages[i].srcCollapsed=='undefined');if(this.opt.aSwapImages[i].isCSS)
{if(!this.opt.aSwapImages[i].cssCollapsed)
this.opt.aSwapImages[i].cssCollapsed='toggle_down';if(!this.opt.aSwapImages[i].cssExpanded)
this.opt.aSwapImages[i].cssExpanded='toggle_up'}
else{smc_preCacheImage(this.opt.aSwapImages[i].srcCollapsed)}
$('#'+this.opt.aSwapImages[i].sId).show();var oImage=document.getElementById(this.opt.aSwapImages[i].sId);if(typeof(oImage)=='object'&&oImage!=null)
{oImage.instanceRef=this;oImage.onclick=function(){this.instanceRef.toggle();this.blur()}
oImage.style.cursor='pointer'}}}
if('aSwapLinks' in this.opt)
{for(var i=0,n=this.opt.aSwapLinks.length;i<n;i++)
{var oLink=document.getElementById(this.opt.aSwapLinks[i].sId);if(typeof(oLink)=='object'&&oLink!=null)
{if(oLink.style.display=='none')
oLink.style.display='';oLink.instanceRef=this;oLink.onclick=function(){this.instanceRef.toggle();this.blur();return!1}}}}
if(this.opt.bCurrentlyCollapsed)
this.changeState(!0,!0)}
smc_Toggle.prototype.changeState=function(bCollapse,bInit)
{bInit=typeof(bInit)!=='undefined';if(!bInit&&bCollapse&&'funcOnBeforeCollapse' in this.opt)
{this.tmpMethod=this.opt.funcOnBeforeCollapse;this.tmpMethod();delete this.tmpMethod}
else if(!bInit&&!bCollapse&&'funcOnBeforeExpand' in this.opt)
{this.tmpMethod=this.opt.funcOnBeforeExpand;this.tmpMethod();delete this.tmpMethod}
if('aSwapImages' in this.opt)
{for(var i=0,n=this.opt.aSwapImages.length;i<n;i++)
{if(this.opt.aSwapImages[i].isCSS)
{$('#'+this.opt.aSwapImages[i].sId).toggleClass(this.opt.aSwapImages[i].cssCollapsed,bCollapse).toggleClass(this.opt.aSwapImages[i].cssExpanded,!bCollapse).attr('title',bCollapse?this.opt.aSwapImages[i].altCollapsed:this.opt.aSwapImages[i].altExpanded)}
else{var oImage=document.getElementById(this.opt.aSwapImages[i].sId);if(typeof(oImage)=='object'&&oImage!=null)
{var sTargetSource=bCollapse?this.opt.aSwapImages[i].srcCollapsed:this.opt.aSwapImages[i].srcExpanded;if(oImage.src!=sTargetSource)
oImage.src=sTargetSource;oImage.alt=oImage.title=bCollapse?this.opt.aSwapImages[i].altCollapsed:this.opt.aSwapImages[i].altExpanded}}}}
if('aSwapLinks' in this.opt)
{for(var i=0,n=this.opt.aSwapLinks.length;i<n;i++)
{var oLink=document.getElementById(this.opt.aSwapLinks[i].sId);if(typeof(oLink)=='object'&&oLink!=null)
setInnerHTML(oLink,bCollapse?this.opt.aSwapLinks[i].msgCollapsed:this.opt.aSwapLinks[i].msgExpanded)}}
for(var i=0,n=this.opt.aSwappableContainers.length;i<n;i++)
{if(this.opt.aSwappableContainers[i]==null)
continue;var oContainer=document.getElementById(this.opt.aSwappableContainers[i]);if(typeof(oContainer)=='object'&&oContainer!=null)
{if(!!this.opt.bNoAnimate||bInit)
{$(oContainer).toggle(!bCollapse)}
else{if(bCollapse)
{if(this.opt.aHeader!=null&&this.opt.aHeader.hasClass('cat_bar'))
$(this.opt.aHeader).addClass('collapsed');$(oContainer).slideUp()}
else{if(this.opt.aHeader!=null&&this.opt.aHeader.hasClass('cat_bar'))
$(this.opt.aHeader).removeClass('collapsed');$(oContainer).slideDown()}}}}
this.bCollapsed=bCollapse;if('oCookieOptions' in this.opt&&this.opt.oCookieOptions.bUseCookie)
this.oCookie.set(this.opt.oCookieOptions.sCookieName,this.bCollapsed|0);if(!bInit&&'oThemeOptions' in this.opt&&this.opt.oThemeOptions.bUseThemeSettings)
smf_setThemeOption(this.opt.oThemeOptions.sOptionName,this.bCollapsed|0,'sThemeId' in this.opt.oThemeOptions?this.opt.oThemeOptions.sThemeId:null,smf_session_id,smf_session_var,'sAdditionalVars' in this.opt.oThemeOptions?this.opt.oThemeOptions.sAdditionalVars:null)}
smc_Toggle.prototype.toggle=function()
{this.changeState(!this.bCollapsed)}
function ajax_indicator(turn_on)
{if(ajax_indicator_ele==null)
{ajax_indicator_ele=document.getElementById('ajax_in_progress');if(ajax_indicator_ele==null&&typeof(ajax_notification_text)!=null)
{create_ajax_indicator_ele()}}
if(ajax_indicator_ele!=null)
{ajax_indicator_ele.style.display=turn_on?'block':'none'}}
function create_ajax_indicator_ele()
{ajax_indicator_ele=document.createElement('div');ajax_indicator_ele.id='ajax_in_progress';ajax_indicator_ele.innerHTML+=ajax_notification_text;document.body.appendChild(ajax_indicator_ele)}
function createEventListener(oTarget)
{if(!('addEventListener' in oTarget))
{if(oTarget.attachEvent)
{oTarget.addEventListener=function(sEvent,funcHandler,bCapture){oTarget.attachEvent('on'+sEvent,funcHandler)}
oTarget.removeEventListener=function(sEvent,funcHandler,bCapture){oTarget.detachEvent('on'+sEvent,funcHandler)}}
else{oTarget.addEventListener=function(sEvent,funcHandler,bCapture){oTarget['on'+sEvent]=funcHandler}
oTarget.removeEventListener=function(sEvent,funcHandler,bCapture){oTarget['on'+sEvent]=null}}}}
function grabJumpToContent(elem)
{var oXMLDoc=getXMLDocument(smf_prepareScriptUrl(smf_scripturl)+'action=xmlhttp;sa=jumpto;xml');var aBoardsAndCategories=[];ajax_indicator(!0);oXMLDoc.done(function(data,textStatus,jqXHR){var items=$(data).find('item');items.each(function(i){aBoardsAndCategories[i]={id:parseInt($(this).attr('id')),isCategory:$(this).attr('type')=='category',name:this.firstChild.nodeValue.removeEntities(),is_current:!1,childLevel:parseInt($(this).attr('childlevel'))}});ajax_indicator(!1);for(var i=0,n=aJumpTo.length;i<n;i++)
{aJumpTo[i].fillSelect(aBoardsAndCategories)}})}
var aJumpTo=new Array();function JumpTo(oJumpToOptions)
{this.opt=oJumpToOptions;this.dropdownList=null;this.showSelect();$('#'+this.opt.sContainerId).one('mouseenter',function(){grabJumpToContent(this)})}
JumpTo.prototype.showSelect=function()
{var sChildLevelPrefix='';for(var i=this.opt.iCurBoardChildLevel;i>0;i--)
sChildLevelPrefix+=this.opt.sBoardChildLevelIndicator;setInnerHTML(document.getElementById(this.opt.sContainerId),this.opt.sJumpToTemplate.replace(/%select_id%/,this.opt.sContainerId+'_select').replace(/%dropdown_list%/,'<select '+(this.opt.bDisabled==!0?'disabled ':'')+(this.opt.sClassName!=undefined?'class="'+this.opt.sClassName+'" ':'')+'name="'+(this.opt.sCustomName!=undefined?this.opt.sCustomName:this.opt.sContainerId+'_select')+'" id="'+this.opt.sContainerId+'_select"><option value="'+(this.opt.bNoRedirect!=undefined&&this.opt.bNoRedirect==!0?this.opt.iCurBoardId:'?board='+this.opt.iCurBoardId+'.0')+'">'+sChildLevelPrefix+this.opt.sBoardPrefix+this.opt.sCurBoardName.removeEntities()+'</option></select>&nbsp;'+(this.opt.sGoButtonLabel!=undefined?'<input type="button" class="button" value="'+this.opt.sGoButtonLabel+'" onclick="window.location.href = \''+smf_prepareScriptUrl(smf_scripturl)+'board='+this.opt.iCurBoardId+'.0\';">':'')));this.dropdownList=document.getElementById(this.opt.sContainerId+'_select')}
JumpTo.prototype.fillSelect=function(aBoardsAndCategories)
{var iIndexPointer=0;var oDashOption=document.createElement('option');oDashOption.appendChild(document.createTextNode(this.opt.sCatSeparator));oDashOption.disabled='disabled';oDashOption.value='';if('onbeforeactivate' in document)
this.dropdownList.onbeforeactivate=null;else this.dropdownList.onfocus=null;if(this.opt.bNoRedirect)
this.dropdownList.options[0].disabled='disabled';var oListFragment=document.createDocumentFragment();for(var i=0,n=aBoardsAndCategories.length;i<n;i++)
{var j,sChildLevelPrefix,oOption;if(!aBoardsAndCategories[i].isCategory&&aBoardsAndCategories[i].id==this.opt.iCurBoardId)
{this.dropdownList.insertBefore(oListFragment,this.dropdownList.options[0]);oListFragment=document.createDocumentFragment();continue}
if(aBoardsAndCategories[i].isCategory)
oListFragment.appendChild(oDashOption.cloneNode(!0));else for(j=aBoardsAndCategories[i].childLevel,sChildLevelPrefix='';j>0;j--)
sChildLevelPrefix+=this.opt.sBoardChildLevelIndicator;oOption=document.createElement('option');oOption.appendChild(document.createTextNode((aBoardsAndCategories[i].isCategory?this.opt.sCatPrefix:sChildLevelPrefix+this.opt.sBoardPrefix)+aBoardsAndCategories[i].name));if(!this.opt.bNoRedirect)
oOption.value=aBoardsAndCategories[i].isCategory?'#c'+aBoardsAndCategories[i].id:'?board='+aBoardsAndCategories[i].id+'.0';else{if(aBoardsAndCategories[i].isCategory)
oOption.disabled='disabled';else oOption.value=aBoardsAndCategories[i].id}
oListFragment.appendChild(oOption);if(aBoardsAndCategories[i].isCategory)
oListFragment.appendChild(oDashOption.cloneNode(!0))}
this.dropdownList.appendChild(oListFragment);if(!this.opt.bNoRedirect)
this.dropdownList.onchange=function(){if(this.selectedIndex>0&&this.options[this.selectedIndex].value)
window.location.href=smf_scripturl+this.options[this.selectedIndex].value.substr(smf_scripturl.indexOf('?')==-1||this.options[this.selectedIndex].value.substr(0,1)!='?'?0:1)}}
var aIconLists=new Array();function IconList(oOptions)
{this.opt=oOptions;this.bListLoaded=!1;this.oContainerDiv=null;this.funcMousedownHandler=null;this.funcParent=this;this.iCurMessageId=0;this.iCurTimeout=0;if(!('sSessionVar' in this.opt))
this.opt.sSessionVar='sesc';this.initIcons()}
IconList.prototype.initIcons=function()
{for(var i=document.images.length-1,iPrefixLength=this.opt.sIconIdPrefix.length;i>=0;i--)
if(document.images[i].id.substr(0,iPrefixLength)==this.opt.sIconIdPrefix)
setOuterHTML(document.images[i],'<div title="'+this.opt.sLabelIconList+'" onclick="'+this.opt.sBackReference+'.openPopup(this, '+document.images[i].id.substr(iPrefixLength)+')" onmouseover="'+this.opt.sBackReference+'.onBoxHover(this, true)" onmouseout="'+this.opt.sBackReference+'.onBoxHover(this, false)" style="background: '+this.opt.sBoxBackground+'; cursor: pointer; padding: 3px; text-align: center;"><img src="'+document.images[i].src+'" alt="'+document.images[i].alt+'" id="'+document.images[i].id+'"></div>');}
IconList.prototype.onBoxHover=function(oDiv,bMouseOver)
{oDiv.style.border=bMouseOver?this.opt.iBoxBorderWidthHover+'px solid '+this.opt.sBoxBorderColorHover:'';oDiv.style.background=bMouseOver?this.opt.sBoxBackgroundHover:this.opt.sBoxBackground;oDiv.style.padding=bMouseOver?(3-this.opt.iBoxBorderWidthHover)+'px':'3px'}
IconList.prototype.openPopup=function(oDiv,iMessageId)
{this.iCurMessageId=iMessageId;if(!this.bListLoaded&&this.oContainerDiv==null)
{this.oContainerDiv=document.createElement('div');this.oContainerDiv.id='iconList';this.oContainerDiv.style.display='none';this.oContainerDiv.style.cursor='pointer';this.oContainerDiv.style.position='absolute';this.oContainerDiv.style.background=this.opt.sContainerBackground;this.oContainerDiv.style.border=this.opt.sContainerBorder;this.oContainerDiv.style.padding='6px 0px';document.body.appendChild(this.oContainerDiv);ajax_indicator(!0);sendXMLDocument.call(this,smf_prepareScriptUrl(smf_scripturl)+'action=xmlhttp;sa=messageicons;board='+this.opt.iBoardId+';xml','',this.onIconsReceived);createEventListener(document.body)}
var aPos=smf_itemPos(oDiv);this.oContainerDiv.style.top=(aPos[1]+oDiv.offsetHeight)+'px';this.oContainerDiv.style.left=(aPos[0]-1)+'px';this.oClickedIcon=oDiv;if(this.bListLoaded)
this.oContainerDiv.style.display='block';document.body.addEventListener('mousedown',this.onWindowMouseDown,!1)}
IconList.prototype.onIconsReceived=function(oXMLDoc)
{var icons=oXMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('icon');var sItems='';for(var i=0,n=icons.length;i<n;i++)
sItems+='<span onmouseover="'+this.opt.sBackReference+'.onItemHover(this, true)" onmouseout="'+this.opt.sBackReference+'.onItemHover(this, false);" onmousedown="'+this.opt.sBackReference+'.onItemMouseDown(this, \''+icons[i].getAttribute('value')+'\');" style="padding: 2px 3px; line-height: 20px; border: '+this.opt.sItemBorder+'; background: '+this.opt.sItemBackground+'"><img src="'+icons[i].getAttribute('url')+'" alt="'+icons[i].getAttribute('name')+'" title="'+icons[i].firstChild.nodeValue+'" style="vertical-align: middle"></span>';setInnerHTML(this.oContainerDiv,sItems);this.oContainerDiv.style.display='block';this.bListLoaded=!0;if(is_ie)
this.oContainerDiv.style.width=this.oContainerDiv.clientWidth+'px';ajax_indicator(!1)}
IconList.prototype.onItemHover=function(oDiv,bMouseOver)
{oDiv.style.background=bMouseOver?this.opt.sItemBackgroundHover:this.opt.sItemBackground;oDiv.style.border=bMouseOver?this.opt.sItemBorderHover:this.opt.sItemBorder;if(this.iCurTimeout!=0)
window.clearTimeout(this.iCurTimeout);if(bMouseOver)
this.onBoxHover(this.oClickedIcon,!0);else this.iCurTimeout=window.setTimeout(this.opt.sBackReference+'.collapseList();',500)}
IconList.prototype.onItemMouseDown=function(oDiv,sNewIcon)
{if(this.iCurMessageId!=0)
{ajax_indicator(!0);this.tmpMethod=getXMLDocument;var oXMLDoc=this.tmpMethod(smf_prepareScriptUrl(smf_scripturl)+'action=jsmodify;topic='+this.opt.iTopicId+';msg='+this.iCurMessageId+';'+smf_session_var+'='+smf_session_id+';icon='+sNewIcon+';xml'),oThis=this;delete this.tmpMethod;ajax_indicator(!1);oXMLDoc.done(function(data,textStatus,jqXHR){oMessage=$(data).find('message')
curMessageId=oMessage.attr('id').replace(/^\D+/g,'');if(oMessage.find('error').length==0)
{if(oThis.opt.bShowModify&&oMessage.find('modified').length!=0)
$('#modified_'+curMessageId).html(oMessage.find('modified').text());oThis.oClickedIcon.getElementsByTagName('img')[0].src=oDiv.getElementsByTagName('img')[0].src}})}}
IconList.prototype.onWindowMouseDown=function()
{for(var i=aIconLists.length-1;i>=0;i--)
{aIconLists[i].funcParent.tmpMethod=aIconLists[i].collapseList;aIconLists[i].funcParent.tmpMethod();delete aIconLists[i].funcParent.tmpMethod}}
IconList.prototype.collapseList=function()
{this.onBoxHover(this.oClickedIcon,!1);this.oContainerDiv.style.display='none';this.iCurMessageId=0;document.body.removeEventListener('mousedown',this.onWindowMouseDown,!1)}
function smf_mousePose(oEvent)
{var x=0;var y=0;if(oEvent.pageX)
{y=oEvent.pageY;x=oEvent.pageX}
else if(oEvent.clientX)
{x=oEvent.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);y=oEvent.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)}
return[x,y]}
function smf_itemPos(itemHandle)
{var itemX=0;var itemY=0;if('offsetParent' in itemHandle)
{itemX=itemHandle.offsetLeft;itemY=itemHandle.offsetTop;while(itemHandle.offsetParent&&typeof(itemHandle.offsetParent)=='object')
{itemHandle=itemHandle.offsetParent;itemX+=itemHandle.offsetLeft;itemY+=itemHandle.offsetTop}}
else if('x' in itemHandle)
{itemX=itemHandle.x;itemY=itemHandle.y}
return[itemX,itemY]}
function smf_prepareScriptUrl(sUrl)
{return sUrl.indexOf('?')==-1?sUrl+'?':sUrl+(sUrl.charAt(sUrl.length-1)=='?'||sUrl.charAt(sUrl.length-1)=='&'||sUrl.charAt(sUrl.length-1)==';'?'':';')}
var aOnloadEvents=new Array();function addLoadEvent(fNewOnload)
{if(typeof(fNewOnload)=='function'&&(!('onload' in window)||typeof(window.onload)!='function'))
window.onload=fNewOnload;else if(aOnloadEvents.length==0)
{aOnloadEvents[0]=window.onload;aOnloadEvents[1]=fNewOnload;window.onload=function(){for(var i=0,n=aOnloadEvents.length;i<n;i++)
{if(typeof(aOnloadEvents[i])=='function')
aOnloadEvents[i]();else if(typeof(aOnloadEvents[i])=='string')
eval(aOnloadEvents[i])}}}
else aOnloadEvents[aOnloadEvents.length]=fNewOnload}
function smfSelectText(oCurElement,bActOnElement)
{if(typeof(bActOnElement)=='boolean'&&bActOnElement)
var oCodeArea=document.getElementById(oCurElement);else var oCodeArea=oCurElement.parentNode.nextSibling;if(typeof(oCodeArea)!='object'||oCodeArea==null)
return!1;if('createTextRange' in document.body)
{var oCurRange=document.body.createTextRange();oCurRange.moveToElementText(oCodeArea);oCurRange.select()}
else if(window.getSelection)
{var oCurSelection=window.getSelection();if(oCurSelection.setBaseAndExtent)
{oCurSelection.setBaseAndExtent(oCodeArea,0,oCodeArea,oCodeArea.childNodes.length)}
else{var curRange=document.createRange();curRange.selectNodeContents(oCodeArea);oCurSelection.removeAllRanges();oCurSelection.addRange(curRange)}}
return!1}
function cleanFileInput(idElement)
{if(is_opera||is_ie||is_safari||is_chrome)
{document.getElementById(idElement).outerHTML=document.getElementById(idElement).outerHTML}
else{document.getElementById(idElement).type='input';document.getElementById(idElement).type='file'}}
function reActivate()
{document.forms.postmodify.message.readOnly=!1}
function showimage()
{document.images.icons.src=icon_urls[document.forms.postmodify.icon.options[document.forms.postmodify.icon.selectedIndex].value]}
function expandThumb(thumbID)
{var img=document.getElementById('thumb_'+thumbID);var link=document.getElementById('link_'+thumbID);var tmp_src=img.src;var tmp_height=img.style.height;var tmp_width=img.style.width;img.src=link.href;img.style.width=link.style.width;img.style.height=link.style.height;link.href=tmp_src;link.style.width=tmp_width;link.style.height=tmp_height;return!1}
function pollOptions()
{var expire_time=document.getElementById('poll_expire');if(isEmptyText(expire_time)||expire_time.value==0)
{document.forms.postmodify.poll_hide[2].disabled=!0;if(document.forms.postmodify.poll_hide[2].checked)
document.forms.postmodify.poll_hide[1].checked=!0}
else document.forms.postmodify.poll_hide[2].disabled=!1}
function generateDays(offset)
{offset=typeof(offset)!='undefined'?offset:'';var days=0,selected=0;var dayElement=document.getElementById("day"+offset),yearElement=document.getElementById("year"+offset),monthElement=document.getElementById("month"+offset);var monthLength=[31,28,31,30,31,30,31,31,30,31,30,31];if(yearElement.options[yearElement.selectedIndex].value%4==0)
monthLength[1]=29;selected=dayElement.selectedIndex;while(dayElement.options.length)
dayElement.options[0]=null;days=monthLength[monthElement.value-1];for(i=1;i<=days;i++)
dayElement.options[dayElement.length]=new Option(i,i);if(selected<days)
dayElement.selectedIndex=selected}
function toggleLinked(form)
{form.board.disabled=!form.link_to_board.checked}
function initSearch()
{if(document.forms.searchform.search.value.indexOf("%u")!=-1)
document.forms.searchform.search.value=unescape(document.forms.searchform.search.value)}
function selectBoards(ids,aFormID)
{var toggle=!0;var aForm=document.getElementById(aFormID);for(i=0;i<ids.length;i++)
toggle=toggle&aForm["brd"+ids[i]].checked;for(i=0;i<ids.length;i++)
aForm["brd"+ids[i]].checked=!toggle}
function updateRuleDef(optNum)
{if(document.getElementById("ruletype"+optNum).value=="gid")
{document.getElementById("defdiv"+optNum).style.display="none";document.getElementById("defseldiv"+optNum).style.display=""}
else if(document.getElementById("ruletype"+optNum).value=="bud"||document.getElementById("ruletype"+optNum).value=="")
{document.getElementById("defdiv"+optNum).style.display="none";document.getElementById("defseldiv"+optNum).style.display="none"}
else{document.getElementById("defdiv"+optNum).style.display="";document.getElementById("defseldiv"+optNum).style.display="none"}}
function updateActionDef(optNum)
{if(document.getElementById("acttype"+optNum).value=="lab")
{document.getElementById("labdiv"+optNum).style.display=""}
else{document.getElementById("labdiv"+optNum).style.display="none"}}
function makeToggle(el,text)
{var t=document.createElement("a");t.href='javascript:void(0);';t.textContent=text;t.className='toggle_down';createEventListener(t);t.addEventListener('click',function()
{var d=this.nextSibling;d.classList.toggle('hidden');this.className=this.className=='toggle_down'?'toggle_up':'toggle_down'},!1);el.classList.add('hidden');el.parentNode.insertBefore(t,el)}
function smc_resize(selector)
{var allElements=[];$(selector).each(function(){$thisElement=$(this);$thisElement.removeAttr('width').removeAttr('height');$thisElement.basedElement=$thisElement.parent();$thisElement.defaultWidth=$thisElement.width();$thisElement.defaultHeight=$thisElement.height();$thisElement.aspectRatio=$thisElement.defaultHeight/$thisElement.defaultWidth;allElements.push($thisElement)});$(window).resize(function(){$(allElements).each(function(){_innerElement=this;var newWidth=_innerElement.basedElement.width();var newHeight=(newWidth*_innerElement.aspectRatio)<=_innerElement.defaultHeight?(newWidth*_innerElement.aspectRatio):_innerElement.defaultHeight;var applyResize=(newWidth<=_innerElement.defaultWidth),applyWidth=!applyResize?_innerElement.defaultWidth:newWidth,applyHeight=!applyResize?_innerElement.defaultHeight:newHeight;if(applyWidth<=0&&applyHeight<=0){applyWidth=_innerElement.defaultWidth;applyHeight=_innerElement.defaultHeight}
_innerElement.width(applyWidth).height(applyHeight)})}).resize()}
$(function(){$('.buttonlist > .dropmenu').each(function(index,item){$(item).prev().click(function(e){e.stopPropagation();e.preventDefault();if($(item).is(':visible')){$(item).css('display','none');return!0}
$(item).css('display','block');$(item).css('top',$(this).offset().top+$(this).height());$(item).css('left',Math.max($(this).offset().left-$(item).width()+$(this).outerWidth(),0));$(item).height($(item).find('div:first').height())});$(document).click(function(){$(item).css('display','none')})});$(document).on('click','.you_sure',function(){var custom_message=$(this).attr('data-confirm');var timeBefore=new Date();var result=confirm(custom_message?custom_message.replace(/-n-/g,"\n"):smf_you_sure);var timeAfter=new Date();if(!result&&(timeAfter-timeBefore)<10)
return!0;return result});$('.smf_select_text').on('click',function(e){e.preventDefault();var actOnElement=$(this).attr('data-actonelement');return typeof actOnElement!=="undefined"?smfSelectText(actOnElement,!0):smfSelectText(this)});$('.bbc_code').each(function(index,item){if($(item).css('max-height')=='none')
return;if($(item).prop('scrollHeight')>parseInt($(item).css('max-height'),10))
$(item.previousSibling).find('.smf_expand_code').removeClass('hidden')});$('.smf_expand_code').on('click',function(e){e.preventDefault();var oCodeArea=this.parentNode.nextSibling;if(oCodeArea.classList.contains('expand_code')){$(oCodeArea).removeClass('expand_code');$(this).html($(this).attr('data-expand-txt'))}
else{$(oCodeArea).addClass('expand_code');$(this).html($(this).attr('data-shrink-txt'))}});if(smf_quote_expand)
{$('blockquote').each(function(index,item){let cite=$(item).find('cite').first();let quote_height=parseInt($(item).height());if(quote_height<smf_quote_expand)
return;$(item).css({'overflow-y':'hidden','max-height':smf_quote_expand+'px'});let anchor=$('<a/>',{text:' ['+smf_txt_expand+']',class:'expand'});if(cite.length)
cite.append(anchor);$(item).on('click','a.expand',function(event){event.preventDefault();if(smf_quote_expand<parseInt($(item).height()))
{cite.find('a.expand').text(' ['+smf_txt_expand+']');$(item).css({'overflow-y':'hidden','max-height':smf_quote_expand+'px'})}
else{cite.find('a.expand').text(' ['+smf_txt_shrink+']');$(item).css({'overflow-y':'visible','max-height':(quote_height+10)+'px'});expand_quote_parent($(item))}
return!1})})}});function expand_quote_parent(oElement)
{$.each(oElement.parentsUntil('div.inner'),function(index,value){$(value).css({'overflow-y':'visible','max-height':'',}).find('a.expand').first().text(' ['+smf_txt_shrink+']')})}
function avatar_fallback(e){var e=window.e||e;var default_avatar='/avatars/default.png';var default_url=document.URL.substr(0,smf_scripturl.lastIndexOf('/'))+default_avatar;if(e.target.tagName!=='IMG'||!e.target.classList.contains('avatar')||e.target.src===default_url)
return;e.target.src=default_url;return!0}
if(document.addEventListener)
document.addEventListener("error",avatar_fallback,!0);else document.attachEvent("error",avatar_fallback);function smc_preview_post(oOptions)
{this.opts=oOptions;this.previewXMLSupported=!0;this.init()}
smc_preview_post.prototype.init=function()
{if(this.opts.sPreviewLinkContainerID)
$('#'+this.opts.sPreviewLinkContainerID).on('click',this.doPreviewPost.bind(this));else $(document.forms).find("input[name='preview']").on('click',this.doPreviewPost.bind(this))}
smc_preview_post.prototype.doPreviewPost=function(event)
{event.preventDefault();if(!this.previewXMLSupported)
return submitThisOnce(document.forms.postmodify);var new_replies=new Array();if(window.XMLHttpRequest)
{var x=new Array();var textFields=['subject',this.opts.sPostBoxContainerID,this.opts.sSessionVar,'icon','guestname','email','evtitle','question','topic'];var numericFields=['board','topic','last_msg','eventid','calendar','year','month','day','poll_max_votes','poll_expire','poll_change_vote','poll_hide'];var checkboxFields=['ns'];for(var i=0,n=textFields.length;i<n;i++)
if(textFields[i]in document.forms.postmodify)
{var e=$('#'+this.opts.sPostBoxContainerID).get(0);if(textFields[i]==this.opts.sPostBoxContainerID&&sceditor.instance(e)!=undefined&&typeof sceditor.instance(e).getText().html!=='undefined')
x[x.length]=textFields[i]+'='+sceditor.instance(e).getText().html().php_to8bit().php_urlencode();else if(textFields[i]==this.opts.sPostBoxContainerID&&sceditor.instance(e)!=undefined)
x[x.length]=textFields[i]+'='+sceditor.instance(e).getText().php_to8bit().php_urlencode();else if(typeof document.forms.postmodify[textFields[i]].value.html!=='undefined')
x[x.length]=textFields[i]+'='+document.forms.postmodify[textFields[i]].value.html().php_to8bit().php_urlencode();else x[x.length]=textFields[i]+'='+document.forms.postmodify[textFields[i]].value.php_to8bit().php_urlencode()}
for(var i=0,n=numericFields.length;i<n;i++)
if(numericFields[i]in document.forms.postmodify&&'value' in document.forms.postmodify[numericFields[i]])
x[x.length]=numericFields[i]+'='+parseInt(document.forms.postmodify.elements[numericFields[i]].value);for(var i=0,n=checkboxFields.length;i<n;i++)
if(checkboxFields[i]in document.forms.postmodify&&document.forms.postmodify.elements[checkboxFields[i]].checked)
x[x.length]=checkboxFields[i]+'='+document.forms.postmodify.elements[checkboxFields[i]].value;sendXMLDocument(smf_prepareScriptUrl(smf_scripturl)+'action=post2'+(this.opts.iCurrentBoard?';board='+this.opts.iCurrentBoard:'')+(this.opts.bMakePoll?';poll':'')+';preview;xml',x.join('&'),this.onDocSent.bind(this));document.getElementById(this.opts.sPreviewSectionContainerID).style.display='';setInnerHTML(document.getElementById(this.opts.sPreviewSubjectContainerID),this.opts.sTxtPreviewTitle);setInnerHTML(document.getElementById(this.opts.sPreviewBodyContainerID),this.opts.sTxtPreviewFetch);return!1}
else return submitThisOnce(document.forms.postmodify)}
smc_preview_post.prototype.onDocSent=function(XMLDoc)
{if(!XMLDoc)
{document.forms.postmodify.preview.onclick=new function()
{return!0}
document.forms.postmodify.preview.click()}
var preview=XMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('preview')[0];setInnerHTML(document.getElementById(this.opts.sPreviewSubjectContainerID),preview.getElementsByTagName('subject')[0].firstChild.nodeValue);var bodyText='';for(var i=0,n=preview.getElementsByTagName('body')[0].childNodes.length;i<n;i++)
if(preview.getElementsByTagName('body')[0].childNodes[i].nodeValue!=null)
bodyText+=preview.getElementsByTagName('body')[0].childNodes[i].nodeValue;setInnerHTML(document.getElementById(this.opts.sPreviewBodyContainerID),bodyText);document.getElementById(this.opts.sPreviewBodyContainerID).className='windowbg';var errors=XMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('errors')[0];var errorList=new Array();for(var i=0,numErrors=errors.getElementsByTagName('error').length;i<numErrors;i++)
errorList[errorList.length]=errors.getElementsByTagName('error')[i].firstChild.nodeValue;document.getElementById(this.opts.sErrorsContainerID).style.display=numErrors==0?'none':'';document.getElementById(this.opts.sErrorsContainerID).className=errors.getAttribute('serious')==1?'errorbox':'noticebox';document.getElementById(this.opts.sErrorsSeriousContainerID).style.display=numErrors==0?'none':'';setInnerHTML(document.getElementById(this.opts.sErrorsListContainerID),numErrors==0?'':errorList.join('<br>'));var captions=errors.getElementsByTagName('caption');for(var i=0,numCaptions=errors.getElementsByTagName('caption').length;i<numCaptions;i++)
{if(document.getElementById(this.opts.sCaptionContainerID.replace('%ID%',captions[i].getAttribute('name'))))
document.getElementById(this.opts.sCaptionContainerID.replace('%ID%',captions[i].getAttribute('name'))).className=captions[i].getAttribute('class')}
if(errors.getElementsByTagName('post_error').length==1)
document.forms.postmodify[this.opts.sPostBoxContainerID].style.border='1px solid red';else if(document.forms.postmodify[this.opts.sPostBoxContainerID].style.borderColor=='red'||document.forms.postmodify[this.opts.sPostBoxContainerID].style.borderColor=='red red red red')
{if('runtimeStyle' in document.forms.postmodify[this.opts.sPostBoxContainerID])
document.forms.postmodify[this.opts.sPostBoxContainerID].style.borderColor='';else document.forms.postmodify[this.opts.sPostBoxContainerID].style.border=null}
if('last_msg' in document.forms.postmodify)
document.forms.postmodify.last_msg.value=XMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('last_msg')[0].firstChild.nodeValue;var ignored_replies=new Array(),ignoring;var newPosts=XMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('new_posts')[0]?XMLDoc.getElementsByTagName('smf')[0].getElementsByTagName('new_posts')[0].getElementsByTagName('post'):{length:0};var numNewPosts=newPosts.length;if(numNewPosts!=0)
{var newPostsHTML='<span id="new_replies"><'+'/span>';var tempHTML;var new_replies=new Array();for(var i=0;i<numNewPosts;i++)
{new_replies[i]=newPosts[i].getAttribute("id");ignoring=!1;if(newPosts[i].getElementsByTagName("is_ignored")[0].firstChild.nodeValue!=0)
ignored_replies[ignored_replies.length]=ignoring=newPosts[i].getAttribute("id");tempHTML=this.opts.newPostsTemplate.replaceAll('%PostID%',newPosts[i].getAttribute("id")).replaceAll('%PosterName%',newPosts[i].getElementsByTagName("poster")[0].firstChild.nodeValue).replaceAll('%PostTime%',newPosts[i].getElementsByTagName("time")[0].firstChild.nodeValue).replaceAll('%PostBody%',newPosts[i].getElementsByTagName("message")[0].firstChild.nodeValue).replaceAll('%IgnoredStyle%',ignoring?'display: none':'');newPostsHTML+=tempHTML}
for(i=0;i<new_replies.length;i++)
document.getElementById(this.opts.sNewImageContainerID.replace('%ID%',new_replies[i])).style.display='none';setOuterHTML(document.getElementById('new_replies'),newPostsHTML)}
var numIgnoredReplies=ignored_replies.length;if(numIgnoredReplies!=0)
{for(var i=0;i<numIgnoredReplies;i++)
{aIgnoreToggles[ignored_replies[i]]=new smc_Toggle({bToggleEnabled:!0,bCurrentlyCollapsed:!0,aSwappableContainers:['msg_'+ignored_replies[i]+'_body','msg_'+ignored_replies[i]+'_quote',],aSwapLinks:[{sId:'msg_'+ignored_replies[i]+'_ignored_link',msgExpanded:'',msgCollapsed:this.opts.sTxtIgnoreUserPost}]})}}
location.hash='#'+this.opts.sPreviewSectionContainerID;if(typeof(smf_codeFix)!='undefined')
smf_codeFix()};$(function(){$('ul.dropmenu, ul.quickbuttons').superfish({delay:250,speed:100,sensitivity:8,interval:50,timeout:1});$('.preview').SMFtooltip();$('a.bbc_link img.bbc_img').parent().css('border','0')});function smf_codeBoxFix()
{var codeFix=$('code');$.each(codeFix,function(index,tag)
{if(is_webkit&&$(tag).height()<20)
$(tag).css({height:($(tag).height+20)+'px'});else if(is_ff&&($(tag)[0].scrollWidth>$(tag).innerWidth()||$(tag).innerWidth()==0))
$(tag).css({overflow:'scroll'});else if('currentStyle' in $(tag)&&$(tag)[0].currentStyle.overflow=='auto'&&($(tag).innerHeight()==''||$(tag).innerHeight()=='auto')&&($(tag)[0].scrollWidth>$(tag).innerWidth()||$(tag).innerWidth==0)&&($(tag).outerHeight()!=0))
$(tag).css({height:($(tag).height+24)+'px'})})}
if(is_ie||is_webkit||is_ff)
addLoadEvent(smf_codeBoxFix);function smc_toggleImageDimensions()
{$('.postarea .bbc_img.resized').each(function(index,item)
{$(item).click(function(e)
{$(item).toggleClass('original_size')})})}
addLoadEvent(smc_toggleImageDimensions);function smf_addButton(stripId,image,options)
{$('#'+stripId).append('<a href="'+options.sUrl+'" class="button last" '+('sCustom' in options?options.sCustom:'')+' '+('sId' in options?' id="'+options.sId+'_text"':'')+'>'+options.sText+'</a>')};var pingTime=10000;var notificationIcon='/favicon.ico';$(function()
{if($('meta[property="og:image"]').length!=0)
notificationIcon=$('meta[property="og:image"]').attr('content');$.get(notificationIcon).fail(function(){notificationIcon=smf_images_url+'/blank.png'})});var updateAlerts=function()
{var unreadAlerts;if(typeof localStorage!='undefined')
{unreadAlerts=localStorage.getItem('alertsCounter');if(unreadAlerts!=parseInt(unreadAlerts))
return!0;if($('#alerts_menu_top > .amt:first').length)
$('#alerts_menu_top > .amt:first').text(unreadAlerts);else if(!$('#alerts_menu_top > .amt:first').length&&unreadAlerts!=0)
$('#alerts_menu_top').append(' <span class="amt">'+unreadAlerts+'</span>');if(localStorage.getItem('alertsPoll')!=null&&(+(new Date())-localStorage.getItem('alertsPoll'))<pingTime)
{setTimeout(updateAlerts,1000);return!0}
localStorage.setItem('alertsPoll',+(new Date()))}
else unreadAlerts=$('#alerts_menu_top > .amt:first').text()?$('#alerts_menu_top > .amt:first').text():0;unreadAlerts=parseInt(unreadAlerts);$.get(smf_scripturl+'?action=profile;area=alerts_popup;counter='+unreadAlerts+';u='+smf_member_id,function(data)
{var alerts=$(data).find('.unread_notify');if(alerts.length==0)
return!0;unreadAlerts+=alerts.length;if(unreadAlerts!=parseInt(unreadAlerts))
return!0;if(typeof localStorage!='undefined')
localStorage.setItem('alertsCounter',unreadAlerts);if($('#alerts_menu_top > .amt:first').length)
$('#alerts_menu_top > .amt:first').text(unreadAlerts);else if(!$('#alerts_menu_top > .amt:first').length&&unreadAlerts!=0)
$('#alerts_menu_top').append('<span class="amt">'+unreadAlerts+'</span>');$.each(alerts,function(index,item)
{var notification=notify.createNotification(new_alert_title,{body:$(item).find('div.details:first span.alert_text').text(),icon:notificationIcon});notification.click(function()
{window.focus();if(!$('#alerts_menu').is(':visible'))
$('#alerts_menu_top').click();this.close()});if(alert_timeout>0)
setTimeout(function()
{notification.close()},alert_timeout)});var user_menus=new smc_PopupMenu();user_menus.add("alerts",smf_scripturl+"?action=profile;area=alerts_popup;u="+smf_member_id)});if(unreadAlerts===0)
$('#alerts_menu_top > .amt:first').remove();setTimeout(updateAlerts,pingTime)}
$(function()
{var permission=notify.permissionLevel();if(permission==notify.PERMISSION_DEFAULT)
{$('#alerts_menu_top').click(function()
{window.notify.requestPermission(function()
{if(notify.permissionLevel()==notify.PERMISSION_GRANTED)
updateAlerts()})})}
else if(permission==notify.PERMISSION_GRANTED)
{setTimeout(updateAlerts,pingTime);if(typeof localStorage!='undefined')
localStorage.setItem('alertsCounter',parseInt($('#alerts_menu_top > .amt:first').text()?$('#alerts_menu_top > .amt:first').text():0))}});(function(win){var PERMISSION_DEFAULT="default",PERMISSION_GRANTED="granted",PERMISSION_DENIED="denied",PERMISSION=[PERMISSION_GRANTED,PERMISSION_DEFAULT,PERMISSION_DENIED],defaultSetting={pageVisibility:!1,autoClose:0},empty={},emptyString="",isSupported=(function(){var isSupported=!1;try{isSupported=!!(win.Notification||win.webkitNotifications||navigator.mozNotification||(win.external&&win.external.msIsSiteMode()!==undefined))}catch(e){}
return isSupported}()),ieVerification=Math.floor((Math.random()*10)+1),isFunction=function(value){return(value&&(value).constructor===Function)},isString=function(value){return(value&&(value).constructor===String)},isObject=function(value){return(value&&(value).constructor===Object)},mixin=function(target,source){var name,s;for(name in source){s=source[name];if(!(name in target)||(target[name]!==s&&(!(name in empty)||empty[name]!==s))){target[name]=s}}
return target},noop=function(){},settings=defaultSetting;function getNotification(title,options){var notification;if(win.Notification){notification=new win.Notification(title,{icon:isString(options.icon)?options.icon:options.icon.x32,body:options.body||emptyString,tag:options.tag||emptyString})}else if(win.webkitNotifications){notification=win.webkitNotifications.createNotification(options.icon,title,options.body);notification.show()}else if(navigator.mozNotification){notification=navigator.mozNotification.createNotification(title,options.body,options.icon);notification.show()}else if(win.external&&win.external.msIsSiteMode()){win.external.msSiteModeClearIconOverlay();win.external.msSiteModeSetIconOverlay((isString(options.icon)?options.icon:options.icon.x16),title);win.external.msSiteModeActivate();notification={"ieVerification":ieVerification+1}}
return notification}
function getWrapper(notification){return{close:function(){if(notification){if(notification.close){notification.close()}else if(win.external&&win.external.msIsSiteMode()){if(notification.ieVerification===ieVerification){win.external.msSiteModeClearIconOverlay()}}}},click:function(callback){notification.addEventListener('click',callback)}}}
function requestPermission(callback){if(!isSupported){return}
var callbackFunction=isFunction(callback)?callback:noop;if(win.webkitNotifications&&win.webkitNotifications.checkPermission){win.webkitNotifications.requestPermission(callbackFunction)}else if(win.Notification&&win.Notification.requestPermission){win.Notification.requestPermission(callbackFunction)}}
function permissionLevel(){var permission;if(!isSupported){return}
if(win.Notification&&win.Notification.permissionLevel){permission=win.Notification.permissionLevel()}else if(win.webkitNotifications&&win.webkitNotifications.checkPermission){permission=PERMISSION[win.webkitNotifications.checkPermission()]}else if(navigator.mozNotification){permission=PERMISSION_GRANTED}else if(win.Notification&&win.Notification.permission){permission=win.Notification.permission}else if(win.external&&(win.external.msIsSiteMode()!==undefined)){permission=win.external.msIsSiteMode()?PERMISSION_GRANTED:PERMISSION_DEFAULT}
return permission}
function config(params){if(params&&isObject(params)){mixin(settings,params)}
return settings}
function isDocumentHidden(){return settings.pageVisibility?(document.hidden||document.msHidden||document.mozHidden||document.webkitHidden):!0}
function createNotification(title,options){var notification,notificationWrapper;if(isSupported&&isDocumentHidden()&&isString(title)&&(options&&(isString(options.icon)||isObject(options.icon)))&&(permissionLevel()===PERMISSION_GRANTED)){notification=getNotification(title,options)}
notificationWrapper=getWrapper(notification);if(settings.autoClose&&notification&&!notification.ieVerification&&notification.addEventListener){notification.addEventListener("show",function(){var notification=notificationWrapper;win.setTimeout(function(){notification.close()},settings.autoClose)})}
return notificationWrapper}
win.notify={PERMISSION_DEFAULT:PERMISSION_DEFAULT,PERMISSION_GRANTED:PERMISSION_GRANTED,PERMISSION_DENIED:PERMISSION_DENIED,isSupported:isSupported,config:config,createNotification:createNotification,permissionLevel:permissionLevel,requestPermission:requestPermission};if(isFunction(Object.seal)){Object.seal(win.notify)}}(window))