import React, { useEffect, useRef, useState } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import parse, { DOMNode } from 'html-react-parser';

import { useAppSelector } from "@/store";
import { chatModel } from "@/services/chat.api";
import { getMyPronts, addPront, deleteProntById } from "@/services/api";
import { ModalProps, PlotOpt, ProntProps } from "@/interfaces";

import { FormControl, OutlinedInput, InputAdornment, Box, Select,
    SelectChangeEvent, MenuItem, InputLabel, IconButton,
    CircularProgress, ListItemText, styled, InputBase } from '@mui/material';
import { Send, Save, Delete } from '@mui/icons-material';
import { notify } from "@/utils";

type MsgFrom = "user" | "app";
interface Message {
  id: string;
  text: string;
  from: MsgFrom;
  time: number;
}

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

export default function VoicesChatWindow() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Nuevos estados del ModalAi
  const [reload, setReload] = useState<boolean>(false);
  const [plotOpts, setPlotOpts] = useState<(PlotOpt | null)[]>([null]);
  const [conversations, setConversations] = useState<string[]>(['Hazme una pregunta...']);
  const [pronts, setPronts] = useState<ProntProps[]>([]);
  const [pront1, setPront1] = useState<string>('');
  const [pront2, setPront2] = useState<string>('');

  // Redux selectors
  const { years } = useAppSelector(store => store.plan);
  const { id_plan } = useAppSelector(store => store.content);

  // refs
  const recognitionRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scrollingIds, setScrollingIds] = useState<Record<string, boolean>>({});
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Efectos del ModalAi
  useEffect(() => {
    try {
        getMyPronts().then(res => setPronts(res['result']));
    } catch (error) {
        notify('Algo salió mal al descargar tus mensajes guardados', 'error');
    }
  }, [reload]);

  useEffect(() => setInput(pront1), [pront1]);
  useEffect(() => setInput(pront2), [pront2]);

  useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [conversations]);

  useEffect(() => {
    const win: any = window;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "es-CO";

    r.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((res: any) => res[0]?.transcript || "")
        .join(" ");
      setInput((prev) => (prev ? `${prev} ${text}` : text));
    };

    r.onend = () => {
      setListening(false);
    };

    r.onerror = (err: any) => {
      console.error("SpeechRecognition error:", err);
      setListening(false);
    };

    recognitionRef.current = r;

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch (e) {}
    };
  }, []);

  // Handlers del ModalAi
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

  function startStopListening() {
    const r = recognitionRef.current;
    if (!r) {
      alert("Reconocimiento de voz no soportado en este navegador.");
      return;
    }

    if (listening) {
      r.stop();
      setListening(false);
    } else {
      try {
        setInput("");
        r.start();
        setListening(true);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  function pushMessage(text: string, from: MsgFrom) {
    const msg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      from,
      time: Date.now(),
    };
    setMessages((m) => [...m, msg]);
    return msg;
  }

  // Nueva función de envío que usa la API del ModalAi
  const request = async (msg: string) => {
    try {
        setInput('');
        setAiLoading(true);
        
        console.log('🔍 Enviando mensaje:', msg);
        console.log('🔍 ID del plan:', id_plan);
        console.log('🔍 Conversaciones previas:', conversations);
        
        const messagesToSend = [
            ...conversations,
            `${msg}. Para el plan con id: ${id_plan}.`
        ];
        
        console.log('🔍 Mensajes a enviar:', messagesToSend);
        
        const response = await chatModel(messagesToSend);
        
        console.log('✅ Respuesta recibida:', response);
        
        let res = response['res'];
        let opt = response['options'];
        
        console.log('✅ Respuesta procesada - res:', res);
        console.log('✅ Respuesta procesada - options:', opt);
        
        setConversations([...conversations, msg, res]);
        setPlotOpts([...plotOpts, null, opt]);
        
        // También actualizar el sistema de mensajes para compatibilidad
        const userMsg = pushMessage(msg, "user");
        const aiMsg = pushMessage(res, "app");
    } catch (error: any) {
        console.error('❌ Error completo:', error);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error data:', error.response?.data);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error status:', error.response?.status);
        
        let resTemp = 'Ha ocurrido un error, vuelva a intentar con una petición diferente.';
        
        if (error.response?.data?.msg) {
            resTemp = error.response.data.msg;
        } else if (error.response?.data?.message) {
            resTemp = error.response.data.message;
        } else if (error.message) {
            resTemp = `Error: ${error.message}`;
        }
        
        setInput(msg);
        setConversations([...conversations, msg, resTemp]);
        setPlotOpts([...plotOpts, null, null]);
        
        // También actualizar el sistema de mensajes para compatibilidad
        const userMsg = pushMessage(msg, "user");
        const errorMsg = pushMessage(resTemp, "app");
        
        // Mostrar notificación de error
        notify(resTemp, 'error');
    } finally {
        setAiLoading(false);
    }
  };

  async function sendToAI(userMsg: Message) {
    const typingMsg = pushMessage("…", "app");
    setAiLoading(true);

    try {
      const conversation = [...messagesRef.current, userMsg].map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const resp = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Status ${resp.status}`);
      }

      const data = await resp.json();
      const aiText = (data?.text as string) || (data?.response as string) || "(sin respuesta)";

      setMessages((prev) => prev.map((m) => (m.id === typingMsg.id ? { ...m, text: aiText, time: Date.now() } : m)));
    } catch (err: any) {
      console.error("Error al llamar a la IA:", err);
      setMessages((prev) => prev.map((m) => (m.id === typingMsg.id ? { ...m, text: `Error: ${err?.message || err}` } : m)));
    } finally {
      setAiLoading(false);
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    // Usar la nueva función request que integra con la API del ModalAi
    void request(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  // Auto-scroll
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, minimized]);

  // Detect overflow for marquee behavior
  useEffect(() => {
    const ids: Record<string, boolean> = {};
    Object.entries(messageRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const content = el.querySelector<HTMLElement>(".msg-text-inner");
      if (!content) return;
      ids[id] = content.scrollWidth > content.clientWidth + 4;
    });
    setScrollingIds(ids);
  }, [messages, listening, maximized, minimized]);

  return (
    <>
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .scroll-anim {
          animation: marqueeLeft linear infinite;
          animation-duration: 8s;
        }
        .scroll-viewport { -webkit-overflow-scrolling: touch; }
        .listening-glow {
          box-shadow: 0 0 30px rgba(239,68,68,0.18), inset 0 0 10px rgba(239,68,68,0.06);
        }
        .mic-pulse::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 8px;
          opacity: 0;
          transform: scale(1);
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(239,68,68,0.18), rgba(239,68,68,0));
        }
        .mic-pulse.listening::after {
          animation: micPulse 1.6s infinite;
        }
        @keyframes micPulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          70% { opacity: 0; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        .scroll-viewport::-webkit-scrollbar { height: 8px; }
        .scroll-viewport::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 8px; }
        .messages-scroll::-webkit-scrollbar { width: 10px; }
        .messages-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 6px; }
      `}</style>

      <button
        className="tw-fixed tw-right-2 tw-bottom-2 tw-z-50 tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-3 tw-rounded-full tw-shadow-lg tw-bg-[#143955] tw-text-white tw-font-bold tw-text-sm "
        onClick={() => {
          setOpen(true);
          setMinimized(false);
          setMaximized(false);
        }}
        aria-label="Abrir chat"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8.5C3 6.01472 5.01472 4 7.5 4H16.5C18.9853 4 21 6.01472 21 8.5V15.5C21 17.9853 18.9853 20 16.5 20H8.25L4.5 21.75V8.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Chat</span>
      </button>

      {open && maximized && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-backdrop-blur-sm tw-z-40 tw-transition-opacity"
          onClick={() => setMaximized(false)}
          aria-hidden
        />
      )}

      {open && (
        <div
          className={`tw-fixed tw-z-50 tw-flex tw-flex-col tw-border tw-border-gray-200 tw-bg-white tw-rounded-xl tw-shadow-2xl tw-transition-all tw-duration-300 tw-ease-out tw-right-6 tw-bottom-20 tw-${""}
            ${maximized ? "tw-w-[95vw] tw-h-[90vh] tw-right-1 tw-bottom-1" : minimized ? "tw-w-[360px] tw-h-[48px]" : "tw-w-[360px] tw-h-[480px]"}
            ${listening ? "listening-glow" : ""}
          `}
        >
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-px-3 tw-py-2 tw-bg-gradient-to-r tw-from-slate-50 tw-to-white tw-border-b">
            <div className="tw-flex tw-items-center tw-gap-2">
              <div className="tw-flex tw-items-center tw-gap-2">
                <button
                  title="Minimizar"
                  className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded hover:tw-bg-gray-100"
                  onClick={() => {
                    setMinimized((prev) => {
                      const newState = !prev;
                      if (newState) setMaximized(false);
                      return newState;
                    });
                  }}
                >
                  <span className="tw-text-sm">—</span>
                </button>

                {!minimized && (
                  <button
                    title="Maximizar"
                    className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded hover:tw-bg-gray-100"
                    onClick={() => setMaximized((v) => !v)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </button>
                )}

                <button
                  title="Cerrar"
                  className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded hover:tw-bg-red-100"
                  onClick={() => setOpen(false)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <span className="tw-ml-2 tw-font-semibold">Aplicaciones — Chat</span>
            </div>

            <div className="tw-text-xs tw-text-gray-500 tw-flex tw-items-center tw-gap-2">
              <div className={`tw-flex tw-items-center tw-gap-2 ${listening ? "tw-text-red-600" : ""}`}>
                {listening ? (
                  <>
                    <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-red-500 tw-animate-pulse" />
                    <span>Escuchando…</span>
                  </>
                ) : (
                  <span>Listo</span>
                )}
              </div>

              <div className="tw-ml-3 tw-text-xs">
                {aiLoading ? <span className="tw-text-gray-500">IA: escribiendo…</span> : <span className="tw-text-gray-400">IA: lista</span>}
              </div>
            </div>
          </div>

          {/* Contenido principal: mensajes + footer */}
          <div className={`tw-flex-1 tw-flex tw-flex-col ${minimized ? "tw-hidden" : ""}`} style={{ minHeight: 0 }}>
            <div
              ref={messagesContainerRef}
              className="messages-scroll tw-flex-1 tw-overflow-auto tw-p-3 tw-space-y-3 tw-bg-gradient-to-b tw-from-white tw-to-gray-50"
              style={{ minHeight: 0 }}
            >
              {conversations.length === 1 && (
                <div className="tw-text-center tw-text-sm tw-text-gray-400 tw-mt-6">Empieza la conversación — escribe o usa el micrófono</div>
              )}

              {conversations.map((c, i) =>
                <div key={i} className={`tw-flex ${i % 2 === 1 ? 'tw-justify-end' : 'tw-justify-start'}`}>
                  <div
                    className={`tw-max-w-[78%] tw-p-3 tw-rounded-xl tw-shadow-sm tw-text-sm tw-leading-relaxed
                      ${i % 2 === 1 ? 'tw-bg-blue-600 tw-text-white tw-rounded-br-none' : 'tw-bg-gray-100 tw-text-gray-900 tw-rounded-bl-none'}
                    `}
                    style={{ overflow: 'visible' }}
                  >
                    {i % 2 === 1 ? null :
                      <div className="tw-inline-block tw-rounded tw-px-2 tw-mb-2 tw-bg-white tw-text-black tw-text-xs">
                        Cloud-i:
                      </div>
                    }
                    <div
                      ref={(el) => (messageRefs.current[`conv-${i}`] = el)}
                      className="scroll-viewport"
                      style={{ maxWidth: "100%", overflowX: "auto", overflowY: 'hidden' }}
                    >
                      <div
                        className={`msg-text-inner tw-inline-block tw-align-middle tw-pr-2 tw-break-words ${scrollingIds[`conv-${i}`] && listening ? 'scroll-anim' : ''}`}
                        style={
                          scrollingIds[`conv-${i}`] && listening
                            ? { whiteSpace: "nowrap", display: 'inline-block' }
                            : { whiteSpace: "normal", display: 'inline-block' }
                        }
                      >
                        {parse(c, { replace: doc => replaceChartPlaceholder(doc, i) })}
                      </div>
                    </div>
                    {i % 2 === 1 ?
                      <div className="tw-flex tw-justify-end tw-mt-2">
                        <IconButton
                          size="small"
                          title="Guardar pront"
                          onClick={() => savePront(c)}
                          className="tw-text-white hover:tw-bg-blue-700"
                        >
                          <Save sx={{ fontSize: 16, color: '#FFFFFF' }} />
                        </IconButton>
                      </div>
                      : null
                    }
                  </div>
                </div>
              )}
              
              {aiLoading ?
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
                : null
              }
            </div>

            <div className="tw-p-3 tw-border-t tw-bg-white">
              {/* Controles de mensajes predeterminados y guardados */}
              <div className="tw-flex tw-justify-center tw-mb-2 tw-gap-2">
                <FormControl sx={{
                    width: '45%',
                    borderBlockColor: 'white',
                    color: 'white',
                }} variant="standard">
                    <InputLabel id='inputs' sx={{color: 'black', fontSize: '12px'}}>
                        Mensajes predeterminados
                    </InputLabel>
                    <Select
                        labelId="inputs"
                        id="demo-simple-select"
                        value={pront1}
                        label="Input"
                        sx={{color: 'black', fontSize: '12px'}}
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
                    width: '45%',
                    borderBlockColor: 'white',
                    color: 'white',
                }} variant="standard">
                    <InputLabel id='MyPronts' sx={{color: 'black', fontSize: '12px'}}>
                        Mensajes guardados
                    </InputLabel>
                    <Select
                        labelId="MyPronts"
                        id="demo-simple-select"
                        value={pront2}
                        label="Pront"
                        sx={{color: 'black', fontSize: '12px'}}
                        onChange={handleProntSelect}
                        input={<BootstrapInput/>}
                        MenuProps={MenuProps}
                        renderValue={selected =>
                            <div>
                                <IconButton
                                    size="small"
                                    title="Borrar pront"
                                    edge="end">
                                    <Delete sx={{color: '#000000', fontSize: 16}}/>
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
                                    onClick={e => deletePront(e, p.id_input)}
                                    edge="end">
                                    <Delete sx={{color: '#000000', fontSize: 16}}/>
                                </IconButton>
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
              </div>

              {/* Input principal */}
              <div className="tw-flex tw-items-center tw-gap-2">
                <input
                  className="tw-flex-1 tw-px-3 tw-py-2 tw-rounded-md tw-border tw-border-gray-200 tw-outline-none tw-text-sm"
                  placeholder="Escribe un mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={aiLoading}
                />

                <button
                  onClick={startStopListening}
                  className={`tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-gray-200 tw-text-sm tw-font-medium mic-pulse ${listening ? "listening tw-bg-red-50" : "hover:tw-bg-gray-50"}`}
                  title="Activar/Desactivar micrófono"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1.75C12.9665 1.75 13.75 2.53349 13.75 3.5V11.5C13.75 12.4665 12.9665 13.25 12 13.25C11.0335 13.25 10.25 12.4665 10.25 11.5V3.5C10.25 2.53349 11.0335 1.75 12 1.75Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 11.5C19 14.318 16.866 16.5 14 16.5H13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17.75V21" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  onClick={handleSend}
                  className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold hover:tw-bg-blue-700"
                  disabled={aiLoading}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*
  -- Nota breve --
  Cambios principales aplicados:
  - Reestructuré el layout para que el área de mensajes sea un flex-1 con overflow-auto y el footer (barra) esté en el flujo normal (no absolute). Así la barra queda pegada al fondo del componente y los mensajes hacen scroll correctamente.
  - Simplifiqué wrappers redundantes y añadí soporte para que la animación de pulso del micrófono sólo se active cuando `listening`.
  - Conservé el auto-scroll y la detección de overflow para el marquee.
*/
