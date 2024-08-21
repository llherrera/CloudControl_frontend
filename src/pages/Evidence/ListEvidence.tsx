import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { 
    thunkGetEvidences, 
    thunkGetEvidenceCount, 
    thunkGetUserEvidences,
    thunkGetExecutionsToApro } from "@/store/evidence/thunks";
import { resetEvidence } from "@/store/evidence/evidenceSlice";

import {
    Frame,
    EvidenceDetail,
    BackBtn,
    MyEvidence,
    Execution } from "@/components";
import { decode } from "@/utils";

export const ListEvidence = () => {
    return (
        <Frame>
            {<Evidence />}
        </Frame>
    );
}

const Evidence = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token_info } = useAppSelector(store => store.auth);
    const { evidences, executes, evi_count } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);

    const [page, setPage] = useState(1);
    const [opt, setOpt] = useState(1);

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
        dispatch(thunkGetEvidenceCount(id_plan));
    }, [evidences]);

    useEffect(() => {
        dispatch(thunkGetExecutionsToApro( {id: id_plan, page}));
    }, [page, evi_count]);

    useEffect(() => {
        if (opt === 0)
            dispatch(thunkGetExecutionsToApro( {id: id_plan, page}));
        else if (opt === 1)
            dispatch(thunkGetUserEvidences({page, id_plan}));
    }, [opt]);

    const handlePage = (page: number) => setPage(page);

    const handleBack = () => {
        dispatch(resetEvidence());
        navigate(-1);
    };

    const handleOpt = (opt: number) => {
        setPage(1);
        setOpt(opt);
    };

    const handleBtnOpt = () => {
        (rol === 'admin' || 
            ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ? 
            handleOpt(1) : alert("No tienes permisos")
        )
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-3">
            <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                <BackBtn handle={handleBack} id={id_plan}/>
                {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ? 
                    <button className={`tw-mr-2 tw-mb-2 tw-p-2 tw-rounded
                        ${opt === 0 ? 'tw-bg-greenBtn hover:tw-bg-green-200 tw-border-2 tw-border-black tw-text-white hover:tw-text-black'
                        : 'tw-bg-gray-300 hover:tw-bg-gray-200'}`}
                            onClick={()=>handleOpt(0)}>
                        Ejecuciones por aprobar
                    </button>
                    : null
                }
                <button className={`tw-mr-2 tw-mb-2 tw-p-2 tw-rounded
                                    ${opt === 1 ? 'tw-bg-greenBtn hover:tw-bg-green-200 tw-border-2 tw-border-black tw-text-white hover:tw-text-black'
                                    : 'tw-bg-gray-300 hover:tw-bg-gray-200'}`}
                        onClick={handleBtnOpt}>
                    Mis evidencias
                </button>
            </p>
            {opt === 0 ?
            <table>
                <thead>
                    <tr>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Codigo de Meta</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Fecha</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Ejecución física</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Ejecución modificada</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Fecha de modificación</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Usuario</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Acción</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {executes.length > 0 ? executes.map((ex, index) => (
                        <Execution ex={ex} index={index} key={index}/>
                    )) : <tr><th><p>No hay evidencias</p></th></tr>}
                </tbody>
            </table>
            :
            <table>
                <thead>
                    <tr>
                        <th className="tw-bg-black tw-border tw-px-3">
                            <p className="tw-text-white">Id</p>
                        </th>
                        <th className="tw-bg-black tw-border tw-px-3">
                            <p className="tw-text-white">Código</p>
                        </th>
                        <th className="tw-bg-black tw-border tw-px-3">
                            <p className="tw-text-white">Editar</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {evidences.length > 0 ? evidences.map((evi) => (
                        <MyEvidence evidence={evi} key={evi.id_evidence}/>
                    )) : <tr><th><p>No hay evidencias</p></th></tr>}
                </tbody>
            </table>
            }
            
            {evidences.length === 0 || evidences ? 
            <div className="tw-w-full md:tw-w-1/2
                            tw-flex tw-justify-between
                            tw-mt-3">
                {page > 1 ? 
                <button onClick={()=>{handlePage(page-1)}}
                        className=" tw-py-2 tw-px-3 
                                    tw-font-bold tw-text-xl
                                    tw-bg-slate-400 hover:tw-bg-slate-500
                                    tw-rounded tw-border">{'<'}</button>
                : <div></div>
                }
                {page*10 < evi_count ?
                <button onClick={()=>handlePage(page+1)}
                        className=" tw-py-2 tw-px-3
                                    tw-font-bold tw-text-xl
                                    tw-bg-slate-400 hover:tw-bg-slate-500
                                    tw-rounded tw-border">{'>'}</button>
                : <div></div>
                }
            </div> : null}
        </div>
    );
}