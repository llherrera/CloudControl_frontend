import React, { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetSecretaries } from "@/store/plan/thunks";
import { setSecretary, setLocs, setCode } from "@/store/content/contentSlice";

import { getLatLngs, getNodesSecretary } from '@/services/api';
import { NodesSecretary } from "@/interfaces";
import { arrayToMapNodesSecre, calculateDepth } from '@/utils';

export const SecretarySelect = () => {
    const dispatch = useAppDispatch();

    const { secretaries } = useAppSelector(store => store.plan);
    const { id_plan, secretary, location,
        node_code } = useAppSelector(store => store.content);
    const [data, setData] = useState<NodesSecretary[]>([]);
    const [index, setIndex] = useState<number[]>([]);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined)
            dispatch(thunkGetSecretaries(id_plan));
    }, []);

    useEffect(() => {
        getLatLngs(id_plan, node_code, secretary, location)
            .then(res => dispatch(setLocs(res)));
    }, [secretary, node_code]);

    useEffect(() => {
        getNodesSecretary(id_plan, secretary)
            .then(res => {
                const res_ = arrayToMapNodesSecre(res);
                let arr = new Array(calculateDepth(res_)).fill(-1);
                setIndex(arr);
                setData(res_);
            });
    }, [secretary]);

    const handleChangeSecretary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSecretary(e.target.value));
    };

    const handleChangeNode = (e: React.ChangeEvent<HTMLSelectElement>, level: number) => {
        const { value, selectedIndex } = e.target;
        let newIndex = [...index];
        const selectIndex = selectedIndex - 1;
        newIndex[level] = selectIndex;
        for (let i = level + 1; i < newIndex.length; i++) newIndex[i] = -1;
        setIndex(newIndex);
        dispatch(setCode(value));
    };

    const renderSelects = (data: NodesSecretary[], index: number[], level = 0) => (
        <div key={level}>
            {data.length > 0 && (
                <select key={level}
                    onChange={e => handleChangeNode(e, level)}
                    className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-mb-3 tw-w-24">
                    <option value={data[index[level] == -1 ? 0 : index[level]].id_node.split('.').slice(0, -1).join('.')}>
                        Todas
                    </option>
                    {data.map(node =>
                        <option key={node.id_node} value={node.id_node}>
                            {node.name}
                        </option>
                    )}
                </select>
            )}
            {index[level] !== -1 &&
            data[index[level]].children &&
            renderSelects(data[index[level]].children ?? [], index, level + 1)}
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
                onChange={e => handleChangeSecretary(e)}
                className=" tw-border tw-border-gray-300
                                tw-rounded
                                tw-mr-3 tw-mb-3 tw-w-24">
                <option value='void'></option>
                {secretaries && secretaries.map(sec =>
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
    );
}