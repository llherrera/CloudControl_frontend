import axios from "axios";

import { ResponseGeocoder } from '@/interfaces'

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