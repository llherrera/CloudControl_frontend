import { useEffect } from 'react';

import { Content } from './Content';
import { Spinner } from "@/assets/icons";
import { NodesWeight, Percentages, YearDetail } from '@/interfaces';
import { getTotalProgress } from '@/services/api';
import { notify } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetPDTid } from '@/store/plan/thunks';
import { setCalcDone } from '@/store/plan/planSlice';

export const Board = () => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector(store => store.content);
    const { plan, loadingPlan } = useAppSelector(store => store.plan);

    useEffect(() => {
        if (plan) return;
        dispatch(thunkGetPDTid(id_plan));
    }, []);

    useEffect(() => {
        getTotalProgress(id_plan)
        .then(res => {
            if (!res) return;
            localStorage.setItem('UnitNode', JSON.stringify(res[0]));
            localStorage.setItem('YearDeta', JSON.stringify(res[1]));
            calcProgress( res );
        })
        .catch(err => {
            notify('Ha ocurrido un error, vuelva a intertarlo mas tarde', 'error');
            console.log(err);
        })
    }, []);

    const calcProgress = ( res: [NodesWeight[], YearDetail[]] ) => {
        let pesosNodo = res[0];
        let detalleAnno = res[1];

        // Primera pasada: calcular progreso físico y financiero para cada nodo
        detalleAnno.forEach((item: YearDetail) => {
            let progreso = 0;
            let progresoFinan = 0;
            if (item.physical_programming !== 0)
                progreso = item.physical_execution / item.physical_programming;
            else
                progreso = -1;
            if (progreso > 1)
                progreso = 1;
            progreso = parseFloat(progreso.toFixed(2));
            progresoFinan = item.financial_execution /1000000;
            let peso = pesosNodo.find(
                (peso: NodesWeight) => peso.id_node === item.id_node
            );
            if (peso) {
                peso.percents = peso.percents ? peso.percents : [];
                peso.percents.push(
                    {
                        progress : progreso,
                        year: item.year,
                        physical_programming: item.physical_programming,
                        financial_execution: progresoFinan
                    }
                );
            }
        })

        // Segunda pasada: recalcular pesos y progreso agregado
        pesosNodo.forEach((item: NodesWeight) => {
            const { percents, parent } = item;
            if (percents && parent) {
                percents.forEach((percentageItem: Percentages) => {
                    const year = percentageItem.year;
                    let padre = pesosNodo.find((e: NodesWeight) => e.id_node === parent);
                    if (!padre) return;
                    
                    // Obtener todos los hermanos del mismo padre
                    const hermanos = pesosNodo.filter(n => n.parent === parent);
                    
                    // Contar cuántos hermanos tienen programación en este año
                    const hermanosConProg = hermanos.filter(n => {
                        const p = n.percents?.find(e => e.year === year);
                        return p && p.physical_programming > 0;
                    });
                    
                    const numMetasProgramadas = hermanosConProg.length;
                    
                    // Si no hay metas programadas, no hacer nada
                    if (numMetasProgramadas === 0) return;
                    
                    // Calcular el peso ajustado: 100 / número de metas programadas
                    const pesoAjustado = 100 / numMetasProgramadas;
                    
                    // Solo procesar si este nodo tiene programación
                    if (percentageItem.physical_programming === 0) return;
                    
                    let progresoPeso = percentageItem.progress * (pesoAjustado / 100);
                    progresoPeso = parseFloat(progresoPeso.toFixed(2));
                    let financiado = percentageItem.financial_execution;
                    
                    padre.percents = padre.percents ? padre.percents : [];
                    const temp = padre.percents.find((e: Percentages) => e.year === percentageItem.year);
                    
                    if (temp) {
                        temp.progress += progresoPeso > 0 ? progresoPeso : 0;
                        if (temp.progress > 1) {
                            temp.progress = 1;
                        }
                        temp.progress = parseFloat(temp.progress.toFixed(2));
                        temp.financial_execution += financiado;
                    } else {
                        padre.percents.push({
                            progress : progresoPeso > 1 ? 1 : progresoPeso,
                            year: percentageItem.year,
                            physical_programming: 1,
                            financial_execution: financiado
                        });
                    }
                })
            }
        })
        localStorage.setItem('UnitNode', JSON.stringify(pesosNodo));
        dispatch(setCalcDone(true));
    }

    return (
        (loadingPlan ? <Spinner/> :
        plan ?
        <Content
            id={id_plan}
        /> : <p>No hay plan cargado</p>
        )
    );
}
 