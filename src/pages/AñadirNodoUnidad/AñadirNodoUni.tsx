import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addNodoUnidadYAños, getNombreNivel, getNodoUnidadYAños, getProgresoTotal } from "../../services/api";
import { AñoFormState, UnidFormState, DetalleAño, PesosNodos, Porcentaje } from "../../interfaces";

export const AñadirNodoUni = () => {
    const navigate = useNavigate()
    const { idPDT, idNodo } = useParams();

    const [nombres, setNombres] = useState([[]]);

    const años = [2020,2021,2022,2023];
    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);
    const [add, setAdd] = useState(false);
    const [getProgress, setGetProgress] = useState(false);

    const [unidForm, setUnidForm] = useState<UnidFormState>({
        codigo: '',
        descripcion: '',
        indicador: '',
        base: 0,
        meta: 0,
    });

    const [añoForm, setañoForm] = useState<AñoFormState>({
        año: [],
        programacion: [],
        ejecFisica: [],
        ejecFinanciera: [],
    });

    let añosTemp = {
        año: [] as number[],
        programacion: [] as number[],
        ejecFisica: [] as number[],
        ejecFinanciera: [] as number[],
    };

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
                const { Nodo } = res;
                if (Nodo === undefined) return;
                const { Codigo, Descripcion, Indicador, Linea_base, Meta } = Nodo;
                if (Codigo === undefined || Descripcion === undefined || Indicador === undefined || Linea_base === undefined || Meta === undefined) return;
                setUnidForm({codigo: Nodo.Codigo,
                             descripcion: Nodo.Descripcion,
                             indicador: Nodo.Indicador,
                             base: Nodo.Linea_base,
                             meta: Nodo.Meta,
                });
                const detalleAño = localStorage.getItem('detalleAño');
                if (detalleAño === null) 
                    return;
                const detalleAñoJSON = JSON.parse(detalleAño);
                const Años = detalleAñoJSON.filter((dato:DetalleAño) => dato.id_nodo === idNodo);
                Años.forEach((dato:DetalleAño) => {
                    const año = new Date(dato.Año).getFullYear();
                    añosTemp.año.push(año);
                    añosTemp.programacion.push(dato.Programacion_fisica);
                    añosTemp.ejecFisica.push(dato.Ejecucion_Fisica);
                    añosTemp.ejecFinanciera.push(dato.Ejecucion_financiera);
                });
                setañoForm(añosTemp);
                const temp = calcularAcumulado( años, añosTemp);
                setAcum(temp);
            });
        } catch (error) {
            console.log('err');
        }
    }, [add]);

    const calcularAcumulado = (años: number[], añoForm: AñoFormState) => {
        let acumulado = 0;
        let acum = 0;
        let finan = 0;
        años.map((año: number, index: number) => {
            if (añoForm.programacion[index] !== 0) {
                acum++;
                acumulado += (añoForm.ejecFisica[index]) / (añoForm.programacion[index]);
            }
            finan += añoForm.ejecFinanciera[index];
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
        if (unidForm.meta === 0 || unidForm.codigo === '' || unidForm.descripcion === '' || unidForm.indicador === '')
            return alert('Faltan campos por llenar')
        let temp = 0;
        for (let i = 0; i < añoForm.año.length; i++) {
            if (añoForm.programacion[i] > 0)
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

    const handleInputaño = (grupo: keyof AñoFormState, index: number, valor: string) => {
        const nuevosValores = [...añoForm[grupo]];
        nuevosValores[index] = parseFloat(valor);
        setañoForm({
            ...añoForm,
            [grupo]: nuevosValores,
        });
    }

    const unidadForm = () => {
        return (
            <form   className="mt-5">
                <table className  ="border-separate 
                                    border-spacing-2 
                                    border 
                                    border-slate-500
                                    bg-white
                                    rounded">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 bg-gray-200 rounded">Código de la meta: </th>
                            <th className="border border-slate-600 rounded">
                                <input  type="text"
                                        name="codigo"
                                        value={unidForm.codigo}
                                        className="bg-gray-200" 
                                        onChange={ (e) => handleInputUnid(e)}
                                        required/>
                            </th>
                            <th className="border border-slate-600 px-2 bg-gray-200 rounded">Línea base</th>
                            <th className="border border-slate-600 rounded">
                                <input  type="text"
                                        name="base"
                                        value={unidForm.base}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-600 font-bold px-2 bg-gray-200 rounded">Descripción de la meta: </td>
                            <td className="border border-slate-600 font-bold rounded">
                                <input  type="text"
                                        name="descripcion"
                                        value={unidForm.descripcion}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </td>
                            <td className="border border-slate-600 font-bold bg-gray-200 rounded">Meta</td>
                            <td className="border border-slate-600 font-bold rounded">
                                <input  type="text"
                                        name="meta"
                                        value={unidForm.meta}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}
                                        required/>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-slate-600 font-bold bg-gray-200 rounded">Indicador de meta: </td>
                            <td className="border border-slate-600 font-bold rounded">
                                <input  type="text"
                                        name="indicador"
                                        value={unidForm.indicador}
                                        className="bg-gray-200" 
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
            añoForm.ejecFisica[index] = añoForm.ejecFisica[index] ?? 0;
            añoForm.programacion[index] = añoForm.programacion[index] ?? 0;
            añoForm.ejecFinanciera[index] = añoForm.ejecFinanciera[index] ?? 0;
        });
        return(
            <form   className="mt-5">
                <table className  ="border-separate 
                                    border-spacing-2
                                    border 
                                    border-slate-500
                                    bg-white
                                    rounded">
                    <thead>
                        <tr>
                            <th className ='border 
                                            border-slate-600 
                                            bg-slate-300
                                            rounded'> 
                                <button onClick={handleSubmitButton}>Añadir evidencia</button>
                            </th>
                            {años.map((año, index) => {
                                return(
                                    añoForm.año[index] = año,
                                    <th className="border border-slate-600 px-10 bg-yellow-400 rounded">
                                        <p> { año } </p>
                                    </th>
                                )
                            })}
                            <th className='border border-slate-600 px-10 bg-yellow-400 rounded'>Acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-600 font-bold px-2 rounded">Programación</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="border border-slate-600 font-bold rounded">
                                        <input  type="text"
                                                name={`programacion-${año}`}
                                                value={añoForm.programacion[index]}
                                                className='bg-gray-200' 
                                                onChange={(e) => handleInputaño("programacion", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="border border-slate-600 font-bold px-2 rounded">Ejecución física</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="border border-slate-600 font-bold rounded">
                                        <input  type="text"
                                                name={`ejecFisica-${año}`}
                                                value={añoForm.ejecFisica[index]}
                                                className='bg-gray-200'
                                                onChange={(e) => handleInputaño("ejecFisica", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                            <td className="border border-slate-600 font-bold px-2 bg-gray-200 rounded">
                            {isNaN(acum) ? 0 : acum*100} %
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-slate-600 font-bold px-2 rounded">Ejecución financiera</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="border border-slate-600 font-bold rounded">
                                        <input  type="text"
                                                name={`ejecFinanciera-${año}`}
                                                value={añoForm.ejecFinanciera[index]}
                                                className='bg-gray-200'
                                                onChange={(e) => handleInputaño("ejecFinanciera", index, e.target.value)}
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                            <td className="border border-slate-600 font-bold px-2 bg-gray-200 rounded"> 
                            ${isNaN(acumFinan) ? 0 : acumFinan}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }

    return (
        <div className="container mx-auto my-3
                        bg-gray-200
                        grid grid-cols-12
                        border-8 
                        border-gray-400 rounded-md ">
            <div className='cols-start-1 col-span-full
                            flex justify-between
                            px-3 my-4
                            shadow-2xl
                            border-b-2 border-gray-400
                            z-40'>
                <p> CloudControl </p>
                <p> Alcalcia Municipal, Nombre Plan, PISAMI </p>
                <p> Plan indicativo </p>
            </div>
            <div className="col-start-1 col-span-full flex justify-center">
            {nombres.length > 0 && nombres.map((nombre) => {
                return (
                    <div className="flex mr-4">
                        <p className="text-green-600 font-bold">{nombre[1]}:</p> 
                        <span className="pr-1"/> <p>{nombre[0]}</p>
                    </div>
                );
            })}
            </div>
            <div className="col-start-1 col-span-full flex justify-center">
                {unidadForm()}
            </div>
            <div className="col-start-1 col-span-full flex justify-center">
                {añosForm()}
            </div>

            <div className="col-start-1 col-span-full flex justify-center">
                <button type="button" 
                        className ="bg-blue-500 
                                    hover:bg-blue-300 
                                    text-white font-bold 
                                    py-2 px-4 my-5
                                    rounded"
                        onClick={(e) => handleInput(e)}>
                    Guardar <br /> cambios
                </button>
            </div>
        </div>
    );
}
