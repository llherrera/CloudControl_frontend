import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { ReportPDTInterface, NodesWeight, Percentages,
    YearDetail, ModalPDTProps, ReportPDTInterface2 } from "@/interfaces";
import { getLevelName, generalReport } from "@/services/api";
import { generateExcelYears, sortData } from "@/utils";

export const ModalTotalPDT = () => {
    const dispatch = useAppDispatch();

    const { levels } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [data_, setData_] = useState<ReportPDTInterface2[]>([]);

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setModalIsOpen(true);
        dispatch(setLoadingReport(true));
        genReport().then(data => setData_(data));
    };

    const genReport = async () => {
        const pesosStr = localStorage.getItem('UnitNode');
        const detalleStr = localStorage.getItem('YearDeta');
        const pesos = pesosStr ? JSON.parse(pesosStr) : [];
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const data: ReportPDTInterface[] = [];
        let data_: ReportPDTInterface2[] = [];
        /*
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
            ids2 = ids2.slice(1);
            //
            const percentages = percents?.map((Percentages: Percentages) => Percentages.progress*100);
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
        }));
        */
        data_ = await generalReport(id_plan);
        dispatch(setLoadingReport(false));
        return data_;
    };

    return (
        <div>
            <ModalPDT
                modalIsOpen={modalIsOpen}
                callback={setModalIsOpen}
                data={data_}/>
            <IconButton aria-label="delete"
                        size="large"
                        color='inherit'
                        title='Generar reporte del Plan Indicativo Total'
                        className="tw-transition
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={e => handleBtn(e)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
}

const ModalPDT = ( props: ModalPDTProps ) => {
    const { years,
            levels,
            loadingReport,
            colorimeter } = useAppSelector(store => store.plan);

    //const data = sortData(props.data);
    const data = props.data;
    const colorClass = (item: ReportPDTInterface2, index: number) => (
        parseFloat(item.percentExecuted.split(',')[index]) < 0 ? 'tw-bg-gray-400' :
        parseFloat(item.percentExecuted.split(',')[index]) < colorimeter[0] ? 'tw-bg-redColory'   :
        parseFloat(item.percentExecuted.split(',')[index]) < colorimeter[1] ? 'tw-bg-yellowColory':
        parseFloat(item.percentExecuted.split(',')[index]) < colorimeter[2] ? 'tw-bg-greenColory' :
        'tw-bg-blueColory hover:tw-ring-blue-200'
    );

    const tableBody = (item: ReportPDTInterface2) => {
        return (
            <tr key={item.goalCode}>
                <td className='tw-border tw-p-2'>{item.responsible}</td>
                <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
                <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                {years.map((year, index) => (
                    <td key={year}
                        className={`tw-border tw-p-2 tw-text-center 
                            ${colorClass(item, index)}
                        `}>
                        {parseFloat(item.percentExecuted.split(',')[index]) < 0 ? 0 : parseFloat(item['percentExecuted'].split(',')[index])}
                    </td>
                ))}
                {levels.map((level, index) => (
                    <td className='tw-border tw-p-2' key={level.name}>
                        {item['planSpecific'].split(',')[index]}
                    </td>
                ))}
                <td className='tw-border tw-p-2'>{item.indicator}</td>
                <td className='tw-border tw-p-2'>{item.base}</td>
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {item['programed'].split(',')[index]}
                    </td>
                ))}
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {item['executed'].split(',')[index]}
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
            <div className="tw-absolute tw-top-0 tw-right-0">
                <button className=" tw-px-2"
                        onClick={() => props.callback(false)}>
                    <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                        X
                    </p>
                </button>
            </div>
            <h1>Plan</h1>
            <button className='tw-bg-gray-300 hover:tw-bg-gray-200
                                tw-rounded tw-border tw-border-black
                                tw-px-2 tw-py-1 tw-ml-3'
                    onClick={()=>generateExcelYears(props.data, 'InformeTotal', levels, years, colorimeter)}>
                Exportar
            </button>
            <table id="TablaTotal">
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        {years.map(year =>
                            <th className=' tw-border tw-bg-gray-400 tw-p-2'
                                key={year}>
                                % ejecución {year}
                            </th>
                        )}
                        {levels.map((level) => (
                            <th className=' tw-border tw-bg-gray-400
                                            tw-p-2'
                                key={level.name}>
                                {level.name}
                            </th>
                        ))}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        {years.map(year =>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'
                                key={year}>
                                Programado {year}
                            </th>
                        )}
                        {years.map(year =>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'
                                key={year}>
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
    );
}