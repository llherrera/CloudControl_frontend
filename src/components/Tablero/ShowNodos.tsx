import React, { useState, useEffect } from 'react';
import { NodoInterface, PesosNodos, Porcentaje } from '../../interfaces';

interface Props {
    callback: (id: number, Padre: (string | null)) => void;
    callback2: (bool: boolean) => void;
    nodos: NodoInterface[];
    index: number;
    año: number;
    progress: boolean;
    colors: number[];
}

export const ShowNodos = ( props: Props ) => {

    const [progreso, setProgreso] = useState<number[]>([])
    const [nodos, setNodos] = useState<NodoInterface[]>([])

    useEffect(() => {
        try {
            setNodos(props.nodos)
            const ids = nodos.map((item: NodoInterface) => item.id_nodo)
            getProgress(ids)
        } catch (e) {
            console.log(e)
        }
    }, [props.año, props.nodos, props.progress])

    const getProgress = (ids: string[]) => {
        let pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            pesosStr = '[]'
        
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        pesosNodo.forEach((item: PesosNodos) => {
            if (ids.includes(item.id_nodo)) {
                const { porcentajes } = item
                if (porcentajes) {
                    porcentajes.forEach((porcentaje: Porcentaje) => {
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
        <ul className=" tw-rounded tw-shadow-2xl
                        tw-bg-slate-200
                        tw-h-full
                        tw-w-1/3 tw-mx-6">
            {nodos.map((item: NodoInterface, index: number) => (
                <div className="tw-my-5 tw-flex">
                    <button className ={`tw-rounded
                                        tw-border-4
                                        ${(progreso[index]??0)*100 < props.colors[0] ? 'tw-border-red-400'   :
                                          (progreso[index]??0)*100 < props.colors[1] ? 'tw-border-yellow-400':
                                          (progreso[index]??0)*100 < props.colors[2] ? 'tw-border-green-400' : 'tw-border-blue-400'}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold
                                        tw-scale-100`}
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Descripcion}>
                        {(progreso[index]??0)*100}%
                    </button>
                    <button className ="tw-bg-red-300
                                        tw-h-8 tw-my-2
                                        tw-w-2/3
                                        tw-rounded-r-lg"
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Descripcion}>
                        <p>{item.Nombre}</p>
                    </button>
                </div>
            ))}
        </ul>
    );
}