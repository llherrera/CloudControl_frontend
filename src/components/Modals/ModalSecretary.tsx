import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";
import { thunkGetSecretaries } from "@/store/plan/thunks";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { exportFile } from "@/utils";
import { ReportPDTInterface, YearDetail, ModalsecretaryProps } from "@/interfaces";

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
            loadingReport } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [secretary, setSecretary] = useState<string>('');
    const [indexYear, setIndexYear] = useState<number>(0);

    useEffect(() => {
        dispatch(thunkGetSecretaries(plan?.id_plan!))
    }, []);

    useEffect(() => {
        setSecretary(secretaries[0])
    }, [secretaries]);

    useEffect(() => {
        genReport();
    }, [secretary, indexYear, props.modalIsOpen]);

    const genReport = () => {
        const detalleStr = localStorage.getItem('detalleAño');
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const nodes = detalle.filter((item: YearDetail) => (item.responsable === secretary && item.Año === years[indexYear]));
        
        const data: ReportPDTInterface[] = [];
        nodes.forEach((item: YearDetail) => {
            let percent = (item.Ejecucion_fisica/item.Programacion_fisica)*100;
            percent = percent ? percent : 0;
            percent = Math.round(percent*100)/100;
            const item_: ReportPDTInterface = {
                responsible: item.responsable??'',
                goalCode: item.id_nodo,
                goalDescription: item.Descripcion,
                percentExecuted: [percent],
                planSpecific: [item.id_nodo],
                indicator: item.Indicador,
                base: item.Linea_base,
                executed: [item.Ejecucion_fisica],
                programed: [item.Programacion_fisica]
            }
            data.push(item_)
        });
        dispatch(setLoadingReport(false));
        setData(data);
    }

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLoadingReport(true))
        setSecretary(e.target.value)
    }

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index:number) => {
        e.preventDefault()
        dispatch(setLoadingReport(true))
        setIndexYear(index)
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de secretarias'>
            {loadingReport ? <Spinner />: <div>
            <div className='tw-flex tw-flex-col md:tw-flex-row'>
                <div className="tw-mb-2">
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
                <div className='md:tw-ml-6'>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center'>Secretarias</h1>
                    <select name="" 
                            value={secretary} 
                            onChange={(e)=>handleChangeSecretary(e)}
                            className="tw-border-2 tw-p-1 tw-mb-2 tw-rounded">
                        {secretaries.map((sec, index) => (<option value={sec} key={index}>{sec}</option>))}
                    </select>
                </div>
                <button className=' tw-bg-gray-300 hover:tw-bg-gray-500
                                    hover:tw-text-white
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 md:tw-ml-3 tw-mr-3'
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
                            <td className='tw-border tw-p-2' >{item['percentExecuted'][0]}</td>
                            {levels.map((level, index) => (
                                <td className='tw-border tw-p-2' 
                                    key={index}>
                                    {item['planSpecific'][index]}
                                </td>
                            ))}
                            <td className='tw-border tw-p-2'>{item.indicator}</td>
                            <td className='tw-border tw-p-2'>{item.base}</td>
                            <td className='tw-border tw-p-2'>{item['programed'][0]}</td>
                            <td className='tw-border tw-p-2'>{item['executed'][0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>}
        </Modal>
    )
}