import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setNodesReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { 
    NodesWeight, 
    Percentages, 
    ReportPDTInterface, 
    YearDetail, 
    NodeInterface, 
    Node } from "@/interfaces";
import { getLevelName, getLevelNodes } from "@/services/api";
import { exportFile } from "@/utils";

export const ModalProgram = () => {
    const dispatch = useAppDispatch();

    const { levels, 
            nodesReport, 
            years, 
            loadingReport, 
            colorimeter } = useAppSelector((state) => state.plan);
    let levels_ = levels.slice(0, -1);

    const [modalProgramsIsOpen, setModalProgramsIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex] = useState<number[]>(levels_.map(() => 0));

    useEffect(() => {
        const fetch = async () => {
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            for (let i = 0; i < levels.length; i++) {
                if (i === levels.length-1) {
                    const res = await getLevelNodes({id_level: levels[i].id_level!, parent: parent});
                    dispatch(setNodesReport(res));
                } else {
                    const { id_level } = levels_[i];
                    if (id_level) {
                        const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                        const temp_ = [] as NodeInterface[];
                        res.forEach((item:Node) => {
                            temp_.push({
                                id_node: item.id_node,
                                name: item.name,
                                description: item.description,
                                parent: item.parent,
                                id_level: item.id_level,
                                weight: 0,
                            });
                        });
                        const temp = [...programs];
                        temp[i] = temp_;
                        parent = res[index_[i]].id_node;
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
        e.preventDefault();
        setModalProgramsIsOpen(true);
        dispatch(setLoadingReport(true));
        genReport();
    };

    const genReport = async () => {
        const pesosStr = localStorage.getItem('UnitNode');
        const detalleStr = localStorage.getItem('YearDeta');
        let pesos = pesosStr ? JSON.parse(pesosStr) : [];
        const nodesReport_ = nodesReport.map((item: Node) => item.id_node);
        pesos = pesos.filter((item:NodesWeight)=> nodesReport_.includes(item.id_node) );
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const data: ReportPDTInterface[] = [];

        await Promise.all(pesos.map(async (peso: NodesWeight) => {
            const { id_node, percents } = peso;
            const ids = id_node.split('.');
            if (ids.length !== levels.length + 1) return;
            const percentages = percents?.map((percentages: Percentages) => percentages.progress*100);
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
            const nodeYears = detalle.filter((item: YearDetail) => item.id_node === id_node) as YearDetail[];

            const executed = nodeYears.map((item: YearDetail) => item.physical_execution);
            const programed = nodeYears.map((item: YearDetail) => item.physical_programming);
            
            const item: ReportPDTInterface = {
                responsible: nodeYears[0].responsible??'',
                goalCode: id_node,
                goalDescription: nodeYears[0].description,
                percentExecuted: percentages!,
                planSpecific: root,
                indicator: nodeYears[0].indicator,
                base: nodeYears[0].base_line,
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
                        <select value={program[index_[index]].name}
                                onChange={(e)=>handleChangePrograms(index, e)}
                                className='tw-border tw-border-gray-300 tw-rounded tw-mr-3'
                                key={index}>
                            {program.map((node, index) => (<option value={node.name} key={index}>{node.name}</option>))}
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
                            {levels.map((level, index) => (<th className='tw-border tw-bg-gray-400 tw-p-2' key={index}>{level.name}</th>))}
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
                                {years.map((year, index) => (
                                    <td className={`tw-border tw-p-2 tw-text-center
                                    ${item['percentExecuted'][index] < 0 ? 'tw-bg-gray-400' :
                                    (item['percentExecuted'][index]) < colorimeter[0] ? 'tw-bg-redColory'   :
                                    (item['percentExecuted'][index]) < colorimeter[1] ? 'tw-bg-yellowColory':
                                    (item['percentExecuted'][index]) < colorimeter[2] ? 'tw-bg-greenColory' :
                                    'tw-bg-blueColory hover:tw-ring-blue-200'}
                                    `} key={index}>
                                        {item['percentExecuted'][index]}
                                    </td>
                                ))}
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
