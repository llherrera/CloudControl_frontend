import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import {useAppSelector, useAppDispatch } from "@/store";
import {thunkGetNodes, thunkUpdateWeight } from '@/store/plan/thunks';
import {incrementLevelIndex, 
        setParent, 
        setProgressNodes, 
        setFinancial,
        AddRootTree } from '@/store/plan/planSlice';
import { setNode } from "@/store/content/contentSlice";

import {NodeInterface, 
        NodesWeight, 
        Percentages, 
        NodeListProps } from '@/interfaces';
import { Spinner } from '@/assets/icons';
import { decode } from "@/utils";

export const NodesList = ( props : NodeListProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);
    const { nodes, 
            yearSelect, 
            levels, 
            indexLevel, 
            progressNodes, 
            colorimeter,
            loadingNodes,
            rootTree } = useAppSelector(store => store.plan);
    const { mode } = useAppSelector(store => store.content);
    const [ pesos, setPesos ] = useState<number[]>(
        nodes.map((item: NodeInterface) => item.weight)
    );

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
        }
    }, []);

    useEffect(() => {
        getProgress();
    }, [yearSelect, nodes]);

    const getProgress = () => {
        const pesosStr = localStorage.getItem('UnitNode');
        if (pesosStr == undefined) 
            return 0;
        let pesosNodo = [];
        try {
            pesosNodo = JSON.parse(pesosStr);            
        } catch (error) {
            pesosNodo = [];
        }
        let progreso = [] as number[];
        let programacion = [] as number[];
        let financiacion = [] as number[];
        let nodes_s: NodesWeight[] = pesosNodo.filter((itemFull: NodesWeight) => 
            nodes.some(itemFilter => itemFilter.id_node === itemFull.id_node));

        nodes_s.sort((a,b) => a.id_node < b.id_node ? -1 : 1)
        nodes_s.sort((a,b)=>a.id_node.length - b.id_node.length)

        nodes_s.forEach((item: NodesWeight) => {
            const { percents } = item;
            if (percents) {
                percents.forEach((percentages: Percentages) => {
                    if (percentages.year === yearSelect) {
                        progreso.push(percentages.progress);
                        programacion.push(percentages.physical_programming);
                        financiacion.push(percentages.financial_execution);
                    }
                });
            }else {
                progreso.push(-1);
                programacion.push(-1);
                financiacion.push(-1);
            }
        });
        const weights = nodes_s.map((item: NodesWeight) => item.weight);
        dispatch(setProgressNodes(progreso));
        dispatch(setFinancial(financiacion));
        setPesos(weights);
    };

    const handleButton = ( index: number ) => {
        let name = [nodes[index].name, levels[indexLevel].name];
        let newRoot = [...rootTree];
        newRoot.push(name);
        dispatch(AddRootTree(newRoot));
        if ( indexLevel !== levels.length-1 ) {
            dispatch(setParent(nodes[index].id_node));
            dispatch(incrementLevelIndex(indexLevel+1));
            dispatch(thunkGetNodes({id_level: nodes[index].id_level+1, parent:nodes[index].id_node}));
        } else {
            dispatch(setNode(nodes[index]));
            navigate(`/pdt/PlanIndicativo/Meta`, {state: {idPDT: props.id, idNodo: nodes[index].id_node}});
        }
    };

    const handleUpdateWeight = ( index: number, e: React.ChangeEvent<HTMLInputElement> ) => {
        const value = parseInt(e.target.value);
        const newNodes = [...pesos];
        newNodes[index] = value;
        setPesos(newNodes);
    };

    const hangleSubmitUpdateWeight = () => {
        const acmu = pesos.reduce((a, b) => a + b, 0);
        if (acmu !== 100) 
            return alert('La suma de los pesos debe ser 100');
        const ids = nodes.map((item) => item.id_node);
        dispatch(thunkUpdateWeight({ids: ids, weights: pesos}));
    };

    const colorClass = (index: number) => (
        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ? 
        'tw-border-gray-400 hover:tw-border-gray-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ? 
        'tw-border-redColory hover:tw-border-red-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ?
        'tw-border-yellowColory hover:tw-border-yellow-200':
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ? 
        'tw-border-greenColory hover:tw-border-green-200':
        'tw-border-blueColory hover:tw-border-blue-200'
    );

    const colorClass_ = (index: number) => (
        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ? 
        'tw-bg-gray-400 hover:tw-bg-gray-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ? 
        'tw-bg-redColory hover:tw-bg-red-200'      :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ? 
        'tw-bg-yellowColory hover:tw-bg-yellow-200':
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ? 
        'tw-bg-greenColory hover:tw-bg-green-200'  : 
        'tw-bg-blueColory hover:tw-ring-blue-200'
    );

    const HandleShowList = () => loadingNodes ?
        <Spinner />
        :<ul className={`${indexLevel === levels.length-1 ? 
                        'tw-flex tw-flex-row tw-flex-wrap':
                        'tw-flex-col tw-flex-wrap'} `} >
            {nodes.map((item: NodeInterface, index: number) => (
                <div className="tw-my-2 tw-flex tw-transition hover:tw-scale-110"
                    key={item.id_node}>
                    <button className={`tw-rounded
                                        tw-flex tw-justify-center tw-items-center
                                        tw-border-4
                                        ${colorClass(index)}
                                        tw-ml-3
                                        tw-w-12 tw-h-12
                                        tw-font-bold`}
                            onClick={ () => handleButton(index)}
                            title={item.description}>
                        { parseInt( ((progressNodes[index] === undefined || 
                            progressNodes[index] < 0 ? 0 : progressNodes[index])*100).toString())}%
                    </button>
                    {indexLevel !== levels.length-1 ?
                    <button className={`${colorClass_(index)}
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
                    {rol === 'admin' || (rol === 'funcionario' && id === props.id) ?
                        <input  className={`tw-px-2 tw-mx-2 
                                        tw-border tw-rounded
                                        tw-w-12
                                        ${mode ? '' : 'tw-hidden'}`}
                                        type='number'
                                        placeholder='peso'
                                        value={ isNaN(pesos[index]) ? 0 : pesos[index]}
                                        onChange={(e)=>handleUpdateWeight(index, e)}/> 
                    :null}
                </div>
            ))}
            {mode && (rol === 'admin' || (rol === 'funcionario' && id === props.id))?
            <div className='tw-flex tw-justify-center'>
                <button className='tw-px-2 tw-mx-2 
                                    tw-bg-greenBtn tw-text-white
                                    tw-font-bold
                                    tw-border tw-rounded'
                        onClick={hangleSubmitUpdateWeight}>
                    Guardar
                </button>
            </div>:null}
        </ul>
    ;

    return <div>
        {nodes.length === 0 ? null : <HandleShowList/>}
    </div>
}