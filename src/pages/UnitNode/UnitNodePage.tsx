import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetLevelName } from "@/store/plan/thunks";
import { thunkGetUnit } from "@/store/unit/thunks";
import { thunkGetEvidence } from '@/store/evidence/thunk'
import { resetEvidence } from "@/store/evidence/evidenceSlice";

import { addUnitNodeAndYears } from "../../services/api";
import { Token } from "../../interfaces";
import { getToken, decode } from "@/utils";
import { EvidenceDetail, BackBtn } from "@/components";

export const UnitNodePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { idPDT, idNodo } = useParams();
    const { namesTree } = useAppSelector(store => store.plan);
    const { unit } = useAppSelector(store => store.unit);
    const { evidence } = useAppSelector(store => store.evidence);

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
        navigate(`/pdt/${idPDT}/${idNodo}/evidencia`)
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

    const handleEvidence = () => {
        const id_ = parseInt(idPDT!)
        dispatch(thunkGetEvidence({id_plan: id_, codigo: unit!.code}))
        .unwrap()
        .then((res) => {
            if (res.length === 0) {
                alert('No hay evidencias para esta unidad')
            }
        })
    }

    const handleBack = () => {
        dispatch(resetEvidence())
        navigate(`/pdt/${idPDT}`)
    }

    const unidadForm = () => {
        if (unit === undefined || unit === null) return;
        return (
            <div className="tw-border tw-border-gray-400 tw-bg-white tw-mx-2 md:tw-mx-10">
                <div className="tw-px-1">
                    <p className="tw-text-2xl tw-font-bold">Codigo: {unit.code}</p>
                </div>
                <div className="tw-px-1 tw-mt-2 tw-border-y tw-border-black">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">Descripcion: {unit.description}</p>
                </div>
                <div className="tw-mx-1 tw-mt-2">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">Indicador: {unit.indicator}</p>
                </div>
                <div className="tw-px-1 tw-mt-2 tw-border-y tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">Línea base: {unit.base}</p>
                </div>
                <div className="tw-px-1 tw-mt-2">
                    <p className="tw-text-2xl tw-font-bold">Meta: {unit.goal}</p>
                </div>
            </div>
        )
    }

    const añosForm = () => {
        if (unit === undefined || unit === null) return;
        return(
            <div className="tw-border tw-border-slate-500 tw-rounded
                            tw-bg-white 
                            tw-px-2 tw-mt-3 tw-mx-2 md:tw-mx-10">
                <div className="tw-flex tw-justify-center tw-mt-2">
                {(rol === "admin") || (rol === 'funcionario' && id === parseInt(idPDT!)) ?
                <button onClick={handleSubmitButton}
                        className="tw-bg-slate-400 tw-rounded tw-p-2">
                    Añadir evidencia
                </button>
                : null
                }
                </div>
                <div className="tw-flex tw-flex-wrap tw-justify-center">
                {unit.years.map((item, index) => {
                    return(
                        <div key={index}
                            className="tw-my-2">
                            <p className="  tw-mx-2 
                                            tw-border-x tw-border-t tw-border-black 
                                            tw-text-xl tw-text-center
                                            tw-bg-yellow-300
                                            tw-rounded-t">{item.year}</p>
                            <div className="tw-flex tw-justify-between 
                                            tw-mx-2 
                                            tw-bg-gray-200
                                            tw-border tw-border-black">
                                <div className="tw-flex tw-flex-col tw-justify-center 
                                                tw-border-r tw-border-black
                                                tw-px-2
                                                tw-relative
                                                md:tw-block">
                                    <p className="  tw-text-center">
                                        Programación
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black
                                                    tw-mx-2
                                                    tw-absolute
                                                    tw-bottom-0 tw-inset-x-0">
                                        {unit.years[index].programed}
                                    </p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-justify-center 
                                                tw-border-r tw-border-black
                                                tw-px-2">
                                    <p className="  tw-text-center ">
                                        Ejecución física
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black">
                                        {unit.years[index].phisicalExecuted}
                                    </p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-justify-center
                                                tw-px-2">
                                    <p className="tw-text-center">
                                        Ejecución financiera
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black">
                                        {unit.years[index].finalcialExecuted}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        );
    }

/*
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
*/

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
                <img src="/src/assets/images/Logo-Municipio.png" alt="" width={250} className="tw-hidden md:tw-block" />
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            <BackBtn handleBack={handleBack} id={parseInt(idPDT!)}/>
            <ol className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center tw-flex-wrap">
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
                        onClick={handleEvidence}>
                    Cargar <br /> evidencias
                </button>
            </div>
            <ol className="tw-w-full md:tw-w-1/2
                            tw-flex tw-flex-col tw-justify-center
                            tw-mt-4">
                {evidence.length > 0 ? evidence.map((item, index) => {
                    return (
                        <li>
                            <EvidenceDetail eviden={item} index={index}/>
                        </li>
                    )
                }) : null}
            </ol>
        </div>
    );
}
