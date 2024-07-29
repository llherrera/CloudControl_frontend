import React, { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetSecretaries } from "@/store/plan/thunks";
import { setSecretary, setLocs } from "@/store/content/contentSlice";

import { getLatLngs, getNodesSecretary } from '@/services/api';
import { NodesSecretary } from "@/interfaces";

export const SecretarySelect = () => {
    const dispatch = useAppDispatch();

    const { secretaries } = useAppSelector(store => store.plan);
    const {
        id_plan,
        secretary,
        location,
        node_code } = useAppSelector(store => store.content);
    const [data, setData] = useState<NodesSecretary[]>([]);
    const [index, setIndex] = useState<number[]>([]);

    useEffect(() => {
        if (id_plan != 0 && secretaries.length === 0)
            dispatch(thunkGetSecretaries(id_plan));
    }, []);

    useEffect(() => {
        getLatLngs(node_code, secretary, location)
        .then(res => {
            dispatch(setLocs(res));
        });
    }, [secretary]);

    useEffect(() => {
        getNodesSecretary(id_plan, secretary)
        .then(res => {
            let arr = new Array(calculateDepth(res)).fill(0);
            setIndex(arr);
            setData(res);
        });
    }, [secretary]);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSecretary(e.target.value));
    };

    function calculateDepth(nodes: NodesSecretary[], nodeId: string | null = null): number {
        let maxDepth = 0;
    
        function dfs(currentNode: NodesSecretary, depth: number) {
            maxDepth = Math.max(maxDepth, depth);
    
            if (currentNode.children) {
                for (const child of currentNode.children) {
                    dfs(child, depth + 1);
                }
            }
        }
    
        if (nodeId === null) {
            // Calcular la profundidad para todo el árbol
            for (const node of nodes) {
                dfs(node, 1);
            }
        } else {
            // Calcular la profundidad para un nodo específico
            const node = nodes.find((n) => n.id_node === nodeId);
            if (node) {
                dfs(node, 1);
            }
        }
    
        return maxDepth;
    }

    const renderSelects = (data: NodesSecretary[], index: number[], level = 0) => (
        <div key={level}>
            {data.length > 0 && (
                <select key={level}
                        className=" tw-border tw-border-gray-300
                                    tw-rounded
                                    tw-mr-3 tw-mb-3 tw-w-24">
                    <option value="">Todas</option>
                    {data.map((node) => (
                        <option key={node.id_node} value={node.id_node}>
                          {node.name}
                        </option>
                    ))}
                </select>
            )}
            {data[index[level]].children && renderSelects(data[index[level]].children ?? [], index, level + 1)}
        </div>
    );

    return (
        <div className="tw-flex tw-flex-col tw-mb-3">
            <p className='  tw-mb-3 tw-p-1 tw-text-center
                            tw-inline-block tw-bg-white
                            tw-rounded tw-font-bold'>
                Secretarias
            </p>
            <select value={secretary} 
                    onChange={(e)=>handleChangeSecretary(e)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-mb-3 tw-w-24">
                <option value='void'></option>
                {secretaries.map(sec =>
                    <option
                        value={sec.name}
                        key={sec.name}>
                        {sec.name}
                    </option>
                )}
                <option value=''>Todas</option>
            </select>
            
            <p className='  tw-mb-3 tw-p-1 tw-text-center
                            tw-inline-block tw-bg-white
                            tw-rounded tw-font-bold'>
                Plan
            </p>
            {data.length > 0 ? renderSelects(data, index) : null}
        </div>
    )
}
/*
<select name="" id="">
                {data.map(d => <option key={d.id_node} value={d.id_node}>{d.name}</option>)}
            </select>
            <select name="" id="">
                {data[0] === undefined ? null : data[0].children?.map(d => <option key={d.id_node} value={d.id_node}>{d.name}</option>)}
            </select>
            <select name="" id="">
                {data[0] === undefined ? null : data[0].children![0] === undefined ? null : data[0].children![0].children?.map(d => <option key={d.id_node} value={d.id_node}>{d.name}</option>)}
            </select>
            <select name="" id="">
                {data[0] === undefined ? null : data[0].children![0] === undefined ? null : data[0].children![0].children![0] === undefined ? null : data[0].children![0].children![0].children?.map(d => <option key={d.id_node} value={d.id_node}>{d.name}</option>)}
            </select>
*/