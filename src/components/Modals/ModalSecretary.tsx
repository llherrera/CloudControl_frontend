import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setNodesReport } from "@/store/plan/planSlice";
import { thunkGetSecretaries } from "@/store/plan/thunks";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { exportFile } from "@/utils";
import { getLevelName } from "@/services/api";
import { PesosNodos, Porcentaje, ReportPDTInterface, 
        YearDetail, ModalsecretaryProps, Node } from "@/interfaces";

export const ModalSecretary = () => {
    const [modalSecretaryIsOpen, setModalSecretaryIsOpen] = useState(false);

    return (
        <div>
            <ModalPDT modalIsOpen={modalSecretaryIsOpen} callback={setModalSecretaryIsOpen}/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='secondary' 
                        title='Generar reporte por Secretarias'
                        className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={()=>setModalSecretaryIsOpen(true)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    )
}

const ModalPDT = ( props: ModalsecretaryProps ) => {
    const dispatch = useAppDispatch();

    const { years, levels, plan, secretaries, 
            loadingReport, nodesReport } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [secretary, setSecretary] = useState<string>(secretaries[0])
    const [indexYear, setIndexYear] = useState<number>(0);

    useEffect(() => {
        dispatch(thunkGetSecretaries(plan?.id_plan!));
    }, []);

    useEffect(() => {

    }, [secretary, indexYear]);

    const genReport = async () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        let pesos = pesosStr ? JSON.parse(pesosStr) : [];
        const nodesReport_ = nodesReport.map((item: Node) => item.id_nodo);
        pesos = pesos.filter((item:PesosNodos)=> nodesReport_.includes(item.id_nodo) );
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
        dispatch(setLoadingReport(false))
        return data
    }

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSecretary(e.target.value)
        dispatch(setLoadingReport(true))
    }

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index:number) => {
        e.preventDefault()
        setIndexYear(index)
        dispatch(setLoadingReport(true))
        //genReport().then((data) => setData(data))
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de secretarias'>
            {loadingReport ? <Spinner />: <div>
            <div className='tw-flex'>
                <div>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center'>Escoger Año</h1>
                    {years.map((year, index) => (
                        <button className={`
                                            ${indexYear === index ? 
                                                'tw-bg-gray-500 tw-text-white hover:tw-bg-gray-300 hover:tw-text-black' : 
                                                'tw-bg-gray-300 hover:tw-bg-gray-500 hover:tw-text-white'}
                                            tw-border-black
                                            tw-rounded tw-border
                                            tw-p-1 tw-mx-1`}
                                onClick={(event) => handleBtn(event, index)}
                                key={index}>
                            {year}
                        </button>
                    ))}
                </div>
                <div className='tw-ml-6'>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2'>Secretarias</h1>
                    <select name="" value={secretary} onChange={(e)=>handleChangeSecretary(e)}>
                        {secretaries.map((sec, index) => (<option value={sec} key={index}>{sec}</option>))}
                    </select>
                </div>
                <button className='tw-bg-gray-300 hover:tw-bg-gray-500
                                    hover:tw-text-white
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 tw-ml-3'
                        onClick={()=>exportFile('TablaSecretarias','InformeSecretarias')}>
                    Exportar
                </button>
                <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                        onClick={() => props.callback(false)}>
                X</button>
            </div>
            <table  className="tw-mt-3"
                    id="TablaSecretarias">
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        <th className=' tw-border tw-bg-gray-400 
                                        tw-p-2'> 
                            % ejecución {years[indexYear]}
                        </th>
                        {levels.map((level, index) => (
                            <th className=' tw-border tw-bg-gray-400
                                            tw-p-2' 
                                key={index}>
                                {level.LevelName}
                            </th>
                        ))}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        <th className=' tw-border tw-bg-gray-400 
                                        tw-p-2'>
                            Programado {years[indexYear]}
                        </th>
                        <th className=' tw-border tw-bg-gray-400 
                                        tw-p-2'>
                            Ejecutado {years[indexYear]}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className='tw-border tw-p-2'>{item.responsible}</td>
                            <td className='tw-border tw-p-2'>{item.goalCode}</td>
                            <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                            <td className='tw-border tw-p-2' >{item['percentExecuted'][indexYear]}</td>
                            {levels.map((level, index) => (
                                <td className='tw-border tw-p-2' 
                                    key={index}>
                                    {item['planSpecific'][index]}
                                </td>
                            ))}
                            <td className='tw-border tw-p-2'>{item.indicator}</td>
                            <td className='tw-border tw-p-2'>{item.base}</td>
                            <td className='tw-border tw-p-2'>{item['programed'][indexYear]}</td>
                            <td className='tw-border tw-p-2'>{item['executed'][indexYear]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>}
        </Modal>
    )
}