import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetSecretaries } from "@/store/plan/thunks";
import { setSecretary, setLocs } from "@/store/content/contentSlice";

import { getLatLngs } from '@/services/api';

export const SecretarySelect = () => {
    const dispatch = useAppDispatch();

    const { secretaries } = useAppSelector((state) => state.plan);
    const { id_plan, secretary, location, node_code } = useAppSelector((state) => state.content);

    useEffect(() => {
        if (id_plan != 0 && secretaries.length === 0)
            dispatch(thunkGetSecretaries(id_plan));
    }, []);

    useEffect(() => {
        getLatLngs(node_code, secretary, location)
        .then(res => {
            dispatch(setLocs(res));
        });
    }, [secretary]);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSecretary(e.target.value));
    };

    return (
        <div className="tw-flex tw-flex-col tw-mb-3">
            <p className='  tw-mb-3 tw-p-1 tw-text-center
                            tw-inline-block tw-bg-white
                            tw-rounded tw-font-bold'>
                Secretarias
            </p>
            <select value={secretary} 
                    onChange={(e)=>handleChangeSecretary(e)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-w-24">
                <option value=''>Todas</option>
                {secretaries.map(sec =>
                    <option
                        value={sec.name}
                        key={sec.name}>
                        {sec.name}
                    </option>
                )}
            </select>
        </div>
    )
}