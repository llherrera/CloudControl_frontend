import axios from "axios";
import jwtDecode from "jwt-decode";
import { getEnvironment } from '../utils/environment';

import {  } from "../interfaces";

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

export const getPQRSsByPlan = async () => {
    const response = await api.get("/PQRS/peticiones");
    return response.data;
}

export const getPQRSByRadicado = async () => {
    const response = await api.get("/PQRS/peticion");
    return response.data;
}

export const getPQRSTypes = async () => {
    const response = await api.get("/PQRS/tipo");
    return response.data;
}

export const getPQRSHistoryByRadicado = async () => {
    const response = await api.get("/PQRS/historial");
    return response.data;
}

export const addPQRS = async () => {
    const response = await api.post("/PQRS/peticion");
    return response.data;
}

export const addPQRSType = async () => {
    const response = await api.post("/PQRS/tipo");
    return response.data;
}

export const addPQRSHistory = async () => {
    const response = await api.post("/PQRS/historial");
    return response.data;
}
export const UpdatePQRS = async () => {
    const response = await api.put("/PQRS/peticion");
    return response.data;
}
