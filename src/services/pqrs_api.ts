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

export const getPQRSsByPlan = async (id_plan: number) => {
    const response = await api.get("/PQRS/peticiones", {
        params: {
            id_plan
        }
    });
    return response.data;
}

export const getPQRSByRadicado = async (radicado: string) => {
    const response = await api.get("/PQRS/peticion", {
        params: {
            radicado
        }
    });
    return response.data;
}

export const getPQRSTypes = async (id_plan: number) => {
    const response = await api.get("/PQRS/tipo", {
        params: {
            id_plan
        }
    });
    return response.data;
}

export const getPQRSHistoryByRadicado = async (radicado: string) => {
    const response = await api.get("/PQRS/historial", {
        params: {
            radicado
        }
    });
    return response.data;
}

export const addPQRS = async (id_plan: number, pqrs: {}) => {
    const response = await api.post("/PQRS/peticion", {
        id_plan,
        pqrs
    });
    return response.data;
}

export const addPQRSType = async (id_plan: number, type: {}) => {
    const response = await api.post("/PQRS/tipo", {
        id_plan,
        type
    });
    return response.data;
}

export const addPQRSHistory = async (radicado: string) => {
    const response = await api.post("/PQRS/historial", {
        radicado
    });
    return response.data;
}

export const UpdatePQRS = async () => {
    const response = await api.put("/PQRS/peticion");
    return response.data;
}

export const getModulosUsuarioById = async (idUsuario: number) => {
    const response = await api.get(`/misc/modulos-usuario/${idUsuario}`);
    return response.data;
}

export const updateModulosUsuarioById = async (idUsuario: number, modulos: any) => {
    const response = await api.put(`/misc/modulos-usuario/${idUsuario}`, modulos);
    return response.data;
}

export const addModulosUsuario = async (modulos: any) => {
    const response = await api.post(`/misc/modulos-usuario`, modulos);
    return response.data;
}

export const getUsersByPlan = async (idPlan: number) => {
    const response = await api.get(`/misc/usuarios-plan/${idPlan}`);
    return response.data;
}

export const addSolicitud = async (solicitud: any) => {
    const response = await api.post("/misc/solicitudes", solicitud);
    return response.data;
}

export const getAllSolicitudes = async (id_plan: string) => {
    const response = await api.get(`/misc/solicitudes/${id_plan}`,);
    return response.data;
}

export const getServiciosByPlan = async (id_plan: number) => {
    const response = await api.get("/misc/servicios", {
        params: {
            id_plan
        }
    });
    return response.data;
};

export const addServicio = async (servicio: any) => {
    const response = await api.post("/misc/servicios", servicio);
    return response.data;
};

export const getOficinasByPlan = async (id_plan: number) => {
    const response = await api.get("/misc/oficinas", {
        params: {
            id_plan
        }
    });
    return response.data;
};

export const updateUserData = async (id_user: number, office: string, isActive: boolean) => {
    const response = await api.put(`/misc/edit-usuario/${id_user}`, {
        id_user,
        office,
        isActive
    });
    return response.data;
};

export const updateRolUserOffice = async (id_user: number, rol: string) => {
    const response = await api.put(`/misc/edit-rol-usuario/${id_user}`, {
        id_user,
        rol
    });
    return response.data;
};

export const getUserOfficeById = async (id_user: number) => {
    const response = await api.get(`/misc/usuario-oficina/${id_user}`);
    return response.data;
};

export const solveSolicitud = async (id_solicitud: string) => {
    const response = await api.put(`/misc/solve-solicitud/${id_solicitud}`);
    return response.data;
};

export const redirectionSolicitud = async (id_solicitud: string, oficinaDestino: string) => {
    const response = await api.put(`/misc/redirection-solicitud/${id_solicitud}`, {
        oficinaDestino
    });
    return response.data;
};