export async function ajaxDeleteUser(userID){
    try {
        let response = await $.ajax({
        url: 'http://localhost:4000/api',
        method: 'POST',
        data: { userID: userID, action: 'deleteUser' },
        xhrFields: {
            withCredentials: true
        },
        });

        let fullResponse = JSON.parse(response);

        if (fullResponse.error){
            console.error("Error al eliminar el usuario: ", fullResponse.error);
            return;
        }

        let responseID = fullResponse.userID;
        $('[data-user-id="' + responseID + '"]').closest('tr').remove();
        console.log("Usuario eliminado correctamente.");
    
    } catch (error) {
        console.error("Error al eliminar el usuario: ", error);
    }
}