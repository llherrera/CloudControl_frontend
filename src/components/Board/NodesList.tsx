import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetNodes } from '@/store/plan/thunks';
import { incrementLevelIndex, setParent, setProgressNodes, setFinancial } from '@/store/plan/planSlice';

import { NodoInterface, PesosNodos, Porcentaje, NodeListProps } from '@/interfaces';

export const NodesList = ( props : NodeListProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { nodes, yearSelect, levels, indexLevel, progressNodes, colorimeter } = useAppSelector(store => store.plan)

    useEffect(() => {
        const ids = nodes.map((item: NodoInterface) => item.id_node)
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
                    progreso.push(-1)
                    programacion.push(-1)
                    financiacion.push(-1)
                }
            }
        })
        dispatch(setProgressNodes(progreso))
        dispatch(setFinancial(financiacion))
    }

    const handleButton = ( index: number ) => {
        if ( indexLevel !== levels.length-1 ) {
            dispatch(setParent(nodes[index].id_node))
            dispatch(incrementLevelIndex(indexLevel!+1))
            dispatch(thunkGetNodes({id_level: nodes[index].id_level+1, parent:nodes[index].id_node}))
        } else {
            navigate(`/pdt/PlanIndicativo/Meta`, {state: {idPDT: props.id, idNodo: nodes[index].id_node}})
        }
    }

    return (
        <ul className={`${indexLevel === levels.length-1 ? 'tw-flex tw-flex-row tw-flex-wrap': 'tw-flex-col tw-flex-wrap'} `}>
            {nodes.map((item: NodoInterface, index: number) => {
                return(
                <div className="tw-my-2 tw-flex"
                    key={index}>
                    <button className={`tw-rounded
                                        tw-flex tw-justify-center tw-items-center
                                        tw-border-4
                                        ${
                                        progressNodes[index] < 0 ? 'tw-border-gray-400 hover:tw-border-gray-200' :
                                        (progressNodes[index])*100 < colorimeter[0] ? 'tw-border-redColory hover:tw-border-red-200'      :
                                        (progressNodes[index])*100 < colorimeter[1] ? 'tw-border-yellowColory hover:tw-border-yellow-200':
                                        (progressNodes[index])*100 < colorimeter[2] ? 'tw-border-greenColory hover:tw-border-green-200'  :
                                        'tw-border-blueColory hover:tw-border-blue-200'}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold`}
                            onClick={ () => handleButton(index)}
                            title={item.Description}>
                        { parseInt( ((progressNodes[index] === undefined || progressNodes[index] < 0 ? 0 : progressNodes[index])*100).toString())}%
                    </button>
                    {indexLevel !== levels.length-1 ?
                    <button className={`${
                                        progressNodes[index] < 0 ? 'tw-bg-gray-400 hover:tw-ring-8 hover:tw-ring-gray-200' :
                                        (progressNodes[index])*100 < colorimeter[0] ? 'tw-bg-redColory hover:tw-ring-8 hover:tw-ring-red-200'      :
                                        (progressNodes[index])*100 < colorimeter[1] ? 'tw-bg-yellowColory hover:tw-ring-8 hover:tw-ring-yellow-200':
                                        (progressNodes[index])*100 < colorimeter[2] ? 'tw-bg-greenColory hover:tw-ring-8 hover:tw-ring-green-200'  : 
                                        'tw-bg-blueColory hover:tw-ring-8 hover:tw-ring-blue-200'}
                                        tw-h-8 tw-my-2
                                        tw-w-2/3
                                        tw-rounded-r-lg
                                        tw-text-white tw-font-bold
                                        tw-font-montserrat`}
                            onClick={ () => handleButton(index)}
                            title={item.Description}>
                        <p>{item.NodeName}</p>
                    </button>
                    :null}
                </div>
            )})}
        </ul>
    );
}