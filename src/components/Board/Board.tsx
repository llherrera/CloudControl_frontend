import { useState, useEffect } from 'react'

import { Content } from './Content';
import { PesosNodos, Porcentaje, YearDetail } from '../../interfaces';
import { getTotalProgress } from '../../services/api';

import { useAppDispatch } from '@/store';
import { thunkGetPDTid, thunkGetColors } from '@/store/plan/thunks';
import { useAppSelector } from "@/store";

export const Board = ( {id}:{id: number} ) => {
    const dispatch = useAppDispatch()
    const { plan } = useAppSelector(store => store.plan)

    const [getProgress, setGetProgress] = useState(false);

    useEffect(() => {
        const abortController = new AbortController()

        dispatch(thunkGetPDTid(id.toString())).unwrap()
        dispatch(thunkGetColors(id.toString())).unwrap()
        
        getTotalProgress(id)
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

    const calcProgress = ( res: [PesosNodos[], YearDetail[]] ) => {
        let pesosNodo = res[0]
        let detalleAño = res[1]
        
        detalleAño.forEach((item: YearDetail) => {
            let progreso = 0
            if (item.Programacion_fisica !== 0)
                progreso = item.Ejecucion_fisica / item.Programacion_fisica
                if (progreso > 1) progreso = 1
                progreso = parseFloat(progreso.toFixed(2))
            let peso = pesosNodo.find((peso: PesosNodos) => peso.id_nodo === item.id_nodo)
            if (peso) {
                peso.porcentajes = peso.porcentajes ? peso.porcentajes : []
                peso.porcentajes.push({ progreso : progreso, año: item.Año, programacion: item.Programacion_fisica, ejecucionFinanciera: item.Ejecucion_financiera })
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
                            let financiado = porcentaje.ejecucionFinanciera
                            padre.porcentajes = padre.porcentajes ? padre.porcentajes : []
                            const temp = padre.porcentajes.find((e: Porcentaje) => e.año === porcentaje.año)
                            if (temp) {
                                temp.progreso += progresoPeso
                                temp.progreso = parseFloat(temp.progreso.toFixed(2))
                                temp.ejecucionFinanciera += financiado
                            } else {
                                padre.porcentajes.push({ progreso : progresoPeso, año: porcentaje.año, programacion: 0, ejecucionFinanciera: financiado })
                            }
                        }
                    })
                }
            }
        })
        localStorage.setItem('pesosNodo', JSON.stringify(pesosNodo))
    }

    return (
        (plan ? 
        <Content    
            id={ parseInt(id.toString()) }
            progress={getProgress}
        /> : <p>Cargando</p>
        )
    )
}
 