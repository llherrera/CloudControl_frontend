import React, { useState } from 'react';

import { useAppSelector } from '@/store';

import { NodeInterface, NodeFormProps } from '../../interfaces';
import { addLevelNode } from '../../services/api';

export const NodeForm = ( props : NodeFormProps ) => {
    const { parent } = useAppSelector(store => store.plan);

    let id_nodo_gen : number = 1;
    const [data, setData] = useState<NodeInterface[]>([
        {   id_node: `${parent ?? props.id}.${id_nodo_gen++}`,
            name: "", 
            description: "", 
            id_level: props.id, 
            parent: parent,
            weight: 33.33
        },
        {   id_node: `${parent ?? props.id}.${id_nodo_gen++}`, 
            name: "", 
            description: "", 
            id_level: props.id, 
            parent: parent,
            weight: 33.33
        },
        {   id_node: `${parent ?? props.id}.${id_nodo_gen++}`, 
            name: "", 
            description: "", 
            id_level: props.id, 
            parent: parent,
            weight: 33.33
        }
    ]);

    let nodo: NodeInterface = ({
        id_node: `${parent ?? props.id}.${data.length + 1}`,
        name: "",
        description: "",
        id_level: props.id,
        parent: parent,
        weight: 0
    });

    const agregarNodo = () => {
        const newData = [...data, nodo];
        setData(newData);
        nodo = ({ 
            id_node: `${parent ?? props.id}.${newData.length + 1}`, 
            name: "", 
            description: "", 
            id_level: props.id, 
            parent: parent,
            weight: 100/data.length
        });
    };

    const eliminarNodo = () => {
        if (data.length > 1) {
            const newData = data.slice(0, data.length - 1);
            setData(newData);
            nodo = ({ 
                id_node: `${parent ?? props.id}.${newData.length }`, 
                name: "", 
                description: "", 
                id_level: props.id, 
                parent: parent,
                weight: 100/data.length
            });
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
        try {
            await addLevelNode(data, props.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form   onSubmit={handleSubmit}
                className='tw-mx-4'>
            <ul className=''>
                {data.map(( e: NodeInterface, index: number )=> 
                <div className='tw-mb-3 tw-p-1 tw-relative tw-shadow-lb tw-bg-gray-300 tw-border tw-flex tw-rounded'
                    key={e.id_node}>
                    <li className="tw-ml-3">
                        <input  type={"text"}
                                placeholder={`Nombre del nodo`}
                                id={"NodeName"}
                                name={"NodeName"}
                                value={e.name}
                                className='tw-rounded tw-my-1 tw-w-5/6 tw-border '
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <input  type={"text"}
                                placeholder="Descripción del Nodo"
                                id={"Description"}
                                name={"Description"}
                                value={e.description}
                                className='rounded my-1 tw-w-5/6 tw-border'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </li>
                    <input  type="number"
                            placeholder='Peso'
                            id='Weight'
                            name='Weight'
                            value={e.weight}
                            className=' tw-w-1/6 tw-absolute tw-border tw-right-4 tw-h-7 tw-rounded'
                            onChange={ (event) => handleInputFormChange(event, index) } />
                </div>
                )}
                <div className='tw-flex tw-justify-between'>
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300
                                        tw-text-white tw-font-bold
                                        tw-py-2 tw-px-1 tw-rounded tw-mr-5" 
                            type='button'
                            title='Agregar Nodo'
                            onClick={agregarNodo}>Agregar Nodo</button>
                    <button className=" tw-bg-red-500
                                        hover:tw-bg-red-300
                                        tw-text-white tw-font-bold
                                        tw-py-2 tw-rounded tw-ml-5"
                            type='button'
                            title='Eliminar Nodo'
                            onClick={eliminarNodo}>Eliminar Nodo</button>
                </div>
            </ul>
            <input  type="submit"
                    value={"Guardar"}
                    title='Guardar nodos en el nivel'
                    className=" tw-bg-blue-500
                                hover:tw-bg-blue-300 
                                tw-text-white tw-font-bold
                                tw-flex tw-justify-center
                                tw-rounded tw-w-full
                                tw-p-2 tw-mt-2"/>
        </form>
    );
}
