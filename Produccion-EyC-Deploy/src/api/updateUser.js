export async function updateUserData(fullname, hashedPassword){
    try {
        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname: fullname,
                password: hashedPassword,
                action: 'updateUser'
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición de actualización de datos.');
        }

        const responseData = await response.json();
        console.log(responseData); 
        return responseData;
        
    } catch (error){
        console.log('Error al hacer la solicitud para actualizar el usuario: ', error);
        return false;
    }
}