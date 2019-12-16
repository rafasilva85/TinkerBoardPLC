//TODO 1 Some of the services are verifying if the viewerId exist or not
//if it does not exist the service is return null and aparently there is 
//no action when it happens. We have to verify it ***Vicente***

function Services(url) {
    var self = this;

    var getTokenFromQueryString = function () {
        var href = decodeURI(window.location.href);
        var reg = new RegExp('[?&]' + "Token" + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    this._token = getTokenFromQueryString();

    this.setToken = function(token)
    {
        this._token = token;
    }


    var m = ["getGlobalSettings", "getScreens", "navigateTo", "setTrendQuery", "queryTrendData", "getSecurityLevels", "queryTagData", "writeTag", "requestEvents", "executeCommand", "setActionValue", "enqueueDataSourceRequest", "getDataSourceData", "completeUIFunction", "isScreenTaskSyncronized", "ackAlarm", "getAlarmColumns", "queryAlarmData", "loadImages", "checkIdle", "openScreen", "closeScreen", "createView", "destroyView", "getScreenGroup", "updateData", "system.listMethods", "system.version", "system.about", "createMap", "getMapAssets", "getMapAssetInfo", "showScreen", "hideScreen", "setCustomProperty", "dbSpyLoad", "dbSpyReload", "dbSpyAddTag", "dbSpyRemoveTag", "dbSpyValidateSecurity", "dbSpyWriteTag", "dbSpyDestroy", "ackAlarmEx", "getNavigationNode"];
    var idems = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

    this[m[0]] = function /* getGlobalSettings */(callback) {
        if (canCallService("getGlobalSettings") == false)
            return;
        return rpc(new Call(0, {}, callback));
    }

    this[m[1]] = function /* getScreens */(callback) {
        return rpc(new Call(1, {viewId:window.viewId}, callback));
    }

    this[m[2]] = function /* navigateTo */(areaName, page, callback) {
        if (canCallService("navigateTo") === false)
            return;
        return rpc(new Call(2, {viewId:window.viewId, areaName: areaName, page: page }, callback));
    }

    this[m[3]] = function /* setTrendQuery */(screenId, ownerId, startTicks, endTicks, numSamples, callback) {
        return rpc(new Call(3, { viewId:window.viewId, screenId: screenId, ownerId: ownerId, min: startTicks, max: endTicks, numSamples: numSamples }, callback));
    }

    this[m[4]] = function /* queryTrendData */(callback) {
        return rpc(new Call(4, {viewId:window.viewId}, callback));
    }

    this[m[5]] = function /* getSecurityLevels */(callback) {
        return rpc(new Call(5, {}, callback));
    }

    this[m[6]] = function /* queryTagData */(callback) {
        return rpc(new Call(6, { viewId: window.viewId }, callback));
    }

    this[m[7]] = function /* writeTag */(tag, value, callback) {
        return rpc(new Call(7, { viewId: window.viewId, tagName: tag, value: value }, callback));
    }

    this[m[8]] = function /* requestEvents */(viewId, screenIds, callback) {
        if (canCallService("requestEvents") === false)
            return;
        var r = rpc(new Call(8, { viewId: viewId, "screenIds": screenIds }, callback));

        return r;
    }


    this[m[9]] = function /* executeCommand */(viewId, screenId, commandId, callback, userName, password) {
        if (canCallService("executeCommand") === false)
            return;

        if (typeof(userName) === 'undefined' || typeof(password) === 'undefined') {
            // TODO: Julie This step should be removed since the setActionValue interface in ther server accept a object. Should talk with Vicente.
            return rpc(new Call(9, { commandId: commandId, viewId: viewId, screenId: screenId }, callback));
        }
        else {
            return rpc(new Call(9, { commandId: commandId, viewId: viewId, screenId: screenId, user: userName, password: password }, callback));               
        }
    }


    this[m[10]] = function /* setActionValue */(viewId, screenId, actionId, value, callback, userName, password) {
        if (canCallService("setActionValue") === false)
            return;

        if (typeof(userName) === 'undefined' || typeof(password) === 'undefined') {
            // TODO: Julie This step should be removed since the setActionValue interface in ther server accept a object. Should talk with Vicente.
            return rpc(new Call(10, { viewId: viewId, screenId: screenId, actionId: actionId, value: value.toString()}, callback));
        }
        else {
            return rpc(new Call(10, { viewId: viewId, screenId: screenId, actionId: actionId, value: value.toString(), user: userName, password: password }, callback));
        }
    }

    this[m[11]] = function /* enqueueDataSourceRequest */(viewId, screenId, fieldId, callback) {
        return rpc(new Call(11, { vieweId: viewId, screenId: screenId, fieldId: fieldId }, callback));
    }

    this[m[12]] = function /* getDataSourceData */(viewId, screenId, fieldId, callback) {
        return rpc(new Call(12, { vieweId: viewId, screenId: screenId, fieldId: fieldId }, callback));
    }

    this[m[13]] = function /* completeUIFunction */(data, screenId, callback) {
        return rpc(new Call(13, { viewId:window.viewId, screenId: screenId, data: data }, callback));
    }

    this[m[14]] = function /* isScreenTaskSyncronized */(callback) {
        return rpc(new Call(14, {}, callback));
    }

    this[m[15]] = function /* ackAlarm */(alarm_ids, comment, screenId, dataSourceId, callback, userName, password) {
        if (typeof(userName) === 'undefined' || typeof(password) === 'undefined') {
            return rpc(new Call(15, { viewId:window.viewId, alarm_ids: alarm_ids, comment: comment, screenId: screenId, dataSourceId: dataSourceId }, callback));
        }
        else {
            return rpc(new Call(15, { viewId: viewId, alarm_ids: alarm_ids, comment: comment, screenId: screenId, dataSourceId: dataSourceId, user: userName, password: password }, callback));
        }
        
    }

    this[m[16]] = function /* getAlarmColumns */(callback) {
        return rpc(new Call(16, { viewId:window.viewId}, callback));
    }

    this[m[17]] = function /* queryAlarmData */(force, callback) {
        return rpc(new Call(17, { viewId:window.viewId, force: force }, callback));
    }

    this[m[18]] = function /* loadImages */(imageName, callback) {
        return rpc(new Call(18, { imageName: imageName }, callback));
    }

    this[m[19]] = function /* checkIdle */(idle, callback) {
        return rpc(new Call(19, { idle: idle }, callback));
    }

    this[m[20]] = function /* openScreen */(viewId, screenNames, callback, options) {
        if (canCallService("openScreen") == false)
            return;
        if (options) {
            return rpc(new Call(20, { screenNames: screenNames, viewId: window.viewId, options: options }, callback));
        }
        return rpc(new Call(20, { screenNames: screenNames, viewId: window.viewId }, callback));
    }

    this[m[21]] = function /* closeScreen */(viewId, screenIds, callback) {
        if (canCallService("closeScreen") == false)
            return;

        return rpc(new Call(21, { screenIds: screenIds, viewId: window.viewId }, callback));
    }

    this[m[22]] = function /* createView */(callback) {
        return rpc(new Call(22, {}, callback));
    }

    this[m[23]] = function /* destroyView */(viewId, callback) {
        var vid = -1;

        if (!isNaN(viewId) && viewId > -1)
            vid = viewId;

        return rpc(new Call(23, { viewId: vid }, callback));
    }

    this[m[24]] = function /* getScreenGroup */(screenGroupName, callback) {
        return rpc(new Call(24, {screenGroupName: screenGroupName }, callback));
    }

    this[m[25]] = function /* updateData */(screenId, ownerId, row, column, values, dataSourceId, callback, userName, password) {
		if (typeof(userName) === 'undefined' || typeof(password) === 'undefined') {
        	return rpc(new Call(25, { viewId: window.viewId, screenId: screenId, ownerId: ownerId, row: row, column: column, values: values }, callback));
        }
        else{
        	return rpc(new Call(25, { viewId: window.viewId, screenId: screenId, ownerId: ownerId, row: row, column: column, values: values, dataSourceId: dataSourceId, user: userName, password: password  }, callback));
        }
    }
    // Returns an array of method names implemented by this service.

    this[m[26]] = function /* system.listMethods */(callback) {
        return rpc(new Call(26, {}, callback));
    }

    // Returns the version server implementation using the major, minor, build and revision format.

    this[m[27]] = function /* system.version */(callback) {
        return rpc(new Call(27, {}, callback));
    }

    // Returns a summary about the server implementation for display purposes.

    this[m[28]] = function /* system.about */(callback) {
        return rpc(new Call(28, {}, callback));
    }

    this[m[29]] = function /* createMap */(layers, sources, callback) {
        if (canCallService("createMap") == false) {
            var self = this;
            window.setTimeout(function () { self[m[29]](layers, sources, callback); }, 300);
            return;
        }
        return rpc(new Call(29, { viewId: window.viewId, layers: layers, sources: sources }, callback));
    }

    this[m[30]] = function /* getMapAssets */(mapId, zoom, area, callback) {
        if (canCallService("getMapAssets") == false) {
            var self = this;
            window.setTimeout(function () { self[m[30]](mapId, zoom, area, callback); }, 300);
            return;
        }
        return rpc(new Call(30, { viewId: window.viewId, zoom: zoom, mapId: mapId, area: area }, callback));
    }

    this[m[31]] = function /* getMapAssetInfo */(mapId, name) {
        if (canCallService("getMapAssetInfo") == false)
            return;
        var response = rpc(new Call(31, { viewId: window.viewId, mapId: mapId, name: name }));
        if (response && response.isSendException) return null;
        return response;
    }

    this[m[32]] = function /* showScreen */(viewId, screenIds, callback) {
        if (canCallService("showScreen") == false)
            return;

        return rpc(new Call(32, { viewId: window.viewId, screenIds: screenIds }, callback));
    }

    this[m[33]] = function /* hideScreen */(viewId, screenIds, callback) {
        if (canCallService("hideScreen") == false)
            return;

        return rpc(new Call(33, { viewId: window.viewId, screenIds: screenIds }, callback));
    }

    this[m[34]] = function /* setCustomProperty */(viewId, screenIds, customPropertyName, customPropertyValue, isObj, callback){
        if (canCallService("setCustomProperty") == false)
            return;
        return rpc(new Call(34, { viewId: window.viewId, screenIds: screenIds, customPropertyName: customPropertyName, customPropertyValue: customPropertyValue, isObj: isObj }, callback));
    }

    this[m[35]] = function /* dbSpyLoad */(tags, callback){
        if (canCallService("dbSpyLoad") == false)
            return;
        return rpc(new Call(35, { viewId: window.viewId, tags: tags }, callback));
    }

    this[m[36]] = function /* dbSpyReload */(callback){
        if (canCallService("dbSpyReload") == false)
            return;
        return rpc(new Call(36, { viewId: window.viewId }, callback));
    }

    this[m[37]] = function /* dbSpyAddTag */(tags, callback){
        if (canCallService("dbSpyAddTag") == false)
            return;
        return rpc(new Call(37, { viewId: window.viewId, tags: tags}, callback));
    }

    this[m[38]] = function /* dbSpyRemoveTag */(tagName, callback){
        if (canCallService("dbSpyRemoveTag") == false)
            return;
        return rpc(new Call(38, { viewId: window.viewId, tagName: tagName }, callback));
    }

    this[m[39]] = function /* dbSpyValidateSecurity */(callback){
        if (canCallService("dbSpyValidateSecurity") == false)
            return;
        return rpc(new Call(39, { viewId: window.viewId }, callback));
    }

    this[m[40]] = function /* dbSpyWriteTag */(tag, value, callback){
        if (canCallService("dbSpyWriteTag") == false)
            return;
        return rpc(new Call(40, { viewId: window.viewId, tagName: tag, value: value }, callback));
    }

    this[m[41]] = function /* dbSpyDestroy */(callback){
        if (canCallService("dbSpyDestroy") == false)
            return;
        return rpc(new Call(41, { viewId: window.viewId }, callback));
    }

    this[m[40]] = function /* dbSpyWriteTag */(tag, value, callback){
        if (canCallService("dbSpyWriteTag") == false)
            return;
        return rpc(new Call(40, { viewId: window.viewId, tagName: tag, value: value }, callback));
    }

    this[m[41]] = function /* dbSpyDestroy */(callback){
        if (canCallService("dbSpyDestroy") == false)
            return;
        return rpc(new Call(41, { viewId: window.viewId }, callback));
    }

    this[m[42]] = function /* ackAlarmEx */(alarm_ids, comment, locator, user_id, node_info, callback) {
        return rpc(new Call(15, { viewId: window.viewId, alarm_ids: alarm_ids, comment: comment, locator: locator, user_id: user_id, node_info: node_info }, callback));
    }

    this[m[43]] = function /* getNavigationNode */(screenId, nodeName) {
        if (canCallService("getNavigationNode") == false)
            return;

        var response = rpc(new Call(43, { viewId: window.viewId, screenId: screenId, nodeName: nodeName }));
        if (response && response.isSendException) return null;
        return response;
    }

    var url = typeof(window.webGraphicsApi) === 'object' ? window.webGraphicsApi.service_url : (typeof (url) === 'string' ? url : sma.configSettings.servicesUrl);
    var nextId = 0;

    function Call(method, params, callback) {
        this.url = url;
        this.callback = callback;
        this.proxy = self;
        this.idempotent = idems[method];
        this.request =
        {
            id: ++nextId,
            "function": m[method],
            "data": params,
            "CSRFToken": window.sma.temp.CSRFManager.getToken()
        };
    }

    function rpc(call) {
        return self.channel != null && typeof (self.channel.rpc) === 'function' ?
            self.channel.rpc(call) : call;
    }

    this.kwargs = false;
    this.channel = new JayrockChannel();

    function JayrockChannel() {
        this.rpc = function (call) {
            var async = typeof (call.callback) === 'function';
            var xhr = newXHR();
            var response = null;
            
            xhr.open('POST', call.url + "?ts=" + new Date(), async, this.httpUserName, this.httpPassword);
            xhr.setRequestHeader('Content-Type', this.contentType || 'application/json; charset=utf-8');
            if (self._token != null || window.sma.temp.token) {
                xhr.setRequestHeader("Authorization", self._token || window.sma.temp.token);
            }
            if (async) xhr.onreadystatechange = function () { xhr_onreadystatechange(xhr, call.callback); }
            try {
                
                xhr.send(JSON.stringify(call.request));
            }
            catch (err) {
                response = { "resultCode": -10000, "message": err.message, "isSendException": true };
                return response;
            }
            call.handler = xhr;
            if (async) return call;
            try {

                // Check if the response data is json format.
                if (xhr.responseText.length === 0 || typeof JSON.parse(xhr.responseText) != "object") {
                    throw new Error("Invalid Response Data");
                }

                response = JSON.parse(xhr.responseText);
                if(response.resultCode === 306){ 
                  setTimeout(function(){location.reload()}, 100);
                }
            }
            catch (e) {
                if (xhr.status == 200) {
                    response = { "resultCode": -10000, "message": "Error parsing response: " + e.message };
                } else {
                    response = { "resultCode": -10000, "message": "Communication Error:" + xhr.status + "," + e.message };
                }
            }
            return response;
        }

        function xhr_onreadystatechange(sender, callback) {
            if (sender.readyState == /* complete */ 4) {
                var response;
                try {
                    sender.onreadystatechange = null; // Avoid IE7 leak (bug #12964)     

                    // Check if the response data is json format.
                    if (sender.responseText.length === 0 || typeof JSON.parse(sender.responseText) != "object") {
                        throw new Error("Invalid Response Data");
                    }

                    response = JSON.parse(sender.responseText);
                }
                catch (e) {
                    if (sender.status == 200) {
                        response = { "resultCode": -10000, "message": "Error parsing response: " + e.message };
                    } else {
                        response = { "resultCode": -10000, "message": "Communication Error:" + sender.status + "," + e.message };
                    }
                }
                callback(response, sender);
            }
        }

        function newXHR() {
            if (typeof (window) !== 'undefined' && window.XMLHttpRequest) 
                return new XMLHttpRequest(); /* IE7, Safari 1.2, Mozilla 1.0/Firefox, and Netscape 7 */
            else
                return new ActiveXObject('Microsoft.XMLHTTP'); /* WSH and IE 5 to IE 6 */
        }
    }

    function canCallService(serviceName) {

        if (window.viewId === undefined || window.viewId === null) {

            var isLogged = true;
            if (!(self._token != null || window.sma.temp.token)) { // if it is not cloud
                var result = (new LogonServices()).isLogged();
                isLogged = result && result.resultCode == 0 && result.data.isLogged === true;
            }

            if (isLogged) {
                result = services.createView();
                if (result.resultCode == 0 && result.data && (result.data.viewId !== undefined && result.data.viewId !== null)) {
                    window.viewId = result.data.viewId;
                    window.name = "vwr" + result.data.viewId;
                    return true;
                }
            }

            console.debug("viewId error " + serviceName);
            return false;
        }

        return true;
    }

    this.onAfterGetCSRFToken = function (onGetToken, onGetTokenTimeout, timeout) {
        if (onGetToken == null)
            return;

        if (window.sma != null && window.sma.temp != null && window.sma.temp.CSRFManager != null) {
            var csrfToken = window.sma.temp.CSRFManager.getToken();
            if (csrfToken != null && csrfToken != "") {
                onGetToken(csrfToken);
                return;
            }
            else {
                var timeoutInterval;
                var timedOut = false;
                if (onGetTokenTimeout) {
                    timeoutInterval = window.setTimeout(function () {
                        timedOut = true;
                        csrfToken = window.sma.temp.CSRFManager.getToken();
                        if (csrfToken != null && csrfToken != "")
                            onGetToken(csrfToken);
                        else
                            onGetTokenTimeout();
                    }, timeout || 3000);
                }
                var actCallback = function (token) {
                    if (timeoutInterval != null) {
                        window.clearTimeout(timeoutInterval);
                        timeoutInterval = null;
                    }
                    if (!timedOut)
                        onGetToken(token);
                }
                window.sma.temp.CSRFManager.regOnAfterGetToken(actCallback);
            }
        }
        else
            window.setTimeout(function () { self.onAfterGetCSRFToken(onGetToken, onGetTokenTimeout, timeout); }, 100);
    }
}

Services.rpcMethods = ["getGlobalSettings", "getScreens", "navigateTo", "setTrendQuery", "queryTrendData", "getSecurityLevels", "queryTagData", "writeTag", "requestEvents", "executeCommand", "setActionValue", "enqueueDataSourceRequest", "getDataSourceData", "completeUIFunction", "isScreenTaskSyncronized", "ackAlarm", "getAlarmColumns", "queryAlarmData", "loadImages", "checkIdle", "openScreen", "closeScreen", "createView", "destroyView", "getScreenGroup", "updateData", "system.listMethods", "system.version", "system.about", "dbSpyLoad", , "dbSpyReload", "dbSpyAddTag", "dbSpyRemoveTag", "dbSpyValidateSecurity", "dbSpyWriteTag", "dbSpyDestroy", "ackAlarmEx"];

function LogonServices(url) {
    var self = this;
    var m = ["logout", "logon", "isLogged", "system.listMethods", "system.version", "system.about"];
    var idems = [false, false, false, true, true, true];

    var getTokenFromQueryString = function () {
        var href = decodeURI(window.location.href);
        var reg = new RegExp('[?&]' + "Token" + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    this._token = getTokenFromQueryString();

    this.setToken = function(token)
    {
        this._token = token;
    }


    this[m[0]] = function /* logout */(callback) {
        return rpc(new Call(0, {}, callback));
    }

    this[m[1]] = function /* logon */(user, password, callback) {
        if (user !== undefined && typeof password !== "function") {
            return rpc(new Call(1, { user: user, password: password }, callback));
        } else if(typeof password === "function" && callback === undefined) {
            callback = password;
            window.sma.temp.token = user;
            return rpc(new Call(1, { token: user}, callback)); 
        }
    }

    this[m[2]] = function /* isLogged */(callback) {
        var response =  rpc(new Call(2, {}, callback));
 
        // session has been closed and user trying to login. The server might send "session has been closed error". so relogin
        if ((self._token != null || window.sma.temp.token) && response && response.resultCode==203)
        {
            return rpc(new Call(2, {}, callback));
        }
        else return response;
    }

    // Returns an array of method names implemented by this service.

    this[m[3]] = function /* system.listMethods */(callback) {
        return rpc(new Call(3, {}, callback));
    }

    // Returns the version server implementation using the major, minor, build and revision format.

    this[m[4]] = function /* system.version */(callback) {
        return rpc(new Call(4, {}, callback));
    }

    // Returns a summary about the server implementation for display purposes.

    this[m[5]] = function /* system.about */(callback) {
        return rpc(new Call(5, {}, callback));
    }

    var url = typeof (window.webGraphicsApi) === 'object' ? window.webGraphicsApi.service_url : (typeof (url) === 'string' ? url : sma.configSettings.servicesUrl);
    var nextId = 0;

    function Call(method, params, callback) {
        this.url = url;
        this.callback = callback;
        this.proxy = self;
        this.idempotent = idems[method];
        this.request =
        {
            id: ++nextId,
            "function": m[method],
            "data": params
        };
        if(this.request.function === 'logout'){
          this.request['CSRFToken'] = window.sma.temp.CSRFManager.getToken(); 
        }
    }

    function rpc(call) {
        return self.channel != null && typeof (self.channel.rpc) === 'function' ?
            self.channel.rpc(call) : call;
    }

    this.kwargs = false;
    this.channel = new JayrockChannel();

    function JayrockChannel() {
        this.rpc = function (call) {
            var async = typeof (call.callback) === 'function';
            var xhr = newXHR();
            var response = null;

            xhr.open('POST', call.url + "?ts=" + new Date(), async, this.httpUserName, this.httpPassword);
            xhr.setRequestHeader('Content-Type', this.contentType || 'application/json; charset=utf-8');
            if (self._token != null || window.sma.temp.token) {
                xhr.setRequestHeader("Authorization", self._token || window.sma.temp.token);
            }
            if (async) xhr.onreadystatechange = function () { xhr_onreadystatechange(xhr, call.callback); }
            xhr.send(JSON.stringify(call.request));
            call.handler = xhr;
            if (async) return call;

            try {

                // Check if the response data is json format.
                if (xhr.responseText.length === 0 || typeof JSON.parse(xhr.responseText) != "object") {
                    throw new Error("Invalid Response Data");
                }

                response = JSON.parse(xhr.responseText);
                xhr_setResponseToken(response);
            }
            catch (e) {
                if (xhr.status == 200) {
                    response = { "resultCode": -10000, "message": "Error parsing response: " + e.message };
                } else {
                    response = { "resultCode": -10000, "message": "Communication Error:" + xhr.status + "," + e.message };
                }
            }
            return response;
        }

        function xhr_onreadystatechange(sender, callback) {
            if (sender.readyState == /* complete */ 4) {
                var response;
               try {
                    sender.onreadystatechange = null; // Avoid IE7 leak (bug #12964)

                    // Check if the response data is json format.
                    if (sender.responseText.length === 0 || typeof JSON.parse(sender.responseText) != "object") {
                        throw new Error("Invalid Response Data");
                    }

                    response = JSON.parse(sender.responseText);
                    xhr_setResponseToken(response);
                }
                catch (e) {
                    if (sender.status == 200) {
                        response = { "resultCode": -10000, "message": "Error parsing response: " + e.message };
                    } else {
                        response = { "resultCode": -10000, "message": "Communication Error:" + sender.status + "," + e.message };
                    }
                }
                callback(response, sender);
            }
        }

        function xhr_setResponseToken(response) {
            if (response && response.data && response.data.CSRFToken !== null && response.data.CSRFToken !== undefined) {
                window.sma.temp.CSRFManager.setToken({
                    token: response.data.CSRFToken,
                    tabID: window.sma.temp.CSRFManager.getTabID(),
                    ts: Date.now()
                });
            }
        }

        function newXHR() {
            if (typeof (window) !== 'undefined' && window.XMLHttpRequest)
                return new XMLHttpRequest(); /* IE7, Safari 1.2, Mozilla 1.0/Firefox, and Netscape 7 */
            else
                return new ActiveXObject('Microsoft.XMLHTTP'); /* WSH and IE 5 to IE 6 */
        }
    }
}

LogonServices.rpcMethods = ["logout", "logon", "isLogged", "system.listMethods", "system.version", "system.about"];

function CSRFManager(){ 
  var _token = null;
  var _tabID = _uuidv4();
  var _ts = -1;

  this._onGetToken = [];

  window.addEventListener('storage', _onStorageChange.bind(this));

  this.regOnAfterGetToken = function (callback) {
    if (callback == null) return;
    this._onGetToken.push(callback);
  };

  this.setToken = function (item) {
    if(item === null || item.token === null){ 
      return;
    }

    var newerToken = item.ts == null || item.ts > _ts;
    if(item.tabID === _tabID && newerToken){
      window.localStorage.setItem('CSRFSetToken', JSON.stringify(item));
      window.localStorage.removeItem('CSRFSetToken');
      window.localStorage.removeItem('CSRFGetToken');
    }

    if (newerToken) {
      _token = item.token;
      _ts = item.ts != null ? item.ts : -1;

      // When new tab call _getTokenFromOtherTab(), then the previews tab will receive onStorageChange with CSRFGetToken, than trigger flag CSRFSetToken with their token.
      // then the new tab receive onStorageChange with CSRFSetToken, then set local variable with the token.
      // It should have below problems:
      // Very first tab CANNOT response onStorageChange on time (delayed), so recent tab will receive onStorageChange with delay.
      // If the 3rd tab initialized, his onStorageChange will also be triggerred, and should trigger CSRFSetToken with empty token.
      var self = this;
      if (self._onGetToken && self._onGetToken.length > 0) {
        window.setTimeout(function () {
          for (var i = 0; i < self._onGetToken.length; i++)
            try {
              self._onGetToken[i](_token);
            } catch (e) {
              console.log(e);
            }

          self._onGetToken = [];
        }, 0);
      }
    }
  }

  this.getToken = function(){
    return _token !== null? _token : '';
  }

  this.getTabID = function(){
    return _tabID;
  }

  function _onStorageChange(e) { 

    if(e.newValue === null || e.newValue === ""){
      return;
    } 

    if (e.key === 'CSRFSetToken') {
      var item = JSON.parse(e.newValue);
      if(item.tabID !== _tabID){
        this.setToken(item); 
      }
    }

    if (e.key === 'CSRFGetToken' && window.localStorage.getItem('CSRFGetToken') !== null && window.localStorage.getItem('CSRFGetToken') !== undefined && _token != null && _tabID != null) {
      this.setToken({
        token: _token,
        tabID: _tabID,
        ts: Date.now() 
      });
    }

  } 

  function _uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } 

  function _getTokenFromOtherTab() {
    if (_token !== null) {
      return;
    }
    window.localStorage.setItem('CSRFGetToken', Date.now()); 
    setTimeout(_getTokenFromOtherTab, 0);
  }
  _getTokenFromOtherTab();
}; 
if (window.sma && window.sma.temp && !window.sma.temp.CSRFManager) {
  window.sma.temp.CSRFManager = new CSRFManager();
} 