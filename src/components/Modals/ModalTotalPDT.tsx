import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport, setZeroLevelIndex } from "@/store/plan/planSlice";
import {
    thunkGetNodeArrayByPlan,
    thunkGetLevelArrayByPlan,
} from "@/store/plan/thunks";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { ReportPDTInterface2, ModalPDTProps } from "@/interfaces";
import { generalReport } from "@/services/api";
import { generateExcelYears } from "@/utils";

/* ---------------------------
   helpers (sin cambios lógicos)
   --------------------------- */

const normalizeLevelsOrder = (levels: any[]): any[] => {
    if (!Array.isArray(levels) || levels.length === 0) return [];
    const hasIdLevel = levels.every((l) => l !== null && l !== undefined && "id_level" in l);
    if (!hasIdLevel) return levels;
    return levels.slice().sort((a, b) => {
        const ai = Number(a.id_level);
        const bi = Number(b.id_level);
        if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
        return 0;
    });
};

const parseCsv = (s?: string): string[] => {
    if (!s) return [];
    const matches = s.match(/\[([^\]]*)\]/g);
    if (!matches) return [];
    return matches.map((m) => m.slice(1, -1).trim());
};

const formatGoalCodeDisplay = (code: string | undefined | null) => {
    if (!code) return "";
    const parts = String(code)
        .split(".")
        .map((p: string) => p.trim())
        .filter((p: string) => p !== "");
    if (parts.length < 3) return parts.join(".");
    const second = parts[1];
    if (/^\d+$/.test(second)) {
        return [parts[0], ...parts.slice(2)].join(".");
    }
    return parts.join(".");
};

const fmtNumberIfPossible = (v: string | number | undefined) => {
    if (v === undefined || v === null || v === "") return "";
    const str = String(v).replace(/\s+/g, "");
    const n = Number(str);
    if (!Number.isFinite(n)) return String(v);
    return n.toLocaleString();
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

/* ---------------------------
   ModalTotalPDT (icon + apertura)
   --------------------------- */

export const ModalTotalPDT: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector((store) => store.content);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface2[]>([]);

    // estados locales que llenan los thunks
    const [levelsState, setLevelsState] = useState<any[]>([]);
    const [nodesState, setNodesState] = useState<any[]>([]);

    useEffect(() => {
        if (!id_plan) return;

        // niveles
        dispatch(thunkGetLevelArrayByPlan(id_plan))
            .unwrap()
            .then((res) => {
                const normalized = Array.isArray(res) ? normalizeLevelsOrder(res) : [];
                setLevelsState(normalized);
            })
            .catch(() => setLevelsState([]));

        // nodos
        dispatch(thunkGetNodeArrayByPlan(id_plan))
            .unwrap()
            .then((res) => setNodesState(Array.isArray(res) ? res : []))
            .catch(() => setNodesState([]));

        dispatch(setZeroLevelIndex());
    }, [id_plan, dispatch]);

    const genReport = async (): Promise<ReportPDTInterface2[]> => {
        const data_: ReportPDTInterface2[] = await generalReport(id_plan);
        dispatch(setLoadingReport(false));
        return data_;
    };

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setModalIsOpen(true);
        dispatch(setLoadingReport(true));
        genReport().then((d) => setData(d));
    };

    return (
        <div>
            <ModalPDT
                modalIsOpen={modalIsOpen}
                callback={setModalIsOpen}
                data={data}
                levelsFromThunk={levelsState}
                nodesFromThunk={nodesState}
            />

            <IconButton
                size="large"
                color="inherit"
                title="Generar reporte del Plan Indicativo Total"
                className="tw-transition tw-duration-200 hover:tw--translate-y-1 hover:tw-scale-[1.2] tw-bg-transparent tw-border-none"
                onClick={handleBtn}
            >
                <div className="tw-flex tw-items-center tw-gap-2">
                    <LibraryBooksIcon className="tw-text-[22px] tw-text-slate-700" />
                    <span className="tw-hidden md:tw-inline tw-text-sm tw-font-medium tw-text-slate-700">
                        Informe total
                    </span>
                </div>
            </IconButton>
        </div>
    );
};

/* ---------------------------
   ModalPDT decorado (principal)
   --------------------------- */

type ModalPDTExtendedProps = ModalPDTProps & {
    levelsFromThunk?: any[];
    nodesFromThunk?: any[];
};

const ModalPDT: React.FC<ModalPDTExtendedProps> = (props) => {
    const dispatch = useAppDispatch();

    // planStore (puede venir en distintos formatos)
    const planStore = useAppSelector((s) => (s as any).plan);

    // years
    const years: string[] = Array.isArray(planStore?.years) ? (planStore.years as string[]) : [];

    // preferimos levels proporcionados por el thunk
    const levels: any[] =
        Array.isArray(props.levelsFromThunk) && props.levelsFromThunk.length > 0
            ? props.levelsFromThunk
            : Array.isArray(planStore?.levels)
                ? (planStore.levels as any[])
                : [];

    const nodes: any[] = Array.isArray(props.nodesFromThunk) ? props.nodesFromThunk : [];

    const loadingReport: boolean = !!planStore?.loadingReport;

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

    // headers fijos y dinámicos (sin cambios lógicos)
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
            ? levels.map((level: any, idx: number) => {
                const rawName = String(level?.name ?? `Nivel ${idx}`).trim();
                const safeId = rawName
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_\-]/g, "")
                    .slice(0, 40);

                const label = rawName.toLowerCase() === "meta" ? "Descripción de Meta" : rawName;

                return { key: `dyn-${idx}-${safeId}`, label, levelIndex: idx, rawName };
            })
            : [
                { key: "dyn-f-0", label: "Dimensión", levelIndex: 0, rawName: "Dimension" },
                { key: "dyn-f-1", label: "Sector", levelIndex: 1, rawName: "Sector" },
                { key: "dyn-f-2", label: "Programa", levelIndex: 2, rawName: "Programa" },
                { key: "dyn-f-3", label: "Subprograma", levelIndex: 3, rawName: "Subprograma" },
            ];

    const baseHeaders = [...staticBefore, ...dynamicHeaders, ...staticAfter];

    const getPlanParts = (planSpecificRaw: string) => {
        const parts = parseCsv(planSpecificRaw);
        const [metaFromPlan = "", subprograma = "", programa = "", sector = "", dimension = ""] = parts;
        return { metaFromPlan, subprograma, programa, sector, dimension };
    };

    /* valueForLevel (igual que antes, conservando heurísticas) */
    const valueForLevel = (levelIndex: number, item: ReportPDTInterface2, rawName?: string) => {
        const normalize = (s: any) =>
            (s ?? "")
                .toString()
                .toLowerCase()
                .replace(/\s+/g, " ")
                .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ-]/g, "")
                .trim();

        const fpCandidates = [
            (item as any).full_path,
            (item as any).fullPath,
            (item as any).fullpath,
            (item as any).fullPathNormalized,
        ].filter(Boolean);

        if (fpCandidates.length > 0) {
            const fp = String(fpCandidates[0]);
            const parts = fp
                .split(">")
                .map((p: string) => p.trim())
                .filter((s: string) => Boolean(s));
            if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
        }

        if (Array.isArray(nodes) && nodes.length > 0) {
            const goalDesc = normalize(item.goalDescription ?? (item as any).plan_description ?? "");
            const goalCode = String(item.goalCode ?? (item as any).code ?? "").trim();

            const nodeFullPath = (n: any) => (n?.full_path ?? n?.fullPath ?? n?.fullpath ?? "").toString();

            let nodeFound = nodes.find((n) => {
                const nfp = normalize(nodeFullPath(n));
                return goalDesc && nfp.endsWith(goalDesc);
            });

            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => normalize(n.node_name ?? n.name ?? "") === goalDesc);
            }

            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => normalize(n.plan_description ?? "") === goalDesc);
            }

            if (!nodeFound && goalCode) {
                nodeFound =
                    nodes.find((n) => String(n.code) === goalCode) ||
                    nodes.find((n) => String(n.code).endsWith(goalCode)) ||
                    nodes.find((n) => String(n.id_node) === goalCode);
            }

            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => {
                    const nfp = normalize(nodeFullPath(n));
                    return nfp.includes(goalDesc);
                });
            }

            if (nodeFound) {
                const fp = nodeFullPath(nodeFound);
                const parts = fp
                    .split(">")
                    .map((p: string) => p.trim())
                    .filter((s: string) => Boolean(s));
                if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
            }
        }

        const levelName = (rawName ?? levels[levelIndex]?.name ?? "").toString().toLowerCase();
        if (levelName === "meta" || levelName.includes("meta")) {
            const plan = getPlanParts(item.planSpecific);
            return plan.metaFromPlan || item.goalDescription || "";
        }

        try {
            const planParts = getPlanParts(item.planSpecific);
            const possibleArr = [
                planParts.dimension,
                planParts.sector,
                planParts.programa,
                planParts.subprograma,
                planParts.metaFromPlan,
            ]
                .map((x) => (x ?? "").toString())
                .filter(Boolean);
            if (levelIndex >= 0 && levelIndex < possibleArr.length) return possibleArr[levelIndex];
        } catch (e) {
            /* noop */
        }

        return "";
    };

    const colorClass = (item: ReportPDTInterface2, index: number) => {
        const percentArr = parseCsv(item.percentExecuted);
        const raw = percentArr[index];
        const value = raw === undefined || raw === "" ? NaN : Number(raw);
        if (Number.isNaN(value)) return "tw-bg-gray-300 tw-text-xs tw-font-medium";
        if (value < 0) return "tw-bg-gray-300 tw-text-xs tw-font-medium";
        if (value < colorimeter[0]) return "tw-bg-redColory tw-text-white tw-font-medium";
        if (value < colorimeter[1]) return "tw-bg-yellowColory tw-text-black tw-font-medium";
        if (value < colorimeter[2]) return "tw-bg-greenColory tw-text-white tw-font-medium";
        return "tw-bg-blueColory tw-text-white tw-font-medium tw-hover:tw-ring-2";
    };

    const tableBody = (item: ReportPDTInterface2) => {
        const plan = getPlanParts(item.planSpecific);
        const percentArr = parseCsv(item.percentExecuted);
        const programedArr = parseCsv(item.programed);
        const executedArr = parseCsv(item.executed);

        return (
            <tr key={item.goalCode} className="tw-align-top odd:tw-bg-white even:tw-bg-slate-50">
                {baseHeaders.map((h: any) => {
                    if (h.key === "goalCode")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm tw-font-medium" key={`${item.goalCode}-code`}>
                                {formatGoalCodeDisplay(item.goalCode)}
                            </td>
                        );
                    if (h.key === "goalDescription")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-desc`}>
                                {item.goalDescription}
                            </td>
                        );
                    if (h.key === "metaFromPlan")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-meta`}>
                                {plan.metaFromPlan}
                            </td>
                        );
                    if (h.key === "responsible")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-resp`}>
                                {item.responsible}
                            </td>
                        );
                    if (h.key === "indicator")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-ind`}>
                                {item.indicator}
                            </td>
                        );
                    if (h.key === "base")
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm tw-text-right" key={`${item.goalCode}-base`}>
                                {fmtNumberIfPossible(item.base)}
                            </td>
                        );
                    if ((h.key as string).startsWith("dyn-")) {
                        const li = typeof h.levelIndex === "number" ? h.levelIndex : -1;
                        const val = li >= 0 ? valueForLevel(li, item, h.rawName) : "";
                        return (
                            <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-dyn-${li}`}>
                                {val}
                            </td>
                        );
                    }
                    return (
                        <td className="tw-border tw-p-2 tw-text-sm" key={`${item.goalCode}-other`}>
                            -
                        </td>
                    );
                })}

                {years.map((_, i) => (
                    <td className="tw-border tw-p-2 tw-text-sm tw-text-right" key={`${item.goalCode}-p-${i}`}>
                        {fmtNumberIfPossible(programedArr[i])}
                    </td>
                ))}
                {years.map((_, i) => (
                    <td className="tw-border tw-p-2 tw-text-sm tw-text-right" key={`${item.goalCode}-e-${i}`}>
                        {fmtNumberIfPossible(executedArr[i])}
                    </td>
                ))}
                {years.map((_, i) => {
                    const value = percentArr[i];
                    const displayValue = value === "-1.0" || value === "-1" ? "N/A" : value ?? "";

                    return (
                        <td
                            className={`tw-border tw-p-2 tw-text-center tw-text-sm ${colorClass(item, i)}`}
                            key={`${item.goalCode}-%-${i}`}
                        >
                            {displayValue}
                        </td>
                    );
                })}
            </tr>
        );
    };

    const data = Array.isArray(props.data)
        ? props.data.slice().sort((a, b) => compareGoalCodes(a.goalCode, b.goalCode))
        : [];

    /* ---------------------------
       RENDER
       --------------------------- */

    return (
        <Modal
            isOpen={props.modalIsOpen}
            onRequestClose={() => props.callback(false)}
            contentLabel="Modal de Plan"
            ariaHideApp={false}
            // overlay sigue ocupando toda la pantalla
            overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50"
            // el modal se centra y el contenedor interior ocupa casi toda la pantalla
            className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4"
        >
            {loadingReport ? (
                <div className="tw-w-[95vw] tw-h-[92vh] tw-bg-white tw-rounded-xl tw-shadow-2xl tw-p-8 tw-flex tw-items-center tw-justify-center">
                    <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
                        <Spinner />
                        <p className="tw-text-sm tw-text-slate-600">Generando informe... esto puede tardar unos segundos</p>
                    </div>
                </div>
            ) : (
                /* contenedor interior ampliado: ocupa 95% ancho y 92% alto */
                <div className="tw-w-[95vw] tw-h-[92vh] tw-bg-white tw-rounded-xl tw-shadow-2xl tw-p-6 tw-relative tw-flex tw-flex-col">
                    {/* close button */}
                    <button
                        onClick={() => props.callback(false)}
                        aria-label="Cerrar"
                        className="tw-absolute tw-top-4 tw-right-4 tw-rounded-full tw-p-2 tw-border tw-border-slate-200 hover:tw-bg-slate-50"
                    >
                        <span className="tw-text-lg tw-text-slate-600 tw-font-bold">✕</span>
                    </button>

                    {/* header */}
                    <div className="tw-flex tw-items-start tw-justify-between tw-gap-4 tw-mb-4">
                        <div>
                            <h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold tw-text-slate-800">
                                Informe total — Plan Indicativo
                            </h2>
                            <p className="tw-text-sm tw-text-slate-500 tw-mt-1">
                                Resumen por metas, niveles y ejecución por año.
                            </p>

                            {/* leyenda colorimeter */}
                            <div className="tw-flex tw-items-center tw-gap-2 tw-mt-3 tw-flex-wrap">
                                <span className="tw-text-xs tw-font-medium tw-text-slate-600">Leyenda:</span>
                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <span className="tw-inline-block tw-text-[11px] tw-px-2 tw-py-1 tw-rounded tw-bg-redColory tw-text-white">
                                        {"< "}{colorimeter[0]}%
                                    </span>
                                    <span className="tw-inline-block tw-text-[11px] tw-px-2 tw-py-1 tw-rounded tw-bg-yellowColory tw-text-black">
                                        {colorimeter[0]}–{colorimeter[1]}%
                                    </span>
                                    <span className="tw-inline-block tw-text-[11px] tw-px-2 tw-py-1 tw-rounded tw-bg-greenColory tw-text-white">
                                        {colorimeter[1]}–{colorimeter[2]}%
                                    </span>
                                    <span className="tw-inline-block tw-text-[11px] tw-px-2 tw-py-1 tw-rounded tw-bg-blueColory tw-text-white">
                                        {"≥ "}{colorimeter[2]}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="tw-flex tw-items-center tw-gap-3">
                            <button
                                className="tw-flex tw-items-center tw-gap-2 tw-border tw-border-slate-200 tw-px-3 tw-py-2 tw-rounded tw-bg-slate-50 hover:tw-bg-slate-100"
                                onClick={() => {
                                    const yearsAsNumbers = years
                                        .map((y: string) => Number(y))
                                        .filter((n) => Number.isFinite(n)) as number[];
                                    return generateExcelYears(props.data, "InformeTotal", levels, yearsAsNumbers, colorimeter);
                                }}
                            >
                                <svg className="tw-w-4 tw-h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 21H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="tw-text-sm tw-font-medium">Exportar</span>
                            </button>
                        </div>
                    </div>

                    {/* table container: ocupa el espacio restante y es scrollable */}
                    <div className="tw-flex-1 tw-overflow-auto tw-rounded tw-border tw-border-slate-100">
                        <table id="TablaTotal" className="tw-min-w-full tw-table-auto tw-divide-y">
                            <thead>
                                <tr>
                                    {baseHeaders.map((h: any) => (
                                        <th
                                            key={h.key}
                                            className="tw-border-b tw-px-3 tw-py-2 tw-text-left tw-text-sm tw-font-semibold tw-sticky tw-top-0 tw-z-10 tw-bg-slate-700 tw-text-white"
                                        >
                                            {h.label}
                                        </th>
                                    ))}
                                    {years.map((year) => (
                                        <th
                                            key={`p-${year}`}
                                            className="tw-border-b tw-px-3 tw-py-2 tw-text-right tw-text-sm tw-font-semibold tw-sticky tw-top-0 tw-z-10 tw-bg-slate-700 tw-text-white"
                                        >
                                            Programado {year}
                                        </th>
                                    ))}
                                    {years.map((year) => (
                                        <th
                                            key={`e-${year}`}
                                            className="tw-border-b tw-px-3 tw-py-2 tw-text-right tw-text-sm tw-font-semibold tw-sticky tw-top-0 tw-z-10 tw-bg-slate-700 tw-text-white"
                                        >
                                            Ejecutado {year}
                                        </th>
                                    ))}
                                    {years.map((year) => (
                                        <th
                                            key={`%-${year}`}
                                            className="tw-border-b tw-px-3 tw-py-2 tw-text-center tw-text-sm tw-font-semibold tw-sticky tw-top-0 tw-z-10 tw-bg-slate-700 tw-text-white"
                                        >
                                            % ejecución {year}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>{data.map((item) => tableBody(item))}</tbody>
                        </table>
                    </div>

                    {/* footer */}
                    <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                        <p className="tw-text-xs tw-text-slate-500">
                            {data.length} metas · {years.length} años
                        </p>
                        <div className="tw-text-xs tw-text-slate-500">
                            Última actualización: {/* si tienes fecha, ponla aquí */}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

    export default ModalPDT;
