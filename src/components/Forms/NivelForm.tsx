import React, { useState, useEffect } from "react";
import { Input } from "../Inputs";
import { addNivel } from "../../services/api";
import { decode } from "../../utils/decode";
import { NivelInterface, Token } from "../../interfaces";
import Cookies from "js-cookie";

interface Props {
    id: string;
}

export const NivelForm = ( props: Props ) => {

    const [data, setData] = useState<NivelInterface[]>([
        { Nombre: "", Descripcion: "" },
        { Nombre: "", Descripcion: "" },
        { Nombre: "", Descripcion: "" }
    ])

    const [nivel, setNivel] = useState<NivelInterface>({
        Nombre: "",
        Descripcion: ""
    })

    const [rol, setRol] = useState("")
    const [id_, setId] = useState(0)

    useEffect(() => {
        //const token = sessionStorage.getItem('token')
        const token = Cookies.get('token')
        try {
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
    })

    const agregarNivel = () => {
        const newData = [...data, nivel];
        setData(newData);
        setNivel({ Nombre: "", Descripcion: "" } as NivelInterface);
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
            await addNivel(data, props.id)
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {(rol === "admin") || (rol === 'funcionario' && id_ === parseInt(props.id)) ?
            <form   onSubmit={ handleSubmit}
                    className="tw-grid tw-grid-cols-12 tw-mt-5">
                <ul className="tw-col-start-5 tw-col-span-4 tw-gap-3">
                {data.map(( e:NivelInterface, index: number )=> 
                    <li className="tw-mb-3 tw-p-2 tw-bg-cyan-200 tw-rounded">
                        <Input  type={"text"}
                                label="Nombre del Nivel:"
                                id={"Nombre"}
                                name={"Nombre"}
                                value={e.Nombre}
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <Input  type={"text"}
                                label="Descripción:"
                                id={"Descripcion"}
                                name={"Descripcion"}
                                value={e.Descripcion}
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
