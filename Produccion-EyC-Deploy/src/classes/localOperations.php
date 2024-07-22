<?php 

namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';
require_once SRC_PATH . '/connections/SQLqueries.php';

class localDBmanager {

    private $allqueries;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }
    
    private function checkRecordExistsByCode($conn2, $departamento, $currentRecordCode){
        try {
            $insertedTableName = "" ;

            if ($departamento === "INSP-RIS"){
                $insertedTableName = "RISARALDA";
            } elseif ($departamento === "INSP-CALDAS"){
                $insertedTableName = "CALDAS";
            }

            $sSQL3ByCode = $this->allqueries->get_sSQL3ByCode($insertedTableName);
            $stmt_check_record = $conn2->prepare($sSQL3ByCode);
            $stmt_check_record->bindValue(':unique_code', $currentRecordCode);
            $stmt_check_record->execute();
            $recordExists = $stmt_check_record->fetch(\PDO::FETCH_ASSOC); 

            return !empty($recordExists);

        } catch (PDOException $e){
            $response = array(
                'message' => 'Error al verificar la existencia del registro por código único: ' . $e->getMessage(),
                'code' =>"06_dberror"
            );
            return false;
        }
    }

    public function insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final){
        $insertSuccess =  false;
        $insertedTableName = "" ;
        
        if ($departamento === "INSP-RIS"){
            $insertedTableName = "RISARALDA";
        } elseif ($departamento === "INSP-CALDAS"){
            $insertedTableName = "CALDAS";
        }
        
        try {
            $conn1 = connectGDW();
            $conn2 = connectBDLocal();

            $sSQL4 = $this->allqueries->get_sSQL4($insertedTableName, $fecha_inicio, $fecha_final);
            $stmt_local_records = $conn2->prepare($sSQL4);
            $stmt_local_records->bindValue(':fecha_inicio', $fecha_inicio);
            $stmt_local_records->bindValue(':fecha_final', $fecha_final);
            $stmt_local_records->execute();
            $localRecords = $stmt_local_records->fetchAll(\PDO::FETCH_ASSOC);

            $localRecordCodes = array_map(function($localRecord){
                return $localRecord['unique_code'];
            }, $localRecords);

            //insertar inspecciones si la tabla se encuentra vacía
            if (empty($localRecords)) {
                foreach ($data as $row){
                    $currentRecordCode = $this->generateHASHcode($row);
                    $this->insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode);
                }
                $insertSuccess = true;
            } else {
                foreach($data as $row){
                    $currentRecordCode = $this->generateHASHcode($row);
                    if (!in_array($currentRecordCode, $localRecordCodes)){
                        $this->insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode);
                        $insertSuccess = true;
                    } else {
                        $insertSuccess = false;
                    }
                }
            }
        } catch (PDOException $e){
            $response = array(
                'message' => 'Error de conexión o ejecución de consulta en la Base de Datos Local.' . $e->getMessage(),
                'code' =>"06_dberror"
            );
        }
        return $insertSuccess;
    }

    private function insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode){
        
        try {
            $insertedTableName = "" ;
            
            if ($departamento === "INSP-RIS"){
                $insertedTableName = "RISARALDA";
            } elseif ($departamento === "INSP-CALDAS"){
                $insertedTableName = "CALDAS";
            }

            $sSQL2 = $this->allqueries->get_sSQL2($insertedTableName, $fecha_inicio, $fecha_final);

            $Grupo = utf8_encode($row['Grupo']);
            $Direccion = utf8_encode($row['Direccion']);
            $NombreOperario = utf8_encode($row['NombreOperario']);
            $TipoTarea = utf8_encode($row['TipoTarea']);
            $Prioridad = utf8_encode($row['Prioridad']);
            $Cierre3 = utf8_encode($row['Cierre3']);

            $stmt_insert_record = $conn2->prepare($sSQL2);
            $stmt_insert_record->bindValue(':fecha_inicio', $fecha_inicio);
            $stmt_insert_record->bindValue(':fecha_final', $fecha_final);
            $stmt_insert_record->bindValue(':Grupo', $Grupo);
            $stmt_insert_record->bindValue(':Direccion', $Direccion);
            $stmt_insert_record->bindValue(':FechaRealInicio', $row['FechaRealInicio']);
            $stmt_insert_record->bindValue(':FechaRealFin', $row['FechaRealFin']);
            $stmt_insert_record->bindValue(':NroOperario', $row['NroOperario']);
            $stmt_insert_record->bindValue(':NombreOperario', $NombreOperario);
            $stmt_insert_record->bindValue(':NroSitio', $row['NroSitio']);
            $stmt_insert_record->bindValue(':TipoTarea', $TipoTarea);
            $stmt_insert_record->bindValue(':Prioridad', $Prioridad);
            $stmt_insert_record->bindValue(':Cierre3', $Cierre3);
            $stmt_insert_record->bindValue(':duracion', $row['duracion']);
            $stmt_insert_record->bindValue(':unique_code', $currentRecordCode);
            $stmt_insert_record->execute();

        }  catch (PDOException $e){
            $response = array(
                'message' => 'Error de conexión o ejecución de consulta en la Base de Datos Local.' . $e->getMessage(),
                'code' =>"06_dberror"
            );
        }
    }

    public function generateHASHcode ($data){
        //get values of relevant columns
        $NroOperario = $data['NroOperario'];
        $NroSitio = $data['NroSitio'];
        $Duracion = $data['duracion'];
        $concatString = $NroOperario . $NroSitio . $Duracion;
        $uniqueCode = hash('sha256', $concatString);
        return $uniqueCode;
    }
}

?>  