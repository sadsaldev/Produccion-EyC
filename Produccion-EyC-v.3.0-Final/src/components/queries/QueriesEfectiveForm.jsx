import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { exportEfectiveExcel } from '../../api/exportEfectiveExcel';
import { getTodayDate } from '../../helpers/getTodayDate';

export const QueriesEfectiveForm = ({ onSubmit, onExportExcel, user }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedView, setSelectedView] = useState('');
    const today = getTodayDate();

    const handleViewChange = (view) => {
        setSelectedView(view);
    }

    const handleFormSubmit = (data) => {
        onSubmit(data, selectedView);
    }

    const handleExportExcelClick = async (data) => {
        const formDataforExcel = new FormData(document.getElementById('formu')); 
        const { fecha_inicio, fecha_final, opcion } = {
            fecha_inicio: formDataforExcel.get('fecha_inicio'),
            fecha_final: formDataforExcel.get('fecha_final'),
            opcion: formDataforExcel.get('opcion')
        };

        await exportEfectiveExcel(fecha_inicio, fecha_final, opcion);
    }

    return (
        <div className="queries-viewer-container">
            <div className="viewer-header">
                <h2>Consultar Tareas Efectivas</h2>
            </div>
            <div className="queries-form-father"> 
                <div className="queries-form-container-grid">
                    <div className="queries-form-container">
                        <form id="formu" onSubmit={handleSubmit(handleFormSubmit)} className="queries-form">
                            <label htmlFor="fecha_inicio">
                                <p className="first-element-queries-form">Fecha Inicial:</p>
                            </label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                defaultValue={today}
                                className={`form-control initialdate current-date ${errors.fecha_inicio ? 'is-invalid' : ''}`}
                                {...register('fecha_inicio', {
                                    required: 'La fecha inicial es requerida',
                                    validate: value => !isNaN(new Date(value).getTime()) || 'Fecha inválida'
                                })}
                            />
                            {errors.fecha_inicio && (
                                <span className="invalid-feedback">{errors.fecha_inicio.message}</span>
                            )}
                            
                            <label htmlFor="fecha_final">
                                <p>Fecha Final:</p>
                            </label>
                            <input
                                type="date"
                                id="fecha_final"
                                name="fecha_final"
                                defaultValue={today}
                                className={`form-control finaldate current-date ${errors.fecha_final ? 'is-invalid' : ''}`}
                                {...register('fecha_final', {
                                    required: 'La fecha final es requerida',
                                    validate: value => !isNaN(new Date(value).getTime()) || 'Fecha inválida'
                                })}
                            />
                            {errors.fecha_final && (
                                <span className="invalid-feedback">{errors.fecha_final.message}</span>
                            )}
                            
                            <label htmlFor="opc">
                                <p>Grupo:</p>
                            </label>
                            <select
                                id="opc"
                                name="opc"
                                 defaultValue="INSP-RIS"
                                className={`form-select ${errors.opcion ? 'is-invalid' : ''}`}
                                {...register('opcion', { required: 'Debes seleccionar un grupo' })}
                            >
                                <option value="INSP-RIS">Risaralda</option>
                                <option value="INSP-CALDAS">Caldas</option>         
                                <option value="both">Todos</option>        
                            </select>
                            {errors.opcion && (
                                <span className="invalid-feedback">{errors.opcion.message}</span>
                            )}
                        </form>
                    </div>
                    <div className="queries-options">
                        <div className="view-content">
                            <button 
                                className="viewmain" 
                                form="formu" 
                                type="submit"
                                onClick={() => handleViewChange('table')}
                            >
                                <img className="viewmain-img" src="/assets/img/viewmain.svg"/>
                                    Ver Tabla General
                            </button>
                            <button 
                                className="viewgrouped" 
                                form="formu" 
                                type="submit"
                                onClick={() => handleViewChange('accordion')}
                            >
                                <img className="viewgrouped-img" src="/assets/img/viewgrouped.svg"/>
                                    Ver Por Inspector
                            </button>
                        </div>
                        <div className="download-excel">
                            <button id="download"
                                className="exportexcel" 
                                onClick={handleExportExcelClick}
                            >
                                <img className="exportexcel-img" src="/assets/img/excel-white.svg"/> 
                                    Exportar
                            </button>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    );

}