import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";

import { ReportPDTInterface, PesosNodos, Porcentaje, YearDetail } from "@/interfaces";
import { getLevelName } from "@/services/api";

export const ModalTotalPDT = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div>
            <ModalPDT modalIsOpen={modalIsOpen} callback={setModalIsOpen}/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='inherit' 
                        title='Generar reporte del Plan Indicativo Total'
                        onClick={()=>setModalIsOpen(true)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    )
}

const ModalPDT = ( props: any ) => {
    const { years, levels, plan } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        
    }, []);

    const genReport = () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        const pesos = pesosStr ? JSON.parse(pesosStr) : []
        const detalle = detalleStr ? JSON.parse(detalleStr) : []
        const data: ReportPDTInterface[] = []

        pesos.forEach(async (peso: PesosNodos) => {
            const { id_nodo, porcentajes } = peso
            const percentages = porcentajes?.map((porcentaje: Porcentaje) => porcentaje.progreso*100)
            
            const ids = id_nodo.split('.');
            let ids2 = ids.reduce((acumulator:string[], currentValue: string) => {
                if (acumulator.length === 0) {
                    return [currentValue];
                } else {
                    const ultimoElemento = acumulator[acumulator.length - 1];
                    const concatenado = `${ultimoElemento}.${currentValue}`;
                    return [...acumulator, concatenado];
                }
            }, []);
            ids2 = ids2.slice(1);
            const root = await getLevelName(ids2)
        
            const nodeYears = detalle.filter((item: YearDetail) => item.id_nodo === id_nodo)
            const executed = nodeYears.map((item: YearDetail) => item.Ejecucion_fisica)
            const programed = nodeYears.map((item: YearDetail) => item.Programacion_fisica)
            
            const item: ReportPDTInterface = {
                responsible: '',
                goalCode: id_nodo,
                goalDescription: '',
                percentExecuted: percentages!,
                planSpecific: root,
                indicator: '',
                base: '',
                executed: executed,
                programed: programed
            }
            data.push(item)
        })
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de Plan'>
            <h1>Plan</h1>
            <button className='tw-bg-gray-300 hover:tw-bg-gray-200 
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 tw-ml-3'>
                Exportar
            </button>
            <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                    onClick={() => props.callback(false)}>X</button>
            <table>
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        {years.map((year, index) => (
                            <th className=' tw-border tw-bg-gray-400 
                                            tw-p-2' 
                                key={index}>
                                % ejecución {year}
                            </th>
                        ))}
                        {levels.map((level, index) => (
                            <th className=' tw-border tw-bg-gray-400
                                            tw-p-2' 
                                key={index}>
                                {level.LevelName}
                            </th>
                        ))}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        {years.map((year, index) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                key={index}>
                                Programado {year}
                            </th>
                        ))}
                        {years.map((year, index) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                key={index}>
                                Ejecutado {year}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className='tw-border tw-p-2'>{item.Responsable}</td>
                            <td className='tw-border tw-p-2'>{item.CodigoMetaProducto}</td>
                            <td className='tw-border tw-p-2'>{item.DescripcionMetaProducto}</td>
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item[`PorcentajeEjecucion${year}`]}</td>))}
                            {levels.map((level, index) => (<td className='tw-border tw-p-2' key={index}>{item[`PorcentajeEjecucion${level.LevelName}`]}</td>))}
                            <td className='tw-border tw-p-2'>{item.Indicador}</td>
                            <td className='tw-border tw-p-2'>{item.LineaBase}</td>
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item[`Programado${year}`]}</td>))}
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item[`Ejecutado${year}`]}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Modal>
    )
}