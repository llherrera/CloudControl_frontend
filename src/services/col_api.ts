import { getColombiaApi } from "@/utils";
import axios from "axios";
const {BASE_URL} = getColombiaApi();

const col_api = axios.create({
    baseURL: BASE_URL
})

export const getDepartments = async () => {
    try {
        const response = await col_api.get("/Department");
        return response.data.map((e: any) => ({
            id: e.id,
            name: e.name,
        }));
    } catch (error) {
        return error;
    }
}

export const getDepartmentCities = async (id: number) => {
    if (id < 0) return null;
    try {
        const response = await col_api.get(`/Department/${id}/cities`);
        return response.data.map((e: any) => ({
            id: e.id,
            name: e.name,
        }));
    } catch (error) {
        return error;
    }
}

export const getCityId = async (name: string) => {
    try {
        const response = await col_api.get(`/City/name/${name}`);
        return response.data[0].id;
    } catch (error) {
        return error;
    }
}