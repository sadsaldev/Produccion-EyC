export function accordionToggle(){
    $(document).off('click', '.accordion-button').on('click', '.accordion-button', function() {
        let panelId = $(this).attr('data-bs-target');
        let panel = $(panelId);
      
        if (panel.is(':visible')) {
            panel.hide();
            $(this).addClass('collapsed').attr('aria-expanded', 'false');
        } else {
            panel.show();
            $(this).removeClass('collapsed').attr('aria-expanded', 'true');
        }
    });
}