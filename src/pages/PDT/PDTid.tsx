import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetLevelsById, thunkGetLogo } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

import { LevelForm, Board, Frame } from "../../components";

export const PDTid = () => {
    const dispatch = useAppDispatch()
    const location = useLocation();

    const { levels, indexLevel } = useAppSelector(store => store.plan)
    const id = location.state?.id;

    useEffect(() => {
        dispatch(thunkGetLevelsById(id))
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