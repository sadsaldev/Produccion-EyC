<?php
namespace App;

require_once SRC_PATH . '/connections/connectBDLocal.php';

class Login {

    public function loginUser($cedula, $password){

        try {
            $conn2 = connectBDLocal();
            $checkUserSQL = "SELECT * FROM users WHERE cedula = :cedula";
            $stmt_check_user = $conn2->prepare($checkUserSQL);
            $stmt_check_user->bindParam(':cedula', $cedula, \PDO::PARAM_STR);
            $stmt_check_user->execute();
            $user = $stmt_check_user->fetch(\PDO::FETCH_ASSOC);

            if($user){

                if($user['status'] === 'disabled'){
                    $response = array('message' => "Tu cuenta esta desactivada, debes solicitar la activacion.",
                                        'code' =>"01_disabled");
                } else {
                    if($password === $user['userpassword']){
                        $checkSessionSQL = "SELECT * FROM session_history WHERE user_id = :user_id AND end_time IS NULL";
                        $stmt_check_session = $conn2->prepare($checkSessionSQL);
                        $stmt_check_session->bindParam(':user_id', $cedula, \PDO::PARAM_STR);
                        $stmt_check_session->execute();
                        $activeSession = $stmt_check_session->fetch(\PDO::FETCH_ASSOC);

                        if ($activeSession){
                            $deleteSessionSQL = "DELETE FROM session_history WHERE user_id = :user_id AND end_time IS NULL";
                            $stmt_delete_session = $conn2->prepare($deleteSessionSQL);
                            $stmt_delete_session->bindParam(':user_id', $cedula, \PDO::PARAM_STR);
                            $stmt_delete_session->execute();
                        } 
                        
                        session_start();
                        
                        $token = bin2hex(random_bytes(16));
                        $sessionID = uniqid();

                        $_SESSION['user_id'] = $user['cedula'];
                        $_SESSION['username'] = $user['userfullname'];
                        $_SESSION['session_token'] = $token;
                        $_SESSION['session_id'] = $sessionID;
                        $_SESSION['role'] = $user['role'];
                        $_SESSION['password'] = $user['userpassword'];

                        ini_set('date.timezone','America/Bogota');
                        $start_time = date('Y-m-d H:i:s');
                        
                        $sessionSQL = "INSERT INTO session_history (token, session_id, user_id, username, start_time, role) VALUES (:token, :session_id, :user_id, :username, :start_time, :role)";
                        $stmt = $conn2->prepare($sessionSQL);
                        $stmt->bindParam(':token', $token, \PDO::PARAM_STR);
                        $stmt->bindParam(':session_id', $sessionID, \PDO::PARAM_STR);
                        $stmt->bindParam(':user_id', $user['cedula'], \PDO::PARAM_STR);
                        $stmt->bindParam(':username', $user['userfullname'], \PDO::PARAM_STR);
                        $stmt->bindParam(':start_time', $start_time, \PDO::PARAM_STR);
                        $stmt->bindParam(':role', $user['role'], \PDO::PARAM_STR);
                        $stmt->execute();

                        $response = array('message' => "Inicio de sesion exitoso.",
                                            'code' =>"03_success");
                    } else {
                        $response = array('message' => "La contraseña es incorrecta.",
                                            'code' =>"04_invalidpassword");
                    }
                }
            } else {
                $response = array('message' => "No existe ningun usuario registrado con esta cedula.",
                                    'code' =>"05_unknownid" );
            }
        } catch (\PDOException $e){
            $response = array('message' => "Error de Conexion a Base de Datos Local: " . $e->getMessage(),
                                'code' =>"06_dberror");
        } finally {
            $conn2 = null;
        }
        header('Content-Type: application/json');
        return json_encode($response);
    }
}

?>