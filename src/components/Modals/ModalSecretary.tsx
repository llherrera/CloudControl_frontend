import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";
import { thunkGetSecretaries, thunkGetLevelArrayByPlan, thunkGetNodeArrayByPlan } from "@/store/plan/thunks";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import { generateExcel, sortData } from "@/utils";
import {
    ReportPDTInterface,
    YearDetail,
    ModalProps,
    NodesWeight,
} from "@/interfaces";

export const ModalSecretary = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <div>
            <ModalPDT modalIsOpen={modalIsOpen} callback={setModalIsOpen} />
            <IconButton
                aria-label="delete"
                size="large"
                color="secondary"
                title="Generar reporte por Secretarias"
                className=" tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                onClick={() => setModalIsOpen(true)}
            >
                <LibraryBooksIcon />
            </IconButton>
        </div>
    );
};

/* ----------------- Helpers compartibles ----------------- */

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

const ModalPDT = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { years: yearsStore, levels: levelsStore, secretaries, loadingReport, colorimeter } =
        useAppSelector((store) => store.plan);
    const { id_plan } = useAppSelector((store) => store.content);

    // states
    const [data, setData] = useState<ReportPDTInterface[]>([]);
    const [secretary, setSecretary] = useState<string>("");
    const [indexYear, setIndexYear] = useState<number>(0);

    // nuevos states para niveles/nodos traídos por los thunks
    const [levelsState, setLevelsState] = useState<any[]>([]);
    const [nodesState, setNodesState] = useState<any[]>([]);

    // Preferir niveles traídos por thunk si existen, sino usar store
    const levelsPrefer = Array.isArray(levelsState) && levelsState.length > 0 ? levelsState : (Array.isArray(levelsStore) ? levelsStore : []);

    useEffect(() => {
        if (!id_plan || id_plan <= 0) return;

        // fetch secretaries si no están
        if (secretaries === undefined) {
            dispatch(thunkGetSecretaries(id_plan));
        }

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

    }, [id_plan, secretaries, dispatch]);

    useEffect(() => {
        if (!secretaries || secretaries.length === 0) return;
        setSecretary((prev) => prev || secretaries[0].name);
    }, [secretaries]);

    useEffect(() => {
        if (!secretary) {
            setData([]);
            dispatch(setLoadingReport(false));
            return;
        }
        genReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secretary, indexYear, yearsStore, dispatch]);

    // --- funciones previas adaptadas ---

    const findRoot = (id: string) => {
        // conserva la lógica que usabas (UnitNode en localStorage) como primera fuente
        const root: string[] = [];
        const pesosStr = localStorage.getItem("UnitNode");
        const pesos: NodesWeight[] = pesosStr ? JSON.parse(pesosStr) : [];
        const ids = id.split(".");
        if (ids.length !== levelsPrefer.length + 1) {
            // intentar heurística alternativa: si nodesState contiene full_path para el id (id_node)
            if (Array.isArray(nodesState) && nodesState.length > 0) {
                // buscar node por id
                const node = nodesState.find((n) => String(n.id_node) === String(id) || String(n.code) === String(id));
                if (node && node.full_path) {
                    const parts = String(node.full_path).split(">").map((p: string) => p.trim()).filter(Boolean);
                    return parts;
                }
            }
            return root;
        }

        let ids2 = ids.reduce((acumulator: string[], currentValue: string) => {
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
        if (v === undefined || v === null || v === "") return "";
        const n = Number(String(v).replace(/\s+/g, ""));
        if (!Number.isFinite(n)) return String(v);
        return n.toLocaleString();
    };

    const genReport = () => {
        dispatch(setLoadingReport(true));
        const detalleStr = localStorage.getItem("YearDeta");
        const detalle: YearDetail[] = detalleStr ? JSON.parse(detalleStr) : [];

        const nodes = detalle.filter(
            (item: YearDetail) =>
                item.responsible === secretary &&
                item.year === yearsStore[indexYear]
        );

        let dataLocal: ReportPDTInterface[] = [];

        for (const item of nodes) {
            const prog = Number(item.physical_programming) || 0;
            const exec = Number(item.physical_execution) || 0;
            let percent = 0;
            if (prog > 0) {
                percent = (exec / prog) * 100;
            } else {
                percent = exec > 0 ? 100 : 0;
            }
            percent = Math.round(percent * 100) / 100;

            const root = findRoot(item.id_node);

            const item_: ReportPDTInterface = {
                responsible: item.responsible ?? "",
                goalCode: item.code,
                goalDescription: item.description,
                percentExecuted: [percent],
                planSpecific: root, // ahora planSpecific es array de strings (posiciones por nivel)
                indicator: item.indicator,
                base: item.base_line,
                executed: [exec],
                programed: [prog],
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

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        dispatch(setLoadingReport(true));
        setIndexYear(index);
    };

    // mapear planSpecific (array) a objeto
    const getPlanParts = (planSpecific: string[] | undefined) => {
        const parts = planSpecific || [];
        return {
            metaFromPlan: parts[0] ?? "",
            subprograma: parts[1] ?? "",
            programa: parts[2] ?? "",
            sector: parts[3] ?? "",
            dimension: parts[4] ?? "",
        };
    };

    // ---------- dynamic headers con levelIndex ----------
    const dynamicHeaders =
        levelsPrefer.length > 0
            ? levelsPrefer.map((level: any, idx: number) => {
                  const rawName = String(level.name ?? `Nivel ${idx}`).trim();
                  const safeId = rawName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 40);
                  const isMeta = rawName.trim().toLowerCase() === "meta";
                  return {
                      key: `dyn-${idx}-${safeId}`,
                      label: isMeta ? "Descripción de Meta" : rawName,
                      isMeta,
                      levelIndex: idx,
                      rawName,
                  };
              })
            : [
                  { key: "dyn-f-0", label: "Dimensión", levelIndex: 0 },
                  { key: "dyn-f-1", label: "Sector", levelIndex: 1 },
                  { key: "dyn-f-2", label: "Programa", levelIndex: 2 },
                  { key: "dyn-f-3", label: "Subprograma", levelIndex: 3 },
              ];

    // ---------- valueForLevel robusta ----------
    const valueForLevel = (levelIndex: number, item: ReportPDTInterface, rawName?: string) => {
        const normalize = (s: any) =>
            (s ?? "").toString().toLowerCase().replace(/\s+/g, " ").replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ-]/g, "").trim();

        // 1) si item.planSpecific ya es un array (tu caso principal), usarlo
        if (Array.isArray(item.planSpecific) && item.planSpecific.length > 0) {
            const parts = item.planSpecific.map((p) => String(p).trim());
            if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex] || "";
        }

        // 2) intentar full_path en item si existiera (varias claves)
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

        // 3) buscar en nodesState con heurísticas si no encontramos en item
        if (Array.isArray(nodesState) && nodesState.length > 0) {
            const goalDesc = normalize(item.goalDescription ?? "");
            const goalCode = String(item.goalCode ?? "").trim();

            const nodeFullPath = (n: any) => (n?.full_path ?? n?.fullPath ?? n?.fullpath ?? "").toString();

            // búsqueda 1: node.full_path termina con goalDescription
            let nodeFound = nodesState.find((n) => {
                const nfp = normalize(nodeFullPath(n));
                return goalDesc && nfp.endsWith(goalDesc);
            });

            // búsqueda 2: node.node_name === goalDescription
            if (!nodeFound && goalDesc) {
                nodeFound = nodesState.find((n) => normalize(n.node_name ?? n.name ?? "") === goalDesc);
            }

            // búsqueda 3: node.plan_description === goalDescription
            if (!nodeFound && goalDesc) {
                nodeFound = nodesState.find((n) => normalize(n.plan_description ?? "") === goalDesc);
            }

            // búsqueda 4: por code o id_node (igual o sufijo)
            if (!nodeFound && goalCode) {
                nodeFound =
                    nodesState.find((n) => String(n.code) === goalCode) ||
                    nodesState.find((n) => String(n.code).endsWith(goalCode)) ||
                    nodesState.find((n) => String(n.id_node) === goalCode);
            }

            // búsqueda 5: inclusión de tokens en full_path
            if (!nodeFound && goalDesc) {
                nodeFound = nodesState.find((n) => normalize(nodeFullPath(n)).includes(goalDesc));
            }

            if (nodeFound) {
                const fp = nodeFullPath(nodeFound);
                const parts = fp.split(">").map((p) => p.trim()).filter(Boolean);
                if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
            }
        }

        // 4) fallback por nombre de nivel (meta)
        const levelName = (rawName ?? levelsPrefer[levelIndex]?.name ?? "").toString().toLowerCase();
        if (levelName.includes("meta")) {
            const plan = getPlanParts(Array.isArray(item.planSpecific) ? item.planSpecific : []);
            return plan.metaFromPlan || item.goalDescription || "";
        }

        // 5) fallback: devolver "" si no hay match
        // console.log("valueForLevel: no match", { levelIndex, levelName, goalCode: item.goalCode, goalDesc: item.goalDescription, itemPlanSpecific: item.planSpecific, nodesLen: nodesState.length });
        return "";
    };

    // ---------- valueForDynamic (compatibilidad con tabla original) ----------
    const valueForDynamic = (header: { key: string; label: string; isMeta?: boolean; levelIndex?: number }, item: ReportPDTInterface) => {
        // ahora delegamos en valueForLevel pasando header.levelIndex
        if (header.levelIndex !== undefined && header.levelIndex !== null) {
            return valueForLevel(header.levelIndex, item, (header as any).rawName);
        }
        // fallback a comportamiento previo si no hay levelIndex
        const plan = getPlanParts(Array.isArray(item.planSpecific) ? item.planSpecific : []);
        if (header.isMeta) return item.goalDescription || "-";
        switch (header.label.toLowerCase()) {
            case "dimensión":
            case "dimension":
                return plan.dimension || "-";
            case "sector":
                return plan.sector || "-";
            case "programa":
                return plan.programa || "-";
            case "subprograma":
                return plan.subprograma || "-";
            default:
                return plan.metaFromPlan || "-";
        }
    };

    const tableBody = (item: ReportPDTInterface, rowIndex: number) => {
        return (
            <tr key={rowIndex}>
                <td className="tw-border tw-p-2">
                    {formatGoalCodeDisplay(item.goalCode)}
                </td>
                <td className="tw-border tw-p-2">{item.goalDescription}</td>
                {dynamicHeaders.map((header) => (
                    <td className="tw-border tw-p-2" key={header.key}>
                        {valueForDynamic(header as any, item)}
                    </td>
                ))}
                <td className="tw-border tw-p-2">{item.responsible}</td>
                <td className="tw-border tw-p-2">{item.indicator}</td>
                <td className="tw-border tw-p-2 tw-text-center">
                    {fmtNumberIfPossible(item.base)}
                </td>
                {yearsStore.map((year, index) => (
                    <td className="tw-border tw-p-2 tw-text-center" key={year}>
                        {fmtNumberIfPossible(item.programed?.[index] || 0)}
                    </td>
                ))}
                {yearsStore.map((year, index) => (
                    <td className="tw-border tw-p-2 tw-text-center" key={year}>
                        {fmtNumberIfPossible(item.executed?.[index] || 0)}
                    </td>
                ))}
                {yearsStore.map((year, index) => {
                    const percentVal = item?.percentExecuted?.[index];
                    const value = typeof percentVal === "number" ? percentVal : Number(percentVal);
                    let colorClass = "tw-bg-gray-400";
                    if (!Number.isNaN(value) && value >= 0) {
                        if (value < colorimeter[0]) colorClass = "tw-bg-redColory";
                        else if (value < colorimeter[1]) colorClass = "tw-bg-yellowColory";
                        else if (value < colorimeter[2]) colorClass = "tw-bg-greenColory";
                        else colorClass = "tw-bg-blueColory hover:tw-ring-blue-200";
                    }
                    return (
                        <td className={`tw-border tw-p-2 tw-text-center ${colorClass}`} key={year}>
                            {typeof percentVal === "number" && !Number.isNaN(percentVal) ? percentVal : Number(percentVal) || 0}
                        </td>
                    );
                })}
            </tr>
        );
    };

    return (
        <Modal
            isOpen={props.modalIsOpen}
            onRequestClose={() => props.callback(false)}
            contentLabel="Modal de secretarias"
        >
            {loadingReport ? (
                <Spinner />
            ) : (
                <div className="tw-z-20">
                    <div className="tw-absolute tw-top-0 tw-right-0">
                        <button className=" tw-px-2" onClick={() => props.callback(false)}>
                            <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">X</p>
                        </button>
                    </div>
                    <div className="tw-flex tw-flex-col md:tw-flex-row">
                        <div className="tw-mb-2">
                            <h1 className="tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center">Escoger Año</h1>
                            {yearsStore.map((year, index) => (
                                <button
                                    className={`${indexYear === index ? "tw-bg-gray-500 tw-text-white hover:tw-bg-gray-300 hover:tw-text-black" : "tw-bg-gray-300 hover:tw-bg-gray-500 hover:tw-text-white"} tw-border-black tw-rounded tw-border tw-p-1 tw-mx-1`}
                                    onClick={(e) => handleBtn(e, index)}
                                    key={year}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                        <div className="md:tw-ml-6">
                            <h1 className="tw-bg-slate-300 tw-rounded tw-p-1 tw-mr-3 tw-mb-2 tw-text-center">Secretarias</h1>
                            <select value={secretary} onChange={(e) => handleChangeSecretary(e)} className="tw-border-2 tw-p-1 tw-mb-2 tw-rounded">
                                {secretaries && secretaries.map((s: any) => (
                                    <option value={s.name} key={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className=" tw-bg-gray-300 hover:tw-bg-gray-500 hover:tw-text-white tw-rounded tw-border tw-border-black tw-px-2 tw-py-1 md:tw-ml-3 tw-mr-3"
                            onClick={() =>
                                generateExcel(
                                    data,
                                    "InformeSecretarias",
                                    levelsPrefer,
                                    yearsStore[indexYear],
                                    colorimeter
                                )
                            }
                        >
                            Exportar
                        </button>
                    </div>

                    <table className="tw-mt-3" id="TablaSecretarias">
                        <thead>
                            <tr>
                                <th className="tw-border tw-bg-gray-400 tw-p-2">Código de la meta producto</th>
                                <th className="tw-border tw-bg-gray-400 tw-p-2">Meta</th>
                                {dynamicHeaders.map((header) => (
                                    <th className="tw-border tw-bg-gray-400 tw-p-2" key={header.key}>{header.label}</th>
                                ))}
                                <th className="tw-border tw-bg-gray-400 tw-p-2">Responsable</th>
                                <th className="tw-border tw-bg-gray-400 tw-p-2">Indicador</th>
                                <th className="tw-border tw-bg-gray-400 tw-p-2">Línea base</th>
                                {yearsStore.map((year) => (
                                    <th className="tw-border tw-bg-gray-400 tw-p-2" key={year}>Programado {year}</th>
                                ))}
                                {yearsStore.map((year) => (
                                    <th className="tw-border tw-bg-gray-400 tw-p-2" key={year}>Ejecutado {year}</th>
                                ))}
                                {yearsStore.map((year) => (
                                    <th className="tw-border tw-bg-gray-400 tw-p-2" key={year}>% ejecución {year}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => tableBody(item, index))}
                        </tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};

export default ModalPDT;
