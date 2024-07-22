<?php 

class SQLqueries {
    //consultas usadas en main-table.php 
    public static function get_sSQL1($departamento, $fecha_inicio, $fecha_final){
        return "SELECT Depto, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE Depto = '$departamento'
                    AND (
                            (DATE(FechaRealInicio) = DATE('$fecha_final')) OR (FechaRealInicio BETWEEN '$fecha_inicio' AND '$fecha_final')
                        ) 
                    AND (
                            (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            ) 
                            OR 
                            (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                            )
                            OR 
                            (TipoTarea = 'RP 12170'
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            )
                            OR 
                            (TipoTarea = 'RN 10772'
                            AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                            )
                        ) 
                        
                    AND NroSitio NOT LIKE '%prueba%' ORDER BY NombreOperario ASC"; 
    }

    public static function get_sSQL2($departamento, $fecha_inicio, $fecha_final) {
        return "INSERT INTO cortes_$departamento (rango_corte1, rango_corte2, Depto, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, Duracion, unique_code) VALUES (:fecha_inicio, :fecha_final, :Depto, :Direccion, :FechaRealInicio, :FechaRealFin, :NroOperario, :NombreOperario, :NroSitio, :TipoTarea, :Prioridad, :Cierre3, :duracion, :unique_code)";
    }

    public static function get_sSQL3($departamento, $fecha_inicio, $fecha_final) {
        return "SELECT COUNT(*) AS count FROM cortes_$departamento WHERE rango_corte1 = :fecha_inicio AND rango_corte2 = :fecha_final";
    }

    public static function get_sSQL3ByCode($departamento){
        return "SELECT COUNT(*) AS count FROM cortes_$departamento WHERE unique_code = :unique_code";
    }   

    public static function get_sSQL4($departamento, $fecha_inicio, $fecha_final){
        return "SELECT * FROM cortes_$departamento WHERE rango_corte1 = :fecha_inicio AND rango_corte2 = :fecha_final";
    }

    public static function get_countSQL($departamento, $fecha_inicio, $fecha_final) {
        $sSQL1 = self::get_sSQL1($departamento, $fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($sSQL1) AS subconsulta";
    }

    // public static function get_recentSQL($departamento, $fecha_inicio, $fecha_final){
    //     return "SELECT MAX(FechaRealFin) AS FechaRealFin FROM Tasks WHERE Depto = $departamento AND (DATE(FechaRealInicio) = DATE('$fecha_final')) OR (FechaRealInicio BETWEEN '$fecha_inicio' AND '$fecha_final')"; 
    // }

    // public static function get_recentLocalSQL($departamento, $fecha_inicio, $fecha_final){
    //     return "SELECT MAX(FechaRealFin) AS FechaRealFin FROM cortes_$departamento WHERE rango_corte1 = :fecha_inicio AND rango_corte2 = :fecha_final";
    // }

    // public static function get_verifyLocalSQL($departamento, $fecha_inicio, $fecha_final){
    //     return "SELECT COUNT(*) AS count FROM cortes_$departamento WHERE rango_corte1 = :fecha_inicio AND rango_corte2 = :fecha_final";
    // }

    // public static function get_countINSP(){
    //     return "SELECT COUNT(*) AS count FROM inspectores WHERE NroOperario = :NroOperario";
    // }

    // public static function get_SQLINSP(){
    //     return "INSERT INTO inspectores (NombreOperario, NroOperario) VALUES (:NombreOperario, :NroOperario)";
    // }

    public static function get_SQLboth($fecha_inicio, $fecha_final){
        return "SELECT Depto, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE (Depto = 'RISARALDA' OR Depto = 'CALDAS')
                    AND (
                            (DATE(FechaRealInicio) = DATE('$fecha_final')) OR (FechaRealInicio BETWEEN '$fecha_inicio' AND '$fecha_final')
                        ) 
                    AND (
                            (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            ) 
                            OR 
                            (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                            )
                            OR 
                            (TipoTarea = 'RP 12170'
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            )
                            OR 
                            (TipoTarea = 'RN 10772'
                            AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                            )
                        ) 
                        
                    AND NroSitio NOT LIKE '%prueba%' ORDER BY Depto, NombreOperario ASC";
    }

    public static function get_countBoth($fecha_inicio, $fecha_final){
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta";
    }

    public static function get_sSQLCountCaldas($fecha_inicio, $fecha_final) {
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta WHERE Depto = 'CALDAS'";
    }

    public static function get_sSQLCountRisaralda($fecha_inicio, $fecha_final) {
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta WHERE Depto = 'RISARALDA'";
    }

    //consulta usada en grouped-table.php
    public static function get_groupedSQL($departamento, $fecha_inicio, $fecha_final) {
        return "SELECT Direccion, FechaRealInicio, FechaRealFin,  NombreOperario, NroOperario, NroSitio, TipoTarea, Prioridad, FechaVisita, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion
                FROM Tasks 
                WHERE Depto = :departamento 
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
                        ) 
                    AND (
                            (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            ) 
                            OR 
                            (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                            )
                            OR 
                            (TipoTarea = 'RP 12170'
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            )
                            OR 
                            (TipoTarea = 'RN 10772'
                            AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                            )
                        ) 
                    
                AND NroSitio NOT LIKE '%prueba%' ORDER BY NombreOperario ASC";
    }

    public static function get_excelSQL1($opcion, $fecha_inicio, $fecha_final){
        return "SELECT Depto, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE Depto = :opcion
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
                        ) 
                    AND (
                            (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            ) 
                            OR 
                            (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                            )
                            OR 
                            (TipoTarea = 'RP 12170'
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            )
                            OR 
                            (TipoTarea = 'RN 10772'
                            AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                            )
                        ) 
                        
                    AND NroSitio NOT LIKE '%prueba%' ORDER BY NombreOperario ASC";
    }

    public static function get_excelSQL2($fecha_inicial, $fecha_final){
        return "SELECT Depto, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE (Depto = 'caldas' OR Depto = 'risaralda')
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
                        ) 
                    AND (
                            (TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            ) 
                        OR 
                            (TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170', 'LM 12162') 
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADO', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADO CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO', 'INSPECCIONADO CON DEFECTO NO CRITICO')
                            )
                        OR 
                            (TipoTarea = 'RP 12170'
                                AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD') 
                                AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00'
                            )
                        OR 
                            (TipoTarea = 'RN 10772'
                            AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADO', 'CERTIFICADA CON NOVEDAD', 'CERTIFICADO CON NOVEDAD')
                        )
                    )            
                AND NroSitio NOT LIKE '%prueba%' ORDER BY Depto, NombreOperario ASC";
    }

    public static function get_countExcelSingle($opcion, $fecha_inicio, $fecha_final){
        $excelSQL1 = self::get_excelSQL1($opcion, $fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($excelSQL1) AS subconsulta";
    }

    public static function get_countExcelBoth($fecha_inicio, $fecha_final) {
        $excelSQL2 = self::get_excelSQL2($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($excelSQL2) AS subconsulta";
    }
}

?>