import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetNodes } from '@/store/plan/thunks';
import { incrementLevelIndex, setParent, setProgressNodes, setFinancial } from '@/store/plan/planSlice';

import { Node, NodoInterface, PesosNodos, Porcentaje } from '@/interfaces';

interface Props {
    id: number;
    nodes: NodoInterface[];
    colors: number[];
}

export const NodesList = ( props : Props ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { nodes, yearSelect, levels, indexLevel, progressNodes } = useAppSelector(store => store.plan)

    useEffect(() => {
        const ids = nodes.map((item: Node) => item.id_nodo)
        getProgress(ids)
    }, [yearSelect, nodes])

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
        let financiacion = [] as number[]
        pesosNodo.forEach((item: PesosNodos) => {
            if (ids.includes(item.id_nodo)) {
                const { porcentajes } = item
                if (porcentajes) {
                    porcentajes.forEach((porcentaje: Porcentaje) => {
                        if (porcentaje.año === yearSelect) {
                            progreso.push(porcentaje.progreso)
                            programacion.push(porcentaje.programacion)
                            financiacion.push(porcentaje.ejecucionFinanciera)
                        }
                    })
                }else {
                    progreso.push(0)
                    programacion.push(0)
                    financiacion.push(0)
                }
            }
        })
        dispatch(setProgressNodes(progreso))
        dispatch(setFinancial(financiacion))
    }

    const handleButton = ( index: number ) => {
        if ( indexLevel !== levels.length-1 ) {
            dispatch(setParent(nodes[index].id_nodo))
            dispatch(incrementLevelIndex(indexLevel!+1))
            dispatch(thunkGetNodes({id_level: nodes[index].id_nivel+1, parent:nodes[index].id_nodo}))
        } else {
            navigate(`/pdt/${props.id}/${nodes[index].id_nodo}`)
        }
    }

    return (
        <ul className={`${indexLevel === levels.length-1 ? 'tw-flex tw-flex-row tw-flex-wrap': 'tw-flex-col tw-flex-wrap'} `}>
            {nodes.map((item: Node, index: number) => {
                return(
                <div className="tw-my-2 tw-flex"
                    key={index}>
                    <button className={`tw-rounded
                                        tw-flex tw-justify-center tw-items-center
                                        tw-border-4
                                        ${(progressNodes[index])*100 < props.colors[0] && (progressNodes[index])*100 >= 0 ? 'tw-border-redColory'   :
                                        (progressNodes[index])*100 <   props.colors[1] ? 'tw-border-yellowColory':
                                        (progressNodes[index])*100 <   props.colors[2] ? 'tw-border-greenColory' : 
                                        (progressNodes[index])*100 <=  props.colors[3] ? 'tw-border-blueColory'  : 'tw-border-gray-400'}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold`}
                            onClick={ () => handleButton(index)}
                            title={item.Descripcion}>
                        { parseInt( ((progressNodes[index]??0)*100).toString())}%
                    </button>
                    {indexLevel !== levels.length-1 ?
                    <button className={`${(progressNodes[index])*100 < props.colors[0] ? 'tw-bg-redColory'   :
                                        (progressNodes[index])*100 <   props.colors[1] ? 'tw-bg-yellowColory':
                                        (progressNodes[index])*100 <   props.colors[2] ? 'tw-bg-greenColory' : 
                                        (progressNodes[index])*100 <=  props.colors[3] ? 'tw-bg-blueColory'  : 'tw-bg-gray-400'}
                                        tw-h-8 tw-my-2
                                        tw-w-2/3
                                        tw-rounded-r-lg
                                        tw-text-white tw-font-bold
                                        tw-font-montserrat`}
                            onClick={ () => handleButton(index)}
                            title={item.Descripcion}>
                        <p>{item.Nombre}</p>
                    </button>
                    :null}
                </div>
            )})}
        </ul>
    );
}