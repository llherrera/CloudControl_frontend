import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UpgradeIcon from '@mui/icons-material/Upgrade';
import IconButton from "@mui/material/IconButton";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetUnit, thunkUpdateIndicator } from "@/store/unit/thunks";
import { resetUnit } from "@/store/unit/unitSlice";
import { thunkGetEvidence } from '@/store/evidence/thunks'
import { resetEvidence, setPoints } from "@/store/evidence/evidenceSlice";
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";

import { decode, notify } from "@/utils";
import {
    ShowEvidence,
    BackBtn,
    DoubleBackBtn,
    SettingsBtn,
    HvBtn,
    UnitFrame } from "@/components";
import { Spinner } from "@/assets/icons";

export const UnitNodePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token_info } = useAppSelector(store => store.auth);
    const { rootTree, years } = useAppSelector(store => store.plan);
    const { unit, loadingUnit } = useAppSelector(store => store.unit);
    const { evidences } = useAppSelector(store => store.evidence);
    const {
        id_plan,
        node } = useAppSelector(store => store.content);

    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);

    const [showEvidence, setShowEvidence] = useState(false);
    const fileUpload = useRef<HTMLInputElement>(null);

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
        }
    }, []);

    useEffect(() => {
        if (id_plan === undefined || node === undefined) return;
        dispatch(thunkGetUnit({id_plan:id_plan.toString(), id_node: node.id_node}));
    }, []);

    useEffect(() => {
        if (unit === undefined || unit === null) return;
        let acumProgramed = 0;
        let acumPhisical = 0;
        let acumFinalcial = 0;
        for (const element of unit.years) {
            acumProgramed += element.physical_programming;
            acumPhisical += element.physical_execution;
            acumFinalcial += parseInt(element.financial_execution.toString());
        }
        setAcum( acumPhisical/acumProgramed );
        setAcumFinan( acumFinalcial );
    }, [unit]);

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file) {
            if (file[0].type !== 'application/pdf') {
                alert('El archivo debe ser pdf');
                e.target.value = '';
                return;
            }
            dispatch(thunkUpdateIndicator({id_node: node!.id_node, file: file![0]}));
        }
    };

    const handleSubmitButton = () => {
        dispatch(setPoints([]));
        navigate(`/pdt/PlanIndicativo/Meta/evidencia`);
    };

    const handleEvidence = () => {
        const id_ = parseInt(id_plan.toString());
        dispatch(thunkGetEvidence({id_plan: id_, code: unit.code}))
        .unwrap()
        .then((res) => {
            if (res.length === 0)
                notify('No hay evidencias para esta meta');
            else
                setShowEvidence(true);
        })
    };

    const handleStartReturn = () => {
        dispatch(AddRootTree([]));
        dispatch(resetEvidence());
        dispatch(resetUnit());
        dispatch(setZeroLevelIndex());
        navigate(-1);
    };

    const handleBack = () => {
        let newRoot = rootTree;
        newRoot = newRoot.slice(0, -1);
        dispatch(AddRootTree(newRoot));
        dispatch(resetEvidence());
        dispatch(resetUnit());
        navigate(-1);
    };

    const UploadBtn = () => (
        <div>
            <input  type="file" 
                    className="tw-hidden" 
                    id="inputFile"
                    ref={fileUpload}
                    onChange={handleChangeFile}/>
            <IconButton aria-label="delete"
                        size="small"
                        color="inherit"
                        title="Actualizar Hoja de vida"
                        onClick={() => fileUpload.current?.click()}>
                <UpgradeIcon/>
            </IconButton>
        </div>
    );

    const handleSettings = () => navigate(`/pdt/PlanIndicativo/Meta/configuracion`);

    const TernaryIndicatorShow = () => (
        (unit.hv_indicator === '' || 
        unit.hv_indicator === null || 
        unit.hv_indicator === undefined) ?
        null : <HvBtn link={unit.hv_indicator}/>
    );

    const TernaryIndicator = () => (
        (rol === 'admin' || 
        ((rol === 'funcionario' || rol === 'planeacion') 
        && id === id_plan)) ? <UploadBtn/> : null
    );

    const unidadForm = () => {
        if (unit === undefined || unit === null) return;
        return (
            <div className="tw-border tw-border-slate-500 
                            tw-bg-white tw-mx-2 md:tw-mx-10">
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Codigo: {unit.code}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">
                        Descripcion: {unit.description}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Línea base: {unit.base}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Meta: {unit.goal}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">
                        Indicador: {unit.indicator}
                    </p>
                </div>
                <div className="tw-px-1">
                    <div className="tw-text-2xl tw-font-bold tw-text-justify">
                        Hoja de Vida Indicador:
                        <TernaryIndicatorShow/>
                        <TernaryIndicator/>
                    </div>
                </div>
            </div>
        );
    };

    const yearsForm = () => {
        if (unit === undefined || unit === null) return;
        return(
            <div className="tw-border tw-border-slate-500 
                            tw-rounded tw-bg-white 
                            tw-px-2 tw-mt-3 tw-mx-2 md:tw-mx-10">
                <div className="tw-flex tw-justify-center tw-mt-2">
                {(rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === id_plan) ?
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
                {unit.years.map((item, index) => (
                        <div key={index}
                            className="tw-my-2">
                            <p className="  tw-mx-2 
                                            tw-border-x tw-border-t tw-border-black 
                                            tw-text-xl tw-text-center
                                            tw-bg-yellow-300
                                            tw-rounded-t">
                                {years[index]}
                            </p>
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
                                        {item.physical_programming}
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
                                        {item.physical_execution}
                                    </p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-justify-center
                                                tw-px-2">
                                    <p className="tw-text-center">
                                        Ejecución financiera
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black">
                                        ${item.financial_execution.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                    </p>
                                </div>
                            </div>
                        </div>
                ))}
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
                                {isNaN(acum) ? 0 : parseFloat((acum*100).toFixed(2))}%
                            </p>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-center
                                        tw-px-2">
                            <p className="tw-text-center">
                                Ejecución financiera
                            </p>
                            <p className="  tw-text-center
                                            tw-border-t tw-border-black">
                                ${acumFinan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    };

    const ternary = evidences.length > 0 ?
    <div className="tw-mb-4">
        <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">Evidencias</p>
        <table>
            <thead>
                <tr>
                    <th className={`tw-bg-black tw-border`}>
                        <p className="tw-text-white">Fecha de seguimiento</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden lg:tw-table-cell`}>
                        <p className="tw-text-white">Descripción</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden lg:tw-table-cell`}>
                        <p className="tw-text-white">Comuna o Corregimiento</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden md:tw-table-cell`}>
                        <p className="tw-text-white">Barrio o Vereda</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden md:tw-table-cell`}>
                        <p className="tw-text-white">Unidad</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden md:tw-table-cell`}>
                        <p className="tw-text-white">Cantidad</p>
                    </th>
                    <th className={`tw-bg-black tw-border `}>
                        <p className="tw-text-white">Grupo poblacional</p>
                    </th>
                    <th className={`tw-bg-black tw-border`}>
                        <p className="tw-text-white">Población beneficiada</p>
                    </th>
                    <th className={`tw-bg-black tw-border 
                                    tw-hidden md:tw-table-cell`}>
                        <p className="tw-text-white">Fecha archivo</p>
                    </th>
                    <th className={`tw-bg-black tw-border`}>
                        <p className="tw-text-white">Enlace</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {evidences.map((evi, index) => (
                    <ShowEvidence evi={evi} index={index} key={evi.id_evidence}/>
                ))}
            </tbody>
        </table>
    </div> : <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">
        No hay evidencias cargadas
    </p>

    return (
        loadingUnit ? <Spinner/>:
        <UnitFrame>
            <DoubleBackBtn handle={handleStartReturn} id={id_plan}/>
            <BackBtn handle={handleBack} id={id_plan}/>
            {rol === 'admin' || (rol === 'funcionario' && id === id_plan) ?
                <SettingsBtn handle={handleSettings} id={id_plan}/>
                : null
            }
            <ol className="tw-flex tw-justify-center tw-flex-wrap">
            {rootTree.map((name) => (
                <li className="tw-flex tw-mx-3" key={name[0]}>
                    <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p> 
                    <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                </li>
            ))}
            </ol>
            <div className="tw-flex tw-justify-center">
                {unidadForm()}
            </div>
            <div className="tw-flex tw-justify-center">
                {yearsForm()}
            </div>

            <div className="tw-flex tw-justify-center">
                <button type="button"
                        className=" tw-bg-blue-500 
                                    hover:tw-bg-blue-300 hover:tw-text-black
                                    tw-text-white tw-font-bold 
                                    tw-py-2 tw-px-4 tw-my-5
                                    tw-rounded"
                        onClick={handleEvidence}>
                    Mostrar <br /> evidencias
                </button>
            </div>
            {showEvidence ? ternary : null}
        </UnitFrame>
    );
}
