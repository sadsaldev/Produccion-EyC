import React from 'react';
import { sortMain } from '../../helpers/sortMain';
import {sortGrouped } from '../../helpers/sortGrouped';

export const SortBy = ({formData, view}) => {
    
    if (view === 'table'){
        sortMain();
    } else {
        sortGrouped();
    }

    return (
        <div className="sort-by">
            <p>Ordenar registros por:</p>
            <select 
                id="sort" 
                name="sort" 
                defaultValue='NombreOperario'
                className="form-select"
            >
                {view === 'table' ? (
                    <>
                    {formData?.opcion === 'both' && (
                        <option value="Grupo">Grupo</option>
                    )}
                    <option value="NombreOperario">Nombre</option>
                    <option value="FechaRealInicio">Fecha Inicio</option>
                    <option value="FechaRealFin">Fecha Final</option>
                    <option value="NroOperario">Cédula</option>
                    <option value="Direccion">Dirección</option>
                    <option value="NroSitio">Contrato</option>
                    <option value="TipoTarea">Tarea</option>
                    <option value="Prioridad">Prioridad</option>
                    <option value="Cierre3">Cierre</option>
                    <option value="duracion">Duración</option>
                    </>
                ) : (
                    <>
                    <option value="NombreOperario">Nombre</option>
                    <option value="NroOperario">Cédula</option>
                    <option value="totalInspections">Cant. Inspecciones</option>
                    </>
                )}
            </select>
            <button 
                className='sortAsc active'
                title="Orden Ascendente"
            >
            </button>
            <button 
                className='sortDesc'
                title="Orden Descendente"
            >
            </button>
        </div>
    );
}
