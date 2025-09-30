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

// <-- thunks ajustados a lo pedido
import {
    thunkGetLevelArrayByPlan,
    thunkGetNodeArrayByPlan,
} from "@/store/plan/thunks";

export const ModalProgram: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector((store) => store.content);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<ReportPDTInterface2[]>([]);

    // local states para niveles y nodos cargados por los thunks
    const [levelsState, setLevelsState] = useState<any[]>([]);
    const [nodesState, setNodesState] = useState<any[]>([]);

    useEffect(() => {
        if (!id_plan) return;

        // Pedimos niveles con el thunk proporcionado
        dispatch(thunkGetLevelArrayByPlan(id_plan))
            .unwrap()
            .then((res) => {
                console.log("✅ Niveles cargados (thunkGetLevelArrayByPlan):", res);
                const normalized = Array.isArray(res) ? normalizeLevelsOrder(res) : [];
                setLevelsState(normalized);
            })
            .catch((err) => {
                console.error("❌ Error cargando niveles:", err);
                setLevelsState([]);
            });

        // Pedimos nodos con el thunk proporcionado
        dispatch(thunkGetNodeArrayByPlan(id_plan))
            .unwrap()
            .then((res) => {
                console.log("✅ Nodos cargados (thunkGetNodeArrayByPlan):", res);
                setNodesState(Array.isArray(res) ? res : []);
            })
            .catch((err) => {
                console.error("❌ Error cargando nodos:", err);
                setNodesState([]);
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
                className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                onClick={handleBtn}
            >
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
};

/* ---------- helpers compartibles ---------- */

// Normaliza/ordena niveles por id_level si es posible
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

// Formatea el goalCode para mostrar: elimina el segundo segmento si es solo dígitos
const formatGoalCodeDisplay = (code: string | undefined | null) => {
    if (!code) return "";
    const parts = String(code).split(".").map((p) => p.trim()).filter((p) => p !== "");
    if (parts.length < 3) return parts.join(".");
    const second = parts[1];
    if (/^\d+$/.test(second)) {
        return [parts[0], ...parts.slice(2)].join(".");
    }
    return parts.join(".");
};

type ModalPDTExtendedProps = ModalPDTProps & {
    levelsFromThunk?: any[];
    nodesFromThunk?: any[];
};

const ModalPDT: React.FC<ModalPDTExtendedProps> = (props) => {
    const planStore = useAppSelector((s) => (s as any).plan);

    const years: string[] = Array.isArray(planStore?.years) ? planStore.years : [];
    const levelsFromStore: any[] = Array.isArray(planStore?.levels) ? planStore.levels : [];
    const loadingReport: boolean = !!planStore?.loadingReport;

    // Usamos preferentemente levelsFromThunk si existen
    const levels: any[] =
        Array.isArray(props.levelsFromThunk) && props.levelsFromThunk.length > 0
            ? props.levelsFromThunk
            : levelsFromStore;

    // nodos cargados por thunk (si vienen) - usados como fallback para obtener full_path si item no lo trae
    const nodes: any[] = Array.isArray(props.nodesFromThunk) ? props.nodesFromThunk : [];

    // index_ para selects (inicializado cuando levels cambian)
    const [index_, setIndex_] = useState<number[]>([]);
    // programs: lista de nodos (nombres) por nivel construidos a partir de data + full_path
    const [programs, setPrograms] = useState<any[][]>([]);

    // cuando cambian los niveles usados, reiniciamos índices y programs
    useEffect(() => {
        setIndex_(levels.map(() => -1));
        setPrograms(levels.map(() => []));
    }, [levels]);

    // --- utilidades ---
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

    const staticBefore = [
        { key: "goalCode", label: "Código de la meta producto" },
        { key: "goalDescription", label: "Meta" },
        { key: "responsible", label: "Responsable" },
    ];
    const staticAfter = [
        { key: "indicator", label: "Indicador" },
        { key: "base", label: "Línea base" },
    ];

    // dynamicHeaders ahora incluye levelIndex y rawName
    const dynamicHeaders =
        levels.length > 0
            ? levels.map((level: any, idx: number) => {
                  const rawName = String(level?.name ?? `Nivel ${idx}`).trim();
                  const safeId = rawName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 40);

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
        // orden: metaFromPlan, subprograma, programa, sector, dimension (según tu parse inicial)
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

    // ---------------- valueForLevel robusta ----------------
    const valueForLevel = (levelIndex: number, item: ReportPDTInterface2, rawName?: string) => {
        const normalize = (s: any) =>
            (s ?? "")
                .toString()
                .toLowerCase()
                .replace(/\s+/g, " ")
                .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ-]/g, "")
                .trim();

        // 1) intentar full_path en item (varias claves)
        const fpCandidates = [
            (item as any).full_path,
            (item as any).fullPath,
            (item as any).fullpath,
            (item as any).fullPathNormalized,
        ].filter(Boolean);

        if (fpCandidates.length > 0) {
            const fp = String(fpCandidates[0]);
            const parts = fp.split(">").map((p) => p.trim()).filter(Boolean);
            if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
        }

        // 2) intentar en nodes (heurísticas)
        if (Array.isArray(nodes) && nodes.length > 0) {
            const goalDesc = normalize(item.goalDescription ?? (item as any).plan_description ?? "");
            const goalCode = String(item.goalCode ?? (item as any).code ?? "").trim();

            const nodeFullPath = (n: any) => (n?.full_path ?? n?.fullPath ?? n?.fullpath ?? "").toString();

            // búsqueda 1: node.full_path termina con goalDescription
            let nodeFound = nodes.find((n) => {
                const nfp = normalize(nodeFullPath(n));
                return goalDesc && nfp.endsWith(goalDesc);
            });

            // búsqueda 2: node.node_name === goalDescription
            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => normalize(n.node_name ?? n.name ?? "") === goalDesc);
            }

            // búsqueda 3: node.plan_description === goalDescription
            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => normalize((n as any).plan_description ?? "") === goalDesc);
            }

            // búsqueda 4: por code o id_node (igual o sufijo)
            if (!nodeFound && goalCode) {
                nodeFound =
                    nodes.find((n) => String((n as any).code) === goalCode) ||
                    nodes.find((n) => String((n as any).code).endsWith(goalCode)) ||
                    nodes.find((n) => String(n.id_node) === goalCode);
            }

            // búsqueda 5: inclusión de tokens en full_path
            if (!nodeFound && goalDesc) {
                nodeFound = nodes.find((n) => normalize(nodeFullPath(n)).includes(goalDesc));
            }

            if (nodeFound) {
                const fp = nodeFullPath(nodeFound);
            const parts = fp.split(">").map((p: string) => p.trim()).filter(Boolean);
                if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
            }
        }

        // 3) fallback por nombre de level (meta)
        const levelName = (rawName ?? levels[levelIndex]?.name ?? "").toString().toLowerCase();
        if (levelName.includes("meta")) {
            const plan = getPlanParts(item.planSpecific || "");
            return plan.metaFromPlan || item.goalDescription || "";
        }

        // 4) fallback con planSpecific parsed (si existe)
        try {
            const plan = getPlanParts(item.planSpecific || "");
            // mapamos planParts al orden esperado: dimension, sector, programa, subprograma, metaFromPlan
            const possibleArr = [
                plan.dimension,
                plan.sector,
                plan.programa,
                plan.subprograma,
                plan.metaFromPlan,
            ].map((x) => (x ?? "").toString()).filter(Boolean);
            if (levelIndex >= 0 && levelIndex < possibleArr.length) return possibleArr[levelIndex];
        } catch (e) {
            /* noop */
        }

        // si nada existe, devolver vacío
        // console.log("valueForLevel: no match", { levelIndex, levelName, goalCode: item.goalCode, goalDesc: item.goalDescription, itemFullPath: (item as any).full_path, nodesLen: nodes.length });
        return "";
    };

    // --- construir programs (listas para selects) a partir de props.data y valueForLevel ---
    useEffect(() => {
        const rows = Array.isArray(props.data) ? props.data : [];
        if (levels.length === 0) {
            setPrograms([]);
            return;
        }

        const levelMaps: Map<string, { id_node: string; name: string }>[] = levels.map(() => new Map());

        rows.forEach((item) => {
            levels.forEach((level, idx) => {
                const rawName = valueForLevel(idx, item, level?.name);
                const name = String(rawName ?? "").trim();
                if (!name) return;
                const m = levelMaps[idx];
                if (!m.has(name)) {
                    const id = `${idx}-${m.size}`;
                    m.set(name, { id_node: id, name });
                }
            });
        });

        const arrays = levelMaps.map((m) => Array.from(m.values()));
        setPrograms(arrays);
    }, [props.data, levels, nodes]);

    // filtro dinámico: usa los selects seleccionados (index_) y valueForLevel
    const filteredData = (props.data || []).filter((item) => {
        const plan = getPlanParts(item.planSpecific || "");
        return levels.every((level, i) => {
            const selIdx = index_[i];
            const selectedNode = selIdx >= 0 ? programs[i]?.[selIdx]?.name : undefined;
            if (!selectedNode) return true; // "Todos" o no seleccionado
            // comparar con valueForLevel (fuente única de verdad)
            const val = valueForLevel(i, item, level?.name);
            return String(val) === String(selectedNode);
        });
    });

    const handleChangePrograms = (levelIndex: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const newIndex = [...index_];
        if (value === "") {
            newIndex[levelIndex] = -1;
        } else {
            const idx = programs[levelIndex].findIndex((p) => p.name === value);
            newIndex[levelIndex] = idx >= 0 ? idx : -1;
        }
        setIndex_(newIndex);
    };

    const tableBody = (item: ReportPDTInterface2) => {
        const plan = getPlanParts(item.planSpecific);
        const percentArr = parseCsv(item.percentExecuted);
        const programedArr = parseCsv(item.programed);
        const executedArr = parseCsv(item.executed);

        return (
            <tr key={item.goalCode}>
                {baseHeaders.map((h: any) => {
                    if (h.key === "goalCode")
                        return (
                            <td className="tw-border tw-p-2">
                                {formatGoalCodeDisplay(item.goalCode)}
                            </td>
                        );
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
                    if ((h.key as string).startsWith("dyn-")) {
                        const li = typeof h.levelIndex === "number" ? h.levelIndex : -1;
                        const val = li >= 0 ? valueForLevel(li, item, h.rawName) : "";
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

        const dataToShow = Array.isArray(filteredData)
        ? filteredData.slice().sort((a, b) => compareGoalCodes(a.goalCode, b.goalCode))
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
                <div className="tw-z-20">
                    <div className="tw-absolute tw-top-0 tw-right-0">
                        <button className="tw-px-2" onClick={() => props.callback(false)}>
                            <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">X</p>
                        </button>
                    </div>

                    <h1>Plan</h1>

                    <div className="tw-flex tw-mb-3">
                        {programs.map((program, i) => (
                            <div key={i} className="tw-mr-3">
                                <h1 className="tw-bg-slate-300 tw-text-center tw-rounded tw-p-1">{levels[i]?.name}</h1>
                                <select
                                    value={index_[i] >= 0 ? programs[i][index_[i]]?.name ?? "" : ""}
                                    onChange={(e) => handleChangePrograms(i, e)}
                                    className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
                                >
                                    <option value="">Todos</option>
                                    {program.map((node) => (
                                        <option value={node.name} key={node.id_node}>
                                            {node.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button
                            className="tw-bg-gray-300 hover:tw-bg-gray-200 tw-rounded tw-border tw-border-black tw-px-2 tw-py-1"
                            onClick={() =>
                                (() => {
                                    const yearsAsNumbers = years.map((y: string) => Number(y)).filter((n) => Number.isFinite(n)) as number[];
                                    return generateExcelYears(filteredData, "InformeProgramas", levels, yearsAsNumbers, colorimeter);
                                })()
                            }
                        >
                            Exportar
                        </button>
                    </div>

                    <table id="TablaTotal">
                        <thead>
                            <tr>
                                {baseHeaders.map((h: any) => (
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
                        <tbody>{dataToShow.map((item) => tableBody(item))}</tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};

export default ModalProgram;
