<?php
namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';

class getNetworks {
    public function getNetworksData() {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Verificar si los datos necesarios están presentes en $_POST
            if (isset($_POST['fecha_inicio']) && isset($_POST['opcion'])) {
                $contracts = [];

                if (isset($_POST['contracts']) && is_array($_POST['contracts'])){
                    foreach ($_POST['contracts'] as $contract){
                        if (isset($contract['contrato'])){
                            $contracts[] = $contract['contrato'];
                        }
                    }
                }

                $opcion = $_POST['opcion'];

                $placeholders = implode(',', array_fill(0, count($contracts), '?'));
                
                try {
                   $conn1 = connectGDW(); 

                   $NetSQL = "SELECT Grupo, NroSitio, FechaRealInicio, FechaRealFin, FechaVisita, NroOperario, NombreOperario, TipoTarea, Estado, Cierre3, TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion
                   FROM Tasks 
                   WHERE Grupo = '$opcion'
                   AND NroSitio IN ($placeholders) 
                   AND Cierre3 NOT LIKE '%CIERRE ADMINISTRATIVO%' 
                   AND (DATE(FechaVisita) = CURDATE() OR DATE(FechaVisita) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) OR FechaVisita IS NULL)";

                   $stmt = $conn1->prepare($NetSQL);

                    foreach ($contracts as $index => $contract){
                        //Vincular cada contrato con el índice correcto en la consulta
                        $stmt->bindValue($index + 1, $contract, \PDO::PARAM_STR);
                    }

                    // $stmt->bindValue(count($contracts) + 1, $opcion, \PDO::PARAM_STR);
                    // $stmt->bindValue(count($contracts) + 2, $fecha_inicio, \PDO::PARAM_STR);
                    // $stmt->bindValue(count($contracts) + 3, $fecha_final, \PDO::PARAM_STR);
                   
                   $stmt->execute();

                   $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                    // Crear la respuesta
                    $response = [
                        'code' => '03_success',
                        'message' => 'Datos recibidos correctamente',
                        'data' => $data
                    ];

                } catch (PDOException $e){
                    $response = array(
                        'message' => 'Error de conexión a bases de datos de GoDoWorks' . $e->getMessage(),
                        'code' =>"06_dberror"
                    );
                }
            } else {
                // Crear una respuesta de error si faltan datos
                $response = [
                    'code' => '12_error',
                    'message' => 'Datos faltantes en la solicitud'
                ];
            }

            // Enviar la respuesta como JSON
            return json_encode($response);
        } else {
            // Método no permitido
            $response = [
                'code' => '12_error',
                'message' => 'Método no permitido'
            ];
            return json_encode($response);
        }
    }
}

?>