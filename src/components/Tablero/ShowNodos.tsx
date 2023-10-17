import React, { useState, useEffect } from 'react';
import { NodoInterface, ShowNodoProps, PesosNodos, Porcentaje } from '../../interfaces';

export const ShowNodos = ( props: ShowNodoProps ) => {

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
        <div className="col-start-1 col-span-3
                        border-r-4 border-gray-400">
            {nodos.map((item: NodoInterface, index: number) => (
                <div className="my-5 flex">
                    <button className ={`rounded-full
                                        ${(progreso[index]??0)*100 < props.colors[0] ? 'bg-red-400'   :
                                          (progreso[index]??0)*100 < props.colors[1] ? 'bg-yellow-400':
                                          (progreso[index]??0)*100 < props.colors[2] ? 'bg-green-400' : 'bg-blue-400'}
                                        ml-3
                                        w-12 h-12
                                        translate-x-3
                                        font-bold
                                        scale-100`}
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Descripcion}>
                        {(progreso[index]??0)*100}%
                    </button>
                    <button className ="bg-red-300
                                        h-8 my-2
                                        w-2/3
                                        rounded"
                            onClick={ (event) => handleButton(event, index)}
                            title={item.Descripcion}>
                        <p>{item.Nombre}</p>
                    </button>
                </div>
            ))}
        </div>
    );
}