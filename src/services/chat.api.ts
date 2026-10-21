import axios from "axios";
import { getEnvironment } from '../utils/environment';
import { getToken } from "@/utils";

const { BASE_URL, URL_AI } = getEnvironment();

export const api = axios.create({
    baseURL: BASE_URL || 'http://localhost:8080',
    timeout: 30000,
});

api.interceptors.request.use(
    async (request) => {
        try {
            const token = getToken();
            if (token?.token) {
                // @ts-expect-error headers
                request.headers = {
                    ...request.headers,
                    Authorization: `Bearer ${token.token}`
                };
            }
        } catch (error) {
            console.warn("Error setting token in chat.api", error);
        }
        return request;
    },
    (error) => Promise.reject(error)
);

export interface PlanConsultParams {
    idPlan: number;
    planName?: string;
    question: string;
    query?: string;
    contextText?: string;
}

export interface PlanConsultResult {
    answer: string;
    question?: string;
    model?: string;
    toolCalls?: any[];
    iterations?: number;
    source: 'backend_controland' | 'cloudcontrol_backend';
}

/**
 * Consulta de IA para planes de desarrollo.
 * 1) Intenta llamar a backend_controland (Next.js backend en :3001) vía /ai/plan-consult.
 * 2) Si no responde o falla, realiza fallback a CloudControl_backend (:8080) vía /chatbot/consulta-gemini.
 */
export const consultPlanAi = async ({
    idPlan,
    planName,
    question,
    query,
    contextText,
}: PlanConsultParams): Promise<PlanConsultResult> => {
    const promptText = question?.trim() || query?.trim() || '';
    if (!promptText) {
        throw new Error('La consulta no puede estar vacía.');
    }

    const aiBaseUrl = URL_AI || 'http://localhost:3001';

    let lastBackendError = '';

    // 1) Intento con backend_controland (NestJS /ai/plan-consult)
    try {
        const res = await axios.post(
            `${aiBaseUrl}/ai/plan-consult`,
            {
                idPlan: Number(idPlan),
                question: promptText,
                query: promptText,
                contextText: contextText || undefined,
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 4000,
            }
        );

        if (res.data) {
            const output =
                res.data.answer ||
                res.data.output_text ||
                res.data.output ||
                res.data.response ||
                res.data.script;

            if (output) {
                return {
                    answer: output,
                    question: res.data.question || promptText,
                    model: res.data.model || 'gemini-2.5-flash',
                    toolCalls: res.data.toolCalls,
                    iterations: res.data.iterations,
                    source: 'backend_controland',
                };
            }
        }
    } catch (err: any) {
        lastBackendError = err?.response?.data?.message || err?.message || '';
        console.warn(
            `[chat.api] backend_controland (${aiBaseUrl}/ai/plan-consult) no disponible:`,
            err?.message || err
        );
    }

    // 2) Fallback con CloudControl_backend (/chatbot/consulta-gemini)
    try {
        const res = await api.post(
            '/chatbot/consulta-gemini',
            {
                text: promptText,
                idPlan: Number(idPlan),
                planName,
            },
            { timeout: 45000 }
        );

        const data = res.data;
        const answer =
            data?.response ||
            data?.naturalLanguageResponse ||
            data?.answer ||
            (typeof data === 'string' ? data : '');

        if (answer) {
            return {
                answer,
                question: promptText,
                model: 'gemini-2.5-flash',
                source: 'cloudcontrol_backend',
            };
        }
    } catch (err: any) {
        lastBackendError = err?.response?.data?.msg || err?.response?.data?.message || err?.message || '';
        console.warn(
            '[chat.api] CloudControl_backend POST falló, intentando GET:',
            err?.message || err
        );
        try {
            const getRes = await api.get('/chatbot/consulta-gemini', {
                params: { text: promptText, idPlan: Number(idPlan), planName },
                timeout: 45000,
            });
            const answer =
                getRes.data?.response ||
                getRes.data?.naturalLanguageResponse ||
                getRes.data?.answer;
            if (answer) {
                return {
                    answer,
                    question: promptText,
                    model: 'gemini-2.5-flash',
                    source: 'cloudcontrol_backend',
                };
            }
        } catch (getErr: any) {
            lastBackendError = getErr?.response?.data?.msg || getErr?.response?.data?.message || getErr?.message || lastBackendError;
            console.error('[chat.api] Ambos backends fallaron:', getErr?.message || getErr);
        }
    }

    throw new Error(
        lastBackendError
            ? `Error del servidor de IA: ${lastBackendError}`
            : 'No se pudo conectar con el servicio de IA. Verifica que esté activo backend_controland (puerto 3001) o CloudControl_backend (puerto 8080).'
    );
};

export const chatModel = async (messages: string[]) => {
    const lastMsg = messages[messages.length - 1] || '';
    const matchPlan = lastMsg.match(/id:\s*(\d+)/i);
    const idPlan = matchPlan ? Number(matchPlan[1]) : 6031;
    const cleanMsg = lastMsg.replace(/\.?\s*Para el plan con id:\s*\d+\.?/i, '').trim();

    const result = await consultPlanAi({
        idPlan,
        question: cleanMsg || lastMsg,
    });

    return {
        res: result.answer,
        options: null,
    };
};