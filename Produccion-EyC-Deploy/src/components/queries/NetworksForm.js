import React, {useEffect} from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { getTodayDate } from '../../helpers/getTodayDate';

export const NetworksForm = ({onSubmit, user, initialData}) => {
    const {
        register, 
        handleSubmit, 
        control,
        formState: {errors},
        watch, 
        setError,
        clearErrors,
        reset
    } = useForm({
        defaultValues: {
            contracts: [{
                contrato: '',
                solicitud: ''
            }],
            fecha_inicio: getTodayDate(),
            opcion: 'INSP-RIS'
        }
    });

    const {fields, append, remove, update} = useFieldArray({
        control,
        name: 'contracts'
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const today = getTodayDate();
    const watchContracts = watch('contracts');
    const validateNumbers = (value) =>  /^\d+$/.test(value) || 'Solo se permiten números';
    const onSubmitHandler = (data, download = false) => {
        const { fecha_inicio, opcion, contracts } = data;

        const invalidContract = contracts.find((contract, index) => {
            const {contrato, solicitud} = contract;
            if (!/^\d+$/.test(contrato) || !/^\d+$/.test(solicitud)) {
                setError(`contracts.${index}.contrato`, {
                    type: 'manual',
                    message: 'Solo se permiten números'
                });
                setError(`contracts.${index}.solicitud`, {
                    type: 'manual',
                    message: 'Solo se permiten números'
                });
                return true;
            }
            return false;
        });

        if (invalidContract) return;

        clearErrors();
        onSubmit(data, download);
    }

    const clearRowsContent = () => {
        fields.forEach((field, index) => {
            update(index, { contrato: '', solicitud: '' });
        });
    };

    return (
        <div className="input-networks-container">
            <div className="input-networks-header">
                <h2>Comité Redes Nuevas</h2>
            </div>
            <div className="networks-form-father">
                <div className="networks-form-container-grid">
                    <div className="networks-table-options">
                        <div className="options-left">
                            <img id="add-row" src="/produccion-EyC-deploy/public/assets/img/add.svg" alt="add-row" title="Añadir fila" onClick={() => append({ contrato: '', solicitud: '' })}/>
                            <img id="delete-row" src="/produccion-EyC-deploy/public/assets/img/minus.svg" alt="delete-row" title="Eliminar fila"  onClick={() => fields.length > 1 && remove(fields.length - 1)}/>
                        </div>
                        <div className="options-right">
                            <img id="clear-rows-content" src="/produccion-EyC-deploy/public/assets/img/reload.svg" alt="clear-table" title="Limpiar registros" onClick={clearRowsContent} />
                        </div>
                    </div>
                    <div className="networks-form-container">
                        <form id="form-net" className="queries-form">
                            <div className="networks-input-table-container">
                                <table className="networks-input-table">
                                    <thead>
                                        <tr>
                                            <th><label htmlFor="contrato">Contrato</label></th>
                                            <th><label htmlFor="solicitud">Solicitud</label></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fields.map((field, index) => {
                                            const contratoClass = watchContracts[index]?.contrato && !/^\d+$/.test(watchContracts[index]?.contrato) ? 'is-invalid' : '';
                                            const solicitudClass = watchContracts[index]?.solicitud && !/^\d+$/.test(watchContracts[index]?.solicitud) ? 'is-invalid' : '';
                                            return (
                                                <tr key={field.id}>
                                                    <td>
                                                        <div className="trcontainer">
                                                            <input
                                                                type="text"
                                                                className={`form-control contract ${contratoClass}`}
                                                                {...register(`contracts.${index}.contrato`, {
                                                                    validate: validateNumbers
                                                                })}
                                                            />
                                                            {errors.contracts?.[index]?.contrato && (
                                                                <span className="invalid-feedback">
                                                                    {errors.contracts[index].contrato.message}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="trcontainer">
                                                            <input
                                                                type="text"
                                                                className={`form-control request ${solicitudClass}`}
                                                                {...register(`contracts.${index}.solicitud`, {
                                                                    validate: validateNumbers
                                                                })}
                                                            />
                                                            {errors.contracts?.[index]?.solicitud && (
                                                                <span className="invalid-feedback">
                                                                    {errors.contracts[index].solicitud.message}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex-end-net-form'>
                                <div className="container-fecha-recibido">
                                    <div className="fecha-recibido-label">
                                        <div className="date-span">Fecha</div>
                                        <input
                                            type="date"
                                            id="fecha_inicio"
                                            defaultValue={today}
                                            className='form-control initialdate'
                                            {...register('fecha_inicio', { required: 'Campo obligatorio' })}
                                        />
                                        {errors.fecha_inicio && (
                                            <div className='alert-container-networks'><div className="alert mt-3 alert-danger">{errors.fecha_inicio.message}</div></div>
                                        )}
                                    </div>
                                    <div className="fecha-recibido-input">
                                        <div className="date-span">Grupo</div>
                                        <select
                                            id="opc"
                                            name="opc"
                                             defaultValue="INSP-RIS"
                                            className={`form-select ${errors.opcion ? 'is-invalid' : ''}`}
                                            {...register('opcion', { required: 'Debes seleccionar un grupo' })}
                                        >
                                            <option value="INSP-RIS">Risaralda</option>
                                            <option value="INSP-CALDAS">Caldas</option>                 
                                        </select>
                                        {errors.opcion && (
                                            <span className="invalid-feedback">{errors.opcion.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="submit-networks-form-buttons">
                                    {user ? (
                                        <>
                                            <button type="submit" className="export-excel-networks" onClick={handleSubmit(data => onSubmitHandler(data, true))}>
                                                <img src="/produccion-EyC-deploy/public/assets/img/excel-white.svg" alt="Descargar Excel" />Descargar Excel
                                            </button>
                                            <button type="button" className="view-networks-content" onClick={handleSubmit(data => onSubmitHandler(data, false))}>
                                                Ver Contenido<img src="/produccion-EyC-deploy/public/assets/img/show-content-white.svg" alt="Ver Contenido" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button type="button" className="export-excel-networks" disabled>
                                                <img src="/produccion-EyC-deploy/public/assets/img/excel-white.svg" alt="Descargar Excel" />Descargar Excel
                                            </button>
                                            <button type="button" className="view-networks-content" disabled>
                                                Ver Contenido<img src="/produccion-EyC-deploy/public/assets/img/show-content-white.svg" alt="Ver Contenido" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};