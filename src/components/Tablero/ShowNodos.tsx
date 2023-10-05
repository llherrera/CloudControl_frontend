import React, { useEffect, useState } from 'react';
import { Nodo } from '../../interfaces';
import { getProgresoAño } from '../../services/api';

export const ShowNodos = ( props : any ) => {

    const [progreso, setProgreso] = useState([] as number[])

    useEffect(() => {
        try {
            const ids = props.nodos.map((item: Nodo) => item.id_nodo)
            getProgress(ids)
        } catch (e) {
            console.log(e)
        }
    }, [props.año, props.nodos, props.progress])

    const getProgress = (ids: number[]) => {
        let pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            pesosStr = '[]'
        
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        pesosNodo.forEach((item: any) => {
            if (ids.includes(item.id_nodo)) {
                const { porcentajes } = item
                if (porcentajes) {
                    porcentajes.forEach((porcentaje: any) => {
                        if (porcentaje.año === props.año) {
                            progreso.push(porcentaje.progreso)
                        }
                    })
                } else {
                    progreso.push(0)
                }
            }
        })
        setProgreso(progreso)
    }

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
                                        ml-3
                                        w-12 h-12
                                      border-yellow-300 border-8
                                        translate-x-3
                                        scale-100"
                            onClick={ (event) => handleButton(event, index)}>
                        {(progreso[index]??0)*100}%
                    </button>
                    <button className ="bg-red-300
                                        h-8 my-2
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