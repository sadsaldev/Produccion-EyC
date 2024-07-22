<?php
require_once '../connections/connectGDW.php';
require_once '../connections/connectBDLocal.php';
require_once '../connections/sql-queries.php';
require_once 'local-operations.php';

if(isset($_POST['opcion']) && isset($_POST['fecha_inicio']) && isset($_POST['fecha_final'])) {
    $opcion = $_POST['opcion'];
    $fecha_inicio = $_POST['fecha_inicio'];
    $fecha_final = $_POST['fecha_final'];

} else {
    echo "<script>window.alert('Error: No se recibieron los datos del formulario correctamente.')</script>";
}

class mainTable {

    private $allqueries; 
    private $sSQL1;
    private $sSQL2;
    private $sSQL3;
    private $sSQL3ByCode;
    private $sSQL4;
    private $countSQL; 
    private $countINSP; 
    private $SQLINSP; 
    private $SQLboth;
    private $countBoth; 
    private $sSQLCountCaldas;
    private $sSQLCountRisaralda;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }
    
    public function mainDataManager(){ 
    //Este método es invocado cuando se reciben los datos del formulario

        $fecha_inicio = date('Y-m-d', strtotime($_POST['fecha_inicio']));
        $fecha_final  = date('Y-m-d', strtotime($_POST['fecha_final']));
        $opcion = $_POST['opcion'];

        //Obtiene las fechas y la opción seleccionada del formulario                       
        switch(strtolower($opcion)){
            case 'risaralda':
                $departamento = 'RISARALDA';
                break;
            case 'caldas':
                $departamento = 'CALDAS';
                break;
            case 'both':
                $departamento = 'both';
                break;
            default:
                return;
        }

        $this->sSQL1 = $this->allqueries->get_sSQL1($departamento, $fecha_inicio, $fecha_final);
        $this->sSQL2 = $this->allqueries->get_sSQL2($departamento, $fecha_inicio, $fecha_final);
        $this->sSQL3 = $this->allqueries->get_sSQL3($departamento, $fecha_inicio, $fecha_final);
        $this->sSQL3ByCode = $this->allqueries->get_sSQL3ByCode($departamento);
        $this->sSQL4 = $this->allqueries->get_sSQL4($departamento, $fecha_inicio, $fecha_final);
        $this->countSQL = $this->allqueries->get_countSQL($departamento, $fecha_inicio, $fecha_final);
        $this->SQLboth = $this->allqueries->get_SQLboth($fecha_inicio, $fecha_final);
        $this->countBoth = $this ->allqueries->get_countBoth($fecha_inicio, $fecha_final);
        $this->sSQLCountCaldas = $this->allqueries->get_sSQLCountCaldas($fecha_inicio, $fecha_final);
        $this->sSQLCountRisaralda = $this->allqueries->get_sSQLCountRisaralda($fecha_inicio, $fecha_final);

        //Llamada a getDataForTable() para enviar los datos del formulario para insertarlos en la tabla
        $data = $this->getDataForTable($fecha_inicio, $fecha_final, $departamento);
                              
        //Llamada a generateHTMLTable() para generar la tabla HTML con los datos obtenidos y mostrarla en la página
        $html_response = $this->generateHTMLTable($data, $fecha_inicio, $fecha_final, $departamento);
        echo $html_response;
    }

    private function getDataForTable($fecha_inicio, $fecha_final, $departamento) {
    //Este método ejecuta la consulta sSQL1 en la BD de GDW y devuelve los datos    

        try {

            if ($departamento == 'both') {
                return $this->getDataForBothTable($fecha_inicio, $fecha_final);
            } else {
                    $conn1 = connectGDW();
                    $stmt = $conn1->prepare($this->sSQL1);
                    $stmt->execute();
                    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                    return $rows;
                }
    
        } catch (PDOException $e) {
            echo "Error de Conexión a Base de Datos de GoDoWorks: " . $e->getMessage();
            //return array(); 
        }
    }

    private function getDataForBothTable($fecha_inicio, $fecha_final) {
        try {
            $conn1 = connectGDW();
            $stmt = $conn1->prepare($this->SQLboth);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $rows;

        } catch (PDOException $e) {
            echo "Error de Conexión a Base de Datos de GoDoWorks: " . $e->getMessage();
            //return array(); 
        }
    }

    private function generateHTMLTable($data, $fecha_inicio, $fecha_final, $departamento){
    //Este método genera la tabla HTML con los datos obtenidos

        try {

            $html_query_info_part1 = "";
            $html_query_info_part2 = "";
            $html_query_info_part3 = "";

            if ($departamento == 'both') {
                try {
                    $dataFromGDW = array();
                    $conn1 = connectGDW();
                    $stm1 = $conn1->prepare($this->SQLboth);
                    $stm1->execute();
                    $dataFromGDW = $stm1->fetchAll(PDO::FETCH_ASSOC);
                    
                    $html_table_header = "<div class='main-table-container'>";
                    $html_table_header.= "<div class='loader-container' style='display: none;'>";
                    $html_table_header.= "<div class='loader'>";
                    $html_table_header.= "</div>";
                    $html_table_header.= "</div>"; 
                    $html_table_header.= "<div class='top-options2'>";
                    
                    $html_table_header.= "<div class='query-info2'>";
                    $html_table_header.= "<table class='table3 table-striped'>";
                    $html_table_header.= "<thead>";
                    $html_table_header.= "<tr>";
                    $html_table_header.= "<th>#</th>";
                    $html_table_header.= "<th>Depto</th>";
                    $html_table_header.= "<th class='direccion'>Dirección</th>";
                    $html_table_header.= "<th>Fecha Inicio</th>";
                    $html_table_header.= "<th>Fecha Final</th>";
                    $html_table_header.= "<th>Cédula</th>";
                    $html_table_header.= "<th>Nombre</th>";
                    $html_table_header.= "<th>Contrato</th>";
                    $html_table_header.= "<th>Tarea</th>";
                    $html_table_header.= "<th>Prioridad</th>";
                    $html_table_header.= "<th class='cierre'>Cierre</th>";
                    $html_table_header.= "<th>Duración</th>";
                    $html_table_header.= "</tr>";
                    $html_table_header.= "</thead>";
                    $html_table_header.= "<tbody>";

                    $html_table_body = "";

                    $counter = 1;
                
                    foreach ($data as $row){

                        $html_table_body.= "<tr>";
                        $html_table_body.="<td>". $counter . "</td>";
                        $html_table_body.="<td>". $row['Depto'] . "</td>";
                        $html_table_body.="<td>". $row['Direccion'] . "</td>";
                        $html_table_body.="<td>". $row['FechaRealInicio'] . "</td>";
                        $html_table_body.="<td>". $row['FechaRealFin'] . "</td>";
                        $html_table_body.="<td>". $row['NroOperario'] . "</td>";
                        $html_table_body.="<td>". $row['NombreOperario'] . "</td>";
                        $html_table_body.="<td>". $row['NroSitio'] . "</td>";
                        $html_table_body.="<td>". $row['TipoTarea'] . "</td>";
                        $html_table_body.="<td>". $row['Prioridad'] . "</td>";
                        $html_table_body.="<td>". $row['Cierre3'] . "</td>";
                        $html_table_body.="<td>". $row['duracion'] . "</td>";
                        $html_table_body.="</tr>";
                        $counter++;

                    }

                    $countCaldas_stmt = $conn1->prepare($this->sSQLCountCaldas);
                    $countCaldas_stmt->execute(); 
                    $countCaldas = $countCaldas_stmt->fetch(PDO::FETCH_ASSOC)['conteo'];                  
                    
                    $countRisaralda_stmt = $conn1->prepare($this->sSQLCountRisaralda);
                    $countRisaralda_stmt->execute();
                    $countRisaralda = $countRisaralda_stmt->fetch(PDO::FETCH_ASSOC)['conteo'];
                                     
                    //Mostrar el número total de registros obtenidos con countBoth para ambos departamentos
                    $countstm1 = $conn1->prepare($this->countBoth);
                    $countstm1->execute();
                    $countrow = $countstm1->fetch(PDO::FETCH_ASSOC);
                    $totalrows = $countrow['conteo'];
                    
                    $html_query_info_part3.= "<div class='department-count'>";
                    $html_query_info_part3.= "<p class='query-count2'>Inspecciones de Caldas: $countCaldas</p>";
                    $html_query_info_part3.= "<hr>";
                    $html_query_info_part3.= "<p class='query-count2'>Inspecciones de Risaralda: $countRisaralda</p>";
                    $html_query_info_part3.= "</div>";
                    $html_query_info_part3.= "<div class='totalcount'>";
                    $html_query_info_part3.= "<hr class='vertical'>";
                    $html_query_info_part3.= "<p class='query-count2'>Total: $totalrows</p>";
                    $html_query_info_part3.= "</div>";
                    $html_query_info_part3.= "</div>";
                    //Botón que permitirá al usuario ver las inspecciones agrupadas por inspector. (grouped-table.php)
                    $html_query_info_part3.= "<div class='view-grouped-table2'>";
                    $html_query_info_part3.= "<p>Ver inspecciones agrupadas por inspector</p>";
                    $html_query_info_part3.= "<button class='show-grouped-table2'><img src='resources/search.svg'></button>";
                    $html_query_info_part3.= "</div>";
                    $html_query_info_part3.= "</div>";

                } catch (PDOException $e){
                    echo "Error al ejecutar la consulta para obtener las inspecciones de ambos departamentos dentro del rango de fecha seleccionado: " . $e->getMessage();
                }

            } else {

                //Inserción encabezado de la tabla   
                $html_table_header = "<div class='main-table-container'>";
                $html_table_header.= "<div class='loader-container' style='display: none;'>";
                $html_table_header.= "<div class='loader'>";
                $html_table_header.= "</div>";
                $html_table_header.= "</div>"; 
                $html_table_header.= "<div class='top-options'>";
                $html_table_header.= "<div class='query-info'>";
                $html_table_header.= "<table class='table1 table-striped'>";
                $html_table_header.= "<thead>";
                $html_table_header.= "<tr>";
                $html_table_header.= "<th class='count'>#</th>";
                //$html_table_header.= "<th>Departamento</th>";
                $html_table_header.= "<th class='direccion'>Dirección</th>";
                $html_table_header.= "<th>Fecha Inicio</th>";
                $html_table_header.= "<th>Fecha Final</th>";
                $html_table_header.= "<th>Cédula</th>";
                $html_table_header.= "<th>Nombre</th>";
                $html_table_header.= "<th>Contrato</th>";
                $html_table_header.= "<th>Tarea</th>";
                $html_table_header.= "<th>Prioridad</th>";
                $html_table_header.= "<th class='cierre'>Cierre</th>";
                $html_table_header.= "<th>Duración</th>";
                $html_table_header.= "</tr>";
                $html_table_header.= "</thead>";
                $html_table_header.= "<tbody>";
    
                try {
                        $dataFromGDW = array();
                        $conn1 = connectGDW();
                        $stm1 = $conn1->prepare($this->sSQL1);
                        $stm1->execute();
                        $dataFromGDW = $stm1->fetchAll(PDO::FETCH_ASSOC);
                        
                        $html_table_body = "";

                        $counter = 1;

                        foreach ($data as $row){

                            $html_table_body.= "<tr>";
                            $html_table_body.="<td>" . $counter . "</td>";
                            //$html_table_body.="<td>". $row['Depto'] . "</td>";
                            $html_table_body.="<td>". $row['Direccion'] . "</td>";
                            $html_table_body.="<td>". $row['FechaRealInicio'] . "</td>";
                            $html_table_body.="<td>". $row['FechaRealFin'] . "</td>";
                            $html_table_body.="<td>". $row['NroOperario'] . "</td>";
                            $html_table_body.="<td>". $row['NombreOperario'] . "</td>";
                            $html_table_body.="<td>". $row['NroSitio'] . "</td>";
                            $html_table_body.="<td>". $row['TipoTarea'] . "</td>";
                            $html_table_body.="<td>". $row['Prioridad'] . "</td>";
                            $html_table_body.="<td>". $row['Cierre3'] . "</td>";
                            $html_table_body.="<td>". $row['duracion'] . "</td>";
                            $html_table_body.= "</tr>";
                            $counter++;

                        }

                    } catch (PDOException $e){
                        echo "Error al ejecutar la consulta para obtener las inspecciones del departamento y rango de fecha seleccionados: " . $e->getMessage();
                    }

                //-------------------------------------------------------------------------------  

                $insertSuccess = $this->insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final);

                if ($insertSuccess === true){
                    $html_query_info_part1 .= "<p class='query-local'>Se ha actualizado correctamente la BD Local con las inspecciones para este rango de fecha y sucursal.</p>";                    
                    $html_query_info_part1 .= "<hr>";
                                    
                } elseif ($insertSuccess === false){
                    $html_query_info_part2 .=  "<p class='query-local'>Las inspecciones para este rango de fecha y sucursal ya existen en la BD Local.</p>";
                    $html_query_info_part2 .= "<hr>";
                                    
                } else {
                    $html_query_info_part2 .= "<p class='query-local'>Error al insertar los datos en la BD Local.</p>";
                }

                //-------------------------------------------------------------------------------
                
                try {
                    //Mostrar el número total de registros obtenidos con countSQL
                    $countstm1 = $conn1->prepare($this->countSQL);
                    $countstm1->execute();
                    $countrow = $countstm1->fetch(PDO::FETCH_ASSOC);
                    $totalrows = $countrow['conteo'];
                
                    $html_query_info_part3.= "<p class='query-count'>El número total de inspecciones es: $totalrows</p>";
                    //Botón que permitirá al usuario ver las inspecciones agrupadas por inspector. (grouped-table.php)
                    $html_query_info_part3.= "<div class='view-grouped-table'>";
                    $html_query_info_part3.= "<p>Ver inspecciones agrupadas por inspector</p>";
                    $html_query_info_part3.= "<button class='show-grouped-table'><img src='resources/search.svg'></button>";
                    $html_query_info_part3.= "</div>";
                    $html_query_info_part3.= "</div>";

                } catch(PDOException) {
                        $html_query_info_part3 = "<p class= 'query-count'>Error en la consulta para obtener la cantidad total de inspecciones: </p>";
                        echo $html_query_info_part3;
                    }
            }

            $html_response= "";
            $html_response.=$html_table_header;
            $html_response.=$html_query_info_part1;
            $html_response.=$html_query_info_part2;
            $html_response.=$html_table_body;
            $html_response.=$html_query_info_part3;
            $html_response.= "</tbody>";
            $html_response.= "</table>";
            $html_response.= "</div>"; 
            $html_response.= "</div>";
            $html_response.= "</div>";

            if ($totalrows == 0 ) {
                $html_index_placeholder = "<div class='index-placeholder'>";
                $html_index_placeholder .= "<p class='placeholder-info'>No hay inspecciones para mostrar dentro del rango de fecha y departamento(s) seleccionados.</p>";
                $html_index_placeholder .= "</div>";
                return $html_index_placeholder;

            } else {

            return $html_response;

            }

        } catch(PDOException $e) {
            echo "Error de conexión a bases de datos de GoDoWorks o Base de Datos Local." . $e->getMessage();
        }
    }

    private function insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final) {
        $localDBmanager = new localDBmanager();
        return $localDBmanager->insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final);
    }
}
// Inicialización de la clase proceso
$mainTable = new mainTable($opcion, $fecha_inicio, $fecha_final);

// Verificar si la clase proceso se inicializó correctamente
if($mainTable instanceof mainTable) {
    // Llamar al método processGDW solo si la clase proceso se inicializó correctamente    
    $mainTable->mainDataManager();
} else {
    echo "<script>window.alert('Error: La clase proceso no se ha inicializado correctamente.')</script>";
}

?>

