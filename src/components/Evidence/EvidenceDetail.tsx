import React, { useEffect, useState } from "react";

import { approveEvidence } from "@/services/api";
import { EvidenceInterface } from '@/interfaces';

type Props = {
    eviden: EvidenceInterface
};

export const EvidenceDetail = ( {eviden}: Props ) => {
    
    const handleBtnApprove = async (approve: number) => {
        try {
            await approveEvidence(eviden.id_evidencia, approve);
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className="tw-flex tw-justify-between tw-py-2">
            <p className="tw-border-r-4 tw-border-black tw-py-1 tw-pr-1 tw-border-double tw-ml-2">{eviden.codigo}</p>
            <p className="tw-border-r-4 tw-border-black tw-py-1 tw-pr-1 tw-border-double">{eviden.cantidad}</p>
            <p className="tw-border-r-4 tw-border-black tw-py-1 tw-pr-1 tw-border-double">{ new Date(eviden.fecha).getFullYear()}/{ new Date(eviden.fecha).getMonth()}/{ new Date(eviden.fecha).getDay()}</p>
            <p className="tw-border-r-4 tw-border-black tw-py-1 tw-pr-1 tw-border-double"><a href={eviden.url} target="_blank">url</a></p>
            <div className="tw-mr-2">
                <button className="tw-bg-green-300 tw-rounded tw-mr-1 tw-py-1 tw-px-2"
                        onClick={()=>handleBtnApprove(1)}>Aprobar</button>
                <button className="tw-bg-red-300 tw-rounded tw-px-2"
                        onClick={()=>handleBtnApprove(0)}>Rechazar</button>
            </div>
        </div>
    );
}