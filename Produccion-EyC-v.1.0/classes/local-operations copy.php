<?php 

require_once '../connections/connectGDW.php';
require_once '../connections/connectBDLocal.php';
require_once '../connections/sql-queries.php';

class localDBmanager {

    private $allqueries;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }
    
    private function checkRecordExistsByCode($conn2, $departamento, $currentRecordCode){
        try {
            echo "<script>console.log('ejecutando consulta sSQLByCode...')</script>";
            $sSQL3ByCode = $this->allqueries->get_sSQL3ByCode($departamento);
            $stmt_check_record = $conn2->prepare($sSQL3ByCode);
            $stmt_check_record->bindValue(':unique_code', $currentRecordCode);
            $stmt_check_record->execute();
            $recordExists = $stmt_check_record->fetch(PDO::FETCH_ASSOC); 
            echo "<script>console.log('sSQLByCode ejecutada.')</script>";

            return !empty($recordExists);
        } catch (PDOException $e){
            echo "Error al verificar la existencia del registro por código único: " . $e->getMessage();
            return false;
        }
    }

    public function insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final){
        $insertSuccess =  false;

        try {
            $conn1 = connectGDW();
            $conn2 = connectBDLocal();

            $sSQL4 = $this->allqueries->get_sSQL4($departamento, $fecha_inicio, $fecha_final);
            $stmt_local_records = $conn2->prepare($sSQL4);
            $stmt_local_records->bindValue(':fecha_inicio', $fecha_inicio);
            $stmt_local_records->bindValue(':fecha_final', $fecha_final);
            $stmt_local_records->execute();
            $localRecords = $stmt_local_records->fetchAll(PDO::FETCH_ASSOC);

            $localRecordCodes = array_map(function($record){
                return $record['unique_code'];
            }, $localRecords);

            echo "<script>console.log('ejecutando consulta sSQL3...')</script>";

            //Contar la cantidad de registros existentes en la bd local
            $sSQL3 = $this->allqueries->get_sSQL3($departamento, $fecha_inicio, $fecha_final);
            $stmt_local_count = $conn2->prepare($sSQL3);
            $stmt_local_count->bindValue(':fecha_inicio', $fecha_inicio);
            $stmt_local_count->bindValue(':fecha_final', $fecha_final);
            $stmt_local_count->execute();
            $localCount = $stmt_local_count->fetch(PDO::FETCH_ASSOC);
            $localRecordCount = $localCount['count'];

            echo "<script>console.log('Consulta ejecutada sSQL3: " . $sSQL3 . "')</script>";
            echo "<script>console.log('Cantidad de registros en la BD local: " . $localRecordCount . "')</script>";

            //insertar inspecciones si la tabla se encuentra vacía
            if ($localRecordCount == 0) {
                foreach ($data as $row){
                    $currentRecordCode = $this->generateHASHcode($row);
                    $this->insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode);
                }

                $insertSuccess = true;

            } else {

                //Contar la cantidad de registros arrojados por la base remota
                $remoteRecordCount = count($data);
                echo "<script>console.log('Cantidad de registros arrojados por la base remota: " . $remoteRecordCount . "')</script>";
                
                if ($remoteRecordCount > $localRecordCount) {
                    foreach($data as $row){
                        $currentRecordCode = $this->generateHASHcode($row);
                        echo "<script>console.log('Código único generado para el registro: " . $currentRecordCode . "')</script>";
                        $this->insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode);
                    }

                    echo "<script>console.log('Registros insertados en la base local.')</script>";
                    $insertSuccess = true;
                } else {
                    echo "<script>console.log('Registro ya existe en la base local.')</script>";
                    $insertSuccess = false;
                }

            }
    
        } catch (PDOException $e){
            echo "Error de conexión o ejecución de consulta en la Base de Datos Local." . $e->getMessage();
        }

        return $insertSuccess;
    }

    private function insertRecord($conn2, $departamento, $fecha_inicio, $fecha_final, $row, $currentRecordCode){
        
        try {

            //Prepare SQL statement to insert records
            echo "<script>console.log('ejecutando consulta sSQL2...')</script>";
            $sSQL2 = $this->allqueries->get_sSQL2($departamento, $fecha_inicio, $fecha_final);
            echo "<script>console.log('Consulta SQL para insertar registros: " . $sSQL2 . "')</script>";

            $stmt_insert_record = $conn2->prepare($sSQL2);
            $stmt_insert_record->bindValue(':fecha_inicio', $fecha_inicio);
            $stmt_insert_record->bindValue(':fecha_final', $fecha_final);
            $stmt_insert_record->bindValue(':Depto', $row['Depto']);
            $stmt_insert_record->bindValue(':Direccion', $row['Direccion']);
            $stmt_insert_record->bindValue(':FechaRealInicio', $row['FechaRealInicio']);
            $stmt_insert_record->bindValue(':FechaRealFin', $row['FechaRealFin']);
            $stmt_insert_record->bindValue(':NroOperario', $row['NroOperario']);
            $stmt_insert_record->bindValue(':NombreOperario', $row['NombreOperario']);
            $stmt_insert_record->bindValue(':NroSitio', $row['NroSitio']);
            $stmt_insert_record->bindValue(':TipoTarea', $row['TipoTarea']);
            $stmt_insert_record->bindValue(':Prioridad', $row['Prioridad']);
            $stmt_insert_record->bindValue(':Cierre3', $row['Cierre3']);
            $stmt_insert_record->bindValue(':duracion', $row['duracion']);
            $stmt_insert_record->bindValue(':unique_code', $currentRecordCode);
            $stmt_insert_record->execute();

        }  catch (PDOException $e){
            echo "Error de conexión o ejecución de consulta en la Base de Datos Local." . $e->getMessage();
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