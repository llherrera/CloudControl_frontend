import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addNodoUnidadYAños, getNombreNivel, getNodoUnidadYAños } from "../../services/api";
import { AñoFormState, UnidFormState } from "../../interfaces";

export const AñadirNodoUni = () => {
    const navigate = useNavigate()
    const { idPDT, idNodo } = useParams();

    const [nombres, setNombres] = useState([[]]);

    const años = [2020,2021,2022,2023];

    const [unidForm, setUnidForm] = useState<UnidFormState>({
        codigo: '',
        descripcion: '',
        indicador: '',
        base: 0,
        meta: 0,
    });

    const [añoForm, setañoForm] = useState({
        año: [],
        programacion: [],
        ejecFisica: [],
        ejecFinanciera: [],
    } as AñoFormState);

    let añosTemp = {
        año: [] as number[],
        programacion: [] as number[],
        ejecFisica: [] as number[],
        ejecFinanciera: [] as number[],
    };

    React.useEffect(() => {
        try {
            const ids = idNodo!.split('.');
            let ids2 = ids.reduce((acumulator:any, currentValue) => {
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
                const { Nodo, Años } = res;
                if (Nodo === undefined) {
                    return;
                }
                setUnidForm({codigo: Nodo.Codigo,
                             descripcion: Nodo.Descripcion,
                             indicador: Nodo.Indicador,
                             base: Nodo.Linea_base,
                             meta: Nodo.Meta,
                });

                Años.forEach((dato:any) => {
                    const año = new Date(dato.Año).getFullYear();
                    añosTemp.año.push(año);
                    añosTemp.programacion.push(dato.Programacion_fisica);
                    añosTemp.ejecFisica.push(dato.Ejecucion_Fisica);
                    añosTemp.ejecFinanciera.push(dato.Ejecucion_financiera);
                });
                setañoForm(añosTemp);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleSubmitButton = () => {
        navigate(`/pdt/${idPDT}/${idNodo}/añadirEvidencia`)
    }

    const handleInput = (e: any) => {
        e.preventDefault();
        addNodoUnidadYAños(idPDT!, idNodo!, unidForm, añoForm);
    }

    const handleInputUnid = (e: any) => {
        setUnidForm({
            ...unidForm,
            [e.target.name]: e.target.value,
        });
    }

    const handleUnidadSubmit = (e: any) => {
        e.preventDefault();
        console.log(unidForm);
    }

    const handleInputaño = (grupo: keyof AñoFormState, index: number, valor: any) => {
        const nuevosValores = [...añoForm[grupo]];
        nuevosValores[index] = valor;
        setañoForm({
            ...añoForm,
            [grupo]: nuevosValores,
        });
    }

    const handleañosSubmit = (e: any) => {
        e.preventDefault();
        console.log(añoForm);
    }

    const unidadForm = () => {
        return (
            <form   onSubmit={handleUnidadSubmit}
                className="mt-5">
                <table className  ="border-separate 
                                    border-spacing-2 
                                    border border-slate-500
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
                                        onChange={handleInputUnid}/>
                            </th>
                            <th className="border border-slate-600 px-2 bg-gray-200 rounded">Línea base</th>
                            <th className="border border-slate-600 rounded">
                                <input  type="text"
                                        name="base"
                                        value={unidForm.base}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}/>
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
                                        onChange={handleInputUnid}/>
                            </td>
                            <td className="border border-slate-600 font-bold bg-gray-200 rounded">Meta</td>
                            <td className="border border-slate-600 font-bold rounded">
                                <input  type="text"
                                        name="meta"
                                        value={unidForm.meta}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}/>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-slate-600 font-bold bg-gray-200 rounded">Indicador de meta: </td>
                            <td className="border border-slate-600 font-bold rounded">
                                <input  type="text"
                                        name="indicador"
                                        value={unidForm.indicador}
                                        className="bg-gray-200" 
                                        onChange={handleInputUnid}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        )
    }

    const añosForm = () => {
        return(
            <form   onSubmit={handleañosSubmit}
                    className="mt-5">
                <table className  ="border-separate 
                                    border-spacing-2
                                    border border-slate-500
                                    bg-white
                                    rounded">
                    <thead>
                        <tr>
                            <th className ='border border-slate-600 
                                            rounded bg-slate-300'> 
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
                                                value={añoForm.programacion[index] ?? 0}
                                                className='bg-gray-200' 
                                                onChange={(e) => handleInputaño("programacion", index, e.target.value)}
                                                size={10}/>
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
                                                value={añoForm.ejecFisica[index] ?? 0}
                                                className='bg-gray-200'
                                                onChange={(e) => handleInputaño("ejecFisica", index, e.target.value)}
                                                size={10}/>
                                    </td>
                                )
                            })}
                            <td className="border border-slate-600 font-bold px-2 bg-gray-200 rounded"> {
                                añoForm.programacion.reduce((a, b) => a + b, 0) === 0
                                ? 0 // Evitar división por cero si la suma de programacion es 0
                                : (
                                    añoForm.ejecFisica.reduce((a, b) => (a || 0) + (b || 0), 0) /
                                    añoForm.programacion.reduce((a, b) => a + b, 0)
                                ) * 100} %
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-slate-600 font-bold px-2 rounded">Ejecución financiera</td>
                            {años.map((año, index) => {
                                return(
                                    <td className="border border-slate-600 font-bold rounded">
                                        <input  type="text"
                                                name={`ejecFinanciera-${año}`}
                                                value={añoForm.ejecFinanciera[index] ?? 0}
                                                className='bg-gray-200'
                                                onChange={(e) => handleInputaño("ejecFinanciera", index, e.target.value)}
                                                size={10}/>
                                    </td>
                                )
                            })}
                            <td className="border border-slate-600 font-bold px-2 bg-gray-200 rounded"> ${añoForm.ejecFinanciera.reduce((a, b) => a + b, 0)/2} </td>
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
                        border-8 border-gray-400 rounded-md ">
            <div className='cols-start-1 col-span-full
                            flex
                            justify-between
                            px-3 my-4
                            shadow-2xl
                            border-b-2 border-gray-400
                            z-40'>
                <p> CloudControl </p>
                <p> Alcalcia Municipal, Nombre Plan, PISAMI </p>
                <p> Plan indicativo </p>
            </div>
            <div className="col-start-1 col-span-full flex justify-center">
            {nombres.map((nombre) => {
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
                        className ="bg-blue-500 hover:bg-blue-300 
                                    text-white font-bold 
                                    py-2 px-4 my-5
                                    rounded"
                        onClick={handleInput}>
                    Guardar <br /> cambios
                </button>
            </div>
        </div>
    );
}
