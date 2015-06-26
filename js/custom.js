// Modified from: http://jsfiddle.net/jhfrench/mc4Qd/
$('.expandcollapse').click(function() {

    var newstate = $(this).attr('state') ^ 1,
        icon = newstate ? "minus" : "plus";

    // if state=0, show all the accordion divs within the same block (in this case, within the same section)
    if ( $(this).attr('state')==="0" ) {
        $(this).parent().find('div.accordion-body:not(.in)').collapse('show');
        $(this).parent().find('.expandcollapse').html("<i class=\"icon-" + icon + "-sign\"></i>").attr('state', newstate);
    }
    // otherwise, collapse all the divs
    else {
        $(this).parent().find('div.accordion-body.in').collapse('hide');
        $(this).parent().find('.expandcollapse').html("<i class=\"icon-" + icon + "-sign\"></i>").attr('state', newstate);
    }

    $(this).html("<i class=\"icon-" + icon + "-sign\"></i>");

    $(this).attr('state',newstate)

});
