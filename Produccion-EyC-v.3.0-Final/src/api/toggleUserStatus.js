export async function toggleUserStatus(userID){
    try {
        const response = await fetch('http://localhost:5000/api/admin/toggleuser', {
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