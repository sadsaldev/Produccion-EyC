<?php 
namespace App;
require_once SRC_PATH . '/connections/connectGDW.php';
session_start();

class autoUpdate {
    
    public function getNewRecords() {
        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])) {
            $departamento = $_POST['opcion'];
            $lastQueryTime = $_POST['lastQueryTime'];

            $conn1 = connectGDW();

                // Imprimir la consulta con los valores reales
                // $printedQuery = str_replace(
                //     [':departamento', ':lastQueryTime'],
                //     [$departamento, $lastQueryTime],
                //     $query
                // );
                //echo $printedQuery;

            if ($departamento == "INSP-RIS" || $departamento == "INSP-CALDAS"){
                $query = "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                        TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                        FROM Tasks 
                        WHERE Grupo = :departamento
                            AND (
                                    FechaRealFin >= :lastQueryTime AND FechaRealFin <= NOW()
                                ) 
                            AND (
                                    (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    ) 
                                    OR 
                                    (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                        AND (
                                                (Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD') AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00')
                                                OR 
                                                (Cierre3 IN ('INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO'))
                                            )
                                    )
                                    OR 
                                    (TipoTarea = 'RP 12170'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    )
                                    OR 
                                    (TipoTarea = 'RN 10772'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    )
                                    OR 
                                    (TipoTarea = 'RN 12149'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                                    )
                                ) 
                                    
                                AND NroSitio NOT LIKE '%prueba%' ORDER BY NombreOperario ASC";

                $stm1 = $conn1->prepare($query);

                if(!empty($query)){
                    $stm1->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
                    $stm1->bindParam(':lastQueryTime', $lastQueryTime, \PDO::PARAM_STR);
                    $stm1->execute();
                    $rs = $stm1->fetchAll(\PDO::FETCH_ASSOC);

                    $newRecords = [];
                    foreach($rs as $row){
                        $newRecords[] = $row;
                    }

                    $response = json_encode($newRecords);

                } else {
                    $response = json_encode(['error' => 'The query is empty.']);
                }

            } else if ($departamento == "both"){
                $query = "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                        TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                        FROM Tasks 
                        WHERE Grupo IN ('INSP-RIS', 'INSP-CALDAS')
                            AND (
                                    FechaRealFin >= :lastQueryTime AND FechaRealFin <= NOW()
                                ) 
                            AND (
                                    (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    ) 
                                    OR 
                                    (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                        AND (
                                                (Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD') AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00')
                                                OR 
                                                (Cierre3 IN ('INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO'))
                                            )
                                    )
                                    OR 
                                    (TipoTarea = 'RP 12170'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    )
                                    OR 
                                    (TipoTarea = 'RN 10772'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                                        AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:16:00'
                                    )
                                    OR 
                                    (TipoTarea = 'RN 12149'
                                        AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                                    )
                                ) 
                                    
                                AND NroSitio NOT LIKE '%prueba%' ORDER BY NombreOperario ASC";

                $stm1 = $conn1->prepare($query);

                if(!empty($query)){
                    $stm1->bindParam(':lastQueryTime', $lastQueryTime, \PDO::PARAM_STR);
                    $stm1->execute();
                    $rs = $stm1->fetchAll(\PDO::FETCH_ASSOC);

                    $newRecords = [];
                    foreach($rs as $row){
                        $newRecords[] = $row;
                    }

                    $response = json_encode($newRecords);

                } else {
                    $response = json_encode(['error' => 'The query is empty.']);
                }
            }

        } else {
            $response = json_encode(['error' => 'No hay una sesión activa.']);
        }

        return $response;
    }
}

?>