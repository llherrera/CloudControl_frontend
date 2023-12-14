import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetLevelName } from "@/store/plan/thunks";
import { thunkGetUnit } from "@/store/unit/thunks";
import { thunkGetEvidence } from '@/store/evidence/thunks'
import { resetEvidence } from "@/store/evidence/evidenceSlice";

import { Token } from "../../interfaces";
import { getToken, decode } from "@/utils";
import { EvidenceDetail, BackBtn, SettingsBtn } from "@/components";

export const UnitNodePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const idPDT = location.state?.idPDT;
    const idNodo = location.state?.idNodo;

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
        let ids2 = ids.reduce((acumulator:string[], currentValue: string) => {
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
    }, []);

    useEffect(() => {
        if (unit === undefined || unit === null) return;
        let acumProgramed = 0;
        let acumPhisical = 0;
        let acumFinalcial = 0;
        for (let i = 0; i < unit!.years.length; i++) {
            acumProgramed += unit!.years[i].programed;
            acumPhisical += unit!.years[i].phisicalExecuted;
            acumFinalcial += unit!.years[i].finalcialExecuted;
        }
        setAcum( acumPhisical/acumProgramed );
        setAcumFinan( acumFinalcial );
    }, [unit]);

    const handleSubmitButton = () => {
        navigate(`/pdt/PlanIndicativo/Meta/evidencia`)
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
        navigate(`/pdt/PlanIndicativo`, {state: {id: idPDT}})
    }

    const handleSettings = () => {
        navigate(`/pdt/PlanIndicativo/Meta/configuracion`, {state: {id_plan: idPDT, id_nodo: idNodo}})
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
                        className="tw-bg-slate-400 hover:tw-bg-slate-200 
                                    tw-rounded tw-p-2
                                    tw-font-bold tw-text-white hover:tw-text-black">
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
                                        ${unit.years[index].finalcialExecuted}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className="tw-my-2">
                    <p className="  tw-mx-2 
                                    tw-border-x tw-border-t tw-border-black 
                                    tw-text-xl tw-text-center
                                    tw-bg-yellow-300
                                    tw-rounded-t">Total</p>
                    <div className="tw-flex tw-justify-between 
                                    tw-mx-2 
                                    tw-bg-gray-200
                                    tw-border tw-border-black">
                        <div className="tw-flex tw-flex-col tw-justify-center 
                                        tw-border-r tw-border-black
                                        tw-px-2">
                            <p className="  tw-text-center ">
                                Ejecución física
                            </p>
                            <p className="  tw-text-center
                                            tw-border-t tw-border-black">
                                {isNaN(acum) ? 0 : parseInt(acum.toString())*100}%
                            </p>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-center
                                        tw-px-2">
                            <p className="tw-text-center">
                                Ejecución financiera
                            </p>
                            <p className="  tw-text-center
                                            tw-border-t tw-border-black">
                                ${acumFinan}
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
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
                            tw-mb-4
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <img src="/src/assets/images/CloudControlIcon.png" alt="" width={100}/>
                <img src="/src/assets/images/Logo-Municipio.png" alt="" width={250} className="tw-invisible" />
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            <BackBtn handle={handleBack} id={parseInt(idPDT!)}/>
            <SettingsBtn handle={handleSettings} id={idPDT}/>
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
                                    hover:tw-bg-blue-300 hover:tw-text-black
                                    tw-text-white tw-font-bold 
                                    tw-py-2 tw-px-4 tw-my-5
                                    tw-rounded"
                        onClick={handleEvidence}>
                    Cargar <br /> evidencias
                </button>
            </div>
            {evidence.length > 0 ?
            <div className="tw-col-start-2 tw-col-end-12 tw-mb-4">
                <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">Evidencias</p>
                <table>
                    <thead>
                        <tr>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Fecha de seguimiento</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Descripción</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Comuna o Corregimiento</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Barrio o Vereda</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Unidad</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Cantidad</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Grupo poblacional</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Población beneficiada</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Fecha archivo</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Enlace</label>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <label className="tw-text-white">Acción</label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {evidence.map((evi, index) => (
                            <EvidenceDetail evi={evi} index={index}/>
                        ))}
                    </tbody>
                </table>
                </div> : null}
        </div>
    );
}
