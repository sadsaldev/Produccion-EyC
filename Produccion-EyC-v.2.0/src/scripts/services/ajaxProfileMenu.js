
import { hideBackground, showBackground } from "../helpers/backgroundHandler";

export async function ajaxProfileMenu(){
    try {
        let html_response = await $.ajax({
            type : 'POST', 
            url : 'http://localhost:4000/api',
            data : {action: 'profileMenu'},
            xhrFields: {
                withCredentials: true
            },
        });

        await hideBackground('#blur-background-2');
        $('#profile-content').html(html_response);
        await showBackground('#blur-background');
        $('#profile-content').show();
      
    } catch (error) {
        console.error('Error al cargar el menú de perfil: ', error);
    }
}
    
