export const getEnvironment = () => {
    return {
        BASE_URL: process.env.VITE_BASE_URL,
        API_COL: process.env.VITE_COLOMBIA_API_URL,
        GEOPORTAL_BASE_URL: process.env.VITE_GEOPORTAL_DANE_API,
        API_KEY: process.env.VITE_API_KEY_MAPS,
        ENC_KEY: process.env.VITE_ENCRYPTED_KEY
    }
}