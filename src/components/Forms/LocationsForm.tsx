import { Coordinates, LocationInterface, locationTypes } from "@/interfaces";
import { useAppSelector, useAppDispatch } from "@/store";
import { useState } from "react";
import { LocationPopover } from "@/components";
import { thunkAddLocations, thunkUpdateLocations } from "@/store/plan/thunks";
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';

export const LocationsForm = () => {
    const dispatch = useAppDispatch();
    const { plan, locations } = useAppSelector((state) => state.plan);
    const blankLocation = { id_plan: plan?.id_plan!, type: locationTypes.neighborhood, name: '' };
    const locationTypeOptions = Object.values(locationTypes);

    const [data, setData] = useState<LocationInterface[]>(locations);

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

    const handleSubmit = () => {
        data.forEach((location) => {
            if (location.name === "") {
                return notify("Por favor llene todos los campos");
            }
            if (!location.lat && !location.lng) {
                return notify(`Por favor seleccionar ubicación de localidad: ${location.name}`);
            }
        })
        if (locations)
            dispatch(thunkUpdateLocations({ id_plan: plan?.id_plan!, locations: data })).then(() => notify("Localidades actualizadas"));
        else
            dispatch(thunkAddLocations({ id_plan: plan?.id_plan!, locations: data})).then(() => notify("Localidades Añadidas"));
    };

    const handleLocation = (value: Coordinates, index: number) => {
        const newData = [...data];
        newData[index] = { ...newData[index], lat: value.lat, lng: value.lng };
        setData(newData);
    };

    return(
        <div className="tw-flex tw-justify-center tw-border-t-4 tw-mt-4 tw-pt-2 tw-pb-4">
            <ToastContainer />
            <form
                className="tw-shadow-2xl tw-p-2">
                    <label htmlFor="">Añadir localidades/barrios</label>
                    {data.map((location, index) => (
                        <div key={index}>
                            <label htmlFor="" className="tw-">{index + 1}</label>
                            <select name="type"
                                onChange={(e) => handleTypeChange(e, index)}
                                className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                required>
                                {locationTypeOptions.map((e, i) => {
                                return <option key={i} value={e}>{e}</option>
                                })}
                            </select>
                            <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                    onChange={ (e) => handleInputChange(e, index) } value={ location.name }
                                    type="text" name="name" required placeholder="Nombre" />
                            <LocationPopover index={index} callback={handleLocation} item={location}/>
                        </div>
                    ))}
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
                        <button className="tw-bg-green-500 hover:tw-bg-green-300
                                            tw-text-white tw-font-bold
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