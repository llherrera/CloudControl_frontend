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

const ModalPDT = (props: ModalPDTProps): JSX.Element => {
    const { years, levels, loadingReport, colorimeter } = useAppSelector(store => store.plan);

    // Helpers (igual que antes)...
    const parseCsv = (s?: string) => {
        if (!s) return [];
        // Extract values between [] brackets
        const matches = s.match(/\[([^\]]*)\]/g);
        if (!matches) return [];
        return matches.map(match => match.slice(1, -1).trim());
    };

    const fmtNumberIfPossible = (v: string | number | undefined) => {
        if (v === undefined || v === null || v === "") return "";
        const str = String(v).replace(/\s+/g, '');
        const n = Number(str);
        if (!Number.isFinite(n)) return String(v);
        return n.toLocaleString();
    };

    const getPlanParts = (planSpecificRaw: string) => {
        const parts = parseCsv(planSpecificRaw);
        console.log('planSpecificRaw:', planSpecificRaw);
        console.log('parts:', parts);
        const [metaFromPlan = "", subprograma = "", programa = "", sector = "", dimension = ""] = parts;
        return { metaFromPlan, subprograma, programa, sector, dimension };
    };

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
                <td className='tw-border tw-p-2'>{item.goalCode.replace(/(\.\d+)(?=\.)/, '')}</td>
                <td className='tw-border tw-p-2'>{item.goalDescription}</td>
                <td className='tw-border tw-p-2'>{plan.metaFromPlan}</td>
                <td className='tw-border tw-p-2'>{item.responsible}</td>
                <td className='tw-border tw-p-2'>{plan.dimension}</td>
                <td className='tw-border tw-p-2'>{plan.sector}</td>
                <td className='tw-border tw-p-2'>{plan.programa}</td>
                <td className='tw-border tw-p-2'>{plan.subprograma}</td>
                <td className='tw-border tw-p-2'>{item.indicator}</td>
                <td className='tw-border tw-p-2'>{fmtNumberIfPossible(item.base)}</td>

                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {fmtNumberIfPossible(pickProgramed(index))}
                    </td>
                ))}

                {years.map((year, index) => (
                    <td className='tw-border tw-p-2' key={year}>
                        {fmtNumberIfPossible(pickExecuted(index))}
                    </td>
                ))}

                {years.map((year, index) => (
                    <td key={year} className={`tw-border tw-p-2 tw-text-center ${colorClass(item, index)}`}>
                        {pickPercent(index)}
                    </td>
                ))}
            </tr>
        );
    };

    const data = props.data;

    return (
        <Modal isOpen={props.modalIsOpen} onRequestClose={() => props.callback(false)} contentLabel="Modal de Plan">
            {loadingReport ? (
                <Spinner />
            ) : (
                <div>
                    <div className="tw-absolute tw-top-0 tw-right-0">
                        <button className="tw-px-2" onClick={() => props.callback(false)}>
                            <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">X</p>
                        </button>
                    </div>
                    <h1>Plan</h1>
                    <button
                        className="tw-bg-gray-300 hover:tw-bg-gray-200 tw-rounded tw-border tw-border-black tw-px-2 tw-py-1 tw-ml-3"
                        onClick={() => generateExcelYears(props.data, 'InformeTotal', levels, years, colorimeter)}
                    >
                        Exportar
                    </button>
                    <table id="TablaTotal">
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
                                {years.map(year => (
                                    <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                        Programado {year}
                                    </th>
                                ))}
                                {years.map(year => (
                                    <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                        Ejecutado {year}
                                    </th>
                                ))}
                                {years.map(year => (
                                    <th className='tw-border tw-bg-gray-400 tw-p-2' key={year}>
                                        % ejecución {year}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => tableBody(item))}
                        </tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};
