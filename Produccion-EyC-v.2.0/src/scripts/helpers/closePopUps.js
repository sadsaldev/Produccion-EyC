export function closePopUps() {
    $(document).off('click', '#pop-ups-index').on('click', '#pop-ups-index', function(e){
        $('.left-page-info').hide();
    });
}