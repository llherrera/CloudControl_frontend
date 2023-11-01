import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addNodoUnidadYAños, getNombreNivel, getNodoUnidadYAños, getProgresoTotal } from "../../services/api";
import { AñoInterface, UnidadInterface, DetalleAño, PesosNodos, Porcentaje } from "../../interfaces";

export const AñadirNodoUni = () => {
    const navigate = useNavigate()
    const { idPDT, idNodo } = useParams();

    const [nombres, setNombres] = useState([[]]);

    const años = [2020,2021,2022,2023];
    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);
    const [add, setAdd] = useState(false);
    const [getProgress, setGetProgress] = useState(false);

    const [unidForm, setUnidForm] = useState<UnidadInterface>({
        code: '',
        description: '',
        indicator: '',
        base: 0,
        goal: 0,
        years: []
    });

    const [añoForm, setañoForm] = useState<AñoInterface[]>([{
        year: 0,
        programed: 0,
        phisicalExecuted: 0,
        finalcialExecuted: 0,
    }]);

    let añosTemp = [] as AñoInterface[];

    useEffect(() => {
        try {
            const id_ = parseInt(idPDT as string)

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

            const ids = idNodo!.split('.');
            let ids2 = ids.reduce((acumulator:string[], currentValue) => {
                if (acumulator.length === 0) {
                    return [currentValue];
                } else {
                    const ultimoElemento = acumulator[acumulator.length - 1];
                    const concatenado = `${ultimoElemento}.${currentValue}`;
                    return [...acumulator, concatenado];
                }
            }, []);
            ids2 = ids2.slice(1);
            getNombreNivel(ids2).then((res) => {
                setNombres(res);
            });

            getNodoUnidadYAños(idPDT!, idNodo!).then((res) => {
                const { Node } = res;
                console.log(res);
                
                if (Node === undefined) return;
                const { Codigo, Descripcion, Indicador, Linea_base, Meta } = Node;
                if (Codigo === undefined || Descripcion === undefined || Indicador === undefined || Linea_base === undefined || Meta === undefined) return;
                setUnidForm({code: Node.Codigo,
                             description: Node.Descripcion,
                             indicator: Node.Indicador,
                             base: Node.Linea_base,
                             goal: Node.Meta,
                             years: []
                });
                const detalleAño = localStorage.getItem('detalleAño');
                if (detalleAño === null) 
                    return;
                const detalleAñoJSON = JSON.parse(detalleAño);
                const Años = detalleAñoJSON.filter((dato:DetalleAño) => dato.id_nodo === idNodo);
                Años.forEach((dato:DetalleAño) => {
                    const año = new Date(dato.Año).getFullYear();
                    añosTemp.push({
                        year: año,
                        programed: dato.Programacion_fisica,
                        phisicalExecuted: dato.Ejecucion_Fisica,
                        finalcialExecuted: dato.Ejecucion_financiera,
                    });
                });
                setañoForm(añosTemp);
                const temp = calcularAcumulado( años, añosTemp);
                setAcum(temp);
            });
        } catch (error) {
            console.log('err');
        }
    }, [add]);

    const calcularAcumulado = (años: number[], añoForm: AñoInterface[]) => {
        let acumulado = 0;
        let acum = 0;
        let finan = 0;
        años.map((año: number, index: number) => {
            if (añoForm[index].programed !== 0) {
                acum++;
                acumulado += (añoForm[index].phisicalExecuted) / (añoForm[index].programed);
            }
            finan += añoForm[index].finalcialExecuted;
        });
        acumulado = acum === 0 ? 0 : (acumulado / acum);
        setAcumFinan(finan);
        return acumulado;
    }

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
                peso.porcentajes.push({ progreso : progreso, año: item.Año })
            }
        })

        pesosNodo.forEach((item: PesosNodos) => {
            const { porcentajes, Padre } = item
            if (porcentajes) {
                if (Padre){
                    porcentajes.forEach((porcentaje: Porcentaje) => {
                        let padre = pesosNodo.find((e: PesosNodos) => e.id_nodo === Padre)
                        if (padre) {
                            let progresoPeso = porcentaje.progreso * item.Peso / 100
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

    const handleSubmitButton = () => {
        navigate(`/pdt/${idPDT}/${idNodo}/añadirEvidencia`)
    }

    const handleInput = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (unidForm.goal === 0 || unidForm.code === '' || unidForm.description === '' || unidForm.indicator === '')
            return alert('Faltan campos por llenar')
        let temp = 0;
        for (let i = 0; i < añoForm.length; i++) {
            if (añoForm[i].programed > 0)
                temp++;
            if (temp > 0)
                break;
        }
        if (temp === 0)
            return alert('Faltan campos por llenar')
        
        try {
            addNodoUnidadYAños(idPDT!, idNodo!, unidForm, añoForm).then((res) => {
                if (res === undefined)
                    return alert('No se pudo añadir la unidad')
                alert('Unidad añadida con éxito');
                setAdd(true);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputUnid = (e : React.ChangeEvent<HTMLInputElement>) => {
        setUnidForm({
            ...unidForm,
            [e.target.name]: e.target.value,
        });
    }

    const handleInputaño = (grupo: keyof AñoInterface, index: number, valor: string) => {
        setañoForm(añoForm.map((año, i) => {
            if (i === index) {
                return {
                    ...año,
                    [grupo]: valor,
                };
            } else {
                return año;
            }
        }));
    }

    const unidadForm = () => {
        return (
            <form className="tw-mt-5">
                <table className="  tw-border-separate 
                                    tw-border-spacing-2 
                                    tw-border 
                                    tw-border-slate-500
                                    tw-bg-white
                                    tw-rounded">
                    <thead>
                        <tr>
                            <th className="tw-border tw-border-slate-600 tw-bg-gray-200 tw-rounded">Código de la meta: </th>
                            <th className="tw-border tw-border-slate-600 tw-rounded">
                                <input  type="text"
                                        name="code"
                                        value={unidForm.code}
                                        className="tw-bg-gray-200" 
                                        onChange={ (e) => handleInputUnid(e)}
                                        required/>
                            </th>
                            <th className="tw-border tw-border-slate-600 tw-px-2 tw-bg-gray-200 tw-rounded">Línea base</th>
                            <th className="tw-border tw-border-slate-600 tw-rounded">
                                <input  type="text"
                                        name="base"
                                        value={unidForm.base}
                                        className="tw-bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-bg-gray-200 tw-rounded">Descripción de la meta: </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <input  type="text"
                                        name="description"
                                        value={unidForm.description}
                                        className="tw-bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-bg-gray-200 tw-rounded">Meta</td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <input  type="text"
                                        name="goal"
                                        value={unidForm.goal}
                                        className="tw-bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-bg-gray-200 tw-rounded">Indicador de meta: </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <input  type="text"
                                        name="indicator"
                                        value={unidForm.indicator}
                                        className="tw-bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        )
    }

    const añosForm = () => {
        años.forEach((año, index) => {
            añoForm[index].phisicalExecuted = añoForm[index].phisicalExecuted ?? 0;
            añoForm[index].programed = añoForm[index].programed ?? 0;
            añoForm[index].finalcialExecuted = añoForm[index].finalcialExecuted ?? 0;
        });
        return(
            <form className="tw-mt-5">
                <table className="  tw-border-separate 
                                    tw-border-spacing-2
                                    tw-border 
                                    tw-border-slate-500
                                    tw-bg-white
                                    tw-rounded">
                    <thead>
                        <tr>
                            <th className=' tw-border 
                                            tw-border-slate-600 
                                            tw-bg-slate-300
                                            tw-rounded'> 
                                <button onClick={handleSubmitButton}>Añadir evidencia</button>
                            </th>
                            {años.map((año, index) => {
                                return(
                                    añoForm[index].year = año,
                                    <th className="tw-border tw-border-slate-600 tw-px-10 tw-bg-yellow-400 tw-rounded">
                                        <p> { año } </p>
                                    </th>
                                )
                            })}
                            <th className='tw-border tw-border-slate-600 tw-px-10 tw-bg-yellow-400 tw-rounded'>Acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Programación</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                        <input  type="text"
                                                name={`programacion-${año}`}
                                                value={añoForm[index].programed}
                                                className='tw-bg-gray-200' 
                                                onChange={(e) => handleInputaño("programed", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Ejecución física</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                        <input  type="text"
                                                name={`ejecFisica-${año}`}
                                                value={añoForm[index].phisicalExecuted}
                                                className='tw-bg-gray-200'
                                                onChange={(e) => handleInputaño("phisicalExecuted", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-bg-gray-200 tw-rounded">
                            {isNaN(acum) ? 0 : acum*100} %
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Ejecución financiera</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                        <input  type="text"
                                                name={`ejecFinanciera-${año}`}
                                                value={añoForm[index].finalcialExecuted}
                                                className='tw-bg-gray-200'
                                                onChange={(e) => handleInputaño("finalcialExecuted", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-bg-gray-200 tw-rounded"> 
                            ${isNaN(acumFinan) ? 0 : acumFinan}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }

    return (
        <div className="tw-container tw-mx-auto tw-my-3
                        tw-bg-gray-200
                        tw-grid tw-grid-cols-12
                        tw-border-8 
                        tw-border-gray-400 tw-rounded-md ">
            <div className='tw-cols-start-1 tw-col-span-full
                            tw-flex tw-justify-between
                            tw-px-3 tw-my-4
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <p> CloudControl </p>
                <p> Alcalcia Municipal, Nombre Plan, PISAMI </p>
                <p> Plan indicativo </p>
            </div>
            <div className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center">
            {nombres.length > 0 && nombres.map((nombre) => {
                return (
                    <div className="tw-flex mr-4">
                        <p className="tw-text-green-600 tw-font-bold">{nombre[1]}:</p> 
                        <span className="tw-pr-1"/> <p>{nombre[0]}</p>
                    </div>
                );
            })}
            </div>
            <div className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center">
                {unidadForm()}
            </div>
            <div className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center">
                {añosForm()}
            </div>

            <div className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center">
                <button type="button"
                        className=" tw-bg-blue-500 
                                    hover:tw-bg-blue-300 
                                    tw-text-white tw-font-bold 
                                    tw-py-2 tw-px-4 tw-my-5
                                    tw-rounded"
                        onClick={(e) => handleInput(e)}>
                    Guardar <br /> cambios
                </button>
            </div>
        </div>
    );
}
