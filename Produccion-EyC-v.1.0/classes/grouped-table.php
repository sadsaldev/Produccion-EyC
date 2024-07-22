<?php

//Llamada a la conexión a la BD de GDW
require_once '../connections/connectGDW.php';
require_once '../connections/sql-queries.php';

//Esta clase maneja la lógica relacionada con la agrupación de inspecciones
class groupedTable {

    private $query;
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

                $stmt->bindParam(':departamento', $departamento, PDO::PARAM_STR);
                $stmt->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
                $stmt->bindParam(':fecha_final', $fecha_final, PDO::PARAM_STR);

                $stmt->execute();
                $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $conn1 = null;

                return $rs;

            } catch(PDOException $e) {
                $error_message = "Error de conexión a Base de Datos de GoDoWorks: " . $e->getMessage();
        }
    }
    
    public function generateGroupedHTML() {
    //Este método construye dinámicamente el HTML para mostrar las inspecciones agrupadas

        try {

            $fecha_inicio   = date('Y-m-d', strtotime($_POST['fecha_inicio']));
            $fecha_final    = date('Y-m-d', strtotime($_POST['fecha_final']));
            $opcion         = $_POST['opcion'];


            switch(strtolower($opcion)){
                case 'risaralda':
                    $departamento = 'Risaralda';
                    break;

                case 'caldas':
                    $departamento = 'Caldas';
                    break;
                case 'both':
                    $departamento = 'Risaralda y Caldas';
                    break;
                default:
                    return;
            }

            if ($opcion === 'both'){
                 // Obtenemos las inspecciones de ambos departamentos
                $inspections_risaralda = $this->getInspections('Risaralda', $fecha_inicio, $fecha_final);
                $inspections_caldas = $this->getInspections('Caldas', $fecha_inicio, $fecha_final);
                
                $inspections = array_merge($inspections_risaralda, $inspections_caldas);

            } else {
                // Obtener todas las inspecciones dentro del rango de fecha y departamento especificados
                $inspections = $this->getInspections($departamento, $fecha_inicio, $fecha_final);
    
            }

            //Array para almacenar los inspectores con al menos una inspeccion a su nombre
            $inspectores_array = array();

            foreach ($inspections as $inspection) {
                $inspectores_array[$inspection['NombreOperario']][] = $inspection;
            }

            //Inicio de creación del encabezado HTML
            $html_content = "<div class='loader-container' style='display: none;'>
                                <div class='loader'></div>
                            </div>
                            <div class='accordion-container'>
                                <div class='accordion-top'>
                                    <div class='accordion-title'><h1 class='team-title'>Inspectores $departamento</n1>
                                        </div>
                                        <div class='back-button'>
                                            <p class='back-info'>Volver</p>
                                            <button id='back-to-general'><img src='resources/back.svg'></button>
                                        </div>  
                                    </div>
                                <div class='accordion' id='accordionExample'>";
            
            foreach ($inspectores_array as $inspector => $inspections) {
                        $inspector_id = str_replace(' ', '_', $inspector);
                        $nroOperario = isset($inspections[0]['NroOperario']) ? $inspections[0]['NroOperario'] : '';
                        $totalInspections = count($inspections);
                        $inspector_info = "$inspector - $nroOperario <p class='each-counter'>($totalInspections)</p>"; 
                        $inspections_html = "<div class='accordion-item'>
                                                <h2 class='accordion-header'>
                                                    <button class='accordion-button collapsed' id='btn{$inspector_id}' type='button' data-bs-toggle='collapse' data-bs-target='#collapse{$inspector_id}' aria-expanded='false' aria-controls='collapse{$inspector_id}'>
                                                        $inspector_info
                                                    </button>
                                                </h2>
                                            <div id='collapse{$inspector_id}' class='accordion-collapse collapse' data-bs-parent='#accordionExample'>
                                                <div class='accordion-body'>
                                                    <table class='table2 table-hover'>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th class='direccion'>Dirección</th>
                                                                <th>Fecha Inicio</th>
                                                                <th>Fecha Final</th>
                                                                <th>Contrato</th>
                                                                <th>Tarea</th>
                                                                <th>Prioridad</th>
                                                                <th class='cierre'>Cierre</th>
                                                                <th>Duración</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>";
                                
                $counter = 1;
                                
                foreach ($inspections as $inspection) {
                    if ($inspection['NombreOperario'] === $inspector) {
                        $inspections_html .= "<tr>";
                        $inspections_html .= "<td>{$counter}</td>";
                        $inspections_html .= "<td>{$inspection['Direccion']}</td>";
                        $inspections_html .= "<td>{$inspection['FechaRealInicio']}</td>";
                        $inspections_html .= "<td>{$inspection['FechaRealFin']}</td>";
                        $inspections_html .= "<td>{$inspection['NroSitio']}</td>";
                        $inspections_html .= "<td>{$inspection['TipoTarea']}</td>";
                        $inspections_html .= "<td>{$inspection['Prioridad']}</td>";
                        // $inspections_html .= "<td>{$inspection['FechaVisita']}</td>";
                        $inspections_html .= "<td>{$inspection['Cierre3']}</td>";
                        $inspections_html .= "<td>{$inspection['duracion']}</td>";
                        $inspections_html .= "</tr>";
                        $counter++;
                    }
                }
                                
                $inspections_html .= "</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>";
                                
                $html_content .= $inspections_html;
            }        
            
            $html_content.=     "</div>
                            </div>";

            return $html_content;

        } catch(PDOException $e) {
            $error_message = "Error al ejecutar la consulta en la Base de Datos de GoDoWorks para obtener las inspecciones agrupadas por inspector: " . $e->getMessage();
        }

        if  (isset($error_message)) {
            $html_index_placeholder = "<div class='index-placeholder'>";
            $html_index_placeholder.= "<p class='placeholder-info'>$error_message</p>";
            $html_index_placeholder.= "</div>";
            return $html_index_placeholder;
        }
    }
}
    
//Inicialización de la clase groupedTable()
$groupedTable = new groupedTable(); 

//Llamada a html_content para que se genere todo el contenido en la página
$html_content = $groupedTable->generateGroupedHTML();
    
echo $html_content;

//Este código escencialmente depende de main-table.php pues es una interfaz que 
//se carga a partir de la ejecución de un botón presente en main-table.php
//mostrando así las mismas inspecciones de la tabla principal pero ahora agrupadas por inspector.

?>