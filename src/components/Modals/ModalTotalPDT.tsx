import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

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
    const [data, setData] = useState<ReportPDTInterface[]>([]);

    useEffect(() => {
        genReport().then((data) => setData(data))
    }, []);

    const genReport = async () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        const pesos = pesosStr ? JSON.parse(pesosStr) : []
        const detalle = detalleStr ? JSON.parse(detalleStr) : []
        const data: ReportPDTInterface[] = []

        await Promise.all(pesos.map(async (peso: PesosNodos) => {
            const { id_nodo, porcentajes } = peso
            const ids = id_nodo.split('.');
            if (ids.length !== levels.length + 1) return
            const percentages = porcentajes?.map((porcentaje: Porcentaje) => porcentaje.progreso*100)
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
            let root = await getLevelName(ids2)
            root = root.map((item: any) => item[0])
            const nodeYears = detalle.filter((item: YearDetail) => item.id_nodo === id_nodo) as YearDetail[]

            const executed = nodeYears.map((item: YearDetail) => item.Ejecucion_fisica)
            const programed = nodeYears.map((item: YearDetail) => item.Programacion_fisica)
            
            const item: ReportPDTInterface = {
                responsible: nodeYears[0].responsable??'',
                goalCode: id_nodo,
                goalDescription: nodeYears[0].Descripcion,
                percentExecuted: percentages!,
                planSpecific: root,
                indicator: nodeYears[0].Indicador,
                base: nodeYears[0].Linea_base,
                executed: executed,
                programed: programed
            }
            data.push(item)
        }))
        return data
    }

    const exportFile = () => {
        const table = document.getElementById('miTabla');
        const wb = XLSX.utils.table_to_book(table!);
        XLSX.writeFile(wb, 'PlanIndicativoTotal.xlsx');
        const blob = new Blob([table!.innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PlanIndicativoTotal.xlsx';
        a.click();
        document.body.removeChild(a);
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de Plan'>
            <h1>Plan</h1>
            <button className='tw-bg-gray-300 hover:tw-bg-gray-200 
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 tw-ml-3'
                    onClick={exportFile}>
                Exportar
            </button>
            <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                    onClick={() => props.callback(false)}>X</button>
            <table id="miTabla">
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
                            <td className='tw-border tw-p-2'>{item.responsible}</td>
                            <td className='tw-border tw-p-2'>{item.goalCode}</td>
                            <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item['percentExecuted'][index]}</td>))}
                            {levels.map((level, index) => (<td className='tw-border tw-p-2' key={index}>{item['planSpecific'][index]}</td>))}
                            <td className='tw-border tw-p-2'>{item.indicator}</td>
                            <td className='tw-border tw-p-2'>{item.base}</td>
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item['programed'][index]}</td>))}
                            {years.map((year, index) => (<td className='tw-border tw-p-2' key={index}>{item['executed'][index]}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Modal>
    )
}