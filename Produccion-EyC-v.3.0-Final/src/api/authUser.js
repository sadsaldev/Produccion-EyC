import { setCookie, deleteCookie } from "../helpers/cookiesHandler";

export async function loginUser(cedula, password){
    try {
        const hashedPassword = sha256(password);

        const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cedula, 
                password: hashedPassword,
                action: 'loginUser',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición de inicio de sesión.');
        }

        const responseData = await response.json();
        console.log(responseData); 
        return responseData;
        
    } catch (error){
        console.error('Error en el proceso de inicio de sesión:', error);
        return false;
    }
}

export async function logoutUser(){
    try {
        const response = await fetch('http://localhost:5000/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'logOutUser',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error en la petición de cierre de sesión.');
        }
        const responseData = await response.json();
        console.log(responseData); 
        return responseData;

    } catch (error){
        console.error('Error en el proceso de cierre de sesión:', error);
        return false;
    }
}

export async function checkSession() {
    try {
        const response = await fetch('http://localhost:5000/api/user/checksession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',   
            }, 
            body: JSON.stringify({
                action: 'checkSession',
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('Error al verificar la sesión.');
        }

        const responseData = await response.json();

        if (responseData.session_active) {
            const { session_token, session_id, session_userid, session_role, session_username, session_pass } = responseData;

            const user = {
                sessionToken: session_token,
                sessionID: session_id,
                userID: session_userid,
                userRole: session_role,
                userName: session_username,
                userPass: session_pass
            };

            console.log('Session Active:', user);

            setCookie('session_token', session_token, 1);
            sessionStorage.setItem('sessionActive', 'true');
            sessionStorage.setItem('sessionToken', session_token);

            return user;  // Retorna el usuario actualizado
        } else {
            deleteCookie('session_token');
            sessionStorage.removeItem('sessionActive');
            sessionStorage.removeItem('sessionToken');

            localStorage.removeItem('formData');

            return null;
        }

    } catch (error){
        console.error('Error al verificar la sesión:', error);
        return null;
    }
}