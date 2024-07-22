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
                return array(
                    'error' => 'Error de conexión a BD Local: ' . $e->getMessage()
                );
            } finally {
                $conn2 = null;
            }
        } else {
            return "No hay sesión activa.";
        }
    }

    public function updateUserData(){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            $userData = $this->getUserData($_SESSION['user_id']);
            $user_id = $_SESSION['user_id'];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                $fullname = $_POST['fullname'];
                $password = $_POST['password'];

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
                            return json_encode($newUserData);
                        } else {
                            return json_encode(array(
                                'error' => 'Error al actualizar los datos.'
                            ));
                        }
                    } catch(PDOException $e){
                        return json_encode(array(
                            'error' => 'Error de conexión a BD Local: ' . $e->getMessage()
                        ));
                    } finally {
                        $conn2 = null;
                    }
                } else {
                    return json_encode(array(
                        'error' => 'Los datos proporcionados para actualizar son iguales.'
                    ));
                }
            } else {
                return json_encode(array(
                    'error' => 'Error al recibir la solicitud del cliente. (POST)'
                ));
            }
        } else {
            return json_encode(array(
                'error' => 'Actualización no autorizada. No hay una sesión activa.'
            ));
        }
    }
}

?>