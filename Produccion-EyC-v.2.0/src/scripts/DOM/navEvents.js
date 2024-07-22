import { ajaxLogin } from "../services/ajaxLoginForm";
import { ajaxSignUp } from "../services/ajaxSignUpForm";
import { ajaxProfileMenu } from "../services/ajaxProfileMenu";
import { ajaxQueriesPopUp } from "../services/ajaxQueriesPopUp";
import { ajaxBIboardIndex } from "../services/ajaxBIboardIndex";
import { showBackground, hideBackground } from "../helpers/backgroundHandler";
import { globalState } from "../helpers/global";
import { indexCase } from "./indexCase";
import { changeSection } from "../queries/helpers/changeSection";

export function navEvents() {
    let pageTitle = "";

    addActiveClassToNavbars('index-link');

    $(document).off('click', '.navelement').on('click', '.navelement', async function (e) {
        e.preventDefault();

        globalState.previousState = {
            sectionId: localStorage.getItem('activeSection'),
            pageTitle: document.title.split(' | ')[1],
            activeElement: $('.navelement.active')
        };

        $('.navelement').removeClass('active');

        let sectionId = $(this).attr('id');
        addActiveClassToNavbars(sectionId);

        if (sectionId === "index-link") {
            $('.page-title-navbar').hide();
        } else {
            $('.page-title-navbar').show();
        }

        switch (sectionId) {
            case 'index-link':
                pageTitle = "Inicio";
                await hideBackground('#blur-background-2');
                indexCase();
                changeSection(null);
                globalState.isInSubsection = false;
                localStorage.setItem('isInSubsection', false);
                break;

            case 'login-link':
                pageTitle = "Ingresar";
                await hideBackground('#blur-background-2');
                ajaxLogin();
                changeSection(null);
                globalState.isInSubsection = false;
                localStorage.setItem('isInSubsection', false);
                break;

            case 'signup-link':
                pageTitle = "Registrarse";
                await hideBackground('#blur-background-2');
                ajaxSignUp();
                changeSection(null);
                globalState.isInSubsection = false;
                localStorage.setItem('isInSubsection', false);
                break;

            case 'biboard-link':
                pageTitle = "Tablero BI";
                await hideBackground('#blur-background-2');
                ajaxBIboardIndex();
                changeSection(null);
                globalState.isInSubsection = false;
                localStorage.setItem('isInSubsection', false);
                break;

            case 'queries-link':
                pageTitle = "Consultas";
                await hideBackground('#blur-background-2');
                ajaxQueriesPopUp();
                changeSection(null);
                break;

            case 'profile-link':
                pageTitle = "Perfil";
                globalState.isInSubsection = false;
                localStorage.setItem('isInSubsection', false);
                if (globalState.user) {
                    await hideBackground('#blur-background-2');
                    ajaxProfileMenu();
                    changeSection(null);
                } else {
                    window.alert("No hay una sesión activa.");
                    return;
                }
                break;
            default:
                break;
        }

        document.title = "Producción E&C | " + pageTitle;
        localStorage.setItem('activeSection', sectionId);

        // Restaurar el estado del menú
        globalState.isNavbarVisible = false;
    });

    $(document).off('click', '.logo').on('click', '.logo', function(e) {
        $('.navelement#index-link').click();
    });

    // Establecer sección de Inicio por defecto al cargar la página
    $('.navelement#index-link').click();
}

function addActiveClassToNavbars(sectionId){
    $(`.flex-navbar-menu .navelement#${sectionId}`).addClass('active');
    $(`.navbar-menu .navelement#${sectionId}`).addClass('active');
}