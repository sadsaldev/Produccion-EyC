<?php


define('ROOT_PATH', dirname(__DIR__, 2));
define('SRC_PATH', ROOT_PATH . '/src');

require_once SRC_PATH . '/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'exportExcel':
            $object = new App\exportExcel(new App\SQLqueries());
            $opcion = $_POST['opcion'];
            $fecha_inicio = $_POST['fecha_inicio'];
            $fecha_final = $_POST['fecha_final'];
            $object->generateExcel($opcion, $fecha_inicio, $fecha_final);
            break;  
        case 'groupedTable':
            $object = new App\groupedTable();
            $response = $object->generateGroupedHTML();
            echo $response;
            break;
        case 'mainTable':
            $object = new App\mainTable();
            $response = $object->mainDataManager();
            echo $response;
            break;
        case 'getNewRecords':
            $object = new App\autoUpdate();
            $response = $object->getNewRecords();
            echo $response;
            break;
        case 'loginForm':
            $object = new App\login();
            $response = $object->loginForm();
            echo $response;
            break;
        case 'loginUser':
            $object = new App\login();
            $response = $object->loginUser();
            echo $response;
            break;
        case 'signUpForm':
            $object = new App\signup();
            $response = $object->signUpForm();
            echo $response;
            break;
        case 'insertUser':
            $object = new App\signup();
            $response = $object->insertUser();
            echo $response;
            break;
        case 'adminPanel':
            $object = new App\admin();
            $response = $object->adminPanel();
            break;
        case 'toggleUserStatus':
            $object = new App\admin();
            $userID = $_POST['userID'];
            $response = $object->toggleUserStatus($userID);
            $json_response = json_encode($response);
            echo $json_response;
            break;
        case 'deleteUser':
            $object = new App\admin();
            $userID = $_POST['userID'];
            $response = $object->deleteUser($userID);
            $json_response = json_encode($response);
            echo $json_response;
            break;
        case 'checkSession':
            $object = new App\sessionManager();
            $response = $object->checkSession();
            $json_response = json_encode($response);
            echo $json_response;
            break;
        case 'profileMenu':
            $object = new App\profile();
            $response = $object->profileSection();
            echo $response;
            break;
        case 'updateUser':
            $object = new App\profileUpdate();
            $response = $object->updateUserData();
            echo $response;
            break;
        case 'queriesPopUp':
            $object = new App\interfaces();
            $response = $object->queriesPopUp();
            echo $response;
            break;
        case 'queriesIndex':
            $object = new App\interfaces();
            $response = $object->queriesIndex();
            echo $response;
            break;
        case 'networksIndex':
            $object = new App\interfaces();
            $response = $object->networksIndex();
            echo $response;
            break;
        case 'BIboardIndex':
            $object = new App\interfaces();
            $response = $object->BIboardIndex();
            echo $response;
            break;
        case 'logOutUser':
            $object = new App\logout();
            $response = $object->logOutUser();
            echo $response;
            break;
        default: 
            $response = 'Acción no valida';
            echo $response;
            break;
    }   
} else {
    $response = 'Método no válido o acción no proporcionada';
    $json_response = $response;
    echo $json_response;
}

?>
