import { useEffect } from 'react';

import { Content } from './Content';
import { NodesWeight, Percentages, YearDetail } from '@/interfaces';
import { getTotalProgress } from '@/services/api';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetPDTid } from '@/store/plan/thunks';

export const Board = () => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector(store => store.content);
    const { plan } = useAppSelector(store => store.plan);

    useEffect(() => {
        dispatch(thunkGetPDTid(id_plan));
        
        getTotalProgress(id_plan)
        .then((res) => {
            if (!res) return;
            localStorage.setItem('UnitNode', JSON.stringify(res[0]));
            localStorage.setItem('YearDeta', JSON.stringify(res[1]));
            calcProgress( res );
        })
        .catch((err) => {
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
                        year: item.year ,
                        physical_programming: item.physical_programming,
                        financial_execution: progresoFinan
                    }
                );
            }
        })

        pesosNodo.forEach((item: NodesWeight) => {
            const { percents, parent } = item;
            if (percents) {
                if (parent) {
                    percents.forEach((Percentages: Percentages) => {
                        let padre = pesosNodo.find(
                            (e: NodesWeight) => e.id_node === parent
                        );
                        if (padre) {
                            let progresoPeso = Percentages.progress > 0 ? 
                                Percentages.progress * (item.weight / 100) : 0;
                            progresoPeso = parseFloat(progresoPeso.toFixed(2));
                            let financiado = Percentages.financial_execution;
                            padre.percents = padre.percents ? padre.percents : [];
                            const temp = padre.percents.find(
                                (e: Percentages) => e.year === Percentages.year
                            );
                            if (temp) {
                                temp.progress += progresoPeso > 0 ? progresoPeso : 0;
                                temp.progress = parseFloat(temp.progress.toFixed(2));
                                temp.financial_execution += financiado;
                            } else {
                                padre.percents.push(
                                    {
                                        progress : progresoPeso > 1 ? 1 : progresoPeso,
                                        year: Percentages.year,
                                        physical_programming: 0,
                                        financial_execution: financiado
                                    }
                                );
                            }
                        }
                    })
                }
            }
        })
        localStorage.setItem('UnitNode', JSON.stringify(pesosNodo));
    }

    return (
        (plan ? 
        <Content    
            id={ id_plan }
        /> : <p>Cargando</p>
        )
    );
}
 