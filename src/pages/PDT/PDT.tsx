import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPDTs } from "../../services/api";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { decode } from "../../utils/decode";

export const PDT = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([])
    const [rol, setRol] = useState("")

    React.useEffect(() => {
        const token = sessionStorage.getItem('token')
        try {
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as any
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
        getPDTs()
            .then((res) => {
                setData(res)
            })
    }, []);

    const handleAddPdt = () => {
        navigate('/anadirPDT')
    }

    const handlePdtid = ( id: number ) => {
        navigate(`/pdt/${id}`)
    }

    const handleAdd = (id: number) => {
        navigate(`/${id}/register`)
    }

    return (
        <div className="flex justify-center mt-10">
            {rol === "admin" ? 
            <ul className="border p-4 rounded">
            <button className="bg-green-300 rounded w-full py-2 mb-4"
                    onClick={handleAddPdt}>
                Añadir Plan +
            </button>
            { data!.map(( e:any )=>
            <div className="flex">
                <button className="flex justify-between w-full mb-4 p-2 rounded bg-gray-200"
                        onClick={(event) => handlePdtid(e.id_plan)}>
                    
                    <p className="mr-4">{e.Nombre}</p>
                    <p className="ml-4">{e.Alcaldia}</p>
                </button>
                <IconButton color="success"
                            aria-label="delete"
                            onClick={(event) => handleAdd(e.id_plan)}>
                    <PersonAddAltIcon/>
                </IconButton>
            </div> 
            ) }
        </ul> 
        : <p className="text-3xl font-bold">No tiene suficientes permisos</p>}
            
        </div>
    )
}