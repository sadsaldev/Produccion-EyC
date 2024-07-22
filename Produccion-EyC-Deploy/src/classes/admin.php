<?php
namespace App;

session_start();

require_once SRC_PATH . "/connections/connectBDLocal.php";

class Admin {

    public function getUsers(){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role'] === "super_user"){
            try {
                $conn2 = connectBDLocal();
                $getUsersSQL = "SELECT * FROM users";
                $stmt = $conn2->prepare($getUsersSQL);
                $stmt->execute();
                $userData = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                return json_encode(array('users' => $userData,
                             'message' => 'Listado de usuarios obtenido correctamente',
                             'code' => '03_success'));

            } catch(PDOException $e){
                return json_encode(array('message' => 'Error de Conexion a BD Local: ' . $e->getMessage(),
                             'code' => '06_dberror'));
            } finally {
                $conn2 = null;
            }
        } else {
            return json_encode(array('message' => 'No hay una sesion activa.',
                         'code' => '10_inactive'));
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
                    return json_encode(array('message' => 'Usuario no encontrado',
                                 'code' => '05_unknownid'));
                }

                $status = ($userData['status'] === 'enabled') ? 'disabled' : 'enabled';
                $toggleStatusSQL = "UPDATE users SET status = :status WHERE cedula = :userID ";
                $stmt = $conn2->prepare($toggleStatusSQL);
                $stmt->bindParam(':status', $status, \PDO::PARAM_STR);
                $stmt->bindParam(':userID', $userID, \PDO::PARAM_STR);
                $stmt->execute();

                return json_encode(array('userID' => $userID,
                             'newStatus' => $status,
                             'message' => 'Estado actualizado correctamente',
                             'code' => '03_success'));

            } catch(\PDOException $e){
                return json_encode(array('message' => 'Error de Conexion a BD Local: ' . $e->getMessage(),
                             'code' => '06_dberror'));
            } finally {
                $conn2 = null;
            }
        } else {
            return json_encode(array('message' => 'No hay una sesion activa.',
                         'code' => '10_inactive'));
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

                return json_encode(array('userID' => $userID,
                             'message' => 'Usuario eliminado correctamente',
                             'code' => '03_success'));

            } catch(\PDOException $e){
                return json_encode(array('message' => 'Error de Conexion a BD Local: ' . $e->getMessage(),
                             'code' => '06_dberror'));
            } finally {
                $conn2 = null;
            }
        } else {
            return json_encode(array('message' => 'No hay una sesion activa.',
                         'code' => '10_inactive'));
        }
    }
}

?>

