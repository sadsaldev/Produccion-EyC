
--Consulta para ver las inspecciones que sí aportan al informe de producción porque fueron realizadas correctamente

--Estas cumplen los siguientes parámetros: 
--los tipos de trabajo están dentro de los especificados
--están dentro de los cierres permitidos para que sea una inspección efectiva
--El tiempo total que llevó realizar la inspección debe ser de 17min en adelante para marcarla como correcta.
SELECT NroSitio, Direccion, Depto, Localidad, NroOperario, NombreOperario, NombreSitio, TipoTarea, Prioridad,
FechaVisita, Cierre3, Estado, AttrCategoria, FechaRealInicio, FechaRealFin, 
TIMEDIFF(FechaRealInicio, FechaRealFin) AS tiempo_transcurrido 
FROM tasks 
WHERE Depto IN ('RISARALDA', 'CALDAS') AND TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADA CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO') 
AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00';


--Consulta con los parámetros para REDES NUEVAS
--Varía el código de TipoTarea
--No hay restricciones en el tiempo_transcurrido de inspección
SELECT NroSitio, Direccion, Depto, Localidad, NroOperario, NombreOperario, NombreSitio, TipoTarea, Prioridad,
FechaVisita, Cierre3, Estado, AttrCategoria, FechaRealInicio, FechaRealFin, 
TIMEDIFF(FechaRealInicio, FechaRealFin) AS tiempo_transcurrido 
FROM tasks 
WHERE Depto IN ('RISARALDA', 'CALDAS') AND TipoTarea IN ('RN 10793', 'RN 12162', 'RN 10772', 'RN 12170');


--Consulta para contar todas las inspecciones hechas correctamente 
--La idea es que este contador se muestre al final de la tabla
SELECT COUNT(*) AS inspecciones_correctas
FROM tasks 
WHERE Depto IN ('RISARALDA', 'CALDAS') AND TipoTarea IN ('RP 10444', 'RP 12161', 'SA 10445', 'SA 12163', 'SA 12164') 
AND Cierre3 IN ('CERTIFICADA', 'CERTIFICADA CON NOVEDAD', 'INSPECCIONADA', 'INSPECCIONADA CON DEFECTO CRITICO', 'INSPECCIONADA CON DEFECTO NO CRITICO') 
AND TIMEDIFF(FechaRealFin, FechaRealInicio) >= '00:17:00';
