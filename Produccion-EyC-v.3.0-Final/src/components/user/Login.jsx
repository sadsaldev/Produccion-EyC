import React, {useState, useEffect, useRef, useContext} from 'react';
import { useForm } from 'react-hook-form';
import { loginUser, checkSession } from '../../api/authUser';
import { useAuth } from '../../context/AuthContext';
import { NavContext } from '../../context/NavContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

    const { register, handleSubmit, formState: {errors}, watch } = useForm();
    const [backendMessage, setBackendMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const { registerSectionRef, setNavigationHistory } = useContext(NavContext);

    //Obtener data
    const onSubmit = async (data) => {
        const { cedula, password } = data;
        const responseJSON = await loginUser(cedula, password);

        if (responseJSON.code === '03_success'){
            setIsSuccess(true);
            const userData = await checkSession();  
            if (userData){
                login(userData);
                setNavigationHistory(['/']);
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
            }
        } else {
            setIsSuccess(false);
        }
        
        setBackendMessage(responseJSON.message);
    };

    //Validación en tiempo real de los campos
    const cedulaValue = watch("cedula");
    const [cedulaError, setCedulaError] = useState('');

    useEffect(() => {
        if (cedulaValue && !/^[0-9]+$/.test(cedulaValue)){
            setCedulaError("La cédula solo debe contener números.");
        } else {
            setCedulaError("");
        }
    }, [cedulaValue]);

    useEffect(() => {
        registerSectionRef('/login', mainRef);
    }, []);

    return (
        <main ref={mainRef} className="container mt-0 mb-0">
            <div id="index-content">
                <section className="row align-items-center">
                    <div className="col-md-6" id="left-container">
                        <div id="main-deco-container"><img className="main-deco" src="./assets/img/main-deco.svg" alt="main-deco" /></div>
                    </div>
                    <div className="col-md-6" id="right-container">
                        <div id="login-content">
                            <div className="login-container">
                                <div className="login-header">
                                    <h2>Iniciar Sesión</h2>
                                </div>
                                <div className="form-login-container">
                                    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="login-form">
                                        <div className='login-field'>
                                            <p>Cédula de Ciudadanía</p>
                                            <input
                                                type="text"
                                                id="cedula"
                                                name="cedula"
                                                {...register("cedula", {
                                                    required: 'Este campo es requerido',
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'La cédula solo puede contener números'
                                                    }
                                                })}
                                                className={`form-control useridinput ${errors.cedula || cedulaError ? 'is-invalid' : ''}`}
                                            />
                                            {(errors.cedula || cedulaError) && <span className="invalid-feedback">{errors.cedula?.message || cedulaError}</span>}
                                        </div>
                                        <div className='login-field'>
                                           <p>Contraseña</p>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                {...register("password", { required: 'Este campo es requerido' })}
                                                className={`form-control userpasswordinput ${errors.password ? 'is-invalid' : ''}`}
                                            />
                                            {errors.password && <span className="invalid-feedback">{errors.password.message}</span>} 
                                        </div>
                                        <div className='submit-login-container'>
                                           <input type="submit" id="sub-login" value="Ingresar" className="submitlogin" /> 
                                        </div>
                                          {backendMessage && (
                                            <div className='alert-container-login'>
                                                <div className={`alert mt-3 ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                                                    {backendMessage}
                                                </div>
                                            </div>
                                          )}
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