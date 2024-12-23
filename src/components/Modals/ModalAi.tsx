import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import Draggable from "react-draggable";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import parse, { DOMNode } from 'html-react-parser';

import { useAppSelector } from "@/store";

import { chatModel } from "@/services/chat.api";
import { getMyPronts, addPront, deleteProntById } from "@/services/api";
import { ModalProps, PlotOpt, ProntProps } from "@/interfaces";

import { FormControl, OutlinedInput, InputAdornment, Box, Select,
    SelectChangeEvent, MenuItem, InputLabel, IconButton,
    CircularProgress, ListItemText, useMediaQuery, styled,
    InputBase } from '@mui/material';
import { Send, Save, Delete } from '@mui/icons-material';
import { notify } from "@/utils";

import './styles.css';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ffffff',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#FFFFFF',
            boxShadow: '0 0 0 0.2rem rgba(255, 255, 255, 1)',
        },
    },
}));

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
                            tw-rounded-full tw-bg-white
                            tw-w-8 tw-h-8 tw-ml-2
                            tw-border-2 tw-border-logoBorder`}
                onClick={()=>setIsOpen(!isOpen)}>
                IA
            </button>
        </div>
    )
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const ProntInput = (props: ModalProps) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const draggableRef = useRef(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const { years } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [plotOpts, setPlotOpts] = useState<(PlotOpt | null)[]>([]);
    const [conversations, setConversations] = useState<string[]>(['Hazme una pregunta...']);

    const [pronts, setPronts] = useState<ProntProps[]>([]);
    const [pront1, setPront1] = useState<string>('');
    const [pront2, setPront2] = useState<string>('');
    const [text, setText] = useState("");

    useEffect(() => {
        try {
            getMyPronts().then(res => setPronts(res['result']));
        } catch (error) {
            notify('Algo salió mal al descargar tus mensajes guardados', 'error');
        }
    }, [reload]);

    useEffect(() => setText(pront1), [pront1]);

    useEffect(() => setText(pront2), [pront2]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversations]);

    const onClose = () => props.callback(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);

    const handleSelectChange = (event: SelectChangeEvent) => setPront1(event.target.value as string);

    const handleProntSelect = (event: SelectChangeEvent) => setPront2(event.target.value as string);

    const replaceChartPlaceholder = (domNode: DOMNode, i: number) => {
        const option = plotOpts[i];
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
                ...conversations,
                `${msg}. Para el plan con id: ${id_plan}.`
            ]);
            let res = response['res'];
            let opt = response['options'];
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
    };

    const savePront = async (text: string) => {
        try {
            await addPront(text);
            setReload(!reload);
            notify('Mensaje guardado', 'success');
        } catch (error) {
            notify('Algo salió mal al guardar el mensaje', 'error');
        }
    };

    const deletePront = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.stopPropagation();
        try {
            await deleteProntById(id);
            const newList = pronts.filter(p => p.id_input != id);
            setPronts(newList);
            setReload(!reload);
        } catch (error) {
            notify('Algo salió mal al borrar el mensaje', 'error');
        }
    };

    return (
        <Modal  isOpen={props.modalIsOpen}
                shouldCloseOnOverlayClick={false}
                className='modal'
                role={'dialog'}
                style={{
                    overlay: {
                        backgroundColor: 'transparent',
                        pointerEvents: 'none'
                    }
                }}>
            <Draggable nodeRef={draggableRef}>
                <div ref={draggableRef} className="modall tw-w-full tw-h-full">
                    <div className="tw-absolute tw-top-0 tw-right-0">
                        <button className=" tw-px-2"
                                onClick={onClose}>
                            <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                                X
                            </p>
                        </button>
                    </div>
                    <div className="tw-h-full tw-p-4
                                    tw-flex tw-flex-col
                                    tw-bg-[#626d75] tw-rounded">
                        <p className="  tw-w-full
                                        tw-p-2 tw-mb-4
                                        tw-border tw-border-gray-800 tw-rounded
                                        tw-bg-[#D9D9D9]
                                        tw-text-[#007759] tw-font-bold tw-text-center">
                            Chat con Cloud-i
                        </p>
                        <div className="tw-flex tw-flex-col tw-flex-1 tw-gap-2
                                        tw-px-1 tw-border-b tw-border-white
                                        tw-overflow-auto scrollbar-custom"
                            ref={chatRef}
                            id="chat2">
                            {conversations.map((c, i) =>
                                <li key={i}
                                    className={`tw-rounded tw-flex tw-text-white
                                                ${i % 2 === 1 ? 'tw-justify-end tw-ml-4' :
                                                                'tw-justify-start tw-mr-4'}`}>
                                    <div className={`tw-p-1 tw-rounded
                                        ${i % 2 === 1 ? 'tw-bg-white tw-text-black' : ''}`}>
                                        {i % 2 === 1 ? null :
                                            <p className="  tw-inline-block tw-rounded
                                                            tw-px-2 tw-mb-2
                                                            tw-bg-white tw-text-black">
                                                Cloud-i:
                                            </p>
                                        }
                                        {parse(c, { replace: doc => replaceChartPlaceholder(doc, i) })}
                                    </div>
                                    {i % 2 === 1 ?
                                        <IconButton
                                            size="small"
                                            title="Guardar pront"
                                            aria-label="toggle password visibility"
                                            onClick={() => savePront(c)}
                                            edge="end">
                                            <Save sx={{
                                                color: '#FFFFFF'
                                            }}/>
                                        </IconButton>
                                        : null
                                    }
                                </li>
                            )}
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
                        </div>
                        <div className="tw-mt-2">
                            <div className="tw-flex tw-justify-center tw-mb-2">
                                <FormControl sx={{
                                    width: '40%',
                                    borderBlockColor: 'white',
                                    color: 'white',
                                    marginRight: '10px'
                                }} variant="standard">
                                    <InputLabel id='inputs'
                                        sx={{color: 'white'}}>
                                        Mensajes predeterminados
                                    </InputLabel>
                                    <Select
                                        labelId="inputs"
                                        id="demo-simple-select"
                                        value={pront1}
                                        label="Input"
                                        sx={{
                                            color: 'white'
                                        }}
                                        onChange={handleSelectChange}
                                        input={<BootstrapInput/>}>
                                        <MenuItem value="">
                                            <em></em>
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar las 5 ejecuciones físicas con mayor valor ejecutado en el año ${years[0]}`}>
                                            {`Seleccionar las 5 ejecuciones físicas con mayor valor ejecutado en el año ${years[0]}`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar la mayor ejecución financiera entre todos los años`}>
                                            {`Seleccionar la mayor ejecución financiera entre todos los años`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar la secretaría que tenga menos ejecutado financieramente en el año ${years[1]}`}>
                                            {`Seleccionar la secretaría que tenga menos ejecutado financieramente en el año ${years[1]}`}
                                        </MenuItem>
                                        <MenuItem value={`Secretaría con menor ejecución financiera`}>
                                            {`Secretaría con menor ejecución financiera`}
                                        </MenuItem>
                                        <MenuItem value={`Secretaría con menor ejecución financiera mayor a cero`}>
                                            {`Secretaría con menor ejecución financiera mayor a cero`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar las 5 primeras ejecuciones ordenadas de mayor a menor en el ${years[0]}`}>
                                            {`Seleccionar las 5 primeras ejecuciones ordenadas de mayor a menor en el ${years[0]}`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar las 10 primeras ejecuciones ordenadas de mayor a menor`}>
                                            {`Seleccionar las 10 primeras ejecuciones ordenadas de mayor a menor`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar las 10 primeras ejecuciones ordenadas de menor a mayor`}>
                                            {`Seleccionar las 10 primeras ejecuciones ordenadas de menor a mayor`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar las 10 primeras ejecuciones financieras ordenadas de mayor a menor en el ${years[1]}`}>
                                            {`Seleccionar las 10 primeras ejecuciones financieras ordenadas de mayor a menor en el ${years[1]}`}
                                        </MenuItem>
                                        <MenuItem value={`Seleccionar todas las ejecuciones de la secretaría de las TIC`}>
                                            {`Seleccionar todas las ejecuciones de la secretaría de las TIC`}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{
                                    width: '40%',
                                    borderBlockColor: 'white',
                                    color: 'white',
                                    marginLeft: '10px'
                                }} variant="standard">
                                    <InputLabel id='MyPronts'
                                        sx={{color: 'white'}}>
                                        Mensajes guardados
                                    </InputLabel>
                                    <Select
                                        labelId="MyPronts"
                                        id="demo-simple-select"
                                        value={pront2}
                                        label="Pront"
                                        sx={{
                                            color: 'white'
                                        }}
                                        onChange={handleProntSelect}
                                        input={<BootstrapInput/>}
                                        MenuProps={MenuProps}
                                        renderValue={selected =>
                                            <div>
                                                <IconButton
                                                    size="small"
                                                    title="Borrar pront"
                                                    aria-label="toggle password visibility"
                                                    edge="end">
                                                    <Delete sx={{
                                                        color: '#FFFFFF'
                                                    }}/>
                                                </IconButton>
                                                <span>{selected}</span>
                                            </div>
                                        }
                                    >
                                        <MenuItem value="">
                                            <em>Escoger</em>
                                        </MenuItem>
                                        {pronts.length > 0 && pronts.map(p =>
                                            <MenuItem key={p.id_input} value={p.input}>
                                                <ListItemText primary={p.input}/>
                                                <IconButton
                                                    size="small"
                                                    title="Borrar pront"
                                                    aria-label="toggle password visibility"
                                                    onClick={e => deletePront(e, p.id_input)}
                                                    edge="end">
                                                    <Delete sx={{
                                                        color: '#000000'
                                                    }}/>
                                                </IconButton>
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </div>
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
                                    rows={2}
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
                        </div>
                    </div>
                </div>
            </Draggable>
        </Modal>
    );
}