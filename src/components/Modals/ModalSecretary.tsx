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

    // traer secretarias cuando cambie el plan
    useEffect(() => {
        if (!id_plan || id_plan <= 0) return;
        if (secretaries === undefined) {
            dispatch(thunkGetSecretaries(id_plan));
        }
    }, [id_plan, secretaries, dispatch]);

    // seleccionar la primera secretaria cuando las cargue
    useEffect(() => {
        if (!secretaries || secretaries.length === 0) return;
        setSecretary(prev => prev || secretaries[0].name);
    }, [secretaries]);

    // regenerar reporte cuando cambie secretaria o año
    useEffect(() => {
        // si secretaria vacía no generar
        if (!secretary) {
            setData([]);
            dispatch(setLoadingReport(false));
            return;
        }
        genReport();
    }, [secretary, indexYear, years, dispatch]); // years agregado por seguridad

    const findRoot = (id: string) => {
        const root: string[] = [];
        const pesosStr = localStorage.getItem('UnitNode');
        const pesos: NodesWeight[] = pesosStr ? JSON.parse(pesosStr) : [];
        const ids = id.split('.');
        if (ids.length !== levels.length + 1) return root;

        let ids2 = ids.reduce((acumulator:string[], currentValue: string) => {
            if (acumulator.length === 0) {
                return [currentValue];
            } else {
                const ultimoElemento = acumulator[acumulator.length - 1];
                const concatenado = `${ultimoElemento}.${currentValue}`;
                return [...acumulator, concatenado];
            }
        }, [] as string[]);
        ids2 = ids2.slice(1);
        ids2.forEach((idN) => {
            const node = pesos.find((item) => item.id_node === idN);
            if (node) root.push(node.name);
        });
        return root;
    };

    const fmtNumberIfPossible = (v: any) => {
        if (v === undefined || v === null || v === '') return '';
        const n = Number(String(v).replace(/\s+/g, ''));
        if (!Number.isFinite(n)) return String(v);
        return n.toLocaleString();
    };

    const genReport = () => {
        dispatch(setLoadingReport(true));
        const detalleStr = localStorage.getItem('YearDeta');
        const detalle: YearDetail[] = detalleStr ? JSON.parse(detalleStr) : [];

        const nodes = detalle.filter((item: YearDetail) =>
            item.responsible === secretary && item.year === years[indexYear]);

        let dataLocal: ReportPDTInterface[] = [];

        // usar for..of para evitar problemas con async en forEach
        for (const item of nodes) {
            // protección: programación puede ser 0 o indefinida
            const prog = Number(item.physical_programming) || 0;
            const exec = Number(item.physical_execution) || 0;
            let percent = 0;
            if (prog > 0) {
                percent = (exec / prog) * 100;
            } else {
                // si no hay programación pero hay ejecución, considerar 100% o 0 según criterio
                percent = exec > 0 ? 100 : 0;
            }
            // redondeo a 2 decimales
            percent = Math.round(percent * 100) / 100;

            const root = findRoot(item.id_node);

            const item_: ReportPDTInterface = {
                responsible: item.responsible ?? '',
                goalCode: item.code,
                goalDescription: item.description,
                percentExecuted: [percent],           // ahora array con un elemento (para el año seleccionado)
                planSpecific: root,                   // array de strings (nodos)
                indicator: item.indicator,
                base: item.base_line,
                executed: [exec],
                programed: [prog]
            };
            dataLocal.push(item_);
        }

        dataLocal = sortData(dataLocal);
        setData(dataLocal);
        dispatch(setLoadingReport(false));
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

    const colorClass = (item: ReportPDTInterface) => {
        const raw = item?.percentExecuted?.[0];
        const value = typeof raw === 'number' ? raw : Number(raw);
        if (Number.isNaN(value) || value < 0) return 'tw-bg-gray-400';
        if (value < colorimeter[0]) return 'tw-bg-redColory';
        if (value < colorimeter[1]) return 'tw-bg-yellowColory';
        if (value < colorimeter[2]) return 'tw-bg-greenColory';
        return 'tw-bg-blueColory hover:tw-ring-blue-200';
    };

    // mapea planSpecific (array) a partes con fallback
    const getPlanParts = (planSpecific: string[]) => {
        // se espera: [Meta, Subprograma, Programa, Sector, Dimension]
        const parts = planSpecific || [];
        return {
            metaFromPlan: parts[0] ?? '',
            subprograma: parts[1] ?? '',
            programa: parts[2] ?? '',
            sector: parts[3] ?? '',
            dimension: parts[4] ?? ''
        };
    };

    const tableBody = (item: ReportPDTInterface, rowIndex: number) => {
        const plan = getPlanParts(item.planSpecific || []);
        return (
            <tr key={rowIndex}>
                <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
                <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                <td className='tw-border tw-p-2'>{plan.metaFromPlan}</td>
                <td className='tw-border tw-p-2'>{item.responsible}</td>
                <td className='tw-border tw-p-2'>{plan.dimension}</td>
                <td className='tw-border tw-p-2'>{plan.sector}</td>
                <td className='tw-border tw-p-2'>{plan.programa}</td>
                <td className='tw-border tw-p-2'>{plan.subprograma}</td>
                <td className='tw-border tw-p-2'>{item.indicator}</td>
                <td className='tw-border tw-p-2 tw-text-center'>{fmtNumberIfPossible(item.base)}</td>
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2 tw-text-center' key={year}>
                        {fmtNumberIfPossible(item.programed?.[index] || 0)}
                    </td>
                ))}
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2 tw-text-center' key={year}>
                        {fmtNumberIfPossible(item.executed?.[index] || 0)}
                    </td>
                ))}
                {years.map((year, index) => {
                    const percentVal = item?.percentExecuted?.[index];
                    const colorClassForYear = () => {
                        const value = typeof percentVal === 'number' ? percentVal : Number(percentVal);
                        if (Number.isNaN(value) || value < 0) return 'tw-bg-gray-400';
                        if (value < colorimeter[0]) return 'tw-bg-redColory';
                        if (value < colorimeter[1]) return 'tw-bg-yellowColory';
                        if (value < colorimeter[2]) return 'tw-bg-greenColory';
                        return 'tw-bg-blueColory hover:tw-ring-blue-200';
                    };
                    return (
                        <td className={`tw-border tw-p-2 tw-text-center ${colorClassForYear()}`} key={year}>
                            {typeof percentVal === 'number' && !Number.isNaN(percentVal) ? percentVal : (Number(percentVal) || 0)}
                        </td>
                    );
                })}
            </tr>
        );
    };

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
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Código de la meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Meta</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Descripción Meta producto</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Responsable</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Dimension</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Sector</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Programa</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Subprograma</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Indicador</th>
                        <th className='tw-border tw-bg-gray-400 tw-p-2'>Línea base</th>
                        {years.map((year) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                Programado {year}
                            </th>
                        ))}
                        {years.map((year) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                Ejecutado {year}
                            </th>
                        ))}
                        {years.map((year) => (
                            <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                % ejecución {year}
                            </th>
                        ))}
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
