import React, { useState, useEffect } from "react";
import { Input } from "../Inputs";
import { addNivel } from "../../services/api";
import { decode } from "../../utils/decode";

export const NivelForm = ( id :any ) => {

    const [data, setData] = useState([
        { Nombre: "", Descripcion: "" },
        { Nombre: "", Descripcion: "" },
        { Nombre: "", Descripcion: "" }
    ])

    const [nivel, setNivel] = useState({
        Nombre: "",
        Descripcion: ""
    })

    const [rol, setRol] = useState("")
    const [id_, setId] = useState(0)

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        try {
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as any
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
        setNivel({ Nombre: "", Descripcion: "" });
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
            await addNivel(data, id.id)
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {(rol === "admin") || (rol === 'funcionario' && id === id.id) ?
            <form   onSubmit={ handleSubmit}
                    className="grid grid-cols-12 mt-5">
                <ul className="col-start-5 col-span-4 gap-3">
                {data.map(( e:any, index: number )=> 
                    <li className="mb-3 p-2 bg-cyan-200 rounded">
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
                <div className="w-full flex justify-around py-2 bg-cyan-200 rounded">
                    <button className="bg-green-500
                                       hover:bg-green-300 
                                       text-white font-bold          
                                        w-12 p-2 rounded"
                            type="button"
                            onClick={ agregarNivel }>+</button>
                    <button className="bg-red-500 
                                       hover:bg-red-300 
                                       text-white font-bold
                                        w-12 p-2 rounded"
                            type="button"
                            onClick={ eliminarNivel }>-</button>
                </div>
                </ul>
                <input  type="submit"
                        value={"Guardar"}
                        className=" col-start-6 col-span-2
                                    bg-blue-500
                                    hover:bg-blue-300 
                                    text-white font-bold }
                                    rounded
                                    mt-5 mx-6 py-2"/>
            </form>
            : <div>No tiene permisos suficientes</div>}
        </div>
        
    )
}
