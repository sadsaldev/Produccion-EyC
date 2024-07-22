<?php
namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/connectBDLocal.php';
require_once SRC_PATH . '/connections/sql-queries.php';
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
        $this->countBoth = $this ->allqueries->get_countBoth($fecha_inicio, $fecha_final);
        $this->sSQLCountCaldas = $this->allqueries->get_sSQLCountCaldas($fecha_inicio, $fecha_final);
        $this->sSQLCountRisaralda = $this->allqueries->get_sSQLCountRisaralda($fecha_inicio, $fecha_final);

      
        session_start();

        if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
            //Llamada a getDataForTable() para enviar los datos del formulario para insertarlos en la tabla
            $data = $this->getDataForTable($fecha_inicio, $fecha_final, $departamento);
            
            $totalregistros = $this->countRecords($data);

            //Llamada a generateHTMLTable() para generar la tabla HTML con los datos obtenidos y mostrarla en la página
            $response = $this->generateHTMLTable($data, $fecha_inicio, $fecha_final, $departamento, $totalregistros);

            return $response;
        } else {
            return "No hay una sesión activa.";
        }
    }

    private function getDataForTable($fecha_inicio, $fecha_final, $departamento) {
    //Este método ejecuta la consulta sSQL1 en la BD de GDW y devuelve los datos    

        try {

            if ($departamento == 'both') {
                return $this->getDataForBothTable($fecha_inicio, $fecha_final);
            } else {
                    $conn1 = connectGDW();
                    $stmt = $conn1->prepare($this->sSQL1);
                    
                    $stmt->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
                    $stmt->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
                    $stmt->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
                    $stmt->execute();

                    $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

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

            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $rows;

        } catch (PDOException $e) {
            echo "Error de Conexión a Base de Datos de GoDoWorks: " . $e->getMessage();
            //return array(); 
        }
    }

    private function countRecords($rows){
        return count($rows);
    }

    private function generateHTMLTable($data, $fecha_inicio, $fecha_final, $departamento, $totalregistros){
        
        try {

            if ($departamento == 'both'){

                try {
                    $conn1 = connectGDW();
                    $stmt = $conn1->prepare($this->SQLboth);
                    
                    $stmt->execute();

                    $dataFromGDW = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                    $countCaldas_stmt = $conn1->prepare($this->sSQLCountCaldas);
                    $countCaldas_stmt->execute(); 
                    $countCaldas = $countCaldas_stmt->fetch(\PDO::FETCH_ASSOC)['conteo'];                  
                    
                    $countRisaralda_stmt = $conn1->prepare($this->sSQLCountRisaralda);
                    $countRisaralda_stmt->execute();
                    $countRisaralda = $countRisaralda_stmt->fetch(\PDO::FETCH_ASSOC)['conteo'];

                    $countstm1 = $conn1->prepare($this->countBoth);
                    $countstm1->execute();
                    $countrow = $countstm1->fetch(\PDO::FETCH_ASSOC);
                    $totalrows = $countrow['conteo'];

                    $html_body_top =        "<div class='main-table-content'>
                                                <div class='main-table-top-options'>
                                                    <div class='left-options'>
                                                        <div class='left-1'>
                                                            <div class='count-container1'><p id='total-count-caldas'>Caldas: $countCaldas</p></div>
                                                            <div class='count-container2'><p id='total-count-ris'>Risaralda: $countRisaralda</p></div>
                                                            <div class='count-container3'><p id='total-count-both'>Total: $totalrows</p></div>
                                                        </div>
                                                        <div class='left-2'>
                                                            <p>Ordenar registros por:</p>
                                                            <select id='sort' name='sort' class='form-select'>
                                                                <option value='NombreOperario' selected>Nombre</option>
                                                                <option value='Grupo'>Grupo</option>
                                                                <option value='FechaRealInicio'>Fecha Inicio</option>
                                                                <option value='FechaRealFin'>Fecha Final</option>
                                                                <option value='NroOperario'>Cédula</option>
                                                                <option value='Direccion'>Dirección</option>
                                                                <option value='NroSitio'>Contrato</option>
                                                                <option value='TipoTarea'>Tarea</option>
                                                                <option value='Prioridad'>Prioridad</option>
                                                                <option value='Cierre3'>Cierre</option>
                                                                <option value='duracion'>Duración</option>
                                                            </select>
                                                            <button class='sortAsc active'></button>
                                                            <button class='sortDesc'></button>
                                                        </div>
                                                    </div> 
                                                    <div class='right-options'>
                                                        <div class='view-grouped'>
                                                            <p>Visualizar inspecciones agrupadas por inspector</p>
                                                            <button id='view-grouped-table'><img src='assets/img/search.svg' alt='search-icon'></button>
                                                        </div>
                                                    </div>
                                                </div>";

                    $html_table_container =    '<div class="flex-end-table-container">
                                                    <div class="main-table">
                                                        <div class="top-table-opc">
                                                            <div class="show-gdw-colors-container">
                                                                <p>Mostrar colores GDW</p> 
                                                                <label class="switch">
                                                                    <input type="checkbox" id="toggle-colors">
                                                                    <span class="slider"></span>
                                                                </label>
                                                            </div> 
                                                        </div>';
                    $html_table_header =               '<div class="table-overflow-container">
                                                            <table class="table3">
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th data-sort="Grupo">Grupo</th>
                                                                        <th data-sort="Direccion">Dirección</th>
                                                                        <th data-sort="FechaRealInicio">Fecha Inicio</th>
                                                                        <th data-sort="FechaRealFin">Fecha Final</th>
                                                                        <th data-sort="NroOperario">Cédula</th>
                                                                        <th data-sort="NombreOperario">Nombre</th>
                                                                        <th data-sort="NroSitio">Contrato</th>
                                                                        <th data-sort="TipoTarea">Tarea</th>
                                                                        <th data-sort="Prioridad">Prioridad</th>
                                                                        <th data-sort="Cierre3">Cierre</th>
                                                                        <th data-sort="duracion">Duración</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>';
                        
                            
                    $html_table_body = "";
                    $counter = 1;

                    foreach ($data as $row){

                        $html_table_body.="<tr>";
                        $html_table_body.="<td>". htmlspecialchars(utf8_encode($counter)) . "</td>";
                        $html_table_body.="<td data-sort='Grupo'>". htmlspecialchars(utf8_encode($row['Grupo'])) . "</td>";
                        $html_table_body.="<td data-sort='Direccion'>". htmlspecialchars(utf8_encode($row['Direccion'])) . "</td>";
                        $html_table_body.="<td data-sort='FechaRealInicio'>". htmlspecialchars(utf8_encode($row['FechaRealInicio'])) . "</td>";
                        $html_table_body.="<td data-sort='FechaRealFin'>". htmlspecialchars(utf8_encode($row['FechaRealFin'])) . "</td>";
                        $html_table_body.="<td data-sort='NroOperario'>". htmlspecialchars(utf8_encode($row['NroOperario'])) . "</td>";
                        $html_table_body.="<td data-sort='NombreOperario'>". htmlspecialchars(utf8_encode($row['NombreOperario'])) . "</td>";
                        $html_table_body.="<td data-sort='NroSitio'>". htmlspecialchars(utf8_encode($row['NroSitio'])) . "</td>";
                        $html_table_body.="<td data-sort='TipoTarea'>". htmlspecialchars(utf8_encode($row['TipoTarea'])) . "</td>";
                        $html_table_body.="<td data-sort='Prioridad'>". htmlspecialchars(utf8_encode($row['Prioridad'])) . "</td>";
                        $html_table_body.="<td data-sort='Cierre3'>". htmlspecialchars(utf8_encode($row['Cierre3'])) . "</td>";
                        $html_table_body.="<td data-sort='duracion'>". htmlspecialchars(utf8_encode($row['duracion'])) . "</td>";
                        $html_table_body.="</tr>";
                        $counter++;

                    }
                
                } catch (PDOException $e) {
                    echo "Error al ejecutar la consulta para obtener las inspecciones de ambos departamentos dentro del rango de fecha seleccionado: " . $e->getMessage();
                }
            
            } else {

                //inicio de construcción de contenido HTML.
                $html_body_top =        "<div class='main-table-content'>
                                            <div class='main-table-top-options'>
                                                <div class='left-options'>
                                                    <div class='left-1'>
                                                        <div class='count-container'><p class='count-records'>El número total de inspecciones para el filtro aplicado es: $totalregistros</p></div>
                                                    </div>
                                                    <div class='left-2'>
                                                        <p>Ordenar registros por:</p>
                                                        <select id='sort' name='sort' class='form-select'>
                                                            <option value='NombreOperario' selected>Nombre</option>
                                                            <option value='FechaRealInicio'>Fecha Inicio</option>
                                                            <option value='FechaRealFin'>Fecha Final</option>
                                                            <option value='NroOperario'>Cédula</option>
                                                            <option value='Direccion'>Dirección</option>
                                                            <option value='NroSitio'>Contrato</option>
                                                            <option value='TipoTarea'>Tarea</option>
                                                            <option value='Prioridad'>Prioridad</option>
                                                            <option value='Cierre3'>Cierre</option>
                                                            <option value='duracion'>Duración</option>
                                                        </select>
                                                        <button class='sortAsc active' title='Orden Ascendente'></button>
                                                        <button class='sortDesc' title='Orden Descendente'></button>
                                                    </div>
                                                </div> 
                                                <div class='right-options'>
                                                    <div class='view-grouped'>
                                                        <p>Visualizar inspecciones agrupadas por inspector</p>
                                                        <button id='view-grouped-table'><img src='assets/img/search.svg' alt='search-icon'></button>
                                                    </div>
                                                </div>
                                            </div>";

                $html_table_container =    '<div class="flex-end-table-container">
                                                <div class="main-table">
                                                    <div class="top-table-opc">
                                                       <div class="show-gdw-colors-container">
                                                            <p>Mostrar colores GDW</p> 
                                                            <label class="switch">
                                                                <input type="checkbox" id="toggle-colors">
                                                                <span class="slider"></span>
                                                            </label>
                                                       </div> 
                                                    </div>';
                $html_table_header =                '<div class="table-overflow-container">
                                                        <table class="table1">
                                                            <div class="static-header">
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th data-sort="Direccion">Dirección</th>
                                                                        <th data-sort="FechaRealInicio">Fecha Inicio</th>
                                                                        <th data-sort="FechaRealFin">Fecha Final</th>
                                                                        <th data-sort="NroOperario">Cédula</th>
                                                                        <th data-sort="NombreOperario">Nombre</th>
                                                                        <th data-sort="NroSitio">Contrato</th>
                                                                        <th data-sort="TipoTarea">Tarea</th>
                                                                        <th data-sort="Prioridad">Prioridad</th>
                                                                        <th data-sort="Cierre3">Cierre</th>
                                                                        <th data-sort="duracion">Duración</th>
                                                                    </tr>
                                                                </thead>
                                                            </div>
                                                            <tbody>';

                try {

                    $dataFromGDW = array();
                    $conn1 = connectGDW();
                    $stm1 = $conn1->prepare($this->sSQL1);
                    $stm1->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
                    $stm1->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
                    $stm1->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
                    $stm1->execute();
                    $dataFromGDW = $stm1->fetchAll(\PDO::FETCH_ASSOC);
                        
                    $html_table_body = "";

                    $counter = 1;

                    foreach ($data as $row){

                        $html_table_body.="<tr>";
                        $html_table_body.="<td>". htmlspecialchars(utf8_encode($counter)) . "</td>";
                        // $html_table_body.="<td data-sort='Depto'>". htmlspecialchars(utf8_encode($row['Depto'])) . "</td>";
                        $html_table_body.="<td data-sort='Direccion'>". htmlspecialchars(utf8_encode($row['Direccion'])) . "</td>";
                        $html_table_body.="<td data-sort='FechaRealInicio'>". htmlspecialchars(utf8_encode($row['FechaRealInicio'])) . "</td>";
                        $html_table_body.="<td data-sort='FechaRealFin'>". htmlspecialchars(utf8_encode($row['FechaRealFin'])) . "</td>";
                        $html_table_body.="<td data-sort='NroOperario'>". htmlspecialchars(utf8_encode($row['NroOperario'])) . "</td>";
                        $html_table_body.="<td data-sort='NombreOperario'>". htmlspecialchars(utf8_encode($row['NombreOperario'])) . "</td>";
                        $html_table_body.="<td data-sort='NroSitio'>". htmlspecialchars(utf8_encode($row['NroSitio'])) . "</td>";
                        $html_table_body.="<td data-sort='TipoTarea'>". htmlspecialchars(utf8_encode($row['TipoTarea'])) . "</td>";
                        $html_table_body.="<td data-sort='Prioridad'>". htmlspecialchars(utf8_encode($row['Prioridad'])) . "</td>";
                        $html_table_body.="<td data-sort='Cierre3'>". htmlspecialchars(utf8_encode($row['Cierre3'])) . "</td>";
                        $html_table_body.="<td data-sort='duracion'>". htmlspecialchars(utf8_encode($row['duracion'])) . "</td>";
                        $html_table_body.="</tr>";
                        $counter++;

                    }

                } catch (PDOException $e){
                    echo "Error al ejecutar la consulta para obtener las inspecciones del departamento y rango de fecha seleccionados: " . $e->getMessage();
                }

                //-----------------------------------------------------------------------------------------------------------------------------------------------------

                $insertSuccess = $this->insertDBLocal($data, $departamento, $fecha_inicio, $fecha_final);

                if($insertSuccess === true){
                    echo "<script>console.log('Se ha actualizado correctamente la BD Local con las inspecciones para este rango de fecha y sucursal.');</script>";
                } elseif ($insertSuccess === false){
                    echo "<script>console.log('Las inspecciones para este rango de fecha y sucursal ya existen en la BD Local.');</script>";
                } else {
                    echo "<script>console.log('Error al insertar las inspecciones en la BD Local.');</script>";
                }

                //-----------------------------------------------------------------------------------------------------------------------------------------------------
            
            }

            $html_response = "";
         
            $html_response.= $html_body_top;
            $html_response.= $html_table_container;
            $html_response.= $html_table_header;
            $html_response.= $html_table_body;
            $html_response.= "</tbody>";
            $html_response.= "</table>";
            $html_response.= "</div>";
            $html_response.= "</div>";
            $html_response.= "</div>";  
            $html_response.= "</div>";

            if ($totalregistros == 0){
                $html_index_placeholder  = "<div class='index-placeholder'>";
                $html_index_placeholder .= "<div class='placeholder-img'><img src='assets/img/info-icon.png' alt='Info Icon'/></div>";
                $html_index_placeholder .= "<div class='placeholder-info'><p>No hay inspecciones para mostrar dentro del rango de fecha y departamento(s) seleccionados.</p></div>";
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

?>