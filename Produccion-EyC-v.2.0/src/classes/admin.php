<?php
namespace App;

session_start();

require_once SRC_PATH . "/connections/connectBDLocal.php";

class admin {

    private function getUsers(){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role'] === "super_user"){
            try {
                $conn2 = connectBDLocal();
                $getUsersSQL = "SELECT * FROM users";
                $stmt = $conn2->prepare($getUsersSQL);
                $stmt->execute();
                $userData = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                return $userData;
            } catch(PDOException $e){
                echo "Error al obtener el listado de usuarios: " . $e->getMessage();
            } finally {
                $conn2 = null;
            }
        } else {
            return "No hay una sesión activa o el usuario no está autorizado.";
        }
    }

    public function adminPanel(){

        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role'] === 'super_user'){
            $userData = $this->getUsers();
            ?>
            
            <div class='admin-setings-container'>
                <div class='close-profile-edit'><img class='close-profile-edit-img' id="close-admin-panel" src='assets/img/close.svg' alt='close-icon'></div>
                <div class ='edit-user-info-header'>
                    <h2>Control Cuentas de Usuario</h2>
                </div>
                <div class='edit-user-info-main'>
                    <div class='admin-users-table-container'>
                        <table class ='table4'>
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
            <?php
                            foreach ($userData as $user): 
            ?>              <tr class="user_row" data-user-id="<?php echo $user['cedula']; ?>">
                                <td><?php echo $user['cedula'] ?></td>
                                <td><?php echo $user['userfullname'] ?></td>
                                <td><?php echo $user['role'] ?></td>
                                <td class="user-status" data-user-id="<?php echo $user['cedula']; ?>"><?php echo $user['status']?></td>
                                <td>
            <?php                            
                                    if ($user['role'] !== 'super_user'):
                                       
            ?>                         
                                            <button class="toggleUserStatus" data-user-id="<?php echo $user['cedula']; ?>">
                                            <?php if($user['status'] === 'enabled'): ?>
                                                <img src="assets/img/user-disable.svg" alt="disable-user">
                                            <?php else: ?>
                                                <img src="assets/img/user-enable.svg" alt="enable-user">
                                            <?php endif; ?>
                                            </button>

                                            <button class="deleteUser" data-user-id="<?php echo $user['cedula']; ?>"><img src="assets/img/trash-can.svg" alt="delete-user"></button>
            <?php
                                    endif;
            ?>
                                </td>
                            </tr>
            <?php
                            endforeach;
            ?>
                            </tbody>
                        </table>
                    </div> 
                </div>
            </div>

        <?php

        } else {
            return "No hay una sesión activa o el usuario no está autorizado para efectuar esta acción.";
        }
    }

    public function toggleUserStatus($userID){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role'] === 'super_user'){
            try {
                $conn2 = connectBDLocal();
                $getStatusSQL = "SELECT status FROM users WHERE cedula = :userID";
                $stmt = $conn2->prepare($getStatusSQL);
                $stmt->bindParam(':userID', $userID);
                $stmt->execute();
                $userData = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($userData === false){
                    return array('error' => 'Usuario no encontrado');
                }

                $status = ($userData['status'] === 'enabled') ? 'disabled' : 'enabled';
                $toggleStatusSQL = "UPDATE users SET status = :status WHERE cedula = :userID ";
                $stmt = $conn2->prepare($toggleStatusSQL);
                $stmt->bindParam(':status', $status, \PDO::PARAM_STR);
                $stmt->bindParam(':userID', $userID, \PDO::PARAM_STR);
                $stmt->execute();

                return array('userID' => $userID, 'newStatus' => $status);
            } catch(\PDOException $e){
                return array('error' => 'Error al cambiar el estado del usuario: ' . $e->getMessage());
            } finally {
                $conn2 = null;
            }
        } else {
            return array('error' => 'No hay una sesión activa o el usuario no está autorizado para efectuar esta acción.');
        }
    }

    public function deleteUser($userID) {
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role'] === 'super_user'){
            try {
                $conn2 = connectBDLocal();
                $deleteUserSQL = "DELETE FROM users WHERE cedula = :userID";
                $stmt = $conn2->prepare($deleteUserSQL);
                $stmt->bindParam(':userID', $userID, \PDO::PARAM_STR);
                $stmt->execute();
                return array('userID' => $userID);
            } catch(\PDOException $e){
                return array('error' => 'Error al eliminar el usuario: ' . $e->getMessage());
            } finally {
                $conn2 = null;
            }
        } else {
            return array('error' => 'No hay una sesión activa o el usuario no está autorizado para efectuar esta acción.');
        }
    }
}

?>

