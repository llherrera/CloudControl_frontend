import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setNodesReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { exportFile } from "@/utils";

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

const ModalPDT = ( props: any ) => {
    const dispatch = useAppDispatch();

    const { years, levels, plan } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<any[]>([]);
    const [secretaries, setSecretaries] = useState<string[]>(["1","2","3","4"])
    const [secretary, setSecretary] = useState<string>(secretaries[0])

    useEffect(() => {
        
    }, []);

    const handleChangeSecretary = (e: any) => {
        setSecretary(e.target.value)
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de secretarias'>
            <div className='tw-flex'>
                <div>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center'>Escoger Año</h1>
                    {years.map((year, index) => (
                        <button className='tw-bg-gray-300 tw-border tw-border-black 
                                            tw-rounded 
                                            tw-p-1 tw-mx-1' 
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
                <button className='tw-bg-gray-300 hover:tw-bg-gray-200
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 tw-ml-3'>
                    Exportar
                </button>
                <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                        onClick={() => props.callback(false)}>
                X</button>
            </div>
            <table className="tw-mt-3">
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        {years.map((year, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>% ejecución {year}</th>))}
                        {levels.map((level, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>{level.LevelName}</th>))}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        {years.map((year, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>Programado {year}</th>))}
                        {years.map((year, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>Ejecutado {year}</th>))}
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