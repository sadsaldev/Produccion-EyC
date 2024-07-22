import { globalState } from "../helpers/global";
import { showBackground, hideBackground } from "../helpers/backgroundHandler";
import { ajaxProfileMenu } from "../services/ajaxProfileMenu";
import { ajaxQueriesPopUp } from "../services/ajaxQueriesPopUp";

export async function restorePreviousState() {
    if (globalState.previousState && globalState.previousState.sectionId) {

        const currentState = {
            sectionId: localStorage.getItem('activeSection'),
            pageTitle: document.title.split(' | ')[1],
            activeElement: $('.navelement.active')
        };

        $('.navelement').removeClass('active');
        $(`#${globalState.previousState.sectionId}`).addClass('active');
        document.title = "Producción E&C | " + globalState.previousState.pageTitle;
        localStorage.setItem('activeSection', globalState.previousState.sectionId);

        console.log(globalState.previousState.pageTitle);
        console.log(globalState.previousState.sectionId);

        switch (globalState.previousState.sectionId){
            case "index-link":
                $('#profile-content').hide();
                await hideBackground('#blur-background');
                break;
            case "login-link":
                $('#profile-content').hide();
                await hideBackground('#blur-background');
                break;
            case "signup-link":
                $('#profile-content').hide();
                await hideBackground('#blur-background');
                break;
            case "biboard-link":
                $('#profile-content').hide();
                await hideBackground('#blur-background');
                break;
            case "queries-link":
                console.log(globalState.isInSubsection);
                if(globalState.isInSubsection){
                    $('#profile-content').hide();
                    await hideBackground('#blur-background');
                } else {
                    await ajaxQueriesPopUp();
                }
                break;
            case "profile-link":
                await ajaxProfileMenu();
                break;
            default:
                break;
        }

        globalState.previousState = currentState;
    }
}