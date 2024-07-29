import axios from "axios";
import { getEnvironment } from '@/utils';

const { BASE_URL } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
})

export const getDepartmentsGeoportal = async () => {
    const response = await api.get("/servicios/geoportal-dep");
    return response.data;
}

export const getMunicipalities = async (id: string) => {
    if (id === '') return null;
    const response = await api.get("/servicios/geoportal-mun", {
        params: {
            id
        }
    });
    return response.data;
}

/*
- url poligonos del atlantico (departamento): https://geoserver.dane.gov.co/geoserver/geoportal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoportal%3Amgn2022_dpto&outputFormat=text/javascript&filter=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Edpto_ccdgo%3C/PropertyName%3E%3CLiteral%3E08%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E&format_options=parseResponse&_=1709081630224

- url poligonos de barranquilla (municipio): https://geoserver.dane.gov.co/geoserver/geoportal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoportal%3Amgn2022_mpio&outputformat=text/javascript&filter=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Empio_cdpmp%3C/PropertyName%3E%3CLiteral%3E08001%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E&callback=parseResponse&_=1709081630225

- url poligonos de baranoa (municipio): https://geoserver.dane.gov.co/geoserver/geoportal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoportal%3Amgn2022_mpio&outputformat=text/javascript&filter=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Empio_cdpmp%3C/PropertyName%3E%3CLiteral%3E08078%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E&callback=parseResponse&_=1709081630227
*/