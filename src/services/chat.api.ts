import axios from "axios";
import { getEnvironment } from '../utils/environment';

const { BASE_URL } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
})

export const chatModel = async (message: string) => {
    const response = await api.get("/servicios/chat", {
        params: {
            msg: message
        }
    });
    return response.data;
}