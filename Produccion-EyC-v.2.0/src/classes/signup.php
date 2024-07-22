<?php
namespace App;

require_once SRC_PATH . '/connections/sql-queries.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';

class signup {

    public function insertUser(){

        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $cedula = $_POST["cedula"];
            $fullname = $_POST["fullname"];
            $password = $_POST["password"];

            try {
                $conn2 = connectBDLocal();

                $user_role = 'normal_user';
                $status = 'disabled';

                // Insertar usuario si la cédula y el nombre de usuario no están registrados
                $insertUserSQL = "INSERT INTO users (cedula, userfullname, userpassword, role, status) VALUES (:cedula, :fullname, :password, :role, :status)";
                $stmt_insert_user = $conn2->prepare($insertUserSQL);
                $stmt_insert_user->bindParam(':cedula', $cedula, \PDO::PARAM_STR);
                $stmt_insert_user->bindParam(':fullname', $fullname, \PDO::PARAM_STR);
                $stmt_insert_user->bindParam(':password', $password, \PDO::PARAM_STR);
                $stmt_insert_user->bindParam(':role', $user_role, \PDO::PARAM_STR);
                $stmt_insert_user->bindParam(':status', $status, \PDO::PARAM_STR);

                if($stmt_insert_user->execute()){
                    $html_response = "Usuario registrado exitosamente, inicia sesión para continuar.";
                } else {
                    $html_response = "Error al registrar el usuario, inténtalo de nuevo.";
                }

            } catch (\PDOException $e)  {
                // Capturar error de integridad de clave primaria
                if($e->getCode() == '23000'){
                    $html_response = "Ya existe un usuario registrado con este número de cédula, por favor proporciona uno diferente.";
                } else {
                    $html_response = "Error de Conexión a Base de Datos Local: " . $e->getMessage();
                }
            } finally {
                $conn2 = null;
            }

        } else {
            $html_response = "Error al recibir la solicitud del cliente. (POST)";
        }
        
        echo $html_response;
    }

    public function signUpForm(){
        ?>

        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </head>
        <body>
            <div class="register-container">
                <div class="register-header">
                    <h2>Registrarse</h2>
                </div>
                <div class="form-register-container">
                    <form id="signupform" action="" method="POST" class="register-form" required>
                        <div class="sign-up-left">
                            <p>Cédula de Ciudadanía</p>
                            <input type="number" id="cedula" name="cedula" class="form-control useridinput" required>
                            <p>Nombre Completo</p>
                            <input type="text" id="fullname" name="fullname" class="form-control userfullnameinput" required>
                            <div id='signupResult' style="display:none;"></div>
                        </div>
                        <div class="sign-up-right">
                            <p>Contraseña</p>
                            <input type="password" id="password" name="password" class="form-control userpasswordinput" required>
                            <p>Confirmar contraseña</p>
                            <input type="password" id="confirmpassword" name="confirmpassword" class="form-control userconfirmpasswordinput" required>
                            <input type="submit" id="sub-signup" value="Registrarse" class="submitregister">
                        </div>
                    </form>
                </div>
            </div>
        </body>
        </html>

        <?php
    }
}


?>