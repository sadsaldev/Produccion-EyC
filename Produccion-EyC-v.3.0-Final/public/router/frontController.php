<?php
header('Content-Type: application/json');

define('ROOT_PATH', dirname(__DIR__, 2));
define('SRC_PATH', ROOT_PATH . '/src');

require_once SRC_PATH . '/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'exportEfectiveExcel':
            $object = new App\exportEfectiveExcel(new App\SQLqueries());
            $departamento = $_POST['opcion'];
            $fecha_inicio = $_POST['fecha_inicio'];
            $fecha_final = $_POST['fecha_final'];
            $object->generateEfectiveExcel($departamento, $fecha_inicio, $fecha_final);
            break;
        case 'exportNetExcel':
            $object = new App\exportNetExcel();
            $data_json = $_POST['data'];
            $counts_json = $_POST['counts'];
            $object->generateNetExcel($data_json, $counts_json);
            break;  
        case 'getInspections':
            $object = new App\getInspections();
            $response = $object->mainDataManager();
            echo json_encode($response);
            break;
        case 'getNewRecords':
            $object = new App\autoUpdate();
            $response = $object->getNewRecords();
            echo $response;
            break;
        case 'loginUser':
            $object = new App\Login();
            $response = $object->loginUser();
            echo json_encode($response);
            break;
        case 'insertUser':
            $object = new App\Signup();
            $response = $object->insertUser();
            echo json_encode($response);
            break;
        case 'getUsers':
            $object = new App\Admin();
            $response = $object->getUsers();
            echo json_encode($response);
            break;
        case 'toggleUserStatus':
            $object = new App\Admin();
            $userID = $_POST['userID'];
            $response = $object->toggleUserStatus($userID);
            echo json_encode($response);
            break;
        case 'deleteUser':
            $object = new App\Admin();
            $userID = $_POST['userID'];
            $response = $object->deleteUser($userID);
            echo json_encode($response);
            break;
        case 'checkSession':
            $object = new App\sessionManager();
            $response = $object->checkSession();
            $json_response = json_encode($response);
            echo $json_response;
            break;
        case 'updateUser':
            $object = new App\profileUpdate();
            $response = $object->updateUserData();
            echo json_encode($response);
            break;
        case 'logOutUser':
            $object = new App\Logout();
            $response = $object->logOutUser();
            echo json_encode($response);
            break;
        case 'getNetworks':
            $object = new App\getNetworks();
            $response = $object->getNetworksData();
            echo json_encode($response);
            break;
        default: 
            $response = array('message' => 'Accion no valida',
                              'code' =>'12_error');
            echo json_encode($response);
            break;
    }   
} else {
    $response =  array('message' => 'Metodo no valido o accion no proporcionada',
                       'code' =>'12_error');
    echo json_encode($response);
}

?>
