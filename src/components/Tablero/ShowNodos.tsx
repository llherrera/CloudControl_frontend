import React from 'react';
import { Nodo } from '../../interfaces';

export const ShowNodos = ( props : any ) => {

    const handleButton = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        props.callback2(true)
        props.callback(props.index, props.nodos[index].id_nodo)
    }

    return (
        <div className="col-start-1 col-span-3
                        border-r-4 border-gray-400">
            {props.nodos.map((item: Nodo, index: number) => (
                <div className="my-5 flex">
                    <button className ="rounded-full
                                        bg-white
                                        ml-3 py-1
                                        border-yellow-300 border-8
                                        translate-x-3
                                        scale-100"
                            onClick={ (event) => handleButton(event, index)}>
                        99%
                    </button>
                    <button className ="bg-red-300
                                        px-2 py-1 my-2
                                        w-2/3
                                        rounded"
                            onClick={ (event) => handleButton(event, index)}>
                        <p>{item.Nombre}</p>
                    </button>
                </div>
            ))}
        </div>
    );
}