<?php
namespace App;

require_once SRC_PATH . '/connections/sql-queries.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';

class login {

    public function loginUser(){
        
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $cedula = $_POST['cedula'];
            $password = $_POST['password']; 
    
            try {
                $conn2 = connectBDLocal();
                $checkUserSQL = "SELECT * FROM users WHERE cedula = :cedula";
                $stmt_check_user = $conn2->prepare($checkUserSQL);
                $stmt_check_user->bindParam(':cedula', $cedula, \PDO::PARAM_STR);
                $stmt_check_user->execute();
                $user = $stmt_check_user->fetch(\PDO::FETCH_ASSOC);

                if($user){

                    if($user['status'] === 'disabled'){
                        $html_response = "Tu cuenta está desactivada, debes solicitar la activación.";

                    } else {

                        if($password === $user['userpassword']){
                            $checkSessionSQL = "SELECT * FROM session_history WHERE user_id = :user_id AND end_time IS NULL";
                            $stmt_check_session = $conn2->prepare($checkSessionSQL);
                            $stmt_check_session->bindParam(':user_id', $cedula, \PDO::PARAM_STR);
                            $stmt_check_session->execute();
                            $activeSession = $stmt_check_session->fetch(\PDO::FETCH_ASSOC);

                            if ($activeSession){
                                $html_response = "Ya tienes una sesión activa, vuelve a ella o ciérrala para poder continuar.";
                            } else {
                                session_start();
                                
                                $token = bin2hex(random_bytes(16));
                                $sessionID = uniqid();

                                $_SESSION['user_id'] = $user['cedula'];
                                $_SESSION['username'] = $user['userfullname'];
                                $_SESSION['session_token'] = $token;
                                $_SESSION['session_id'] = $sessionID;
                                $_SESSION['role'] = $user['role'];

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

                                $html_response = "Inicio de sesión exitoso.";
                            }
                        } else {
                            $html_response = "La contraseña es incorrecta.";
                        }
                    }
                } else {
                    $html_response = "No existe ningún usuario registrado con esta cédula.";
                }
            } catch (\PDOException $e){
                $html_response = "Error de Conexión a Base de Datos Local: " . $e->getMessage();
            } finally {
                $conn2 = null;
            }
        } else {
            $html_response = "Error al recibir la solicitud del cliente. (POST)";
        }
        echo $html_response;
    }

    public function loginForm(){

        ?>
            <div class="login-container">
                <div class="login-header">
                    <h2>Iniciar Sesión</h2>
                </div>
                <div class="form-login-container">
                    <form action="" method="POST" class="login-form">
                        <p>Cédula de Ciudadanía</p>
                        <input type="number" id="cedula" name="cedula" class="form-control useridinput" required>
                        <p>Contraseña</p>
                        <input type="password" id="password" name="password" class="form-control userpasswordinput" required>
                        <input type="submit" id="sub-login" value="Ingresar" class="submitlogin">
                        <div class="login-result-container"><div id='loginResult' style="display:none;"></div></div>
                    </form>
                </div>
            </div>

        <?php
    }
}

?>