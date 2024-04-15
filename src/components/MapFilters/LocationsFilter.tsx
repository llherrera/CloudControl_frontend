import React, { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetLocations } from "@/store/plan/thunks";

export const LocationSelect = () => {
    const dispatch = useAppDispatch();

    const { locations } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);

    const [location, setLocation] = useState<string>('');

    useEffect(() => {
        if (id_plan != 0 && locations.length === 0) {
            dispatch(thunkGetLocations(id_plan));
        }
    }, []);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocation(e.target.value);
    };

    return (
        <div className="tw-flex tw-flex-col tw-mb-3">
            <label className='tw-text-center tw-mb-3'>
                <p className='  tw-inline-block tw-bg-white
                                tw-p-1 tw-rounded tw-font-bold'>
                    Localidades
                </p>
            </label>
            <select value={location} 
                    onChange={(e)=>handleChangeSecretary(e)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-w-24">
                <option
                    value='Todas'>
                    Todas
                </option>
                {locations.map(loc => 
                    <option 
                        value={loc.name} 
                        key={loc.name}>
                        {loc.name}
                    </option>
                )}
            </select>
        </div>
    )
}