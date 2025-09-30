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
        thunkGetNodeArrayByPlan,
        thunkGetLevelArrayByPlan,
    } from "@/store/plan/thunks";



    /**
     * Helper: intenta ordenar niveles por id_level numérico si existe,
     * si no, devuelve el array tal cual.
     */
    const normalizeLevelsOrder = (levels: any[]): any[] => {
        if (!Array.isArray(levels) || levels.length === 0) return [];
        const hasIdLevel = levels.every((l) => l !== null && l !== undefined && ("id_level" in l));
        if (!hasIdLevel) return levels;
        return levels.slice().sort((a, b) => {
            const ai = Number(a.id_level);
            const bi = Number(b.id_level);
            if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
            return 0;
        });
    };

    export const ModalTotalPDT: React.FC = (): JSX.Element => {
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
                    // paso states locales como props para usar en ModalPDT
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

    type ModalPDTExtendedProps = ModalPDTProps & {
        levelsFromThunk?: any[];
        nodesFromThunk?: any[];
    };

    const ModalPDT: React.FC<ModalPDTExtendedProps> = (props) => {
        // accedo al store de plan (puede venir en distintos formatos)
        const planStore = useAppSelector((s) => (s as any).plan);

        const years: string[] = Array.isArray(planStore?.years) ? (planStore.years as string[]) : [];

        // ahora usamos preferentemente los levels que pasamos desde ModalTotalPDT (levelsFromThunk)
        const levels: any[] =
            Array.isArray(props.levelsFromThunk) && props.levelsFromThunk.length > 0
                ? props.levelsFromThunk
                : Array.isArray(planStore?.levels)
                    ? (planStore.levels as any[])
                    : [];

        // nodos cargados por thunk (si vienen) - usados como fallback para obtener full_path si item no lo trae
        const nodes: any[] = Array.isArray(props.nodesFromThunk) ? props.nodesFromThunk : [];

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

        // Construimos headers dinámicos con índice del nivel (orden proveniente del thunk o store)
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

        // helpers
        const parseCsv = (s?: string): string[] => {
            if (!s) return [];
            const matches = s.match(/\[([^\]]*)\]/g);
            if (!matches) return [];
            return matches.map((m) => m.slice(1, -1).trim());
        };

        // Normaliza la representación del código para mostrar:
        // elimina el segundo segmento si es solo dígitos.
        // Ej: "C.23079.1.1.1.1" -> "C.1.1.1.1"
        const formatGoalCodeDisplay = (code: string | undefined | null) => {
            if (!code) return "";
            const parts = String(code).split(".").map((p: string) => p.trim()).filter((p: string) => p !== "");
            // si no hay al menos 3 segmentos (ej: A.B.C) devolvemos tal cual
            if (parts.length < 3) return parts.join(".");
            // si el segundo segmento es sólo dígitos, lo omitimos
            const second = parts[1];
            if (/^\d+$/.test(second)) {
                const out = [parts[0], ...parts.slice(2)].join(".");
                return out;
            }
            // si no es sólo dígitos, devolver original
            return parts.join(".");
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

        // ---------- Nueva función: extrae el valor del full_path según levelIndex ----------
        // Reemplaza la función valueForLevel existente por esta
        const valueForLevel = (levelIndex: number, item: ReportPDTInterface2, rawName?: string) => {
            const normalize = (s: any) =>
                (s ?? "")
                    .toString()
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ-]/g, "") // mantiene tildes y ñ
                    .trim();

            // 1) Primero: tomar full_path directamente del item (varias claves posibles)
            const fpCandidates = [
                (item as any).full_path,
                (item as any).fullPath,
                (item as any).fullpath,
                (item as any).fullPathNormalized,
            ].filter(Boolean);

            if (fpCandidates.length > 0) {
                const fp = String(fpCandidates[0]);
            const parts = fp.split(">").map((p: string) => p.trim()).filter((s: string) => Boolean(s));
                if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
            }

            // 2) Si no está en item, intentar buscar nodo en nodes con heurísticas robustas
            if (Array.isArray(nodes) && nodes.length > 0) {
                const goalDesc = normalize(item.goalDescription ?? (item as any).plan_description ?? "");
                const goalCode = String(item.goalCode ?? (item as any).code ?? "").trim();

                // Helper para extraer full_path normalizado de un nodo
                const nodeFullPath = (n: any) => (n?.full_path ?? n?.fullPath ?? n?.fullpath ?? "").toString();

                // Búsqueda 1: node.full_path termina con goalDescription (caso típico)
                let nodeFound = nodes.find((n) => {
                    const nfp = normalize(nodeFullPath(n));
                    return goalDesc && nfp.endsWith(goalDesc);
                });

                // Búsqueda 2: node.node_name === goalDescription
                if (!nodeFound && goalDesc) {
                    nodeFound = nodes.find((n) => normalize(n.node_name ?? n.name ?? "") === goalDesc);
                }

                // Búsqueda 3: node.plan_description === goalDescription
                if (!nodeFound && goalDesc) {
                    nodeFound = nodes.find((n) => normalize(n.plan_description ?? "") === goalDesc);
                }

                // Búsqueda 4: si hay goalCode, intentar por 'code' o por sufijo
                if (!nodeFound && goalCode) {
                    nodeFound =
                        nodes.find((n) => String(n.code) === goalCode) ||
                        nodes.find((n) => String(n.code).endsWith(goalCode)) ||
                        nodes.find((n) => String(n.id_node) === goalCode);
                }

                // Búsqueda 5: comparación por inclusión de tokens
                if (!nodeFound && goalDesc) {
                    nodeFound = nodes.find((n) => {
                        const nfp = normalize(nodeFullPath(n));
                        // si el goalDesc aparece dentro del full_path
                        return nfp.includes(goalDesc);
                    });
                }

                if (nodeFound) {
                    const fp = nodeFullPath(nodeFound);
                    const parts = fp.split(">").map((p: string) => p.trim()).filter((s: string) => Boolean(s));
                    if (levelIndex >= 0 && levelIndex < parts.length) return parts[levelIndex];
                }
            }

            // 3) Fallback especial para 'Meta' (último nivel)
            const levelName = (rawName ?? levels[levelIndex]?.name ?? "").toString().toLowerCase();
            if (levelName === "meta" || levelName.includes("meta")) {
                const plan = getPlanParts(item.planSpecific);
                return plan.metaFromPlan || item.goalDescription || "";
            }

            // 4) Por último intentar usar planSpecific si trae partes entre []
            try {
                const planParts = getPlanParts(item.planSpecific);
                // intentamos mapear por índice: metaFromPlan=0 en tu parseCsv original es [meta, subprograma, programa, sector, dimension]
                // aquí devolvemos partes por posición si existen:
                const possibleArr = [
                    planParts.dimension,
                    planParts.sector,
                    planParts.programa,
                    planParts.subprograma,
                    planParts.metaFromPlan,
                ].map((x) => (x ?? "").toString()).filter(Boolean);
                if (levelIndex >= 0 && levelIndex < possibleArr.length) return possibleArr[levelIndex];
            } catch (e) {
                /* noop */
            }

            // Si nada funcionó, loguear (temporal) y devolver vacío
            // Deja estos logs solo durante debugging
            // console.log("valueForLevel: no match", { levelIndex, levelName, itemGoalCode: item.goalCode, goalDesc: item.goalDescription, itemFullPath: (item as any).full_path, nodesLength: Array.isArray(nodes)? nodes.length : 0 });
            return "";
        };

        const tableBody = (item: ReportPDTInterface2) => {
            const plan = getPlanParts(item.planSpecific);
            const percentArr = parseCsv(item.percentExecuted);
            const programedArr = parseCsv(item.programed);
            const executedArr = parseCsv(item.executed);

            return (
                <tr key={item.goalCode}>
                    {baseHeaders.map((h: any) => {
                        if (h.key === "goalCode") return <td className="tw-border tw-p-2">{formatGoalCodeDisplay(item.goalCode)}</td>;
                        if (h.key === "goalDescription") return <td className="tw-border tw-p-2">{item.goalDescription}</td>;
                        if (h.key === "metaFromPlan") return <td className="tw-border tw-p-2">{plan.metaFromPlan}</td>;
                        if (h.key === "responsible") return <td className="tw-border tw-p-2">{item.responsible}</td>;
                        if (h.key === "indicator") return <td className="tw-border tw-p-2">{item.indicator}</td>;
                        if (h.key === "base") return <td className="tw-border tw-p-2">{fmtNumberIfPossible(item.base)}</td>;
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
                    <div className="tw-z-20">
                        <div className=" tw-absolute tw-top-0 tw-right-0">
                            <button className="tw-px-2" onClick={() => props.callback(false)}>
                                <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">X</p>
                            </button>
                        </div>

                        <h1>Plan</h1>

                        <button
                            className="tw-bg-gray-300 hover:tw-bg-gray-200 tw-rounded tw-border tw-border-black tw-px-2 tw-py-1 tw-ml-3"
                            onClick={() => {
                                const yearsAsNumbers = years.map((y: string) => Number(y)).filter((n) => Number.isFinite(n)) as number[];
                                return generateExcelYears(props.data, "InformeTotal", levels, yearsAsNumbers, colorimeter);
                            }}
                        >
                            Exportar
                        </button>

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
                            <tbody>{data.map((item) => tableBody(item))}</tbody>
                        </table>
                    </div>
                )}
            </Modal>
        );
    };

    export default ModalPDT;
