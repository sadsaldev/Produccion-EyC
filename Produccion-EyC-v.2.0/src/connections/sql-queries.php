<?php 
namespace App;

class SQLqueries {
    //consultas usadas en main-table.php public static function get_sSQL1($departamento, $fecha_inicio, $fecha_final){
 
    public static function get_sSQL1($departamento, $fecha_inicio, $fecha_final){
        return "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
        TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
        FROM Tasks 
        WHERE Grupo = :departamento
            AND (
                    (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
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
    }

    public static function get_sSQL2($insertedTableName, $fecha_inicio, $fecha_final) {
        return "INSERT INTO cortes_$insertedTableName (rango_corte1, rango_corte2, Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, Duracion, unique_code) VALUES (:fecha_inicio, :fecha_final, :Grupo, :Direccion, :FechaRealInicio, :FechaRealFin, :NroOperario, :NombreOperario, :NroSitio, :TipoTarea, :Prioridad, :Cierre3, :duracion, :unique_code)";
    }

    public static function get_sSQL3ByCode($insertedTableName){
        return "SELECT COUNT(*) AS count FROM cortes_$insertedTableName WHERE unique_code = :unique_code";
    }   

    public static function get_sSQL4($insertedTableName, $fecha_inicio, $fecha_final){
        return "SELECT * FROM cortes_$insertedTableName WHERE rango_corte1 = :fecha_inicio AND rango_corte2 = :fecha_final";
    }

    public static function get_SQLboth($fecha_inicio, $fecha_final){
        return "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE Grupo IN ('INSP-RIS', 'INSP-CALDAS')
                    AND (
                            (DATE(FechaRealInicio) = DATE('$fecha_final')) OR (FechaRealInicio BETWEEN '$fecha_inicio' AND '$fecha_final')
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
    }

    public static function get_countBoth($fecha_inicio, $fecha_final){
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta";
    }

    public static function get_sSQLCountCaldas($fecha_inicio, $fecha_final) {
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta WHERE Grupo = 'INSP-CALDAS'";
    }

    public static function get_sSQLCountRisaralda($fecha_inicio, $fecha_final) {
        $SQLboth = self::get_SQLboth($fecha_inicio, $fecha_final);
        return "SELECT COUNT(*) AS conteo FROM ($SQLboth) AS subconsulta WHERE Grupo = 'INSP-RIS'";
    }

    public static function get_groupedSQL($departamento, $fecha_inicio, $fecha_final){
        return "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE Grupo = :departamento
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
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
                        
                    AND NroSitio NOT LIKE '%prueba%' ORDER BY FechaRealInicio ASC"; 
    }

    public static function get_excelSQL1($opcion, $fecha_inicio, $fecha_final){
        return "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE Grupo = :opcion
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
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
    }

    public static function get_excelSQL2($fecha_inicio, $fecha_final){
        return "SELECT Grupo, Direccion, FechaRealInicio, FechaRealFin, NroOperario, NombreOperario, NroSitio, TipoTarea, Prioridad, Cierre3, 
                TIMEDIFF(FechaRealFin, FechaRealInicio) AS duracion 
                FROM Tasks 
                WHERE (Grupo = 'INSP-RIS' OR Grupo = 'INSP-CALDAS')
                    AND (
                            (DATE(FechaRealInicio) = DATE(:fecha_final)) OR (FechaRealInicio BETWEEN :fecha_inicio AND :fecha_final)
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
    }
}

?>