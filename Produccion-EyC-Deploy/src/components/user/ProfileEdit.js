import React, {useState, useEffect, useRef, useContext} from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { NavContext } from '../../context/NavContext';
import { useAuth } from '../../context/AuthContext';
import { updateUserData } from "../../api/updateUser";

export const ProfileEdit = () => {
    const navigate = useNavigate();
    const {user, updateUser} = useAuth();
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    const {register, handleSubmit, control, formState: {errors}, getValues, setValue } = useForm({
        mode: 'onChange',
    });

    const [backendMessage, setBackendMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            //Pre-poblar los valores de los campos con los datos del usuario
            setValue('fullname', user.userName);
            setValue('password', ''); 
        }
    }, [user, setValue]);

    useEffect(() => {
        registerSectionRef('/profile/edit', mainRef);
    }, []);

    const goBackToMenu = () => {
        navigate('/profile');
    };

    const validatePassword = (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isValidLength = value.length >= 8;
        return hasUpperCase && hasNumber && hasSpecialChar && isValidLength;
    };

    const validateConfirmPassword = (value) => {
        const {password} = getValues();
        return password === value || "Las contraseñas no coinciden.";
    };

    const onSubmit = async (data) => {
        const {fullname, password} = data;
        const hashedPassword = sha256(password);
        const response = await updateUserData(fullname, hashedPassword);
        
        if (response.code === '03_success'){
            setIsSuccess(true);
            //Actualizar el contexto del usuario
            updateUser({
                userName: response.message.userfullname,
                userPass: response.message.userpassword
            });
        } else {
            setIsSuccess(false);
        }

        setBackendMessage(response.message);
    };

    return (
        <main ref={mainRef} className='container mt-0 mb-0'>
            <div className='profile-father-container'>
                <div id="blur-background">
                    <div id="profile-content">
                        <div className='pop-ups-container'>
                            <div className='edit-user-info-container'>
                                <div className='close-profile-edit'><img className='close-profile-edit-img' id='close-profile-settings' src='/produccion-EyC-deploy/public/assets/img/close.svg' alt='close-icon' onClick={goBackToMenu}/></div>
                                <div className='edit-user-info-header'>
                                    <h2>Ajustes de la Cuenta</h2>
                                </div>
                                <div className='edit-user-info-main'>
                                    <div className='edit-user-info-form-container'>
                                        <form action='' method='POST' className='edit-user-info-form' onSubmit={handleSubmit(onSubmit)}>
                                            <div className='edit-user-info-left'>
                                                <p>Nombre</p>
                                                <div className='user-info-input'>
                                                    <input
                                                        type='text'
                                                        id='fullname'
                                                        {...register('fullname', {
                                                            required: 'Este campo es requerido',
                                                            pattern: {
                                                                value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                                                message: 'Solo puede contener letras y tíldes'
                                                            }
                                                        })}
                                                        className={`form-control userfullnameinput ${errors.fullname ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors.fullname && <span className="invalid-feedback">{errors.fullname.message}</span>}
                                                </div>
                                                <p>Contraseña</p>
                                                <div className='user-info-input'>
                                                    <input
                                                        type='password'
                                                        id='password'
                                                        {...register('password', {
                                                            required: 'Este campo es requerido',
                                                            validate: (value) => validatePassword(value) || 'Debe tener 8 caracteres, una letra mayúscula, un número y un símbolo'
                                                        })}
                                                        className={`form-control userpasswordinput ${errors.password ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors.password && <span className="invalid-feedback">{errors.password.message}</span>}
                                                </div>
                                                <p>Confirmar Contraseña</p>
                                                <div className='user-info-input2'>
                                                    <input
                                                        type='password'
                                                        id='confirmpassword'
                                                        name='confirmpassword'
                                                        {...register('confirmpassword', {
                                                            required: 'Este campo es requerido',
                                                            validate: validateConfirmPassword
                                                        })}
                                                        className={`form-control userconfirmpasswordinput ${errors.confirmpassword ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors.confirmpassword && <div className="confirm-pass-span"><span className="invalid-feedback">{errors.confirmpassword.message}</span></div>}
                                                </div>
                                            </div>
                                            <div className='edit-user-info-right'>
                                                {backendMessage && (
                                                    <div className="updateSuccess-container">
                                                        <div className="updateSuccess">
                                                            <div className={`alert mt-3 ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                                                                {isSuccess ? 'Se actualizaron correctamente los datos': backendMessage}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className='confirm-update-container'>
                                                    <button className='save-update' id='save-profile-changes' type='submit'>Guardar</button>
                                                    <button className='cancel-update' id='cancel-profile-changes' type='button' onClick={goBackToMenu}>Cancelar</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}