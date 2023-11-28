import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";

import { Node } from "@/interfaces";

export const ModalProgram = () => {
    const { indexLevel, levels } = useAppSelector((state) => state.plan);

    const [modalProgramsIsOpen, setModalProgramsIsOpen] = useState(false);

    const handleProgramBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if ( indexLevel === levels.length-1 )
            setModalProgramsIsOpen(true)
        else
            alert('Primero acceda a un programa')
    }

    return (
        <div>
            <ModalPDT modalIsOpen={modalProgramsIsOpen} callback={setModalProgramsIsOpen}/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='primary' 
                        title='Generar reporte por Programas'
                        //onClick={(e)=>handleDownload(e, 0)}>
                        onClick={(e)=>handleProgramBtn(e)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    )
}

const ModalPDT = ( props: any ) => {
    const dispatch = useAppDispatch();

    const { years, levels, nodes } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<any[]>([]);
    const [programs, setPrograms] = useState<string[]>(["1","2","3","4"])
    const [program, setProgram] = useState<string>(programs[0])

    useEffect(() => {
        
    }, []);

    const handleChangeProgram = (e: React.ChangeEvent<HTMLSelectElement>) => {setProgram(e.target.value)};

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de programas'>
            <div className='tw-flex tw-relative'>
                <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3'>Programas</h1>
                <select value={program}
                        onChange={(e)=>props.callback(e)}
                        className='tw-border tw-border-gray-300 tw-rounded tw-mr-3'>
                        {nodes.map((node: Node, index: number) => (<option value={node.Nombre} key={index}>{node.Nombre}</option>))}
                </select>

                <button className='tw-bg-gray-300 hover:tw-bg-gray-200 
                                    tw-rounded tw-border tw-border-black 
                                    tw-px-2 tw-py-1 tw-ml-3'>Exportar</button>
            <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                    onClick={() => props.callback(false)}>X</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        {years.map((year, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>% ejecución{year}</th>))}
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