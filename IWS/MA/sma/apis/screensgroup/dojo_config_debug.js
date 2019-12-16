//this function ensures that only supported locales will be used
//it checks if the language of the browser is supported. If it is not, the application uses "en-us"
function __getSupportedLocale() {
    var localeList = ",ar,ca,cs,da,de,el,en-gb,en-us,es-es,fi-fi,fr-fr,he-il,hu,it-it,ja-jp,ko-kr,nl-nl,nb,pl,pt-br,pt-pt,ru,sk,sl,sv,th,tr,zh-tw,zh-cn,";
    var loc = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
    var sup = null;
    if (localeList.search("," + loc + ",") > -1)
        sup = loc;
    if (sup == null && loc.length > 2) {
        loc = loc.substring(0, 2);
        if (localeList.search("," + loc + ",") > -1)
            sup = loc;
    }
    if (sup == null)
        sup = 'en-us';
    return sup;
};

var _xkUnitTest = null;
var services = null;
var userActivityMonitor = null;

var dojoConfig = {
    baseUrl: "./",
    locale: __getSupportedLocale(),
    tlmSiblingOfDojo: false,
    parseOnLoad: false,
    async: true,
    packages: [
        { name: "dojo", location: "../MA/js/src/dojo" },
        { name: "dijit", location: "../MA/js/src/dijit" },
        { name: "dojox", location: "../MA/js/src/dojox" },
        { name: "viewer", location: "../MA/js/src/viewer" },
        { name: "ma", location: "../MA/js/src/ma" }
        ]
};   
