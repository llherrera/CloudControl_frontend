import axios from "axios";
import { ResponseGeocoder } from '@/interfaces';
import { getEnvironment } from '@/utils';

const { BASE_URL, GEOCODER_API } = getEnvironment();
const api = axios.create({
    baseURL: BASE_URL,
});

export const getCoords = async (city: string, deparment: string, country: string): Promise<ResponseGeocoder> => {
    const res = await axios({
        method: 'GET',
        url: GEOCODER_API,
        params: {
            addressdetail: 1,
            q: `{${city}},{${deparment}},{${country}}`,
            format: 'json'
        }
    });
    const resultCity = res.data.filter((i: ResponseGeocoder) => i.addresstype === 'city' || i.addresstype === 'town');
    return resultCity[0];
}

export const getReverseGeocode = async (lat: number, lng: number): Promise<any> => {
    const res = await api.get('/servicios/reverse-geo', {
        params: {
            lat,
            lng
        }
    });
    return res;
}