import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";
import { thunkGetSecretaries } from "@/store/plan/thunks";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { generateExcel, sortData } from "@/utils";
import {
    ReportPDTInterface,
    YearDetail,
    ModalProps,
    NodesWeight } from "@/interfaces";

export const ModalSecretary = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <div>
            <ModalPDT
                modalIsOpen={modalIsOpen}
                callback={setModalIsOpen}/>
            <IconButton aria-label="delete"
                        size="large"
                        color='secondary'
                        title='Generar reporte por Secretarias'
                        className=" tw-transition
                                    hover:tw--translate-y-1
                                    hover:tw-scale-[1.4]"
                        onClick={()=>setModalIsOpen(true)}>
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
}

const ModalPDT = ( props: ModalProps ) => {
    const dispatch = useAppDispatch();

    const { years, levels, secretaries, loadingReport,
            colorimeter } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [secretary, setSecretary] = useState<string>('');
    const [indexYear, setIndexYear] = useState<number>(0);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined)
            dispatch(thunkGetSecretaries(id_plan));
    }, []);

    useEffect(() => {
        if (secretaries == undefined) return;
        if (secretaries.length > 0)
            setSecretary(secretaries[0].name);
    }, [secretaries]);

    useEffect(() => {
        genReport();
    }, [secretary, indexYear]);

    const findRoot = (id: string) => {
        let root = [] as string[];
        const pesosStr = localStorage.getItem('UnitNode');
        const pesos: NodesWeight[] = pesosStr ? JSON.parse(pesosStr) : [];
        let ids = id.split('.');
        if (ids.length !== levels.length + 1) return root;
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
        ids2.forEach((id) => {
            const node = pesos.find((item) => item.id_node === id);
            if (node) {
                root.push(node.name);
            }
        });
        return root;
    };

    const genReport = () => {
        const detalleStr = localStorage.getItem('YearDeta');
        const detalle = detalleStr ? JSON.parse(detalleStr) : [];
        const nodes = detalle.filter((item: YearDetail) =>
            item.responsible === secretary && item.year === years[indexYear]);
        let data: ReportPDTInterface[] = [];

        nodes.forEach( async (item: YearDetail) => {
            let percent = (item.physical_execution/item.physical_programming)*100;
            percent = percent || 0;
            percent = Math.round(percent*100)/100;
            const root = findRoot(item.id_node);
            const item_: ReportPDTInterface = {
                responsible: item.responsible??'',
                goalCode: item.code,
                goalDescription: item.description,
                percentExecuted: [percent],
                planSpecific: root,
                indicator: item.indicator,
                base: item.base_line,
                executed: [item.physical_execution],
                programed: [item.physical_programming]
            };
            data.push(item_);
        });
        //data = data.filter((item: ReportPDTInterface) => item.responsible !== secretary);
        data = sortData(data);
        dispatch(setLoadingReport(false));
        setData(data);
    };

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLoadingReport(true));
        setSecretary(e.target.value);
    };

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index:number) => {
        e.preventDefault();
        dispatch(setLoadingReport(true));
        setIndexYear(index);
    };

    const colorClass = (item: ReportPDTInterface) => (
        item['percentExecuted'][0] < 0 ? 'tw-bg-gray-400' :
        item['percentExecuted'][0] < colorimeter[0] ? 'tw-bg-redColory'   :
        item['percentExecuted'][0] < colorimeter[1] ? 'tw-bg-yellowColory':
        item['percentExecuted'][0] < colorimeter[2] ? 'tw-bg-greenColory' :
        'tw-bg-blueColory hover:tw-ring-blue-200'
    );

    const tableBody = (item: ReportPDTInterface, index: number) =>
        <tr key={index}>
            <td className='tw-border tw-p-2'>{item.responsible}</td>
            <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
            <td className='tw-border tw-p-2'>{item.goalDescription}</td>
            <td className={`tw-border tw-p-2 tw-text-center ${colorClass(item)}`} >
                {item['percentExecuted'][0] < 0 ? 0 : item['percentExecuted'][0]}
            </td>
            {levels.map((level, index) =>
                <td className='tw-border tw-p-2'
                    key={level.name}>
                    {item['planSpecific'][index]}
                </td>
            )}
            <td className='tw-border tw-p-2'>{item.indicator}</td>
            <td className='tw-border tw-p-2 tw-text-center'>{item.base}</td>
            <td className='tw-border tw-p-2 tw-text-center'>{item['programed'][0]}</td>
            <td className='tw-border tw-p-2 tw-text-center'>{item['executed'][0]}</td>
        </tr>
    ;

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={() => props.callback(false)}
                contentLabel='Modal de secretarias'>
            {loadingReport ? <Spinner />: <div>
            <div className="tw-absolute tw-top-0 tw-right-0">
                <button className=" tw-px-2"
                        onClick={() => props.callback(false)}>
                    <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                        X
                    </p>
                </button>
            </div>
            <div className='tw-flex tw-flex-col md:tw-flex-row'>
                <div className="tw-mb-2">
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center'>Escoger Año</h1>
                    {years.map((year, index) =>
                        <button className={`
                                            ${indexYear === index ?
                                                'tw-bg-gray-500 tw-text-white hover:tw-bg-gray-300 hover:tw-text-black' :
                                                'tw-bg-gray-300 hover:tw-bg-gray-500 hover:tw-text-white'}
                                            tw-border-black
                                            tw-rounded tw-border
                                            tw-p-1 tw-mx-1`}
                                onClick={e => handleBtn(e, index)}
                                key={year}>
                            {year}
                        </button>
                    )}
                </div>
                <div className='md:tw-ml-6'>
                    <h1 className='tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center'>Secretarias</h1>
                    <select name=""
                            value={secretary}
                            onChange={e => handleChangeSecretary(e)}
                            className="tw-border-2 tw-p-1 tw-mb-2 tw-rounded">
                        {secretaries && secretaries.map(s =>
                            <option value={s.name} key={s.name}>{s.name}</option>
                        )}
                    </select>
                </div>
                <button className=' tw-bg-gray-300 hover:tw-bg-gray-500
                                    hover:tw-text-white
                                    tw-rounded tw-border tw-border-black
                                    tw-px-2 tw-py-1 md:tw-ml-3 tw-mr-3'
                        onClick={() => generateExcel(data,'InformeSecretarias', levels, years[indexYear], colorimeter)}>
                    Exportar
                </button>
            </div>
            <table  className="tw-mt-3"
                    id="TablaSecretarias">
                <thead>
                    <tr>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Codigo de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>% ejecución {years[indexYear]}</th>
                        {levels.map(level =>
                            <th className='tw-border tw-bg-gray-400 tw-p-2'
                                key={level.name}>
                                {level.name}
                            </th>
                        )}
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>
                            Programado {years[indexYear]}
                        </th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>
                            Ejecutado {years[indexYear]}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => tableBody(item, index))}
                </tbody>
            </table>
            </div>}
        </Modal>
    );
}