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
            const res = await addPDT(planData);
            navigate(`/pdt/${res.id_plan}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form   onSubmit={handleSubmit}
                className=" ">

            <Input  type={"text"}
                    label="Nombre del Plan:"
                    id={"nombrePlan"}
                    name={"nombrePlan"}
                    value={planData.Nombre}
                    onChange={handleInputChange}/><br/>
            <Input  type={"text"}
                    label="Alcaldía:"
                    id={"alcaldia"}
                    name={"alcaldia"}
                    value={planData.Alcaldia}
                    onChange={handleInputChange}/><br/>
            <Input  type={"text"}
                    label="Municipio:"
                    id={"municipio"}
                    name={"municipio"}
                    value={planData.Municipio}
                    onChange={handleInputChange}/><br/>
            <Input  type={"text"}
                    label="Descripción:"
                    id={"descripcion"}
                    name={"descripcion"}
                    value={planData.Descripcion}
                    onChange={handleInputChange}/><br/>
            
            <div className="flex justify-between">
                <Input  type={"date"}
                        label="Fecha de Inicio"
                        id="fechaIni"
                        name="fechaIni"
                        value={planData.Fecha_inicio}
                        onChange={handleInputChange}/>
                
                <Input  type={"date"}
                        label="Fecha de Fin"
                        id="fechaFin"
                        name="fechaFin"
                        value={planData.Fecha_fin}
                        onChange={handleInputChange}/>
            </div><br/>
            <input  type="submit"
                    value="Registrar Plan"
                    className=" bg-green-500
                                rounded
                                p-2"
            />

        </form>
    )
}