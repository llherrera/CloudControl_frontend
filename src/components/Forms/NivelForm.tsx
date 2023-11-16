import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";

import { Input } from "../Inputs";
import { addLevel } from "@/services/api";
import { NivelInterface, Token } from "@/interfaces";
import { getToken, decode } from "@/utils";

interface Props {
    id: string;
}

export const NivelForm = ( props: Props ) => {
    const navigate = useNavigate()

    const [data, setData] = useState<NivelInterface[]>([
        { LevelName: "", Description: "" },
        { LevelName: "", Description: "" },
        { LevelName: "", Description: "" }
    ])

    const [nivel, setNivel] = useState<NivelInterface>({
        LevelName: "",
        Description: ""
    })

    const [rol, setRol] = useState("")
    const [id_, setId] = useState(0)

    useEffect(() => {
        const abortController = new AbortController()
        const gettoken = getToken()
        try {
            const {token} = gettoken
            if (token !== null || token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
        return () => abortController.abort()
    })

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar"
                        key={data.length}>
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    const agregarNivel = () => {
        const newData = [...data, nivel];
        setData(newData);
        setNivel({ LevelName: "", Description: "" } as NivelInterface);
    }

    const eliminarNivel = () => {
        if (data.length > 1) {
            const newData = data.slice(0, data.length - 1);
            setData(newData);
        }
    }

    const handleInputFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
    
        newData[index] = { ...newData[index], [name]: value };
    
        setData(newData);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await addLevel(data, props.id)
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {backIconButton()}
            {(rol === "admin") || (rol === 'funcionario' && id_ === parseInt(props.id)) ?
            <form   onSubmit={ handleSubmit}
                    className="tw-grid tw-grid-cols-12 tw-mt-5">
                <ul className="tw-col-start-5 tw-col-span-4 tw-gap-3">
                {data.map(( e:NivelInterface, index: number )=> 
                    <li className="tw-mb-3 tw-p-2 tw-bg-cyan-200 tw-rounded"
                        key={index}>
                        <Input  type={"text"}
                                label="Nombre del Nivel:"
                                id={"LevelName"}
                                name={"LevelName"}
                                value={e.LevelName}
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <Input  type={"text"}
                                label="Descripción:"
                                id={"Description"}
                                name={"Description"}
                                value={e.Description}
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </li>
                )}
                <div className="tw-w-full tw-flex tw-justify-around tw-py-2 tw-bg-cyan-200 tw-rounded">
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300 
                                        tw-text-white tw-font-bold          
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Agregar un nuevo nivel"
                            onClick={ agregarNivel }>+</button>
                    <button className=" tw-bg-red-500 
                                        hover:tw-bg-red-300 
                                        tw-text-white tw-font-bold
                                        tw-w-12 tw-p-2 tw-rounded"
                            type="button"
                            title="Eliminar un nivel"
                            onClick={ eliminarNivel }>-</button>
                </div>
                </ul>
                <input  type="submit"
                        value={"Guardar"}
                        title="Guardar"
                        className=" tw-col-start-6 tw-col-span-2
                                    tw-bg-blue-500
                                    hover:tw-bg-blue-300 
                                    tw-text-white tw-font-bold }
                                    tw-rounded
                                    tw-mt-5 tw-mx-6 tw-py-2"/>
            </form>
            : <div>No tiene permisos suficientes</div>}
        </div>
        
    )
}
