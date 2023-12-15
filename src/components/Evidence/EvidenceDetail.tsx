import React from "react";

import { useAppDispatch } from "@/store";
import { removeEvidence } from "@/store/evidence/evidenceSlice";

import { approveEvidence } from "@/services/api";
import { EvidenceDetailProps } from '@/interfaces';

export const EvidenceDetail = ( {evi, index}: EvidenceDetailProps ) => {
    const dispatch = useAppDispatch()

    const handleBtnApprove = async (approve: number) => {
        try {
            await approveEvidence(evi.id_evidencia, approve, evi.codigo);
            dispatch(removeEvidence(index));
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <tr>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {new Date(evi.fecha).getDate()}/{new Date(evi.fecha).getMonth()}/{new Date(evi.fecha).getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.descripcionActividades}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.comuna}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.barrio}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.unidad}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.cantidad}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.poblacionBeneficiada}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.numeroPoblacionBeneficiada}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {new Date(evi.fecha2).getDate()}/{new Date(evi.fecha2).getMonth()}/{new Date(evi.fecha2).getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                <a href={evi.url}>Visitar</a>
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                <button className="tw-bg-greenBtn hover:tw-bg-green-400 
                                    tw-text-white hover:tw-text-black
                                    tw-rounded 
                                    tw-py-1 tw-px-2"
                        onClick={()=>handleBtnApprove(1)}>Aprobar</button>
                <button className="tw-bg-redBtn hover:tw-bg-red-400 
                                    tw-text-white hover:tw-text-black
                                    tw-rounded 
                                    tw-py-1 tw-px-2 tw-mt-1"
                        onClick={()=>handleBtnApprove(0)}>Rechazar</button>
            </th>
        </tr>
    );
}