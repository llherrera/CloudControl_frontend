import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import { Content } from './Content';
import { PesosNodos, Porcentaje, DetalleAño, NivelInterface } from '../../interfaces';
import { getTotalProgress } from '../../services/api';

import { useAppDispatch } from '@/store';
import { thunkGetPDTid, thunkGetColors } from '@/store/plan/thunks';
import { useAppSelector } from "@/store";

interface Props {
    data: NivelInterface[];
}

export const Tablero = ( props : Props ) => {
    const dispatch = useAppDispatch()
    const { plan } = useAppSelector(store => store.plan)
    const { id } = useParams();

    const [getProgress, setGetProgress] = useState(false);

    useEffect(() => {
        const abortController = new AbortController()
        if (!id) return;
        const id_ = parseInt(id as string)

        dispatch(thunkGetPDTid(id)).unwrap()
        dispatch(thunkGetColors(id)).unwrap()
        
        getTotalProgress(id_)
            .then((res) => {
                if (!res) return
                localStorage.setItem('pesosNodo', JSON.stringify(res[0]))
                localStorage.setItem('detalleAño', JSON.stringify(res[1]))
                calcProgress( res )
                setGetProgress(true)
            })
            .catch((err) => {
                console.log(err);
            })
        return () => abortController.abort()
    }, [])

    const calcProgress = ( res: [PesosNodos[],DetalleAño[]] ) => {
        let pesosNodo = res[0]
        let detalleAño = res[1]
        
        detalleAño.forEach((item: DetalleAño) => {
            let progreso = 0
            if (item.Programacion_fisica !== 0)
                progreso = item.Ejecucion_Fisica / item.Programacion_fisica
                if (progreso > 1) progreso = 1
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
                                padre.porcentajes.push({ progreso : progresoPeso, año: porcentaje.año, programacion: 0 })
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
        (plan ? 
        <Content    
            id={ parseInt(id as string) }
            progress={getProgress}
        /> : <p>Cargando</p>
        )
    )
}
 