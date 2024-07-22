<?php
namespace App;

//Llamada a la conexión a la BD de GDW
require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/sql-queries.php';

//Esta clase maneja la lógica relacionada con la agrupación de inspecciones
class groupedTable {

    private $query;
    private $inspections;

    //Consulta encargada de agrupar las inspecciones por inspector dentro del rango de fecha y departamento seleccionados.
    private $groupedSQL;

    public function __construct(){
        $this->query = new SQLqueries();
    }

    private function getInspections($departamento, $fecha_inicio, $fecha_final){
    //Este método contiene las inspecciones del departamento e inspector específicos
        
        try {
            $conn1 = connectGDW();
            $this->groupedSQL = $this->query->get_groupedSQL($departamento, $fecha_inicio, $fecha_final);
            $stmt = $conn1->prepare($this->groupedSQL);
            $stmt->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
            $stmt->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
            $stmt->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
            $stmt->execute();
            $this->inspections = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            $conn1 = null;
            return $this->inspections;
        } catch(PDOException $e) {
            return "Error de conexión a base de datos de GoDoWorks para visualizar las inspecciones agrupadas por inspector: " . $e->getMessage();
        } finally {
            $conn1 = null;
        }
    }
    
    public function generateGroupedHTML() {
    //Este método construye dinámicamente el HTML para mostrar las inspecciones agrupadas

        try {
            $fecha_inicio   = date('Y-m-d', strtotime($_POST['fecha_inicio']));
            $fecha_final    = date('Y-m-d', strtotime($_POST['fecha_final']));
            $opcion         = $_POST['opcion'];

            switch($opcion){
                case 'INSP-RIS':
                    $departamento = 'INSP-RIS';
                    break;

                case 'INSP-CALDAS':
                    $departamento = 'INSP-CALDAS';
                    break;
                case 'both':
                    $departamento = 'Eje Cafetero';
                    break;
                default:
                    return;
            }

            if ($opcion === 'both'){
                 // Obtenemos las inspecciones de ambos departamentos
                $inspections_risaralda = $this->getInspections('INSP-RIS', $fecha_inicio, $fecha_final);
                $inspections_caldas = $this->getInspections('INSP-CALDAS', $fecha_inicio, $fecha_final);
                
                $inspections = array_merge($inspections_risaralda, $inspections_caldas);
            } else {
                // Obtener todas las inspecciones dentro del rango de fecha y departamento especificados
                $inspections = $this->getInspections($departamento, $fecha_inicio, $fecha_final);
            }

            $groupDisplay = "";

            if ($departamento === 'INSP-RIS'){
                $groupDisplay = "Risaralda";
            } else if ($departamento === 'INSP-CALDAS'){
                $groupDisplay = "Caldas";
            } else if ($departamento === 'Eje Cafetero') {
                $groupDisplay = "Eje Cafetero";
            }

            //Array para almacenar los inspectores con al menos una inspeccion a su nombre
            $inspectores_array = array();

            foreach ($inspections as $inspection) {
                $inspectores_array[$inspection['NombreOperario']][] = $inspection;
            }

            //Inicio de creación del encabezado HTML
            $html_response = "<div class='accordion-container'>
                                <div class='accordion-top'>
                                    <div class='left-options-accor'>
                                        <div class='left-1-accor'>
                                            <p>Equipo Inspectores Grupo $groupDisplay</p>
                                        </div>
                                        <div class='left-2-accor'>
                                            <p>Ordenar registros por:</p>
                                            <select id='sort2' name='sort2' class='form-select'>
                                                <option value='NombreOperario' selected>Nombre</option>
                                                <option value='NroOperario'>Cédula</option>
                                                <option value='totalInspections'>Cant Inspecciones</option>
                                            </select>
                                            <button class='sortAsc2 active' title='Orden Ascendente'></button>
                                            <button class='sortDesc2' title='Orden Descendente'></button>
                                        </div>
                                    </div> 
                                    <div class='right-options-accor'>
                                        <div class='back-table'>
                                            <p>Volver a la tabla principal</p>
                                            <button id='go-back'><img src='assets/img/arrow-back.svg' alt='back-button'></button>
                                        </div>
                                    </div> 
                                </div>
                                <div class ='flex-end-table-container'> 
                                    <div class='grouped-table'>
                                        <div class='top-table-opc-g'>
                                            <div class='show-gdw-colors-container-g'>
                                                <p>Mostrar colores GDW</p> 
                                                <label class='switch'>
                                                    <input type='checkbox' id='toggle-colors-g'>
                                                    <span class='slider'></span>
                                                </label>
                                            </div> 
                                        </div>
                                        <div class='table-overflow-container'>
                                            <div class='accordion' id='accordionExample'>";
            
            foreach ($inspectores_array as $inspector => $inspections) {
                        $inspector_id = str_replace(' ', '_', $inspector);
                        $nroOperario = isset($inspections[0]['NroOperario']) ? $inspections[0]['NroOperario'] : '';
                        $totalInspections = count($inspections);
                        $inspector_info = "$inspector, $nroOperario, $totalInspections"; 
                        $inspections_html = "<div class='accordion-item' data-inspector-info='$inspector_info'>
                                                <h2 class='accordion-header'>
                                                    <button class='accordion-button collapsed' id='btn{$inspector_id}' type='button' data-bs-toggle='collapse' data-bs-target='#collapse{$inspector_id}' aria-expanded='false' aria-controls='collapse{$inspector_id}'>
                                                        <p class='insp-data'>$inspector  -  $nroOperario <p class='each-counter'>($totalInspections)</p></p>
                                                    </button>
                                                </h2>
                                                <div id='collapse{$inspector_id}' class='accordion-collapse collapse' data-bs-parent='#accordionExample'>
                                                    <div class='accordion-body'>
                                                        <table class='table2'>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th data-sort='Direccion'>Dirección</th>
                                                                    <th data-sort='FechaRealInicio'>Fecha Inicio</th>
                                                                    <th data-sort='FechaRealFin'>Fecha Final</th>
                                                                    <th data-sort='NroSitio'>Contrato</th>
                                                                    <th data-sort='TipoTarea'>Tarea</th>
                                                                    <th data-sort='Prioridad'>Prioridad</th>
                                                                    <th data-sort='Cierre3'>Cierre</th>
                                                                    <th data-sort='duracion'>Duración</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>";
                                
                $counter = 1;
                                
                foreach ($inspections as $inspection) {
                    if ($inspection['NombreOperario'] === $inspector) {
                        $inspections_html .= "<tr>";
                        $inspections_html .= "<td data-counter='{$counter}'>" . htmlspecialchars($counter) . "</td>";
                        $inspections_html .= "<td data-sort='Direccion'>" . htmlspecialchars(utf8_encode($inspection['Direccion'])) . "</td>";
                        $inspections_html .= "<td data-sort='FechaRealInicio'>" . htmlspecialchars(utf8_encode($inspection['FechaRealInicio'])) . "</td>";
                        $inspections_html .= "<td data-sort='FechaRealFin'>" . htmlspecialchars(utf8_encode($inspection['FechaRealFin'])) . "</td>";
                        $inspections_html .= "<td data-sort='NroSitio'>" . htmlspecialchars(utf8_encode($inspection['NroSitio'])) . "</td>";
                        $inspections_html .= "<td data-sort='TipoTarea'>" . htmlspecialchars(utf8_encode($inspection['TipoTarea'])) . "</td>";
                        $inspections_html .= "<td data-sort='Prioridad'>" . htmlspecialchars(utf8_encode($inspection['Prioridad'])) . "</td>";
                        // $inspections_html .= "<td>{$inspection['FechaVisita']}</td>";
                        $inspections_html .= "<td data-sort='Cierre3'>". htmlspecialchars(utf8_encode($inspection['Cierre3'])) . "</td>";
                        $inspections_html .= "<td data-sort='duracion'>" . htmlspecialchars(utf8_encode($inspection['duracion'])) . "</td>";
                        $inspections_html .= "</tr>";
                        $counter++;
                    }
                }
                                
                $inspections_html .=                       "</tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>";
                                
                $html_response .= $inspections_html;
            }        
            
                $html_response.=            "</div>
                                        </div>
                                    </div>
                                </div>
                            </div>"; 

            session_start();

            if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role']) && $_SESSION['role']){
                return $html_response;
            } else {
                return "No hay sesión activa.";
            }
        } catch(PDOException $e) {
            return "Error al ejecutar la consulta en la Base de Datos de GoDoWorks para obtener las inspecciones agrupadas por inspector: " . $e->getMessage();
        }
    }
}

?>