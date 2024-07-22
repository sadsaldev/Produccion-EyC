import React from "react";
import { calculateNetCounts } from "../../helpers/netCount";

export const SummaryNetTable = ({data, formData}) => {
  const counts = calculateNetCounts(data, formData);

    //Retornar tabla 
    return (
        <div className="overflow-table-2">
            <div className="general-count-table">
                <table className="table-count">
                    <thead>
                        <tr>
                            <th>En Oficina</th>
                            <th>Efectivo</th>
                            <th>VP's</th>
                            <th>En Campo</th>
                            <th>No Visitado</th>
                            <th>Motivo Técnico</th>
                            <th>Suspendidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{counts.enOficina}</td>
                            <td>{counts.efectivo}</td>
                            <td>{counts.vps}</td>
                            <td>{counts.enCampo}</td>
                            <td>{counts.noVisitado}</td>
                            <td>{counts.motivoTecnico}</td>
                            <td>{counts.suspendidas}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="detail-count-table">
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Certificadas</th> 
                            <th>Cert. Con Novedad</th>
                            <th>Inspeccionadas</th>
                            <th>Insp. Defecto Crítico</th>
                            <th>Insp. Defecto No Crítico</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{counts.detalleEfectivo.certificados}</td>
                            <td>{counts.detalleEfectivo.certificadosConNovedad}</td>
                            <td>{counts.detalleEfectivo.inspeccionados}</td>
                            <td>{counts.detalleEfectivo.inspeccionadosConDefectoCritico}</td>
                            <td>{counts.detalleEfectivo.inspeccionadosConDefectoNoCritico}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}