import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetPDTByUuid } from "@/store/plan/thunks";
import { setIdPlan } from "@/store/content/contentSlice";

import { Header } from "@/components";
import { validateUUID, notify } from "@/utils";

export const SearchPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan, loadingPlan } = useAppSelector(store => store.plan);
    const [find, setFind] = useState(false);

    if (uuid == undefined) return <Header><div>No se ha enviado un id</div></Header>;

    if (!validateUUID(uuid)) return <Header><div>El id enviado no es válido</div></Header>;

    useEffect(() => {
        dispatch(thunkGetPDTByUuid(uuid))
        .then(() => setFind(true))
        .catch(() => setFind(false));
    }, []);

    useEffect(() => {
        if (!find) return;
        if (plan == undefined) {
            notify('No se ha encontrado un Plan de Desarrollo en esta localidad');
            navigate(`/`);
        } else {
            dispatch(setIdPlan(plan!.id_plan!));
            navigate(`/lobby`);
        }
    }, [find]);

    if (loadingPlan) return <Header><div className="tw-animate-pulse tw-mx-auto">Cargando...</div></Header>;

    if (plan == undefined) return <Header><div>No se ha encontrado un plan de desarrollo</div></Header>;

    return (<Header><div>redirigiendo</div></Header>);
}