import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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

    const id = location.state?.id;

    const { plan } = useAppSelector(store => store.plan);
    const { evidence, eviCount } = useAppSelector(store => store.evidence);

    const [page, setPage] = useState(1);

    useEffect(() => {        
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidenceCount(id_plan))
        } else {
            dispatch(thunkGetEvidenceCount(parseInt(id!)))
        }
    }, [evidence])

    useEffect(() => {
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidences({id_plan, page}))
        }else{
            let id_plan = parseInt(id!)
            dispatch(thunkGetEvidences( {id_plan, page}))
        }
    }, [page, eviCount])

    const handlePage = (page: number) => {
        setPage(page)
    }

    const handleBack = () => {
        dispatch(resetEvidence())
        navigate(`/pdt/PlanIndicativo`, {state: {id}})
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-3">
            <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                <BackBtn handle={handleBack} id={parseInt(id!)}/>
                Evidencias por aprobar
            </p>
            <ol className=" tw-w-full md:tw-w-1/2
                            tw-flex tw-flex-col
                            tw-mt-4">
                {evidence?.length === 0 || evidence ? evidence.map((evi, index) => (
                    <li key={index} className="tw-bg-blue-200 tw-rounded tw-my-1">
                        <EvidenceDetail eviden={evi} index={index}/>
                    </li>
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