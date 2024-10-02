import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import parse, { DOMNode } from 'html-react-parser';

import { useAppSelector } from "@/store";

import { SelectStyled, Message } from "../Inputs";
import { chatModel } from "@/services/chat.api";
import { ModalProps, PlotOpt } from "@/interfaces";

import { FormControl, OutlinedInput, InputAdornment, Box, Theme,
    IconButton, CircularProgress, List, useMediaQuery } from '@mui/material';
import { Send } from '@mui/icons-material';

import './styles.css';

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

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const { id_plan } = useAppSelector(store => store.content);
    const { years } = useAppSelector(store => store.plan);
    const [text, setText] = useState("");
    const [conversations, setConversations] = useState<string[]>([]);
    const [plotOpts, setPlotOpts] = useState<(PlotOpt | null)[]>([]);
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

    const setNewText = (msg: string) => setText(msg);

    const replaceChartPlaceholder = (domNode: DOMNode, i: number) => {
        const option = plotOpts[i]
        if ('attribs' in domNode && domNode.attribs?.id === 'chart-replace') {
            if (option?.series && Array.isArray(option.series) && option.series.length > 0) {
                return (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={option}
                        ref={chartComponentRef}
                        containerProps={{ style: {width: '100%'} }}
                    />
                );
            }
        }
    };

    const request = async (msg: string) => {
        try {
            setText('');
            setLoading(true);
            const response = await chatModel([
                `${msg}
                para el plan con id: ${id_plan}.
                Si te menciono meta o metas productos tienes que traer la información de dicha meta y mostrar obligatoriamente el código de la meta, tambien devuelve el responsablie del nodo unidad.
                `]);
            let res = response['res'];
            let opt = response['options'];
            //console.log(response);
            //console.log(response['res']);
            //console.log(response['options']);
            setConversations([...conversations, msg, res]);
            setPlotOpts([...plotOpts, null, opt]);
        } catch (error: any) {
            console.log(error);
            const errMsg = error.response.data['msg'];
            const resTemp = errMsg ?? 'Ha ocurrido un error, vuelva a intentar con una petición diferente.';
            setText(msg);
            setConversations([...conversations, msg, resTemp]);
            setPlotOpts([...plotOpts, null, null]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal  isOpen={props.modalIsOpen}
                className='modal'
                overlayClassName='overlay'>
            <div className="tw-absolute tw-top-0 tw-right-0">
                <button className=" tw-px-2"
                        onClick={onClose}>
                    <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                        X
                    </p>
                </button>
            </div>
            <div className="tw-h-full tw-flex tw-justify-between
                            tw-flex-col md:tw-flex-row tw-mx-1">
                <div className={`md:tw-w-1/2 tw-h-full
                                tw-bg-[#626d75]
                                md:tw-mr-2 tw-p-2
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
                                    {parse(c, { replace: (doc) => replaceChartPlaceholder(doc, i) })}
                                </div>
                            </li>
                        ))}
                        {loading ? 
                        <div className="tw-animate-pulse tw-flex tw-space-x-4">
                            <div className="tw-rounded-full tw-bg-slate-700 tw-h-10 tw-w-10"></div>
                            <div className="tw-flex-1 tw-space-y-6 tw-py-1">
                                <div className="tw-h-2 tw-bg-slate-700 tw-rounded"></div>
                                <div className="tw-space-y-3">
                                    <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                                        <div className="tw-h-2 tw-bg-slate-700 tw-rounded tw-col-span-2"></div>
                                        <div className="tw-h-2 tw-bg-slate-700 tw-rounded tw-col-span-1"></div>
                                    </div>
                                    <div className="tw-h-2 tw-bg-slate-700 tw-rounded"></div>
                                </div>
                            </div>
                        </div>
                        : null}
                    </div>}
                </div>
                <div className="md:tw-w-1/2 md:tw-mx-auto
                                tw-p-6 tw-mt-2 md:tw-mt-0
                                tw-bg-[#626d75]
                                tw-rounded-lg tw-border tw-border-gray-800
                                tw-shadow-md">
                    <p className="  tw-w-full
                                    tw-p-2 tw-mb-4
                                    tw-border tw-border-gray-800 tw-rounded
                                    tw-bg-[#D9D9D9]
                                    tw-text-[#007759] tw-font-bold tw-text-center">
                        Chat con Cloud-i
                    </p>
                    <FormControl
                        sx={{
                            marginBottom: 1,
                            width: '100%',
                        }}
                        variant="outlined">
                        <OutlinedInput
                            value={text}
                            onChange={handleInputChange}
                            id="outlined-adornment-password"
                            multiline
                            rows={ isSmallScreen ? 2 : 3}
                            sx={{
                                '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                }
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    {loading ?
                                        <Box sx={{ display: 'flex' }}>
                                            <CircularProgress />
                                        </Box> :
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => request(text)}
                                            edge="end">
                                            <Send sx={{
                                                color: '#FFFFFF'
                                            }}/>
                                        </IconButton>
                                    }
                                </InputAdornment>
                            }
                        />
                    </FormControl>

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
                            classname="tw-w-1/3"
                        />
                        <SelectStyled 
                            opts={[
                                { label: 'Ejecución financiera', value: 'ejecución financiera' },
                                { label: 'Ejecución física', value: 'ejecución física' },
                                { label: 'Programación física', value: 'programación física' },
                            ]}
                            value={select2}
                            callback={setSelect2}
                            classname="tw-w-1/3"
                        />
                        <SelectStyled 
                            opts={[
                                { label: 'Máximo', value: 'máximo' },
                                { label: 'Mínimo', value: 'mínimo' },
                                { label: 'Promedio', value: 'promedio' },
                            ]}
                            value={select3}
                            callback={setSelect3}
                            classname="tw-w-1/3"
                        />
                    </div>

                    <List
                        style={{
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                        sx={{
                            maxHeight: {xs: '90px', md:'154px', '2xl': '100%'}
                        }}>
                        <Message callback={setNewText}>
                            {`Seleccionar las 5 ejecuciones físicas con mayor valor ejecutado en el año ${years[0]}`}
                        </Message>
                        <Message callback={setNewText}>
                            {`Seleccionar la mayor ejecución financiera entre todos los años`}
                        </Message>
                        <Message callback={setNewText}>
                            {`Seleccionar la secretaría que tenga menos ejecutado financieramente en el año ${years[1]}`}
                        </Message>
                    </List>
                </div>
            </div>
        </Modal>
    );
}