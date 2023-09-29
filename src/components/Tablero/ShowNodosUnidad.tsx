import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Nodo } from '../../interfaces';
import { getProgresoAño } from '../../services/api';

export const ShowNodosUnidad = ( props : any ) => {

    const [progreso, setProgreso] = useState([] as number[])

    useEffect(() => {
        const ids = props.nodos.map((item: Nodo) => item.id_nodo)
        getProgresoAño(ids, props.año)
            .then((res) => {
                setProgreso(res)
            })
    }, [props.año])

    const navigate = useNavigate();

    const handleButtonUnidad = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        navigate(`/pdt/${props.id}/${props.nodos[index].id_nodo}`)
    }

    return (
        <div className="col-start-1 col-span-3 flex flex-wrap
                        border-r-4 border-gray-400 gap-4">
            {props.nodos.map((item: Nodo, index: number) => (
                <button className ="rounded-full
                                  bg-cyan-300
                                    w-12 h-12
                                    my-4
                                  border-cyan-300 border-8
                                    translate-x-3"
                        onClick={ (event) => handleButtonUnidad(event, index)}>
                    {progreso[index]*100}%
                </button>
            ))}
        </div>
    );
}