export function themeToggle(){
    let darkMode = localStorage.getItem('Page Theme') === 'Dark';
    let currentStylesheet = $('#current-stylesheet');

    async function applyTheme() {
        let newSrcImg = darkMode ? '../public/assets/img/dark-mode-blue.svg' : '../public/assets/img/light-mode-blue.svg';
        let newSrcStyle = darkMode ? '../public/assets/css/style-dark.css' : '../public/assets/css/style-light.css';
        
        $('.switch-theme-img').attr('src', newSrcImg);
        $('.switch-theme-img').attr('alt', darkMode ? 'Modo Oscuro' : 'Modo Claro');
        $('.switch-theme-img').attr('title', darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');

        if (darkMode) {
            localStorage.setItem('Page Theme', 'Dark');
        } else {
            localStorage.setItem('Page Theme', 'Light');
        }

        return new Promise((resolve) => {
            let newStylesheet = $('<link>', {
                rel: 'stylesheet',
                href: newSrcStyle,
                id: 'new-stylesheet' //ID temporal para la nueva hoja de estilos
            }).appendTo('head');

            newStylesheet.on('load', () => {
                currentStylesheet.remove(); //Eliminar la hoja de estilos anterior
                newStylesheet.attr('id', 'current-stylesheet'); //Cambiar el ID de la nueva hoja de estilos
                currentStylesheet = newStylesheet; //Actualizar referencia a la hoja de estilos actual
                resolve();
            });
        });
    }

    async function switchTheme(){
        darkMode = !darkMode;
        await applyTheme();
        //Se utiliza await al llamar a applyTheme para esperar que se complete antes de mostrar la transición
    }

    $(document).off('click', '.switch-theme').on('click', '.switch-theme', function (e){
        e.preventDefault();
        switchTheme();
    });

    applyTheme();
}