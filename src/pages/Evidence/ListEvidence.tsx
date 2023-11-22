import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetEvidence, thunkGetEvidences, thunkGetEvidenceCount } from "@/store/evidence/thunk";

import { EvidenceInterface } from '@/interfaces';
import { Frame } from "@/components";

export const ListEvidence = () => {
    return (
        <Frame data={<Evidence />}/>
    )
}

const Evidence = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { plan } = useAppSelector(store => store.plan)
    const { evidence, eviCount } = useAppSelector(store => store.evidence)

    const [page, setPage] = useState(1)

    useEffect(() => {
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidenceCount(id_plan))
        }
    }, [])

    useEffect(() => {
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidences({id_plan, page}))
        }
    }, [page])

    const handlePage = (page: number) => {
        setPage(page)
    }

    const handleBtnEvidence = (evidence: EvidenceInterface) => {
        navigate(`/evidencia`, { state: { evidence } })
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-3">
            <ol className=" tw-w-full md:tw-w-1/2
                            tw-flex tw-flex-col
                            tw-mt-4">
                {evidence?.length === 0 || evidence ? evidence.map((evi, index) => (
                    <button key={index} 
                            className=" tw-border tw-rounded
                                        tw-flex tw-flex-col
                                        tw-my-1 tw-pl-2 tw-py-2
                                        tw-bg-slate-300 hover:tw-bg-slate-500
                                        tw-relative"
                            onClick={()=>handleBtnEvidence(evi)}>
                        <p className="tw-font-bold">{evi.codigo}</p>
                        <p className="tw-text-xs">{evi.descripcionActividades}</p>
                        <p className="tw-text-xs tw-hidden md:tw-block md:tw-absolute md:tw-right-2">{evi.nombreDocumento}</p>
                        <p className="tw-text-xs tw-hidden lg:tw-block lg:tw-absolute lg:tw-inset-y-8 lg:tw-right-2">{ new Date(evi.fecha).getFullYear()}/{ new Date(evi.fecha).getMonth()}/{ new Date(evi.fecha).getDay()}</p>
                    </button>
                )) : <span>No hay evidencias</span>}
            </ol>
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
                {parseInt((eviCount/2 +1).toString()) > page ?
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