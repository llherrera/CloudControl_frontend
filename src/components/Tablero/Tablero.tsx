import React, { useState } from 'react'
import { Content } from './Content';
import { Nivel } from '../../interfaces';
import { useParams } from 'react-router-dom';

export const Tablero = ( { data } : { data : Nivel[] } ) => {
    const { id } = useParams();

    const [index, setIndex] = useState(0);
    const [Padre, setPadre] = useState();

    const setData = (index: number, padre: any) => {
        if (index < data.length && index >= 0) {
            setIndex(index)
            setPadre(padre)
        }
    }

    return (
        <div className="container mx-auto my-3
                        bg-gray-200
                        grid grid-cols-12
                        content-center
                        border-8 border-gray-400 rounded-md ">
            <div className='flex 
                            col-start-1 col-span-full
                            justify-between
                            px-3 mt-4
                            shadow-2xl
                            border-b-2 border-gray-400
                            z-40'>
                <p> CloudControl </p>
                <p> Alcalcia Municipal, Nombre Plan, PISAMI </p>
                <p> Plan indicativo </p>
            </div>
            <div className='col-span-full'>
                <Content index={index+1} 
                         len={data.length}
                         data={data[index]} 
                         callback={setData} 
                         Padre={Padre} 
                         id={id}/>
            </div>
        </div>
    )
}
