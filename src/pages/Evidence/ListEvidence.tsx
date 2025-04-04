import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetEvidenceCount, thunkGetExecutionsToApro } from "@/store/evidence/thunks";
import { resetEvidence } from "@/store/evidence/evidenceSlice";

import { Frame, BackBtn, Execution } from "@/components";
import { decode } from "@/utils";

export const ListEvidence = () => {
    return (
        <Frame>
            <Evidence />
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
        dispatch(thunkGetExecutionsToApro( {id: id_plan, page}));
    }, []);

    const handlePage = (page: number) => setPage(page);

    const handleBack = () => {
        dispatch(resetEvidence());
        navigate(-1);
    };

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-3">
            <div className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                <BackBtn handle={handleBack} id={id_plan}/>
                {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ?
                    <button className={`tw-mr-2 tw-mb-2 tw-p-2
                                        tw-rounded tw-border-2 tw-border-black
                                        tw-bg-greenBtn hover:tw-bg-green-200
                                        tw-text-white hover:tw-text-black`}>
                        Ejecuciones por aprobar
                    </button>
                    : <p>No tiene permisos suficientes</p>
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Codigo de Meta</p>
                        </th>
                        <th className="tw-bg-black tw-border">
                            <p className="tw-text-white">Año de ejecucion</p>
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
                    {executes.length > 0 ? executes.map((ex, index) =>
                        <Execution ex={ex} index={index} key={index}/>
                    ) : <tr><th><p>No hay evidencias</p></th></tr>}
                </tbody>
            </table>

            {evidences.length === 0 || evidences ?
            <div className="tw-w-full md:tw-w-1/2
                            tw-flex tw-justify-between
                            tw-mt-3">
                {page > 1 ?
                <button onClick={() => handlePage(page-1)}
                        className=" tw-py-2 tw-px-3
                                    tw-font-bold tw-text-xl
                                    tw-bg-slate-400 hover:tw-bg-slate-500
                                    tw-rounded tw-border">{'<'}</button>
                : <div></div>
                }
                {page*10 < evi_count ?
                <button onClick={() => handlePage(page+1)}
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