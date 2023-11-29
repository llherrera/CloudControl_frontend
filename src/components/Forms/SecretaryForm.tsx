import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "@/store";

import { Secretary } from "@/interfaces";
import { validateEmail } from "@/utils";
import { addSecretaries } from "@/services/api";

export const SecretaryForm = () => {
    const dispatch = useAppDispatch();
    const { plan } = useAppSelector((state) => state.plan);

    const [data, setData] = useState<Secretary[]>([
        { name: "", id_plan: plan?.id_plan!, email: "", phone: "" },
    ])

    const addSecretary = () => {
        const newData = [...data, { name: "", id_plan: plan?.id_plan!, email: "", phone: "" }];
        setData(newData);
    }

    const deleteSecretary = () => {
        const newData = data.slice(0, -1);
        setData(newData);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: value };
        setData(newData);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        data.forEach((secretary) => {
            if (secretary.name === "" || secretary.email === "" || secretary.phone === "") {
                alert("Por favor llene todos los campos");
                return;
            }
            if (!validateEmail(secretary.email)) {
                alert("El correo no es válido");
                return;
            }
        })
        addSecretaries(plan?.id_plan!, data)
        .then((res) => {
            alert("Se agregaron las secretarias correctamente");
        })
        .catch((err) => {
            console.log(err)
            alert("Hubo un error al agregar las secretarias");
        });
    }

    return (
        <div className="tw-flex tw-justify-center tw-border-t-4 tw-pt-2">
            <form   
                onSubmit={ handleSubmit }
                className="tw-shadow-2xl tw-p-2">
                <label htmlFor="">Añadir secretarias</label>
                {data.map((secretary, index) => (
                    <div key={index}>
                        <label htmlFor="" className="tw-">{index + 1}</label>
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
                    <button className="tw-bg-green-500 hover:tw-bg-green-300
                                        tw-text-white tw-font-bold
                                        tw-p-2 tw-rounded"
                            type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}