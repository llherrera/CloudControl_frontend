import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetEvidence, thunkGetEvidences } from "@/store/evidence/thunk";

export const ListEvidence = () => {
    const dispatch = useAppDispatch()
    const { plan } = useAppSelector(store => store.plan)
    const { evidence } = useAppSelector(store => store.evidence)

    useEffect(() => {
        if (plan) {
            const { id_plan } = plan
            if (id_plan) dispatch(thunkGetEvidences(id_plan))
        }
    }, [plan])

    return (
        <div className="tw-flex tw-flex-col tw-h-full">
            <ol>
                {evidence ? evidence.map((evidence, index) => (
                    <li key={index}>
                        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
                            <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
                                <div className="tw-flex tw-flex-col">
                                    <span className="tw-font-bold">{evidence.fecha}</span>
                                    <span className="tw-text-xs">{evidence.descripcionActividades}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                )) : <span>No hay evidencias</span>}
            </ol>
        </div>
    )
}