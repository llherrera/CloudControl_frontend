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
            if (item.physical_programming !== 0)
                progreso = item.physical_execution / item.physical_programming
                if (progreso > 1) progreso = 1
                progreso = parseFloat(progreso.toFixed(2))
            let peso = pesosNodo.find((peso: PesosNodos) => peso.id_node === item.id_node)
            if (peso) {
                peso.percents = peso.percents ? peso.percents : []
                peso.percents.push({ progress : progreso, year: item.year, physical_programming: item.physical_programming, financial_execution: item.financial_execution })
            }
        })

        pesosNodo.forEach((item: PesosNodos) => {
            const { percents, parent } = item
            if (percents) {
                if (parent){
                    percents.forEach((porcentaje: Porcentaje) => {
                        let padre = pesosNodo.find((e: PesosNodos) => e.id_node === parent)
                        if (padre) {
                            let progresoPeso = porcentaje.progress * (item.weight / 100)
                            progresoPeso = parseFloat(progresoPeso.toFixed(2))
                            let financiado = porcentaje.financial_execution
                            padre.percents = padre.percents ? padre.percents : []
                            const temp = padre.percents.find((e: Porcentaje) => e.year === porcentaje.year)
                            if (temp) {
                                temp.progress += progresoPeso
                                temp.progress = parseFloat(temp.progress.toFixed(2))
                                temp.financial_execution += financiado
                            } else {
                                padre.percents.push({ progress : progresoPeso, year: porcentaje.year, physical_programming: 0, financial_execution: financiado })
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
 