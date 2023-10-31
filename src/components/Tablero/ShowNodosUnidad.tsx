import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { NodoInterface, PesosNodos, Porcentaje } from '../../interfaces';

interface Props {
    id: number;
    nodos: NodoInterface[];
    año: number;
    colors: number[];
    index: number;
}

export const ShowNodosUnidad = ( props : Props ) => {

    const [progreso, setProgreso] = useState([] as number[])
    const [programacion, setProgramacion] = useState([] as number[])

    useEffect(() => {
        console.log('Unidad');
        
        const ids = props.nodos.map((item: NodoInterface) => item.id_nodo)
        getProgress(ids)
    }, [props.año, props.nodos, props.index])

    const getProgress = (ids: string[]) => {
        const pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            return 0
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        let programacion = [] as number[]
        pesosNodo.forEach((item: PesosNodos) => {
            if (ids.includes(item.id_nodo)) {
                const { porcentajes } = item
                if (porcentajes) {
                    porcentajes.forEach((porcentaje: Porcentaje) => {
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
        <ul className=" tw-flex tw-flex-wrap
                        tw-border-r-4 
                        tw-border-gray-400 
                        tw-gap-4">
            {props.nodos.map((item: NodoInterface, index: number) => (
                <button className={`tw-rounded
                                    tw-border-4
                                    ${programacion[index] === 0 ? 'tw-border-gray-400' :
                                      (progreso[index]??0)*100 < props.colors[0] ? 'tw-border-redColory'   :
                                      (progreso[index]??0)*100 < props.colors[1] ? 'tw-border-yellowColory':
                                      (progreso[index]??0)*100 < props.colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                    tw-w-12 tw-h-12
                                    tw-my-4 tw-ml-3
                                    tw-font-bold`}
                        onClick={ (event) => handleButtonUnidad(event, index)}
                        title={item.Description}>
                    {progreso[index]*100}%
                </button>
            ))}
        </ul>
    );
}