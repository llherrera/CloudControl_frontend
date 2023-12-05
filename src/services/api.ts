import axios from "axios";
import jwtDecode from "jwt-decode";
import { getEnvironment } from '../utils/environment';

import { YearInterface, UnitInterface, NodoInterface, 
    NivelInterface, RegisterInterface, PDTInterface, 
    EvidenceInterface, GetNodeProps, AddColorsProps, 
    Secretary, LoginProps } from "../interfaces";

import { getToken, refreshToken } from "@/utils";

const { BASE_URL } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
})

let isRefreshingToken = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processFailedQueue = (error?: unknown) => {
    failedQueue.forEach(promise => {
        if (error) promise.reject(error)
        else promise.resolve()
    })
    failedQueue = []
}

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

export const getDepartment = async () => {
    try {
        const response = await api.get("/departamento");
        return response.data;
    } catch (error) {
        return error;
    }

}

export const getPDTs = async () => {
    try {
        const response = await api.get("/plan-territorial");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getPDTid = async (id: string) => {
    try {
        const response = await api.get(`/plan-territorial/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getPDTLevelsById = async (id: string) => {
    try {
        const response = await api.get(`/plan-territorial/${id}/nivel`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getLastPDT = async () => {
    try {
        const response = await api.get("/plan-territorial/ultimo");
        return response.data[0];
    } catch (error) {
        return error;
    }
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

export const addPDT = async (pdt: PDTInterface) => {
    try {
        const response = await api.post("/plan-territorial", {
            PlanName:     pdt.Nombre,
            TownHall:     pdt.Departamento,
            Municipality: pdt.Municipio,
            StartDate:    pdt.Fecha_inicio.slice(0, 19).replace('T', ' '),
            EndDate:      pdt.Fecha_fin.slice(0, 19).replace('T', ' '),
            Description:  pdt.Descripcion,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const updatePDT = async (id: number, pdt: PDTInterface) => {
    try {
        const response = await api.put(`/plan-territorial/${id}`, {
            PlanName:     pdt.Nombre,
            TownHall:     pdt.Departamento,
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

export const getLogoPlan = async (id: number) => {
    try {
        const response = await api.get(`/plan-territorial/logo`, {
            params: {
                id_plan: id
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const uploadLogoPlan = async ( id: number, logo: File ) => {
    try {
        const response = await api.post("/plan-territorial/logo", 
        {
            id_plan: id,
            file: logo
        },{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const deletePDT = async (id: number) => {
    try {
        const response = await api.delete(`/plan-territorial/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const addLevel = async (nivel: NivelInterface[], id : string) => {
    try {
        const response = await api.post(`/plan-territorial/${id}`, { levels: nivel });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getLevelNodes = async (props: GetNodeProps) => {
    try {
        const response = await api.get(`/plan-territorial/nivel`, { 
            params: {
                id_level: props.id_level,
                Parent:   props.parent
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const addLevelNode = async (nodes: NodoInterface[], parent: (string|null), id_level: number) => {
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

export const deleteLevel = async (id: number) => {
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

export const getLevelName = async (ids: string[]) => {
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

export const addUnitNodeAndYears = async (idPDT: string, idNodo: string, nodoUnidad: UnitInterface, años: YearInterface[]) => {
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

export const getUnitNodeAndYears = async (idPDT: string, idNodo: string) => {
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

export const addEvicenceGoal = async (id_plan: number, codigo: string, evidencia: EvidenceInterface, file: File) => {
    try {
        const response = await api.post("/nodo/evidencia", 
        {
            id_plan: id_plan,
            code: codigo,
            evidence: evidencia,
            file: file
        },{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getEvidence = async (id_plan: number, codigo: string) => {
    try {
        const response = await api.get("/nodo/evidencia", {
            params: {
                id_plan: id_plan,
                code: codigo
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getEvidences = async (id_plan: number, page: number) => {
    try {
        const response = await api.get("/nodo/evidencias", {
            params: {
                id_plan: id_plan,
                page: page
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getEvidenceCount = async (id_plan: number) => {
    try {
        const response = await api.get("/nodo/evidenciascount", {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getYearProgress = async (ids_nodos: string[], año: number) => {
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

export const getTotalProgress = async (id_plan: number) => {
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

export const updateNode = async (idPDT: string, idNodo: string, nodo: UnitInterface, años: YearInterface) => {
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

export const updateEvidence = async (codigo: string, evidencia: EvidenceInterface) => {
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

export const deleteEvidence = async (id_evidencia: number) => {
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

export const addColor = async (props: AddColorsProps) => {
    try {
        const response = await api.post(`/plan-territorial/color`, {
            id_plan:     props.id_plan,
            percentages: props.colors
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getColors = async (id_plan: string) => {
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

export const approveEvidence = async (id_evidence: number, approve: number, code: string) => {
    try {
        const response = await api.put(`/nodo/evidencia`, {
            id_evidence: id_evidence,
            approve:     approve,
            code:        code
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const addSecretaries = async (id_plan: number, secretaries: Secretary[]) => {
    try {
        const response = await api.post(`/plan-territorial/secretarias`, {
            id_plan:     id_plan,
            secretaries: secretaries
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getSecretaries = async (id_plan: number) => {
    try {
        const response = await api.get(`/plan-territorial/secretarias`, {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const addLocations = async (id_plan: number, locations: any) => {
    try {
        const response = await api.post(`/plan-territorial/localidades`, {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}
