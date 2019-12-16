/*!
 * jquery.DateTime.js  Gaven xue
 * 
 * 2016/04/05
 **/
(function ($) {
    var defaults = {
        CallBackOnSumbit: null,
        CallBackOnCancel: null,
        opened: true,//default is show
        vkb: null,
        text: ""
    };

    $.fn.DateTimeInput = function (options) {
        return this.each(function () {
            options = $.extend({}, defaults, options); // set options
            var wrap = $(this);
            wrap.on('click', 'input[name="btnSure"]', function () {
                var date = $('.d-days input').val() + "-" + $('.d-month input').val() + "-" + $('.d-year input').val()
                var time = $('.d-hour input').val() + ":" + $('.d-minute input').val() + ":" + $('.d-seconds input').val();
                options.text = $("#txtKeyBorad").val(date + " " + time).val();
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
            renderUI(wrap, options);
        });
    };
    function renderUI(wrap, options) {
        wrap.html('<input id="txtKeyBorad" style="width:186px;display:none;" type="text" data-field="datetime" data-format="dd-MM-yyyy hh:mm:ss"/>' +
           '<div id="dtBox" style="background: #ccc"></div>' +
           '<div class="buttons"><input type="button" name="btnSure" value="OK"/><input type="button" name="btnCancel" value="Cancel"/>');
        CreateDatetimeInput(options);
    };
    function CreateDatetimeInput(options) {
        var time = new sepDateTime(document.getElementById("dtBox"));
        var date = new Date();
        var year = date.getFullYear();
        var month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth()) + 1;
        var days = ((date.getDate()) < 10) ? "0" + (date.getDate()) : (date.getDate());
        var hours = ((date.getHours() + 1) < 10) ? "0" + (date.getHours() + 1) : (date.getHours()) + 1;
        var minutes = ((date.getMinutes() + 1) < 10) ? "0" + (date.getMinutes() + 1) : (date.getMinutes()) + 1;
        var seconds = ((date.getSeconds() + 1) < 10) ? "0" + (date.getSeconds() + 1) : (date.getSeconds()) + 1;
        var temptime = year + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
        time.setDefaultTime(temptime);
    }
}(jQuery));