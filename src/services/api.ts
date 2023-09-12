import axios from "axios";

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
        const response = await axios.post("/anadirPDT", {
            nombre: pdt.nombrePlan,
            alcaldia: pdt.alcaldia,
            municipio: pdt.municipio,
            fechaIni: pdt.fechaIni,
            fechaFin: pdt.fechaFin,
        });
        return response.data;
    } catch (error) {
        return error;
    }
};