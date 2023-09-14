import React, { useState } from "react";
import { Input } from "../Inputs";
import { addNivel } from "../../services/api";

export const NivelForm = ( id : any ) => {
    const [data, setData] = useState([
        { nombre: "", descripcion: "" },
        { nombre: "", descripcion: "" },
        { nombre: "", descripcion: "" }
    ])

    const [nivel, setNivel] = useState({
        nombre: "",
        descripcion: ""
    })

    const agregarNivel = () => {
        const newData = [...data, nivel];
        setData(newData);
        setNivel({ nombre: "", descripcion: "" });
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addNivel(data, id)
            .then((res) => {
                console.log(res)
            })
    }

    return (
        <form   onSubmit={ handleSubmit}
                className="grid grid-cols-12 grid-row-6 mt-5">
            <ul className="col-start-5 col-span-4 gap-3">
                {data.map(( e:any, index: number )=> 
                    <li className="mb-3 p-2 bg-cyan-200 rounded">
                        <Input  type={"text"}
                                label="Nombre del Nivel:"
                                id={"nombre"}
                                name={"nombre"}
                                value={e.nombre}
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <Input  type={"text"}
                                label="Descripción:"
                                id={"descripcion"}
                                name={"descripcion"}
                                value={e.descripcion}
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </li>
                )}
            <div className="w-full flex justify-around py-2 bg-cyan-200 rounded">
                <input  type="submit"
                        value={"+"}
                        className="bg-green-300 w-12 p-2 rounded"
                        onClick={ agregarNivel }/>
                <input  type="submit"
                        value={"-"}
                        className="bg-red-300 w-12 p-2 rounded"
                        onClick={ eliminarNivel }/>
            </div>
            </ul>
            <button className="mt-4 py-3 row-start-2 col-start-6 col-span-2 bg-green-500 rounded">
                Guardar
            </button>
        </form>
    )
}