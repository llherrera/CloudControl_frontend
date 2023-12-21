import {useEffect } from 'react';
import {useNavigate } from "react-router-dom";

import {useAppSelector, useAppDispatch } from "@/store";
import {thunkGetNodes } from '@/store/plan/thunks';
import {incrementLevelIndex, 
        setParent, 
        setProgressNodes, 
        setFinancial } from '@/store/plan/planSlice';
import { setNode } from "@/store/content/contentSlice";

import {NodoInterface, 
        PesosNodos, 
        Porcentaje, 
        NodeListProps } from '@/interfaces';

export const NodesList = ( props : NodeListProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { nodes, 
            yearSelect, 
            levels, 
            indexLevel, 
            progressNodes, 
            colorimeter } = useAppSelector(store => store.plan);
    const { mode } = useAppSelector(store => store.content);

    useEffect(() => {
        const ids = nodes.map((item: NodoInterface) => item.id_node);
        getProgress(ids);
    }, [yearSelect, nodes]);

    const getProgress = (ids: string[]) => {
        const pesosStr = localStorage.getItem('pesosNodo');
        if (pesosStr == undefined) 
            return 0;
        let pesosNodo = [];
        try {
            pesosNodo = JSON.parse(pesosStr as string);            
        } catch (error) {
            pesosNodo = [];
        }
        let progreso = [] as number[];
        let programacion = [] as number[];
        let financiacion = [] as number[];
        pesosNodo.forEach((item: PesosNodos) => {
            if (ids.includes(item.id_node)) {
                const { percents } = item;
                if (percents) {
                    percents.forEach((porcentaje: Porcentaje) => {
                        if (porcentaje.year === yearSelect) {
                            progreso.push(porcentaje.progress);
                            programacion.push(porcentaje.physical_programming);
                            financiacion.push(porcentaje.financial_execution);
                        }
                    });
                }else {
                    progreso.push(-1);
                    programacion.push(-1);
                    financiacion.push(-1);
                }
            }
        });
        dispatch(setProgressNodes(progreso));
        dispatch(setFinancial(financiacion));
    };

    const handleButton = ( index: number ) => {
        if ( indexLevel !== levels.length-1 ) {
            dispatch(setParent(nodes[index].id_node));
            dispatch(incrementLevelIndex(indexLevel!+1));
            dispatch(thunkGetNodes({id_level: nodes[index].id_level+1, parent:nodes[index].id_node}));
        } else {
            dispatch(setNode(nodes[index]));
            navigate(`/pdt/PlanIndicativo/Meta`, {state: {idPDT: props.id, idNodo: nodes[index].id_node}});
        }
    };

    return (
        <ul className={`${indexLevel === levels.length-1 ? 'tw-flex tw-flex-row tw-flex-wrap':
                        'tw-flex-col tw-flex-wrap'} `}>
            {nodes.map((item: NodoInterface, index: number) => {
                return(
                <div className="tw-my-2 tw-flex tw-transition hover:tw-scale-110"
                    key={index}>
                    <button className={`tw-rounded
                                        tw-flex tw-justify-center tw-items-center
                                        tw-border-4
                                        ${
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ? 
                                        'tw-border-gray-400 hover:tw-border-gray-200' :
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ? 
                                        'tw-border-redColory hover:tw-border-red-200' :
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ?
                                        'tw-border-yellowColory hover:tw-border-yellow-200':
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ? 
                                        'tw-border-greenColory hover:tw-border-green-200':
                                        'tw-border-blueColory hover:tw-border-blue-200'}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold`}
                            onClick={ () => handleButton(index)}
                            title={item.description}>
                        { parseInt( ((progressNodes[index] === undefined || 
                            progressNodes[index] < 0 ? 0 : progressNodes[index])*100).toString())}%
                    </button>
                    {indexLevel !== levels.length-1 ?
                    <button className={`${
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ? 'tw-bg-gray-400 hover:tw-bg-gray-200' :
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ? 'tw-bg-redColory hover:tw-bg-red-200'      :
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ? 'tw-bg-yellowColory hover:tw-bg-yellow-200':
                                        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ? 'tw-bg-greenColory hover:tw-bg-green-200'  : 
                                        'tw-bg-blueColory hover:tw-ring-blue-200'}
                                        tw-h-8 tw-my-2
                                        tw-w-2/3
                                        tw-rounded-r-lg
                                        tw-text-white tw-font-bold
                                        tw-font-montserrat`}
                            onClick={ () => handleButton(index)}
                            title={item.description}>
                        <p>{item.name}</p>
                    </button>
                    :null}
                    {mode ? 
                    <input  className=' tw-px-2 tw-mx-2 
                                        tw-border tw-rounded
                                        tw-w-12'
                            placeholder='peso'
                            value={item.weight}/> 
                    : null}
                </div>
            )})}
        </ul>
    );
}