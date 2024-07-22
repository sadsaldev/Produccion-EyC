<?php
namespace App;

session_start();

require_once SRC_PATH . "/connections/connectBDLocal.php";

class profileUpdate{

    private function getUserData($user_id){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            try {
                $conn2 = connectBDLocal();
                $getUserSQL = "SELECT * FROM users WHERE cedula = :user_id";
                $stmt = $conn2->prepare($getUserSQL);
                $stmt->bindParam(':user_id', $user_id, \PDO::PARAM_STR);
                $stmt->execute();
                $userData = $stmt->fetch(\PDO::FETCH_ASSOC);
                return $userData;

            } catch(\PDOException $e){
                return json_encode(array(
                    'message' => 'Error de conexion a BD Local: ' . $e->getMessage(),
                    'code' => '06_dberror'
                ));
            } finally {
                $conn2 = null;
            }
        } else {
            return  json_encode(array(
                'message' => 'No hay una sesion activa.',
                'code' => '10_inactive'
            ));
        }
    }

    public function updateUserData($fullname, $password){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            $userData = $this->getUserData($_SESSION['user_id']);
            $user_id = $_SESSION['user_id'];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                if ($fullname !== $userData['userfullname'] || $password !== $userData['userpassword']){
                    
                    try {
                        $conn2 = connectBDLocal();
                        $updateUserSQL = "UPDATE users SET userfullname = :fullname, userpassword = :password WHERE cedula = :user_id";
                        $stmt = $conn2->prepare($updateUserSQL);
                        $stmt->bindParam(':fullname', $fullname, \PDO::PARAM_STR);
                        $stmt->bindParam(':password', $password, \PDO::PARAM_STR);
                        $stmt->bindParam(':user_id', $user_id, \PDO::PARAM_STR);
    
                        if($stmt->execute()){
                            $_SESSION['username'] = $fullname;
                            $newUserData = $this->getUserData($user_id);
                            return json_encode(array(
                                'message' => $newUserData,
                                'code' => '03_success'
                            ));
                        } else {
                            return json_encode(array(
                                'message' => 'Error al actualizar los datos.',
                                'code' => '12_error'
                            ));
                        }
                    } catch(PDOException $e){
                        return json_encode(array(
                            'message' => 'Error de conexión a BD Local: ' . $e->getMessage(),
                            'code' => '06_dberror'
                        ));
                    } finally {
                        $conn2 = null;
                    }
                } else {
                    return json_encode(array(
                        'message' => 'Los datos proporcionados para actualizar son iguales.',
                        'code' => '09_duplicatentry'
                    ));
                }
            } else {
                return json_encode(array(
                    'message' => 'Error al recibir la solicitud del cliente. (POST)',
                    'code' => '07_invalidrequest'
                ));
            }
        } else {
            return json_encode(array(
                'message' => 'Actualización no autorizada. No hay una sesión activa.',
                'code' => '10_inactive'
            ));
        }
    }
}

?>