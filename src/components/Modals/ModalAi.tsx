import React, { useState } from "react";
import OpenAI from 'openai';
import Modal from 'react-modal';

import { SelectStyled } from "../Inputs";
import { getEnvironment } from '@/utils/environment';

const { API_KEY_IA } = getEnvironment();

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
    const [response, setResponse] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const openai = new OpenAI({
        apiKey: API_KEY_IA,
        dangerouslyAllowBrowser: true
    });

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
        let response;
        try {
            setLoading(true);
            response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: 'user',
                    content: msg
                }],
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setText('');
        }
        //setResponse(response.choices[0].message?.content);
    }

    return (
        <Modal  isOpen={props.isOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''>
            <div className="tw-h-full tw-flex tw-justify-between">
                <ul className={`tw-w-full tw-h-full
                                tw-bg-gray-300 
                                tw-mr-2 tw-p-2
                                tw-grid tw-gap-2
                                tw-grid-cols-2 tw-grid-rows-2`}>
                    {loading ?
                        <p>Procesando...</p> :
                        <p>Cloud-i: {response}</p>
                    }
                </ul>
                <div className="tw-max-w-lg
                                tw-mx-auto tw-p-6
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
                        className=" tw-w-full tw-h-1/2
                                    tw-p-2 tw-mb-4
                                    tw-border tw-rounded
                                    tw-resize-none
                                    tw-text-wrap"
                    />

                    <div className="tw-flex tw-justify-between 
                                    tw-items-center tw-mb-4">
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

                    <div className="tw-flex tw-justify-end">
                        <button className=" tw-py-2 tw-px-6
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