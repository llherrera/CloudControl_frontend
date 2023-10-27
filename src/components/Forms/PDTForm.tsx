import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../Inputs";
import { addPDT } from "../../services/api";
import { PDTInterface } from "../../interfaces";

export const PDTForm = () => {
    const navigate = useNavigate();

    const [planData, setPlanData] = useState<PDTInterface>({
        Nombre: "",
        Alcaldia: "",
        Municipio: "",
        Fecha_inicio: Date(),
        Fecha_fin: Date(),
        Descripcion: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlanData({
            ...planData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            addPDT(planData)
            .then((res) => {
                navigate(`/pdt/${res.id_plan}`)
            })
            .catch((err) => {
                alert(err);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="tw-flex tw-justify-center">
            <form   onSubmit={handleSubmit}
                    className=" tw-flex tw-flex-col 
                                tw-items-center tw-justify-center 
                                tw-rounded tw-shadow-2xl
                                tw-p-10">
                <Input  type={"text"}
                        label="Nombre del Plan:"
                        id={"Nombre"}
                        name={"Nombre"}
                        value={planData.Nombre}
                        onChange={handleInputChange}/><br/>
                <Input  type={"text"}
                        label="Alcaldía:"
                        id={"Alcaldia"}
                        name={"Alcaldia"}
                        value={planData.Alcaldia}
                        onChange={handleInputChange}/><br/>
                <Input  type={"text"}
                        label="Municipio:"
                        id={"Municipio"}
                        name={"Municipio"}
                        value={planData.Municipio}
                        onChange={handleInputChange}/><br/>
                <Input  type={"text"}
                        label="Descripción:"
                        id={"Descripcion"}
                        name={"Descripcion"}
                        value={planData.Descripcion}
                        onChange={handleInputChange}/><br/>

                <div className="tw-flex">
                    <Input  type={"date"}
                            label="Fecha de Inicio"
                            id="Fecha_inicio"
                            name="Fecha_inicio"
                            value={planData.Fecha_inicio}
                            onChange={handleInputChange}/>
                    <Input  type={"date"}
                            label="Fecha de Fin"
                            id="Fecha_fin"
                            name="Fecha_fin"
                            value={planData.Fecha_fin}
                            onChange={handleInputChange}/>
                </div><br/>
                <input  type="submit"
                        value="Registrar Plan"
                        title="Añadir plan"
                        className=" tw-bg-green-500
                                    hover:tw-bg-green-300
                                    tw-rounded
                                    tw-p-2"
                />

            </form>
        </div>
    )
}