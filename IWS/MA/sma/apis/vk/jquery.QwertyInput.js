/*!
 * jquery.Qwerty.js  Felix Wang
 * 
 * 2016/03/24
 **/
(function ($) {
    var defaults = {
        CallBackOnSumbit: null,
        CallBackOnCancel: null,
        opened: true,//default is show
        vkb:null,
        text:null
    };

    $.fn.QwertyInput = function (options) {
        return this.each(function () {
            options = $.extend({}, defaults,options); // set options
            var wrap = $(this);
            wrap.on('click', 'input[name="btnSure"]', function () {
                options.text = $("#txtKeyBorad").val();
                if (typeof (options.CallBackOnSumbit) == 'function') options.CallBackOnSumbit(options.text);
            });
            wrap.on('click', 'input[name="btnCancel"]', function () {
                options.text = "";
                $("#txtKeyBorad").val("");
                if (options.vkb) {
                    options.vkb.Show(false);
                }
                if (typeof (options.CallBackOnCancel) == 'function') options.CallBackOnCancel(options.text);
            });
            wrap.on('click', 'input[name="btnclear"]', function () {
                options.text = "";
                $("#txtKeyBorad").val("");
            });
            renderUI(wrap, options);
        });
    };
    function renderUI(wrap, options) {
        wrap.html('<div><textarea id="txtKeyBorad" style="width: 500px;"></textarea></div><div id="keyboard"></div>' +
            '<div class="buttons"><input type="button" name="btnSure" value="OK"/><input type="button" name="btnCancel" value="Cancel"/>'+
            '<input type="button" name="btnclear" value="clear"/></div>');
        CreateQwertyInput(options);
        InitQwertyInput(options);
    };
    function InitQwertyInput(options) {
        
    }
    function CreateQwertyInput(options) {
        if (!options.vkb) {
            options.vkb = new VKeyboard("keyboard",    // container's id
                              keyb_callback, // reference to the callback function
                              false,          // create the arrow keys or not? (this and the following params are optional)
                              false,          // create up and down arrow keys? 
                              true,         // reserved
                              false,          // create the numpad or not?
                              "",            // font name ("" == system default)
                              "18px",        // font size in px
                              "#000",        // font color
                              "#F00",        // font color for the dead keys
                              "#FFF",        // keyboard base background color
                              "#FFF",        // keys' background color
                              "#DDD",        // background color of switched/selected item
                              "#777",        // border color
                              "#CCC",        // border/font color of "inactive" key (key with no value/disabled)
                              "#FFF",        // background color of "inactive" key (key with no value/disabled)
                              "#F77",        // border color of the language selector's cell
                              true,          // show key flash on click? (false by default)
                              "#CC3300",     // font color during flash
                              "#FF9966",     // key background color during flash
                              "#CC3300",     // key border color during flash
                              true,         // embed VKeyboard into the page?
                              true,          // use 1-pixel gap between the keys?
                              0);
        }
        options.vkb.Show(options.opened);
        $("#txtKeyBorad").focus();
    }
    function keyb_callback(ch) {
        var val = $("#txtKeyBorad").val();
        switch (ch) {
            case "BackSpace":
                var min = (val.charCodeAt(val.length - 1) == 10) ? 2 : 1;
                $("#txtKeyBorad").val(val.substr(0, val.length - min));
                break;
            case "Enter":
                $("#txtKeyBorad").val($("#txtKeyBorad").val() + "\n");
                break;

            default:
                $("#txtKeyBorad").val($("#txtKeyBorad").val() + ch);
        }
    }
}(jQuery));