import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import parse from 'html-react-parser';

import { useAppSelector } from "@/store";

import { SelectStyled } from "../Inputs";
import { chatModel } from "@/services/chat.api";
import { ModalProps } from "@/interfaces";

export const ModalAi = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <ProntInput
                modalIsOpen={isOpen}
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

const ProntInput = (props: ModalProps) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { id_plan } = useAppSelector(store => store.content);
    const [text, setText] = useState("");
    const [conversations, setConversations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [select1, setSelect1] = useState("");
    const [select2, setSelect2] = useState("");
    const [select3, setSelect3] = useState("");

    useEffect(() => {
        const chat = document.getElementById('chat');
        chat?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [conversations]);

    useEffect(() => {
        const generateSentence = () => {
            // Mapear select1 a su correspondiente frase inicial
            let part1 = '';
            if (select1) {
                if (select1 === 'secretaría' || select1 === 'localidad') {
                    part1 = `Seleccionar la ${select1}`;
                } else if (select1 === 'evidencia') {
                    part1 = `Mostrar la ${select1}`;
                }
            }
            // Mapear select2 a su correspondiente frase media
            let part2 = '';
            if (select2) {
                if (select2 === 'ejecución financiera' || select2 === 'ejecución física') {
                    part2 = `con ${select2}`;
                } else if (select2 === 'programación física') {
                    part2 = `de ${select2}`;
                }
            }
            // Mapear select3 a su correspondiente modificador
            let part3 = '';
            if (select3) {
                if (select3 === 'máximo' || select3 === 'mínimo') {
                    part3 = `al ${select3}`;
                } else if (select3 === 'promedio') {
                    part3 = `el ${select3}`;
                }
            }
            // Construir la oración final
            let sentence = '';
            if (part1 && part2 && part3) {
                sentence = `${part1} ${part3} de ${part2}`;
            } else if (part1 && part2) {
                sentence = `${part1} ${part2}`;
            } else if (part2 && part3) {
                sentence = `Mostrar ${part3} de ${part2}`;
            } else if (part1 && part3) {
                sentence = `${part1} ${part3}`;
            }
            //console.log(sentence);
            setText(sentence);
        };
        generateSentence();        
    }, [select1, select2, select3]);

    const onClose = () => props.callback(false);

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
            setText('');
            setLoading(true);
            const response = await chatModel([...conversations, `${msg} \npara el plan con id: ${id_plan}.`]);
            let res = response['res'].replace('html', '');
            console.log(res);
            setConversations([...conversations, msg, res]);
        } catch (error: any) {
            console.log(error);
            setText(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''
                style={{
                    content: {
                        backgroundColor: 'black',
                    }
                }}>
            <div className="tw-h-full tw-flex tw-justify-between
                            tw-flex-col md:tw-flex-row">
                <div className={`tw-w-full tw-h-full
                                tw-bg-[#202123]
                                tw-mr-2 tw-p-2
                                tw-rounded 
                                tw-border tw-border-gray-800
                                tw-overflow-auto`}>
                {conversations.length === 0 ?
                <p className="tw-text-white">Hazme una pregunta...</p> :
                <div className="tw-flex tw-flex-col tw-gap-2"
                    id="chat">
                    {conversations.map((c, i) => (
                        <li key={i}
                            className={`tw-rounded tw-flex tw-text-white
                                        ${i % 2 === 0 ? 'tw-justify-end tw-ml-4' : 'tw-justify-start tw-mr-4'}`}>
                            <div className={`tw-p-1 tw-rounded
                                ${i % 2 === 0 ? 'tw-bg-white tw-text-black' : ''}`}>
                                {i % 2 === 0 ? null : 
                                    <p className="  tw-inline-block tw-rounded
                                                    tw-px-2 tw-mb-2
                                                    tw-bg-white tw-text-black">
                                        Cloud-i:
                                    </p>
                                }
                                {parse(c)}
                            </div>
                        </li>
                    ))}
                    {loading ? <p>Procesando...</p> : null}
                </div>}
                </div>
                <div className="md:tw-max-w-lg md:tw-mx-auto
                                tw-p-6 tw-mt-2 md:tw-mt-0
                                tw-bg-[#202123]
                                tw-rounded-lg tw-border tw-border-gray-800
                                tw-shadow-md">
                    <p className="  tw-w-full
                                    tw-p-2 tw-mb-4
                                    tw-border tw-border-gray-800 tw-rounded
                                    tw-bg-black
                                    tw-text-[#007759] tw-font-bold tw-text-center">
                        Chat con Cloud-i
                    </p>
                    <textarea
                        onChange={handleInputChange}
                        value={text}
                        onKeyDown={(e) => handleKeyPress(e)}
                        placeholder="Preguntame sobre tu plan"
                        className=" tw-w-full tw-h-1/3 md:tw-h-1/2
                                    tw-p-2 tw-mb-4
                                    tw-border tw-border-gray-800 tw-rounded
                                    focus:tw-border-gray-800
                                    tw-resize-none tw-bg-black
                                    tw-text-wrap tw-text-white"
                    />

                    <div className=" tw-justify-between 
                                    tw-items-center tw-mb-4
                                    tw-hidden md:tw-flex">
                        <SelectStyled 
                            opts={[
                                { label: 'Secretaría', value: 'secretaría' },
                                { label: 'Evidencia', value: 'evidencia' },
                                { label: 'Localidad', value: 'localidad' },
                            ]}
                            value={select1}
                            callback={setSelect1}
                        />
                        <SelectStyled 
                            opts={[
                                { label: 'Ejecución financiera', value: 'ejecución financiera' },
                                { label: 'Ejecución física', value: 'ejecución física' },
                                { label: 'Programación física', value: 'programación física' },
                            ]}
                            value={select2}
                            callback={setSelect2}
                        />
                        <SelectStyled 
                            opts={[
                                { label: 'Máximo', value: 'máximo' },
                                { label: 'Mínimo', value: 'mínimo' },
                                { label: 'Promedio', value: 'promedio' },
                            ]}
                            value={select3}
                            callback={setSelect3}
                        />
                    </div>

                    <div className="tw-flex tw-justify-center md:tw-justify-end">
                        <button className={`tw-py-2 tw-px-6 tw-mb-2
                                            tw-bg-purple-500 ${loading || text.length === 0 ? '' : 'hover:tw-bg-purple-700'}
                                            tw-text-white tw-font-bold
                                            tw-rounded`}
                                onClick={() => request(text)}
                                disabled={loading || text.length === 0}>
                            {loading ? 'Cargando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}