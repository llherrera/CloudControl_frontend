import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetEvidences, thunkGetEvidenceCount } from "@/store/evidence/thunks";
import { resetEvidence } from "@/store/evidence/evidenceSlice";

import { Frame, EvidenceDetail, BackBtn } from "@/components";

export const ListEvidence = () => {
    return (
        <Frame data={<Evidence />}/>
    )
}

const Evidence = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { plan } = useAppSelector(store => store.plan);
    const { evidence, eviCount } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);

    const [page, setPage] = useState(1);

    useEffect(() => {        
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidenceCount(id_plan))
        } else {
            dispatch(thunkGetEvidenceCount(id_plan))
        }
    }, [evidence])

    useEffect(() => {
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidences({id_plan, page}))
        }else{
            dispatch(thunkGetEvidences( {id_plan, page}))
        }
    }, [page, eviCount])

    const handlePage = (page: number) => {
        setPage(page)
    }

    const handleBack = () => {
        dispatch(resetEvidence())
        navigate(`/pdt/PlanIndicativo`, {state: {id: id_plan}})
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-3">
            <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                <BackBtn handle={handleBack} id={id_plan}/>
                Evidencias por aprobar
            </p>
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
                    {evidence?.length === 0 || evidence ? evidence.map((evi, index) => (
                        <EvidenceDetail evi={evi} index={index} key={index}/>
                        
                    )) : <span>No hay evidencias</span>}
                </tbody>
            </table>
            
            {evidence?.length === 0 || evidence ? 
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
                {page*10 < eviCount ?
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