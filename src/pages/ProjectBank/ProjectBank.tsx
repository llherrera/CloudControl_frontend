import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkUpdateYears, thunkGetLevelsById } from "@/store/plan/thunks";

import { Frame, Bank } from "@/components";
import { getYears } from "@/utils";

export const ProjectBank = () => {
    const dispatch = useAppDispatch();

    const { levels, plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan));
    }, []);

    useEffect(() => {
        if (plan){
            let years = getYears(plan.start_date);
            dispatch(thunkUpdateYears(years));
        }
    }, [plan]);

    return (
        <Frame>
            {plan || levels.length > 0 ? <Bank/> :
            <div className="tw-h-full tw-border">
                <h1>No hay un plan definido aún</h1>
            </div>}
        </Frame>
    );
}