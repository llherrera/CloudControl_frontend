import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import {
    ReportPDTInterface, NodesWeight, Percentages,
    YearDetail, ModalPDTProps, ReportPDTInterface2
} from "@/interfaces";
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

        data_ = await generalReport(id_plan);
        dispatch(setLoadingReport(false));
        return data_;
    };

    return (
        <div>
            <ModalPDT
                modalIsOpen={modalIsOpen}
                callback={setModalIsOpen}
                data={data_} />
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

const ModalPDT = (props: ModalPDTProps) => {
    const { years,
        levels,
        loadingReport,
        colorimeter } = useAppSelector(store => store.plan);

    // Helpers
    const parseCsv = (s?: string) => (s || "").split(",").map(p => p.trim());

    const fmtNumberIfPossible = (v: string | number | undefined) => {
        if (v === undefined || v === null || v === "") return "";
        // remove spaces and try parse
        const str = String(v).replace(/\s+/g, '');
        const n = Number(str);
        if (!Number.isFinite(n)) return String(v);
        // show as plain number with thousands separators
        return n.toLocaleString();
    };

    // planSpecific expected order: "Meta,Subprograma,Programa,Sector,Dimension"
    const getPlanParts = (planSpecificRaw: string) => {
        const parts = parseCsv(planSpecificRaw);
        const [
            metaFromPlan = "",
            subprograma = "",
            programa = "",
            sector = "",
            dimension = ""
        ] = parts;
        return { metaFromPlan, subprograma, programa, sector, dimension };
    };

    const parsePercentArray = (item: ReportPDTInterface2) => parseCsv(item.percentExecuted).map(p => p === '' ? '' : Number(p));

    const colorClass = (item: ReportPDTInterface2, index: number) => {
        const percentArr = parseCsv(item.percentExecuted);
        const raw = percentArr[index];
        const value = raw === undefined || raw === '' ? NaN : Number(raw);
        if (Number.isNaN(value)) return 'tw-bg-gray-400';
        if (value < 0) return 'tw-bg-gray-400';
        if (value < colorimeter[0]) return 'tw-bg-redColory';
        if (value < colorimeter[1]) return 'tw-bg-yellowColory';
        if (value < colorimeter[2]) return 'tw-bg-greenColory';
        return 'tw-bg-blueColory hover:tw-ring-blue-200';
    };

    const tableBody = (item: ReportPDTInterface2) => {
        const plan = getPlanParts(item.planSpecific);
        const percentArr = parseCsv(item.percentExecuted);
        const programedArr = parseCsv(item.programed);
        const executedArr = parseCsv(item.executed);

        // helper to safely pick value and format numbers when needed
        const pickProgramed = (i: number) => programedArr[i] ?? '';
        const pickExecuted = (i: number) => executedArr[i] ?? '';
        const pickPercent = (i: number) => {
            const raw = percentArr[i];
            const num = raw === undefined || raw === '' ? NaN : Number(raw);
            if (Number.isNaN(num)) return 0;
            return num < 0 ? 0 : num;
        };

        return (
            <tr key={item.goalCode}>
                <td className='tw-border tw-p-2'>{item.responsible}</td>
                {/* mantengo la lógica previa para goalCode pero no altero mucho */}
                <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
                <td className='tw-border tw-p-2'>{item.goalDescription}</td>

                {/* % ejecución por año */}
                {years.map((year, index) => (
                    <td key={year}
                        className={`tw-border tw-p-2 tw-text-center 
                            ${colorClass(item, index)}
                        `}>
                        {pickPercent(index)}
                    </td>
                ))}

                {/* niveles: mapeo según el nombre del nivel */}
                {levels.map((level, index) => {
                    const keyName = (level.name || '').toLowerCase();
                    let value = '';
                    if (keyName.includes('dimension')) value = plan.dimension;
                    else if (keyName.includes('sector')) value = plan.sector;
                    else if (keyName.includes('programa') || keyName.includes('program')) value = plan.programa;
                    else if (keyName.includes('subprograma') || keyName.includes('subprogram')) value = plan.subprograma;
                    else if (keyName.includes('meta')) value = plan.metaFromPlan;
                    else {
                        // fallback: si levels coincide con el orden de planSpecific (Meta, Subprograma, ...)
                        const fallbackArr = [plan.metaFromPlan, plan.subprograma, plan.programa, plan.sector, plan.dimension];
                        value = fallbackArr[index] ?? '';
                    }

                    return (
                        <td className='tw-border tw-p-2' key={level.name}>
                            {value}
                        </td>
                    );
                })}

                <td className='tw-border tw-p-2'>{item.indicator}</td>

                {/* línea base: formateo si es número */}
                <td className='tw-border tw-p-2'>{fmtNumberIfPossible(item.base)}</td>

                {/* programado por año (formateo de números) */}
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {fmtNumberIfPossible(pickProgramed(index))}
                    </td>
                ))}

                {/* ejecutado por año (formateo de números, maneja notación exponencial) */}
                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {fmtNumberIfPossible(pickExecuted(index))}
                    </td>
                ))}
            </tr>
        );
    };

    const data = props.data;

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => props.callback(false)}
            contentLabel='Modal de Plan'>
            {loadingReport ? <Spinner /> : <div>
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
                    onClick={() => generateExcelYears(props.data, 'InformeTotal', levels, years, colorimeter)}>
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
                        {(() => {
                            console.log("[ModalPDT] Data completa de la tabla:", data);
                            return data.map(item => tableBody(item));
                        })()}
                    </tbody>

                </table>
            </div>}
        </Modal>
    );
}
