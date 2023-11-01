import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Input } from "../Inputs";
import { addPDT } from "../../services/api";
import { PDTInterface } from "../../interfaces";

export const PDTForm = () => {
    const navigate = useNavigate();

    const fechaInicio = new Date().getFullYear()
    const fechaFin = fechaInicio + 4

    const [año, setAño] = useState<number>(fechaInicio)
    const [planData, setPlanData] = useState<PDTInterface>({
        Nombre: "",
        Alcaldia: "",
        Municipio: "",
        Fecha_inicio: new Date(),
        Fecha_fin: new Date(),
        Descripcion: "",
    });

    const handleInputYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setAño(parseInt(value));
        setPlanData({
            ...planData,
            Fecha_inicio: new Date(parseInt(value), 0, 1),
            Fecha_fin: new Date(parseInt(value) + 3, 11, 31),
        });
    }

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

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    return (
        <div className="tw-flex tw-justify-center">
            {backIconButton()}
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
                    <label className="tw-mr-4">Fecha de inicio</label>
                    <select name="Fecha_inicio" id="Fecha_inicio" onChange={handleInputYearChange}>
                        {Array.from(Array(5).keys()).map((e) => {
                            return <option value={fechaInicio + e}>{fechaInicio + e}</option>;
                        })}
                    </select>
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