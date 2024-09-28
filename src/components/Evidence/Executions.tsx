import React, { useState } from "react";
import Modal from 'react-modal';

import { useAppDispatch, useAppSelector } from "@/store";
import { removeEvidence } from "@/store/evidence/evidenceSlice";
import { thunkUpdateExecution } from "@/store/unit/thunks";

import { ExecutedProps } from '@/interfaces';
import { notify } from "@/utils";

export const Execution = ( {ex, index}: ExecutedProps ) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reason, setReason] = useState("");

    const newModYear = new Date(ex.year);
    newModYear.setDate(newModYear.getDate() + 1);
    const newModDate = new Date(ex.modified_date);
    newModDate.setDate(newModDate.getDate() + 1);

    const onChangeReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);
    };

    const handleInputModal = async () => {
        setModalIsOpen(false);
        dispatch(thunkUpdateExecution({
            date: newModDate,
            value: ex.modified_execution,
            code: ex.id_node,
            user_id: ex.id_user,
            plan_id: id_plan,
            reason
        }))
        .unwrap()
        .then(() => {
            notify('Ejecucion actualizada');
        })
        .catch((error) => {
            notify('Ha ocurrido un error, intentelo de nuevo más tarde');
            console.log(error);
        });
        dispatch(removeEvidence(index));
    };

    const handleBtnApprove = async (approve: number) => {
        if (approve === 2) {
            setModalIsOpen(true);
        } else {
            dispatch(thunkUpdateExecution({
                date: newModDate,
                value: ex.modified_execution,
                code: ex.id_node,
                user_id: ex.id_user,
                plan_id: id_plan,
                reason
            }))
            .unwrap()
            .then(() => {
                notify('Ejecucion actualizada');
            })
            .catch((error) => {
                notify('Ha ocurrido un error, intentelo de nuevo más tarde');
                console.log(error);
            });
        }
    };

    return (
        <tr>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {ex.code}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {newModYear.getDate()}/{newModYear.getMonth()+1}/{newModYear.getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {ex.physical_execution}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {ex.modified_execution}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {newModDate.getDate()}/{newModDate.getMonth()+1}/{newModDate.getFullYear()}
            </th>
            <th  className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
                {ex.id_user}
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