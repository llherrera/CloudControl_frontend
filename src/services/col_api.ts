import axios from "axios";

export const getDepartmentsGeoportal = async () => {
    try {
        const response = await axios.get("/geoportal-deparments");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getMunicipalities = async (id: string) => {
    if (id === '') return null;
    try {
        const response = await axios.get(`/geoportal-municipality`, {
            params: {
                codigo_departamento: id
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getCityInfo = async (id: string) => {
    try {
        const response = await axios.get(`/geoportal-ficha`, {
            params: {
                divipola_cod: id
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}