window.webGraphicsApi.Line = function () {
    this.container = {
        _attr: {
            enableBackGround: 0,
            backGround: 'BMP',
            enableSharedImage: 0,
            multiTouchSettings: {
                useProjectDefault: true,
                useProjectDefaultSpecified: true,
                enable: '1',
                mode: '0',
                maxInnerZoom: '400',
                minOuterZoom: '20',
                maxOuterZoom: '0',
                deceleration: '0.1',
                angularDeceleration: '0.005',
                expansionDeceleration: '1'
            },
            locationTop: 0,
            locationLeft: 0,
            security: 0,
            hideScreenInsteadOfClosingIt: 0,
            keepScreenFileInMemory: 0,
            enableTitleBar: 0,
            systemMenu: 1,
            maximizeBox: 0,
            minimizeBox: 0,
            borderScreen: 'None',
            style: 'ReplacePartia',
            recieveFocusOnOpen: 1,
            shareTabOrder: 1,
            tabOrder: 0,
            background: {
                style: 'Solid',
                color: 'transparent'
            },
            backgroundScreen: 0,
            sizeWidth: 1280,
            sizeHeight: 800,
            engine: 0
        },
        "data-dojo-type": "viewer.screens.Dialog",
        objectsList: ""
    }

    this.content = {
        "data-dojo-type": "viewer.object.shape.Line",
        pen: {
            style: 'SolidLine',
            width: 5,
            color: 'rgb(255,255,255)'
        },
        tabOrder: "7",
        points: "[{'x':'70','y':'200'},{'x':'1260','y':'200'}]"
    }
};

window.webGraphicsApi.Rectangle = function () {
    this.container = {
        _attr: {
            enableBackGround: 0,
            backGround: 'BMP',
            enableSharedImage: 0,
            multiTouchSettings: {
                useProjectDefault: true,
                useProjectDefaultSpecified: true,
                enable: '1',
                mode: '0',
                maxInnerZoom: '400',
                minOuterZoom: '20',
                maxOuterZoom: '0',
                deceleration: '0.1',
                angularDeceleration: '0.005',
                expansionDeceleration: '1'
            },
            locationTop: 0,
            locationLeft: 0,
            security: 0,
            hideScreenInsteadOfClosingIt: 0,
            keepScreenFileInMemory: 0,
            enableTitleBar: 0,
            systemMenu: 1,
            maximizeBox: 0,
            minimizeBox: 0,
            borderScreen: 'None',
            style: 'ReplacePartia',
            recieveFocusOnOpen: 1,
            shareTabOrder: 1,
            tabOrder: 0,
            background: {
                style: 'Solid',
                color: 'transparent'
            },
            backgroundScreen: 0,
            sizeWidth: 1280,
            sizeHeight: 800,
            engine: 0
        },
        "data-dojo-type": "viewer.screens.Dialog",
        objectsList: ""
    }

    this.content = {
        "data-dojo-type": "viewer.object.shape.Rectangle",
        position: "{'left':'0','top':'0','right':'1280','bottom':'800'}",
        border: "{'style':'SolidLine','width':10,'color':'rgb(255,255,255)'}",
        background: "{'style':'Solid','color':'transparent'}",
        font: "{'name':'Arial','style':'Bold','gdiCharSet':'0','sizeInPoints':10,'fontColor':'rgb(0,0,0)'}",
        translate: "1",
        tabOrder: "2",
        align: "'Center'",
        multiline: "1",
        autoGrayOut: "1",
        wrapText: "1",
        autoFormat: "1"
    }
};

window.webGraphicsApi.Ellipse = function () {
    this.container = {
        _attr: {
            enableBackGround: 0,
            backGround: 'BMP',
            enableSharedImage: 0,
            multiTouchSettings: {
                useProjectDefault: true,
                useProjectDefaultSpecified: true,
                enable: '1',
                mode: '0',
                maxInnerZoom: '400',
                minOuterZoom: '20',
                maxOuterZoom: '0',
                deceleration: '0.1',
                angularDeceleration: '0.005',
                expansionDeceleration: '1'
            },
            locationTop: 0,
            locationLeft: 0,
            security: 0,
            hideScreenInsteadOfClosingIt: 0,
            keepScreenFileInMemory: 0,
            enableTitleBar: 0,
            systemMenu: 1,
            maximizeBox: 0,
            minimizeBox: 0,
            borderScreen: 'None',
            style: 'ReplacePartia',
            recieveFocusOnOpen: 1,
            shareTabOrder: 1,
            tabOrder: 0,
            background: {
                style: 'Solid',
                color: 'transparent'
            },
            backgroundScreen: 0,
            sizeWidth: 1280,
            sizeHeight: 800,
            engine: 0
        },
        "data-dojo-type": "viewer.screens.Dialog",
        objectsList: ""
    }

    this.content = {
        "data-dojo-type": "viewer.object.shape.Ellipse",
        position: "{'left':'140','top':'80','right':'801','bottom':'381'}",
        border: "{'style':'SolidLine','width':10,'color':'rgb(255,255,255)'}",
        background: "{'style':'Solid','color':'transparent'}",
        tabOrder: "2",
        roundness: "{'x':'0','y':'0'}",
        type: "'Ellipse'"
    }
};

window.webGraphicsApi.loadScreen = function (screenName, primitive, containerId) {
    var _this = this;
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