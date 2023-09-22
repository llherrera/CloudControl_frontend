import React from 'react';
import { useNavigate } from "react-router-dom";
import { Nodo } from '../../interfaces';

export const ShowNodosUnidad = ( props : any ) => {
    const navigate = useNavigate();

    const handleButtonUnidad = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        navigate(`/pdt/${props.id}/${props.nodos[index].id_nodo}`)
    }

    return (
        <div className="col-start-1 col-span-3 
                        border-r-4 border-gray-400 gap-4">
            {props.nodos.map((item: Nodo, index: number) => (
                    <button className ="rounded-full
                                        bg-cyan-300
                                        ml-3 py-1 my-4
                                        border-cyan-300 border-8
                                        translate-x-3
                                        "
                            onClick={ (event) => handleButtonUnidad(event, index)}>
                        99%
                    </button>
            ))}
        </div>
    );
}