<?php

namespace App;

require_once '../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class exportNetExcel {
    public function generateNetExcel($dataArray, $counts) {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("Info Contratos");

        // Estilo común para encabezados de tabla
        $headerStyle = [
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'CCCCCC']]
        ];

        // Primera tabla: encabezado y datos de $dataArray
        $sheet->setCellValue('A1', 'Grupo');
        $sheet->setCellValue('B1', 'Contrato');
        $sheet->setCellValue('C1', 'Fecha Inicio');
        $sheet->setCellValue('D1', 'Fecha Final');
        $sheet->setCellValue('E1', 'Fecha Visita');
        $sheet->setCellValue('F1', 'Cedula');
        $sheet->setCellValue('G1', 'Nombre');
        $sheet->setCellValue('H1', 'Tipo Tarea');
        $sheet->setCellValue('I1', 'Estado');
        $sheet->setCellValue('J1', 'Cierre');
        $sheet->setCellValue('K1', 'Duración');

        $row = 2;
        foreach ($dataArray as $data) {
            $sheet->setCellValue('A' . $row, $data['Grupo']);
            $sheet->setCellValue('B' . $row, $data['NroSitio']);
            $sheet->setCellValue('C' . $row, $data['FechaRealInicio']);
            $sheet->setCellValue('D' . $row, $data['FechaRealFin']);
            $sheet->setCellValue('E' . $row, $data['FechaVisita']);
            $sheet->setCellValue('F' . $row, $data['NroOperario']);
            $sheet->setCellValue('G' . $row, $data['NombreOperario']);
            $sheet->setCellValue('H' . $row, $data['TipoTarea']);
            $sheet->setCellValue('I' . $row, $data['Estado']);
            $sheet->setCellValue('J' . $row, $data['Cierre3']);
            $sheet->setCellValue('K' . $row, $data['duracion']);
            $row++;
        }

        // Aplicar estilo a los encabezados de la primera tabla
        $sheet->getStyle('A1:K1')->applyFromArray($headerStyle);

        // Segunda tabla: encabezado y datos de $counts
        $startRowCounts = $row + 2; // Añadir espacio entre tablas
        $sheet->setCellValue('A' . $startRowCounts, 'En Oficina');
        $sheet->setCellValue('B' . $startRowCounts, 'Efectivo');
        $sheet->setCellValue('C' . $startRowCounts, 'Visitas Perdidas');
        $sheet->setCellValue('D' . $startRowCounts, 'En Campo');
        $sheet->setCellValue('E' . $startRowCounts, 'No Visitado');
        $sheet->setCellValue('F' . $startRowCounts, 'Motivo Tecnico');
        $sheet->setCellValue('G' . $startRowCounts, 'Suspendido');

        $sheet->setCellValue('A' . ($startRowCounts + 1), $counts['enOficina']);
        $sheet->setCellValue('B' . ($startRowCounts + 1), $counts['efectivo']);
        $sheet->setCellValue('C' . ($startRowCounts + 1), $counts['vps']);
        $sheet->setCellValue('D' . ($startRowCounts + 1), $counts['enCampo']);
        $sheet->setCellValue('E' . ($startRowCounts + 1), $counts['noVisitado']);
        $sheet->setCellValue('F' . ($startRowCounts + 1), $counts['motivoTecnico']);
        $sheet->setCellValue('G' . ($startRowCounts + 1), $counts['suspendidas']);

        // Aplicar estilo a los encabezados de la segunda tabla
        $sheet->getStyle('A' . $startRowCounts . ':G' . $startRowCounts)->applyFromArray($headerStyle);

        // Tercera tabla: encabezado y datos de $counts['detalleEfectivo']
        $startRowDetalleEfectivo = $startRowCounts + 4; // Añadir espacio entre tablas
        $sheet->setCellValue('A' . $startRowDetalleEfectivo, 'Certificadas');
        $sheet->setCellValue('B' . $startRowDetalleEfectivo, 'Certificadas con Novedad');
        $sheet->setCellValue('C' . $startRowDetalleEfectivo, 'Inspeccionadas');
        $sheet->setCellValue('D' . $startRowDetalleEfectivo, 'Inspeccionadas con Defecto Crítico');
        $sheet->setCellValue('E' . $startRowDetalleEfectivo, 'Inspeccionadas con Defecto No Crítico');

        $sheet->setCellValue('A' . ($startRowDetalleEfectivo + 1), $counts['detalleEfectivo']['certificados']);
        $sheet->setCellValue('B' . ($startRowDetalleEfectivo + 1), $counts['detalleEfectivo']['certificadosConNovedad']);
        $sheet->setCellValue('C' . ($startRowDetalleEfectivo + 1), $counts['detalleEfectivo']['inspeccionados']);
        $sheet->setCellValue('D' . ($startRowDetalleEfectivo + 1), $counts['detalleEfectivo']['inspeccionadosConDefectoCritico']);
        $sheet->setCellValue('E' . ($startRowDetalleEfectivo + 1), $counts['detalleEfectivo']['inspeccionadosConDefectoNoCritico']);

        // Aplicar estilo a los encabezados de la tercera tabla
        $sheet->getStyle('A' . $startRowDetalleEfectivo . ':E' . $startRowDetalleEfectivo)->applyFromArray($headerStyle);

        // Ajustar tamaño automático de las columnas
        foreach (range('A', 'K') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Comité_Redes_Nuevas_' . date('Y-m-d') . '.xlsx';

        // Enviar el archivo al navegador
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit;
    }
}

?>
