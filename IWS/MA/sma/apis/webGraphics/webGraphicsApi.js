var WebGraphicsApi = (function () {
    function WebGraphicsApi() {
        this._load_scripts_interval = null;
        // this._s = document.currentScript; // this will not work for Intouch.
        this._wg_logon = null;
        this._wg_viewer = null;
        this._s_path = "http://localhost:55601/MA/sma/apis/webGraphics/";
        this._link_url = this._s_path + "../../../";
        this.service_url = this._link_url + "/service";
        this._init_success = null;
        this._init_failure = null;
        this._pooling_rate = 250;
        this._isPullingSuspended = false;
        this._latestScreenName = null;
        this._alarm_pulling_rate = null;
        this._screenBelongViewer = true;
        this._dynamicPoolingRates = null;
        this._poolingRateTimeout = null;
        this._isInit = false;
        this._procQueue = [];
    };

    WebGraphicsApi.prototype.init = function (opts) {

        var url = this._link_url;
        var user = 'Guest';
        var password = ''
        var isDebug = false;
        if (opts) {
            if (opts.isDebug) {
                isDebug = opts.isDebug;
            }
            if (opts.linkUrl) {
                url = opts.linkUrl;
                this._link_url = opts.linkUrl;
                if (isDebug) {
                    this._s_path = this._link_url + "/js/apis/WebGraphics/";
                }
                else {
                    this._s_path = this._link_url + "/sma/apis/WebGraphics/";
                }
            }
            if (opts.serviceUrl) {
                this.service_url = opts.serviceUrl;
            }
            if (opts.user) {
                user = opts.user;
            }
            if (opts.password) {
                password = opts.password;
            }
            if (opts.success) {
                this._init_success = opts.success;
            }
            if (opts.failure) {
                this._init_failure = opts.failure;
            }
            if (opts.poolingRate) {
                this._pooling_rate = opts.poolingRate;
            }
            if (opts.alarmPullingRate) {
                this._alarm_pulling_rate = opts.alarmPullingRate;
            }
            if (opts.enableCache != null) {
                this._enableCache = opts.enableCache;
            }
            if (typeof opts.screenBelongViewer !== 'undefined') {
                this._screenBelongViewer = opts.screenBelongViewer;
                if (this._enableCache == null && !opts.screenBelongViewer) {
                    // by default if screen not belongs to viewer, will not enable cache, but will not override enable cache behavior.
                    this._enableCache = false;
                }
            }
            if (opts.dynamicPoolingRates) {
                this._dynamicPoolingRates = opts.dynamicPoolingRates;
            }
            if (opts.checkRequestCallback) {
                this._checkRequestCallback = opts.checkRequestCallback;
            }
        }

        if (isDebug == true) {
            this._load_styles_debug(url);
            this._load_scripts_debug(url, user, password, opts.token || null, opts.language);
        }
        else {
            this._load_styles(url);
            this._load_scripts(url, user, password, opts.token || null, opts.language);
        }

        return this._wg_viewer;
    };

    WebGraphicsApi.prototype._prepare_dom = function () {
        var el = document.createElement('canvas');
        el.setAttribute('id', '_textMetrics');
        el.setAttribute('class', 'viewer-style-common-textTest');
        // set element NOT displayed to make sure mobile device will NOT keep triggering window size change event.
        el.setAttribute('style', 'display:none;');
        document.body.appendChild(el);
    };

    WebGraphicsApi.prototype._load_styles = function (url) {
        var l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/imgs/fonts/css/font-awesome.min.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/sma/rc/style/sma.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/sma/rc/style/viewer.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', this._s_path + '/webGraphicsApi.css');
        document.head.appendChild(l);
    };

    WebGraphicsApi.prototype._load_styles_debug = function (url) {
        var l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/imgs/fonts/css/font-awesome.min.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/js/src/ma/style/styles.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', url + '/js/src/viewer/style/styles.css');
        document.head.appendChild(l);

        l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', this._s_path + '/webGraphicsApi.css');
        document.head.appendChild(l);
    };

    WebGraphicsApi.prototype._load_scripts = function (url, user, password, token, language) {
        var _this = this;

        var s = null;

        if (document.body) {
            clearInterval(this._load_scripts_interval);
            this._load_scripts_interval = null;
        }
        else {
            if (this._load_scripts_interval === null) {
                this._load_scripts_interval = setInterval(function () {
                    _this._load_scripts(url, user, password);
                }, 10);
            }
            return;
        }

        // revoke past changes to make sure scripts are loaded one by one
        s = document.createElement('script');
        s.src = url + '/sma/config.js';
        document.body.appendChild(s);
        s.onload = function () {
            if (language) {
                dojoConfig.locale = language;
            }
            var s1 = document.createElement('script');
            s1.src = url + '/sma/def.js';
            document.body.appendChild(s1);
            s1.onload = function () {
                var s2 = document.createElement('script');
                s2.src = url + '/sma/services/Services.js';
                document.body.appendChild(s2);
                s2.onload = function () {
                    _this.logon(user, password, token);
                    var s3 = document.createElement('script');
                    s3.src = url + '/sma/app_80_0_0.js';
                    document.body.appendChild(s3);
                    s3.onload = function () {
                        _this._prepare_dom();
                        _this._doCreateView(function () { _this.logon(user, password, token, true); });
                    }
                }
            }
        }
    };

    WebGraphicsApi.prototype._load_scripts_debug = function (url, user, password, token, language) {
        var _this = this;

        var s = null;

        if (document.body) {
            clearInterval(this._load_scripts_interval);
            this._load_scripts_interval = null;
        }
        else {
            if (this._load_scripts_interval === null) {
                this._load_scripts_interval = setInterval(function () {
                    _this._load_scripts(url, user, password);
                }, 10);
            }
            return;
        }

        s = document.createElement('script');
        s.src = url + '/js/src/config.js';
        document.body.appendChild(s);

        s = document.createElement('script');
        s.src = url + '/js/src/def_debug.js';
        document.body.appendChild(s);
        s.onload = function () {
            if (language) {
                dojoConfig.locale = language;
            }
        }

        s = document.createElement('script');
        s.src = url + '/js/src/dojo/dojo.js';
        document.body.appendChild(s);

        s.onload = function () {
            _this._prepare_dom();
            _this._doCreateView(function () { _this.logon(user, password, token, true); });
        };

        s = document.createElement('script');
        s.src = url + '/js/src/services/Services.js';
        document.body.appendChild(s);

        s.onload = function () {
            _this.logon(user, password, token);
        }
    };

    WebGraphicsApi.prototype._doCreateView = function (onRedoLogon) {
        var _this = this;
        require(["dojo/ready", "dojo/aspect", "dojo/dom-style", "dojo/domReady!", "dojox/mobile/_compat", "viewer", "ma", "viewer/Viewer"], function (ready, aspect, domStyle, domReady, compat, viewer, ma, Viewer) {
            _this._aspect = aspect;
            ready(81, function () {
                if (_this._wg_logon) {
                    try {
                        var onGetToken = function (csrfToken) {
                            _this._wg_viewer = Viewer.init(false, 0);
                            _this._wg_viewer.setAlarmPullingRate(_this._alarm_pulling_rate);
                            _this._wg_viewer.setCheckRequestCallback(_this._checkRequestCallback);
                            dojo.addClass(document.body, "claro");
                            domStyle.set(_this._wg_viewer.viewArea, {
                                minWidth: 0,
                                minHeight: 0,
                                backgroundColor: "rgb(255,255,255)"
                            });

                            domStyle.set(_this._wg_viewer.domNode, {
                                overflow: "visible",
                                backgroundColor: "rgb(255,255,255)",
                                lineHeight: "1"
                            });

                            _this._wg_viewer.Run(_this._pooling_rate);
                            _this._wg_viewer.setScreenBelongViewer(_this._screenBelongViewer);
                            if (typeof _this._enableCache !== 'undefined') {
                                _this._wg_viewer._enableScreenCache = _this._enableCache;
                            }

                            if (_this._init_success) {
                                _this._init_success();
                            }

                            setTimeout(function () {
                                _this._isInit = true;
                                _this._processQueue();
                            }, 0);
                        };

                        services.onAfterGetCSRFToken(onGetToken, function () {
                            // timeout
                            if (onRedoLogon)
                                onRedoLogon();
                            onGetToken();
                        }, 3000);
                    }
                    catch (ex) {
                        if (_this._init_failure) {
                            _this._init_failure();
                        }
                        console.log(ex.message);
                    }
                }
            });
        });
    }

    WebGraphicsApi.prototype.refreshToken = function (token) {
        this.logon(null, null, token, true);
    }

    WebGraphicsApi.prototype.logon = function (user, password, token, forceLogon) {
        var l = new LogonServices();
        if (token) {
            l.setToken(token);
        }
        var result = l.isLogged();
        // When republishing the InTouch Application the server returns -10000 and that will force us to reload
        if (result.resultCode == -10000 && typeof (localStorage) !== null) {
            var retries = localStorage.getItem("maRetries") || 0;
            if (retries < 3) {
                localStorage.setItem("maRetries", retries + 1);
                if (retries == 0) {
                    location.reload();
                }
                else {
                    setTimeout(function () { location.reload() }, 5000);
                }
                return;
            }
        }
        if (result.resultCode != 0) {
            if (this._init_failure) {
                this._init_failure();
            }
            console.log('Error to create connection, please make sure the runtime is running and that the Mobile Access Task is started!');
            return;
        }
        else if (!forceLogon && user != null && result.resultCode == 0 && result.data.isLogged && result.data.userName != null && result.data.userName == user) {
            this._wg_logon = true;
            return;
        }
        try {
            localStorage.setItem("maRetries", 0);
            if (token)
                l.logon(token, function () { });
            else
                l.logon(user, password);
            this._wg_logon = true;
        }
        catch (ex) {
            if (this._init_failure) {
                this._init_failure();
            }
            console.log(ex.message);
        }
    };

    WebGraphicsApi.prototype.load = function (screenName, containerId, options, config, openParams) {
        // how to use custom params:
        // use "openParams"
        // 1. add a property "options", and set as an options object
        // 2. or add a function "onGettingOptions(screenId, screenName, additionalInfo)", this funtion will return options object
        // The two way could be used at the same time. Will set option using property first, then override with "onGettingOptions" function.
        //
        // <NOTICE>: for "showScreenAsync" flag, MUST be set by "options" property!
        //
        // ---------------------------------------
        // example:
        // openParams.options = { 'showScreenAsync': true, 'panAndZoomMode': "panAndZoom" }; 
        // openParams.onGettingOptions = function (id, name, additionalInfo) { return { 'panAndZoomMode': "panAndZoom" } };
        //
        // If enabled partial rendering, we need to set callback with openParams.onRenderingDone.
        // After partial rendering done, or disabled partial rendering and parseXML done, the callback will be triggerred.
        //
        // example:
        // openParams.onRenderingDone = function (id, name, additionalInfo) {};
        //
        // Additionally, for screens group, use:
        // openParams.onScreensGroupRenderingDone = function () {};
        // ---------------------------------------
        // For availible options, could be get from "\src\WebView\js\src\viewer\screens\_base.js", method: "setOptions(optionObj)"

        var _this = this;
        if (!this._isInit) {
            ////throw new Error("WebGraphicsApi.init() not finished yet. Please make sure opts.success() callback has been triggerred before call this API.");
            // for load operation, it will close last opened screen. So will cleanup queue before enqueue.
            this._procQueue = [];
            return this._enqueueSingleProc(screenName, containerId, function () {
                return _this.load(screenName, containerId, options, config, openParams);
            });
        }

        var promise = null;

        require(["dojo/Deferred", "dojo/dom-style", "viewer/misc/enums"], function (Deferred, domStyle, enums) {
            if (config != null && config.dojoClick != null) {
                document.dojoClick = config.dojoClick;
            }
            domStyle.set(_this._wg_viewer.containerNode, {
                display: 'none'
            });
            var deferred = new Deferred();

            if (_this._wg_viewer === null || _this._wg_viewer === undefined) {
                var result = { "id": -1, "resultCode": -1, "message": "webGraphicsAPI has not been initialized. You must call init and wait until you get a success callback" };
                deferred.reject(result);
            }
            else {
                try {
                    var container = document.getElementById(containerId);
                    var screen = null;
                    var openScreenCallback = function (response) {
                        switch (response.status) {
                            case enums.EnumWebGraphicsAPIRequestStatus.LOADING:
                                deferred.progress('the screen is loading!!!');
                                break;
                            case enums.EnumWebGraphicsAPIRequestStatus.FAILED_TO_LOAD_FILE:
                                deferred.reject(response.result);
                                domStyle.set(_this._wg_viewer.containerNode, {
                                    display: ''
                                });
                                break;
                            case enums.EnumWebGraphicsAPIRequestStatus.FILE_LOADED:
                                screen = response.screen;
                                deferred.progress(response.result);
                                if (_this._wg_viewer != null && _this._wg_viewer._enablePartialRendering) {
                                    if (screen) {
                                        if (_this._screenBelongViewer) {
                                            if (!container.contains(_this._wg_viewer.domNode)) {
                                                // Prevent duplicate appendChild to make sure custom widget inner content will NOT be cleared after caching
                                                container.appendChild(_this._wg_viewer.domNode);
                                            }
                                            _this._wg_viewer.setApiContainer(container);
                                            _this._wg_viewer._updateSize();
                                            // MOVE the CSS to disable touch action on command elements instead from global to make sure container scrolling will work.
                                            ////_this._wg_viewer.containerNode.classList.add("ma_disable_native_touch");
                                        }
                                        else {
                                            if (!container.contains(screen.domNode)) {
                                                // Prevent duplicate appendChild to make sure custom widget inner content will NOT be cleared after caching
                                                container.appendChild(screen.domNode);
                                            }
                                            setTimeout(function () {
                                                screen._applySingleScreenScaling();
                                            }, 200);
                                            // Add disable_native_touch class to make sure DOJO will NOT break page touch behavior.
                                            // Resolve touch gesture single finger slide not working issue
                                            // MOVE the CSS to disable touch action on command elements instead from global to make sure container scrolling will work.
                                            ////if (!container.classList.contains("ma_disable_native_touch"))
                                            ////    container.classList.add("ma_disable_native_touch");
                                            ////if (!screen.domNode.classList.contains("ma_disable_native_touch"))
                                            ////    screen.domNode.classList.add("ma_disable_native_touch");
                                        }
                                    }
                                    domStyle.set(_this._wg_viewer.containerNode, {
                                        display: ''
                                    });
                                }
                                break;
                            case enums.EnumWebGraphicsAPIRequestStatus.FAILED_TO_LOAD:
                                deferred.reject(response.result);
                                break;
                            case enums.EnumWebGraphicsAPIRequestStatus.LOADED:
                                if (!deferred.isResolved()) {
                                    if (screen) {
                                        if (_this._screenBelongViewer) {
                                            if (!container.contains(_this._wg_viewer.domNode)) {
                                                // Prevent duplicate appendChild to make sure custom widget inner content will NOT be cleared after caching
                                                container.appendChild(_this._wg_viewer.domNode);
                                            }
                                            _this._wg_viewer.setApiContainer(container);
                                            _this._wg_viewer._updateSize();
                                            // MOVE the CSS to disable touch action on command elements instead from global to make sure container scrolling will work.
                                            ////_this._wg_viewer.containerNode.classList.add("ma_disable_native_touch");
                                        }
                                        else {
                                            if (!container.contains(screen.domNode)) {
                                                // Prevent duplicate appendChild to make sure custom widget inner content will NOT be cleared after caching
                                                container.appendChild(screen.domNode);
                                            }
                                            setTimeout(function () {
                                                screen._applySingleScreenScaling();
                                            }, 200);
                                            // Add disable_native_touch class to make sure DOJO will NOT break page touch behavior.
                                            // Resolve touch gesture single finger slide not working issue
                                            // MOVE the CSS to disable touch action on command elements instead from global to make sure container scrolling will work.
                                            ////if (!container.classList.contains("ma_disable_native_touch"))
                                            ////    container.classList.add("ma_disable_native_touch");
                                            ////if (!screen.domNode.classList.contains("ma_disable_native_touch"))
                                            ////    screen.domNode.classList.add("ma_disable_native_touch");
                                        }
                                    }
                                    var result = { "id": -1, "resultCode": 0, "message": "the screen is loaded", "custom_properties": screen.customProperties, "attr": screen._attr };
                                    deferred.resolve(result);
                                }
                                domStyle.set(_this._wg_viewer.containerNode, {
                                    display: ''
                                });
                                break;
                        }
                    }

                    var isValid = true;
                    //TODO: Package the code below into a separate method.
                    var regSymbolName1 = /^[a-z|A-Z][a-z|0-9|A-Z|#|_|$|:]*$/;
                    var regSymbolName2 = /^[0-9|#|_][a-z|0-9|A-Z|#|_|$]*[a-z|A-Z]+[a-z|0-9|A-Z|#|_|$]*$/;
                    if (screenName) {
                        var symbolName = screenName;
                        var instanceName = null;
                        var regInstanceSymbol = /^[a-z|0-9|A-Z|#|_|$]*\.[a-z|0-9|A-Z|#|_|$]*$/;
                        if (screenName.search(regInstanceSymbol) >= 0) {
                            var regInst = /^[a-z|0-9|A-Z|#|_|$]*/g;
                            var instGet = screenName.match(regInst);
                            if (instGet != null && instGet.length > 0) {
                                instanceName = instGet[0];
                                var regSymbolName = /[a-z|0-9|A-Z|#|_|$]*$/g;
                                var instanceSymbol = screenName.match(regSymbolName);
                                if (instanceSymbol != null && instanceSymbol.length > 0)
                                    symbolName = instanceSymbol[1];
                            }
                        }

                        if (instanceName) {
                            if (!(instanceName.search(regSymbolName1) >= 0 || instanceName.search(regSymbolName2) >= 0)) {
                                isValid = false;
                                var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                                deferred.reject(result);
                            }
                        }

                        //TODO:This blocks IntouchWebClient symbol loading with localization charactors, so rollback below logic. 
                        //if (!(symbolName.search(regSymbolName1) >= 0 || symbolName.search(regSymbolName2) >= 0)) {
                        //isValid = false;
                        //var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                        //deferred.reject(result);
                        //}
                    }

                    if (options) {
                        //TODO: if we need open multiple screens, we have to change below code. 
                        if (options.length > 0) {
                            options[0].owningObject = options[0].owningObject ? options[0].owningObject : "";
                            options[0].customProperties = options[0].customProperties ? options[0].customProperties : "";
                            // Intouch web client fix for localization.
                            //if (options[0].owningObject.length > 0) {
                            //if (!(options[0].owningObject.search(regSymbolName1) >= 0 || options[0].owningObject.search(regSymbolName2) >= 0)) {
                            //isValid = false;
                            //var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                            //deferred.reject(result);
                            //}
                            //}
                        }
                    }
                    if (isValid) {
                        this._latestScreenName = symbolName;
                        _this._wg_viewer.OpenScreen(symbolName, openScreenCallback, openParams, options);
                    }
                }
                catch (ex) {
                    deferred.reject(ex.message);
                    domStyle.set(_this._wg_viewer.containerNode, {
                        display: 'none'
                    });
                }
            }
            promise = deferred.promise;
        });
        return promise;
    };

    WebGraphicsApi.prototype.loadExt = function (screenName, containerId, options, config, openParams) {
        try {
            if (screenName.toLowerCase().indexOf("window!") === 0) {
                var cWidgetObj = this.getMultiWindowScreen();
                var self = this;
                var retryCount = 5000;

                var onOpenWindow = function () {
                    cWidgetObj = cWidgetObj || self.getMultiWindowScreen();
                    if ((cWidgetObj == null || cWidgetObj._customWidget == null || cWidgetObj._customWidget.proxy == null) && retryCount > 0) {
                        window.setTimeout(function () { retryCount = retryCount - 100; onOpenWindow(); }, 100);
                        return;
                    }

                    if (cWidgetObj == null || cWidgetObj._customWidget == null || cWidgetObj._customWidget.proxy == null) {
                        console.log('[Load window] Get container widget timeout.');
                        return;
                    }

                    if (cWidgetObj._customWidget.win.isAllScreensLoaded) { // already loaded all screens 
                        var wViewer = self.getWidgetViewer(cWidgetObj);
                        wViewer.OpenScreen(screenName, null, { options: { showLoadingIndicator: true } });
                    }
                    else { // not load or not loaded done, use callback
                        var callbackId = cWidgetObj.regLocalEventCallback("onAllScreensLoaded", function () {
                            var wViewer = self.getWidgetViewer(cWidgetObj);
                            cWidgetObj.unregLocalEventCallback("onAllScreensLoaded", callbackId);
                            wViewer.OpenScreen(screenName, null, { options: { showLoadingIndicator: true } });
                        });
                    }
                }

                if (cWidgetObj) // widget already opened and start loading or loaded
                    onOpenWindow();
                else {
                    this.closeAllScreens();
                    this.load("MultiWindow!Home", containerId, options, config, {
                        options: { showLoadingIndicator: true },
                        onRenderingDone: function () {
                            onOpenWindow();
                        }
                    });
                }
            }
            else {
                return this.load(screenName, containerId, options, config, openParams);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    };

    // get widget screen object.
    // additionalCheck: function (screenObj, widgetObj)
    // return null if not found any widget screen object.
    // or return [screenObj, widgetObj] if screenObj contains very 1st item as widget
    WebGraphicsApi.prototype.getWidgetScreenObj = function (additionalCheck) {
        if (this._wg_viewer === null || this._wg_viewer === undefined) {
            console.log('Api was not started. Can not get a screen!!!');
            return null;
        }

        try {
            var index = 0;

            if (this._wg_viewer._screens && Object.keys(this._wg_viewer._screens).length > 0) {
                if (this._wg_viewer._screens[index] === undefined) {
                    index++;
                }
                for (var i = index; i < Object.keys(this._wg_viewer._screens).length + index; i++) {
                    var screen = this._wg_viewer._screens[i];
                    if (screen && screen._opened && screen.getChildren) {
                        var cWidgetObj = screen.getChildren();
                        if (cWidgetObj && cWidgetObj.length > 0 && cWidgetObj[0] != null && cWidgetObj[0].isCustomWidget
                            && cWidgetObj[0]._cw_attr && (additionalCheck == null || additionalCheck(screen, cWidgetObj[0]))) {
                            return [screen, cWidgetObj[0]];
                        }
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex.message);
        }

        return null;
    };

    WebGraphicsApi.prototype.getMultiWindowScreen = function () {
        var result = this.getWidgetScreenObj(function (screen, widget) { return widget._cw_attr["ScreenGroups"]; });
        if (result != null)
            return result[1];

        return null;
    };

    // When change poolingrate, please set index back to 0;
    WebGraphicsApi.prototype.dynamicChangePoolingRate = function (index, poolingRates) {
        if (index == 0) {
            if (this._poolingRateTimeout != null) {
                clearTimeout(this._poolingRateTimeout);
                this._poolingRateTimeout = null;
            }
            this._dynamicPoolingRates = poolingRates;
        }

        if (this._dynamicPoolingRates.length > index) {
            var _this = this;
            this.changePoolingRate(this._dynamicPoolingRates[index]);
            this._poolingRateTimeout = setTimeout(function () {
                _this.dynamicChangePoolingRate(index);
            }, this._dynamicPoolingRates[index]);

            index++;
        }
        else {
            clearTimeout(this._poolingRateTimeout);
            this._poolingRateTimeout = null;
        }
    }

    WebGraphicsApi.prototype.loadMultiple = function (screenNameList, containerIdList, options, dataLoadingCallback, textChangeCallback, openScreenCallback, openParams) {
        // how to use custom params:
        // use "openParams"
        // 1. add a property "options", and set as an options object
        // 2. or add a function "onGettingOptions(screenId, screenName, additionalInfo)", this funtion will return options object
        // The two way could be used at the same time. Will set option using property first, then override with "onGettingOptions" function.
        //
        // <NOTICE>: for "showScreenAsync" flag, MUST be set by "options" property!
        // <NOTICE>: for "showLoadingIndicator" flag, MUST be set by "options" property!

        // ---------------------------------------
        // example:
        // openParams.options = { 'showScreenAsync': true, 'showLoadingIndicator': true, 'panAndZoomMode': "panAndZoom" }; 
        // openParams.onGettingOptions = function (id, name, additionalInfo) { return { 'panAndZoomMode': "panAndZoom" } };
        //
        // By default, if using OpenMultiple, the additionalInfo will be { 'containerId': containerId }
        // ---------------------------------------
        // If enabled partial rendering, we need to set callback with openParams.onRenderingDone.
        // After partial rendering done, or disabled partial rendering and parseXML done, the callback will be triggerred.
        //
        // example:
        // openParams.onRenderingDone = function (id, name, additionalInfo) {};
        //
        // By default, if using OpenMultiple, the additionalInfo will be { 'containerId': containerId }
        // ---------------------------------------
        // For availible options, could be get from "\src\WebView\js\src\viewer\screens\_base.js", method: "setOptions(optionObj)"

        var _this = this;

        if (!this._isInit) {
            ////throw new Error("WebGraphicsApi.init() not finished yet. Please make sure opts.success() callback has been triggerred before call this API.");
            return this._enqueueProc(screenNameList, containerIdList, function () {
                return _this.loadMultiple(screenNameList, containerIdList, options, dataLoadingCallback, textChangeCallback, openScreenCallback, openParams);
            });
        }

        var promise = null;

        require(["dojo/Deferred", "dojo/dom-style", "viewer/misc/enums"], function (Deferred, domStyle, enums) {
            domStyle.set(_this._wg_viewer.containerNode, {
                display: 'none'
            });
            var deferred = new Deferred();

            var onProcessing = function () {
                if (_this._wg_viewer === null || _this._wg_viewer === undefined) {
                    var result = { "id": -1, "resultCode": -1, "message": "webGraphicsAPI has not been initialized. You must call init and wait until you get a success callback" };
                    deferred.reject(result);
                }
                else {
                    try {
                        _this._wg_viewer.setTextChangeCallback(textChangeCallback);
                        var isValid = true;
                        for (var i = 0; i < screenNameList.length; i++) {
                            //TODO: Package the code below into a separate method.
                            var regSymbolName1 = /^[a-z|A-Z][a-z|0-9|A-Z|#|_|$|:]*$/;
                            var regSymbolName2 = /^[0-9|#|_][a-z|0-9|A-Z|#|_|$]*[a-z|A-Z]+[a-z|0-9|A-Z|#|_|$]*$/;
                            if (screenNameList[i]) {
                                var symbolName = screenNameList[i];
                                var instanceName = null;
                                var regInstanceSymbol = /^[a-z|0-9|A-Z|#|_|$]*\.[a-z|0-9|A-Z|#|_|$]*$/;
                                if (screenNameList[i].search(regInstanceSymbol) >= 0) {
                                    var regInst = /^[a-z|0-9|A-Z|#|_|$]*/g;
                                    var instGet = screenNameList[i].match(regInst);
                                    if (instGet != null && instGet.length > 0) {
                                        instanceName = instGet[0];
                                        var regSymbolName = /[a-z|0-9|A-Z|#|_|$]*$/g;
                                        var instanceSymbol = screenNameList[i].match(regSymbolName);
                                        if (instanceSymbol != null && instanceSymbol.length > 0)
                                            symbolName = instanceSymbol[0];
                                    }
                                }

                                if (instanceName) {
                                    if (!(instanceName.search(regSymbolName1) >= 0 || instanceName.search(regSymbolName2) >= 0)) {
                                        isValid = false;
                                        var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                                        deferred.reject(result);
                                    }
                                }

                                //if (!(symbolName.search(regSymbolName1) >= 0 || symbolName.search(regSymbolName2) >= 0)) {
                                //    isValid = false;
                                //    var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                                //    deferred.reject(result);
                                //}
                            }

                            if (options && options[i]) {
                                //TODO: if we need open multiple screens, we have to change below code. 
                                if (options[i].length > 0) {
                                    options[i][0].owningObject = options[i][0].owningObject ? options[i][0].owningObject : "";
                                    options[0].customProperties = options[0].customProperties ? options[0].customProperties : "";
                                    if (options[i][0].owningObject.length > 0) {
                                        if (!(options[i][0].owningObject.search(regSymbolName1) >= 0 || options[i][0].owningObject.search(regSymbolName2) >= 0)) {
                                            isValid = false;
                                            var result = { "id": -1, "resultCode": -1, "message": "the screen name is incorrect" };
                                            deferred.reject(result);
                                        }
                                    }
                                }
                            }
                        }

                        var results = [];

                        var onAssignScreen = function (screen, resultsArr) {
                            if (screen == null) return;

                            var container = null;
                            if (screen.paramsContainerId != null) {
                                container = document.getElementById(screen.paramsContainerId);
                            }
                            else {
                                for (var j = 0; j <= screenNameList.length; j++) {
                                    if (screen.screenName === screenNameList[j]) {
                                        var container = document.getElementById(containerIdList[j]);
                                        break;
                                    }
                                }
                            }

                            if (container != null) {
                                container.appendChild(screen.domNode);
                                // Add disable_native_touch class to make sure DOJO will NOT break page touch behavior.
                                // Resolve touch gesture single finger slide not working issue
                                // MOVE the CSS to disable touch action on command elements instead from global to make sure container scrolling will work.
                                ////if (!container.classList.contains("ma_disable_native_touch"))
                                ////    container.classList.add("ma_disable_native_touch");
                                ////if (!screen.domNode.classList.contains("ma_disable_native_touch"))
                                ////    screen.domNode.classList.add("ma_disable_native_touch");
                            }
                            var result = { "id": -1, "resultCode": 0, "message": "the screen is loaded", "custom_properties": screen.customProperties, "attr": screen._attr };
                            resultsArr.push(result);
                        };

                        var onAssignScreens = function (screens, isAssignRequired) {
                            if (!deferred.isResolved()) {
                                if (isAssignRequired) {
                                    if (screenDescList && screenDescList.length > 0) {
                                        for (var i = 0; i < screenDescList.length; i++) {
                                            onAssignScreen(screenDescList[i], results);
                                        }
                                    }

                                    domStyle.set(_this._wg_viewer.containerNode, {
                                        display: ''
                                    });
                                }

                                deferred.resolve(results);

                                if (this._dynamicPoolingRates) {
                                    this.dynamicChangePoolingRate(0);
                                }
                            }
                        };

                        var isShowScreenAsync = openParams != null && openParams.options != null && openParams.options.showScreenAsync;
                        if (!isShowScreenAsync && _this._wg_viewer._enablePartialRendering) {
                            openParams = openParams != null ? openParams : {};
                            openParams.options = openParams.options != null ? openParams.options : {};
                            openParams.options.showScreenAsync = true;
                            isShowScreenAsync = true;
                        }

                        if (isShowScreenAsync)
                            openParams.options.onShowScreenProcessed = function (screen) {
                                onAssignScreen(screen, results);

                                domStyle.set(_this._wg_viewer.containerNode, {
                                    display: ''
                                });
                            };

                        var isHandledOpenScreenCallback = false;
                        var onOpenScreenCallback = function (response, olMap, screens) {
                            if (isHandledOpenScreenCallback || screens == null) return;
                            isHandledOpenScreenCallback = true;
                            if (isShowScreenAsync)  //// if show screen async, assign screen will occurred during process each screen.
                                onAssignScreens(screens, false);

                            if (openScreenCallback != null)
                                openScreenCallback(response, olMap, screens);
                        };

                        if (isValid) {
                            this._latestScreenName = symbolName;

                            var screenDescList = _this._wg_viewer.OpenScreenList(screenNameList, onOpenScreenCallback, null, openParams, options, containerIdList);

                            if (!isShowScreenAsync)
                                onAssignScreens(screenDescList, true);
                        }
                    }
                    catch (ex) {
                        deferred.reject(ex.message);
                        domStyle.set(_this._wg_viewer.containerNode, {
                            display: 'none'
                        });
                    }
                }
            }

            onProcessing();

            promise = deferred.promise;
        });

        return promise;
    };

    WebGraphicsApi.prototype.changePoolingRate = function (poolingRate) {
        this._pooling_rate = poolingRate;
        if (this._wg_viewer) {
            this._wg_viewer.Stop();
            this._wg_viewer.Run(this._pooling_rate);
        }
    }

    WebGraphicsApi.prototype.loadScreen = function (screenName, primitive, containerId) {
        var _this = this;

        if (!this._isInit) {
            ////throw new Error("WebGraphicsApi.init() not finished yet. Please make sure opts.success() callback has been triggerred before call this API.");
            return this._enqueueSingleProc(screenName, containerId, function () {
                return _this.loadScreen(screenName, primitive, containerId);
            });
        }

        var promise = null;
        var containerElement = document.createElement("div");
        for (var attr in primitive.container) {
            if (primitive.container.hasOwnProperty(attr)) {
                if (typeof primitive.container[attr] === "object") {
                    var jsonString = JSON.stringify(primitive.container[attr]);
                    containerElement.setAttribute(attr, jsonString);
                }
                else {
                    containerElement.setAttribute(attr, primitive.container[attr]);
                }
            }
        }

        var contentElement = document.createElement("div");
        for (var attr in primitive.content) {
            if (primitive.content.hasOwnProperty(attr)) {
                if (typeof primitive.content[attr] === "object") {
                    var jsonString = JSON.stringify(primitive.content[attr]);
                    contentElement.setAttribute(attr, jsonString);
                }
                else {
                    contentElement.setAttribute(attr, primitive.content[attr]);
                }
            }
        }

        containerElement.appendChild(contentElement);

        var data = containerElement.outerHTML.replace(/&quot;/g, "'");

        require(["dojo/Deferred", "dojo/dom-style", "viewer/misc/enums"], function (Deferred, domStyle, enums) {
            domStyle.set(_this._wg_viewer.containerNode, {
                display: 'none'
            });
            var deferred = new Deferred();
            if (_this._wg_viewer === null || _this._wg_viewer === undefined) {
                var result = {
                    "id": -1, "resultCode": -1, "message": "webGraphicsAPI has not been initialized. You must call init and wait until you get a success callback"
                };
                deferred.reject(result);
            }
            else {
                try {
                    var callback = function (result) {
                        var container = document.getElementById(containerId);
                        container.appendChild(result.screen.domNode);
                        result.screen.domNode.style.backgroundColor = "transparent";
                        setTimeout(function () {
                            result.screen._applySingleScreenScaling();
                        }, 100);
                    }
                    _this._wg_viewer.LoadScreen("screenName", data, callback);
                }
                catch (ex) {
                    deferred.reject(ex.message);
                    domStyle.set(_this._wg_viewer.containerNode, {
                        display: 'none'
                    });
                }
            }
            promise = deferred.promise;
        });
        return promise;
    };

    WebGraphicsApi.prototype.setCustomProperty = function (screenName, customPropertyName, customPropertyValue, isObj) {
        var _this = this;

        if (!this._isInit) {
            ////throw new Error("WebGraphicsApi.init() not finished yet. Please make sure opts.success() callback has been triggerred before call this API.");
            return this._enqueueSingleProc(screenName + "_#$%_CP_%$#", null, function () {
                return _this.setCustomProperty(screenName, customPropertyName, customPropertyValue, isObj);
            });
        }

        var promise = null;
        require(["dojo/Deferred", "viewer/misc/enums"], function (Deferred, enums) {
            var deferred = new Deferred();
            if (_this._wg_viewer === null || _this._wg_viewer === undefined) {
                var result = { "id": -1, "resultCode": -1, "message": "webGraphicsAPI has not been initialized. You must call init and wait until you get a success callback" };
                deferred.reject(result);
            }

            var setCustomPropertyCallback = function (response) {
                switch (response.status) {
                    case enums.EnumWebGraphicsAPIRequestStatus.LOADING:
                        deferred.progress('the property is setting!');
                        break;
                    case enums.EnumWebGraphicsAPIRequestStatus.FAILED_TO_LOAD:
                        deferred.reject('the property setting failed');
                        break;
                    case enums.EnumWebGraphicsAPIRequestStatus.LOADED:
                        if (!deferred.isResolved()) {
                            deferred.resolve('the property setting succeed');
                        }
                        break;
                }
            }

            _this._wg_viewer.setCustomPropertyForApi(screenName, customPropertyName, customPropertyValue, isObj, setCustomPropertyCallback);
            promise = deferred.promise;
        });
        return promise;

    };

    WebGraphicsApi.prototype.getZoomLevel = function (screenNameOrId) {
        if (this._wg_viewer == null) {
            return 1;
        }

        var screens = this.getScreensByNameOrId(screenNameOrId);
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            if (screen && screen._apiZoomLevel) {
                var isZooming = screen._apiIsZooming > 0 ? screen._apiIsZooming : screen.isApiZooming();
                var level = isZooming > 0 && screen._apiZoomLevel != null && screen._apiZoomLevel <= 1 ? 1.00000000001 : screen._apiZoomLevel;
                if (level != null && level != 1) {
                    return level;
                }
            }
        }

        return 1;
    }

    WebGraphicsApi.prototype.getScreensByNameOrId = function (screenNameOrId) {
        if (screenNameOrId == null || this._wg_viewer == null || this._wg_viewer._screens == null) return [];

        var id = parseInt(screenNameOrId);

        if (isNaN(id) || id < 0) {
            var screenIds = this._wg_viewer._getScreenIdsByName(screenNameOrId != null && screenNameOrId != "" ? screenNameOrId : this._latestScreenName)
            var result = [];
            for (var i = 0; i < screenIds.length; i++) {
                var screen = this._wg_viewer._screens[screenIds[i]];
                result.push(screen);
            }

            return result;
        }
        else {
            if (this._wg_viewer._screens.hasOwnProperty(id))
                return [this._wg_viewer._screens[id]];
        }

        return [];
    }

    WebGraphicsApi.prototype.getScreenIds = function (referencePointClientX, referencePointClientY) {
        // Get screen IDs under the point with clientX and clientY. By default, the first one will be on the back, and the last one will be on the front
        var result = [];
        if (this._wg_viewer == null || this._wg_viewer._screens == null) return result;

        for (key in this._wg_viewer._screens) {
            if (this._wg_viewer._screens.hasOwnProperty(key)) {
                var screen = this._wg_viewer._screens[key];

                if (screen.domNode != null
                    && screen.wasDestroyed === false
                    && !screen.isPartialRendering) {  //// screen not destroyed and NOT under partial rendering (after done, will set this flag to false)
                    var rect = screen.domNode.getBoundingClientRect();

                    var screenX = rect.left;
                    var screenY = rect.top;
                    var screenW = rect.width;
                    var screenH = rect.height;

                    if (referencePointClientX >= screenX && referencePointClientX <= screenX + screenW
                        && referencePointClientY >= screenY && referencePointClientY <= screenY + screenH)
                        result.push(key);
                }
            }
        }

        return result;
    }

    WebGraphicsApi.prototype.getFrontMostScreenId = function (referencePointClientX, referencePointClientY) {
        // get FrontMost screen ID under the point with clientX and clientY.
        var ids = this.getScreenIds(referencePointClientX, referencePointClientY);
        if (ids.length > 0) return ids[ids.length - 1];

        return null;
    }

    WebGraphicsApi.prototype.getScreenName = function (referencePointClientX, referencePointClientY) {
        // Will support returning screen name based on point.
        var id = this.getFrontMostScreenId(referencePointClientX, referencePointClientY);
        if (id != null) return this._wg_viewer._screens[id].screenName;

        return this._latestScreenName;
    }

    // deltaLevel: 0 - N. If deltaLevel = 1 will be no scale.
    // referencePointX/referencePointY: the point coordination related browser viewer area top-left point. Using mouse events callback.clientX/ClientY
    WebGraphicsApi.prototype.startZooming = function (screenNameOrId, deltaLevel, referencePointX, referencePointY, offsetX, offsetY) {
        //debugger;
        if (this._wg_viewer == null) {
            return;
        }
        //referencePointX, referencePointY are related to the box left top, I want to calculate the point related to the container
        //debugger;

        this.suspendPulling();

        var referenceX = referencePointX;
        var referenceY = referencePointY;

        var params = {
            deltaLevel: deltaLevel,
            referencePointX: referenceX,
            referencePointY: referenceY,
            offsetX: offsetX,
            offsetY: offsetY
        }

        var screens = this.getScreensByNameOrId(screenNameOrId);
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            screen.apiZoomStartScale(params);
        }
    }

    WebGraphicsApi.prototype.endZooming = function (screenNameOrId) {
        //debugger;
        if (this._wg_viewer == null) {
            return;
        }
        var screens = this.getScreensByNameOrId(screenNameOrId);
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            screen.apiZoomEndScale();
        }

        this.recoverPulling();
    }

    WebGraphicsApi.prototype.startPanning = function (screenNameOrId, deltaX, deltaY, referencePointX, referencePointY) {
        //debugger;
        if (this._wg_viewer == null) {
            return;
        }

        this.suspendPulling();

        var referenceX = referencePointX;
        var referenceY = referencePointY;

        var params = {
            deltaX: deltaX,
            deltaY: deltaY,
            referencePointX: referenceX,
            referencePointY: referenceY
        }

        var screens = this.getScreensByNameOrId(screenNameOrId);
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            screen.apiZoomStartPan(params);
        }
    }

    WebGraphicsApi.prototype.endPanning = function (screenNameOrId) {
        if (this._wg_viewer == null) {
            return;
        }
        var screens = this.getScreensByNameOrId(screenNameOrId);
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            screen.apiZoomEndPan();
        }

        this.recoverPulling();
    }

    WebGraphicsApi.prototype.suspendPulling = function (tempRate) {
        if (this._isPullingSuspended) return;
        this._isPullingSuspended = true;

        if (tempRate == null || tempRate <= 1000)
            tempRate = 10000;

        var targetRate = Math.min(10000, tempRate);

        if (this._wg_viewer) {
            this._wg_viewer.Stop();
            this._wg_viewer.Run(targetRate);
        }
    };

    WebGraphicsApi.prototype.recoverPulling = function () {
        // only if flag not set, and update rate already been set, then jump out.
        if (!this._isPullingSuspended && this._wg_viewer != null && this._wg_viewer._updateRate == this._pooling_rate) return;

        this._isPullingSuspended = false;

        if (this._wg_viewer) { // trigger one pulling
            this._wg_viewer._updateEvents();
        }

        if (this._wg_viewer) {
            this._wg_viewer.Stop();
            this._wg_viewer.Run(this._pooling_rate);
        }
    };

    WebGraphicsApi.prototype.closeScreen = function (screenName) {
        if (this._wg_viewer === null || this._wg_viewer === undefined) {
            console.log('Api was not started. Can not open a screen!!!');
            return;
        }
        try {
            this._wg_viewer.CloseScreen(screenName);
        }
        catch (ex) {
            console.log(ex.message);
        }
    };

    WebGraphicsApi.prototype.resize = function (screenName) {

    };

    WebGraphicsApi.prototype.closeAllScreens = function () {
        if (this._wg_viewer === null || this._wg_viewer === undefined) {
            console.log('Api was not started. Can not open a screen!!!');
            return;
        }
        try {
            this._wg_viewer.CloseAllScreens();
        }
        catch (ex) {
            console.log(ex.message);
        }
    };

    WebGraphicsApi.prototype.getNodeInfo = function (nodeName) {
        if (this._wg_viewer === null || this._wg_viewer === undefined) {
            console.log('Api was not started. Can not open a screen!!!');
            return;
        }
        try {
            //get associated actions for a given novigation path/node.
            var result = this._wg_viewer.getNavigationNode(nodeName);

            result = JSON.parse(result.data.nodeInfo);
            var layoutTemplate = result.content;
            var symbolPane = "";
            result.mappingInfo.forEach(function (a) {
                symbolPane += a.Key + ":" + a.Value + ",";
            });

            var screenObj = this.getWidgetScreenObj(function (screen, widget) { return widget._cw_attr["LayoutTemplate"] && widget._cw_attr["SymbolsAssociation"]; });
            if (screenObj == null) {
                return;
            }

            var innerCWGObj = screenObj[1];
            var layoutInfoObj = innerCWGObj._propertiesPool.LayoutTemplate;
            var symbolInfoObj = innerCWGObj._propertiesPool.SymbolsAssociation;
            layoutInfoObj.value = layoutTemplate;
            symbolInfoObj.value = symbolPane;
            screenObj[0].loadCustomNavNode(layoutTemplate, layoutInfoObj, symbolPane, symbolInfoObj, innerCWGObj, result.responsive);
        }
        catch (ex) {
            console.log(ex.message);
        }
    };

    WebGraphicsApi.prototype.getWidgetGraphicsApi = function (dojoWidget) {
        return dojoWidget && dojoWidget._customWidget && dojoWidget._customWidget.win ? dojoWidget._customWidget.win.webGraphicsApi : null;
    }

    WebGraphicsApi.prototype.getWidgetViewer = function (dojoWidget) {
        var wViewer = dojoWidget && dojoWidget._customWidget && dojoWidget._customWidget.win ? dojoWidget._customWidget.win.maViewer : null;

        if (wViewer != null)
            return wViewer;

        return dojoWidget && dojoWidget._customWidget && dojoWidget._customWidget.win && dojoWidget._customWidget.win.dijit && dojoWidget._customWidget.win.dijit.byId
            ? dojoWidget._customWidget.win.dijit.byId("_x_viewer_Viewer")
            : null;
    }

    WebGraphicsApi.prototype._getPromise = function () {
        var fakePromise = {
            then: function (callback, errback, progback) {
                this.callback = this.callback || [];
                this.callback.push(callback);

                this.errback = this.errback || [];
                this.errback.push(errback);

                this.progback = this.progback || [];
                this.errback.push(progback);

                return this;
            },

            cancel: function (reason, strict) {
                this.isCanceled = true;
                if (this.errback != null) {
                    this.errback.forEach(function (callback) { callback(reason, strict); });
                }

                return reason;
            },

            resolve: function (value, strict) {
                this.isResolved = true;
                if (this.callback) {
                    this.callback.forEach(function (callback) { callback(value, strict); });
                }
            },

            reject: function (error, strict) {
                this.isRejected = true;
                if (this.errback) {
                    this.errback.forEach(function (callback) { callback(error, strict); });
                }
            },

            progress: function (progress, strict) {
                if (this.progback) {
                    this.progback.forEach(function (callback) { callback(progress, strict); });
                }
            },

            isResolved: function () {
                return this.isResolved;
            },

            isRejected: function () {
                return this.isRejected;
            },

            isFulfilled: function () {
                return this.isResolved || this.isRejected;
            },

            isCanceled: function () {
                return this.isCanceled;
            },

            always: function (callbackOrErrback) {
                return this.then(callbackOrErrback, callbackOrErrback);
            },

            otherwise: function (errback) {
                return this.then(null, errback);
            },

            trace: function () {
                return this;
            },

            traceRejected: function () {
                return this;
            },

            toString: function () {
                return "[object Promise]";
            }
        };

        return fakePromise;
    };

    WebGraphicsApi.prototype._isMatchProc = function (proc, symNames, containerIds) {
        if (proc == null) return false;
        if (symNames == null) return false;
        if (proc.sym.length != symNames.length) return false;

        for (var i = 0; i < proc.sym.length; i++) {
            var sym = proc.sym[i];
            var cId = proc.container != null && proc.container.length > i ? proc.container[i] : null;

            var isMatch = false;
            for (var j = 0; j < symNames.length; j++) {
                var tSym = symNames[j];
                isMatch |= tSym != null && sym != null && tSym.toLowerCase() == sym.toLowerCase();

                if (isMatch) {
                    var tContainer = containerIds != null && containerIds.length > j ? containerIds[j] : null;
                    isMatch &= (cId == null && tContainer == null) || (cId != null && tContainer != null && cId.toLowerCase() == tContainer.toLowerCase());
                    break;
                }
            }

            if (!isMatch) return false;
        }

        return true;
    };

    WebGraphicsApi.prototype._processQueue = function () {
        var self = this;

        this._procQueue.forEach(function (proc) {
            var promise = proc.func();
            var innerPromise = proc.promise;
            promise.then(
                function (resolve, strict) {
                    innerPromise.resolve(resolve, strict);
                },
                function (error, strict) {
                    innerPromise.reject(error, strict);
                },
                function (progress, strict) {
                    innerPromise.progress(progress, strict);
                });
        });

        this._procQueue = [];
    };

    WebGraphicsApi.prototype._enqueueProc = function (symbolNames, containerIds, procFunc) {
        // procFunc:   parameter: null.   return: promise
        this._dequeueProc(symbolNames, containerIds);

        var promise = this._getPromise();

        this._procQueue.push({
            sym: symbolNames,
            container: containerIds,
            promise: promise,
            func: procFunc
        });

        return promise;
    };

    WebGraphicsApi.prototype._dequeueProc = function (symbolNames, containerIds) {
        var self = this;

        var findProc = this._procQueue.filter(function (p) { return self._isMatchProc(p, symbolNames, containerIds) });
        if (findProc != null && findProc.length > 0) {
            findProc.forEach(function (p) {
                p.promise.cancel("Enqueue a same action. Cancel the previews one.", false);
                self._procQueue = self._procQueue.filter(function (pF) { return pF != p });
            });
        }
    };

    WebGraphicsApi.prototype._enqueueSingleProc = function (symbolName, containerId, procFunc) {
        return this._enqueueProc([symbolName], containerId != null ? [containerId] : null, procFunc);
    };

    WebGraphicsApi.prototype._dequeueSingleProc = function (symbolName, containerId) {
        return this._dequeueProc([symbolName], containerId != null ? [containerId] : null);
    };

    WebGraphicsApi.prototype._dequeueAllProc = function () {
        var self = this;

        this._procQueue.forEach(function (p) {
            p.promise.cancel("Dequeue all actions.", false);
        });

        this._procQueue = [];
    };

    return WebGraphicsApi;
})();

window.webGraphicsApi = new WebGraphicsApi();
