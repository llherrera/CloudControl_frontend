import React, { useState } from "react";
import { Nodo } from "../../interfaces";
import { getNodosNivel } from "../../services/api";
import { NodoForm } from "../Forms";

export const Content = ( props : any ) => {

    const [nodos, setNodos] = useState([] as Nodo[]);

    React.useEffect(() => {
        try{
            getNodosNivel(props.data.id_nivel, props.Padre)
                .then((res) => {
                    setNodos(res)
            })
        } catch (e) {
            console.log(e)
        }
    }, [props.index, nodos])
 
    const handleButton = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        props.callback(props.index, nodos[index].id_nodo)
    }

    const showNodos = () => {
        return (
            <div className="col-start-1 col-span-2
                            border-r-4 border-gray-400">
                {nodos.map((item: Nodo, index: number) => (
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

    return (
        <div className="">
            {nodos.length === 0 ? <div>
                <h1 className="bg-gray-400 py-1 my-2"> {props.data.Nombre} </h1>
                <NodoForm id={props.data.id_nivel} Padre={props.Padre} />
            </div> : <div className="grid grid-cols-12">
                <h1 className="bg-gray-400 py-1 mt-2 col-span-2 "> {props.data.Nombre} </h1>
                {showNodos()}
            </div>
            }
        </div>
    )
}
