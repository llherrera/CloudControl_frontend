import { useState, useEffect } from 'react'
import { Content } from './Content';
import { Nivel } from '../../interfaces';
import { useParams } from 'react-router-dom';
import { getProgresoTotal } from '../../services/api';

export const Tablero = ( { data } : { data : Nivel[] } ) => {
    const { id } = useParams();

    const [index, setIndex] = useState(0);
    const [Padre, setPadre] = useState();

    const [getProgress, setGetProgress] = useState(false);

    const setData = (index: number, padre: any) => {
        if (index < data.length && index >= 0) {
            setIndex(index)
            setPadre(padre)
        }
    }

    useEffect(() => {
        const id_ = parseInt(id as string)

        getProgresoTotal(id_)
            .then((res: any) => {
                if (!res) return
                localStorage.setItem('pesosNodo', JSON.stringify(res[0]))
                localStorage.setItem('detalleAño', JSON.stringify(res[1]))
                calcProgress()
                setGetProgress(true)
            })
            .catch((err: any) => {
                console.log(err);
            })

    }, [])

    const calcProgress = () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        if (!pesosStr || !detalleStr) return
        let pesosNodo = JSON.parse(pesosStr as string)
        let detalleAño = JSON.parse(detalleStr as string)
        
        detalleAño.forEach((item: any) => {
            let progreso = 0
            if (item.Programacion_fisica !== 0)
                progreso = item.Ejecucion_Fisica / item.Programacion_fisica
                progreso = parseFloat(progreso.toFixed(2))
            let peso = pesosNodo.find((peso: any) => peso.id_nodo === item.id_nodo)
            if (peso) {
                peso.porcentajes = peso.porcentajes ? peso.porcentajes : []
                peso.porcentajes.push({ progreso : progreso, año: item.Año, programacion: item.Programacion_fisica })
            }
        })

        pesosNodo.forEach((item: any) => {
            const { porcentajes, Padre } = item
            if (porcentajes) {
                if (Padre){
                    porcentajes.forEach((porcentaje: any) => {
                        let padre = pesosNodo.find((e: any) => e.id_nodo === Padre)
                        if (padre) {
                            let progresoPeso = parseFloat(porcentaje.progreso) * (parseFloat(item.Peso) / 100)
                            progresoPeso = parseFloat(progresoPeso.toFixed(2))
                            padre.porcentajes = padre.porcentajes ? padre.porcentajes : []
                            const temp = padre.porcentajes.find((e: any) => e.año === porcentaje.año)
                            if (temp) {
                                temp.progreso += progresoPeso
                            } else {
                                padre.porcentajes.push({ progreso : progresoPeso, año: porcentaje.año })
                            }
                        }
                    })
                }
            } else {

            }
        })
        localStorage.setItem('pesosNodo', JSON.stringify(pesosNodo))
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
                <Content    index={index+1} 
                            len={data.length}
                            data={data[index]} 
                            callback={setData} 
                            Padre={Padre} 
                            id={ parseInt(id as string) }
                            progress={getProgress}/>
            </div>
        </div>
    )
}
