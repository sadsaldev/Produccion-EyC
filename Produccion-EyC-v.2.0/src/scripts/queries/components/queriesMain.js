import { queriesEfective } from "./queriesEfective";
import { queriesNetworks } from "./queriesNetworks";
import { hideBackground, showBackground } from "../../helpers/backgroundHandler";
import { globalState } from "../../helpers/global";

export function queriesMain() {

    $(document).off('click', '#search-inspections').on('click', '#search-inspections', function(e){
        e.preventDefault();
        $('.search-inspec-child-1').toggle();
    });

    $(document).off('click', '#search-efective').on('click', '#search-efective', async function(e){
        if (globalState.user){
            e.preventDefault();

            globalState.isInSubsection = true;
            localStorage.setItem('isInSubsection', true);
            console.log(globalState.isInSubsection);
        
            await hideBackground('#profile-content');
            await hideBackground('#blur-background');
        
            $('.queries-pop-up-container').hide();
            
            $('#left-container').hide();
            $('#right-container').hide();
            $('#bi-index').hide();
        
            await queriesEfective();
        } else {
            window.alert("No hay una sesión activa.");
            return;
        }
       
    });

    $(document).off('click', '#generate-rn').on('click', '#generate-rn', async function(e){
        if (globalState.user){
            e.preventDefault();

            globalState.isInSubsection = true;
            localStorage.setItem('isInSubsection', globalState.isInSubsection);
            console.log(globalState.isInSubsection);
        
            await hideBackground('#profile-content');
            await hideBackground('#blur-background');
        
            $('.queries-pop-up-container').hide();
            $('#left-container').hide();
            $('#right-container').hide();
            $('#bi-index').hide();
        
            queriesNetworks();
        } else {
            window.alert("No hay una sesión activa.");
            return;
        }
      
    });
}