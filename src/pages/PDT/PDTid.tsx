import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkUpdateYears, thunkGetLogo } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

import { LevelForm, Board, Frame } from "../../components";
import { getYears } from "@/utils";

export const PDTid = () => {
    const dispatch = useAppDispatch()
    const location = useLocation();

    const { levels, indexLevel, plan } = useAppSelector(store => store.plan)
    const id = location.state?.id;

    useEffect(() => {
        if (plan){
            let years = getYears(plan.Fecha_inicio)
            dispatch(thunkUpdateYears(years))
        }
    }, [plan])

    useEffect(() => {
        let i = indexLevel ?? 0
        dispatch(incrementLevelIndex(i))
        dispatch(thunkGetLogo(id))
    }, []);

    return (
        <Frame
            data={levels.length === 0 ? <LevelForm id={id!} /> : <Board id={id}/>}
        />
    )
}