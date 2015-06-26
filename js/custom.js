// Modified from: http://jsfiddle.net/jhfrench/mc4Qd/
$('.expandcollapse').click(function() {

    var newstate = $(this).attr('state') ^ 1,
        icon = newstate ? "minus" : "plus";

    // if state=0, show all the accordion divs within the same block (in this case, within the same section)
    if ( $(this).attr('state')==="0" ) {
        $(this).parent().find('div.panel-collapse:not(.in)').collapse('show');
        $(this).parent().find('.expandcollapse').html("<i class=\"fa fa-" + icon + "\"></i>").attr('state', newstate);
    }
    // otherwise, collapse all the divs
    else {
        $(this).parent().find('div.panel-collapse.in').collapse('hide');
        $(this).parent().find('.expandcollapse').html("<i class=\"fa fa-" + icon + "\"></i>").attr('state', newstate);
    }

    $(this).html("<i class=\"fa fa-" + icon + "\"></i>");

    $(this).attr('state',newstate)

});
