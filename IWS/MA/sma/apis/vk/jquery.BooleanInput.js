/*!
 * jquery.Boolean.js  Felix Wang
 * 
 * 2016/03/24
 **/
(function ($) {
    //alert("sdddddddd");
    var defaults = {
        CurrentValue: '',
        TrueMessage: 'ON', // Prompt Message Of Ture
        FalseMessage: 'OFF', // Prompt Message Of False
        ClickOnValue: null,
        CancelClick: null
    };

    $.fn.BooleanInput = function (options) {
        return this.each(function () {
            options = $.extend({}, defaults, options); // set options
            var wrap = $(this);
            wrap.on('click', '.boolean_value_true', function () { if (typeof (options.ClickOnValue) == 'function') options.ClickOnValue($(this)); });
            wrap.on('click', '.boolean_value_false', function () { if (typeof (options.ClickOnValue) == 'function') options.ClickOnValue($(this)); });
            wrap.on('click', '.boolean_cancal', function () { if (typeof (options.CancelClick) == 'function') options.CancelClick($(this)); });

            renderUI(wrap, options);
        });
    };

    function renderUI(wrap, options) {
        wrap.html('<div class="booleanKeypadContainer"><div class="boolean_value_true" value="1">True</div><div class="boolean_value_false" value="0">False</div><div class="boolean_cancal">CANCAL</div></div>');
        $('.boolean_value_true', wrap).html(options.TrueMessage);
        $('.boolean_value_false', wrap).html(options.FalseMessage);
    };
    //function ClickOnValue(element) {
    //    //alert(element.attr("value"));
    //    onAccept(null, null, element.attr("value"));
    //};
}(jQuery));