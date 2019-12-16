(function () {
    // Get the proxy to interact with the SMA side
    var _proxy = window.SmaCustomWidget.proxy, _inputObj = null;

    
    // This function will be called after the SMA load all the 
    // dependencies AND the _proxy.ready variable has it value as true
    this._prepare = function () {
        // Set the size area of the keyboard widget
        _proxy.host.widget.setSize({ "w": 450, "h": 40 });

        // The keyboard has a property named Presentation, here we subscrib to
        // receive a message when it values change. It will happen just once at the 
        // creation of the virtual keyboard.
        _proxy.on("Presentation", this._onPresentationChange, this);


        document.getElementById("bntOk").onclick = this.onAccept;
        document.getElementById("bntCancel").onclick = this.onCancel;
    };

    this.onAccept = function (value) {
        // Write the value into the tag, the property name is always Tag,
        // there is no way to know the tag name. Use this statement as it is,
        // you just have to change the value.
        _proxy.set({ "propName": "Tag", "value": _inputObj.value });        

        // Close the virtual keyboard and send the value to the server.
        // The value will be write just after this statement.
        _proxy.host.widget.destroy();

    }.bind(this);

    this.onCancel = function (e, keyboard, el) {       

        // Close the virtual keyboard.
        _proxy.host.widget.destroy();
    }.bind(this);    

    this._onPresentationChange = function (data) {
        /**
        * data.value
        * For this widget we are using a presentation object as the value.
        * {
            "screenId": Int,
            "type": "'AlphaNumeric'|'EnhKeypad'|'Keypad'", // Or any value set in the second parameter of the Keypad function.
            "show":"0|1",            
            "password":"0|1",            
            "minMax": "0|1",
            "multiLine": "0|1",
            "hint": "String | Undefined"
        * }
        */

        var presentation = data.value;

        _inputObj = document.getElementById("simple");


        // We must to set it otherwhise it won't work properly
        _proxy.host.screenId = presentation.screenId;

        _inputObj.value = "";               
        
    };



    // Subscribe to receive a message when the keyboard widget is ready.
    _proxy.addOnLoad(this._prepare, this);

    // Let the SMA knows that you are ready to receive the messages.
    _proxy.ready = true;
}());