import { getColombiaApi, getGeoportalApi } from "@/utils";
import axios from "axios";
const {BASE_URL} = getColombiaApi();
const {GEOPORTAL_BASE_URL} = getGeoportalApi();

const col_api = axios.create({
    baseURL: BASE_URL
})

const geoportal_api = axios.create({
    baseURL: GEOPORTAL_BASE_URL
})

const proxy = "https://cors-anywhere.herokuapp.com/";

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

export const getDepartmentsGeoportal = async () => {
    try {
        //https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/departamentos.php
        const response = await axios.get(`
            ${proxy}https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/departamentos.php
        `);
        //const response = await geoportal_api.get("/gdivipola/servicios/departamentos.php", {
        //    proxy: {
        //        host: proxy,
        //        port: 443
        //    }
        //});
        return response.data
    } catch (error) {
        return error;
    }
}

export const getMunicipalities = async (id: string) => {
    if (id === '') return null;
    try {
        //https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/municipios.php?codigo_departamento=[codigo_dept]
        const response = await axios.get(`
            ${proxy}https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/municipios.php?codigo_departamento=${id}
        `);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getCityInfo = async (id: string) => {
    try {
        //https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/ficha.php?divipola_cod=[codigo_dept]
        const response = await axios.get(`
            ${proxy}https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/ficha.php?divipola_cod=${id}
        `);
        return response.data;
    } catch (error) {
        return error;
    }
}