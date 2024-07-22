<?php
// header('Content-Type: application/json');

define('ROOT_PATH', dirname(__DIR__, 2));
define('SRC_PATH', ROOT_PATH . '/src');

require_once SRC_PATH . '/autoload.php';

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['action'])) {
    $action = $data['action'];

    switch ($action) {
        case 'exportEfectiveExcel':
            $object = new App\exportEfectiveExcel(new App\SQLqueries());
            $departamento = $data['opcion'];
            $fecha_inicio = $data['fecha_inicio'];
            $fecha_final = $data['fecha_final'];
            $object->generateEfectiveExcel($departamento, $fecha_inicio, $fecha_final);
            break;
        case 'exportNetExcel':
            $object = new App\exportNetExcel();
            $dataArray = $data['data'];
            $counts = $data['counts'];

            // Depuración
            // echo "<pre>";
            // var_dump($dataArray);
            // var_dump($counts);
            // echo "</pre>";
            // die();  // Detener la ejecución para ver los datos

            $object->generateNetExcel($dataArray, $counts);
            break;  
        case 'getInspections':
            $object = new App\getInspections();
            $postopc = $data['opcion'];
            $postinitialdate = $data['fecha_inicio'];
            $postfinaldate = $data['fecha_final'];
            $response = $object->mainDataManager($postopc, $postinitialdate, $postfinaldate);
            echo $response;
            break;
        case 'getNewRecords':
            $object = new App\autoUpdate();
            $response = $object->getNewRecords();
            echo $response;
            break;
        case 'loginUser':
            $object = new App\Login();
            $response = $object->loginUser($data['cedula'], $data['password']);
            echo $response;
            break;
        case 'insertUser':
            $object = new App\Signup();
            $response = $object->insertUser($data['cedula'], $data['fullname'], $data['password']);
            echo $response;
            break;
        case 'getUsers':
            $object = new App\Admin();
            $response = $object->getUsers();
            echo $response;
            break;
        case 'toggleUserStatus':
            $object = new App\Admin();
            $userID = $data['userID'];
            $response = $object->toggleUserStatus($userID);
            echo $response;
            break;
        case 'deleteUser':
            $object = new App\Admin();
            $userID = $data['userID'];
            $response = $object->deleteUser($userID);
            echo $response;
            break;
        case 'checkSession':
            $object = new App\sessionManager();
            $response = $object->checkSession();
            echo $response;
            break;
        case 'updateUser':
            $object = new App\profileUpdate();
            $fullname = $data['fullname'];
            $password = $data['password'];
            $response = $object->updateUserData($fullname, $password);
            echo $response;
            break;
        case 'logOutUser':
            $object = new App\Logout();
            $response = $object->logOutUser();
            echo $response;
            break;
        case 'getNetworks':
            $object = new App\getNetworks();
            $opcion = $data['opcion'];
            $fecha_inicio = $data['fecha_inicio'];
            $contratosData = $data['contracts'];
            $response = $object->getNetworksData($opcion, $fecha_inicio, $contratosData);
            echo $response;
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
