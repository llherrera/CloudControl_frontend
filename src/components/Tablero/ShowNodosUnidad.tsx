import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Nodo } from '../../interfaces';

export const ShowNodosUnidad = ( props : any ) => {

    const [progreso, setProgreso] = useState([] as number[])
    const [programacion, setProgramacion] = useState([] as number[])

    useEffect(() => {
        const ids = props.nodos.map((item: Nodo) => item.id_nodo)
        getProgress(ids)
    }, [props.año, props.nodos])

    const getProgress = (ids: number[]) => {
        const pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            return 0
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        let programacion = [] as number[]
        pesosNodo.forEach((item: any) => {
            if (ids.includes(item.id_nodo)) {
                const { porcentajes } = item
                if (porcentajes) {
                    porcentajes.forEach((porcentaje: any) => {
                        if (porcentaje.año === props.año) {
                            progreso.push(porcentaje.progreso)
                            programacion.push(porcentaje.programacion)
                        }
                    })
                }else {
                    progreso.push(0)
                    programacion.push(0)
                }
            }
        })
        setProgreso(progreso)
        setProgramacion(programacion)
    }

    const navigate = useNavigate();

    const handleButtonUnidad = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        navigate(`/pdt/${props.id}/${props.nodos[index].id_nodo}`)
    }

    return (
        <div className="col-start-1 col-span-3 flex flex-wrap
                        border-r-4 border-gray-400 gap-4">
            {props.nodos.map((item: Nodo, index: number) => (
                <button className ={`rounded-full
                                    ${programacion[index] === 0 ? 'bg-gray-400' :
                                        (progreso[index]??0)*100 < props.colors[0] ? 'bg-red-400'   :
                                      (progreso[index]??0)*100 < props.colors[1] ? 'bg-yellow-400':
                                      (progreso[index]??0)*100 < props.colors[2] ? 'bg-green-400' : 'bg-blue-400'}
                                    w-12 h-12
                                    my-4
                                    font-bold
                                    translate-x-3`}
                        onClick={ (event) => handleButtonUnidad(event, index)}>
                    {progreso[index]*100}%
                </button>
            ))}
        </div>
    );
}