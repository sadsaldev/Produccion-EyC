import React, {useEffect, useState, useRef, useContext} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { NavContext } from '../../context/NavContext';
import { signupUser } from '../../api/signUp';

export const Signup = () => {

    const {register, handleSubmit, control, formState: {errors}, getValues } = useForm({
        mode: 'onChange',
    });

    const [signupMessage, setSignupMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

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
        const {cedula, fullname, password} = data;

        const response = await signupUser(cedula, fullname, password);

        if (response.code === '03_success'){
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }

        setSignupMessage(response.message);        
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        registerSectionRef('/signup', mainRef);
    }, []);

    return (
        <main ref={mainRef} className="container mt-0 mb-0">
        <div id="index-content">
            <section className="row align-items-center">
                <div className="col-md-6" id="left-container">
                    <div id="main-deco-container"><img className="main-deco" src="/produccion-EyC-deploy/public/assets/img/main-deco.svg" alt="main-deco" /></div>
                </div>
                <div className="col-md-6" id="right-container">
                    <div id="register-content">
                        <div className="register-container">
                            <div className="register-header">
                                <h2>Registrarse</h2>
                            </div>
                            <div className="form-register-container">
                                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                             
                                        <div className='signup-field-top'>
                                            <p>Cédula de Ciudadanía</p>
                                            <input
                                                type="text"
                                                id="cedula"
                                                {...register('cedula', {
                                                    required: 'Este campo es requerido',
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Solo puede tener números'
                                                    }
                                                })}
                                                className={`form-control useridinput ${errors.cedula ? 'is-invalid' : ''}`}
                                            />
                                            {errors.cedula && <span className="invalid-feedback">{errors.cedula.message}</span>}
                                        </div>
                                        <div className='signup-field-bottom-1'>
                                            <p>Contraseña</p>
                                            <input
                                                type="password"
                                                id="password"
                                                {...register('password', {
                                                    required: 'Este campo es requerido',
                                                    validate: (value) => validatePassword(value) || 'Debe tener 8 caracteres, una letra mayúscula, un número y un símbolo'
                                                })}
                                                className={`form-control userpasswordinput ${errors.password ? 'is-invalid' : ''}`}
                                            />
                                            {errors.password && <span className="invalid-feedback">{errors.password.message}</span>}
                                        </div>
                                        <div className='signup-field-top'>
                                            <p>Nombre Completo</p>
                                            <input
                                                type="text"
                                                id="fullname"
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
                                        {signupMessage && (
                                            <div className='alert-container-signup'>
                                                <div className={`alert mt-3 ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                                                    {signupMessage}
                                                </div>
                                            </div> 
                                        )}
                                        <div className='signup-field-bottom-2'>
                                            <p>Confirmar Contraseña</p>
                                            <input
                                                type="password"
                                                id="confirmpassword"
                                                {...register('confirmpassword', {
                                                    required: 'Este campo es requerido',
                                                    validate: validateConfirmPassword
                                                })}
                                                className={`form-control userconfirmpasswordinput ${errors.confirmpassword ? 'is-invalid' : ''}`}
                                            />
                                            {errors.confirmpassword && <span className="invalid-feedback">{errors.confirmpassword.message}</span>}
                                        </div>
                                        <div className='submit-register-container'><input type="submit" id="sub-signup" value="Registrarse" className="submitregister" /></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
    );
}