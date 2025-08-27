import React, { useEffect, useRef, useState } from "react";

type MsgFrom = "user" | "app";
interface Message {
  id: string;
  text: string;
  from: MsgFrom;
  time: number;
}

export default function VoiceChatWindow() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // refs
  const recognitionRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scrollingIds, setScrollingIds] = useState<Record<string, boolean>>({});

  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
    const userMsg = pushMessage(input, "user");
    setInput("");
    void sendToAI(userMsg);
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
              {messages.length === 0 && (
                <div className="tw-text-center tw-text-sm tw-text-gray-400 tw-mt-6">Empieza la conversación — escribe o usa el micrófono</div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`tw-flex ${m.from === "user" ? "tw-justify-end" : "tw-justify-start"}`}>
                  <div
                    className={`tw-max-w-[78%] tw-p-3 tw-rounded-xl tw-shadow-sm tw-text-sm tw-leading-relaxed
                      ${m.from === "user" ? "tw-bg-blue-600 tw-text-white tw-rounded-br-none" : "tw-bg-gray-100 tw-text-gray-900 tw-rounded-bl-none"}
                    `}
                    style={{ overflow: 'visible' }}
                  >
                    <div
                      ref={(el) => (messageRefs.current[m.id] = el)}
                      className="scroll-viewport"
                      style={{ maxWidth: "100%", overflowX: "auto", overflowY: 'hidden' }}
                    >
                      <div
                        className={`msg-text-inner tw-inline-block tw-align-middle tw-pr-2 tw-break-words ${scrollingIds[m.id] && listening ? 'scroll-anim' : ''}`}
                        style={
                          scrollingIds[m.id] && listening
                            ? { whiteSpace: "nowrap", display: 'inline-block' }
                            : { whiteSpace: "normal", display: 'inline-block' }
                        }
                      >
                        <div>{m.text}</div>
                      </div>
                    </div>

                    <div className="tw-text-[10px] tw-text-gray-400 tw-pt-1 tw-text-right">{new Date(m.time).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tw-p-3 tw-border-t tw-bg-white">
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
