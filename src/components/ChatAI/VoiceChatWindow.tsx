import React, { useEffect, useRef, useState } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import parse, { DOMNode } from 'html-react-parser';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { marked } from "marked";
import DOMPurify from "dompurify";

import { useAppDispatch, useAppSelector } from "@/store";
import { chatModel } from "@/services/chat.api";
import { getMyPronts, addPront, deleteProntById } from "@/services/api";
import { ModalProps, PlotOpt, ProntProps } from "@/interfaces";

import {
  FormControl, OutlinedInput, InputAdornment, Box, Select,
  SelectChangeEvent, MenuItem, InputLabel, IconButton,
  CircularProgress, ListItemText, styled, InputBase
} from '@mui/material';
import { Send, Save, Delete } from '@mui/icons-material';
import { notify } from "@/utils";

import { unwrapResult } from "@reduxjs/toolkit";
import { thunkFetchChatbot } from "@/store/pqrs/thunks";

import { decode } from '@/utils';

type MsgFrom = "user" | "app";
interface Message {
  id: string;
  text: string;
  from: MsgFrom;
  time: number;
}

import { useMemo } from "react";

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
  const dispatch = useAppDispatch();

  const { token_info } = useAppSelector(store => store.auth);

  const [id, setId] = useState(0);
  const [user, setUser] = useState('');
  const [rol, setRol] = useState('');
  const [idPlan, setIdPlan] = useState(0);

  useEffect(() => {
    if (token_info?.token !== undefined) {
      const decoded = decode(token_info.token);
      setId(decoded.id);
      setUser(decoded.user);
      setRol(decoded.rol);
      setIdPlan(Number(localStorage.getItem('id_plan')) || 0);
      console.log('Token decodificado:', decoded);
    }
  }, []);

  // Tipos auxiliares
  interface FileMeta {
    fileName: string;
    mimeType: string;
    fileSize: number;
    lastModified?: string | null; // ISO date opcional
    // Puedes añadir más metadatos si los necesitas (hash, sheetName, etc.)
  }

  type ExecutionInfo = {
    executed: boolean;
    reason: string | null;
  };

  type YearsMap<T> = { [year: string]: T };

  // Tipos para filas de tabla (ajusta campos según tu dominio)
  interface TableRow {
    codigo?: string;
    meta?: string;
    responsable?: string | null;
    descripcion?: string | null;
    indicador?: string | null;
    linea_base?: number | null;
    programados?: YearsMap<number | null>;
    ejecutados?: YearsMap<number | null>;
    porcentajes?: YearsMap<number | null>;
    pct_calculable?: YearsMap<boolean>;
    // campos libres para extensibilidad
    [extra: string]: any;
  }

  // Estructura para "lista" / "tarjetas"
  interface ListItem {
    codigo?: string;
    meta?: string;
    resumenValores?: string; // ej: "2026 P:20 E:0 (0%)"
    detail?: TableRow | null; // detalle expandible
    [extra: string]: any;
  }

  // Estructura para "árbol"
  interface TreeNode {
    eje_programatico?: string | null;
    sector?: string | null;
    programa?: string | null;
    metas?: TableRow[]; // metas dentro del nodo
    children?: TreeNode[]; // por si hay más niveles
    [extra: string]: any;
  }

  // presentationObject union
  type PresentationType = 'tabla' | 'lista' | 'texto' | 'tarjetas' | 'árbol';

  interface PresentationTable {
    type: 'tabla';
    table: {
      columns: string[]; // cabeceras (ordenadas)
      rows: TableRow[]; // filas normalizadas
    };
  }

  interface PresentationList {
    type: 'lista' | 'tarjetas';
    list: {
      items: ListItem[];
    };
  }

  interface PresentationTree {
    type: 'árbol';
    tree: {
      rootNodes: TreeNode[];
    };
  }

  interface PresentationText {
    type: 'texto';
    text: {
      content: string;
    };
  }

  type PresentationObject = PresentationTable | PresentationList | PresentationTree | PresentationText;

  // Estructura completa que el LLM puede devolver en llmResponseParsed
  interface LlmPresentationResponse {
    // Resumen opcional (máx 2 frases según tu prompt)
    presentationSummary?: string;

    presentationType: PresentationType;
    presentationReason?: string; // por qué se eligió la forma de presentación

    presentationObject: PresentationObject;

    // Texto explicativo para el front sobre cómo interpretar la tabla/valores
    explanatoryText?: string;

    // Metadatos útiles para el front
    metadata?: {
      numMetas?: number;
      yearsDetected?: number[]; // ej [2026,2027...]
      hasHierarchy?: boolean;
      detectedColumns?: string[]; // columnas detectadas en el archivo
      // espacio para futuros metadatos
      [k: string]: any;
    };

    // campo libre para otras estructuras o extensiones
    [k: string]: any;
  }

  // Interfaz principal actualizada
  interface ChatbotResponse {
    originalText: string;
    idPlan: number;
    idUser?: number | null;
    generatedSql?: string | null;
    execution?: ExecutionInfo | null;

    // Resultados tabulares simples (cuando el backend devuelve rows crudas)
    rows?: any[] | null;

    // Texto explicativo "humano"
    explanation?: string | null;

    // Archivo adjunto / enviado
    fileSent?: boolean;
    fileMeta?: FileMeta | null;

    // Respuesta en lenguaje natural (texto que verá el usuario)
    naturalLanguageResponse?: string | null;

    // Respuesta parseada por el LLM, si existe: sigue la estructura LlmPresentationResponse
    llmResponseParsed?: LlmPresentationResponse | Record<string, any> | any[] | null;

    // Puedes añadir campos extra que tu backend use, mantén open-ended para compatibilidad.
    [k: string]: any;
  }


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
      } catch (e) { }
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
            containerProps={{ style: { width: '100%' } }}
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

  // Tipos auxiliares (ajusta o importa desde tus tipos reales si los tienes)
  // Tipos auxiliares para mensajes del chat IA

  type Sender = 'user' | 'app' | 'system' | 'ai';
interface Message {
  /** Identificador único del mensaje */
  id: string;

  /** Texto del mensaje */
  text: string;

  /** Quién envió el mensaje: 'user', 'app', 'system', 'ai' */
  from: Sender;

  /** Marca de tiempo (timestamp en ms) */
  time: number;

  /** (Opcional) Indica si el mensaje está siendo procesado o escrito */
  loading?: boolean;

  /** (Opcional) Objeto estructurado si la IA devolvió JSON (tabla/lista/etc.) */
  structuredData?: any;

  /** (Opcional) Objeto tabular si corresponde (por ejemplo, { type: 'table', rows: [...] }) */
  tableObject?: { type: 'table'; rows: any[] } | null;

  /** (Opcional) Para adjuntar errores o estados del procesamiento */
  error?: string | null;
}


  type TableObject = { type: 'table'; rows: Record<string, any>[] } | null;

  // Guardias de tipo simples
  const isRecord = (v: any): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v);

  // Helpers para extraer JSON embebido en texto
  function extractJsonFromText(text: string): { jsonText: string | null; cleanedText: string } {
    if (!text) return { jsonText: null, cleanedText: text };

    // 1) Buscar bloque ```json ... ```
    const fencedJson = text.match(/```json\s*([\s\S]*?)```/i);
    if (fencedJson) {
      return { jsonText: fencedJson[1].trim(), cleanedText: text.replace(fencedJson[0], '').trim() };
    }

    // 2) Buscar cualquier bloque ``` ... ```
    const fencedAny = text.match(/```([\s\S]*?)```/);
    if (fencedAny) {
      // intentar parsear su contenido como JSON
      return { jsonText: fencedAny[1].trim(), cleanedText: text.replace(fencedAny[0], '').trim() };
    }

    // 3) Buscar objeto JSON completo dentro del texto (desde { hasta } o [ hasta ])
    const braceMatch = text.match(/({[\s\S]*}|\[[\s\S]*\])/);
    if (braceMatch) {
      return { jsonText: braceMatch[1], cleanedText: text.replace(braceMatch[1], '').trim() };
    }

    return { jsonText: null, cleanedText: text };
  }

  function tryParseJsonSafe(jsonText: string | null): any | null {
    if (!jsonText) return null;
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      // Intentar "arreglar" comillas tipográficas o comas finales puede ser riesgoso.
      // Mejor devolver null y seguir mostrando texto.
      console.warn('[tryParseJsonSafe] No se pudo parsear JSON:', e);
      return null;
    }
  }

  // Normaliza varias formas de parsedContent a "rows" para tabla
  function normalizeToTableRows(parsed: any): Record<string, any>[] | null {
    if (!parsed) return null;

    // Caso: ya es un array de objetos
    if (Array.isArray(parsed) && parsed.every(item => isRecord(item))) {
      return parsed;
    }

    // Caso: objeto que contiene presentationType / presentationObject (según tu prompt)
    if (isRecord(parsed)) {
      // Si el parser ya devolvió la estructura recomendada en tu prompt:
      const pType = parsed.presentationType || (parsed.presentationObject && parsed.presentationObject.type);
      const pObj = parsed.presentationObject || parsed.presentationObject;

      // Si trae presentationObject con table
      if (isRecord(parsed.presentationObject) && parsed.presentationObject.table && Array.isArray(parsed.presentationObject.table.rows)) {
        return parsed.presentationObject.table.rows;
      }

      // Si es lista con items -> usar detail si existe, sino item directo
      if (isRecord(parsed.presentationObject) && parsed.presentationObject.list && Array.isArray(parsed.presentationObject.list.items)) {
        const items = parsed.presentationObject.list.items;
        return items.map((it: any) => {
          // preferir detail (más completo), sino devolver item tal cual
          if (isRecord(it.detail)) return it.detail;
          return isRecord(it) ? it : { value: it };
        });
      }

      // Manejar formato común: objeto con múltiples claves -> convertir a filas clave/valor
      const keys = Object.keys(parsed);
      if (keys.length > 0 && keys.every(k => typeof parsed[k] !== 'undefined')) {
        // Si el objeto representa una sola "fila" con campos, devolverlo como array con ese objeto
        // Detectar heurísticamente si las keys parecen campos (p.ej. contienen "programado" / "ejecutado" / "codigo")
        const likelyRow = keys.some(k => /programad|ejecutad|codigo|meta|indicador|linea_base|programado|ejecutado/i.test(k));
        if (likelyRow) {
          return [parsed];
        }

        // Si no es un solo registro y tiene subobjetos repetibles, convertir a clave/valor
        return keys.map(k => ({ clave: k, valor: parsed[k] }));
      }
    }

    return null;
  }
// Helpers añadidos: aplanar filas con programados/ejecutados/porcentajes
function flattenRowForTable(row: Record<string, any>, years: number[]): Record<string, any> {
  const flat: Record<string, any> = { ...row };

  // Si trae programados/ejecutados/porcentajes como objetos por año, los expandimos
  const expandIfObj = (fieldName: string, prefix: string) => {
    const obj = row[fieldName];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      years.forEach(y => {
        const key = `${prefix}_${y}`; // ej: Programado_2026
        flat[key] = obj[y] ?? null;
      });
      // opcional: borrar la propiedad original para evitar [object Object] en render
      delete flat[fieldName];
    } else if (obj !== undefined && obj !== null && !Array.isArray(obj)) {
      // Si el campo es un número o string simple, dejarlo en flat
      flat[fieldName] = obj;
    } else {
      // sin datos -> poner nulls por año
      years.forEach(y => {
        flat[`${prefix}_${y}`] = null;
      });
      delete flat[fieldName];
    }
  };

  expandIfObj('programados', 'Programado');
  expandIfObj('ejecutados', 'Ejecutado');
  expandIfObj('porcentajes', 'Pct');
  expandIfObj('pct_calculable', 'PctCalculable');

  return flat;
}

// Obtener años desde metadata o desde filas (fallback)
function detectYears(parsed: any): number[] {
  if (!parsed) return [];
  // Si tiene metadata.yearsDetected
  if (parsed.metadata && Array.isArray(parsed.metadata.yearsDetected)) {
    return parsed.metadata.yearsDetected;
  }
// Si tiene presentationObject.table.columns, extraer años de columnas
const cols = parsed.presentationObject?.table?.columns;
if (Array.isArray(cols)) {
  const years = cols
    .map((c: string) => {
      const m = c.match(/(20\d{2})/);
      return m ? Number(m[1]) : null;
    })
    // Type predicate para que TS infiera `number[]`
    .filter((y): y is number => typeof y === 'number');
  if (years.length) return Array.from(new Set(years)).sort((a, b) => a - b);
}

  // Si tiene rows con programados como objeto, tomar keys
  const rows = parsed.presentationObject?.table?.rows ?? parsed.rows ?? null;
  if (Array.isArray(rows) && rows.length) {
    const sample = rows.find(r => r && typeof r === 'object');
    if (sample && sample.programados && typeof sample.programados === 'object') {
      return Object.keys(sample.programados).map(k => Number(k)).filter(n => !Number.isNaN(n)).sort();
    }
  }
  return [];
}
// (mantén normalizeAndDedupStrings tal cual)
function normalizeAndDedupStrings(arr: any[]): string[] {
  const seen = new Map<string, string>(); // key: lowerTrimmed -> originalFirstSeen
  for (const v of arr) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (s.length === 0) continue;
    const key = s.normalize(); // preserve accents but normalize unicode
    const keyLower = key.toLowerCase();
    if (!seen.has(keyLower)) seen.set(keyLower, s);
  }
  // Convert to array and sort alphabetically (case-insensitive but preserve accents/diacritics)
  const result = Array.from(seen.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return result;
}

async function sendToAI(userMsg: Message, idPlanParam: number, idUserParam?: number | null) {
  const typingMsg = pushMessage('…', 'app');
  setAiLoading(true);

  console.log('🟢 [sendToAI] Iniciado', { userMsgId: userMsg.id, idPlanParam, idUserId: idUserParam });

  try {
    console.log('⏳ [sendToAI] Llamando thunkFetchChatbot...');
    const action = await dispatch(
      thunkFetchChatbot({
        text: userMsg.text,
        idPlan: idPlanParam,
        idUser: idUserParam ?? null,
      })
    );
    console.log('✅ [sendToAI] thunkFetchChatbot resolvió');

    const data = (action as any).payload as ChatbotResponse;
    console.log('🧩 [sendToAI] Payload recibido:', data);

    // Texto visible por defecto
    let aiText = data?.naturalLanguageResponse ?? '(Error en la consulta a la IA)';
    console.log('🔤 [sendToAI] Texto inicial IA (preview):', aiText?.slice?.(0, 300));

    // Preferir llmResponseParsed si existe
    let parsedContent: any = data?.llmResponseParsed ?? null;
    console.log('🔎 [sendToAI] llmResponseParsed presente?:', !!parsedContent);

    // Extraer JSON embebido si no hay llmResponseParsed
    if (!parsedContent) {
      console.log('🔍 [sendToAI] Intentando extraer JSON embebido...');
      const { jsonText, cleanedText } = extractJsonFromText(aiText);
      if (jsonText) {
        console.log('🔸 [sendToAI] JSON embebido detectado (len):', jsonText.length);
        const parsed = tryParseJsonSafe(jsonText);
        if (parsed !== null) {
          parsedContent = parsed;
          aiText = cleanedText.trim(); // limpiar el texto visible (puede quedar vacio)
          console.log('✅ [sendToAI] JSON embebido parseado correctamente.');
        } else {
          console.warn('⚠️ [sendToAI] No se pudo parsear el JSON embebido.');
        }
      } else {
        const t = aiText.trim();
        if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
          console.log('🔸 [sendToAI] Texto completo parece JSON, intentando parsear...');
          const parsed = tryParseJsonSafe(t);
          if (parsed !== null) {
            parsedContent = parsed;
            aiText = ''; // todo era JSON
            console.log('✅ [sendToAI] Respuesta completa en texto fue parseada como JSON.');
          } else {
            console.warn('⚠️ [sendToAI] No se pudo parsear el texto completo como JSON.');
          }
        } else {
          console.log('ℹ️ [sendToAI] No se encontró JSON embebido en el texto.');
        }
      }
    } else {
      console.log('ℹ️ [sendToAI] Usando llmResponseParsed proveniente del backend.');
    }

    // Inicializar outputs estructurados
    let tableObject: TableObject = null;
    let structuredData: any = null;

    // Caso A: parsedContent es array de primitivos -> normalizar y mostrar como lista legible (con guiones)
    if (Array.isArray(parsedContent) && parsedContent.length > 0 && parsedContent.every(v => ['string', 'number', 'boolean'].includes(typeof v))) {
      console.log('🟢 [sendToAI] parsedContent es array primitivo; se procesará para mostrar lista legible.');
      const normalized = normalizeAndDedupStrings(parsedContent);
      structuredData = normalized; // array limpio para el front
      // Mostrar en el chat como lista legible con guiones (una por línea)
      aiText = normalized.map(s => `- ${s}`).join('\n');
      tableObject = null;
      console.log('🟢 [sendToAI] Lista normalizada (preview):', normalized.slice(0, 20));
    }
    // Caso B: parsedContent es array de objetos -> tabla (comportamiento anterior)
    else if (Array.isArray(parsedContent) && parsedContent.length > 0 && parsedContent.every(item => isRecord(item))) {
      console.log('🟢 [sendToAI] parsedContent es array de objetos -> normalizando a tableObject.');
      const rows = parsedContent as Record<string, any>[];
      const years = detectYears({ presentationObject: { table: { rows } }, metadata: undefined });
      const flattenedRows = rows.map(r => flattenRowForTable(r, years));
      tableObject = { type: 'table', rows: flattenedRows };
      structuredData = parsedContent;
      aiText = data?.naturalLanguageResponse ?? '';
    }
    // Caso C: parsedContent es objeto con presentationObject o similar
    else if (parsedContent && isRecord(parsedContent)) {
      console.log('🟢 [sendToAI] parsedContent es objeto -> comportamiento normal (presentationSummary/presentationObject).');
      if (parsedContent?.presentationSummary && typeof parsedContent.presentationSummary === 'string' && parsedContent.presentationSummary.trim().length) {
        aiText = parsedContent.presentationSummary.trim();
      } else if (parsedContent?.presentationType && !aiText) {
        aiText = `Se presenta información en formato "${parsedContent.presentationType}".`;
      }

      structuredData = parsedContent;
      const rows = normalizeToTableRows(parsedContent);
      const years = detectYears(parsedContent);
      if (rows && Array.isArray(rows) && rows.length > 0) {
        const flattenedRows = rows.map((r: Record<string, any>) => flattenRowForTable(r, years));
        tableObject = { type: 'table', rows: flattenedRows };
      } else {
        const explicitRows = parsedContent.presentationObject?.table?.rows;
        if (Array.isArray(explicitRows)) {
          const yearsFromMeta = detectYears(parsedContent);
          const flattenedRows = explicitRows.map((r: Record<string, any>) => flattenRowForTable(r, yearsFromMeta));
          tableObject = { type: 'table', rows: flattenedRows };
        }
      }
    } else {
      console.log('ℹ️ [sendToAI] parsedContent es nulo o no reconocible; se mostrará el texto natural de la IA.');
    }

    // Actualizar mensaje en el estado: texto visible + estructuras adjuntas
    setMessages(prev =>
      prev.map(m =>
        m.id === typingMsg.id
          ? {
              ...m,
              text: aiText || '(sin explicación)',
              time: Date.now(),
              structuredData: structuredData ?? null,
              tableObject: tableObject,
            }
          : m
      )
    );
    console.log('💬 [sendToAI] Mensaje IA actualizado (texto + estructuras).');

    // Guardar conversación y opciones de plot
    setConversations(prev => [...prev, userMsg.text, aiText || '']);
    setPlotOpts(prev => [...prev, null, tableObject]);
    console.log('🗂️ [sendToAI] Conversación y plotOpts actualizados.');

  } catch (err: any) {
    console.error('[sendToAI] Error capturado:', err);
    setMessages(prev =>
      prev.map(m =>
        m.id === typingMsg.id ? { ...m, text: `Error: ${err?.message ?? String(err)}`, time: Date.now() } : m
      )
    );
    setConversations(prev => [...prev, userMsg.text, `Error: ${err?.message ?? String(err)}`]);
    setPlotOpts(prev => [...prev, null, null]);
    console.log('❌ [sendToAI] Estado actualizado con error.');
  } finally {
    setAiLoading(false);
    console.log('🏁 [sendToAI] Finalizado.');
  }
}


  // --- Aquí está la función handleSend actualizada ---
  function handleSend() {
    if (!input.trim()) return;

    // Construir el mensaje del usuario
    const userMsg: Message = {
      id: String(Date.now()),    // <-- id como string
      text: input.trim(),
      from: "user",
      time: Date.now(),
    };

    // Agregar el mensaje a la UI inmediatamente
    setMessages((prev) => [...prev, userMsg]);

    // Limpiar input
    setInput("");

    // Llamar a la función que despacha el thunk, pasando idPlan e id (id es idUser)
    // Usamos void para silenciar la promesa en handlers sin await
    void sendToAI(userMsg, idPlan, id);
  }

  function rowsToMarkdownTable(rows: any[]): string {
    if (!rows || rows.length === 0) return "No hay resultados.";

    // Cabeceras (todas las keys del primer objeto)
    const headers = Object.keys(rows[0]);

    // Cabecera Markdown
    const headerLine = `| ${headers.join(" | ")} |`;
    const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;

    // Filas
    const rowsLines = rows.map(row =>
      "| " +
      headers
        .map(h => {
          const v = row[h];
          if (v === null || v === undefined) return "";
          // Escapar pipes y nuevas líneas para no romper la tabla
          return String(v).replace(/\|/g, "\\|").replace(/\n/g, " ");
        })
        .join(" | ") +
      " |"
    );

    return [headerLine, separatorLine, ...rowsLines].join("\n");
  }


  // Preprocesar conversaciones: Markdown -> HTML -> sanitized HTML -> parsed React nodes
  const parsedConversations = useMemo(() => {
    return conversations.map((c, i) => {
      // 1) Convertir Markdown a HTML
      // marked.parse puede estar tipado como string | Promise<string> en algunos entornos.
      // Forzamos a string explícitamente (es seguro: marked.parse es síncrono en el navegador).
      const rawHtml = marked.parse(String(c || "")) as string;

      // 2) Sanitizar (DOMPurify.sanitize puede estar tipado como string | Promise<string>)
      // Forzamos a string de forma explícita.
      const sanitized = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ["target"] }) as string;

      // Ahora cleanHtml es definitivamente string (TS ya no se queja)
      const cleanHtml: string = sanitized;

      // 3) Parsear HTML a React nodes aplicando replaceChartPlaceholder
      const nodes = parse(cleanHtml, {
        replace: (domNode: DOMNode) => {
          return replaceChartPlaceholder(domNode, i) ?? undefined;
        },
      });

      return nodes as React.ReactNode;
    });
  }, [conversations, plotOpts]);


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

              {parsedConversations.map((node, i) => {
                const isAssistant = i % 2 === 1;
                const plot = plotOpts[i] as any;

                return (
                  <div key={i} className={`tw-flex ${isAssistant ? 'tw-justify-end' : 'tw-justify-start'}`}>
                    <div className={`tw-max-w-[78%] tw-p-3 ... ${isAssistant ? 'tw-bg-blue-600 tw-text-white tw-rounded-br-none' : 'tw-bg-gray-100 tw-text-gray-900 tw-rounded-bl-none'}`} style={{ overflow: 'visible' }}>
                      {!isAssistant && (
                        <div className="tw-inline-block ...">Cloud-i:</div>
                      )}

                      <div ref={(el) => (messageRefs.current[`conv-${i}`] = el)} className="scroll-viewport" style={{ maxWidth: "100%", overflowX: "auto", overflowY: 'hidden' }}>
                        <div className={`msg-text-inner ...`}>
                          {/* 1) Mostrar siempre la explicación (node) */}
                          {node}

                          {/* 2) Si plotOpts indica tabla, mostrar DataGrid **debajo** del node */}
                          {plot && plot.type === 'table' && Array.isArray(plot.rows) && plot.rows.length > 0 && (
                            (() => {
                              const rows = plot.rows as any[];
                              const columns: GridColDef[] = Object.keys(rows[0]).map((key) => ({
                                field: key,
                                headerName: key,
                                width: 150,
                                sortable: true,
                              }));
                              const gridRows = rows.map((r, idx) => {
                                const idField = r.id ?? r.id_node ?? r.id_secretary ?? idx;
                                return { id: idField, ...r };
                              });

                              return (
                                <div style={{ marginTop: 12, width: '100%' }}>
                                  <div style={{ height: Math.min(400, 70 + gridRows.length * 40), width: '100%' }}>
                                    <DataGrid
                                      rows={gridRows}
                                      columns={columns}
                                      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                                      pageSizeOptions={[5, 10, 20]}
                                      disableRowSelectionOnClick
                                      autoHeight
                                      density="compact"
                                    />
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </div>

                      {isAssistant ? (
                        <div className="tw-flex tw-justify-end tw-mt-2">
                          <IconButton size="small" title="Guardar pront" onClick={() => savePront(conversations[i])} className="tw-text-white hover:tw-bg-blue-700">
                            <Save sx={{ fontSize: 16, color: '#FFFFFF' }} />
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}



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
                  <InputLabel id='inputs' sx={{ color: 'black', fontSize: '12px' }}>
                    Mensajes predeterminados
                  </InputLabel>
                  <Select
                    labelId="inputs"
                    id="demo-simple-select"
                    value={pront1}
                    label="Input"
                    sx={{ color: 'black', fontSize: '12px' }}
                    onChange={handleSelectChange}
                    input={<BootstrapInput />}>
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
                  <InputLabel id='MyPronts' sx={{ color: 'black', fontSize: '12px' }}>
                    Mensajes guardados
                  </InputLabel>
                  <Select
                    labelId="MyPronts"
                    id="demo-simple-select"
                    value={pront2}
                    label="Pront"
                    sx={{ color: 'black', fontSize: '12px' }}
                    onChange={handleProntSelect}
                    input={<BootstrapInput />}
                    MenuProps={MenuProps}
                    renderValue={selected =>
                      <div>
                        <IconButton
                          size="small"
                          title="Borrar pront"
                          edge="end">
                          <Delete sx={{ color: '#000000', fontSize: 16 }} />
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
                        <ListItemText primary={p.input} />
                        <IconButton
                          size="small"
                          title="Borrar pront"
                          onClick={e => deletePront(e, p.id_input)}
                          edge="end">
                          <Delete sx={{ color: '#000000', fontSize: 16 }} />
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
