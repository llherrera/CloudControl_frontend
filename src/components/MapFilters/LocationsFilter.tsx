import React, { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetLocations } from "@/store/plan/thunks";
import { getLatLngs } from "@/services/api";
import { setLocs } from "@/store/content/contentSlice";

export const LocationSelect = () => {
    const dispatch = useAppDispatch();

    const { locations } = useAppSelector((state) => state.plan);
    const { id_plan, secretary, location, node_code } = useAppSelector((state) => state.content);

    const [loc, setLoc] = useState<string>('');

    useEffect(() => {
        if (id_plan != 0 && locations.length === 0) {
            dispatch(thunkGetLocations(id_plan));
        }
    }, []);

    useEffect(() => {
        getLatLngs(node_code, secretary, location)
        .then(res => {
            dispatch(setLocs(res));
        });
    }, [loc]);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoc(e.target.value);
    };

    return (
        <div className="tw-flex tw-flex-col tw-mb-3">
            <p className='  tw-mb-3 tw-p-1 tw-text-center
                            tw-inline-block tw-bg-white
                            tw-rounded tw-font-bold'>
                Localidades
            </p>
            <select value={location} 
                    onChange={(e)=>handleChangeSecretary(e)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-w-24">
                <option value=''>Todas</option>
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