import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetNodes, thunkUpdateWeight } from '@/store/plan/thunks';
import { incrementLevelIndex, setParent, setProgressNodes, setCalcDone,
        setFinancial, AddRootTree } from '@/store/plan/planSlice';
import { setNode } from "@/store/content/contentSlice";

import { NodeInterface, NodesWeight, Percentages, IdProps } from '@/interfaces';
import { Spinner } from '@/assets/icons';
import { decode, notify } from "@/utils";

export const NodesList = ( props : IdProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);
    const { nodes, yearSelect, levels, indexLevel, progressNodes, calcDone,
        colorimeter, loadingNodes, rootTree, plan } = useAppSelector(store => store.plan);
    const { mode } = useAppSelector(store => store.content);
    const [ pesos, setPesos ] = useState<number[]>(nodes.map((item: NodeInterface) => item.weight));

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    if (plan == undefined) return <>Plan no definido</>;

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
        }
    }, []);

    useEffect(() => {
        if (!calcDone) return;
        getProgress();
    }, [yearSelect, nodes, calcDone]);

    const getProgress = () => {
        const pesosStr = localStorage.getItem('UnitNode');
        if (pesosStr == undefined) return 0;
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

        nodes_s.sort((a,b) => a.id_node < b.id_node ? -1 : 1);
        nodes_s.sort((a,b) => a.id_node.length - b.id_node.length);

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
            dispatch(setCalcDone(false));
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
        if (acmu !== 100) return notify('La suma de los pesos debe ser 100', 'warning');
        const ids = nodes.map((item) => item.id_node);
        dispatch(thunkUpdateWeight({ids: ids, weights: pesos}));
    };

    const colorClass = (index: number) => (
        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ?
        'tw-border-gray-400 group-hover:tw-border-gray-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ?
        'tw-border-redColory group-hover:tw-border-red-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ?
        'tw-border-yellowColory group-hover:tw-border-yellow-200':
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ?
        'tw-border-greenColory group-hover:tw-border-green-200':
        'tw-border-blueColory group-hover:tw-border-blue-200'
    );

    const colorClass_ = (index: number) => (
        parseInt( ((progressNodes[index]??0)*100).toString()) < 0 ?
        'tw-bg-gray-400 group-hover:tw-bg-gray-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[0] ?
        'tw-bg-redColory group-hover:tw-bg-red-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[1] ?
        'tw-bg-yellowColory group-hover:tw-bg-yellow-200' :
        parseInt( ((progressNodes[index]??0)*100).toString()) < colorimeter[2] ?
        'tw-bg-greenColory group-hover:tw-bg-green-200' :
        'tw-bg-blueColory group-hover:tw-bg-blue-200'
    );

    const handleClickResult = () => {
        dispatch(setCalcDone(false));
        navigate('/pdt/PlanIndicativo/MetaResultado');
    };

    const HandleShowList = () => loadingNodes ?
        <Spinner />
        : <>
        <ul className={`${indexLevel === levels.length-1 ?
                        'tw-flex tw-flex-row tw-flex-wrap':
                        'tw-flex-col tw-flex-wrap'} tw-overflow-hidden tw-mt-4`} >
            {nodes.map((item: NodeInterface, index: number) =>
                <div className="tw-my-2 tw-ml-12 tw-py-1 tw-flex tw-transition hover:tw-scale-110 tw-group"
                    key={item.id_node}>
                    <button className={`${plan.shape === 'radial' ? 'tw-rounded' : 'tw-rounded-full tw-overflow-hidden tw-scale-[1.2]'} tw-border-4 tw-bg-transparent
                                        ${colorClass(index)}
                                        tw-ml-3 tw-z-10
                                        tw-w-12 tw-h-12
                                        tw-font-bold tw-overflow-hidden
                                        tw-relative`}
                            onClick={ () => handleButton(index)}
                            title={`${item.description} ${indexLevel !== levels.length-1 ? '' : `\n${item.code.replace(/(\.\d+)(?=\.)/, '')}\n${item.responsible}`}`}>
                        <div className='tw-absolute tw-inset-0 tw-z-20
                                        tw-rounded-full tw-bg-transparent tw-text-black
                                        tw-flex tw-justify-center tw-items-center'>
                            { Math.round( ((progressNodes[index] === undefined || progressNodes[index] < 0 ? 0 : progressNodes[index])*100))}%
                        </div>
                        {plan.fill === 'vertical' ?
                            <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-transition-all ${colorClass_(index)}`}
                                style={{
                                    height: `${ parseInt( ((progressNodes[index] === undefined || progressNodes[index] < 0 ? 0 : progressNodes[index])*100).toString())}%`,
                                }}
                            /> :
                        plan.fill === 'radial' ?
                            <div className={`tw-absolute tw-inset-0
                                            ${colorClass_(index)}
                                            tw-text-black tw-z-10`}
                                style={{
                                    maskImage: `conic-gradient(from 0deg at 50% 50%, blue 0deg,
                                                blue ${parseInt( ((progressNodes[index] === undefined || progressNodes[index] < 0 ? 0 : progressNodes[index])*100).toString())/100*360}deg,
                                                transparent 0deg)`,
                                }}
                            /> :
                            plan.fill === 'completo' ?
                                <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-full tw-transition-all ${colorClass_(index)}`}/>
                            : null
                        }
                    </button>
                    {indexLevel !== levels.length-1 ?
                    <button className={`${colorClass_(index)}
                                        tw-h-8 tw-my-2 tw-w-2/3
                                        tw-rounded-r-lg
                                        tw-text-white tw-font-bold tw-text-center
                                        tw-font-montserrat`}
                            onClick={ () => handleButton(index)}
                            title={item.description}>
                        <p className='tw-truncate group-hover:tw-text-black'>
                            {item.name}
                        </p>
                    </button>
                    :null}
                    {rol === 'admin' || (rol === 'funcionario' && id === props.id) ?
                        <input  className={`tw-px-2 tw-mx-2 tw-w-16
                                            tw-border tw-rounded
                                            ${mode ? '' : 'tw-hidden'}`}
                                type='number'
                                placeholder='peso'
                                value={ isNaN(pesos[index]) ? 0 : pesos[index]}
                                onChange={e => handleUpdateWeight(index, e)}/>
                    :null}
                </div>
            )}
            {/*mode && (rol === 'admin' || (rol === 'funcionario' && id === props.id)) ?
            <div className='tw-flex tw-justify-center'>
                <button className='tw-px-2 tw-mx-2
                                    tw-bg-greenBtn tw-text-white
                                    tw-font-bold
                                    tw-border tw-rounded'
                        onClick={hangleSubmitUpdateWeight}>
                    Guardar
                </button>
            </div>
            : null*/}
        </ul>
        {indexLevel === levels.length-1 ?
        <div className='tw-flex tw-justify-center tw-mx-3
                        tw-border-t tw-border-slate-500'>
            <button
                title="Metas de resultado"
                className=' tw-mx-2 tw-p-2 tw-mt-2
                            tw-bg-redBtn hover:tw-bg-red-200
                            tw-rounded-full
                            tw-font-bold tw-text-white'
                onClick={() => handleClickResult()}>
                Metas de resultado
            </button>
        </div>
        :null}
        </>
    ;

    return <div>
        {nodes.length === 0 ? null : <HandleShowList/>}
    </div>
}