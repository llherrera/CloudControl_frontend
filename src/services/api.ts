import axios from "axios";
import jwtDecode from "jwt-decode";
import { getEnvironment } from '../utils/environment';
import { arrayToMapNodesSecre } from '../utils/functions';

import {
    YearInterface,
    UnitInterface,
    NodeInterface,
    LevelInterface,
    RegisterInterface,
    PDTInterface,
    EvidenceInterface,
    GetNodeProps,
    Secretary,
    LoginProps,
    Coordinates,
    ExcelFinancial,
    ExcelPlan,
    ExcelPhysical,
    ExcelUnitNode,
    LocationInterface,
    Project } from "../interfaces";

import { getToken, refreshToken } from "@/utils";

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

export const getPDTs = async () => {
    const response = await api.get("/plan-territorial");
    return response.data;
}

export const getPDTid = async (id: number) => {
    const response = await api.get(`/plan-territorial/${id}`);
    return response.data;
}

export const getPDTByDept = async (dept: string, muni: string) => {
    const response = await api.get(`/plan-territorial`, { 
        params: {
            department:   dept,
            municipality: muni
        }
    });
    return response.data;
}

export const getPDTLevelsById = async (id: number) => {
    const response = await api.get(`/plan-territorial/${id}/nivel`);
    return response.data;
}

export const getLastPDT = async () => {
    const response = await api.get("/plan-territorial/ultimo");
    return response.data[0];
}

export const doLogin = async (data:LoginProps) => {
    const { username, password } = data;
    const response = await api.post('/usuarios/inicio', {
        username: username,
        password: password
    });
    return response.data;
}

export const doLogout = async () => {
    const response = await api.post('/usuarios/cerrar');
    return response.data;
}

export const doRefreshToken = async () => {
    const response = await api.post('/usuarios/refrescar');
    return response.data;
}

export const doRegister = async (id: number, user_data: RegisterInterface) => {
    const response = await api.post('/usuarios/registrar', {
        id_plan:  id,
        username: user_data.username,
        lastname: user_data.lastname,
        password: user_data.password,
        email:    user_data.email,
        rol:      user_data.rol,
    });
    return response.data;
}

export const changePermissions = async (id: number, rol: string) => {
    const response = await api.put('/usuarios/actualizar', {
        id_user: id,
        rol:     rol
    });
    return response.data;
}

export const addPDT = async (pdt: PDTInterface) => {
    const response = await api.post("/plan-territorial", {
        PlanName:           pdt.name,
        TownHall:           pdt.department,
        Municipality:       pdt.municipality,
        id_municipality:    pdt.id_municipality,
        StartDate:          pdt.start_date,
        EndDate:            pdt.end_date.slice(0, 19).replace('T', ' '),
        Description:        pdt.description,
    });
    return response.data;
}

export const updatePDT = async (id: number, pdt: PDTInterface) => {
    const response = await api.put(`/plan-territorial/${id}`, {
        PlanName:     pdt.name,
        TownHall:     pdt.department,
        Municipality: pdt.municipality,
        StartDate:    pdt.start_date,
        EndDate:      pdt.end_date,
        Description:  pdt.description,
    });
    return response.data;
}

export const uploadLogoCity = async ( id: number, logo: File ) => {
    const response = await api.put("/plan-territorial/logo", 
    {
        city:    true,
        id_plan: id,
        photos:  logo,
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const uploadLogoPlan = async ( id: number, logo: File ) => {
    const response = await api.put("/plan-territorial/logo", 
    {
        city:    false,
        id_plan: id,
        photos:  logo,
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const deletePDT = async (id: number) => {
    const response = await api.delete(`/plan-territorial/${id}`);
    return response.data;
}

export const addLevel = async (levels: LevelInterface[], id : string) => {
    const response = await api.post(`/plan-territorial/${id}`, { levels: levels });
    return response.data;
}

export const getLevelNodes = async (props: GetNodeProps) => {
    const response = await api.get(`/plan-territorial/nivel`, { 
        params: {
            id_level: props.id_level,
            Parent:   props.parent
        }
    });
    return response.data;
}

export const updateWeights = async (ids: string[], weights: number[]) => {
    const response = await api.put("/plan-territorial/nivel", 
        {   
            ids: ids,
            weights: weights,
        }
    );
    return response.data;
}

export const addLevelNode = async (nodes: NodeInterface[], id_level: number) => {
    const response = await api.post("/plan-territorial/nivel", { 
        nodes: nodes,
        id_level: id_level
    });
    return response.data;
}

export const addNodes =async (data: ExcelPlan[], id_plan: number, levelsName: string[]) => {
    const response = await api.post("/plan-territorial/nivel", {
        data:       data,
        id_plan:    id_plan,
        levelsName: levelsName
    });
    return response.data;
}

export const deleteLevel = async (id: number) => {
    const response = await api.delete(`/plan-territorial/nivel`, {
        params: {
            id_level: id
        }
    });
    return response.data;
}

export const getLevelName = async (ids: string[]) => {
    const response = await api.get(`/nodo/nombres`, {
        params: { 
            id_nodes: ids 
        }
    });
    return response.data;
}

export const addUnitNodeAndYears = async (
    id_plan: string, id_node: string, node_unit: UnitInterface, 
    years: YearInterface[], id_municipality: number) => {
    const response = await api.post("/nodo", { 
        id_plan:         id_plan,
        id_node:         id_node,
        node:            node_unit,
        years:           years,
        id_municipality: id_municipality
    });
    return response.data;
}

export const addUnits = async (
    id_plan: number, data: ExcelPlan[], years: number[],
    id_municipality: string) => {
    const response = await api.post("/nodo", {
        id_plan:         id_plan,
        data:            data,
        years:           years,
        id_municipality: id_municipality
    });
    return response.data;
}

export const getUnitNodeAndYears = async (id_plan: string, id_node: string) => {
    const response = await api.get(`/nodo`, {
        params: { 
            id_plan: id_plan,
            id_node: id_node
        }
    });
    return response.data;
}

export const updateUnitNodeAndYears = async (id_plan: string, id_node: string, node_unit: UnitInterface, years: YearInterface[]) => {
    const response = await api.put("/nodo", { 
        id_plan: id_plan,
        id_node: id_node,
        node:    node_unit,
        years:   years
    });
    return response.data;
}

export const updateFinancial = async (id_plan: number, id_municipality: number, data: ExcelFinancial[], years: number[]) => {
    const response = await api.put("/nodo/financiero", { 
        id_plan:         id_plan,
        id_municipality: id_municipality,
        data:            data,
        years:           years
    });
    return response.data;
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

export const updateEvicenceGoal = async (id_evidence: number, evidence: EvidenceInterface, file: File, points: Coordinates[]) => {
    const response = await api.put("/nodo/evidencia", 
    {
        id_evidence: id_evidence,
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
    const response = await api.get(`/nodo/evidencia-ubicacion`, {
        params: {
            id_plan,
            id_evidence
        }
    });
    return response.data;
}

export const getCodeEvidences = async (id_node: string, id_plan: number) => {
    const response = await api.get(`/nodo/evidencia-codigo`, {
        params: {
            id_node: id_node,
            id_plan: id_plan
        }
    });
    return response.data;
}

export const getLatLngs = async (id_node: string, secretary: string, location: string) => {
    const response = await api.get(`/nodo/ubicaciones`, {
        params: {
            id_node,
            secretary,
            location
        }
    });
    return response.data;
}

export const getEvidence = async (id_plan: number, code: string) => {
    const response = await api.get("/nodo/evidencia", {
        params: {
            id_plan: id_plan,
            code: code
        }
    });
    return response.data;
}

export const getEvidences = async (id_plan: number, page: number) => {
    const response = await api.get("/nodo/evidencias", {
        params: {
            id_plan: id_plan,
            page: page
        }
    });
    return response.data;
}

export const getExecutionsToApro = async (id_plan: number, page: number) => {
    const response = await api.get("/nodo/ejecucion", {
        params: {
            id_plan: id_plan,
            page: page
        }
    });
    return response.data;
}

export const getEvidenceCount = async (id_plan: number) => {
    const response = await api.get("/nodo/evidencia-contar", {
        params: {
            id_plan: id_plan
        }
    });
    return response.data;
}

export const getYearProgress = async (ids_nodes: string[], year: number) => {
    const response = await api.get(`/nodo/progreso`, {
        params: {
            ids:  ids_nodes,
            year: year
        }
    });
    return response.data;
}

export const getTotalProgress = async (id_plan: number) => {
    const response = await api.get(`/nodo/progreso-total`, {
        params: {
            id_plan: id_plan
        }
    });        
    return response.data;
}

export const updateNode = async (id_plan: string, id_node: string, node: UnitInterface, years: YearInterface) => {
    const response = await api.put("/nodo", { 
        id_plan: id_plan,
        id_node: id_node,
        node:    node,
        years:   years
    });
    return response.data;
}

export const deleteEvidence = async (id_evidence: number) => {
    const response = await api.delete("/nodo/evidencia", {
        params: {
            id_evidence: id_evidence
        }
    });
    return response.data;
}

export const addColor = async (id_plan: number, colors: number[]) => {
    const response = await api.post(`/plan-territorial/color`, {
        id_plan:     id_plan,
        percentages: colors
    });
    return response.data;
}

export const getColors = async (id_plan: number) => {
    const response = await api.get(`/plan-territorial/color`, {
        params: {
            id_plan: id_plan
        }
    });
    return response.data;
}

export const updateColor = async (id_plan: number, colors: number[]) => {
    const response = await api.put(`/plan-territorial/color`, {
        id_plan:     id_plan,
        percentages: colors
    });
    return response.data;
}

export const approveEvidence = async (id_evidence: number, approve: number, code: string, value: number, file_date: string, reason?: string) => {
    const response = await api.put(`/nodo/evidencia`, {
        id_evidence: id_evidence,
        approve:     approve,
        code:        code,
        value:       value,
        file_date:   file_date,
        reason:      reason
    });
    return response.data;
}

export const getUserEvidences = async (page: number, id_plan: number) => {
    const response = await api.get(`/nodo/evidencia-usuario`, {
        params: {
            page: page,
            id_plan: id_plan
        }
    });
    return response.data;
}

export const addSecretaries = async (id_plan: number, secretaries: Secretary[], valid?: boolean) => {
    const response = await api.post(`/plan-territorial/secretarias`, {
        id_plan:     id_plan,
        secretaries: secretaries,
        valid
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

export const addLocations = async (id_plan: number, locations: LocationInterface[], location: LocationInterface) => {
    const response = await api.post(`/plan-territorial/localidades`, {
        id_plan,
        locations,
        location
    });
    return response.data;
}

export const getLocations = async (id_plan: number) => {
    const response = await api.get(`/plan-territorial/${id_plan}/localidades`);
    return response.data;
}

export const updateLocations = async (id_plan: number, locations: LocationInterface[], location: LocationInterface) => {
    const response = await api.put(`/plan-territorial/localidades`, {
        id_plan,
        locations,
        location
    });
    return response.data;
}

export const loadFinancialExcel =async () => {
    const response = await api.put('/plan-territorial/');
    return response;
}

export const loadExcel = async (id_plan: number, data: ExcelPlan[], years: number[], id_municipality: string) => {
    const response = await api.post('/plan-territorial/excel', {
        id_plan:         id_plan,
        data:            data,
        years:           years,
        id_municipality: id_municipality
    });
    return response.data;
}

export const updatePhysicalExcel = async (id_plan: number, id_municipality: number, data: ExcelPhysical[], years: number[]) => {
    const response = await api.put('/nodo/fisico', {
        id_plan:         id_plan,
        id_municipality: id_municipality,
        data:            data,
        years:           years,
    });
    return response.data;
}

export const updateUniNodeExcel = async (id_plan: number, id_municipality: number, data: ExcelUnitNode[], years: number[]) => {
    const response = await api.put('/nodo/unitAll', {
        id_plan:         id_plan,
        id_municipality: id_municipality,
        data:            data,
        years:           years,
    });
    return response.data;
}

export const updateIndicator = async (id_node: string, file: File) => {
    const response = await api.put('/nodo/indicador', {
        id_node: id_node,
        file: file
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const updateDeadline = async (id_plan: number, date: string) => {
    const response = await api.put('/plan-territorial/deadline', {
        id_plan: id_plan,
        deadline_date: date
    });
    return response.data;
}

export const updateExecution = async (date: Date, value: number, code: string, user_id: number, plan_id: number, reason?: string) => {
    let dateForm = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    const response = await api.put('/nodo/ejecucion', {
        date: dateForm,
        value,
        code,
        user_id,
        plan_id,
        reason
    });
    return response.data;
}

export const getNodesSecretary = async (id_plan: number, secretary: string) => {
    const response = await api.get('plan-territorial/nodos-secre', {
        params: {
            id_plan,
            secretary
        }
    });
    const res = arrayToMapNodesSecre(response.data)
    return res;
}

export const getDataDashboardSecretary = async (id_plan: number, secretary: string, year: string) => {
    const response = await api.get('plan-territorial/dash-secre', {
        params: {
            id_plan,
            secretary,
            year
        }
    });
    return response.data;
}

export const getDataDashboardLocation = async (id_plan: number, location: string, year: string) => {
    const response = await api.get('plan-territorial/dash-locat', {
        params: {
            id_plan,
            location,
            year
        }
    });
    return response.data;
}

export const getDataDashboardEvidence = async (id_plan: number, neighborhood: string, location: string, year: string) => {
    const response = await api.get('plan-territorial/dash-evide', {
        params: {
            id_plan,
            neighborhood,
            location,
            year
        }
    });
    return response.data;
}

export const getProjectsByPlan = async (id_plan: number, page: number, year: number) => {
    const response = await api.get(`/plan-territorial/proyectos`, {
        params: {
            id_plan,
            page,
            year
        }
    });
    return response.data;
}

export const getCountProjectsByPlan = async (id_plan: number, year?: number) => {
    const response = await api.get(`/plan-territorial/proye-count`, {
        params: {
            id_plan,
            year
        }
    });
    return response.data;
}

export const addProjectsAtPlan = async (id_plan: number, project: Project, file: File) => {
    const response = await api.post("/plan-territorial/proyectos", 
        {
            id_plan: id_plan,
            project: project,
            file: file
        },{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
}

export const updateProjectById = async (id_project: number, project: Project) => {
    const response = await api.put("/plan-territorial/proyectos", 
        {
            id_project: id_project,
            project: project
        }
    );
    return response.data;
}

export const getPlanByUuid = async (uuid: string) => {
    const response = await api.get(`/plan-territorial/plan`, {
        params: {
            uuid
        }
    });
    return response.data;
}

export const getNodesProject = async (id_project: number) => {
    const response = await api.get(`/plan-territorial/proy-node`, {
        params: {
            id_project
        }
    });
    return response.data;
}

export const doProjectToNodes = async (id_plan: number, id_project: number, nodes: NodeInterface[]) => {
    const response = await api.post(`/plan-territorial/proy-node`, {
        id_plan,
        id_project,
        nodes
    });
    return response.data;
}


export default api;