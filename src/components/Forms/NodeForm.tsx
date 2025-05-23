import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkAddNodes, thunkUpdateNodes } from '@/store/plan/thunks';
import { setMode } from "@/store/content/contentSlice";

import { NodeInterface, NodeFormProps } from '@/interfaces';
import { Box, CircularProgress } from '@mui/material';
import { notify } from "@/utils";

export const NodeForm = ( props : NodeFormProps ) => {
    const dispatch = useAppDispatch();
    const { parent, loadingNodes } = useAppSelector(store => store.plan);

    const [data, setData] = useState<NodeInterface[]>(
        props.nodes??[
        {   id_node: `${parent ?? props.id}.1`,
            code: '',
            name: "",
            description: "",
            id_level: props.id,
            parent: parent,
            weight: 33.33
        },
        {   id_node: `${parent ?? props.id}.2`,
            code: '',
            name: "",
            description: "",
            id_level: props.id,
            parent: parent,
            weight: 33.33
        },
        {   id_node: `${parent ?? props.id}.2`,
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
        return newItems.map((item, i) => ({ ...item, weight, id_node: `${parent ?? props.id}.${i+1}` }));
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
        let sum: number=0;
        data.map((e) => sum += Number(e.weight));
        sum = parseFloat(sum.toFixed(2));
        
        if (sum !== 100) {
            alert('La suma de los pesos debe ser 100');
            return;
        }
        if (props.nodes != undefined) {
            dispatch(thunkUpdateNodes({nodes: data, id_level: props.id}))
            .unwrap()
            .catch((error) => {
                notify('Ocurrió un error', 'error');
                console.log(error);
            })
            .finally(() => {
                dispatch(setMode(false));
            });
        } else {
            dispatch(thunkAddNodes({nodes: data, id_level: props.id}))
            .unwrap()
            .catch((error) => {
                notify('Ocurrió un error', 'error');
                console.log(error);
            });
        }
    };

    return (
        <form   onSubmit={handleSubmit}
                className='tw-mx-4'>
            <ul className=''>
                {data.map(( e: NodeInterface, index: number )=> 
                <li className='tw-mb-3 tw-p-1 tw-relative tw-shadow-lb tw-bg-gray-300 tw-border tw-flex tw-rounded'
                    key={e.id_node}>
                    <div className="tw-ml-3">
                        <input  type={"text"}
                                placeholder={`Nombre del nodo`}
                                id={"name"}
                                name={"name"}
                                value={e.name}
                                className='tw-rounded tw-my-1 tw-w-5/6 tw-border '
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <input  type={"text"}
                                placeholder="Descripción del Nodo"
                                id={"description"}
                                name={"description"}
                                value={e.description}
                                className='rounded my-1 tw-w-5/6 tw-border'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </div>
                    <input  type="number"
                            placeholder='Peso'
                            id='weight'
                            name='weight'
                            value={e.weight}
                            className=' tw-w-1/6 tw-absolute tw-border tw-right-4 tw-h-7 tw-rounded'
                            onChange={ (event) => handleInputFormChange(event, index) } />
                </li>
                )}
                <div className='tw-flex tw-justify-between'>
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300
                                        tw-text-white tw-font-bold
                                        tw-py-2 tw-px-1 tw-rounded tw-mr-5" 
                            type='button'
                            title='Agregar Nodo'
                            onClick={addNode}>Agregar Nodo</button>
                    <button className=" tw-bg-red-500
                                        hover:tw-bg-red-300
                                        tw-text-white tw-font-bold
                                        tw-py-2 tw-rounded tw-ml-5"
                            type='button'
                            title='Eliminar Nodo'
                            onClick={deleteNode}>Eliminar Nodo</button>
                </div>
            </ul>
            <div>
                {loadingNodes ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box> :
                <input  type="submit"
                        value={"Guardar"}
                        title='Guardar nodos en el nivel'
                        className=" tw-bg-blue-500
                                    hover:tw-bg-blue-300 
                                    tw-text-white tw-font-bold
                                    tw-flex tw-justify-center
                                    tw-rounded tw-w-full
                                    tw-p-2 tw-mt-2"/>
                }
            </div>
        </form>
    );
}
