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
            await approveEvidence(evi.id_evidence, 2, evi.code, evi.amount, evi.date_file, reason);
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
                await approveEvidence(evi.id_evidence, approve, evi.code, evi.amount, evi.date_file);
                dispatch(removeEvidence(index));
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <tr>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {new Date(evi.date).getDate()}/{new Date(evi.date).getMonth()+1}/{new Date(evi.date).getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.activitiesDesc}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.commune}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.neighborhood}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.unit}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.amount}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.benefited_population}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {evi.benefited_population_number}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {new Date(evi.date_file).getDate()}/{new Date(evi.date_file).getMonth()+1}/{new Date(evi.date_file).getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                <a href={evi.file_link} target="_blank">Visitar</a>
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                <button className="tw-bg-greenBtn hover:tw-bg-green-400 
                                    tw-text-white hover:tw-text-black
                                    tw-rounded 
                                    tw-py-1 tw-px-2"
                        onClick={()=>handleBtnApprove(1)}>
                    Aprobar
                </button>
                <button className="tw-bg-redBtn hover:tw-bg-red-400 
                                    tw-text-white hover:tw-text-black
                                    tw-rounded 
                                    tw-py-1 tw-px-2 tw-mt-1"
                        onClick={()=>handleBtnApprove(2)}>
                    Rechazar
                </button>
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