import axios from "axios";
import { ResponseGeocoder } from '@/interfaces';
import { getEnvironment } from '@/utils';

const { OPENCAGE } = getEnvironment();

export const getCoords = async (city: string, deparment: string, country: string): Promise<ResponseGeocoder> => {
    //const res = await axios.get('/geocoder', {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            addressdetail: 1,
            q: `{${city}},{${deparment}},{${country}}`,
            format: 'json'
        }
    });
    const resultCity = res.data.filter((i: ResponseGeocoder) => i.addresstype === 'city')
    return resultCity[0];
}

export const getReverseGeocode = async (lat: number, lng: number): Promise<any> => {
    const API_KEY = OPENCAGE;
    try {
        const res = await axios.get('/reverse-geocoding', {
        //const res = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: `${lat}+${lng}`,
                key: API_KEY
            }
        });
        return res;
    } catch (error) {
        return error;
    }
}