(function () {
    if (!window.sma)
        window.sma = {};

    window.sma.configSettings = {
        "servicesUrl": "/cgi-bin/WebCGIProc"
    };
    // Temp is for run-time usage only
    // don't set values on temp and expect to have it available.
    // these values will be overwritten in run-time 
    window.sma.temp = {
    };


})();