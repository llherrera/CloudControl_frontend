import axios from "axios";
import jwtDecode from "jwt-decode";
import { getEnvironment } from '../utils/environment';

import { 
    YearInterface, 
    UnitInterface, 
    NodoInterface, 
    NivelInterface, 
    RegisterInterface, 
    PDTInterface, 
    EvidenceInterface, 
    GetNodeProps, 
    AddColorsProps, 
    Secretary, 
    LoginProps, 
    Coordinates } from "../interfaces";

import { getToken } from "@/utils";

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
                //    const newToken = await refreshToken();
                //if (newToken)
                //// @ts-expect-error request.headers
                //    request.headers = {
                //        ...request.headers,
                //        Authorization: `Bearer ${newToken}`
                //    }
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
        const response = await api.post('/usuarios/refrescar');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const doRegister = async (id: number, user_data: RegisterInterface) => {
    try {
        const response = await api.post('/usuarios/registrar', {
            id_plan:  id,
            username: user_data.username,
            lastname: user_data.lastname,
            password: user_data.password,
            email:    user_data.email,
            rol:      user_data.rol,
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
            PlanName:     pdt.name,
            TownHall:     pdt.department,
            Municipality: pdt.municipaly,
            StartDate:    pdt.start_date.slice(0, 19).replace('T', ' '),
            EndDate:      pdt.end_date.slice(0, 19).replace('T', ' '),
            Description:  pdt.description,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const updatePDT = async (id: number, pdt: PDTInterface) => {
    try {
        const response = await api.put(`/plan-territorial/${id}`, {
            PlanName:     pdt.name,
            TownHall:     pdt.department,
            Municipality: pdt.municipaly,
            StartDate:    pdt.start_date,
            EndDate:      pdt.end_date,
            Description:  pdt.description,
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

export const addLevel = async (levels: NivelInterface[], id : string) => {
    const response = await api.post(`/plan-territorial/${id}`, { levels: levels });
    return response.data;
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

export const addLevelNode = async (nodes: NodoInterface[], id_level: number) => {
    try {
        const response = await api.post("/plan-territorial/nivel", { 
            nodes: nodes,
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

export const addUnitNodeAndYears = async (id_plan: string, id_node: string, node_unidad: UnitInterface, years: YearInterface[], id_city: number) => {
    const response = await api.post("/nodo", { 
        id_plan: id_plan,
        id_node: id_node,
        node:    node_unidad,
        years:   years,
        id_city: id_city
    });
    return response.data;
}

export const getUnitNodeAndYears = async (id_plan: string, id_node: string) => {
    try {
        const response = await api.get(`/nodo`, {
            params: { 
                id_plan: id_plan,
                id_node: id_node
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const addEvicenceGoal = async (id_plan: number, code: string, evidence: EvidenceInterface, file: File, points: Coordinates[]) => {
    const response = await api.post("/nodo/evidencia", 
    {
        id_plan: id_plan,
        code: code,
        evidence: evidence,
        file: file,
        points: points
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const updateEvicenceGoal = async (evidence: EvidenceInterface, file: File, points: Coordinates[]) => {
    const response = await api.put("/nodo/evidencia", 
    {
        evidence: evidence,
        file: file,
        points: points
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const getUbiEvidences = async (id_plan?: number, id_evidence?: number) => {
    if (id_plan == undefined && id_evidence == undefined)
        return alert("Error: falta el parametro id_plan o id_evidence");
    try {
        const response = await api.get(`/nodo/evidencia-ubicacion`, {
            params: {
                id_plan,
                id_evidence
            }
        });
        return response.data;
    } catch (error) {
        return error;   
    }
}

export const getCodeEvidences = async (id_node: string, id_plan: number) => {
    try {
        const response = await api.get(`/nodo/evidencia-codigo`, {
            params: {
                id_node: id_node,
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getEvidence = async (id_plan: number, code: string) => {
    try {
        const response = await api.get("/nodo/evidencia", {
            params: {
                id_plan: id_plan,
                code: code
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
        const response = await api.get("/nodo/evidencia-contar", {
            params: {
                id_plan: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getYearProgress = async (ids_nodes: string[], year: number) => {
    try {
        const response = await api.get(`/nodo/progreso`, {
            params: {
                ids:  ids_nodes,
                year: year
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

export const updateNode = async (id_plan: string, id_node: string, node: UnitInterface, years: YearInterface) => {
    try {
        const response = await api.put("/nodo", { 
            id_plan: id_plan,
            id_node: id_node,
            node:    node,
            years:   years
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const updateEvidence = async (code: string, evidence: EvidenceInterface) => {
    try {
        const response = await api.put("/nodo/evidencia", { 
            code:      code,
            evidence:  evidence
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const deleteEvidence = async (id_evidence: number) => {
    try {
        const response = await api.delete("/nodo/evidencia", {
            params: {
                id_evidence: id_evidence
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

export const approveEvidence = async (id_evidence: number, approve: number, code: string, value: number, file_date: string, reason?: string) => {
    try {
        const response = await api.put(`/nodo/evidencia`, {
            id_evidence: id_evidence,
            approve:     approve,
            code:        code,
            value:       value,
            file_date:   file_date,
            reason:      reason
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getUserEvidences = async (page: number) => {
    const response = await api.get(`/nodo/evidencia-usuario`, {
        params: {
            page: page
        }
    });
    return response.data;
}

export const addSecretaries = async (id_plan: number, secretaries: Secretary[]) => {
    const response = await api.post(`/plan-territorial/secretarias`, {
        id_plan:     id_plan,
        secretaries: secretaries
    });
    return response.data;
}

export const updateSecretaries = async (id_plan: number, secretaries: Secretary[]) => {
    const response = await api.put(`/plan-territorial/secretarias`, {
        id_plan:     id_plan,
        secretaries: secretaries
    });
    return response.data;
}

export const getSecretaries = async (id_plan: number) => {
    const response = await api.get(`/plan-territorial/secretarias`, {
        params: {
            id_plan: id_plan
        }
    });
    return response.data;
}

export const addLocations = async (id_plan: number, locations: any) => {
    const response = await api.post(`/plan-territorial/localidades`, {
        id_plan,
        locations
    });
    return response.data;
}

export const getLocations = async (id_plan: number) => {
    const response = await api.get(`/plan-territorial/${id_plan}/localidades`);
    return response.data;
}
