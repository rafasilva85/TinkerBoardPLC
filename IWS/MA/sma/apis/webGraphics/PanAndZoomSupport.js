/*global angular, console, ga, window, navigator, document, $*/
/* jshint -W100 */ //ignores this character may get silently deleted by one or more browsers
//------------------------------------------------------------------------------------------------------------
//<copyright company="Schneider Electric Software, LLC" file="PanZoom.js">
//   ?2015 Schneider Electric Software, LLC. All rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
// KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
// </copyright>
// <summary>
//
// </summary>
// ------------------------------------------------------------------------------------------------------------
if (window.panAndZoomSupport == null) {
    if (window.webGraphicsApi == null) {
        console.log('WARNING: Please make sure webGraphicsApi.js will be included.');
    }
    //else {
    var panAndZoomSupport = (function () {
        function panAndZoomSupport() {
            this.isZooming = false;
            this.graphicContainer = window.document;
            this.currentSymbolNameOrId = null;
            this.onPanStart = null;
            this.onPanEnd = null;
            this.isPan = false;
            this.isSupportPassive = this.isSupportPassiveOption();
			
			var self = this;

			this.processingScreenId = null;
			//// Template: string/Int function (pointerPositionClientX, pointerPositionClientY)
			this.onGetGraphicName = function (x, y) { return self.getSymbolId(x, y); };

            document.addEventListener("keydown", function (e) { self.onKeyDown(e); }, false);
            document.addEventListener("keyup", function (e) { self.onKeyUp(e); }, false);

            if ((typeof document.onmousewheel) != "undefined") {
                document.addEventListener("mousewheel", function (e) { self.onMouseWheel(e); }, this.getPassiveOption(null, false, false));
            }
            else if ((typeof document.onwheel) != "undefined") {
                document.addEventListener("wheel", function (e) { self.onMouseWheel(e); }, this.getPassiveOption(null, false, false));
            }

            document.addEventListener("mousedown", function (e) { self.onMouseDown(e); }, false);
            document.addEventListener("mouseup", function (e) { self.onMouseUp(e); }, false);
            // MUST use addEventListener here and set "useCapture" as true otherwise after mouse down, mouse move callback will NOT responded.
            document.addEventListener("mousemove", function (e) { self.onMouseMove(e); }, this.getPassiveOption(null, true, false));

            document.addEventListener("dblclick", function (e) { self.onDoubleClick(e); }, false);

            //// If is Safiri 12.1 or later, touch start stop propagation will NOT apply on browser level. So need to also monitor for GestureStart event.
            if ('ongesturestart' in window) {
                document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, false);
            }

            // Touch related events MUST be registered with parameter "false" to make sure it will following other events handled. 
            // If is true, it will responded before inner elements events responded.
            if ((typeof document.ontouchstart) != "undefined" && (typeof document.ontouchend) != "undefined") {
                // add useCapture as true to update points information to make sure if some handler stopped propagation will cause points count incorrect.
                ////document.addEventListener("touchstart", function (e) { self.getTouchPoints(e); }, true);
                document.addEventListener("touchend", function (e) { self.getTouchPoints(e); }, true);

                document.addEventListener("touchstart", function (e) { self.onTouchStart(e); }, false);
                document.addEventListener("touchend", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("touchcancel", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("touchmove", function (e) { self.onTouchMove(e, null); }, this.getPassiveOption(null, false, false));
                document.addEventListener("touchmove", function (e) { self.onTouchMove(e, self.isSupportPassive); }, false);
            }
            else if ((typeof document.onpointerdown) != "undefined" && (typeof document.onpointerup) != "undefined") {
                // add useCapture as true to update points information to make sure if some handler stopped propagation will cause points count incorrect.
                ////document.addEventListener("pointerdown", function (e) { self.getTouchPoints(e); }, true);
                document.addEventListener("pointerup", function (e) { self.getTouchPoints(e); }, true);

                document.addEventListener("pointerdown", function (e) { self.onTouchStart(e); }, false);
                document.addEventListener("pointerup", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("pointercancel", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("pointermove", function (e) { self.onTouchMove(e, null); }, this.getPassiveOption(null, false, false));
                document.addEventListener("pointermove", function (e) { self.onTouchMove(e, self.isSupportPassive); }, false);

                if ((typeof document.onpointerover) != "undefined") {
                    document.addEventListener("pointerout", function (e) { self.onPointerOverOrOut(e); }, false);
                    document.addEventListener("pointerover", function (e) { self.onPointerOverOrOut(e); }, false);
                }
                else {
                    document.addEventListener("pointerenter", function (e) { self.onPointerOverOrOut(e); }, false);
                    document.addEventListener("pointerleave", function (e) { self.onPointerOverOrOut(e); }, false);
                }
            }
            else if ((typeof document.onmspointerdown) != "undefined" && (typeof document.onmspointerup) != "undefined") {
                // add useCapture as true to update points information to make sure if some handler stopped propagation will cause points count incorrect.
                ////document.addEventListener("mspointerdown", function (e) { self.getTouchPoints(e); }, true);
                document.addEventListener("mspointerup", function (e) { self.getTouchPoints(e); }, true);

                document.addEventListener("mspointerdown", function (e) { self.onTouchStart(e); }, false);
                document.addEventListener("mspointerup", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("mspointercancel", function (e) { self.onTouchEnd(e); }, false);
                document.addEventListener("mspointermove", function (e) { self.onTouchMove(e, null); }, this.getPassiveOption(null, false, false));
                document.addEventListener("mspointermove", function (e) { self.onTouchMove(e, self.isSupportPassive); }, false);

                document.addEventListener("mspointerout", function (e) { self.onPointerOverOrOut(e); }, false);
                document.addEventListener("mspointerover", function (e) { self.onPointerOverOrOut(e); }, false);
            }
            else {
                console.log("Browser does not support touch.");
            }
        };

        panAndZoomSupport.prototype.isSupportPassiveOption = function () {
            var passiveSupported = false;

            try {
                var options = {
                    get passive() { // This function will be called when the browser
                        //   attempts to access the passive property.
                        passiveSupported = true;
                    }
                };

                window.addEventListener("test", options, options);
                window.removeEventListener("test", options, options);
            } catch (err) {
                passiveSupported = false;
            }

            return passiveSupported;
        };

        panAndZoomSupport.prototype.getPassiveOption = function (isSupportPassive, useCapture, isCatchingPassive, isOnce) {
            isSupportPassive = isSupportPassive != null ? isSupportPassive : this.isSupportPassive;

            if (!isSupportPassive) return useCapture != null ? useCapture : false;

            var option = {};
            if (useCapture != null)
                option.capture = useCapture;
            if (isCatchingPassive != null)
                option.passive = isCatchingPassive;
            if (isOnce != null)
                option.once = isOnce;

            return option;
        };

        // Set a dom control pan and zoom exceptional
        panAndZoomSupport.prototype.setPanZoomException = function (dom) {
            if (dom != null) {
                var setExceptionCallback = function (e) {
                    if (e != null)
                        e.isHandledByAnimation = true;
                }

                dom.addEventListener("keydown", setExceptionCallback, true);
                dom.addEventListener("keyup", setExceptionCallback, true);

                if ((typeof dom.onmousewheel) != "undefined") {
                    dom.addEventListener("mousewheel", setExceptionCallback, true);
                }
                else if ((typeof dom.onwheel) != "undefined") {
                    dom.addEventListener("wheel", setExceptionCallback, true);
                }

                dom.addEventListener("mousedown", setExceptionCallback, true);
                dom.addEventListener("mouseup", setExceptionCallback, true);
                // MUST use addEventListener here and set "useCapture" as true otherwise after mouse down, mouse move callback will NOT responded.
                dom.addEventListener("mousemove", setExceptionCallback, true);

                dom.addEventListener("dblclick", setExceptionCallback, true);

                // Touch related events MUST be registered with parameter "false" to make sure it will following other events handled. 
                // If is true, it will responded before inner elements events responded.
                if ((typeof dom.ontouchstart) != "undefined" && (typeof dom.ontouchend) != "undefined") {
                    dom.addEventListener("touchstart", setExceptionCallback, true);
                    dom.addEventListener("touchend", setExceptionCallback, true);
                    dom.addEventListener("touchcancel", setExceptionCallback, true);
                    dom.addEventListener("touchmove", setExceptionCallback, true);
                }
                else if ((typeof dom.onpointerdown) != "undefined" && (typeof dom.onpointerup) != "undefined") {
                    dom.addEventListener("pointerdown", setExceptionCallback, true);
                    dom.addEventListener("pointerup", setExceptionCallback, true);
                    dom.addEventListener("pointercancel", setExceptionCallback, true);
                    dom.addEventListener("pointermove", setExceptionCallback, true);
                }
                else if ((typeof dom.onmspointerdown) != "undefined" && (typeof dom.onmspointerup) != "undefined") {
                    dom.addEventListener("mspointerdown", setExceptionCallback, true);
                    dom.addEventListener("mspointerup", setExceptionCallback, true);
                    dom.addEventListener("mspointercancel", setExceptionCallback, true);
                    dom.addEventListener("mspointermove", setExceptionCallback, true);
                }
            }
        };

        // MUST be called before do pan and zoom
        panAndZoomSupport.prototype.setSymbolName = function (symbolNameOrId) {
            this.currentSymbolNameOrId = symbolNameOrId;
        };
		
		panAndZoomSupport.prototype.checkSymbol = function (e) {
			if (this.processingScreenId != null && this.processingScreenId != "" && !isNaN(this.processingScreenId)) return;
			
			var symbolNameOrId;
			if (this.onGetGraphicName != null) {
				var selectionP = this.getSelectionPoint(e);
				if (selectionP != null) {
					symbolNameOrId = this.onGetGraphicName(selectionP.clientX, selectionP.clientY);
				}
			}
			
			if(symbolNameOrId != null && symbolNameOrId != "" && !isNaN(symbolNameOrId)) {
				this.processingScreenId = symbolNameOrId;
			}

			this.setSymbolName(symbolNameOrId);
		};
		
		panAndZoomSupport.prototype.getSymbolId = function (referencePointClientX, referencePointClientY) {
			return webGraphicsApi.getFrontMostScreenId(referencePointClientX, referencePointClientY);
		};
		
		panAndZoomSupport.prototype.releaseCheckedSymbol = function () {
			this.processingScreenId = null;
		}
		
		panAndZoomSupport.prototype.getSelectionPoint = function (e) {
			var evt = e && e.originalEvent ? e.originalEvent : e;
			var points = this.getFormatedTouchPoints(evt);
			
			if (points == null || points.length <= 0) {
				if (evt.clientX != null && evt.clientY != null)
					return { clientX: evt.clientX, clientY: evt.clientY };
				else
					return null;
			}
			
			var totalX = 0;
			var totalY = 0;
			
			for(var i = 0; i < points.length; i++) {
				totalX += points[i].clientX;
				totalY += points[i].clientY;
			}
			
			return { clientX: totalX / points.length, clientY: totalY / points.length };
		};

        // MUST be called otherwise using key will NOT accurate
        panAndZoomSupport.prototype.setContainer = function (dom) {
            this.graphicContainer = dom;
        };

        panAndZoomSupport.prototype.onKeyDown = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            // check whether ctrl key down. If ctrl down, set flag to support mouse wheel zooming
            if (evt.ctrlKey)
                this.isCtrlDown = true;
            else
                this.isCtrlDown = false;

            if (evt.ctrlKey && (evt.which == 187 || evt.which == 189 || evt.which == 107 || evt.which == 109 || evt.which == 61 || evt.which == 173)) { // 187: +  189: - 107: Numpad +  109: Numpad -  61: FF +   173: FF -
                var symbolChartRect = this.graphicContainer.getBoundingClientRect();
                this.doZooming((evt.which == 187 || evt.which == 107 || evt.which == 61 ? 1 : -1) * 0.25, symbolChartRect.left + 0.5 * symbolChartRect.width, symbolChartRect.top + 0.5 * symbolChartRect.height);

                // prevent event to browser zooming
                this.stopPropagation(evt);
            }
        };

        panAndZoomSupport.prototype.onKeyUp = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (e && !e.ctrlKey && this.isCtrlDown) {
                this.isCtrlDown = false;
                if (this.isZooming) {
                    this.isZooming = false;
					if (this.currentSymbolNameOrId != null) {
                        webGraphicsApi.endZooming(this.currentSymbolNameOrId);
					}
                }

                this.releaseCheckedSymbol();
            }
        };

        panAndZoomSupport.prototype.onMouseWheel = function (e) {
			this.checkSymbol(e);
			
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (evt) {
                if (evt.ctrlKey) {
                    var level = 1000;
                    if (e.type && e.type.toLowerCase() != "mousewheel")
                        level = 30;

                    var deltaLevel = (evt.deltaY || evt.wheelDelta * -1) / level * -1;
                    this.doZooming(deltaLevel, evt.fixedClientX != null ? evt.fixedClientX : evt.clientX, evt.fixedClientY != null ? evt.fixedClientY : evt.clientY);

                    // prevent event to browser zooming
                    ////this.stopPropagation(evt, true);
                    this.stopPropagation(evt);
                }
            }
        };

        panAndZoomSupport.prototype.onMouseDown = function (e) {
			this.checkSymbol(e);
			
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (evt && evt.buttons > 0 && evt.button == 1) {
                this.isMouseCenterDownTriggerred = true;
                this.mouseDownPoint = { x: evt.clientX, y: evt.clientY };
            }
        };

        panAndZoomSupport.prototype.onMouseUp = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (evt && (evt.buttons <= 0 || (evt.buttons > 0 && evt.button == 1))) {
                this.isMouseCenterDownTriggerred = false;
                if (this.currentSymbolNameOrId != null) {
                    webGraphicsApi.endPanning(this.currentSymbolNameOrId);
				}
                if (this.onPanEnd) {
                    this.onPanEnd();
                    this.isPan = false;
                }
                this.releaseCheckedSymbol();
            }
        };

        panAndZoomSupport.prototype.onMouseMove = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (evt && evt.buttons > 0) {
                if (this.isMouseCenterDownTriggerred) {
                    var deltaX = evt.clientX - this.mouseDownPoint.x;
                    var deltaY = evt.clientY - this.mouseDownPoint.y;
                    if (this.currentSymbolNameOrId != null)
                        webGraphicsApi.startPanning(this.currentSymbolNameOrId, deltaX, deltaY, this.mouseDownPoint.x, this.mouseDownPoint.y);
                    if (this.onPanStart && !this.isPan) {
                        this.onPanStart();
                        this.isPan = true;
                    }
                }
            }
        };

        panAndZoomSupport.prototype.onDoubleClick = function (e) {
            this.onDoubleTap(e);
        };

        // touch support
        panAndZoomSupport.prototype.onTouchStart = function (e) {
			this.checkSymbol(e);
			
			var evt = e && e.originalEvent ? e.originalEvent : e;
			if (evt.path != null && evt.path.length > 0 && typeof evt.path[0].className == "string" && evt.path[0].className.indexOf('misc-gui-') >= 0)  // if event from gui popup such as input dialog, will ignore current event.
			    return;

			this.changeDomTouch(evt, true);

            var touches = this.getTouchPoints(evt);
            if (evt && touches && !evt.isHandledByAnimation) {
                var curZoomLevel = this.currentSymbolNameOrId != null ? webGraphicsApi.getZoomLevel(this.currentSymbolNameOrId) : 1;
                if ((curZoomLevel > 1 && touches.length == 1)// one finger start paning
                    || touches.length > 1) { // multi-touch
                    var canDoubleTap = this.touchInfo == null;
                    this.touchInfo = this.touchInfo || {};
                    this.touchInfo.startZoomLevel = curZoomLevel;

                    if (touches.length > 1) { // multi-touch. Zooming
                        if (this.touchInfo.startPoints == null || this.touchInfo.startPoints.length < 2) {
                            this.touchInfo.startPoints = null;
                            this.touchInfo.startPoints = [this.getTouchPoint(touches[0]), this.getTouchPoint(touches[1])];
                            this.touchInfo.origin = this.touchGetOrigin(this.touchInfo.startPoints);
                            // prevent event to browser zooming
                            this.stopPropagation(evt);
                        }
                    }
                    else { // single touch. For paning
                        if (this.touchDownActive && canDoubleTap) { // double tap
                            this.isTouchDoubleTap = true;
                        }

                        this.touchInfo.startPoints = this.touchInfo.startPoints || [this.getTouchPoint(touches[0])];
                    }

                    // prevent event to browser zooming
                    //this.stopPropagation(evt);
                }
            }
        };

        panAndZoomSupport.prototype.onTouchEnd = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;

            this.changeDomTouch(evt, false);

            var executed = false;
            var touches = this.getTouchPoints(evt);
            if (evt && this.touchInfo && !evt.isHandledByAnimation) {
                if (this.touchInfo.startPoints.length > 1 && (touches == null || touches.length < 2)) { // zooming
                    this.isZooming = false;
                    if (this.currentSymbolNameOrId != null) {
                        webGraphicsApi.endZooming(this.currentSymbolNameOrId);
					}
                    if (this.isTouchPanning) {
                        this.isTouchPanning = null;
                        if (this.currentSymbolNameOrId != null) {
                            webGraphicsApi.endPanning(this.currentSymbolNameOrId);
						}
                    }

                    this.touchInfo = null;
                    executed = true;
                }
                else if (this.touchInfo.startPoints.length == 1 && (touches == null || touches.length < 1)) {
                    if (this.isTouchPanning) {
                        if (this.currentSymbolNameOrId != null) {
                            webGraphicsApi.endPanning(this.currentSymbolNameOrId);
						}
                        executed = true;
                        this.isTouchPanning = null;
                    }
                    else {
                        // start double-tap timeout
                        this.touchDownActive = true;
                        var self = this;
                        this.touchDownActiveTimeout = setTimeout(function () {
                            self.touchDownActive = null;
                        }, 350);
                    }
                }

                this.touchInfo = null;
            }
            if (evt && (touches == null || touches.length < 1) && this.isTouchDoubleTap) {
                if (this.touchDownActiveTimeout) {
                    clearTimeout(this.touchDownActiveTimeout);
                    this.touchDownActiveTimeout = null;
                }
                this.touchDownActive = null;
                this.isTouchDoubleTap = null;
                // double tap triggerred.
                this.onDoubleTap(e);
                executed = true;
            }

            if (executed) {
                this.touchInfo = null;

                // prevent event to browser zooming
                this.stopPropagation(evt);
            }

            this.releaseCheckedSymbol();
        };

        panAndZoomSupport.prototype.onTouchMove = function (e, isPassive) {
            var evt = e && e.originalEvent ? e.originalEvent : e;

            if (isPassive != null) {
                if (evt.isHandledByAnimation) {
                    // prevent event to browser zooming
                    if (!isPassive && evt.preventDefault)
                        try {
                            evt.preventDefault();
                        } catch (e) {
                            console.log(e);
                        }

                    if (evt.stopPropagation)
                        evt.stopPropagation();

                    var u = navigator.userAgent;
                    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                    if (evt.stopImmediatePropagation && !isiOS) {
                        evt.stopImmediatePropagation();
                    }

                    evt.returnValue = false;
                }
                // this.stopPropagation(evt, isPassive);
                return;
            }

            var executed = false;
            var touches = this.getTouchPoints(evt);
            if (evt && touches && touches.length > 0 && this.touchInfo && !evt.isHandledByAnimation) {
                var curLevel = this.currentSymbolNameOrId != null ? webGraphicsApi.getZoomLevel(this.currentSymbolNameOrId) : 1;

                if (this.touchInfo.startPoints && this.touchInfo.startPoints.length > 1 && touches.length > 1) { // Multi-Touch. Zooming
                    var curTouchPoints = [this.getTouchPoint(touches[0]), this.getTouchPoint(touches[1])];
                    var curOrigin = this.touchGetOrigin(curTouchPoints);

                    var targetLevel = this.getTouchScale(this.touchInfo.startPoints, curTouchPoints);
                    targetLevel *= this.touchInfo.startZoomLevel;
                    var deltaLevel = targetLevel - curLevel;
                    this.doZooming(deltaLevel, this.touchInfo.origin.x, this.touchInfo.origin.y, curOrigin.x - this.touchInfo.origin.x, curOrigin.y - this.touchInfo.origin.y);

                    executed = true;
                }
                else if (this.touchInfo.startPoints && this.touchInfo.startPoints.length == 1 && touches.length == 1 && curLevel > 1) { // Single-touch. Pan
                    this.doPanning(touches[0].clientX, touches[0].clientY, this.touchInfo.startPoints[0].x, this.touchInfo.startPoints[0].y);
                    executed = true;
                }

                /*
                if(executed){
                    // prevent event to browser zooming
                    this.stopPropagation(evt);
                }*/
            }
            // prevent event to browser zooming
            if (executed) {
                // Touch move will trigger browser collapse or other behavior. So always prevent touch move propergate to window/browser.
                this.stopPropagation(evt);
            }
        };

        panAndZoomSupport.prototype.onPointerOverOrOut = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            //// call get points to set point out marker.
            this.getTouchPoints(evt);
        };

        // supporting methods
        panAndZoomSupport.prototype.doZooming = function (deltaZoomLevel, refPointX, refPointY, offsetX, offsetY) {
            var scaleLevel = this.currentSymbolNameOrId != null ? webGraphicsApi.getZoomLevel(this.currentSymbolNameOrId) : 1;
            scaleLevel += deltaZoomLevel;

            if (scaleLevel > 5) {
                scaleLevel = 5;
            }
            else if (scaleLevel < 1) {
                scaleLevel = 1;
            }

            this.isZooming = true;

            if (this.currentSymbolNameOrId != null)
                // clientX/clientY are the mouse point related to browser viewer top-left point.
                webGraphicsApi.startZooming(this.currentSymbolNameOrId, scaleLevel, refPointX, refPointY, offsetX, offsetY);
        };

        panAndZoomSupport.prototype.doPanning = function (curPointX, curPointY, refPointX, refPointY) {
            var startX = refPointX;
            var startY = refPointY;
            var deltaX = curPointX - startX;
            var deltaY = curPointY - startY;
            if (Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1) {
                if (this.currentSymbolNameOrId != null)
                    webGraphicsApi.startPanning(this.currentSymbolNameOrId, deltaX, deltaY, startX, startY);
                this.isTouchPanning = true;
            }
        };

        panAndZoomSupport.prototype.onDoubleTap = function (e) {
            var evt = e && e.originalEvent ? e.originalEvent : e;
            if (evt) {
                // after trigger end zooming, and if current zoom level < 1, will set zoom level as 1
                var scaleLevel = 1;
                if (this.currentSymbolNameOrId != null) {
                    webGraphicsApi.startZooming(this.currentSymbolNameOrId, scaleLevel, evt.clientX, evt.clientY);
                    webGraphicsApi.endZooming(this.currentSymbolNameOrId);
					this.releaseCheckedSymbol();
                }
                // prevent event to browser zooming
                this.stopPropagation(evt);
            }
        };

        panAndZoomSupport.prototype.stopPropagation = function (evt, ignorePreventDefault) {
            // prevent event to browser zooming
            if (!ignorePreventDefault && evt.preventDefault)
				try {
					evt.preventDefault();
				} catch (e) {
					console.log(e);
				}

            if (evt.stopPropagation)
                evt.stopPropagation();

            if (evt.stopImmediatePropagation)
                evt.stopImmediatePropagation();

            evt.returnValue = false;
        };

        // touch supporting
        panAndZoomSupport.prototype.getTouchPoints = function (e) {
            var points = [];

            var formatPoints = this.getFormatedTouchPoints(e);
            this.pointerPoints = this.pointerPoints || [];

            for (var i = 0; i < formatPoints.length; i++) {
                var evt = formatPoints[i];
                var pId = evt.actualPointerId;
                var typeName = evt.type.toLowerCase();
                if ((typeName.indexOf("down") >= 0 || typeName.indexOf("start") >= 0)) {
                    // filter out remaining point who: id not the same; and point out marker not set. If marker has been set, will be removed.
                    this.pointerPoints = this.pointerPoints.filter(function (p) { return (pId == null || pId != p.actualPointerId) && p.pointerId != evt.pointerId && p.isSetPointOut == null; });
                    this.pointerPoints.push({
                        actualPointerId: pId,
                        pointerId: evt.pointerId,
                        clientX: evt.clientX,
                        clientY: evt.clientY,
                        screenX: evt.screenX,
                        screenY: evt.screenY
                    });
                }
                else if (typeName.indexOf("move") >= 0) {
                    for (var i = 0; i < this.pointerPoints.length; i++) {
                        if (this.pointerPoints[i].pointerId == evt.pointerId || (pId != null && pId == this.pointerPoints[i].actualPointerId)) {
                            if (this.pointerPoints[i].isSetPointOut == null) { // if current point out then in, will trigger move event. In this case, remove the marker.
                                this.pointerPoints[i].clientX = evt.clientX;
                                this.pointerPoints[i].clientY = evt.clientY;
                                this.pointerPoints[i].screenX = evt.screenX;
                                this.pointerPoints[i].screenY = evt.screenY;
                            }

                            break;
                        }
                    }
                }
                else if (typeName.indexOf("up") >= 0 || typeName.indexOf("end") >= 0) {
                    // filter out remaining point who: id not the same; and point out marker not set. If marker has been set, will be removed.
                    this.pointerPoints = this.pointerPoints.filter(function (p) { return (pId == null || pId != p.actualPointerId) && p.pointerId != evt.pointerId && p.isSetPointOut == null; });
                }
                else if (typeName.indexOf("out") >= 0 || typeName.indexOf("leave") >= 0) {
                    for (var i = 0; i < this.pointerPoints.length; i++) {
                        if (this.pointerPoints[i].pointerId == evt.pointerId) {
                            this.pointerPoints[i].isSetPointOut = true;
                        }
                    }
                }
                else if (typeName.indexOf("over") >= 0 || typeName.indexOf("enter") >= 0) {
                    for (var i = 0; i < this.pointerPoints.length; i++) {
                        if (this.pointerPoints[i].pointerId == evt.pointerId && this.pointerPoints[i].isSetPointOut) {
                            this.pointerPoints[i].isSetPointOut = null;
                        }
                    }
                }
                else if (typeName.indexOf("cancel") >= 0) {
                    this.pointerPoints = [];
                }
            }

            return this.pointerPoints;
        };

        panAndZoomSupport.prototype.getFormatedTouchPoints = function (evt) {
            var result = [];
            var isTouchEnd = false;
            if (evt.type.toLowerCase().indexOf("end") >= 0 && evt.changedTouches != null) {
                isTouchEnd = true;
                // on touch end.
                for (var i = 0; i < evt.changedTouches.length; i++) {
                    var e = evt.changedTouches[i];
                    var id = evt.widgetId != null ? 'SubWindow_' + evt.widgetId + '_' : 'MainWindow_';
                    id += (e.identifier != null ? e.identifier : i).toString();
                    result.push({ pointerId: id, type: evt.type, clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY });
                }
            }

            if (evt.fixedTouches) {
                for (var i = 0; i < evt.fixedTouches.length; i++) {
                    var e = evt.fixedTouches[i];
                    result.push({ pointerId: 'SubWindow_' + evt.widgetId + '_' + e.identifier.toString(), type: isTouchEnd ? "" : evt.type, clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY });
                }
            }
            else if (evt.touches) {
                for (var i = 0; i < evt.touches.length; i++) {
                    var e = evt.touches[i];
                    result.push({ pointerId: 'MainWindow_' + e.identifier.toString(), type: isTouchEnd ? "" : evt.type, clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY });
                }
            }
            else if (evt.pointerId != null && evt.pointerType != null && evt.pointerType.toLowerCase().indexOf("mouse") < 0) {
                if (evt.fixedClientX != null && evt.fixedClientY != null && evt.widgetId != null) {  //// from custom widgets
                    result.push({ actualPointerId: evt.pointerId, pointerId: 'SubWindow_' + evt.widgetId + '_' + evt.pointerId.toString(), type: evt.type, clientX: evt.fixedClientX, clientY: evt.fixedClientY, screenX: evt.screenX, screenY: evt.screenY });
                }
                else  //// from Main window
                    result.push({ actualPointerId: evt.pointerId, pointerId: 'MainWindow_Pointer_' + evt.pointerId.toString(), type: evt.type, clientX: evt.clientX, clientY: evt.clientY, screenX: evt.screenX, screenY: evt.screenY });
            }

            return result;
        };

        panAndZoomSupport.prototype.getTouchPoint = function (eventPoint) {
            return {
                x: eventPoint.clientX,
                y: eventPoint.clientY
            };
        };

        panAndZoomSupport.prototype.touchGetOrigin = function (startPointsArr) {
            return {
                x: (startPointsArr[0].x + startPointsArr[1].x) / 2,
                y: (startPointsArr[0].y + startPointsArr[1].y) / 2
            };
        };

        panAndZoomSupport.prototype.getTouchScale = function (startPointsArr, endPointsArr) {
            var startDist = this.getTouchDistance(startPointsArr[0], startPointsArr[1]);
            var endDist = this.getTouchDistance(endPointsArr[0], endPointsArr[1]);
            if (startDist > 0 && endDist > 0)
                return endDist / startDist;

            return 1;
        };

        panAndZoomSupport.prototype.getTouchDistance = function (point1, point2) {
            return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
        };

        panAndZoomSupport.prototype.changeDomTouch = function (evt, isEnable) {
            /*
            if (!evt.isHandledByAnimation) {  //// Only process if touch event NOT handled by animation.
                var screens = webGraphicsApi.getScreensByNameOrId(this.currentSymbolNameOrId);
                if (screens == null || screens.length <= 0) return;
                for (var i = 0; i < screens.length; i++) {
                    var screen = screens[i];
                    if (isEnable) {
                        if (screen.domNode.classList.contains("ma_disable_native_touch"))
                            screen.domNode.classList.remove("ma_disable_native_touch");
                    }
                    else {
                        if (!screen.domNode.classList.contains("ma_disable_native_touch"))
                            screen.domNode.classList.add("ma_disable_native_touch");
                    }
                }
            }
            */
        };

        return panAndZoomSupport;
    })();
    window.panAndZoomSupport = new panAndZoomSupport();
    //}
}