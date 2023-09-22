import axios from "axios";
import { AñoFormState, UnidFormState } from "../interfaces";

// Obtiene todos los PDTs
export const getPDTs = async () => {
    try {
        const response = await axios.get("/pdt");
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los niveles de un PDT 
export const getPDTid = async (id: string) => {
    try {
        const response = await axios.get(`/pdt/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

// Hace login con el usuario y contraseña
export const doLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('/users/login', {
            user: username,
            password: password
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade un nuevo PDT
export const addPDT = async (pdt: any) => {
    try {
        const response = await axios.post("/pdt", {
            Nombre: pdt.nombrePlan,
            Alcaldia: pdt.alcaldia,
            Municipio: pdt.municipio,
            Fecha_inicio: pdt.fechaIni,
            Fecha_fin: pdt.fechaFin,
            Descripcion: pdt.descripcion,
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Añade todos los niveles a un PDT
export const addNivel = async (nivel: {}[], id : string) => {
    try {
        const response = await axios.post(`/pdt/${id}`, { Niveles: nivel } );
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene todos los nodos de un nivel de un PDT
export const getNodosNivel = async (id: number, Padre? : string) => {
    try {
        const response = await axios.get(`/pdt/nivel`, { 
            params: { id_nivel: id, Padre: Padre }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade todos los nodos a un nivel de un PDT
export const addNodoNivel = async (nodo: {}[]) => {
    try {
        const response = await axios.post("/pdt/nivel", { Nodos: nodo } );
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los nombres de cada nivel que tienen los nodos
export const getNombreNivel = async (ids: string[]) => {
    try {
        const response = await axios.get(`/nodo/nombres`, {
            params: { id_nodos: ids }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade una unidad de nodo donde se registre la programacion financiera por años
export const addNodoUnidadYAños = async (idPDT: string, idNodo: string, nodoUnidad: UnidFormState, años: AñoFormState) => {
    try {
        const response = await axios.post("/nodo", { 
            idPDT: idPDT,
            idNodo: idNodo,
            Nodo: nodoUnidad,
            Años: años
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene una unidad de nodo donde se registre la programacion financiera por años
export const getNodoUnidadYAños = async (idPDT: string, idNodo: string) => {
    try {
        const response = await axios.get(`/nodo`, {
            params: { idPDT: idPDT, idNodo: idNodo }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// 
export const addEvicenciaMeta = async (codigo: string, evidencia: any) => {
    try {
        const response = await axios.post("/nodo/evidencia", { 
            Codigo: codigo,
            Evidencia: evidencia
        });
        return response.data;
    } catch (error) {
        return error;
    }
}