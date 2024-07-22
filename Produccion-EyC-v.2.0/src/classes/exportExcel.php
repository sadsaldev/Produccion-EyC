<?php

namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/sql-queries.php';

require_once '../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class exportExcel {
    private $allqueries;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }

    public function generateExcel($opcion, $fecha_inicio, $fecha_final){
        try {
            $data = $this->getDatatoExport($opcion, $fecha_inicio, $fecha_final);
            $this->createSpreadsheet($data);
        } catch (PDOException $e) {
            $error_message = "Error de conexión a Base de Datos de GoDoWorks al solicitar el exporte de Excel: " . $e->getMessage();
            echo json_encode(["error" => $error_message]);
        }
    }

    private function getDatatoExport($opcion, $fecha_inicio, $fecha_final){
        try {
            $conn1 = connectGDW();
            if ($opcion == 'both') {
                $excelSQL2 = $this->allqueries->get_excelSQL2($fecha_inicio, $fecha_final);
                $stmt = $conn1->prepare($excelSQL2);
                $stmt->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
                $stmt->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
                $stmt->execute();
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
                
            } else {
                $excelSQL1 = $this->allqueries->get_excelSQL1($opcion, $fecha_inicio, $fecha_final);
                $stmt = $conn1->prepare($excelSQL1);
                $stmt->bindParam(':opcion', $opcion, \PDO::PARAM_STR);
                $stmt->bindParam(':fecha_inicio', $fecha_inicio, \PDO::PARAM_STR);
                $stmt->bindParam(':fecha_final', $fecha_final, \PDO::PARAM_STR);
                $stmt->execute();
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            $error_message = "Error al ejecutar la consulta en la Base de Datos de GoDoWorks para generar el exporte a Excel con los datos solicitados: " . $e->getMessage();
            echo json_encode(["error" => $error_message]);
        }
    }

    private function createSpreadsheet($data){
        if (empty($data)) {
            echo json_encode(array("error" => "No hay datos disponibles para exportar."));
            return;
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("inspecciones");

        $sheet->setCellValue('A1', 'Grupo');
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

        foreach ($data as $row_data) {
            $sheet->setCellValue('A'.$row, $row_data['Grupo']);
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

            $row++;
        }

        $spreadsheet->getActiveSheet()->getStyle('A1:K1')->getFont()->setBold(true);
        $spreadsheet->getActiveSheet()->getStyle('A1:K1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('CCCCCC');

        foreach (range('A', 'K') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="inspecciones_' . $_POST['opcion'] . ' - ' . $_POST['fecha_inicio'] . ' - ' . $_POST['fecha_final'] . '.xlsx"');
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        ob_clean();
        $writer->save('php://output');
        exit;
    }
}