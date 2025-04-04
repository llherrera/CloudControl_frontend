import React, { useEffect, useState, useRef } from "react";
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
import { generateExcelYears, sortData } from "@/utils";

export const ModalProgram = () => {
    const dispatch = useAppDispatch();
    const tableRef = useRef(null);

    const { levels,
            nodesReport,
            years,
            loadingReport,
            colorimeter } = useAppSelector(store => store.plan);
    let levels_ = levels.slice(0, -1);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex_] = useState<number[]>(levels_.map(() => 0));

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
                        if (res.length === 0) break;
                        parent = res[index_[i]].id_node;
                        response.push(res);
                    }
                }
            }
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    useEffect(() => {
        const fetch = async () => {
            if (modalIsOpen)
                await genReport();
        }
        fetch();
    }, [programs]);

    const handleProgramBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setModalIsOpen(true);
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
        let data: ReportPDTInterface[] = [];

        await Promise.all(pesos.map(async (peso: NodesWeight) => {
            const { id_node, percents } = peso;
            if (id_node.split('.').length !== levels.length + 1) return;
            /*const ids = id_node.split('.');
            if (ids.length !== levels.length + 1) return;
            let ids2 = ids.reduce((acumulator:string[], currentValue: string) => {
                if (acumulator.length === 0) {
                    return [currentValue];
                } else {
                    const ultimoElemento = acumulator[acumulator.length - 1];
                    const concatenado = `${ultimoElemento}.${currentValue}`;
                    return [...acumulator, concatenado];
                }
            }, []);
            ids2 = ids2.slice(1);*/
            const percentages = percents?.map((percentages: Percentages) => percentages.progress*100);
            let root: {nodo:string, nivel:string}[] = await getLevelName(id_node);
            let root_: string[] = root.map(item => item.nodo);
            const nodeYears = detalle.filter((item: YearDetail) => item.id_node === id_node) as YearDetail[];

            const executed = nodeYears.map((item: YearDetail) => item.physical_execution);
            const programed = nodeYears.map((item: YearDetail) => item.physical_programming);

            const item: ReportPDTInterface = {
                responsible: nodeYears[0].responsible??'',
                goalCode: nodeYears[0].code,
                goalDescription: nodeYears[0].description,
                percentExecuted: percentages!,
                planSpecific: root_,
                indicator: nodeYears[0].indicator,
                base: nodeYears[0].base_line,
                executed: executed,
                programed: programed
            };
            data.push(item);
        }))
        data = sortData(data);
        dispatch(setLoadingReport(false));
        setData(data);
    };

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
        setIndex_(newIndex_);
    };

    const coloClass = (item: ReportPDTInterface, index: number) => (
        item['percentExecuted'][index] < 0 ? 'tw-bg-gray-400' :
        item['percentExecuted'][index] < colorimeter[0] ? 'tw-bg-redColory'   :
        item['percentExecuted'][index] < colorimeter[1] ? 'tw-bg-yellowColory':
        item['percentExecuted'][index] < colorimeter[2] ? 'tw-bg-greenColory' :
        'tw-bg-blueColory hover:tw-ring-blue-200'
    );

    const tableBody = (item: ReportPDTInterface) =>
        <tr key={item.responsible}>
            <td className='tw-border tw-p-2'>{item.responsible}</td>
            <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
            <td className='tw-border tw-p-2'>{item.goalDescription}</td>
            {years.map((year, index) =>
                <td key={year}
                    className={`tw-border tw-p-2 tw-text-center ${coloClass(item, index)} `}>
                    {item['percentExecuted'][index] < 0 ? 0 : item['percentExecuted'][index]}
                </td>
            )}
            {levels.map((level, index) =>
                <td className='tw-border tw-p-2'
                    key={level.name}>
                    {item['planSpecific'][index]}
                </td>
            )}
            <td className='tw-border tw-p-2'>{item.indicator}</td>
            <td className='tw-border tw-p-2'>{item.base}</td>
            {years.map((year, index) =>
                <td className='tw-border tw-p-2'
                    key={year}>
                    {item['programed'][index]}
                </td>
            )}
            {years.map((year, index) =>
                <td className='tw-border tw-p-2'
                    key={year+index+1}>
                    {item['executed'][index]}
                </td>
            )}
        </tr>
    ;

    const ModalPDT = () => {
        return (
            <Modal  isOpen={modalIsOpen}
                    onRequestClose={()=>setModalIsOpen(true)}
                    contentLabel='Modal de programas'>
                {loadingReport ? <Spinner/> : <div>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                            onClick={() => setModalIsOpen(false)}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
                <div className='tw-flex tw-relative tw-mt-2'>
                    {programs.map((program, index) =>
                        <div key={index}>
                            <h1 className='tw-bg-slate-300 tw-text-center tw-rounded tw-p-1 tw-mr-3'>{levels[index].name}</h1>
                            <select value={program[index_[index]].name}
                                    onChange={e => handleChangePrograms(index, e)}
                                    className='tw-border tw-border-gray-300 tw-rounded tw-mr-3'
                                    key={program.length}>
                                {program.map(node => <option value={node.name} key={node.id_level}>{node.name}</option>)}
                            </select>
                        </div>
                    )}
                    <button className='tw-bg-gray-300 hover:tw-bg-gray-200
                                        tw-rounded tw-border tw-border-black
                                        tw-px-2 tw-py-1 tw-ml-3'
                            onClick={() => generateExcelYears(data, 'InformeProgramas', levels, years, colorimeter)}>
                        Exportar
                    </button>
                </div>
                <table  className="tw-mt-3" 
                        id="TablaProgramas"
                        ref={tableRef}>
                    <thead>
                        <tr>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                            {years.map((year) => (
                                <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                    key={year}>
                                    % ejecución {year}
                                </th>
                            ))}
                            {levels.map((level) => (
                                <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                    key={level.name}>
                                    {level.name}
                                </th>
                            ))}
                            <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                            {years.map((year) =>
                                <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                    key={year}>
                                    Programado {year}
                                </th>
                            )}
                            {years.map((year, index) =>
                                <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                    key={year+index+1}>
                                    Ejecutado {year}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => tableBody(item))}
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
                        type="button"
                        title='Generar reporte por Programas'
                        className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={(e)=>handleProgramBtn(e)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    )
}
