// Importaciones de React
import { useEffect } from "react";

// Importaciones de hooks personalizados de Redux Toolkit
import { useAppDispatch, useAppSelector } from "@/store";

// Importación de funciones asíncronas (thunks) y acciones del slice "plan"
import { thunkUpdateYears, thunkGetLevelsById, thunkGetColors } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

// Importación de componentes reutilizables
import { LevelForm, Board, Frame } from "@/components/Citizen";

// Utilidad que calcula los años a partir de una fecha
import { getYears } from "@/utils";

// Definición del componente principal PDTid
export const PDTid = () => {
    // Hook para despachar acciones a Redux
    const dispatch = useAppDispatch();

    // Se obtiene del store Redux el estado de "plan"
    const { levels, indexLevel, plan } = useAppSelector(store => store.plan);

    // Se obtiene del store Redux el identificador del plan actual
    const { id_plan } = useAppSelector(store => store.content);

    // Efecto que se ejecuta al montar el componente:
    // Llama al thunk que obtiene los niveles del plan en base al id_plan
    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan));
    }, []);

    // Efecto que depende de "plan":
    // - Si existe un plan, calcula los años desde la fecha inicial
    // - Actualiza los años en el store
    // - Obtiene los colores asociados al plan
    useEffect(() => {
        if (plan){
            let years = getYears(plan.start_date);
            dispatch(thunkUpdateYears(years));
            dispatch(thunkGetColors(id_plan));
        }
    }, [plan]);

    // Efecto que inicializa el índice del nivel actual:
    // Si indexLevel no está definido, toma 0
    useEffect(() => {
        let i = indexLevel ?? 0;
        dispatch(incrementLevelIndex(i));
    }, []);

    // Renderizado:
    // - Se envuelve el contenido en un componente <Frame>
    // - Si no hay niveles, se muestra el formulario <LevelForm>
    // - Si ya existen niveles, se muestra el tablero <Board>
    return (
        <Frame>
            {levels.length === 0 ? <LevelForm id={id_plan.toString()} /> : <Board/>}
        </Frame>
    );
}
