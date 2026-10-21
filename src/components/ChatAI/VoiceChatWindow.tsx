import React, { useEffect, useRef, useState, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useAppSelector } from '@/store';
import { consultPlanAi, PlanConsultResult } from '@/services/chat.api';
import { notify, decode } from '@/utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  model?: string;
  source?: string;
}

const DEFAULT_SUGGESTIONS = [
  '¿Cuál es el avance general del plan?',
  '¿Cuáles son las metas con mayor ejecución?',
  '¿Cuáles metas tienen menor progreso o están rezagadas?',
  '¿Qué secretarías o dependencias tienen metas asignadas?',
  '¿Cuál es el presupuesto total asignado al plan?'
];

export const VoiceChatWindow: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  // Redux: obtener id_plan actual y usuario
  const contentStore = useAppSelector((state) => state.content);
  const planStore = useAppSelector((state) => state.plan);
  const authStore = useAppSelector((state) => state.auth);

  const activePlanId = useMemo(() => {
    const rawId =
      contentStore?.id_plan ||
      planStore?.plan?.id_plan ||
      localStorage.getItem('id_plan') ||
      '6031';
    const parsed = Number(rawId);
    return isNaN(parsed) || parsed <= 0 ? 6031 : parsed;
  }, [contentStore?.id_plan, planStore?.plan?.id_plan]);

  // Identificador de cuenta de usuario para aislamiento estricto
  const currentUserId = useMemo(() => {
    if (authStore?.token_info?.token) {
      try {
        const decoded = decode(authStore.token_info.token);
        if (decoded?.user) return decoded.user;
        if (decoded?.id) return `user_${decoded.id}`;
      } catch (e) { }
    }
    return localStorage.getItem('user') || localStorage.getItem('id') || 'default_user';
  }, [authStore?.token_info?.token]);

  // Nombre legible del plan para la interfaz (sin mostrar ID numérico)
  const planDisplayName = useMemo(() => {
    const rawName = planStore?.plan?.name?.trim();
    if (rawName) {
      try {
        localStorage.setItem(`cc_plan_name_${activePlanId}`, rawName);
      } catch (e) { }
      return rawName;
    }
    const cachedName = localStorage.getItem(`cc_plan_name_${activePlanId}`);
    if (cachedName) return cachedName;
    return 'Plan de Desarrollo';
  }, [planStore?.plan?.name, activePlanId]);

  // Clave de almacenamiento aislada por usuario y por plan
  const storageKey = `cc_chat_${currentUserId}_plan_${activePlanId}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const loadedKeyRef = useRef<string>('');

  // Cargar historial específico de usuario y plan cuando cambia la clave
  useEffect(() => {
    let initialMsgs: ChatMessage[] = [
      {
        id: `welcome-${activePlanId}`,
        role: 'assistant',
        text: `¡Hola! Soy tu **Asistente IA** para el **${planDisplayName}**.\n\nPuedes hacerme consultas sobre metas físicas, financieras, secretarías responsables o indicadores de avance.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-2.5-flash',
      },
    ];

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialMsgs = parsed;
        }
      }
    } catch (e) {
      console.warn('Error al cargar historial del chat:', e);
    }

    setMessages(initialMsgs);
    loadedKeyRef.current = storageKey;
  }, [storageKey, planDisplayName, activePlanId]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sincronizar localStorage cuando cambian los mensajes (solo si coincide con la clave activa)
  useEffect(() => {
    if (loadedKeyRef.current !== storageKey || !messages || messages.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Error al guardar mensajes en localStorage:', e);
    }
  }, [messages, storageKey]);

  // Auto-scroll al final del chat
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized, loading]);

  // Inicializar Speech Recognition para consultas por voz
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-CO';

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setListening(false);
        };

        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition no inicializado:', err);
      }
    }
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) { }
    };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      notify('El reconocimiento de voz no está soportado en este navegador', 'error');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (e) {
        setListening(false);
      }
    }
  };

  const handleSend = async (questionText?: string) => {
    const queryToSend = (questionText || input).trim();
    if (!queryToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: queryToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result: PlanConsultResult = await consultPlanAi({
        idPlan: activePlanId,
        planName: planDisplayName,
        question: queryToSend,
        query: queryToSend,
      });

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: result.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: result.model || 'gemini-2.5-flash',
        source: result.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error al consultar IA:', error);
      const errorMsg =
        error?.message ||
        'No se pudo conectar con el servicio de IA. Verifica que esté activo backend_controland o CloudControl_backend.';

      const errorMessage: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Error en la consulta:** ${errorMsg}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-reset-${Date.now()}`,
      role: 'assistant',
      text: `Chat reiniciado para **${planDisplayName}**. ¿Qué deseas consultar hoy?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-2.5-flash',
    };
    setMessages([welcomeMsg]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) { }
    notify('Historial de chat limpiado', 'success');
  };

  const copyToClipboard = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      notify('Texto copiado al portapapeles', 'success');
    } catch (e) {
      notify('No se pudo copiar el texto', 'error');
    }
  };

  const renderMarkdown = (content: string) => {
    try {
      const rawHtml = marked.parse(content, { breaks: true, gfm: true }) as string;
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      return <div className="ai-markdown-content" dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
    } catch (e) {
      return <div className="tw-whitespace-pre-wrap tw-text-xs">{content}</div>;
    }
  };

  return (
    <>
      {/* Botón Flotante para Abrir Chat */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          className="tw-fixed tw-right-6 tw-bottom-6 tw-z-50 tw-flex tw-items-center tw-gap-2.5 tw-px-4 tw-py-3 tw-rounded-full tw-shadow-2xl tw-bg-gradient-to-r tw-from-[#012947] tw-via-[#0d3b66] tw-to-[#143955] tw-text-white tw-font-bold tw-text-xs tw-border tw-border-blue-400/40 hover:tw-scale-105 hover:tw-shadow-blue-900/30 tw-transition-all tw-duration-200"
          title={`Abrir Asistente IA (${planDisplayName})`}
          aria-label="Abrir Asistente IA"
        >
          <span className="tw-text-base">✨</span>
          <span>Asistente IA</span>
          <span className="tw-bg-emerald-500 tw-w-2 tw-h-2 tw-rounded-full tw-animate-pulse" />
        </button>
      )}

      {/* Ventana Flotante del Chat */}
      {open && (
        <div
          className={`tw-fixed tw-z-50 tw-flex tw-flex-col tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-border tw-border-slate-300 tw-overflow-hidden tw-transition-all tw-duration-200 ${maximized
              ? 'tw-fixed tw-inset-4 md:tw-inset-10 tw-w-auto tw-h-auto'
              : minimized
                ? 'tw-bottom-4 tw-right-6 tw-w-80 tw-h-14'
                : 'tw-bottom-6 tw-right-6 tw-w-[94vw] sm:tw-w-[460px] tw-h-[580px] tw-max-h-[85vh]'
            }`}
        >
          {/* Header */}
          <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-gradient-to-r tw-from-[#012947] tw-via-[#0d3b66] tw-to-[#143955] tw-text-white tw-shrink-0">
            <div className="tw-flex tw-items-center tw-gap-2 tw-overflow-hidden">
              <span className="tw-text-lg tw-shrink-0">🤖</span>
              <div className="tw-overflow-hidden">
                <h3
                  className="tw-font-bold tw-text-xs tw-text-white tw-leading-tight tw-truncate tw-max-w-[260px]"
                  title={planDisplayName}
                >
                  Asistente IA — {planDisplayName}
                </h3>
                <p className="tw-text-[10px] tw-text-blue-200 tw-truncate">Consultas del Plan Indicativo</p>
              </div>
            </div>

            {/* Controles de la Ventana */}
            <div className="tw-flex tw-items-center tw-gap-1.5">
              {!minimized && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="Limpiar conversación"
                  className="tw-p-1.5 tw-rounded-lg tw-text-slate-300 hover:tw-text-white hover:tw-bg-white/10 tw-transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMinimized(!minimized);
                  if (maximized) setMaximized(false);
                }}
                title={minimized ? 'Restaurar' : 'Minimizar'}
                className="tw-p-1.5 tw-rounded-lg tw-text-slate-300 hover:tw-text-white hover:tw-bg-white/10 tw-transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </button>

              {!minimized && (
                <button
                  type="button"
                  onClick={() => setMaximized(!maximized)}
                  title={maximized ? 'Restaurar tamaño' : 'Maximizar'}
                  className="tw-p-1.5 tw-rounded-lg tw-text-slate-300 hover:tw-text-white hover:tw-bg-white/10 tw-transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {maximized ? (
                      <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 4h6m0 0v6m0-6L13 11M4 10h6m0 0V4m0 6L3 3" />
                    ) : (
                      <path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7M3 9V3m0 0h6m-6 0l7 7m11 5v6m0 0h-6m6 0l-7-7" />
                    )}
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Cerrar chat"
                className="tw-p-1.5 tw-rounded-lg tw-text-slate-300 hover:tw-text-red-300 hover:tw-bg-red-500/20 tw-transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cuerpo del Chat (Visible si no está minimizado) */}
          {!minimized && (
            <div className="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden tw-bg-slate-50">
              {/* Sugerencias Rápidas */}
              {messages.length <= 1 && (
                <div className="tw-p-3 tw-bg-blue-50/70 tw-border-b tw-border-blue-100">
                  <p className="tw-text-[11px] tw-font-bold tw-text-blue-900 tw-mb-2">💡 Preguntas rápidas sugeridas:</p>
                  <div className="tw-flex tw-flex-wrap tw-gap-1.5">
                    {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(sug)}
                        className="tw-text-[10px] tw-bg-white hover:tw-bg-blue-100 tw-text-blue-900 tw-font-medium tw-px-2.5 tw-py-1 tw-rounded-lg tw-border tw-border-blue-200 tw-shadow-xs tw-text-left tw-transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de Mensajes */}
              <div className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`tw-flex tw-flex-col ${msg.role === 'user' ? 'tw-items-end' : 'tw-items-start'}`}
                  >
                    <div className="tw-flex tw-items-center tw-gap-1.5 tw-mb-1 tw-px-1">
                      <span className="tw-text-[10px] tw-font-bold tw-text-slate-500">
                        {msg.role === 'user' ? 'Tú' : 'Asistente IA'}
                      </span>
                      {msg.model && msg.role === 'assistant' && (
                        <span className="tw-text-[9px] tw-font-mono tw-bg-blue-100 tw-text-blue-800 tw-px-1.5 tw-py-0.2 tw-rounded tw-font-bold">
                          {msg.model}
                        </span>
                      )}
                      <span className="tw-text-[9px] tw-text-slate-400">{msg.time}</span>
                    </div>

                    <div
                      className={`tw-max-w-[88%] tw-p-3.5 tw-rounded-2xl tw-shadow-sm ${msg.role === 'user'
                          ? 'tw-bg-[#012947] tw-text-white tw-rounded-tr-none'
                          : 'tw-bg-white tw-text-slate-800 tw-border tw-border-slate-200 tw-rounded-tl-none'
                        }`}
                    >
                      {msg.role === 'user' ? (
                        <div className="tw-whitespace-pre-wrap tw-text-xs tw-font-medium leading-relaxed">
                          {msg.text}
                        </div>
                      ) : (
                        <div>
                          {renderMarkdown(msg.text)}

                          {/* Barra inferior del mensaje IA */}
                          <div className="tw-mt-2 tw-pt-1.5 tw-border-t tw-border-slate-100 tw-flex tw-items-center tw-justify-between tw-text-[10px]">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(msg.id, msg.text)}
                              className="tw-text-slate-400 hover:tw-text-blue-600 tw-flex tw-items-center tw-gap-1 tw-transition"
                              title="Copiar respuesta"
                            >
                              <span>{copiedId === msg.id ? '✓ Copiado' : '📋 Copiar'}</span>
                            </button>
                            {msg.source && (
                              <span className="tw-text-[9px] tw-text-slate-400 tw-font-mono">
                                {msg.source === 'backend_controland' ? 'NestJS AI' : 'CloudControl AI'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="tw-flex tw-items-center tw-gap-2 tw-bg-white tw-border tw-border-blue-200 tw-p-3 tw-rounded-2xl tw-max-w-[70%] tw-shadow-xs">
                    <span className="tw-flex tw-gap-1">
                      <span className="tw-w-1.5 tw-h-1.5 tw-bg-blue-600 tw-rounded-full tw-animate-bounce" />
                      <span className="tw-w-1.5 tw-h-1.5 tw-bg-blue-600 tw-rounded-full tw-animate-bounce [animation-delay:0.2s]" />
                      <span className="tw-w-1.5 tw-h-1.5 tw-bg-blue-600 tw-rounded-full tw-animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span className="tw-text-[11px] tw-font-semibold tw-text-blue-900">
                      Analizando datos del plan...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="tw-p-3 tw-bg-white tw-border-t tw-border-slate-200 tw-shrink-0">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="Escribe una pregunta sobre metas, indicadores o avances..."
                    className="tw-flex-1 tw-px-3.5 tw-py-2.5 tw-text-xs tw-border tw-border-slate-300 tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-text-slate-800 tw-bg-slate-50 disabled:tw-opacity-50"
                  />

                  {/* Botón de voz */}
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`tw-p-2.5 tw-rounded-xl tw-border tw-transition ${listening
                        ? 'tw-bg-red-500 tw-text-white tw-border-red-600 tw-animate-pulse'
                        : 'tw-border-slate-300 tw-text-slate-600 hover:tw-bg-slate-100'
                      }`}
                    title={listening ? 'Detener micrófono' : 'Hablar por micrófono'}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                    </svg>
                  </button>

                  {/* Botón Enviar */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="tw-px-4 tw-py-2.5 tw-rounded-xl tw-bg-[#012947] hover:tw-bg-blue-800 disabled:tw-opacity-40 tw-text-white tw-font-bold tw-text-xs tw-flex tw-items-center tw-gap-1.5 tw-transition tw-shadow-sm"
                  >
                    <span>Enviar</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceChatWindow;
