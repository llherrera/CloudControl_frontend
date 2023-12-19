import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppDispatch } from "@/store";
import { removeEvidence } from "@/store/evidence/evidenceSlice";

import { approveEvidence } from "@/services/api";
import { EvidenceDetailProps } from '@/interfaces';

export const EvidenceDetail = ( {evi, index}: EvidenceDetailProps ) => {
    const dispatch = useAppDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reason, setReason] = useState("");

    const onChangeReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);
    };

    const handleInputModal = async () => {
        try {
            setModalIsOpen(false);
            await approveEvidence(evi.id_evidencia, 2, evi.codigo, evi.cantidad, evi.fecha2, reason);
            dispatch(removeEvidence(index));
        } catch (error) {
            console.log(error);
        }
    };

    const handleBtnApprove = async (approve: number) => {
        if (approve === 2) {
            setModalIsOpen(true);
        } else {
            try {
                await approveEvidence(evi.id_evidencia, approve, evi.codigo, evi.cantidad, evi.fecha2);
                dispatch(removeEvidence(index));
            } catch (error) {
                console.log(error);
            }
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
                <a href={evi.enlace}>Visitar</a>
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
                        onClick={()=>handleBtnApprove(2)}>Rechazar</button>
            <Modal  isOpen={modalIsOpen}
                    onRequestClose={()=>setModalIsOpen(false)}>
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4">
                    <p className="tw-text-2xl tw-font-bold">Ingrese el motivo del rechazo</p>
                    <textarea   className=" tw-border 
                                            tw-rounded tw-shadow-lg
                                            tw-mt-2
                                            tw-w-full tw-h-32 tw-p-2"
                                onChange={(e)=>onChangeReason(e)}
                                value={reason} 
                                required/>
                    <button className="tw-bg-blue-600 hover:tw-bg-blue-400 
                                    tw-text-white hover:tw-text-black
                                    tw-rounded
                                    tw-p-3 tw-mt-3"
                            onClick={handleInputModal}>
                        Enviar
                    </button>
                </div>
            </Modal>
            </th>
        </tr>
    );
}