import React, { useState } from 'react'
import { NodoInterface } from '../../interfaces'
import { addNodoNivel } from '../../services/api'

interface Props {
    index: number;
    id: number;
    Padre: string | null;
    callback: (index: number, Padre: (string | null)) => void;
}

export const NodoForm = ( props : Props ) => {

    let id_nodo_gen : number = 1;
    const [data, setData] = useState<NodoInterface[]>([
        {   id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`,
            Nombre: "", 
            Descripcion: "", 
            id_nivel: props.id, 
            Padre: props.Padre,
            Peso: 33.33
        },
        {   id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`, 
            Nombre: "", 
            Descripcion: "", 
            id_nivel: props.id, 
            Padre: props.Padre,
            Peso: 33.33
        },
        {   id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`, 
            Nombre: "", 
            Descripcion: "", 
            id_nivel: props.id, 
            Padre: props.Padre,
            Peso: 33.33
        }
    ])

    let nodo: NodoInterface = ({
        id_nodo: `${props.Padre ?? props.id}.${data.length + 1}`,
        Nombre: "",
        Descripcion: "",
        id_nivel: props.id,
        Padre: props.Padre,
        Peso: 0
    })

    const agregarNodo = () => {
        const newData = [...data, nodo];
        setData(newData);
        nodo = ({ 
            id_nodo: `${props.Padre ?? props.id}.${newData.length + 1}`, 
            Nombre: "", 
            Descripcion: "", 
            id_nivel: props.id, 
            Padre: props.Padre,
            Peso: 100/data.length
        });
    }

    const eliminarNodo = () => {
        if (data.length > 1) {
            const newData = data.slice(0, data.length - 1);
            setData(newData);
            nodo = ({ 
                id_nodo: `${props.Padre ?? props.id}.${newData.length }`, 
                Nombre: "", 
                Descripcion: "", 
                id_nivel: props.id, 
                Padre: props.Padre,
                Peso: 100/data.length
            });
        }
    }

    const handleInputFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: value };
        setData(newData);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let sum: number=0;
        data.map((e) => sum += Number(e.Peso));
        
        if (sum !== 100) {
            alert('La suma de los pesos debe ser 100')
            return
        }
        try {
            await addNodoNivel(data)
            props.callback(props.index -1, props.Padre)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form   onSubmit={handleSubmit}
                className='tw-mx-4'>
            <ul className=''>
                {data.map(( e: NodoInterface, index: number )=> 
                <div className='tw-mb-3 tw-p-1 tw-relative tw-bg-cyan-200 tw-flex tw-rounded'>
                    <li className="tw-ml-3">
                        <input  type={"text"}
                                placeholder={`Nombre del nodo`}
                                id={"Nombre"}
                                name={"Nombre"}
                                value={e.Nombre}
                                className='tw-rounded tw-my-1 tw-w-5/6'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <input  type={"text"}
                                placeholder="Descripción del Nodo"
                                id={"Descripcion"}
                                name={"Descripcion"}
                                value={e.Descripcion}
                                className='rounded my-1 tw-w-5/6'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </li>
                    <input  type="number"
                            placeholder='Peso'
                            id='Peso'
                            name='Peso'
                            value={e.Peso}
                            className=' tw-w-1/6 tw-absolute tw-right-4 tw-h-7 tw-rounded'
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
    )
}
