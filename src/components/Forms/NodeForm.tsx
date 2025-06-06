import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkAddNodes, thunkUpdateNodes } from '@/store/plan/thunks';
import { setMode } from "@/store/content/contentSlice";

import { NodeInterface, NodeFormProps } from '@/interfaces';
import { Box, CircularProgress } from '@mui/material';
import { notify } from "@/utils";

export const NodeForm = (props: NodeFormProps) => {
    const dispatch = useAppDispatch();
    const { parent, loadingNodes } = useAppSelector(store => store.plan);

    const [data, setData] = useState<NodeInterface[]>(
        props.nodes ?? [
            {
                id_node: `${parent ?? props.id}.1`,
                code: '',
                name: "",
                description: "",
                id_level: props.id,
                parent: parent,
                weight: 33.33
            },
            {
                id_node: `${parent ?? props.id}.2`,
                code: '',
                name: "",
                description: "",
                id_level: props.id,
                parent: parent,
                weight: 33.33
            },
            {
                id_node: `${parent ?? props.id}.2`,
                code: '',
                name: "",
                description: "",
                id_level: props.id,
                parent: parent,
                weight: 33.33
            }
        ]);

    const updateWeights = (newItems: NodeInterface[]): NodeInterface[] => {
        const weight = 100 / newItems.length;
        return newItems.map((item, i) => ({ ...item, weight, id_node: `${parent ?? props.id}.${i + 1}` }));
    };

    const addNode = () => {
        let newData = [...data, {
            id_node: ``,
            code: '',
            name: "",
            description: "",
            id_level: props.id,
            parent: parent,
            weight: 0
        }];
        setData(updateWeights(newData));
    };

    const deleteNode = () => {
        if (data.length > 1) {
            const newData = data.slice(0, data.length - 1);
            setData(updateWeights(newData));
        }
    };

    const handleInputFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: value };
        setData(newData);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let sum: number = 0;
        data.map((e) => sum += Number(e.weight));
        sum = parseFloat(sum.toFixed(2));

        if (sum !== 100) {
            alert('La suma de los pesos debe ser 100');
            return;
        }
        if (props.nodes != undefined) {
            dispatch(thunkUpdateNodes({ nodes: data, id_level: props.id }))
                .unwrap()
                .catch((error) => {
                    notify('Ocurrió un error', 'error');
                    console.log(error);
                })
                .finally(() => {
                    dispatch(setMode(false));
                });
        } else {
            dispatch(thunkAddNodes({ nodes: data, id_level: props.id }))
                .unwrap()
                .catch((error) => {
                    notify('Ocurrió un error', 'error');
                    console.log(error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tw-p-4 tw-space-y-4 tw-bg-gray-50 tw-rounded tw-shadow-md">
            <div className="tw-space-y-4">
                {data.map((node, index) => (
                    <div key={node.id_node} className="tw-bg-white tw-p-4 tw-rounded tw-shadow tw-border tw-space-y-3">
                        <div className="tw-flex tw-justify-between tw-items-center">
                            <h3 className="tw-font-semibold tw-text-gray-700">Nodo #{index + 1}</h3>
                            <span className="tw-text-sm tw-text-gray-400">{node.id_node}</span>
                        </div>
                        <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                            <div>
                                <label htmlFor={`name-${index}`} className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id={`name-${index}`}
                                    value={node.name}
                                    placeholder="Nombre del nodo"
                                    onChange={(e) => handleInputFormChange(e, index)}
                                    className="tw-mt-1 tw-w-full tw-border tw-rounded tw-px-2 tw-py-1 tw-text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor={`description-${index}`} className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    id={`description-${index}`}
                                    value={node.description}
                                    placeholder="Descripción del nodo"
                                    onChange={(e) => handleInputFormChange(e, index)}
                                    className="tw-mt-1 tw-w-full tw-border tw-rounded tw-px-2 tw-py-1 tw-text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor={`weight-${index}`} className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                    Peso
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    id={`weight-${index}`}
                                    value={node.weight}
                                    onChange={(e) => handleInputFormChange(e, index)}
                                    className="tw-mt-1 tw-w-full tw-border tw-rounded tw-px-2 tw-py-1 tw-text-sm"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tw-flex tw-justify-between">
                <button
                    type="button"
                    onClick={addNode}
                    className="tw-bg-green-600 hover:tw-bg-green-500 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded"
                >
                    Agregar Nodo
                </button>
                <button
                    type="button"
                    onClick={deleteNode}
                    className="tw-bg-red-600 hover:tw-bg-red-500 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded"
                >
                    Eliminar Nodo
                </button>
            </div>

            <button
                type="submit"
                className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-500 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
            >
                Guardar Nodos
            </button>
        </form>
    );
}
