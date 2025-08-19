import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setZeroLevelIndex } from "@/store/plan/planSlice";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { ReportPDTInterface2, ModalPDTProps } from "@/interfaces";
import { generalReport } from "@/services/api";
import { generateExcelYears } from "@/utils";

import {
    thunkGetLevelsById,
    thunkGetPDTid,
    thunkGetLocations,
    thunkGetSecretaries,
} from "@/store/plan/thunks";

export const ModalTotalPDT: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector((store) => store.content);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface2[]>([]);

    useEffect(() => {
        if (!id_plan) return;

        dispatch(thunkGetLevelsById(id_plan))
            .unwrap()
            .then((res) => {
                console.log("✅ Niveles cargados:", res);
            })
            .catch((err) => {
                console.error("❌ Error cargando niveles:", err);
            });

        dispatch(setZeroLevelIndex());
    }, [id_plan, dispatch]);



    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setModalIsOpen(true);
        dispatch(setLoadingReport(true));
        genReport().then((d) => setData(d));
    };

    const genReport = async (): Promise<ReportPDTInterface2[]> => {
        const data_: ReportPDTInterface2[] = await generalReport(id_plan);
        dispatch(setLoadingReport(false));
        return data_;
    };

    return (
        <div>
            <ModalPDT modalIsOpen={modalIsOpen} callback={setModalIsOpen} data={data} />
            <IconButton
                size="large"
                color="inherit"
                title="Generar reporte del Plan Indicativo Total"
                className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                onClick={handleBtn}
            >
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
};

const ModalPDT: React.FC<ModalPDTProps> = (props) => {
    // accedo al store de plan (puede venir en distintos formatos)

    const planStore = useAppSelector((s) => (s as any).plan);

    const years: string[] = Array.isArray(planStore?.years)
        ? (planStore.years as string[])
        : [];

    // 🔹 guardamos los levels que vienen del thunk
    const levels: string[] = Array.isArray(planStore?.levels)
        ? (planStore.levels as string[])
        : [];

    const loadingReport: boolean = !!planStore?.loadingReport;

    // helper robusto para colorímetro
    const toNumberArray = (input: unknown, fallback: number[] = [30, 60, 90]): number[] => {
        if (!Array.isArray(input)) return fallback;
        const parsed = (input as unknown[])
            .map((v) => {
                if (typeof v === "number") return v;
                if (typeof v === "string") {
                    const cleaned = v.replace(/,/g, "").trim();
                    const n = Number(cleaned);
                    return Number.isFinite(n) ? n : NaN;
                }
                return NaN;
            })
            .filter((n) => Number.isFinite(n)) as number[];
        return parsed.length > 0 ? parsed : fallback;
    };

    const colorimeter: number[] = toNumberArray(planStore?.colorimeter, [30, 60, 90]);

    // columnas fijas
    const staticBefore = [
        { key: "goalCode", label: "Código de la meta producto" },
        { key: "goalDescription", label: "Meta" },
        { key: "responsible", label: "Responsable" },
    ];
    const staticAfter = [
        { key: "indicator", label: "Indicador" },
        { key: "base", label: "Línea base" },
    ];

    const dynamicHeaders =
        levels.length > 0
            ? levels.map((level, idx) => {
                const safeId = String(level.name)
                    .trim()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_\-]/g, "")
                    .slice(0, 40);

                const label =
                    level.name.trim().toLowerCase() === "meta"
                        ? "Descripción de Meta"
                        : level.name;

                return { key: `dyn-${idx}-${safeId}`, label };
            })
            : [
                { key: "dyn-f-0", label: "Dimensión" },
                { key: "dyn-f-1", label: "Sector" },
                { key: "dyn-f-2", label: "Programa" },
                { key: "dyn-f-3", label: "Subprograma" },
            ];

    const baseHeaders = [...staticBefore, ...dynamicHeaders, ...staticAfter];


    // helpers
    const parseCsv = (s?: string): string[] => {
        if (!s) return [];
        const matches = s.match(/\[([^\]]*)\]/g);
        if (!matches) return [];
        return matches.map((m) => m.slice(1, -1).trim());
    };

    const fmtNumberIfPossible = (v: string | number | undefined) => {
        if (v === undefined || v === null || v === "") return "";
        const str = String(v).replace(/\s+/g, "");
        const n = Number(str);
        if (!Number.isFinite(n)) return String(v);
        return n.toLocaleString();
    };

    const getPlanParts = (planSpecificRaw: string) => {
        const parts = parseCsv(planSpecificRaw);
        const [metaFromPlan = "", subprograma = "", programa = "", sector = "", dimension = ""] = parts;
        return { metaFromPlan, subprograma, programa, sector, dimension };
    };

    const colorClass = (item: ReportPDTInterface2, index: number) => {
        const percentArr = parseCsv(item.percentExecuted);
        const raw = percentArr[index];
        const value = raw === undefined || raw === "" ? NaN : Number(raw);
        if (Number.isNaN(value)) return "tw-bg-gray-400";
        if (value < 0) return "tw-bg-gray-400";
        if (value < colorimeter[0]) return "tw-bg-redColory";
        if (value < colorimeter[1]) return "tw-bg-yellowColory";
        if (value < colorimeter[2]) return "tw-bg-greenColory";
        return "tw-bg-blueColory hover:tw-ring-blue-200";
    };

    const parseGoalCode = (code: string): (string | number)[] => {
        const normalized = String(code).replace(/(^\.)|(\.$)/g, "");
        return normalized.split(".").flatMap((part) => {
            const match = part.match(/^([A-Za-z]+)?(\d+)?$/);
            if (!match) return [part];
            const [, letters, numbers] = match;
            const arr: (string | number)[] = [];
            if (letters) arr.push(letters);
            if (numbers) arr.push(Number(numbers));
            return arr;
        });
    };

    const compareGoalCodes = (a: string, b: string) => {
        const pa = parseGoalCode(a);
        const pb = parseGoalCode(b);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
            const va = pa[i];
            const vb = pb[i];
            if (va === undefined) return -1;
            if (vb === undefined) return 1;
            if (typeof va === "number" && typeof vb === "number") {
                if (va !== vb) return va - vb;
            } else {
                const sa = String(va);
                const sb = String(vb);
                if (sa !== sb) return sa.localeCompare(sb, undefined, { numeric: true });
            }
        }
        return 0;
    };

    const valueForDynamic = (
        label: string,
        planParts: ReturnType<typeof getPlanParts>,
        item: ReportPDTInterface2
    ) => {
    
        const l = label.toLowerCase();
        
        if (l.includes("eje")) {
            return planParts.sector;
        }
        if (l.includes("subprograma")) {
            return planParts.subprograma;
        }
        if (l.includes("programa")) {
            return planParts.subprograma;
        }
        if (l.includes("sector")) {
            return planParts.programa;
        }
        if (l.includes("eje") || l.includes("dimen")) {
            return planParts.dimension;
        }
        if (l.includes("meta")) {
            const val = planParts.metaFromPlan || item.goalDescription;
            return val;
        }
    
        console.log("  Returning default empty string");
        return "";
    };
    

    const tableBody = (item: ReportPDTInterface2) => {
        const plan = getPlanParts(item.planSpecific);
        const percentArr = parseCsv(item.percentExecuted);
        const programedArr = parseCsv(item.programed);
        const executedArr = parseCsv(item.executed);

        return (
            <tr key={item.goalCode}>
                {baseHeaders.map((h) => {
                    if (h.key === "goalCode")
                        return <td className="tw-border tw-p-2">{item.goalCode}</td>;
                    if (h.key === "goalDescription")
                        return <td className="tw-border tw-p-2">{item.goalDescription}</td>;
                    if (h.key === "metaFromPlan")
                        return <td className="tw-border tw-p-2">{plan.metaFromPlan}</td>;
                    if (h.key === "responsible")
                        return <td className="tw-border tw-p-2">{item.responsible}</td>;
                    if (h.key === "indicator")
                        return <td className="tw-border tw-p-2">{item.indicator}</td>;
                    if (h.key === "base")
                        return <td className="tw-border tw-p-2">{fmtNumberIfPossible(item.base)}</td>;
                    if (h.key.startsWith("dyn-")) {
                        const val = valueForDynamic(h.label, plan, item);
                        return <td className="tw-border tw-p-2">{val}</td>;
                    }
                    return <td className="tw-border tw-p-2">-</td>;
                })}

                {years.map((_, i) => (
                    <td className="tw-border tw-p-2">{fmtNumberIfPossible(programedArr[i])}</td>
                ))}
                {years.map((_, i) => (
                    <td className="tw-border tw-p-2">{fmtNumberIfPossible(executedArr[i])}</td>
                ))}
                {years.map((_, i) => (
                    <td className={`tw-border tw-p-2 tw-text-center ${colorClass(item, i)}`}>
                        {percentArr[i] ?? ""}
                    </td>
                ))}
            </tr>
        );
    };

    const data = Array.isArray(props.data)
        ? props.data.slice().sort((a, b) => compareGoalCodes(a.goalCode, b.goalCode))
        : [];

    return (
        <Modal
            isOpen={props.modalIsOpen}
            onRequestClose={() => props.callback(false)}
            contentLabel="Modal de Plan"
        >
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
                        onClick={() =>
                            generateExcelYears(props.data, "InformeTotal", levels, years, colorimeter)
                        }
                    >
                        Exportar
                    </button>

                    <table id="TablaTotal">
                        <thead>
                            <tr>
                                {baseHeaders.map((h) => (
                                    <th key={h.key} className="tw-border tw-bg-gray-400 tw-p-2">
                                        {h.label}
                                    </th>
                                ))}
                                {years.map((year) => (
                                    <th key={`p-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                                        Programado {year}
                                    </th>
                                ))}
                                {years.map((year) => (
                                    <th key={`e-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                                        Ejecutado {year}
                                    </th>
                                ))}
                                {years.map((year) => (
                                    <th key={`%-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                                        % ejecución {year}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>{data.map((item) => tableBody(item))}</tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};

export default ModalPDT;
