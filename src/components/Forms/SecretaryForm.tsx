import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkAddSecretaries, thunkUpdateSecretaries } from "@/store/plan/thunks";

import { Secretary } from "@/interfaces";
import { validateEmail, notify } from "@/utils";

export const SecretaryForm = () => {
    const dispatch = useAppDispatch();
    const { secretaries } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);
    const blankSecretary = { id_plan: id_plan, name: '', email: '', phone: 0 };

    const [data, setData] = useState<Secretary[]>(secretaries == undefined ? [blankSecretary] : secretaries);

    const addSecretary = () => {
        const newData = [...data, { name: "", id_plan: id_plan, email: "", phone: 0 }];
        setData(newData);
    };

    const deleteSecretary = () => {
        const newData = data.slice(0, -1);
        setData(newData);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: value };
        setData(newData);
    };

    const handleSubmit = async () => {
        data.forEach((secretary) => {
            if (secretary.name === "" || secretary.email === "" || secretary.phone === 0)
                return notify("Por favor llene todos los campos");
            if (!validateEmail(secretary.email))
                return notify("El correo no es válido");
        })
        if (secretaries) dispatch(thunkUpdateSecretaries({ id_plan: id_plan, secretaries: data }));
        else dispatch(thunkAddSecretaries({ id_plan: id_plan, secretaries: data}));
    }

    
    return (
        <div className="tw-flex tw-justify-center">
            <form className="tw-p-2 tw-bg-white">
                <p className="tw-font-bold tw-text-center">
                    Añadir secretarias
                </p>
                {data.map((secretary, index) => (
                    <div key={index}>
                        <label>{index + 1}</label>
                        <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                onChange={ (e) => handleInputChange(e, index) } value={ secretary.name}
                                type="text" name="name" required placeholder="Nombre" />
                        <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                onChange={ (e) => handleInputChange(e, index) } value={ secretary.email}
                                type="text" name="email" required placeholder="Correo" />
                        <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                onChange={ (e) => handleInputChange(e, index) } value={ secretary.phone}
                                type="number" name="phone" required placeholder="Telefono" />
                    </div>
                ))}
                <div className="tw-flex tw-justify-around tw-py-2 tw-rounded">
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300 
                                        tw-text-white tw-font-bold          
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Agregar un nuevo nivel"
                            onClick={ addSecretary }>+</button>
                    <button className=" tw-bg-red-500 
                                        hover:tw-bg-red-300 
                                        tw-text-white tw-font-bold
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Eliminar un nivel"
                            onClick={ deleteSecretary }>-</button>
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