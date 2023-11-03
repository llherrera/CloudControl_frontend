import axios from "axios";
import { AñoInterface, UnidadInterface, NodoInterface, 
    NivelInterface, RegisterInterface, PDTInterface, EvidenciaInterface } from "../interfaces";
import { useAppSelector } from '../store';
import { getToken, refreshToken } from "@/utils";
import jwtDecode from "jwt-decode";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

//const gettoken = getToken();
//let token: string;
//if (gettoken) {
//    token = gettoken.token;
//}

api.interceptors.request.use(
    async request => {
        try {
            const {token} = getToken();
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
        } catch (error) {
            console.log(error);
        }
    return request;
    }, error => {
        console.log(error);
        
        return Promise.reject(error);
    }
);

// Obtiene todos los PDTs
export const getPDTs = async () => {
    try {
        const response = await api.get("/plan-territorial");
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene información de un PDT
export const getPDTid = async (id: string) => {
    try {
        const response = await api.get(`/plan-territorial/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los niveles de un PDT 
export const getPDTLevelsById = async (id: string) => {
    try {
        const response = await api.get(`/plan-territorial/${id}/nivel`);
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene el ultimo PDT
export const getLastPDT = async () => {
    try {
        const response = await api.get("/plan-territorial/ultimo");
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
        const response = await api.post('/usuarios/inicio', {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Hacer logout
export const doLogout = async () => {
    try {
        const response = await api.post('/usuarios/cerrar');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const doRefreshToken = async () => {
    try {
        const response = await api.post('/usuarios/refresh');
        return response.data;
    } catch (error) {
        return error;
    }
}

// Crea un usuario funcionario para un PDT especifico
export const doRegister = async (id: number, userData: RegisterInterface) => {
    try {
        const response = await api.post('/usuarios/registrar', {
            id_plan:  id,
            username: userData.usuario,
            lastname: userData.apellido,
            password: userData.contraseña,
            email:    userData.correo,
            rol:      userData.rol,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Cambiar permisos de un usuario
export const changePermissions = async (id: number, rol: string) => {
    try {
        const response = await api.put('/usuarios/actualizar', {
            id_user: id,
            rol:     rol
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade un nuevo PDT
export const addPDT = async (pdt: PDTInterface) => {
    try {
        const response = await api.post("/plan-territorial", {
            PlanName:     pdt.Nombre,
            TownHall:     pdt.Alcaldia,
            Municipality: pdt.Municipio,
            StartDate:    pdt.Fecha_inicio.slice(0, 19).replace('T', ' '),
            EndDate:      pdt.Fecha_fin.slice(0, 19).replace('T', ' '),
            Description:  pdt.Descripcion,
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Actualiza un PDT
export const updatePDT = async (id: number, pdt: PDTInterface) => {
    try {
        const response = await api.put(`/plan-territorial/${id}`, {
            PlanName:     pdt.Nombre,
            TownHall:     pdt.Alcaldia,
            Municipality: pdt.Municipio,
            StartDate:    pdt.Fecha_inicio,
            EndDate:      pdt.Fecha_fin,
            Description:  pdt.Descripcion,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Borrar un PDT
export const deletePDT = async (id: number) => {
    try {
        const response = await api.delete(`/plan-territorial/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade todos los niveles a un PDT
export const addNivel = async (nivel: NivelInterface[], id : string) => {
    try {
        const response = await api.post(`/plan-territorial/${id}`, { levels: nivel });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene todos los nodos de un nivel de un PDT
export const getNodosNivel = async (id: number, Padre: (string | null)) => {
    try {
        const response = await api.get(`/plan-territorial/nivel`, { 
            params: { 
                id_level: id, 
                Parent:   Padre 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade todos los nodos a un nivel de un PDT
export const addNodoNivel = async (nodes: NodoInterface[], parent: (string|null), id_level: number) => {
    try {
        const response = await api.post("/plan-territorial/nivel", { 
            nodes: nodes,
            parent: parent,
            id_level: id_level
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Borrar un nivel de un PDT
export const deleteNivel = async (id: number) => {
    try {
        const response = await api.delete(`/plan-territorial/nivel`, {
            params: {
                id_level: id
            }
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
                id_nodes: ids 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade una unidad de nodo donde se registre la programacion financiera por años
export const addNodoUnidadYAños = async (idPDT: string, idNodo: string, nodoUnidad: UnidadInterface, años: AñoInterface[]) => {
    try {
        const response = await api.post("/nodo", { 
            id_plan: idPDT,
            id_node: idNodo,
            node:    nodoUnidad,
            years:   años
        });
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
                id_node: idNodo 
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
            code:     codigo,
            evidence: evidencia
        });
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
                ids:  ids_nodos,
                year: año
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
        const response = await api.get(`/nodo/progreso-total`, {
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
            id_node: idNodo,
            node:    nodo,
            years:   años
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Actualizar evidencia de una unidad de nodo
export const updateEvidencia = async (codigo: string, evidencia: EvidenciaInterface) => {
    try {
        const response = await api.put("/nodo/evidencia", { 
            code:      codigo,
            evidence:  evidencia
        });
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
                id_evidence: id_evidencia
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade los valores de los porcentajes de cada rango de color
export const addColor = async (id_plan: number, colors: number[]) => {
    try {
        const response = await api.post(`/plan-territorial/color`, {
            id_plan:     id_plan,
            percentages: colors
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los valores de los porcentajes de cada rango de color
export const getColors = async (id_plan: number) => {
    try {
        const response = await api.get(`/plan-territorial/color`, {
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
        const response = await api.put(`/plan-territorial/color`, {
            id_plan:     id_plan,
            percentages: colors
        });
        return response.data;
    } catch (error) {
        return error;
    }
}