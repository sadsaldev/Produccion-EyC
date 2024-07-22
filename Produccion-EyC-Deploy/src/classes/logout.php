<?php

namespace App;

require_once SRC_PATH . '/connections/connectBDLocal.php';

class Logout {
    
    public function logoutUser() {
        session_start();
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){

            ini_set('date.timezone','America/Bogota');
            $end_time = date('Y-m-d H:i:s');

            try {
                $conn2 = connectBDLocal();
                $updSessionSQL = "UPDATE session_history SET end_time = :end_time, duration = SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, :end_time)) WHERE session_id = :session_id";
                $stmt = $conn2->prepare($updSessionSQL);
                $stmt->bindParam(':end_time', $end_time, \PDO::PARAM_STR);
                $stmt->bindParam(':session_id', $_SESSION['session_id'], \PDO::PARAM_STR);
                $stmt->execute();
            } catch (\PDOException $e){
                $response = array('message' => "Error al cerrar sesión: " . $e->getMessage(),
                                  'code' => "06_dberror");
            } finally {
                $conn2 = null;
            }
            
            session_unset();
            session_destroy();

            $response = array('message' => "Sesion cerrada correctamente.",
                              'code' => "03_success");
        } else {
            $response = array('message' => "No hay sesion activa para cerrar",
                              'code' => "10_inactive");
        }  

        return json_encode($response);
    }
}
    

?>