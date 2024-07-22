import React from "react";
import { SummaryNetTable } from "./SummaryNetTable";

export const NetworksTable = ({data, formData}) => {

    console.log('Datos del formulario: ', formData);

    //Mapa para asociar contratos con solicitudes
    const contractToRequestMap = formData.contracts.reduce((acc, contract) => {
        acc[contract.contrato] = contract.solicitud;
        return acc;
    }, {});

    //Agrupar tareas por contrato
    const tasksByContract = data.reduce((acc, task) => {
        if (!acc[task.NroSitio]) {
            acc[task.NroSitio] = [];
        }
        acc[task.NroSitio].push(task);
        return acc;
    }, {});

    //ordenar las tareas según el orden de los contratos en el formulario
    const orderedTasks = formData.contracts.flatMap(contract => {
        const contractTasks = tasksByContract[contract.contrato] || [];
        return contractTasks.map(task => ({
            contrato: contract.contrato,
            solicitud: contractToRequestMap[contract.contrato],
            ...task
        }));
    });

    return (
        <div className="networks-main-content">
            <div className="header">
                <div className="title-container"><h1>Información de los Contratos Ingresados</h1></div>
            </div>
            <div className="contracts-tables-container">
                <div className="overflow-table-1-container">
                    <div className="overflow-table-1">
                        <table className="table1">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Contrato</th>
                                    <th>Solicitud</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Fecha Visita</th>
                                    <th>Cedula</th>
                                    <th>Nombre</th>
                                    <th>Tarea</th>
                                    <th>Estado</th> 
                                    <th>Cierre</th>
                                    <th>Duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                { orderedTasks.length > 0 ? (
                                    orderedTasks.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.NroSitio}</td>
                                            <td>{item.solicitud}</td>
                                            <td>{item.FechaRealInicio ? new Date(item.FechaRealInicio).toLocaleString() : ''}</td>
                                            <td>{item.FechaRealFin ? new Date(item.FechaRealFin).toLocaleString() : ''}</td>
                                            <td>{item.FechaVisita ? new Date(item.FechaVisita).toLocaleString() :  ''}</td>
                                            <td>{item.NroOperario || ''}</td>
                                            <td>{item.NombreOperario || ''}</td>
                                            <td>{item.TipoTarea || ''}</td>
                                            <td>{item.Estado || ''}</td>
                                            <td>{item.Cierre3 || ''}</td>
                                            <td>{item.duracion || ''}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No hay datos disponibles.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="overflow-table-2-container">
                   
                    <SummaryNetTable data={data} formData={formData} />
                    
                </div>
            </div>
        </div>
        
    );
}