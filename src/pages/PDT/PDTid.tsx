import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetLevelsById } from "@/store/plan/thunks";
import { incrementLevelIndex } from "@/store/plan/planSlice";

import { LevelForm, Board, Frame } from "../../components";

export const PDTid = () => {
    const dispatch = useAppDispatch()
    const { levels, indexLevel } = useAppSelector(store => store.plan)
    const { id } = useParams();

    useEffect(() => {
        dispatch(thunkGetLevelsById(id!))
        let i = indexLevel ?? 0
        dispatch(incrementLevelIndex(i))
    }, []);

    return (
        <Frame
            data={levels.length === 0 ? <LevelForm id={id!} /> : <Board data={levels} />}
        />
    )
}