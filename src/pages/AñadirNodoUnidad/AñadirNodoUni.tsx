import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetLevelName } from "@/store/plan/thunks";
import { thunkGetUnit } from "@/store/unit/thunks";

import { addUnitNodeAndYears } from "../../services/api";
import { Token } from "../../interfaces";
import { getToken, decode } from "@/utils";

export const AñadirNodoUni = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { idPDT, idNodo } = useParams();
    const { namesTree } = useAppSelector(store => store.plan);
    const { unit } = useAppSelector(store => store.unit);

    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        const gettoken = getToken()
        try {
            const {token} = gettoken ? gettoken : null
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
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
        dispatch(thunkGetLevelName(ids2))
    }, []);

    useEffect(() => {
        dispatch(thunkGetUnit({idPDT:idPDT!, idNode:idNodo!}))
        if (unit) {
            let acumProgramed = 0;
            let acumPhisical = 0;
            let acumFinalcial = 0;
            for (let i = 0; i < unit.years.length; i++) {
                acumProgramed += unit.years[i].programed;
                acumPhisical += unit.years[i].phisicalExecuted;
                acumFinalcial += unit.years[i].finalcialExecuted;
            }
            setAcum( acumPhisical/acumProgramed );
            setAcumFinan( acumFinalcial );
        }
    }, []);

    const handleSubmitButton = () => {
        navigate(`/pdt/${idPDT}/${idNodo}/añadirEvidencia`)
    }

    const handleInput = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (unit === undefined || unit === null) return;
        if (unit.goal === 0 || unit.code === '' || unit.description === '' || unit.indicator === '')
            return alert('Faltan campos por llenar')
        let temp = 0;
        for (let i = 0; i < unit.years.length; i++) {
            if (unit.years[i].programed > 0)
                temp++;
            if (temp > 0)
                break;
        }
        if (temp === 0)
            return alert('Faltan campos por llenar')
        
        try {
            addUnitNodeAndYears(idPDT!, idNodo!, unit, unit.years).then((res) => {
                if (res === undefined)
                    return alert('No se pudo añadir la unidad')
                alert('Unidad añadida con éxito');
            });
        } catch (error) {
            console.log(error);
        }
    }

    const unidadForm = () => {
        if (unit === undefined || unit === null) return;
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
                            <th className="tw-border tw-border-slate-600 tw-bg-gray-200 tw-text-center tw-rounded">Código de la meta: </th>
                            <th className="tw-border tw-border-slate-600 tw-rounded">
                                <input  type="text"
                                        name="code"
                                        value={unit.code}
                                        className="tw-bg-gray-200 tw-text-center"
                                        required/>
                            </th>
                            <th className="tw-border tw-border-slate-600 tw-px-2 tw-text-center tw-bg-gray-200 tw-rounded">Línea base</th>
                            <th className="tw-border tw-border-slate-600 tw-rounded">
                                <input  type="text"
                                        name="base"
                                        value={unit.base}
                                        className="tw-bg-gray-200 tw-text-center"
                                        required/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-text-center tw-bg-gray-200 tw-rounded">Descripción de la meta: </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <textarea
                                    name="description"
                                    value={unit.description}
                                    className={`tw-bg-gray-200 tw-break-words tw-resize-none tw-w-full tw-h-20`}
                                    required/>
                            </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-text-center tw-bg-gray-200 tw-rounded">Meta</td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <input  type="text"
                                        name="goal"
                                        value={unit.goal}
                                        className="tw-bg-gray-200 tw-text-center"
                                        required/>
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-text-center tw-bg-gray-200 tw-rounded">Indicador de meta: </td>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded">
                                <textarea
                                    name="indicator"
                                    value={unit.indicator}
                                    className="tw-bg-gray-200 tw-break-words tw-resize-none tw-w-full tw-h-20"
                                    required/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        )
    }

    const añosForm = () => {
        if (unit === undefined || unit === null) return;
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
                                {(rol === "admin") || (rol === 'funcionario' && id === parseInt(idPDT!)) ? 
                                <button onClick={handleSubmitButton}>Añadir evidencia</button>
                                : null
                                }
                            </th>
                            {unit.years.map((item, index) => {
                                return(
                                    <th className="tw-border tw-border-slate-600 tw-px-10 tw-bg-yellow-400 tw-rounded"
                                        key={index}>
                                        <p> { item.year } </p>
                                    </th>
                                )
                            })}
                            <th className='tw-border tw-border-slate-600 tw-px-10 tw-bg-yellow-400 tw-rounded'>Acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Programación</td>
                            {unit.years.map((item, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded"
                                        key={index}>
                                        <input  type="text"
                                                name={`programacion-${item.year}`}
                                                value={unit.years[index].programed}
                                                className='tw-bg-gray-200' 
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Ejecución física</td>
                            {unit.years.map((item, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded"
                                        key={index}>
                                        <input  type="text"
                                                name={`ejecFisica-${item.year}`}
                                                value={unit.years[index].phisicalExecuted}
                                                className='tw-bg-gray-200'
                                                size={10}
                                                required/>
                                    </td>
                                )
                            })}
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-bg-gray-200 tw-rounded">
                            {(isNaN(acum) ? 0 : acum*100).toFixed(2)} %
                            </td>
                        </tr>
                        <tr>
                            <td className="tw-border tw-border-slate-600 tw-font-bold tw-px-2 tw-rounded">Ejecución financiera</td>
                            {unit.years.map((item, index) => {
                                return(
                                    <td className="tw-border tw-border-slate-600 tw-font-bold tw-rounded"
                                        key={index}>
                                        <input  type="text"
                                                name={`ejecFinanciera-${item.year}`}
                                                value={unit.years[index].finalcialExecuted}
                                                className='tw-bg-gray-200'
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
                <img src="/src/assets/images/Logo.png" alt="" width={100} />
                <img src="/src/assets/images/Logo-Municipio.png" alt="" width={250} />
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            <ol className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center">
            {namesTree.length > 0 && namesTree.map((name, index) => {
                return (
                    <li className="tw-flex tw-mx-3" key={index}>
                        <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p> 
                        <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                    </li>
                );
            })}
            </ol>
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
