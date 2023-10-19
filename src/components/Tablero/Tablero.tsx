import { useState, useEffect } from 'react'
import { Content } from './Content';
import { PesosNodos, Porcentaje, DetalleAño, NivelInterface } from '../../interfaces';
import { useParams } from 'react-router-dom';
import { getProgresoTotal } from '../../services/api';

interface Props {
    data: NivelInterface[];
}

export const Tablero = ( props : Props ) => {
    const { id } = useParams();

    const [index, setIndex] = useState(0);
    const [Padre, setPadre] = useState<string | null>(null);

    const [getProgress, setGetProgress] = useState(false);

    const setData = (index: number, padre: (string | null)) => {
        if (index < props.data.length && index >= 0) {
            setIndex(index)
            setPadre(padre)
        }
    }

    useEffect(() => {
        const id_ = parseInt(id as string)

        getProgresoTotal(id_)
            .then((res) => {
                if (!res) return
                localStorage.setItem('pesosNodo', JSON.stringify(res[0]))
                localStorage.setItem('detalleAño', JSON.stringify(res[1]))
                calcProgress()
                setGetProgress(true)
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    const calcProgress = () => {
        const pesosStr = localStorage.getItem('pesosNodo')
        const detalleStr = localStorage.getItem('detalleAño')
        if (!pesosStr || !detalleStr) return
        let pesosNodo = JSON.parse(pesosStr as string)
        let detalleAño = JSON.parse(detalleStr as string)
        
        detalleAño.forEach((item: DetalleAño) => {
            let progreso = 0
            if (item.Programacion_fisica !== 0)
                progreso = item.Ejecucion_Fisica / item.Programacion_fisica
                progreso = parseFloat(progreso.toFixed(2))
            let peso = pesosNodo.find((peso: PesosNodos) => peso.id_nodo === item.id_nodo)
            if (peso) {
                peso.porcentajes = peso.porcentajes ? peso.porcentajes : []
                peso.porcentajes.push({ progreso : progreso, año: item.Año, programacion: item.Programacion_fisica })
            }
        })

        pesosNodo.forEach((item: PesosNodos) => {
            const { porcentajes, Padre } = item
            if (porcentajes) {
                if (Padre){
                    porcentajes.forEach((porcentaje: Porcentaje) => {
                        let padre = pesosNodo.find((e: PesosNodos) => e.id_nodo === Padre)
                        if (padre) {
                            let progresoPeso = porcentaje.progreso * (item.Peso / 100)
                            progresoPeso = parseFloat(progresoPeso.toFixed(2))
                            padre.porcentajes = padre.porcentajes ? padre.porcentajes : []
                            const temp = padre.porcentajes.find((e: Porcentaje) => e.año === porcentaje.año)
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
        <div className="tw-container tw-mx-auto my-3
                        tw-bg-gray-200
                        tw-grid tw-grid-cols-12
                        tw-content-center
                        tw-border-8 tw-border-gray-400 tw-rounded-md ">
            <div className='tw-flex 
                            tw-col-start-1 tw-col-span-full
                            tw-justify-between
                            tw-px-3 tw-mt-4
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <p> CloudControl </p>
                <p> Alcalcia Municipal, Nombre Plan, PISAMI </p>
                <p> Plan indicativo </p>
            </div>
            <div className='tw-col-span-full'>
                <Content    index={index+1} 
                            len={props.data.length}
                            data={props.data[index]} 
                            callback={setData} 
                            Padre={Padre} 
                            id={ parseInt(id as string) }
                            progress={getProgress}/>
            </div>
        </div>
    )
}
