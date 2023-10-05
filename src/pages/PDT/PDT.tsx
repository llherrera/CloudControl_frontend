import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPDTs } from "../../services/api";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export const PDT = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([])

    React.useEffect(() => {
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

    const handleAdd = () => {
        navigate('/register')
    }

    return (
        <div className="flex justify-center mt-10">
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
                                onClick={handleAdd}>
                        <PersonAddAltIcon/>
                    </IconButton>
                </div> 
                ) }
            </ul>
        </div>
    )
}