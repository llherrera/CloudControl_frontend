import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkUpdateYears, thunkGetLevelsById } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

import { LevelForm, Board, Frame } from "@/components";
import { getYears } from "@/utils";

export const PDTid = () => {
    const dispatch = useAppDispatch();

    const { levels, indexLevel, plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan.toString()));
    }, []);

    useEffect(() => {
        if (plan){
            let years = getYears(plan.start_date);
            dispatch(thunkUpdateYears(years));
        }
    }, [plan]);

    useEffect(() => {
        let i = indexLevel ?? 0;
        dispatch(incrementLevelIndex(i));
    }, []);

    return (
        <Frame
            data={levels.length === 0 ? <LevelForm id={id_plan.toString()} /> : <Board/>}
        />
    );
}