import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setNodesReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { PesosNodos, Porcentaje, ReportPDTInterface, 
        YearDetail, NodoInterface, Node } from "@/interfaces";
import { getLevelName, getLevelNodes } from "@/services/api";
import { exportFile } from "@/utils";

export const ModalProgram = () => {
    const dispatch = useAppDispatch();

    const { levels, nodesReport, years, loadingReport } = useAppSelector((state) => state.plan);
    let levels_ = levels.slice(0, -1)

    const [modalProgramsIsOpen, setModalProgramsIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [programs, setPrograms] = useState<NodoInterface[][]>([])
    const [index_, setIndex] = useState<number[]>(levels_.map(() => 0))

    useEffect(() => {
        const fetch = async () => {
            let parent: (string | null) = null;
            let response = [] as NodoInterface[][];
            for (let i = 0; i < levels.length; i++) {
                if (i === levels.length-1) {
                    const res = await getLevelNodes({id_level: levels[i].id_nivel!, parent: parent});
                    dispatch(setNodesReport(res));
                } else {
                    const { id_nivel } = levels_[i];
                    if (id_nivel) {
                        const res = await getLevelNodes({id_level: id_nivel, parent: parent});
                        const temp_ = [] as NodoInterface[];
                        res.forEach((item:Node) => {
                            temp_.push({
                                id_node: item.id_nodo,
                                NodeName: item.Nombre,
                                Description: item.Descripcion,
                                Parent: item.Padre,
                                id_level: item.id_nivel,
                                Weight: 0,
                            });
                        });
                        const temp = [...programs];
                        temp[i] = temp_;
                        parent = res[index_[i]].id_nodo;
                        response.push(temp_);
                    }
                }
            }
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    useEffect(() => {
        const fetch = async () => {
            if (modalProgramsIsOpen)
                await genReport();
        }
        fetch();
    }, [programs]);

    const handleProgramBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setModalProgramsIsOpen(true)
        dispatch(setLoadingReport(true))
        genReport()
    }

    const genReport = async () => {
        const pesosStr = localStorage.getItem('pesosNodo');
        const detalleStr = localStorage.getItem('detalleAño');
        let pesos = pesosStr ? JSON.parse(pesosStr) : [];
        const nodesReport_ = nodesReport.map((item: Node) => item.id_nodo);
        pesos = pesos.filter((item:PesosNodos)=> nodesReport_.includes(item.id_nodo) );
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const data: ReportPDTInterface[] = [];

        await Promise.all(pesos.map(async (peso: PesosNodos) => {
            const { id_nodo, porcentajes } = peso;
            const ids = id_nodo.split('.');
            if (ids.length !== levels.length + 1) return;
            const percentages = porcentajes?.map((porcentaje: Porcentaje) => porcentaje.progreso*100);
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
            let root = await getLevelName(ids2);
            root = root.map((item: any) => item[0]);
            const nodeYears = detalle.filter((item: YearDetail) => item.id_nodo === id_nodo) as YearDetail[];

            const executed = nodeYears.map((item: YearDetail) => item.Ejecucion_fisica);
            const programed = nodeYears.map((item: YearDetail) => item.Programacion_fisica);
            
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
            };
            data.push(item);
        }))
        dispatch(setLoadingReport(false));
        setData(data);
    }

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
        } else {
            newIndex_[index] = newIndex;
            for (let i = index+1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
        }
        setIndex(newIndex_);
    }
    
    const ModalPDT = () => {
        return (
            <Modal  isOpen={modalProgramsIsOpen}
                    onRequestClose={()=>setModalProgramsIsOpen(false)}
                    contentLabel='Modal de programas'>
                {loadingReport ? <Spinner/> : <div>
                <div className='tw-flex tw-relative'>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3'>Programas</h1>
                    {programs.map((program, index) => (
                        <select value={program[index_[index]].NodeName}
                                onChange={(e)=>handleChangePrograms(index, e)}
                                className='tw-border tw-border-gray-300 tw-rounded tw-mr-3'
                                key={index}>
                            {program.map((node, index) => (<option value={node.NodeName} key={index}>{node.NodeName}</option>))}
                        </select>
                    
                    ))}
                    <button className='tw-bg-gray-300 hover:tw-bg-gray-200 
                                        tw-rounded tw-border tw-border-black 
                                        tw-px-2 tw-py-1 tw-ml-3'
                            onClick={()=>exportFile('TablaProgramas','InformeProgramas')}>
                        Exportar
                    </button>
                    <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                            tw-rounded 
                                            tw-px-3 tw-py-1 tw-mt-3
                                            tw-right-0 tw-absolute'
                            onClick={() => setModalProgramsIsOpen(false)}>
                        X
                    </button>
                </div>
                <table className="tw-mt-3" id="TablaProgramas">
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
                </div>}
            </Modal>
        )
    }

    return (
        <div>
            <ModalPDT/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='primary' 
                        title='Generar reporte por Programas'
                        className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={(e)=>handleProgramBtn(e)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    )
}
