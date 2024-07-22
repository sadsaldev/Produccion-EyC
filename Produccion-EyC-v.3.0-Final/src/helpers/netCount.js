import {format, parseISO, subDays} from 'date-fns';

export const calculateNetCounts = (data, formData) => {
    const today = formData?.fecha_inicio;

    //Formatear fecha actual a un formato manejable
    const formattedToday = today ? parseISO(today) : null;
    const todayStr = formattedToday ? format(formattedToday, "yyyy-MM-dd") : null
    //Calcular fecha de ayer
    const yesterday = formattedToday ? format(subDays(formattedToday, 1), "yyyy-MM-dd") : null;
    //Funcion para contar registros "En Oficina" -> No hay información asociada a esos contratos
    const countEnOficina = (contracts, tasks) => {
        const tasksSet = new Set(tasks.map(task => task.NroSitio));
        return contracts.filter(contract => !tasksSet.has(contract.contrato)).length;
    };

    //Función para contar registros "Efectivos" -> En base al valor del cierre
    const countEfectivo = (tasks) => {
        return tasks.reduce((acc, task) => {
            const cierre = task.Cierre3;
            if (["CERTIFICADA", "CERTIFICADO"].includes(cierre)) {
                acc.certificados += 1;
            } else if (["CERTIFICADA CON NOVEDAD", "CERTIFICADO CON NOVEDAD"].includes(cierre)) {
                acc.certificadosConNovedad += 1;
            } else if (["INSPECCIONADA", "INSPECCIONADO"].includes(cierre)) {
                acc.inspeccionados += 1;
            } else if (["INSPECCIONADA CON DEFECTO CRITICO", "INSPECCIONADO CON DEFECTO CRITICO"].includes(cierre)) {
                acc.inspeccionadosConDefectoCritico += 1;
            } else if (["INSPECCIONADA CON DEFECTO NO CRITICO", "INSPECCIONADO CON DEFECTO NO CRITICO"].includes(cierre)) {
                acc.inspeccionadosConDefectoNoCritico += 1;
            }
            acc.total = acc.certificados + acc.certificadosConNovedad + acc.inspeccionados + acc.inspeccionadosConDefectoCritico + acc.inspeccionadosConDefectoNoCritico;
            return acc;
        }, {
            total: 0,
            certificados: 0,
            certificadosConNovedad: 0,
            inspeccionados: 0,
            inspeccionadosConDefectoCritico: 0,
            inspeccionadosConDefectoNoCritico: 0
        });
    };

    //Función para contar registros "Visitas Perdidas" -> En base al valor del cierre
    const countVPs = (tasks) => {
        return tasks.filter(task => task.Cierre3 === "NO HAY USUARIO").length;
    };

    //Función para contar registros "En Campo" -> En base al valor de la FechaVisita, debe ser igual a la fecha ingresada por el usuario
    const countEnCampo = (tasks) => {
       return tasks.filter(task => {
            const taskFechaVisita = task.FechaVisita ? format(new Date(task.FechaVisita), "yyyy-MM-dd") : null;
            return taskFechaVisita === todayStr && task.Estado !== "FINALIZADA";
        }).length;
    };

    //Función para contar registros "No Visitado" -> En base al valor de la FechaVisita, debe ser del día anterior a la fecha ingresada por el usuario y el estado debe ser "INICIADA"
    const countNoVisitado = (tasks) => {
        return tasks.filter(task => {
            const taskFechaVisita = task.FechaVisita ? format(new Date(task.FechaVisita), "yyyy-MM-dd") : null;
            return taskFechaVisita === yesterday && task.Estado === "INICIADA";
        }).length;
    };

    //Función para contar "Motivo Técnico" -> En base al valor del cierre
    const countMotivoTecnico = (tasks) => {
        return tasks.filter(task => task.Cierre3 === "MOTIVO TECNICO").length;
    };

    //Función para contar "Suspendidas" -> En base al valor del cierre
    const countSuspendidas = (tasks) => {
        return tasks.filter(task => task.Cierre3 === "SUSPENSION POR VENCIMIENTO").length;
    };

    //Obtener los conteos detallados para Efectivo
    const tasksCountEfectivo = countEfectivo(data);
    const totalCertificados = tasksCountEfectivo.certificados;
    const totalCertificadosConNovedad = tasksCountEfectivo.certificadosConNovedad;
    const totalInspeccionados = tasksCountEfectivo.inspeccionados;
    const totalInspeccionadosConDefectoCritico = tasksCountEfectivo.inspeccionadosConDefectoCritico;
    const totalInspeccionadosConDefectoNoCritico = tasksCountEfectivo.inspeccionadosConDefectoNoCritico;
    const totalEfectivo = tasksCountEfectivo.total;

    return {
        enOficina: countEnOficina(formData.contracts, data),
        efectivo: totalEfectivo,
        vps: countVPs(data),
        enCampo: countEnCampo(data),
        noVisitado: countNoVisitado(data),
        motivoTecnico: countMotivoTecnico(data),
        suspendidas: countSuspendidas(data),
        detalleEfectivo: {
            certificados: totalCertificados,
            certificadosConNovedad: totalCertificadosConNovedad,
            inspeccionados: totalInspeccionados,
            inspeccionadosConDefectoCritico: totalInspeccionadosConDefectoCritico,
            inspeccionadosConDefectoNoCritico: totalInspeccionadosConDefectoNoCritico
        }
    }
}