import React, { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetSecretaries } from "@/store/plan/thunks";

import { NodeInterface, EvidenceInterface, Codes } from '@/interfaces';

export const SecretarySelect = () => {
    const dispatch = useAppDispatch();

    const { secretaries } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);

    const [secretary, setSecretary] = useState<string>('');
    const [codes, setCodes] = useState<Codes[]>([]);

    useEffect(() => {
        if (id_plan != 0 && secretaries.length === 0) {
            dispatch(thunkGetSecretaries(id_plan));
        }
    }, []);

    useEffect(() => {

    }, [secretary]);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSecretary(e.target.value);
    };

    return (
        <div className="tw-flex tw-flex-col tw-mb-3">
            <label className='tw-text-center tw-mb-3'>
                <p className='  tw-inline-block tw-bg-white
                                tw-p-1 tw-rounded tw-font-bold'>
                    Secretarias
                </p>
            </label>
            <select value={secretary} 
                    onChange={(e)=>handleChangeSecretary(e)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-w-24">
                <option 
                    value='Todas'>
                    Todas
                </option>
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