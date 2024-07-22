export function setCookie(name, value, days){
    let expires = "";
    if (days){
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function deleteCookie(name){
    let deletedCookie = getCookie(name);
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(name){
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++){
        let cookie = cookies[i].trim();
        if(cookie.startsWith('session_token=')){
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}
