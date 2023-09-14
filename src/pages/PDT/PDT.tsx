import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPDTs } from "../../services/api";

export const PDT = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([])

    React.useEffect(() => {
        getPDTs()
            .then((res) => {
                setData(res)
            })
    }, []);

    return (
        <div className="flex justify-center mt-10">
            <ul className="border p-4 rounded">
                <button className="bg-green-300 rounded w-full py-2 mb-4"
                        onClick={ ()=> navigate('/anadirPDT')}>
                    Añadir Plan +
                </button>
                { data!.map(( e:any )=> 
                    <button className="flex justify-between w-full mb-4 p-2 rounded bg-gray-200"
                            onClick={ ()=>{ navigate(`/pdt/${e.id_plan}`) }}>
                        
                        <p className="mr-4">{e.Nombre}</p>
                        <p className="ml-4">{e.Alcaldia}</p>
                    </button>
                ) }
            </ul>
        </div>
    )
}