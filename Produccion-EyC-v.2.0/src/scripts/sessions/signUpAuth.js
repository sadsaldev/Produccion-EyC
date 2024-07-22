export function signUpAuth(){

    const regexCedula = /^\d+$/;
    const regexFullname = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;

    $(document).on('input', '.register-container #password', function(e){

        let password  = $(this).val();
        let passwordLength = password.length;
        let hasUpperCase = /[A-Z]/.test(password);
        let hasNumber =  /\d/.test(password);
        let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if(passwordLength < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            $('#signupResult').show().html('La contraseña debe ser de al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.');
            $('#sub-signup').prop('disabled', true);
        } else {
            $('#sub-signup').prop('disabled', false);
            $('#signupResult').hide();
        }
    });

    $(document).on('input', '.register-container #fullname', function(e){
        let fullname = $(this).val();

        if(!regexFullname.test(fullname)){
            $('#signupResult').show().html("El nombre no puede contener números ni símbolos especiales.");
            $('#sub-signup').prop('disabled', true);
        } else {
            $('#sub-signup').prop('disabled', false);
            $('#signupResult').hide();
        }
    });

    $(document).on('input', '.register-container #cedula', function(e){
        let cedula = $(this).val();

        if (!regexCedula.test(cedula)){
            $('#signupResult').show().html("El nombre no puede contener números ni símbolos especiales.");
            $('#sub-signup').prop('disabled', true);
        } else {
            $('#sub-signup').prop('disabled', false);
            $('#signupResult').hide();
        }
    });

    $(document).on('click', '.register-container #sub-signup', async function(e){
        e.preventDefault();

        let cedula = $('.register-container #cedula').val();
        let fullname = $('.register-container #fullname').val();
        let password = $('.register-container #password').val();
        let confirmpassword = $('.register-container #confirmpassword').val();

        if(cedula === '' || fullname === '' || password === '' || confirmpassword === ''){
            $('#signupResult').show().html('Debes completar todos los campos del formulario.');
            return; 
        }

        if(!regexCedula.test(cedula)){
            $('#signupResult').show().html("La cédula solo puede contener números.");
            return;
        }

        if (!regexFullname.test(fullname)) {
            $('#signupResult').show().html("El nombre no puede contener números ni símbolos especiales.");
            return;
        }

        let passwordLength = password.length;
        let hasUpperCase = /[A-Z]/.test(password);
        let hasNumber = /\d/.test(password);
        let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (passwordLength < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            $('#signupResult').show().html('La contraseña debe ser de al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.');
            return; 
        }

        if(password !== confirmpassword){
            $('#signupResult').show().html("Las contraseñas no coinciden.");

            $('.register-container #password').val('');
            $('.register-container #confirmpassword').val('');
            return;
        }
        
        let hashedPassword = sha256(password);

        try {
            let html_response = await $.ajax({
                type: 'POST',
                url: 'http://localhost:4000/api',
                data: {
                    cedula: cedula,
                    fullname: fullname,
                    password: hashedPassword,
                    action: 'insertUser'
                }
            });
        
            $('#signupResult').show().html(html_response);

            $('.register-container #cedula').val('');
            $('.register-container #fullname').val('');
            $('.register-container #password').val('');
            $('.register-container #confirmpassword').val('');
    
        } catch (error){
            console.error("Error al registrar el usuario: ", error);
            $('#signupResult').show().html("Error al registrar el usuario.");
        }
    });
};