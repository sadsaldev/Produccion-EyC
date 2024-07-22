export async function ajaxToggleUserStatus(userID){
    try {
        let response = await $.ajax({
            url: 'http://localhost:4000/api',
            method: 'POST',
            data: { userID: userID, action: 'toggleUserStatus' },
            xhrFields: {
                withCredentials: true
            },
        });
        
        let fullResponse = JSON.parse(response);

        if (fullResponse.error) {
            console.error('Error al cambiar el estado del usuario: ', fullResponse.error);
            return;
        }

        let responseID = fullResponse.userID;
        let newStatus = fullResponse.newStatus;
        let $button = $('[data-user-id="' + responseID + '"] .toggleUserStatus');

        if (newStatus === 'enabled'){
            $button.find('img').attr('src', 'assets/img/user-disable.svg');
        } else {
            $button.find('img').attr('src', 'assets/img/user-enable.svg');
        }

        let $statusCell = $('.user-status[data-user-id="' + responseID + '"]');
        $statusCell.text(newStatus);
        console.log("Estado del usuario actualizado correctamente.");
    } catch (error){
        console.error('Error al cambiar el estado del usuario: ', error);
    }
}