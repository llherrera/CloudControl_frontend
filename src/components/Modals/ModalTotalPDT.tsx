import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { 
    ReportPDTInterface, 
    NodesWeight, 
    Percentages, 
    YearDetail, 
    ModalPDTProps } from "@/interfaces";
import { getLevelName } from "@/services/api";
import { generateExcelYears } from "@/utils";

export const ModalTotalPDT = () => {
    const dispatch = useAppDispatch();
    const { levels } = useAppSelector((state) => state.plan);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface[]>([]);

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setModalIsOpen(true);
        dispatch(setLoadingReport(true));
        genReport().then((data) => setData(data));
    };

    const genReport = async () => {
        const pesosStr = localStorage.getItem('UnitNode');
        const detalleStr = localStorage.getItem('YearDeta');
        const pesos = pesosStr ? JSON.parse(pesosStr) : [];
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const data: ReportPDTInterface[] = [];

        await Promise.all(pesos.map(async (peso: NodesWeight) => {
            const { id_node, percents } = peso;
            const ids = id_node.split('.');
            if (ids.length !== levels.length + 1) return;
            const percentages = percents?.map((Percentages: Percentages) => Percentages.progress*100);
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
        }));
        dispatch(setLoadingReport(false));
        return data;
    };

    return (
        <div>
            <ModalPDT 
                modalIsOpen={modalIsOpen} 
                callback={setModalIsOpen} 
                data={data}/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='inherit' 
                        title='Generar reporte del Plan Indicativo Total'
                        className="tw-transition 
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={(e)=>handleBtn(e)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
}

const ModalPDT = ( props: ModalPDTProps ) => {
    const { years, 
            levels, 
            loadingReport, 
            colorimeter } = useAppSelector((state) => state.plan);

    const colorClass = (item: ReportPDTInterface, index: number) => (
        item['percentExecuted'][index] < 0 ? 'tw-bg-gray-400' :
        item['percentExecuted'][index] < colorimeter[0] ? 'tw-bg-redColory'   :
        item['percentExecuted'][index] < colorimeter[1] ? 'tw-bg-yellowColory':
        item['percentExecuted'][index] < colorimeter[2] ? 'tw-bg-greenColory' :
        'tw-bg-blueColory hover:tw-ring-blue-200'
    );

    const tableBody = (item: ReportPDTInterface) => {
        return (
            <tr key={item.responsible.length}>
                <td className='tw-border tw-p-2'>{item.responsible}</td>
                <td className='tw-border tw-p-2'>{item.goalCode}</td>
                <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                {years.map((year, index) => (
                    <td key={year}
                        className={`tw-border tw-p-2 tw-text-center 
                        ${colorClass(item, index)}
                        `}>
                        {item['percentExecuted'][index] < 0 ? 0 : item['percentExecuted'][index]}
                    </td>
                ))}
                {levels.map((level, index) => (
                    <td className='tw-border tw-p-2' key={level.name.length}>
                        {item['planSpecific'][index]}
                    </td>
                ))}
                <td className='tw-border tw-p-2'>{item.indicator}</td>
                <td className='tw-border tw-p-2'>{item.base}</td>
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {item['programed'][index]}
                    </td>
                ))}
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {item['executed'][index]}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>props.callback(false)}
                contentLabel='Modal de Plan'>
            {loadingReport ? <Spinner/> : <div>
            <h1>Plan</h1>
            <button className='tw-bg-gray-300 hover:tw-bg-gray-200 
                                tw-rounded tw-border tw-border-black 
                                tw-px-2 tw-py-1 tw-ml-3'
                    onClick={()=>generateExcelYears(props.data, 'InformeTotal', levels, years, colorimeter)}>
                Exportar
            </button>
            <button className='tw-bg-red-300 hover:tw-bg-red-200 
                                    tw-rounded 
                                    tw-px-3 tw-py-1 tw-mt-3
                                    tw-right-0 tw-absolute'
                    onClick={() => props.callback(false)}>X</button>
            <table id="TablaTotal">
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        {years.map((year) => (
                            <th className=' tw-border tw-bg-gray-400 
                                            tw-p-2' 
                                key={year}>
                                % ejecución {year}
                            </th>
                        ))}
                        {levels.map((level) => (
                            <th className=' tw-border tw-bg-gray-400
                                            tw-p-2' 
                                key={level.name.length}>
                                {level.name}
                            </th>
                        ))}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        {years.map((year) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                key={year}>
                                Programado {year}
                            </th>
                        ))}
                        {years.map((year) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' 
                                key={year}>
                                Ejecutado {year}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item) => tableBody(item))}
                </tbody>
            </table>
            </div>}
        </Modal>
    );
}