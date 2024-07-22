<?php
namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';
require_once SRC_PATH . '/connections/SQLqueries.php';
require_once 'localOperations.php';

class getInspections {

    private $allqueries; 
    private $sSQL1;
    private $SQLboth;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }
    
    public function mainDataManager(){ 
    //Este método es invocado cuando se reciben los datos del formulario

        $fecha_inicio = date('Y-m-d', strtotime($_POST['fecha_inicio']));
        $fecha_final  = date('Y-m-d', strtotime($_POST['fecha_final']));
        $opcion = $_POST['opcion'];

        //Obtiene las fechas y la opción seleccionada del formulario                       
        switch($opcion){
            case 'INSP-RIS':
                $departamento = 'INSP-RIS';
                break;
            case 'INSP-CALDAS':
                $departamento = 'INSP-CALDAS';
                break;
            case 'both':
                $departamento = 'both';
                break;
            default:
                return;
        }

        $this->sSQL1 = $this->allqueries->get_sSQL1($departamento, $fecha_inicio, $fecha_final);
        $this->SQLboth = $this->allqueries->get_SQLboth($fecha_inicio, $fecha_final);
      
        session_start();

        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){

            //Llamada a getData para obtener la data de las inspecciones y devolverlas en json
            $response = $this->getData($fecha_inicio, $fecha_final, $departamento);
            return json_encode($response);

        } else {
            $response = array(
                'message' => 'No hay una sesion activa.',
                'code' => '10_inactive'
            );
            return json_encode($response);
        }
    }

    private function getData($fecha_inicio, $fecha_final, $departamento){
        $response = array();
        try {
            $data = array();
            $conn1 = connectGDW();

            if ($departamento == 'both'){
                $stmt = $conn1->prepare($this->SQLboth);
                $stmt->execute();
                $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);            
            } else {
                $stm1 = $conn1->prepare($this->sSQL1);
                $stm1->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
                $stm1->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
                $stm1->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
                $stm1->execute();
                $data = $stm1->fetchAll(\PDO::FETCH_ASSOC);

                $insertSuccess = $this->insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final);
                $response['db_local'] = $insertSuccess ? 
                    array('message' => 'Se ha actualizado correctamente la BD Local con las inspecciones para este rango de fecha y sucursal.',
                          'code' => '03_success') :
                    ($insertSuccess === false ? 
                        array('message' => 'Las inspecciones para este rango de fecha y sucursal ya existen en la BD Local.', 
                              'code' => '11_alreadyexist') : 
                        array('message' => 'Error al insertar las inspecciones en la BD Local.',
                              'code' => '08_inserterror'));
            }
            $response['data'] = $data;
        } catch(PDOException $e) {
            $response = array(
                'message' => 'Error de conexión a bases de datos de GoDoWorks o Base de Datos Local.' . $e->getMessage(),
                'code' =>"06_dberror"
            );
        }

        return $response;
    }

    private function insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final) {
        $localDBmanager = new localDBmanager();
        return $localDBmanager->insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final);
    }
}

?>