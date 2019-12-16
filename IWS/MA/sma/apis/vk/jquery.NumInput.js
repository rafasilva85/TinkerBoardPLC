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
        vkb: null,
        CurrentValue:"",
        text: "",
        Min: "",
        Max:""
    };

    $.fn.NumInput = function (options) {
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
        //wrap.html('<table class="table table-bordered table-hover table-striped table-nowrap table-sort">' +
        //    '<colgroup><col style="width:30%;"/><col style="width:70%;"/></<colgroup>' +
        //     '<tbody>' +
        //    '<tr><td>Current Value：</td><td><input name="txtCurrentValue" disabled="disabled" type="Textbox" value=""/></td></tr>' +
        //    '<tr><td>Minimun Value：</td><td><input name="txtMin" disabled="disabled" type="Textbox" value=""/></td></tr>' +
        //    '<tr><td>Manimun Value：</td><td><input name="txtMax" disabled="disabled" type="Textbox" value=""/></td></tr>' +
        //    '<tr><td>New Value ：<td><textarea id="txtKeyBorad" style="width: 200px;"></textarea></td></tr>' +
        //    '</tbody></table>' +
        //    '<div id="keyboard"></div>' +
        //    '<div class="buttons"><input type="button" name="btnSure" value="OK"/><input type="button" name="btnCancel" value="Cancel"/>'+
        //    '<input type="button" name="btnclear" value="clear"/></div>');
        wrap.html('<textarea id="txtKeyBorad" style="width:186px;"></textarea>' +
           '<div id="keyboard"></div>' +
           '<div class="buttons"><input type="button" name="btnSure" value="OK"/><input type="button" name="btnCancel" value="Cancel"/>' +
           '<input type="button" name="btnclear" value="clear"/></div>');
        CreateNumInput(options);
        InitNumInput(options);
    };
    function CreateNumInput(options) {
        if (!options.vkb) {
            options.vkb = new VNumpad("keyboard",     // container's id
                              keyb_callback, // reference to the callback function
                              "",           // font name ("" == system default)
                              "30px",       // font size in px
                              "#000",       // font color
                              "#FFF",       // keyboard base background color
                              "#FFF",       // keys' background color
                              "#777",       // border color
                              true,         // show key flash on click? (false by default)
                              "#CC3300",    // font color for flash event
                              "#FF9966",    // key background color for flash event
                              "#CC3300",    // key border color for flash event
                              true,        // embed VNumpad into the page?
                              true);        // use 1-pixel gap between the keys?
        }
        options.vkb.Show(options.opened);
        $("#txtKeyBorad").focus();
    }
    function InitNumInput(options)
    {
        //console.log(options);
        //if (options.CurrentValue != "") {
        //    $(".table input[name='txtCurrentValue']").val(options.CurrentValue);
        //}
        //if (options.Min != "") {
        //    $(".table input[name='txtMin']").val(options.Min);
        //}
       
        //if (options.Max != "") {
        //    $(".table input[name='txtMax']").val(options.Max);
        //}
    }
    function keyb_callback(ch) {
        var val = $("#txtKeyBorad").val();
        switch (ch) {
            case "←":
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