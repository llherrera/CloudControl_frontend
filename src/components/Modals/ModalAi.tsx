import React, { useState } from "react";
import Modal from 'react-modal';

import { SelectStyled } from "../Inputs";
import { chatModel } from "@/services/chat.api";

interface Props {
    isOpen: boolean;
    callback: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalAi = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <ProntInput
                isOpen={isOpen}
                callback={setIsOpen}/>
            <button 
                title='Chat con la IA'
                className={`tw-transition 
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]
                            tw-rounded-full
                            tw-w-8 tw-h-8 tw-ml-2
                            tw-border-2 tw-border-logoBorder`}
                onClick={()=>setIsOpen(true)}>
                IA
            </button>
        </div>
    )
}

const ProntInput = (props: Props) => {
    const [text, setText] = useState("");
    const [conversations, setConversations] = useState<string[]>([]);
    const [response, setResponse] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const onClose = () => {
        props.callback(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setText(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            request(text);
        }
    };

    const request = async (msg: string) => {
        try {
            setLoading(true);
            const response = await chatModel(msg);
            setResponse(response['res']);
            setConversations([...conversations, msg, response['res']]);
        } catch (error: any) {
            console.log(error);
            setResponse(error.response.data);
        } finally {
            setLoading(false);
            setText('');
        }
    }
//tw-gap-2
//tw-grid-cols-2 tw-grid-rows-2
    return (
        <Modal  isOpen={props.isOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''>
            <div className="tw-h-full tw-flex tw-justify-between
                            tw-flex-col md:tw-flex-row">
                <ul className={`tw-w-full tw-h-full
                                tw-bg-gray-300 
                                tw-mr-2 tw-p-2
                                tw-rounded`}>
                {conversations.length === 0 ?
                <p>Hazme una pregunta</p> :
                <div className="tw-flex tw-flex-col tw-gap-2">
                    {conversations.map((c, i) => (
                        <li key={i}
                            className={`tw-rounded tw-flex
                                        ${i % 2 === 0 ? 'tw-justify-end tw-ml-4' : 'tw-justify-start tw-mr-4'}`}>
                            <p className="tw-bg-white tw-p-1 tw-rounded">{c}</p>
                        </li>
                    ))}
                    {loading ? <p>Procesando...</p> : null}
                </div>}
                </ul>
                <div className="md:tw-max-w-lg md:tw-mx-auto
                                tw-p-6 tw-mt-2 md:tw-mt-0
                                tw-bg-white
                                tw-rounded-lg tw-border
                                tw-shadow-md">
                    <p className="  tw-w-full
                                    tw-p-2 tw-mb-4
                                    tw-border tw-rounded">
                        Chat con Cloud-i
                    </p>
                    <textarea
                        onChange={handleInputChange}
                        value={text}
                        onKeyDown={(e) => handleKeyPress(e)}
                        placeholder="Preguntame sobre tu plan"
                        className=" tw-w-full tw-h-1/3 md:tw-h-1/2
                                    tw-p-2 tw-mb-4
                                    tw-border tw-rounded
                                    tw-resize-none
                                    tw-text-wrap"
                    />

                    <div className=" tw-justify-between 
                                    tw-items-center tw-mb-4
                                    tw-hidden md:tw-flex">
                        <SelectStyled opts={[
                            {
                                label: 'Secretaria',
                                value: 'secretary'
                            },
                            {
                                label: 'Evidencia',
                                value: 'evidence'
                            },
                            {
                                label: 'Localidad',
                                value: 'located'
                            },
                        ]}/>
                        <SelectStyled opts={[
                            {
                                label: 'Ejecución financiera',
                                value: 'financial_execution'
                            },
                            {
                                label: 'Ejecución física',
                                value: 'physical_execution'
                            },
                            {
                                label: 'Programación física',
                                value: 'physical_programming'
                            },
                        ]}/>
                        <SelectStyled opts={[
                            {
                                label: 'Máximo',
                                value: 'max'
                            },
                            {
                                label: 'Mínimo',
                                value: 'min'
                            },
                            {
                                label: 'Promedio',
                                value: 'avg'
                            },
                        ]}/>
                    </div>

                    <div className="tw-flex tw-justify-center md:tw-justify-end">
                        <button className=" tw-py-2 tw-px-6 tw-mb-2
                                            tw-bg-purple-500 hover:tw-bg-purple-700
                                            tw-text-white tw-font-bold
                                            tw-rounded"
                                onClick={() => request(text)}>
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}