export async function getUsers(){
    try {
        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getUsers',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición para obtener los usuarios');
        }

        const responseData = await response.json();
        console.log(responseData); 
        return responseData;

    } catch(error){
        console.log("Error en el proceso para obtener los usuarios: ", error);
    }
}