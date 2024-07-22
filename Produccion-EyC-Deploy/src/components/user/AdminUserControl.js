import React, {useEffect, useState, useRef, useContext} from "react";
import { NavContext } from '../../context/NavContext';
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../api/getUsers";
import { toggleUserStatus } from "../../api/toggleUserStatus";
import { deleteUser } from "../../api/deleteUser";

export const AdminUserControl = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            console.log(response);
            if (response.code === '03_success'){
                setUsers(response.users);
                setLoading(false);
            }
        } catch (error){
            setError('Error al obtener el listado de usuarios.');
            setLoading(false);
        }
    }

    const changeStatus = async (userID) => {
        try {
            const response = await toggleUserStatus(userID);
            if (response.code === '03_success'){
                setUsers(prevUsers => prevUsers.map(user => 
                    user.cedula === userID ? {...user, status: response.newStatus} : user
                ));
            } else {
                setError('Error al cambiar el estado del usuario.');
            }
        } catch (error){
            setError('Error al actualizar el estado del usuario.');
        }
    };

    const removeUser = async (userID) => {
        try {
            const response = await deleteUser(userID);
            if (response.code === '03_success'){
                setUsers(prevUsers => prevUsers.filter(user => user.cedula !== userID));
            } else {
                setError('Error al eliminar el usuario.');
            }
        } catch (error){
            setError('Error al eliminar el usuario.');
        }
    };

    useEffect(() => {
        fetchUsers();
        registerSectionRef('/profile/admin', mainRef);
    }, []);

    const goBackToMenu = () => {
        navigate('/profile');
    };

    // if (loading) return <main ref={mainRef} className='container mt-0 mb-0'>
    //                         <div className='profile-father-container'>
    //                             <div id="blur-background">
    //                                 <div id="profile-content">
    //                                     <div className="loader-container-biboard">
    //                                         <div className="loader"></div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </main>;

    // if (error) return <main ref={mainRef} className='container mt-0 mb-0'>
    //                         <div className='profile-father-container'>
    //                             <div id="blur-background">
    //                                 <div id="profile-content">
    //                                     <div className="loader-container-biboard">
    //                                         <div className='alert mt-3 alert-danger'>{error}</div> 
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </main>; 

    return (
        <main ref={mainRef} className='container mt-0 mb-0'>
            <div className='profile-father-container'>
                <div id="blur-background">
                    <div id="profile-content">
                        <div className="pop-ups-container">
                            <div className="admin-panel-container">
                                <div className='admin-setings-container'>
                                    <div className='close-profile-edit'><img className='close-profile-edit-img' id="close-admin-panel" src='/produccion-EyC-deploy/public/assets/img/close.svg' alt='close-icon' onClick={goBackToMenu}/></div>
                                    <div className ='edit-user-info-header'>
                                        <h2>Control Cuentas de Usuario</h2>
                                    </div>
                                    <div className='admin-users-content'>
                                        <div className='admin-users-table-container'>
                                            <table className ='table4'>
                                                <thead>
                                                    <tr>
                                                        <th>Cédula</th>
                                                        <th>Nombre</th>
                                                        <th>Rol</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map(user => (
                                                        <tr key={user.cedula} className="user_row" data-user-id={user.cedula}>
                                                            <td>{user.cedula}</td>
                                                            <td>{user.userfullname}</td>
                                                            <td>{user.role}</td>
                                                            <td className="user-status" data-user-id={user.cedula}>{user.status}</td>
                                                            <td>
                                                            {user.role !== 'super_user' && (
                                                                <>
                                                                <button className="toggleUserStatus" data-user-id={user.cedula} onClick={() => changeStatus(user.cedula)}>
                                                                    <img 
                                                                        src={user.status === 'enabled' ? '/produccion-EyC-deploy/public/assets/img/user-disable.svg' : '/produccion-EyC-deploy/public/assets/img/user-enable.svg'} 
                                                                        alt={user.status === 'enabled' ? 'disable-user' : 'enable-user'} 
                                                                        title={user.status === 'enabled' ? 'Desactivar usuario' : 'Activar usuario'}
                                                                    />
                                                                </button>
                                                                <button className="deleteUser" data-user-id={user.cedula} onClick={() => removeUser(user.cedula)}><img src="/produccion-EyC-deploy/public/assets/img/trash-can.svg" alt="delete-user" title="Eliminar usuario"/></button>
                                                                </>
                                                            )}
                                                            </td>
                                                        </tr>
                                                    ))}            
                                                </tbody>
                                            </table>
                                        </div> 
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