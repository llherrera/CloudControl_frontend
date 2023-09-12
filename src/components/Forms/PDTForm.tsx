import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../Inputs";
import { addPDT } from "../../services/api";

export const PDTForm = () => {
    const navigate = useNavigate();

    const [planData, setPlanData] = useState({
        nombrePlan: "",
        alcaldia: "",
        municipio: "",
        fechaIni: Date(),
        fechaFin: Date(),
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
            navigate("/lobby");
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
                        value={planData.nombrePlan}
                        onChange={handleInputChange}/><br/>
            <Input  type={"text"}
                        label="Alcaldía:"
                        id={"alcaldia"}
                        name={"alcaldia"}
                        value={planData.alcaldia}
                        onChange={handleInputChange}/><br/>
            <Input  type={"text"}
                        label="Municipio:"
                        id={"municipio"}
                        name={"municipio"}
                        value={planData.municipio}
                        onChange={handleInputChange}/><br/>
            
            <div className="flex justify-between">
                <Input  type={"date"}
                        label="Fecha de Inicio"
                        id="fechaIni"
                        name="fechaIni"
                        value={planData.fechaIni}
                        onChange={handleInputChange}/>
                
                <Input  type={"date"}
                        label="Fecha de Fin"
                        id="fechaFin"
                        name="fechaFin"
                        value={planData.fechaFin}
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