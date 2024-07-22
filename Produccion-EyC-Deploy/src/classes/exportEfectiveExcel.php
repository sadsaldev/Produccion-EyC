<?php

namespace App;

require_once SRC_PATH . '/connections/connectGDW.php';
require_once SRC_PATH . '/connections/SQLqueries.php';
require_once '../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class exportEfectiveExcel {
    private $allqueries;

    public function __construct(){
        $this->allqueries = new SQLqueries();
    }

    public function generateEfectiveExcel($departamento, $fecha_inicio, $fecha_final){
        try {
            if ($departamento == 'both') {
                $data = $this->getDatatoExport($departamento, $fecha_inicio, $fecha_final);
                $dataRIS = array_filter($data, function($row) {
                    return $row['Grupo'] == 'INSP-RIS';
                });
                $dataCaldas = array_filter($data, function($row) {
                    return $row['Grupo'] == 'INSP-CALDAS';
                });
                $this->createSpreadsheet($dataRIS, $dataCaldas);
            } else {
                $data = $this->getDatatoExport($departamento, $fecha_inicio, $fecha_final);
                $this->createSpreadsheet($data, null, $departamento);
            }
        } catch (PDOException $e) {
            $error_message = "Error de conexión a Base de Datos de GoDoWorks al solicitar el exporte de Excel: " . $e->getMessage();
            echo json_encode(["error" => $error_message]);
        }
    }

    private function getDatatoExport($departamento, $fecha_inicio, $fecha_final){
        try {
            $conn1 = connectGDW();
            if ($departamento == 'both') {
                $sSQL2 = $this->allqueries->get_SQLboth($fecha_inicio, $fecha_final);
                $stmt = $conn1->prepare($sSQL2);
                $stmt->execute();
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
            } else {
                $sSQL1 = $this->allqueries->get_sSQL1($departamento, $fecha_inicio, $fecha_final);
                $stmt = $conn1->prepare($sSQL1);
                $stmt->bindParam(':departamento', $departamento, \PDO::PARAM_STR);
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

    private function createSpreadsheet($dataRIS, $dataCaldas = null, $departamento = null){
        if (empty($dataRIS)) {
            echo json_encode(array("error" => "No hay datos disponibles para exportar."));
            return;
        }

        $spreadsheet = new Spreadsheet();

        // Crear hoja de inspecciones para INSP-RIS
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("Efectivas Risaralda");

        $this->fillInspectionSheet($sheet, $dataRIS);

        if ($dataCaldas !== null) {
            // Crear nueva hoja para INSP-CALDAS
            $spreadsheet->createSheet();
            $sheetCaldas = $spreadsheet->setActiveSheetIndex(1);
            $sheetCaldas->setTitle("Efectivas Caldas");

            $this->fillInspectionSheet($sheetCaldas, $dataCaldas);
        }

        // Crear tabla de resumen
        $this->createSummaryTable($spreadsheet, $dataRIS, 'Risaralda');

        if ($dataCaldas !== null) {
            $this->createSummaryTable($spreadsheet, $dataCaldas, 'Caldas');
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="inspecciones_' . $departamento . ' - ' . $fecha_inicio . ' - ' . $fecha_final . '.xlsx"');
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        ob_clean();
        $writer->save('php://output');
        exit;
    }

    private function fillInspectionSheet($sheet, $data) {
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

        $sheet->getStyle('A1:K1')->getFont()->setBold(true);
        $sheet->getStyle('A1:K1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('CCCCCC');

        foreach (range('A', 'K') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }

    private function createSummaryTable($spreadsheet, $data, $title) {
        $summarySheet = $spreadsheet->createSheet();
        $summarySheet->setTitle("Resumen " . $title);

        $summarySheet->setCellValue('A1', 'Inspector');
        $summarySheet->setCellValue('B1', 'Número de Inspecciones');

        $inspectores = array_reduce($data, function($acc, $row) {
            $inspector = $row['NombreOperario'];
            if (!isset($acc[$inspector])) {
                $acc[$inspector] = 0;
            }
            $acc[$inspector]++;
            return $acc;
        }, []);

        $row = 2;
        foreach ($inspectores as $inspector => $count) {
            $summarySheet->setCellValue('A' . $row, $inspector);
            $summarySheet->setCellValue('B' . $row, $count);
            $row++;
        }

        $summarySheet->getStyle('A1:B1')->getFont()->setBold(true);
        $summarySheet->getStyle('A1:B1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('CCCCCC');

        foreach (range('A', 'B') as $columnID) {
            $summarySheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }
}

?>

