/*1300733816,169776317*/

if (window.CavalryLogger) { CavalryLogger.start_js(["dOwRG"]); }

_PERSISTENT_BACKENDS={localstorage:LocalStorage};function LocalStorage(){this._store=window.localStorage;}LocalStorage.available=function(){return window.localStorage?true:false;};copy_properties(LocalStorage.prototype,{keys:function(){var b=[];for(var a=0;a<this._store.length;a++)b.push(this._store.key(a));return b;},get:function(a){return this._store.getItem(a);},set:function(a,b){this._store.setItem(a,b);},remove:function(a){this._store.removeItem(a);},clear:function(){this._store.clear();}});function CacheStorage(d,b){this._key_prefix=b||'_cs_';this._magic_prefix='_@_';if(d=='AUTO')for(var c in _PERSISTENT_BACKENDS){var a=_PERSISTENT_BACKENDS[c];if(a.available()){d=c;break;}}if(d)if(!_PERSISTENT_BACKENDS[d]){this._backend=null;}else this._backend=new _PERSISTENT_BACKENDS[d]();this._memcache={};}copy_properties(CacheStorage.prototype,{keys:function(){var d=[];if(this._backend){var a=this._backend.keys();for(var b=0;b<a.length;b++)if(a[b].substr(0,this._key_prefix.length)==this._key_prefix)d.push(a[b].substr(this._key_prefix.length));return d;}for(var c in this._memcache)d.push(c);return d;},set:function(b,a){this._memcache[b]=a;if(this._backend){if(typeof a=='string'){a=this._magic_prefix+a;}else a=JSON.stringify(a);this._backend.set(this._key_prefix+b,a);}},get:function(b,c){if(this._memcache[b]!==undefined)return this._memcache[b];var d=undefined;if(this._backend){var d=this._backend.get(this._key_prefix+b);if(d!==null){if(d.substr(0,this._magic_prefix.length)==this._magic_prefix){d=d.substr(this._magic_prefix.length);}else d=JSON.parse(d);this._memcache[b]=d;}else d=undefined;}if(d===undefined&&c!==undefined){d=c;this._memcache[b]=d;if(this._backend){if(typeof d=='string'){var a=this._magic_prefix+d;}else var a=JSON.stringify(d);this._backend.set(this._key_prefix+b,a);}}return d;},remove:function(a){delete this._memcache[a];if(this._backend)this._backend.remove(this._key_prefix+a);}});
function PageCache(a,b){if(this===window)return new PageCache(a,b);this._MAX_PAGE_NUM=typeof a=='undefined'?5:a;this._MAX_TTL=typeof b=='undefined'?600000:b;this._storage=new CacheStorage();}copy_properties(PageCache.prototype,{_normalizeURI:function(a){a=new URI(a);if(a.getPath()=='/')a.setPath('/home.php');return a.getUnqualifiedURI().setFragment('').removeQueryData('ref').toString();},addPage:function(c,b){c=this._normalizeURI(c);var a=this._storage.get(c,{});a.normalized_uri=new URI(c);copy_properties(a,b);a.accessTime=a.genTime=(new Date()).getTime();this._clearCache();},updatePage:function(c,a){c=this._normalizeURI(c);var b=this._storage.get(c);if(typeof b==='undefined')return;copy_properties(b,a);this._storage.set(c,b);},isPageInCache:function(b){var a=this._storage.get(this._normalizeURI(b));return (typeof a!=='undefined');},invalidatePage:function(a){a=this._normalizeURI(a);this._storage.remove(a);},getPage:function(b){this._clearCache();b=this._normalizeURI(b);var a=this._storage.get(b);if(typeof a==='undefined')return null;a.accessTime=(new Date()).getTime();return a;},getPageUris:function(){return this._storage.keys();},_clearCache:function(){var b=(new Date()).getTime();var d=null;var f=0;var a=this._storage.keys();for(var c=0;c<a.length;c++){var h=a[c];var e=this._storage.get(h);var g=e.ttl||this._MAX_TTL;if(e.genTime<b-g){this._storage.remove(h);continue;}if(!d||this._storage.get(d).accessTime>e.accessTime)d=h;f++;}if(f>this._MAX_PAGE_NUM&&d)this._storage.remove(d);}});
var Quickling=window.Quickling||{isActive:function(){return Quickling._is_active||false;},isFeatureEnabled:function(a){return Quickling._capabilities&&Quickling._capabilities[a];},init:function(c,b,a){if(Quickling._is_initialized)return;copy_properties(Quickling,{_is_initialized:true,_is_active:true,_session_length:b,_capabilities:a,_is_in_transition:false,_title_interval:false,_ie_cache_title:'',_cache_hit:false,_version:c});Quickling._instrumentTimeoutFunc('setInterval');Quickling._instrumentTimeoutFunc('setTimeout');PageTransitions.registerHandler(Quickling._transitionHandler,1);if(Quickling.isFeatureEnabled('page_cache')){Quickling._cache=new PageCache();Arbiter.subscribe("pre_page_transition",Quickling._onPrePageTransition);Arbiter.subscribe(Arbiter.NEW_NOTIFICATIONS,Quickling._onNotifications);Arbiter.subscribe(AsyncRequest.REPLAYABLE_AJAX,Quickling._onReplayableAjax);Arbiter.subscribe(Arbiter.PAGECACHE_INVALIDATE,Quickling._onCacheInvalidates);}},_onPrePageTransition:function(b,a){if(Quickling.isFeatureEnabled('page_cache')&&(page=Quickling._cache.getPage(a.from))&&!page.incremental_updates){invoke_callbacks(page.onpagecache);page.refresh_pagelets.forEach(function(c){var d=Quickling._getPageletById(c);d&&d.refresh(true);});page.incremental_updates=AsyncRequest.stashBundledRequest();}},_onNotifications:function(b,a){Quickling._cache=new PageCache();},_onCacheInvalidates:function(c,b){if(Quickling.isFeatureEnabled('page_cache')&&b&&b.length)for(var a=0;a<b.length;a++){if(parseInt(b[a],10)!==0)continue;if(Quickling._cache.isPageInCache(PageTransitions.getMostRecentURI()))break;Quickling._cache=new PageCache();return;}},registerPageCacheHook:function(a,c){if(!Quickling._is_initialized||!Quickling._is_active||Quickling._is_in_transition||!Quickling.isFeatureEnabled('page_cache'))return;var b=PageTransitions.getMostRecentURI();var e=Quickling._cache.getPage(b);if(e){if(c)for(var d=0;d<e.replays.length;d++)if(e.replays[d][0]==c){e.replays.splice(d,1);d--;}e.replays.push([c,a]);}},_onReplayableAjax:function(c,b){if((PageTransitions.getNextURI().toString()!=PageTransitions.getMostRecentURI().toString()))return;if(Quickling._is_in_transition)return;var a=Quickling._whitelist_regex;if(!a)a=Quickling._whitelist_regex=new RegExp(env_get('pagecache_whitelist_regex'));if(a.test(URI(b.getURI()).getPath()))return;Quickling.registerPageCacheHook(bind(b,b.replayResponses),b._replayKey);},_startQuicklingTransition:function(){Quickling._is_in_transition=true;window.channelManager&&window.channelManager.setActionRequest(true);},_stopQuicklingTransition:function(){(function(){Quickling._is_in_transition=false;}).defer();},isCacheHit:function(){return Quickling._cache_hit;},goHashOrGoHere:function(d){var c=URI.getRequestURI();var b=c.getFragment();if(b.startsWith('/')){var a=b;}else var a=d;setTimeout(function(){PageTransitions.go(a,true);},0);},isPageActive:function(e){if(e=='#')return false;e=new URI(e);if(e.getDomain()&&e.getDomain()!=URI().getDomain())return false;var b=Quickling.isPageActive.regex;if(!b)b=Quickling.isPageActive.regex=new RegExp(env_get('quickling_inactive_page_regex'));if(e.getPath()=='/l.php'){var c=e.getQueryData().u;if(c){c=URI(unescape(c)).getDomain();if(c&&c!=URI().getDomain())return false;}}var d=e.getPath();var a=e.getQueryData();if(a)d+='?'+URI.implodeQuery(a);if(b.test(d))return false;return true;},_getPageletById:function(a){return window.__UIControllerRegistry&&window.__UIControllerRegistry[a];},_setHTML:function(a,b){if(ua.ie()<=6){a.innerHTML=b;}else DOM.setContent(a,HTML(b).setDeferred(true));},_transitionHandler:function(h){AjaxPipeRequest.setCurrentRequest(null);if(Quickling._isTimeToRefresh())return false;if(!Quickling.isPageActive(h))return false;window.ExitTime=(new Date()).getTime();removeHook('onafterloadhooks');removeHook('onloadhooks');_runHooks('onleavehooks');Arbiter.inform('onload/exit',true);Quickling._startQuicklingTransition();$('content').style.visibility="visible";var e;if(Quickling.isFeatureEnabled('page_cache')&&(e=Quickling._cache.getPage(h))){var d=null;var f=window.ExitTime;var g=null;var a=new Arbiter();a.registerCallback(function(){if(AjaxPipeRequest.getCurrentRequest()!==d)return;if(d)if(d.cavalry){var i=null;if(g)i=g-f;d.cavalry.setTimeStamp('t_domcontent',null,null,i);d.cavalry.setTimeStamp('t_hooks',null,null,i);d.cavalry.setTimeStamp('t_layout',null,null,i);d.cavalry.setTimeStamp('t_onload',null,null,i);}Quickling._cache_hit=true;invoke_callbacks(e.onafterload);invoke_callbacks(e.onafterpagecache);Quickling._cache_hit=false;Quickling._stopQuicklingTransition();},['pagecache_update','tti_pagecache']);d=AsyncRequest.setBundledRequestProperties({stashedRequests:e.incremental_updates,callback:function(){if(d&&d.cavalry)d.cavalry&&d.cavalry.setTimeStamp('t_html');a.inform('pagecache_update',true,Arbiter.BEHAVIOR_EVENT);},onInitialResponse:function(j){var i=j.getPayload();if(i.redirect&&i.force){return false;}else return true;},extra_data:{uri:e.normalized_uri.getQualifiedURI().toString(),version:Quickling._version},start_immediately:true});var c=$('content');c.style.visibility="hidden";AjaxPipeRequest.setCurrentRequest(d);AjaxPipeRequest.clearCanvas('content');Bootloader.loadResources(e.css.concat(e.js),null,true);Quickling._changePageTitle(e.title);Quickling._replaceSyndicationLinks(e.syndication_links||[]);var b=e.body_class||'';CSS.setClass(document.body,b);e.html=e.html.replace(/<span class=["']?muffin_tracking_pixel_start['"]?><\/span>.*?<span class=["']?muffin_tracking_pixel_end['"]?><\/span>/ig,'');Quickling._setHTML(c,e.html);if(c&&c.style.height=='1234px')c.style.height='';PageTransitions.transitionComplete(true);Quickling._cache_hit=true;invoke_callbacks(e.jscc);invoke_callbacks(e.onload);Quickling._cache_hit=false;e.replays.forEach(function(i){i[1]();});e.refresh_pagelets.forEach(function(i){var j=document.getElementById(i);if(j)j.innerHTML='';});setTimeout(function(){PageTransitions.restoreScrollPosition();$('content').style.visibility="visible";g=(+new Date());a.inform('tti_pagecache',true,Arbiter.BEHAVIOR_EVENT);},20);}else new QuickPipeRequest(h).setCanvasId('content').send();return true;},_changePageTitle:function(a){a=a||'Facebook';DocumentTitle.set(a);if(ua.ie()){Quickling._ie_cache_title=a;if(!Quickling._title_interval)Quickling._title_interval=window.setInterval(function(){var b=Quickling._ie_cache_title;var c=DocumentTitle.get();if(b!=c)DocumentTitle.set(b);},5000,false);}},_replaceSyndicationLinks:function(d){var c=document.getElementsByTagName('link');for(var b=0;b<c.length;++b){if(c[b].rel!='alternate')continue;DOM.remove(c[b]);}if(d.length){var a=DOM.find(document,'head');a&&DOM.appendContent(a,HTML(d[0]));}},cacheResponse:function(c,a){var b=c.payload;Quickling._cache.addPage(PageTransitions.getNextURI(),{title:b.title,syndication:b.syndication||[],body_class:b.body_class,html:b.content.content,js:b.js||[],css:b.css||[],jscc:b.jscc?[b.jscc]:[],onload:b.onload||[],onafterload:b.onafterload||[],refresh_pagelets:b.refresh_pagelets||[],onpagecache:b.onpagecache||[],onafterpagecache:b.onafterpagecache||[],ttl:b.page_cache_ttl,replays:[]});if(a){invoke_callbacks(b.onload);onafterloadRegister(function(){invoke_callbacks(b.onafterload);});}},cacheAndExecResponse:function(c,d){var a=PageTransitions.getNextURI();var b=Quickling._cache.getPage(a);if(b){if(c.html)b.html=c.html;c.jscc&&b.jscc.push(c.jscc);b.js=b.js.concat(c.js||[]);b.css=b.css.concat(c.css||[]);b.onload=b.onload.concat(c.onload||[]);b.onafterload=b.onafterload.concat(c.onafterload||[]);b.onpagecache=b.onpagecache.concat(c.onpagecache||[]);b.onafterpagecache=b.onafterpagecache.concat(c.onafterpagecache||[]);b.refresh_pagelets=b.refresh_pagelets.concat(c.refresh_pagelets||[]);}if(!d){invoke_callbacks(c.onload);onafterloadRegister(function(){invoke_callbacks(c.onafterload);});}},_isTimeToRefresh:function(){Quickling._load_count=(Quickling._load_count||0)+1;return Quickling._load_count>=Quickling._session_length;},_instrumentTimeoutFunc:function(a){window[a+'_native']=(function(c){var b=function b(e,d){return c(e,d);};return b;})(window[a]);window[a]=function _setTimeout(d,c,b){var e=window[a+'_native'](d,c);if(c>0)if(b!==false)onleaveRegister(function(){clearInterval(e);});return e;};}};function QuickPipeRequest(b){var a={version:Quickling._version};this.parent.construct(this,b,{quickling:a});}QuickPipeRequest.extend('AjaxPipeRequest');copy_properties(QuickPipeRequest.prototype,{_preBootloadFirstResponse:function(b){var a=b.getPayload();if(Quickling.isFeatureEnabled('page_cache')&&a.page_cache_ttl)this._onUIpageOnload=bind(null,Quickling.cacheResponse,b);DOMScroll.scrollTo(new Vector2(0,0,'document'),false);return true;},_fireDomContentCallback:function(){this._request.cavalry&&this._request.cavalry.setTimeStamp('t_domcontent');Quickling._stopQuicklingTransition();PageTransitions.transitionComplete();this.parent._fireDomContentCallback();},_fireOnloadCallback:function(){if(this._request.cavalry){this._request.cavalry.setTimeStamp('t_hooks');this._request.cavalry.setTimeStamp('t_layout');this._request.cavalry.setTimeStamp('t_onload');}this.parent._fireOnloadCallback();},_redirect:function(a){if(a.redirect){if(a.force||!Quickling.isPageActive(a.redirect)){go_or_replace(window.location,URI(a.redirect).removeQueryData(['quickling','ajaxpipe']),true);}else PageTransitions.go(a.redirect,true);return true;}else return false;},_versionCheck:function(a){if(a.version!=Quickling._version){go_or_replace(window.location,URI(a.uri).removeQueryData(['quickling','ajaxpipe']),true);return false;}else return true;},_processFirstResponse:function(c){var b=c.getPayload();Quickling._changePageTitle(b.title);Quickling._replaceSyndicationLinks(b.syndication||[]);var a=b.body_class||'';CSS.setClass(document.body,a);if(b.hasOnbeforeshow)$('content').style.visibility='hidden';}});function onpagecacheRegister(a,b){b=(b===undefined?'':String(b));Quickling.registerPageCacheHook(a,b);}

if (window.Bootloader) { Bootloader.done(["dOwRG"]); }