<?php
namespace App;
session_start();

require_once SRC_PATH . "/connections/connectBDLocal.php";

class profile {

    public function getUserData($user_id){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            try {
                $conn2 = connectBDLocal();

                $getUserSQL = "SELECT * FROM users WHERE cedula = :user_id";
                $stmt = $conn2->prepare($getUserSQL);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->execute();

                $userData = $stmt->fetch(\PDO::FETCH_ASSOC);

                return $userData;
            } catch(\PDOException $e){
                return "Error de conexión a BD Local: " . $e->getMessage();
            }

            $conn2 = null;
        } else {
            return "No hay sesión activa.";
        }
    } 

    public function profileSection(){

        // <div class='close-profile-menu'><img class='close-profile-img' src='assets/img/close.svg' alt='close-icon'></div>
        
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){

            $userData = $this->getUserData($_SESSION['user_id']);

            $menu_html =    "<div class='profile-container'>

                                <div class='profile-container-header'>
                                    <img class='user-default-picture' src='assets/img/user-icon.svg' alt='user-picture'>
                                    <div class='header-username-display'>
                                        <h2 id='user-name'>" . $_SESSION['username'] . "</h2>
                                        <p>"  . $_SESSION['user_id'] . "</p>
                                    </div> 
                                </div>
                                <div class='profile-container-options'>
                                    <p id='account-settings'>Ajustes de la Cuenta</p>";

                                    if ($_SESSION['role'] === 'super_user') {
                                        $menu_html .= "<p id='admin-panel'>Panel de Administración</p>
                                                       <p id='user-accounts-control' style='display:none;'>- Control de Cuentas de Usuario</p>";
                                    }

                     $menu_html .= "<p id='download-manual'>Descargar Manual de Usuario</p>
                                    <p id='log-out'>Cerrar Sesión</p> 
                                </div>
                            </div>";

            $settings_html ="<div class='pop-ups-container' style='display:none;'>
                                <div class='admin-panel-container' style='display:none;'></div>
                                <div class='edit-user-info-container' style='display:none;'>
                                    <div class='close-profile-edit'><img class='close-profile-edit-img' id='close-profile-settings' src='assets/img/close.svg' alt='close-icon'></div>
                                    <div class ='edit-user-info-header'>
                                        <h2>Ajustes de la Cuenta</h2>
                                    </div>
                                    <div class='edit-user-info-main'>
                                        <div class='edit-user-info-form-container'>
                                            <form action='' method='POST' class='edit-user-info-form' enctype='multipart/form-data'>
                                                <div class='edit-user-info-left'>
                                                    <p>Nombre</p>
                                                    <div class='user-info-input'>
                                                        <input type='text' id='fullname' name='fullname' class='form-control userfullnameinput' value='" . $userData['userfullname'] . "' readonly>
                                                        <button id='edit-name' class='edit-user-info-button'>Editar</button> 
                                                    </div>
                                                    <p>Contraseña</p>
                                                    <div class='user-info-input2'>
                                                        <input type='password' id='password' name='password' class='form-control userpasswordinput' value='" . $userData['userpassword'] . "' readonly> 
                                                        <button id='edit-password' class='edit-user-info-button'>Editar</button> 
                                                    </div>
                                                    <div class ='confirm-pass-cont' style='display:none;'>
                                                        <p>Confirmar Contraseña</p>
                                                        <div class='user-info-input2'>
                                                            <input type='password' id='confirmpassword' name='password' class='form-control userpasswordinput' value=''> 
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='edit-user-info-right'>
                                                    <div class='updateUserMessage' style='display:none;'></div>
                                                    <div class='confirm-update-container'>
                                                        <button class='save-update' id='save-profile-changes'>Guardar</button>
                                                        <button class='cancel-update' id='cancel-profile-changes'>Cancelar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>";

            return $menu_html . $settings_html;
        }
    }
}

?>

