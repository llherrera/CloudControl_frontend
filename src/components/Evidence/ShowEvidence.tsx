import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppDispatch } from "@/store";
import { removeEvidence } from "@/store/evidence/evidenceSlice";

import { approveEvidence } from "@/services/api";
import { EvidenceDetailProps } from '@/interfaces';

export const ShowEvidence = ( {evi, index}: EvidenceDetailProps ) => {
    const dispatch = useAppDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reason, setReason] = useState("");


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
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {new Date(evi.date).getDate()}/{new Date(evi.date).getMonth()+1}/{new Date(evi.date).getFullYear()}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden lg:tw-table-cell`}>
                {evi.activitiesDesc}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden lg:tw-table-cell`}>
                {evi.commune}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.neighborhood}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.unit}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {evi.amount}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {evi.benefited_population}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                {evi.benefited_population_number}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black
                            tw-hidden md:tw-table-cell`}>
                {new Date(evi.date_file).getDate()}/{new Date(evi.date_file).getMonth()+1}/{new Date(evi.date_file).getFullYear()}
            </th>
            <th  className={`tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black`}>
                <a href={evi.file_link} target="_blank">Visitar</a>
            </th>
        </tr>
    );
}