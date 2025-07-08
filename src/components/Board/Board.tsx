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

        pesosNodo.forEach((item: NodesWeight) => {
            const { percents, parent } = item;
            if (percents && parent) {
                percents.forEach((percentageItem: Percentages) => {
                    const year = percentageItem.year;
                    let padre = pesosNodo.find((e: NodesWeight) => e.id_node === parent);
                    if (!padre) return;
                    const hermanos = pesosNodo.filter(n => n.parent === parent);
                    const hermanosConProg = hermanos.filter(n => {
                        const p = n.percents?.find(e => e.year === year);
                        return p && p.physical_programming > 0;
                    });
                    const totalPesoValido = hermanosConProg.reduce((sum, h) => sum + h.weight, 0);
                    if (percentageItem.physical_programming === 0 || totalPesoValido === 0) return;
                    const pesoAjustado = item.weight / totalPesoValido;

                    let progresoPeso = percentageItem.progress * pesoAjustado;
                    progresoPeso = parseFloat(progresoPeso.toFixed(2));
                    let financiado = percentageItem.financial_execution;
                    padre.percents = padre.percents ? padre.percents : [];
                    const temp = padre.percents.find((e: Percentages) => e.year === percentageItem.year);
                    if (temp) {
                        temp.progress += progresoPeso > 0 ? progresoPeso : 0;
                        if (temp.progress > 1) {
                            console.warn('Progreso mayor a 100% detectado:', temp.progress, temp, item);
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
 