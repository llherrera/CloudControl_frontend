import axios from "axios";
import jwtDecode from "jwt-decode";
import { getEnvironment } from '../utils/environment';
import { getToken } from "@/utils";

const { BASE_URL } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
})

api.interceptors.request.use(
    async request => {
        try {
            let token = getToken();
            if (token) {
                token = token.token;
                // @ts-expect-error request.headers
                request.headers = {
                    ...request.headers,
                    Authorization: `Bearer ${token}`
                }
                const decoder: {exp: number} = jwtDecode(token);
                const isExpired = new Date(decoder.exp * 1000) < new Date();
                //if (!isExpired) return request
                //const newToken = await refreshToken();
                //if (newToken)
                //// @ts-expect-error request.headers
                //    request.headers = {
                //        ...request.headers,
                //        Authorization: `Bearer ${newToken.token}`
                //    }
                //return request;
            }
            request
            return request;
        } catch (error) {
            console.log(error);
        }

    return request;
    }, error => {
        console.log(error);
        
        return Promise.reject(error);
    }
)

export const chatModel = async (messages: string[]) => {
    const response = await api.get("/servicios/chat", {
        params: {
            msgs: messages
        }
    });
    return response.data;
}