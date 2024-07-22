<?php
namespace App;

require_once SRC_PATH . '/connections/connectBDLocal.php';

class Signup {

    public function insertUser($cedula, $fullname, $password){

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
                $response = array('message' => "Usuario registrado exitosamente, inicia sesion para continuar.",
                'code' =>"03_success");
            } else {
                $response = array('message' => "Error al registrar el usuario, intentalo de nuevo.",
                'code' =>"08_inserterror");
            }

        } catch (\PDOException $e)  {
            // Capturar error de integridad de clave primaria
            if($e->getCode() == '23000'){
                $response = array('message' => "Ya existe un usuario registrado con este numero de cedula, por favor proporciona uno diferente.",
                'code' =>"09_duplicatentry");
            } else {
                $response = array('message' => "Error de Conexion a Base de Datos Local: " . $e->getMessage(),
                'code' =>"06_dberror");
            }
        } finally {
            $conn2 = null;
        }

        return json_encode($response);
    }
}


?>