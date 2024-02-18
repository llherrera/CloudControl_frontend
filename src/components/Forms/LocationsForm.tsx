import { Coordinates, LocationInterface, locationTypes } from "@/interfaces";
import { useAppSelector, useAppDispatch } from "@/store";
import { useState } from "react";
import { InfoPopover, LocationPopover } from "@/components";
import { thunkAddLocations, thunkUpdateLocations } from "@/store/plan/thunks";
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';

export const LocationsForm = () => {
    const dispatch = useAppDispatch();
    const { locations } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);
    const blankLocation = { id_plan, type: locationTypes.neighborhood, name: '' };

    const [location, setLocation] = useState('');
    const [locationName, setLocationName] = useState('');
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

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setLocation(value)
    };

    const handleLocationName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setLocationName(value);
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
            dispatch(thunkAddLocations({ id_plan, locations: data, location: {id_plan, type: location, name: locationName}})).then(() => notify("Localidades Añadidas"));
    };

    const handleLocation = (value: Coordinates, index: number) => {
        const newData = [...data];
        newData[index] = { ...newData[index], lat: value.lat, lng: value.lng };
        setData(newData);
    };

    return(
        <div className="tw-flex tw-justify-center tw-border-t-4 tw-mt-8 tw-pt-2 tw-pb-4">
            <ToastContainer />
            <form className="tw-shadow-2xl tw-p-2">
                <p className="tw-font-bold tw-text-center">
                    Añadir localidades/barrios
                    <InfoPopover content={'Las localidades y comunas agrupan barrios,\nlos corregimientos se conforman por veredas y centros poblados'}/>
                </p>
                <div className="tw-flex tw-mt-3">
                    <div>
                        <select name="location"
                                value={location}
                                onChange={e =>handleLocationChange(e)}
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
                                onChange={e => handleLocationName(e)} value={locationName}/>
                    </div>
                    <ul>
                        {data.map((location, index) => (
                            <li key={index}>
                                <label>{index + 1}</label>
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