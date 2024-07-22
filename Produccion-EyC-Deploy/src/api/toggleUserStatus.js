export async function toggleUserStatus(userID){
    try {
        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                action: 'toggleUserStatus',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición para cambiar el estado de usuario');
        }
  
        const responseData = await response.json();
        console.log(responseData); 
        return responseData;

    } catch(error){
        console.log("Error en el proceso para cambiar el estado de usuario: ", error);
    }
}