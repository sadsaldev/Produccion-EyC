export async function deleteUser(userID){
    try {
        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                action: 'deleteUser',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición para eliminar el usuario');
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;

    } catch(error){
        console.log("Error en el proceso para eliminar el usuario: ", error);
    }
}