import { globalState } from "../helpers/global";
import { hideBackground, showBackground } from "../helpers/backgroundHandler";
import { adminEvents } from "./adminEvents";

let updatedUsername = "";

export function profileEvents() {
    if (globalState.user) {
        accountSettings();
        if (globalState.user.userRole === "super_user"){
            adminEvents(); 
        } 
    }
}

function accountSettings() {
    $('#profile-content').off('click', '#account-settings').on('click', '#account-settings', async function(e){
        if (globalState.user) {
            e.preventDefault();
            await hideBackground('#profile-content .profile-container');
            $('#profile-content .pop-ups-container').show();
            await showBackground('#profile-content .edit-user-info-container');

            let originalFullname = $('#profile-content #fullname').val();
            let originalPassword = $('#profile-content #password').val();

            cancelChanges();
            editName();
            editPassword();
            saveChanges(originalFullname, originalPassword);
            closeProfileWindows();
        } else {
            window.alert("No hay una sesión iniciada.");
            return;
        }
    });
}

function cancelChanges() {
    $('#profile-content').off('click', '#cancel-profile-changes').on('click', '#cancel-profile-changes', async function(e){
        e.preventDefault();
        await hideBackground('#profile-content .edit-user-info-container');
        $('#profile-content .confirm-pass-cont').hide();
        $('#profile-content .updateUserMessage').hide();
        $('#profile-content .pop-ups-container').hide();
        await showBackground('#profile-content .profile-container');
    });
}

function editName(){
    $('#profile-content').off('click', '#edit-name').on('click', '#edit-name', function(e){
        e.preventDefault();
        $('#profile-content #fullname').prop('readonly', false);
        $('#profile-content .confirm-pass-cont').show();

        $(document).on('input', '#profile-content #fullname', function(e){
            let fullname = $('#profile-content #fullname').val();
            let regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
    
            if(!regex.test(fullname)){
                $('.updateUserMessage').show().html("El nombre no puede contener números ni símbolos especiales.");
                $('#save-profile-changes').prop('disabled', true);
            } else {
                $('#save-profile-changes').prop('disabled', false);
                $('.updateUserMessage').hide();
            }
        });
    });
}

function editPassword(){
    $('#profile-content').off('click', '#edit-password').on('click', '#edit-password', function(e){
        e.preventDefault();

        $('#profile-content #password').prop('readonly', false);
        $('#profile-content .confirm-pass-cont').show();

        $(document).on('input', '#profile-content #password', function(e){
            e.preventDefault();
    
            let password  = $('#profile-content #password').val();
            let passwordLength = password.length;
            let hasUpperCase = /[A-Z]/.test(password);
            let hasNumber =  /\d/.test(password);
            let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
            if(passwordLength < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
                $('.updateUserMessage').show().html('La contraseña debe ser de al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.');
                $('#save-profile-changes').prop('disabled', true);
            } else {
                $('#save-profile-changes').prop('disabled', false);
                $('.updateUserMessage').hide();
            }
        });
    });
}

function saveChanges(originalFullname, originalPassword) {
    $('#profile-content').off('click', '#save-profile-changes').on('click', '#save-profile-changes', async function(e){
        e.preventDefault();

        let fullname = $('#profile-content #fullname').val();
        let newPassword = $('#profile-content #password').val();
        let confirmpassword = $('#profile-content #confirmpassword').val();

        let regexName = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
        let passwordLength = newPassword.length;
        let hasUpperCase = /[A-Z]/.test(newPassword);
        let hasNumber =  /\d/.test(newPassword);
        let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        //verificar si la contraseña ha sido cambiada
        if (newPassword !== originalPassword){

            if (!regexName.test(fullname)){
                $('.updateUserMessage').show().html("El nombre no puede contener números ni símbolos especiales.");
                return;
            }

            if(passwordLength < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
                $('.updateUserMessage').show().html('La contraseña debe ser de al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.');
                return; 
            }

            //verificar si las contraseñas coinciden
            if(newPassword !== confirmpassword){
                //contraseña y confirmación no coinciden
                $('#profile-content .updateUserMessage').show().html('Las contraseñas no coinciden.');
                return;
            }

            //hashear las nuevas contraseñas
            let hashedNewPassword = sha256(newPassword);
            let hashedConfirmPassword = sha256(confirmpassword);

            //verificar si las contraseñas hasheadas coinciden
            if (hashedNewPassword !== hashedConfirmPassword){
                //contraseñas hasheadas no coinciden
                $('#profile-content .updateUserMessage').show().html('Las contraseñas no coinciden.');
                return;
            }

            // let updateData = new FormData();
            // updateData.append('fullname', fullname);
            // updateData.append('password', hashedNewPassword);
            // updateData.append('action', 'updateUser');

            try {
                let response = await $.ajax({
                    type : 'POST', 
                    url : 'http://localhost:4000/api',
                    data : { fullname: fullname,
                             password: hashedNewPassword,
                             action : 'updateUser'},
                    xhrFields: {
                        withCredentials: true
                    },
                });

                console.log(response);
                
                let userData = JSON.parse(response);

                $('#profile-content .updateUserMessage').show().html('Se han actualizado correctamente los datos.');

                $('#profile-content #fullname').val(userData.userfullname);
                $('#profile-content #password').val(userData.userpassword);

                updatedUsername = userData.userfullname;

                $('#profile-content #user-name').text(updatedUsername);
                $('#profile-content #confirmpassword').val('');

            } catch(error) {
                console.error("Error al actualizar los datos: ", error);
            }
        } else {
            //contraseña no ha sido cambiada, actualizar solo el nombre
            if (fullname !== originalFullname){
                if (!regexName.test(fullname)){
                    $('.updateUserMessage').show().html("El nombre no puede contener números ni símbolos especiales.");
                    return;
                }

                let hashedConfirmPassword = sha256(confirmpassword);

                if (newPassword !== hashedConfirmPassword){
                    $('#profile-content .updateUserMessage').show();
                    $('#profile-content .updateUserMessage').html('Las contraseñas no coinciden.');
                    return;
                }

                // let updateData = new FormData();
                // updateData.append('fullname', fullname);
                // updateData.append('password', newPassword);
                // updateData.append('action', 'updateUser');

                try {
                    let response = await $.ajax({
                        type : 'POST',
                        url : 'http://localhost:4000/api',
                        data : { fullname: fullname,
                                 password: newPassword,
                                 action : 'updateUser'},
                        xhrFields: {
                            withCredentials: true
                        },
                    });

                    console.log(response);
                    
                    let userData = JSON.parse(response);

                    $('#profile-content .updateUserMessage').show().html('Se han actualizado correctamente los datos.');

                    //Actualizar elementos de la página con el nuevo valor
                    $('#profile-content #fullname').val(userData.userfullname);
                    $('#profile-content #password').val(userData.userpassword);

                    updatedUsername = userData.userfullname;

                    $('#profile-content #user-name').text(updatedUsername);
                    $('#profile-content #confirmpassword').val('');
                } catch(error) {
                    console.error("Error al actualizar los datos: ", error);
                }
            } else {
                $('#profile-content .updateUserMessage').show().html('No se han realizado cambios.');
            }
        }
    });
}

function closeProfileWindows() {
    $('#profile-content').off('click', '#close-profile-settings').on('click', '#close-profile-settings', async function(e){
        e.preventDefault();
        await hideBackground('#profile-content .edit-user-info-container');
        $('#profile-content .confirm-pass-cont').hide();
        $('#profile-content .updateUserMessage').hide();
        $('#profile-content .pop-ups-container').hide();
        await showBackground('#profile-content .profile-container');
    });
}
