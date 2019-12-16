function __getSupportedLocale(){
var _1=",ar,ca,cs,da,de,el,en-gb,en-us,es-es,fi-fi,fr-fr,he-il,hu,it-it,ja-jp,ko-kr,nl-nl,nb,pl,pt-br,pt-pt,ru,sk,sl,sv,th,tr,zh-tw,zh-cn,";
var _2=(window.navigator.userLanguage||window.navigator.language).toLowerCase();
var _3=null;
if(_1.search(","+_2+",")>-1){
_3=_2;
}
if(_3==null&&_2.length>2){
_2=_2.substring(0,2);
if(_1.search(","+_2+",")>-1){
_3=_2;
}
}
if(_3==null){
_3="en-us";
}
return _3;
};
var _xkUnitTest=null;
var services=null;
var userActivityMonitor=null;
var dojoConfig={baseUrl:typeof (window.webGraphicsApi)==="object"?window.webGraphicsApi._link_url:"./",locale:__getSupportedLocale(),tlmSiblingOfDojo:false,parseOnLoad:false,async:true,packages:[{name:"dojo",location:"sma/dojo"},{name:"dijit",location:"sma/dijit"},{name:"dojox",location:"sma/dojox"},{name:"viewer",location:"sma/viewer"},{name:"ma",location:"sma/ma"}]};

