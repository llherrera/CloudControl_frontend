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

        console.log('🚀 INICIANDO CÁLCULO DE PROGRESO');
        console.log('📊 Datos iniciales:', { 
            totalNodos: pesosNodo.length, 
            totalDetalles: detalleAnno.length 
        });

        // Primera pasada: calcular progreso físico y financiero para cada nodo
        console.log('\n📈 PRIMERA PASADA: Calculando progreso por nodo');
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
                console.log(`  📋 Nodo ${item.id_node} (${peso.name || 'Sin nombre'}):`, {
                    año: item.year,
                    programación: item.physical_programming,
                    ejecución: item.physical_execution,
                    progreso: progreso,
                    ejecuciónFinanciera: progresoFinan
                });
            }
        })

        // Segunda pasada: recalcular pesos y progreso agregado
        console.log('\n⚖️ SEGUNDA PASADA: Recalculando pesos y progreso agregado');
        pesosNodo.forEach((item: NodesWeight) => {
            const { percents, parent } = item;
            if (percents && parent) {
                console.log(`\n🔍 PROCESANDO NODO: ${item.id_node} (${item.name || 'Sin nombre'})`);
                console.log(`   📍 Padre: ${parent}`);
                
                percents.forEach((percentageItem: Percentages) => {
                    const year = percentageItem.year;
                    console.log(`   📅 Año ${year}:`);
                    
                    let padre = pesosNodo.find((e: NodesWeight) => e.id_node === parent);
                    if (!padre) {
                        console.log(`   ❌ Padre ${parent} no encontrado`);
                        return;
                    }
                    
                    // Obtener todos los hermanos del mismo padre
                    const hermanos = pesosNodo.filter(n => n.parent === parent);
                    console.log(`   👥 Hermanos encontrados: ${hermanos.length}`);
                    
                    // Contar cuántos hermanos tienen programación en este año
                    const hermanosConProg = hermanos.filter(n => {
                        const p = n.percents?.find(e => e.year === year);
                        return p && p.physical_programming > 0;
                    });
                    
                    const numMetasProgramadas = hermanosConProg.length;
                    console.log(`   ✅ Metas programadas en ${year}: ${numMetasProgramadas}`);
                    
                    // Si no hay metas programadas, no hacer nada
                    if (numMetasProgramadas === 0) {
                        console.log(`   ⚠️ No hay metas programadas en ${year}, saltando...`);
                        return;
                    }
                    
                    // Calcular el peso ajustado: 100 / número de metas programadas
                    const pesoAjustado = 100 / numMetasProgramadas;
                    console.log(`   ⚖️ Peso ajustado: 100 / ${numMetasProgramadas} = ${pesoAjustado.toFixed(2)}%`);
                    
                    // Solo procesar si este nodo tiene programación
                    if (percentageItem.physical_programming === 0) {
                        console.log(`   ⚠️ Nodo ${item.id_node} no tiene programación en ${year}, saltando...`);
                        return;
                    }
                    
                    let progresoPeso = percentageItem.progress * (pesoAjustado / 100);
                    progresoPeso = parseFloat(progresoPeso.toFixed(2));
                    let financiado = percentageItem.financial_execution;
                    
                    console.log(`   📊 Cálculo progreso ponderado:`, {
                        progresoOriginal: percentageItem.progress,
                        pesoAjustado: pesoAjustado,
                        progresoPonderado: progresoPeso,
                        ejecuciónFinanciera: financiado
                    });
                    
                    padre.percents = padre.percents ? padre.percents : [];
                    const temp = padre.percents.find((e: Percentages) => e.year === percentageItem.year);
                    
                    if (temp) {
                        const progresoAnterior = temp.progress;
                        temp.progress += progresoPeso > 0 ? progresoPeso : 0;
                        if (temp.progress > 1) {
                            temp.progress = 1;
                        }
                        temp.progress = parseFloat(temp.progress.toFixed(2));
                        temp.financial_execution += financiado;
                        
                        console.log(`   🔄 Actualizando progreso del padre:`, {
                            progresoAnterior: progresoAnterior,
                            incremento: progresoPeso,
                            progresoNuevo: temp.progress,
                            ejecuciónFinancieraTotal: temp.financial_execution
                        });
                    } else {
                        const nuevoProgreso = progresoPeso > 1 ? 1 : progresoPeso;
                        padre.percents.push({
                            progress : nuevoProgreso,
                            year: percentageItem.year,
                            physical_programming: 1,
                            financial_execution: financiado
                        });
                        
                        console.log(`   ➕ Creando nuevo progreso para el padre:`, {
                            progreso: nuevoProgreso,
                            año: percentageItem.year,
                            ejecuciónFinanciera: financiado
                        });
                    }
                })
            }
        })
        
        console.log('\n✅ CÁLCULO COMPLETADO');
        console.log('💾 Guardando datos en localStorage...');
        localStorage.setItem('UnitNode', JSON.stringify(pesosNodo));
        dispatch(setCalcDone(true));
        console.log('🎉 Proceso finalizado exitosamente');
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
 