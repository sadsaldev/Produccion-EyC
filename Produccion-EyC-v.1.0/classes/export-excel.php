<?php
require_once '../connections/connectGDW.php';
require_once '../vendor/autoload.php';
require_once '../connections/sql-queries.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$opcion = $_POST['opcion'];
$fecha_inicio = $_POST['fecha_inicio'];
$fecha_final = $_POST['fecha_final'];

class  ExportToExcel {
    private $allqueries;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }

    public function generateExcel($opcion, $fecha_inicio, $fecha_final){
        try {
            $data = $this->getDatatoExport($opcion, $fecha_inicio, $fecha_final);

            // if (empty($data)){
            //     $emptyBlob = new \stdClass();
            //     $blob = new \stdClass();
            //     $blob->size = 0;
            //     $blob->type = 'application/octet-stream';
            //     echo json_encode($blob);
            //     return;
            // }

            $this->createSpreadsheet($data);

        } catch (PDOException $e) {
            $error_message = "Error de conexión a Base de Datos de GoDoWorks al solicitar el exporte de Excel: " . $e->getMessage();
            echo "<script>window.alert('$error_message')</script>";
        }
    }

    private function getDatatoExport($opcion, $fecha_inicio, $fecha_final){
        try {

            $conn1 = connectGDW();

            if ($opcion == 'both') {
                $excelSQL2 = $this->allqueries->get_excelSQL2($fecha_inicio, $fecha_final);
                
                $stmt = $conn1->prepare($excelSQL2);

                $stmt->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
                $stmt->bindParam(':fecha_final', $fecha_final, PDO::PARAM_STR);
            
                $stmt->execute();
                $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $rs;
                
            } else {
                $excelSQL1 = $this->allqueries->get_excelSQL1($opcion, $fecha_inicio, $fecha_final);
                
                $stmt = $conn1->prepare($excelSQL1);

                $stmt->bindParam(':opcion', $opcion, PDO::PARAM_STR);
                $stmt->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
                $stmt->bindParam(':fecha_final', $fecha_final, PDO::PARAM_STR);
            
                $stmt->execute();
                $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $rs;
            }

        } catch (PDOException $e) {
            $error_message = "Error al ejecutar la consulta en la Base de Datos de GoDoWorks para generar el exporte a Excel con los datos solicitados: " . $e->getMessage();
            echo "<script>window.alert('$error_message')</script>";
        }
    }

    private function createSpreadsheet($data){

        // Verificar si hay datos para exportar
        if(empty($data)) {
            echo json_encode(array("error" => "No hay datos disponibles para exportar."));
            return; // Terminar la ejecución si no hay datos
        }
        
        // Crear un nuevo libro de Excel y agregar los datos de la consulta
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("inspecciones");
            
        // Agregar encabezados de columna en la hoja de cálculo
        $sheet->setCellValue('A1', 'Departamento');
        $sheet->setCellValue('B1', 'Dirección');
        $sheet->setCellValue('C1', 'Fecha Inicio');
        $sheet->setCellValue('D1', 'Fecha Fin');
        $sheet->setCellValue('E1', 'Cédula Operario');
        $sheet->setCellValue('F1', 'Nombre Operario');
        $sheet->setCellValue('G1', 'Contrato');
        $sheet->setCellValue('H1', 'Tipo Tarea');
        $sheet->setCellValue('I1', 'Prioridad');
        $sheet->setCellValue('J1', 'Cierre');
        $sheet->setCellValue('K1', 'Duración');

        $row = 2;

        // Agregar los datos a la hoja de cálculo
        foreach($data as $row_data){
            
            $sheet->setCellValue('A'.$row, $row_data['Depto']);
            $sheet->setCellValue('B'.$row, $row_data['Direccion']);
            $sheet->setCellValue('C'.$row, $row_data['FechaRealInicio']);
            $sheet->setCellValue('D'.$row, $row_data['FechaRealFin']);
            $sheet->setCellValue('E'.$row, $row_data['NroOperario']);
            $sheet->setCellValue('F'.$row, $row_data['NombreOperario']);
            $sheet->setCellValue('G'.$row, $row_data['NroSitio']);
            $sheet->setCellValue('H'.$row, $row_data['TipoTarea']);
            $sheet->setCellValue('I'.$row, $row_data['Prioridad']);
            $sheet->setCellValue('J'.$row, $row_data['Cierre3']);
            $sheet->setCellValue('K'.$row, $row_data['duracion']);

            $row ++; 
        }

        // Aplicar formato a la hoja de cálculo
        $spreadsheet->getActiveSheet()->getStyle('A1:K1')->getFont()->setBold(true);
        $spreadsheet->getActiveSheet()->getStyle('A1:K1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('CCCCCC');

        // Ajustar el ancho de las columnas automáticamente
        foreach(range('A','K') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        // Configurar las cabeceras para la descarga del archivo Excel
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="inspecciones.xlsx"');
        header('Cache-Control: max-age=0');

        //Guardar el libro Excel y enviarlo al navegador
        $writer = new Xlsx($spreadsheet);
        ob_clean();
        $writer->save('php://output');
        exit;
    }
}

$exporter = new ExportToExcel(new SQLqueries());
$exporter -> generateExcel($opcion, $fecha_inicio, $fecha_final);

?>