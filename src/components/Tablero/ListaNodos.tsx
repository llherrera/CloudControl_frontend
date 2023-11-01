import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { NodoInterface, PesosNodos, Porcentaje } from '@/interfaces';

interface Props {
    id: number;
    nodos: NodoInterface[];
    año: number;
    colors: number[];
    index: number;
    len: number;
    callback: (id: number, Padre: (string | null)) => void;
    callback2: (bool: boolean) => void;
}

export const NodesList = ( props : Props ) => {
    const navigate = useNavigate();

    const [nodos, setNodos] = useState<NodoInterface[]>([])
    const [progreso, setProgreso] = useState([] as number[])
    const [programacion, setProgramacion] = useState([] as number[])

    useEffect(() => {
        const ids = props.nodos.map((item: NodoInterface) => item.id_node)
        getProgress(ids)
        setNodos(props.nodos)
    }, [props.año, props.nodos, props.index])

    const getProgress = (ids: string[]) => {
        const pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            return 0
        let pesosNodo = []
        try {
            pesosNodo = JSON.parse(pesosStr as string)            
        } catch (error) {
            pesosNodo = []
        }
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

    const handleButton = ( event: React.MouseEvent<HTMLButtonElement> , index: number ) => {
        event.preventDefault();
        if ( props.index !== props.len ) {
            props.callback2(true)
            props.callback(props.index, props.nodos[index].id_node)
        } else {
            navigate(`/pdt/${props.id}/${props.nodos[index].id_node}`)
        }
    }

    return (
        <ul className={`${props.index !== props.len ? '': 'tw-flex tw-flex-wrap'}`}>
            {nodos.map((item: NodoInterface, index: number) => (
                <div className="tw-my-5 tw-flex"
                    key={index}>
                    <button className={`tw-rounded
                                        tw-flex tw-justify-center tw-items-center
                                        tw-border-4
                                        ${(programacion[index] === 0 || programacion[index] === undefined) ? 'tw-border-gray-400' :
                                        (progreso[index]??0)*100 < props.colors[0] ? 'tw-border-redColory'   :
                                        (progreso[index]??0)*100 < props.colors[1] ? 'tw-border-yellowColory':
                                        (progreso[index]??0)*100 < props.colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold`}
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Description}>
                        {(progreso[index]??0)*100}%
                    </button>
                    {props.index !== props.len ?
                    <button className={`${(programacion[index] === 0 || programacion[index] === undefined) ? 'tw-bg-gray-400' :
                                        (progreso[index]??0)*100 < props.colors[0] ? 'tw-bg-redColory'   :
                                        (progreso[index]??0)*100 < props.colors[1] ? 'tw-bg-yellowColory':
                                        (progreso[index]??0)*100 < props.colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}
                                        tw-h-8 tw-my-2
                                        tw-w-2/3
                                        tw-rounded-r-lg
                                        tw-text-white tw-font-bold`}
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Description}>
                        <p>{item.NodeName}</p>
                    </button>
                    :null}
                </div>
            ))}
        </ul>
    );
}