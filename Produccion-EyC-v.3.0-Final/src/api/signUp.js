export async function signupUser(cedula, fullname, password){
    try {
        const hashedPassword = sha256(password);
        const response = await fetch ('http://localhost:5000/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                fullname: fullname,
                password: hashedPassword,
                action: 'insertUser'
            })
        });

        if(!response.ok){
            throw new Error("Error en la petición de registro de usuario.");
        }

        const responseData = await response.json();
        console.log(responseData); 
        return responseData;
        
    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
    }
}