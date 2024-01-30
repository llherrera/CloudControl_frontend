import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store";
import { thunkAddLevel } from "@/store/plan/thunks";

import { Input, FileInput } from "@/components";
import { LevelInterface, Token, LevelFormProps } from "@/interfaces";
import { getToken, decode } from "@/utils";

export const LevelForm = ( props: LevelFormProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [data, setData] = useState<LevelInterface[]>([
        { name: "", description: "" },
        { name: "", description: "" },
        { name: "", description: "" }
    ]);

    const [nivel, setNivel] = useState<LevelInterface>({
        name: "", description: ""
    });

    const [rol, setRol] = useState("");
    const [id_, setId] = useState(0);

    useEffect(() => {
        const abortController = new AbortController();
        const token_info = getToken();
        try {
            if (token_info === null || token_info === undefined) return;
            const {token} = token_info;
            if (token !== null || token !== undefined) {
                const decoded = decode(token) as Token;
                setId(decoded.id_plan);
                setRol(decoded.rol);
            }
        } catch (error) {
            console.log(error);
        }
        return () => abortController.abort();
    });

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
        );
    }

    const agregarNivel = () => {
        const newData = [...data, nivel];
        setData(newData);
        setNivel({ name: "", description: "" } as LevelInterface);
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

    const handleSubmit = async () => {
        dispatch(thunkAddLevel({id: props.id, levels: data}))
        .unwrap()
        .catch((error)=>{
            console.log(error);
        });
    }

    return (
        <div className="tw-bg-[url('/src/assets/images/bg-pi-1.png')]">
            {backIconButton()}
            <p className="tw-text-center tw-font-bold tw-text-2xl">Definir niveles del plan</p>
            {(rol === "admin") || (rol === 'funcionario' && id_ === parseInt(props.id)) ?
            (<div>
                <FileInput/>
                <form className="tw-grid tw-grid-cols-12 tw-mt-5 tw-pb-5">
                <ul className=" tw-col-start-5 tw-col-span-4
                                md:tw-col-start-4 md:tw-col-span-6 
                                lg:tw-col-start-4 lg:tw-col-span-6 
                                tw-gap-3">
                {data.map(( e:LevelInterface, index: number )=> 
                    <li className=" tw-mb-3 tw-p-2 
                                    tw-bg-white 
                                    tw-shadow-lg tw-border tw-rounded"
                        key={index}>
                        <Input  type={"text"}
                                label="Nombre del Nivel:"
                                id={"name"}
                                name={"name"}
                                onChange={ (event) => handleInputFormChange(event, index) }/>
                        <Input  type={"text"}
                                label="Descripción:"
                                id={"description"}
                                name={"description"}
                                onChange={ (event) => handleInputFormChange(event, index) }/>
                    </li>
                )}
                <div className="tw-w-full tw-flex tw-justify-around tw-py-2 tw-bg-white tw-shadow-lg tw-border tw-rounded">
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
                <button type="button"
                        value={"Guardar"}
                        className=" tw-col-start-6 tw-col-span-2
                                    tw-bg-blue-500
                                    hover:tw-bg-blue-300 
                                    tw-text-white tw-font-bold }
                                    tw-rounded
                                    tw-mt-5 tw-mx-6 tw-py-2"
                        onClick={handleSubmit}>
                    Guardar
                </button>
            </form>
            </div>)
            : <p className="tw-text-center tw-text-2xl">Plan en proceso</p>}
            </div>
    );
}
