$(document).ready(function(){
    $('.accordion-button').click(function(){
        var inspector = $(this).attr('id');
        $('.accordion-collapse').not('#collapse_' + inspector).collapse('hide');
        $('#collapse_' + inspector).collapse('toggle');
    });
});