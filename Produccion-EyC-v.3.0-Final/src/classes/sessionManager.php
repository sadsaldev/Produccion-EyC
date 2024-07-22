<?php
namespace App;

require_once SRC_PATH . '/connections/connectBDLocal.php';

class sessionManager{

    public function checkSession(){
        session_start();
        $response = [];
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            $response['session_active'] = true;
            $response['session_token'] = $_SESSION['session_token'];
            $response['session_id'] = $_SESSION['session_id'];
            $response['session_userid'] = $_SESSION['user_id'];
            $response['session_role'] = $_SESSION['role']; 
            $response['session_username'] = $_SESSION['username'];
            $response['session_pass'] = $_SESSION['password'];
        } else {
            $response['session_active'] = false;
        }
        header('Content-Type: application/json');
        return json_encode($response);
    }
}

?>