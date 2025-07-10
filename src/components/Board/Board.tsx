import { useEffect } from 'react';

import { Content } from './Content';
import { Spinner } from "@/assets/icons";
import { NodesWeight, Percentages, YearDetail } from '@/interfaces';
import { getTotalProgress } from '@/services/api';
import { notify } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetPDTid } from '@/store/plan/thunks';
import { setCalcDone } from '@/store/plan/planSlice';

// Variable global para controlar el debug
declare global {
    interface Window {
        debugCalcProgress: boolean;
        debugNodeOpen: boolean;
    }
}

// Inicializar variables de debug
if (typeof window !== 'undefined') {
    window.debugCalcProgress = false;
    window.debugNodeOpen = false;
}

// Función para activar/desactivar debug desde consola
const setupDebugCommands = () => {
    if (typeof window !== 'undefined') {
        // Comando para activar debug de cálculo de progreso
        (window as any).debugProgress = () => {
            window.debugCalcProgress = !window.debugCalcProgress;
            console.log(`🔍 Debug de cálculo de progreso: ${window.debugCalcProgress ? 'ACTIVADO' : 'DESACTIVADO'}`);
            return window.debugCalcProgress;
        };

        // Comando para activar debug de apertura de nodos
        (window as any).debugNodes = () => {
            window.debugNodeOpen = !window.debugNodeOpen;
            console.log(`🔍 Debug de apertura de nodos: ${window.debugNodeOpen ? 'ACTIVADO' : 'DESACTIVADO'}`);
            return window.debugNodeOpen;
        };

        // Comando para ver datos actuales
        (window as any).showDebugData = () => {
            const unitNode = localStorage.getItem('UnitNode');
            const yearDeta = localStorage.getItem('YearDeta');
            console.log('📊 Datos de debug actuales:');
            console.log('UnitNode:', unitNode ? JSON.parse(unitNode) : 'No disponible');
            console.log('YearDeta:', yearDeta ? JSON.parse(yearDeta) : 'No disponible');
        };

        // Comando para buscar información detallada de un nodo específico
        (window as any).debugNode = (nodeId: string) => {
            const unitNode = localStorage.getItem('UnitNode');
            const yearDeta = localStorage.getItem('YearDeta');
            
            if (!unitNode || !yearDeta) {
                console.log('❌ No hay datos disponibles');
                return;
            }
            
            const pesosNodo = JSON.parse(unitNode);
            const detalleAnno = JSON.parse(yearDeta);
            
            // Buscar el nodo específico
            const nodo = pesosNodo.find((n: NodesWeight) => n.id_node === nodeId);
            const detalles = detalleAnno.filter((d: YearDetail) => d.id_node === nodeId);
            
            if (!nodo) {
                console.log(`❌ Nodo ${nodeId} no encontrado`);
                return;
            }
            
            console.log(`🔍 Información detallada del nodo ${nodeId} (${nodo.name || 'Sin nombre'}):`);
            console.log('📋 Datos del nodo:', nodo);
            
            // Mostrar detalles originales por año
            if (detalles.length > 0) {
                console.log('📊 Detalles originales por año:');
                detalles.forEach((detalle: YearDetail) => {
                    const progreso = detalle.physical_programming !== 0 ? 
                        detalle.physical_execution / detalle.physical_programming : -1;
                    const progresoFinal = progreso > 1 ? 1 : progreso;
                    
                    console.log(`  📅 Año ${detalle.year}:`);
                    console.log(`    📈 Programación física: ${detalle.physical_programming}`);
                    console.log(`    ✅ Ejecución física: ${detalle.physical_execution}`);
                    console.log(`    💰 Ejecución financiera: ${detalle.financial_execution}`);
                    console.log(`    ➗ Cálculo: ${detalle.physical_execution} / ${detalle.physical_programming} = ${progreso}`);
                    console.log(`    ✅ Progreso final: ${parseFloat(progresoFinal.toFixed(2))} (${(progresoFinal * 100).toFixed(1)}%)`);
                });
            }
            
            // Mostrar progresos calculados
            if (nodo.percents && nodo.percents.length > 0) {
                console.log('📈 Progresos calculados:');
                nodo.percents.forEach((p: Percentages) => {
                    console.log(`  📅 Año ${p.year}: ${(p.progress * 100).toFixed(1)}%`);
                });
            }

            // Mostrar proceso de cálculo si es un nodo padre
            if (nodo.percents && nodo.percents.length > 0) {
                console.log('🔍 Proceso de cálculo del progreso agregado:');
                
                nodo.percents.forEach((p: Percentages) => {
                    const year = p.year;
                    console.log(`  📅 Año ${year}:`);
                    
                    // Buscar hermanos del mismo padre
                    const hermanos = pesosNodo.filter((n: NodesWeight) => n.parent === nodo.parent);
                    const hermanosConProg = hermanos.filter((n: NodesWeight) => {
                        const p = n.percents?.find((e: Percentages) => e.year === year);
                        return p && p.physical_programming > 0;
                    });
                    
                    // Contar cuántos hermanos tienen datos en este año (con o sin programación)
                    const hermanosConDatos = pesosNodo.filter((n: NodesWeight) => n.parent === nodo.parent).filter((n: NodesWeight) => {
                        const p = n.percents?.find((e: Percentages) => e.year === year);
                        return p !== undefined;
                    });
                    
                    console.log(`    👥 Total hermanos: ${hermanos.length}`);
                    console.log(`    ✅ Hermanos con programación: ${hermanosConProg.length}`);
                    console.log(`    📊 Hermanos con datos: ${hermanosConDatos.length}`);
                    
                    if (hermanosConProg.length > 0) {
                        console.log(`    📋 Hermanos con programación (que contribuyen al progreso):`);
                        hermanosConProg.forEach((h: NodesWeight) => {
                            const prog = h.percents?.find((e: Percentages) => e.year === year);
                            if (prog) {
                                console.log(`      - ${h.id_node} (${h.name || 'Sin nombre'}): ${(prog.progress * 100).toFixed(1)}%`);
                            }
                        });
                        
                        const pesoAjustado = 100 / hermanosConProg.length;
                        console.log(`    ⚖️ Peso ajustado: ${pesoAjustado}% (100 / ${hermanosConProg.length})`);
                        
                        // Mostrar contribución de cada hermano
                        console.log(`    📊 Contribución de cada hermano:`);
                        hermanosConProg.forEach((h: NodesWeight) => {
                            const prog = h.percents?.find((e: Percentages) => e.year === year);
                            if (prog) {
                                const contribucion = prog.progress * (pesoAjustado / 100);
                                console.log(`      - ${h.id_node}: ${(prog.progress * 100).toFixed(1)}% × ${(pesoAjustado/100).toFixed(3)} = ${(contribucion * 100).toFixed(1)}%`);
                            }
                        });
                        
                        // Calcular progreso total esperado
                        const progresoTotal = hermanosConProg.reduce((sum: number, h: NodesWeight) => {
                            const prog = h.percents?.find((e: Percentages) => e.year === year);
                            return sum + (prog ? prog.progress * (pesoAjustado / 100) : 0);
                        }, 0);
                        
                        console.log(`    ✅ Progreso total esperado: ${(progresoTotal * 100).toFixed(1)}%`);
                        console.log(`    📈 Progreso actual del nodo: ${(p.progress * 100).toFixed(1)}%`);
                    } else {
                        console.log(`    ⚠️ No hay hermanos con programación para el año ${year}`);
                    }
                    
                    // Mostrar hermanos sin programación (para información)
                    const hermanosSinProg = hermanosConDatos.filter((h: NodesWeight) => {
                        const prog = h.percents?.find((e: Percentages) => e.year === year);
                        return prog && prog.physical_programming === 0;
                    });
                    
                    if (hermanosSinProg.length > 0) {
                        console.log(`    📋 Hermanos sin programación (0% - gris):`);
                        hermanosSinProg.forEach((h: NodesWeight) => {
                            const prog = h.percents?.find((e: Percentages) => e.year === year);
                            if (prog) {
                                console.log(`      - ${h.id_node} (${h.name || 'Sin nombre'}): ${(prog.progress * 100).toFixed(1)}% [Sin programación]`);
                            }
                        });
                    }
                });
            }

            // Mostrar información de nodos hijos si los tiene
            const hijos = pesosNodo.filter((n: NodesWeight) => n.parent === nodeId);
            if (hijos.length > 0) {
                console.log('👶 Nodos hijos:');
                hijos.forEach((hijo: NodesWeight) => {
                    console.log(`  - ${hijo.id_node} (${hijo.name || 'Sin nombre'})`);
                    if (hijo.percents && hijo.percents.length > 0) {
                        hijo.percents.forEach((p: Percentages) => {
                            console.log(`    📅 Año ${p.year}: ${(p.progress * 100).toFixed(1)}%`);
                        });
                    }
                });
            }

            // Mostrar información del nodo padre si existe
            if (nodo.parent) {
                const padre = pesosNodo.find((n: NodesWeight) => n.id_node === nodo.parent);
                if (padre) {
                    console.log('👨 Nodo padre:');
                    console.log(`  - ${padre.id_node} (${padre.name || 'Sin nombre'})`);
                    if (padre.percents && padre.percents.length > 0) {
                        padre.percents.forEach((p: Percentages) => {
                            console.log(`    📅 Año ${p.year}: ${(p.progress * 100).toFixed(1)}%`);
                        });
                    }
                }
            }
        };

        // Comando de ayuda para mostrar todas las funciones disponibles
        (window as any).help = () => {
            console.log('🚀 Comandos de debug disponibles:');
            console.log('');
            console.log('📊 debugProgress()');
            console.log('   Activa/desactiva el debug del cálculo de progreso');
            console.log('   Muestra el proceso paso a paso del cálculo de porcentajes');
            console.log('');
            console.log('🚪 debugNodes()');
            console.log('   Activa/desactiva el debug de apertura de nodos');
            console.log('   Muestra información cuando navegas entre nodos');
            console.log('');
            console.log('📋 showDebugData()');
            console.log('   Muestra los datos actuales almacenados en localStorage');
            console.log('   Incluye UnitNode y YearDeta');
            console.log('');
            console.log('🔍 debugNode("ID_NODO")');
            console.log('   Muestra información detallada de un nodo específico');
            console.log('   Ejemplo: debugNode("9284.1.1")');
            console.log('   Incluye: datos originales, cálculos, hermanos, hijos, padre');
            console.log('');
            console.log('❓ help()');
            console.log('   Muestra esta lista de comandos disponibles');
            console.log('');
            console.log('💡 Tip: Ejecuta debugProgress() y luego navega por los nodos para ver el proceso completo');
        };
    }
};

export const Board = () => {
    const dispatch = useAppDispatch();
    const { id_plan } = useAppSelector(store => store.content);
    const { plan, loadingPlan } = useAppSelector(store => store.plan);

    useEffect(() => {
        setupDebugCommands();
    }, []);

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

        // --- NUEVO: Completar nodos intermedios faltantes ---
        // 1. Obtener todos los nodos existentes por id_node
        const idSet = new Set(pesosNodo.map(n => n.id_node));
        // 2. Buscar nodos con patrón (id).x.y y agregar los intermedios si faltan
        const nuevosNodos: NodesWeight[] = [];
        pesosNodo.forEach(nodo => {
            const partes = nodo.id_node.split('.');
            for (let i = 1; i < partes.length; i++) {
                const idIntermedio = partes.slice(0, i).join('.');
                if (!idSet.has(idIntermedio)) {
                    idSet.add(idIntermedio);
                    nuevosNodos.push({
                        id_node: idIntermedio,
                        name: '',
                        parent: i > 1 ? partes.slice(0, i - 1).join('.') : null,
                        weight: 0,
                        percents: [],
                    } as NodesWeight);
                }
            }
        });
        if (nuevosNodos.length > 0) {
            pesosNodo = [...pesosNodo, ...nuevosNodos];
        }
        // --- FIN NUEVO ---

        // Primera pasada: calcular progreso físico y financiero para cada nodo
        detalleAnno.forEach((item: YearDetail) => {
            let progreso = 0;
            let progresoFinan = 0;
            
            if (window.debugCalcProgress) {
                console.log(`🔍 Calculando progreso para nodo ${item.id_node}:`);
                console.log(`  📊 Datos originales:`, {
                    physical_programming: item.physical_programming,
                    physical_execution: item.physical_execution,
                    financial_execution: item.financial_execution,
                    year: item.year
                });
            }
            
            if (item.physical_programming !== 0) {
                progreso = item.physical_execution / item.physical_programming;
                if (window.debugCalcProgress) {
                    console.log(`  ➗ Cálculo: ${item.physical_execution} / ${item.physical_programming} = ${progreso}`);
                }
            } else {
                // Si no hay programación física, el progreso es 0%
                progreso = 0;
                if (window.debugCalcProgress) {
                    console.log(`  ⚠️ Sin programación física, progreso = 0% (sin programación)`);
                }
            }
            
            if (progreso > 1) {
                if (window.debugCalcProgress) {
                    console.log(`  📈 Progreso > 1, limitando a 1 (era: ${progreso})`);
                }
                progreso = 1;
            }
            
            progreso = parseFloat(progreso.toFixed(2));
            progresoFinan = item.financial_execution /1000000;
            
            if (window.debugCalcProgress) {
                console.log(`  ✅ Progreso final: ${progreso} (${(progreso * 100).toFixed(1)}%)`);
                console.log(`  💰 Financiado (en millones): ${progresoFinan}`);
            }
            
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

                if (window.debugCalcProgress) {
                    console.log(`  📈 Nodo ${item.id_node} (${peso.name || 'Sin nombre'}):`, {
                        year: item.year,
                        physical_programming: item.physical_programming,
                        physical_execution: item.physical_execution,
                        progress: progreso,
                        financial_execution: progresoFinan,
                        calculation: item.physical_programming !== 0 ? 
                            `${item.physical_execution} / ${item.physical_programming} = ${progreso}` : 
                            'Sin programación → 0%'
                    });
                }
            }
        })

        // Segunda pasada: recalcular pesos y progreso agregado
        if (window.debugCalcProgress) {
            console.log('⚖️ Segunda pasada: Recalculando pesos y progreso agregado...');
        }

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
                    
                    // Contar cuántos hermanos tienen datos en este año (con o sin programación)
                    const hermanosConDatos = hermanos.filter(n => {
                        const p = n.percents?.find(e => e.year === year);
                        return p !== undefined;
                    });
                    
                    const numMetasProgramadas = hermanosConProg.length;
                    const numMetasConDatos = hermanosConDatos.length;
                    
                    if (window.debugCalcProgress) {
                        console.log(`  🔍 Procesando nodo ${item.id_node} (${item.name || 'Sin nombre'}) para año ${year}:`);
                        console.log(`    👥 Total hermanos: ${hermanos.length}`);
                        console.log(`    ✅ Hermanos con programación: ${numMetasProgramadas}`);
                        console.log(`    📊 Hermanos con datos: ${numMetasConDatos}`);
                        console.log(`    📋 Hermanos con programación:`, hermanosConProg.map(h => `${h.id_node} (${h.name || 'Sin nombre'})`));
                        console.log(`    📋 Hermanos con datos:`, hermanosConDatos.map(h => `${h.id_node} (${h.name || 'Sin nombre'})`));
                    }
                    
                    // Si no hay metas programadas, no hacer nada
                    if (numMetasProgramadas === 0) {
                        if (window.debugCalcProgress) {
                            console.log(`    ⚠️ No hay metas programadas para el año ${year}`);
                        }
                        return;
                    }
                    
                    // Calcular el peso ajustado: 100 / número de metas programadas
                    const pesoAjustado = 100 / numMetasProgramadas;
                    
                    // Solo procesar si este nodo tiene programación física
                    if (percentageItem.physical_programming === 0) {
                        if (window.debugCalcProgress) {
                            console.log(`    ⚠️ Nodo ${item.id_node} no tiene programación física`);
                        }
                        return;
                    }
                    
                    let progresoPeso = percentageItem.progress * (pesoAjustado / 100);
                    progresoPeso = parseFloat(progresoPeso.toFixed(2));
                    let financiado = percentageItem.financial_execution;
                    
                    if (window.debugCalcProgress) {
                        console.log(`    ⚖️ Peso ajustado: ${pesoAjustado}% (100 / ${numMetasProgramadas})`);
                        console.log(`    📊 Progreso original: ${percentageItem.progress}`);
                        console.log(`    📈 Progreso ponderado: ${progresoPeso}`);
                        console.log(`    💰 Financiado: ${financiado}`);
                    }
                    
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

                        if (window.debugCalcProgress) {
                            console.log(`    🔄 Padre ${padre.id_node} (${padre.name || 'Sin nombre'}):`);
                            console.log(`      📊 Progreso anterior: ${progresoAnterior}`);
                            console.log(`      📈 Progreso actualizado: ${temp.progress}`);
                            console.log(`      💰 Financiado acumulado: ${temp.financial_execution}`);
                        }
                    } else {
                        padre.percents.push({
                            progress : progresoPeso > 1 ? 1 : progresoPeso,
                            year: percentageItem.year,
                            physical_programming: 1,
                            financial_execution: financiado
                        });

                        if (window.debugCalcProgress) {
                            console.log(`    ➕ Nuevo registro para padre ${padre.id_node} (${padre.name || 'Sin nombre'}):`);
                            console.log(`      📈 Progreso inicial: ${progresoPeso > 1 ? 1 : progresoPeso}`);
                            console.log(`      💰 Financiado inicial: ${financiado}`);
                        }
                    }
                })
            }
        })

        if (window.debugCalcProgress) {
            console.log('✅ Cálculo de progreso completado');
            console.log('📊 Resultado final:', pesosNodo);
        }

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
 