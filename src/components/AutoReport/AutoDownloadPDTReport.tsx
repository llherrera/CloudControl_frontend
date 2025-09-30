import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { thunkUploadPoaiExcel } from "@/store/pqrs/thunks";
import { ReportPDTInterface2 } from "@/interfaces";
import { generalReport } from "@/services/api";
import { generateExcelYears } from "@/utils";
import {
    thunkGetNodeArrayByPlan,
    thunkGetLevelArrayByPlan,
} from "@/store/plan/thunks";

export const AutoDownloadPDTReport: React.FC = () => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector((store) => store.content);
    const planStore = useAppSelector((s) => (s as any).plan);

    const [levelsState, setLevelsState] = useState<any[]>([]);
    const [nodesState, setNodesState] = useState<any[]>([]);

    // Evita subidas duplicadas en re-render/montajes rápidos
    const hasUploadedRef = useRef<boolean>(false);

    const years: string[] = Array.isArray(planStore?.years) ? planStore.years : [];
    const colorimeter: number[] = Array.isArray(planStore?.colorimeter)
        ? planStore.colorimeter
        : [30, 60, 90];

    useEffect(() => {
        if (!id_plan) return;

        console.log("📌 AutoUploadPDTReport: id_plan", id_plan);

        // 1️⃣ Cargar niveles
        dispatch(thunkGetLevelArrayByPlan(id_plan))
            .unwrap()
            .then((res) => {
                console.log("✅ Niveles cargados:", res);
                const normalized = Array.isArray(res) ? normalizeLevelsOrder(res) : [];
                setLevelsState(normalized);
            })
            .catch((err) => {
                console.error("❌ Error cargando niveles:", err);
                setLevelsState([]);
            });

        // 2️⃣ Cargar nodos
        dispatch(thunkGetNodeArrayByPlan(id_plan))
            .unwrap()
            .then((res) => {
                console.log("✅ Nodos cargados:", res);
                setNodesState(Array.isArray(res) ? res : []);
            })
            .catch((err) => {
                console.error("❌ Error cargando nodos:", err);
                setNodesState([]);
            });

    }, [id_plan, dispatch]);

    // 3️⃣ Subir Excel cuando levels y years estén listos
    useEffect(() => {
        if (!id_plan || !levelsState.length || !years.length) {
            console.log("⏳ Esperando niveles y años para generar Excel...");
            return;
        }

        console.log("📌 Generando y subiendo Excel...");

        const fetchAndUpload = async () => {
            try {
                if (hasUploadedRef.current) {
                    console.log("⛔ Carga ya realizada. Se omite subida duplicada.");
                    return;
                }
                const data: ReportPDTInterface2[] = await generalReport(id_plan);
                console.log("✅ Datos obtenidos del plan:", data.length, "items");

                // Generar Excel en memoria como Blob
                const yearsAsNumbers: number[] = years
                    .map((y) => Number(y))
                    .filter((n) => Number.isFinite(n)) as number[];

                const blobPart = await generateExcelYears(
                    data,
                    "InformeTotal",
                    levelsState,
                    yearsAsNumbers,
                    colorimeter,
                    true // <- retorna Blob en lugar de descargar
                );

                if (!blobPart) {
                    console.error("❌ No se generó contenido para el Excel (blob vacío)");
                    return;
                }

                console.log("✅ Blob/ArrayBuffer de Excel generado:", blobPart);

                // Crear Blob y luego File a partir del resultado
                const blob = blobPart instanceof Blob ? blobPart : new Blob([blobPart], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                const file = new File(
                    [blob],
                    `InformeTotal_${id_plan}.xlsx`,
                    {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }
                );
                console.log("✅ File creado:", file.name, file.size, "bytes");

                // Despachar thunk para subir el archivo
                const result = await dispatch(thunkUploadPoaiExcel({ idPlan: id_plan, file })).unwrap();
                console.log("✅ Archivo subido correctamente:", result);
                hasUploadedRef.current = true;
            } catch (err) {
                console.error("❌ Error generando o subiendo Excel:", err);
            }
        };

        fetchAndUpload();
    }, [id_plan, levelsState, years, colorimeter, dispatch]);

    return null; // no renderiza nada
};

// ----------------- Helper para normalizar niveles -----------------
const normalizeLevelsOrder = (levels: any[]): any[] => {
    if (!Array.isArray(levels) || levels.length === 0) return [];
    const hasIdLevel = levels.every((l) => l && "id_level" in l);
    if (!hasIdLevel) return levels;
    return levels.slice().sort((a, b) => {
        const ai = Number(a.id_level);
        const bi = Number(b.id_level);
        if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
        return 0;
    });
};

export default AutoDownloadPDTReport;
