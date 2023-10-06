import axios from "axios";
import { AñoFormState, UnidFormState, Nodo } from "../interfaces";

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

// Obtiene el ultimo PDT
export const getLastPDT = async () => {
    try {
        const response = await axios.get("/pdt/last");
        return response.data;
    } catch (error) {
        return error;
    }
}

// Hace login con el usuario y contraseña
export const doLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('/users/login', {
            user:     username,
            password: password
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Crea un usuario funcionario para un PDT especifico
export const doRegister = async (id: number, userData: any) => {
    try {
        const response = await axios.post('/users/register', {
            id:       id,
            usuario:  userData.usuario,
            apellido: userData.apellido,
            clave:    userData.contraseña,
            correo:   userData.correo,
            rol:      userData.rol,
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
            Nombre:       pdt.nombrePlan,
            Alcaldia:     pdt.alcaldia,
            Municipio:    pdt.municipio,
            Fecha_inicio: pdt.fechaIni,
            Fecha_fin:    pdt.fechaFin,
            Descripcion:  pdt.descripcion,
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
export const addNodoUnidadYAños = async (idPDT: string, idNodo: string, nodoUnidad: UnidFormState, años: AñoFormState) => {
    try {
        const response = await axios.post("/nodo", { 
            idPDT:  idPDT,
            idNodo: idNodo,
            Nodo:   nodoUnidad,
            Años:   años
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
            params: { 
                idPDT:  idPDT, 
                idNodo: idNodo 
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Añade una evidencia a una unidad de nodo
export const addEvicenciaMeta = async (codigo: string, evidencia: any) => {
    try {
        const response = await axios.post("/nodo/evidencia", { 
            Codigo:    codigo,
            Evidencia: evidencia
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los porcentajes de avance de un año de una unidad de nodo
export const getProgresoAño = async (ids_nodos: string[], año: number) => {
    try {
        const response = await axios.get(`/nodo/progreso`, {
            params: {
                Ids: ids_nodos,
                Año: año
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
        const response = await axios.get(`/nodo/progresoTotal`, {
            params: {
                Id: id_plan
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
        const response = await axios.post(`/pdt/color`, {
            Id:     id_plan,
            Colors: colors
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

// Obtiene los valores de los porcentajes de cada rango de color
export const getColors = async (id_plan: number) => {
    try {
        const response = await axios.get(`/pdt/color`, {
            params: {
                Id: id_plan
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}
