import { useState, useEffect } from "react";

import { InfoPopover, LocationPopover } from "@/components";
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkAddLocations, thunkGetLocations } from "@/store/plan/thunks";

import {
    Coordinates,
    LocationInterface,
    locationTypes,
    LocFormProps,
    PaginationProps } from "@/interfaces";
import { notify, convertLocations } from '@/utils';

export const LocationsForm = ({loc, locs}: LocFormProps) => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector(store => store.content);
    const blankLocation: LocationInterface = { id_plan, type: locationTypes.neighborhood, name: '' };
    const [location, setLocation] = useState<LocationInterface>({id_plan, type: '', name:''});
    const [data, setData] = useState<LocationInterface[]>([blankLocation]);

    const addLocation = () => {
        const newData = [...data, blankLocation];
        setData(newData);
    };

    const deleteLocation = () => {
        const newData = data.slice(0, -1);
        setData(newData);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: value };
        setData(newData);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { value } = e.target;
        let nValue = value as locationTypes;
        const newData = [...data];
        newData[index] = { ...newData[index], type: nValue };
        setData(newData);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocation({ ...location, [name]: value});
    };

    const handleSubmit = () => {
        data.forEach((location) => {
            if (location.name === "") {
                return notify("Por favor llene todos los campos");
            }
            if (!location.lat && !location.lng) {
                return notify(`Por favor seleccionar ubicación de localidad: ${location.name}`);
            }
        })
        //if (locations)
        //    dispatch(thunkUpdateLocations({ id_plan, locations: data, location: {id_plan, type: location, name: locationName}})).then(() => notify("Localidades actualizadas"));
        //else
            dispatch(thunkAddLocations({ id_plan, locations: data, location: {id_plan, type: location.type, name: location.name}})).then(() => notify("Localidades Añadidas"));
    };

    const handleLocation = (value: Coordinates, index: number) => {
        const newData = [...data];
        newData[index] = { ...newData[index], lat: value.lat, lng: value.lng };
        setData(newData);
    };

    return(
        <div className="tw-flex tw-justify-center tw-mt-8 tw-pb-4">
            <form className="tw-shadow-2xl tw-p-2 tw-bg-white">
                <p className="tw-font-bold tw-text-center">
                    Añadir localidades/barrios
                    <InfoPopover content={'Las localidades y comunas agrupan barrios,\nlos corregimientos se conforman por veredas y centros poblados'}/>
                </p>
                <div className="tw-flex tw-mt-3">
                    <div className="">
                        <select name="location"
                                value={loc ? loc.type : location.type}
                                onChange={e => handleLocationChange(e)}
                                className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400">
                            <option value="Localidad">Localidad</option>
                            <option value="Comuna">Comuna</option>
                            <option value="Corregimiento">Corregimiento</option>
                        </select>
                        <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                type="text"
                                name="name"
                                required
                                placeholder="Nombre"
                                onChange={e => handleLocationChange(e)}
                                value={loc ? loc.name : location.name}/>
                    </div>
                    <ul>
                        {(locs??data).map((location, index) => (
                            <li key={index}>
                                <label>{`${index < 9 ? '0' : ''}${index + 1}`}</label>
                                <select name="type"
                                        value={location.type}
                                        onChange={(e) => handleTypeChange(e, index)}
                                        className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                        required>
                                    <option value="Barrio">Barrio</option>
                                    <option value="vereda">Vereda</option>
                                    <option value="Centro poblado">Centro poblado</option>
                                </select>
                                <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                        onChange={ (e) => handleInputChange(e, index) }
                                        value={ location.name }
                                        type="text"
                                        name="name"
                                        placeholder="Nombre"
                                        required/>
                                <LocationPopover index={index} callback={handleLocation} item={location}/>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tw-flex tw-justify-around tw-py-2 tw-rounded">
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300 
                                        tw-text-white tw-font-bold          
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Agregar un nuevo nivel"
                            onClick={ addLocation }>+</button>
                    <button className=" tw-bg-red-500 
                                        hover:tw-bg-red-300 
                                        tw-text-white tw-font-bold
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Eliminar un nivel"
                            onClick={ deleteLocation }>-</button>
                </div>
                <div className="tw-flex tw-justify-center">
                    <button className="tw-bg-greenColory hover:tw-bg-green-400
                                        tw-text-white hover:tw-text-black
                                        tw-font-bold
                                        tw-p-2 tw-rounded"
                            type="button"
                            onClick={handleSubmit}>
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}

const Pagination = ({array, page, callback}: PaginationProps) => {
    return(
        <ul className=" tw-flex tw-justify-center 
                        tw-gap-4 tw-py-2
                        tw-bg-white">
            <li>
                <button
                    title="Primero"
                    disabled={page === 1}
                    onClick={() => callback(1)}>
                    {page === 1 ? <KeyboardDoubleArrowLeft color="disabled"/> : <KeyboardDoubleArrowLeft/>}
                </button>
            </li>
            <li>
                <button
                    title="Anterior"
                    disabled={page === 1}
                    onClick={() => callback(page - 1)}>
                    {page === 1 ? <KeyboardArrowLeft color="disabled"/> : <KeyboardArrowLeft/>}
                </button>
            </li>

            {array.map((e, i) => {
                if (!(i > 0 && i < array.length - 1)) {
                    return <li  key={i}
                                className={`${page === i + 1 ? 'tw-ring' : ''} hover:tw-bg-zinc-200 tw-rounded tw-px-1`}>
                        <button onClick={() => callback(i + 1)}>{i + 1}</button>
                    </li>
                } else if (page < 5) {
                    if (i > 4) {
                        if (i === 5) return <p>...</p>
                        return null
                    } else {
                        return <li  key={i}
                                    className={`${page === i + 1 ? 'tw-ring' : ''} hover:tw-bg-zinc-200 tw-rounded tw-px-1`}>
                            <button onClick={() => callback(i + 1)}>{i + 1}</button>
                        </li>
                    }
                } else if (page > array.length - 4) {
                    if (i < array.length - 5) {
                        if (i === array.length - 6) return <p>...</p>
                        return null
                    } else {
                        return <li  key={i} 
                                    className={`${page === i + 1 ? 'tw-ring' : ''} hover:tw-bg-zinc-200 tw-rounded tw-px-1`}>
                            <button onClick={() => callback(i + 1)}>{i + 1}</button>
                        </li>
                    }
                } else {
                    if (page === i) 
                        return <li  key={i} 
                                    className={`tw-flex tw-gap-4`}>
                            <p>...</p>
                            <button onClick={() => callback(i - 1)} className="hover:tw-bg-zinc-200 tw-rounded tw-px-1">{i - 1}</button>
                            <button onClick={() => callback(i)} className="tw-ring hover:tw-bg-zinc-200 tw-rounded tw-px-1">{i}</button>
                            <button onClick={() => callback(i + 1)} className="hover:tw-bg-zinc-200 tw-rounded tw-px-1">{i + 1}</button>
                            <p>...</p>
                        </li>
                }
            })}

            <li>
                <button
                    title="Siguiente"
                    disabled={page === array.length}
                    onClick={() => callback(page + 1)}>
                    {page === array.length ? <KeyboardArrowRight color="disabled"/> : <KeyboardArrowRight/>}
                </button>
            </li>
            <li>
                <button
                    title="Ultimo"
                    disabled={page === array.length}
                    onClick={() => callback(array.length)}>
                    {page === array.length ? <KeyboardDoubleArrowRight color="disabled"/> : <KeyboardDoubleArrowRight/>}
                </button>
            </li>
        </ul>
    );
}

export const LocationsFormPage = () => {
    const dispatch = useAppDispatch();
    const { loadingLocations, locations } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [locationsMap, setLocationsMap] = useState<Map<LocationInterface, LocationInterface[]>>();
    const [locations_, setLocations_] = useState<LocationInterface[]>([]);
    const [locations__, setLocations__] = useState<LocationInterface[]>([]);
    const [page, setPage] = useState(1);

    const handlePage = (page: number) => setPage(page);

    useEffect(() => {
        if (locations == undefined)
            dispatch(thunkGetLocations(id_plan));
    }, []);

    useEffect(() => {
        if (locations == undefined) return
        if (locations.length === 0) return;
        setLocationsMap(convertLocations(locations));
    }, [locations]);

    useEffect(() => {
        if (locationsMap === undefined) return;
        const locsTemp = Array.from(locationsMap.keys());
        const locTemp = locationsMap.get(locsTemp[page - 1]);
        setLocations_(locsTemp);
        setLocations__(locTemp??[]);
    }, [locationsMap, page]);

    return(
        loadingLocations ? <p>Cargando...</p> :
        <div className="tw-flex tw-flex-col tw-justify-center">
            <Pagination array={locations_} page={page} callback={handlePage}/>
            <LocationsForm loc={locations_[page-1]} locs={locations__}/>
        </div>
    );
}