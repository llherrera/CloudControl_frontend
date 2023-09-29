import React, { useState } from 'react'
import { Nodo } from '../../interfaces'
import { addNodoNivel } from '../../services/api'

export const NodoForm = ( props : any ) => {

    let id_nodo_gen : number = 1;
    const [data, setData] = useState([
        { id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`,
          Nombre: "", 
          Descripcion: "", 
          id_nivel: props.id, 
          Padre: props.Padre,
          Peso: 33.33
        },
        { id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`, 
          Nombre: "", 
          Descripcion: "", 
          id_nivel: props.id, 
          Padre: props.Padre,
          Peso: 33.33
        },
        { id_nodo: `${props.Padre ?? props.id}.${id_nodo_gen++}`, 
          Nombre: "", 
          Descripcion: "", 
          id_nivel: props.id, 
          Padre: props.Padre,
          Peso: 33.33
        }
    ] as Nodo[])

    let nodo = ({
        id_nodo: `${props.Padre ?? props.id}.${data.length + 1}`,
        Nombre: "",
        Descripcion: "",
        id_nivel: props.id,
        Padre: props.Padre,
        Peso: 0
    } as Nodo)

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
        let sum:number=0;
        data.map((e) => sum += Number(e.Peso));
        console.log(sum);
        
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
                className='grid grid-cols-12 m-5 '>
            <ul className='col-start-5 col-span-4'>
                {data.map(( e, index )=> 
                <div className='mb-3 px-3 p-2 bg-cyan-200 flex rounded'>
                    <li className="mx-3">
                        <input  type={"text"}
                                placeholder={`Nombre del nodo`}
                                id={"Nombre"}
                                name={"Nombre"}
                                value={e.Nombre}
                                className='rounded my-1 p-1'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                        <input  type={"text"}
                                placeholder="Descripción del Nodo"
                                id={"Descripcion"}
                                name={"Descripcion"}
                                value={e.Descripcion}
                                className='rounded my-1 p-1'
                                onChange={ (event) => handleInputFormChange(event, index) }/><br/>
                    </li>
                    <input  type="number"
                            placeholder='Peso'
                            id='Peso'
                            name='Peso'
                            value={e.Peso}
                            className='mx-4 w-1/2 h-7 rounded'
                            onChange={ (event) => handleInputFormChange(event, index) } />
                </div>
                )}
                <button className="bg-green-500 
                                   hover:bg-green-300 
                                   text-white font-bold 
                                   py-2 px-4 rounded mr-5" 
                        type='button'
                        onClick={agregarNodo}>Agregar Nodo</button>
                <button className="bg-red-500 
                                   hover:bg-red-300 
                                   text-white font-bold 
                                   py-2 px-4 rounded ml-5"
                        type='button'
                        onClick={eliminarNodo}>Eliminar Nodo</button>
            </ul>
            <input  type="submit"
                    value={"Guardar"}
                    className="row-start-5 col-start-6 col-span-2
                               bg-blue-500
                               hover:bg-blue-300 
                               text-white font-bold }
                               rounded
                               mt-5 mx-6 py-2"/>
        </form>
    )
}
