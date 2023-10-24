import axios from "axios";
import { AñoInterface, UnidadInterface, NodoInterface, 
    NivelInterface, RegisterInterface, PDTInterface, EvidenciaInterface } from "../interfaces";
import { useAppSelector } from '../store';
import { getToken, refreshToken } from "@/utils";
import jwtDecode from "jwt-decode";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

const gettoken = getToken();
let token: string;
if (gettoken) {
    token = gettoken.token;
}

/*api.interceptors.request.use(async request => {
    const token = getToken();
    if (token) {
        // @ts-expect-error request.headers
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${token}`
        }
        const decoder: {exp: number} = jwtDecode(token);
        const isExpired = new Date(decoder.exp * 1000) < new Date();
        if (!isExpired) return request
        const newToken = await refreshToken();
        if (newToken)
            // @ts-expect-error request.headers
            request.headers = {
                ...request.headers,
                Authorization: `Bearer ${newToken}`
            }
        return request;
    }
    return request;
    }, error => {
        console.log(error);
        
        return Promise.reject(error);
    }
);*/

// Obtiene todos los PDTs
export const getPDTs = async () => {
    try {
        const response = await api.get("/pdt",
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los niveles de un PDT 
export const getPDTid = async (id: string) => {
    try {
        const response = await api.get(`/pdt/${id}`,
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene el ultimo PDT
export const getLastPDT = async () => {
    try {
        const response = await api.get("/pdt/last");
        return response.data;
    } catch (error) {
        return error;
    }
}

// Hace login con el usuario y contraseña
interface LoginProps {
    username: string
    password: string
}
export const doLogin = async (data:LoginProps) => {
    const { username, password } = data;
    try {
        const response = await api.post('/users/login', {
            usuario: username,
            clave:   password
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Hacer logout
export const doLogout = async () => {
    try {
        const response = await api.post('/users/logout',
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const doRefreshToken = async () => {
    try {
        const response = await api.post('/users/refresh',
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Crea un usuario funcionario para un PDT especifico
export const doRegister = async (id: number, userData: RegisterInterface) => {
    try {
        const response = await api.post('/users/register', {
            id_plan:  id,
            usuario:  userData.usuario,
            apellido: userData.apellido,
            clave:    userData.contraseña,
            correo:   userData.correo,
            rol:      userData.rol,
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Cambiar permisos de un usuario
export const changePermissions = async (id: number, rol: string) => {
    try {
        const response = await api.post('/users/update', {
            id_user: id,
            rol:     rol
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade un nuevo PDT
export const addPDT = async (pdt: PDTInterface) => {
    try {
        const response = await api.post("/pdt", {
            Nombre:       pdt.Nombre,
            Alcaldia:     pdt.Alcaldia,
            Municipio:    pdt.Municipio,
            Fecha_inicio: pdt.Fecha_inicio,
            Fecha_fin:    pdt.Fecha_fin,
            Descripcion:  pdt.Descripcion,
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Actualiza un PDT
export const updatePDT = async (id: number, pdt: PDTInterface) => {
    try {
        const response = await api.put(`/pdt/${id}`, {
            Nombre:       pdt.Nombre,
            Alcaldia:     pdt.Alcaldia,
            Municipio:    pdt.Municipio,
            Fecha_inicio: pdt.Fecha_inicio,
            Fecha_fin:    pdt.Fecha_fin,
            Descripcion:  pdt.Descripcion,
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Borrar un PDT
export const deletePDT = async (id: number) => {
    try {
        const response = await api.delete(`/pdt/${id}`,
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade todos los niveles a un PDT
export const addNivel = async (nivel: NivelInterface[], id : string) => {
    try {
        const response = await api.post(`/pdt/${id}`, { niveles: nivel },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene todos los nodos de un nivel de un PDT
export const getNodosNivel = async (id: number, Padre: (string | null)) => {
    try {
        const response = await api.get(`/pdt/nivel`, { 
            params: { 
                id_nivel: id, 
                Padre:    Padre 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade todos los nodos a un nivel de un PDT
export const addNodoNivel = async (nodo: NodoInterface[]) => {
    try {
        const response = await api.post("/pdt/nivel", { nodos: nodo },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Borrar un nivel de un PDT
export const deleteNivel = async (id: number) => {
    try {
        const response = await api.delete(`/pdt/nivel`, {
            params: {
                id_nivel: id
            },
            headers: { authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los nombres de cada nivel que tienen los nodos
export const getNombreNivel = async (ids: string[]) => {
    try {
        const response = await api.get(`/nodo/nombres`, {
            params: { 
                id_nodos: ids 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade una unidad de nodo donde se registre la programacion financiera por años
export const addNodoUnidadYAños = async (idPDT: string, idNodo: string, nodoUnidad: UnidadInterface, años: AñoInterface) => {
    try {
        const response = await api.post("/nodo", { 
            id_plan: idPDT,
            id_nodo: idNodo,
            nodo:    nodoUnidad,
            años:    años
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene una unidad de nodo donde se registre la programacion financiera por años
export const getNodoUnidadYAños = async (idPDT: string, idNodo: string) => {
    try {
        const response = await api.get(`/nodo`, {
            params: { 
                id_plan: idPDT, 
                id_nodo: idNodo 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade una evidencia a una unidad de nodo
export const addEvicenciaMeta = async (codigo: string, evidencia: EvidenciaInterface) => {
    try {
        const response = await api.post("/nodo/evidencia", { 
            codigo:    codigo,
            evidencia: evidencia
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los porcentajes de avance de un año de una unidad de nodo
export const getProgresoAño = async (ids_nodos: string[], año: number) => {
    try {
        const response = await api.get(`/nodo/progreso`, {
            params: {
                ids: ids_nodos,
                año: año
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene la informacion de todos los nodos y el progreso de las metas
export const getProgresoTotal = async (id_plan: number) => {
    try {
        const response = await api.get(`/nodo/progresoTotal`, {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Actualizar una unidad de nodo
export const updateNodo = async (idPDT: string, idNodo: string, nodo: UnidadInterface, años: AñoInterface) => {
    try {
        const response = await api.put("/nodo", { 
            id_plan: idPDT,
            id_nodo: idNodo,
            nodo:    nodo,
            años:    años
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Actualizar evidencia de una unidad de nodo
export const updateEvidencia = async (codigo: string, evidencia: EvidenciaInterface) => {
    try {
        const response = await api.put("/nodo/evidencia", { 
            codigo:     codigo,
            evidencia:  evidencia
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Borrar evidencia de una unidad de nodo
export const deleteEvidencia = async (id_evidencia: number) => {
    try {
        const response = await api.delete("/nodo/evidencia", {
            params: {
                id_evidencia: id_evidencia
            },
            headers: { authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade los valores de los porcentajes de cada rango de color
export const addColor = async (id_plan: number, colors: number[]) => {
    try {
        const response = await api.post(`/pdt/color`, {
            id_plan:     id_plan,
            porcentajes: colors
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los valores de los porcentajes de cada rango de color
export const getColors = async (id_plan: number) => {
    try {
        const response = await api.get(`/pdt/color`, {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Actualiza los valores de los porcentajes de cada rango de color
export const updateColor = async (id_plan: number, colors: number[]) => {
    try {
        const response = await api.put(`/pdt/color`, {
            id_plan:     id_plan,
            porcentajes: colors
        },
        { headers: { authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}