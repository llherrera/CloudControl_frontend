import axios from "axios";

export const getPDTs = async () => {
    try {
        const response = await axios.get("/pdt");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getPDTid = async (id: string) => {
    try {
        const response = await axios.get(`/pdt/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

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

export const addNivel = async (nivel: any [], id : string) => {
    try {
        nivel.forEach(async (element) => {
            const response = await axios.post(`/pdt/${id}`, {
                Nombre: element.nombre,
                Descripcion: element.descripcion,
            });
            return response.data;
        });

/*        const response = await axios.post("/nivel", {
            Nombre: nivel.nombre,
            Descripcion: nivel.descripcion,
            id_plan: nivel.pdt,
        });
        return response.data;*/
    } catch (error) {
        return error;
    }
}