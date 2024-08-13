import axios from "axios";
import { getEnvironment } from '../utils/environment';

const { BASE_URL } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
})

export const chatModel = async (messages: string[]) => {
    const response = await api.get("/servicios/chat", {
        params: {
            msgs: messages
        }
    });
    return response.data;
}