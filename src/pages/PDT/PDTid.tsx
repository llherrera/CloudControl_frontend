// Importaciones de React
import { useEffect } from "react";

// Importaciones de hooks personalizados de Redux Toolkit
import { useAppDispatch, useAppSelector } from "@/store";

// Importación de funciones asíncronas (thunks) y acciones del slice "plan"
import { thunkUpdateYears, thunkGetLevelsById, thunkGetColors } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

// Importación de componentes reutilizables
import { Board, Frame } from "@/components/Citizen";
import { LevelForm } from "@/components/Forms";

// Utilidad que calcula los años a partir de una fecha
import { getYears } from "@/utils";

// Importamos el componente que descarga automáticamente el Excel
import AutoDownloadPDTReport from "@/components/AutoReport/AutoDownloadPDTReport";

// Definición del componente principal PDTid
export const PDTid = () => {
    const dispatch = useAppDispatch();
    const { levels, indexLevel, plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);
    const { logged } = useAppSelector(store => store.auth);

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan));
    }, []);

    useEffect(() => {
        if (plan){
            let years = getYears(plan.start_date);
            dispatch(thunkUpdateYears(years));
            dispatch(thunkGetColors(id_plan));
        }
    }, [plan]);

    useEffect(() => {
        let i = indexLevel ?? 0;
        dispatch(incrementLevelIndex(i));
    }, []);

    return (
        <Frame>
            {levels.length === 0 ? (
                logged ? (
                    <LevelForm id={id_plan.toString()} />
                ) : (
                    <div className="tw-flex tw-justify-center tw-items-center tw-h-[60vh]">
                        <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-8 tw-text-center">
                            <p className="tw-text-lg tw-font-semibold tw-text-gray-700">
                                Este Plan de Desarrollo aún no tiene estructura pública disponible.
                            </p>
                        </div>
                    </div>
                )
            ) : <Board />}
        </Frame>
    );
};
