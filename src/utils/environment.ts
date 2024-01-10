export const getEnvironment = () => {
    return {
        BASE_URL: import.meta.env.VITE_BASE_URL,
        API_COL: import.meta.env.VITE_COLOMBIA_API_URL,
        GEOPORTAL_BASE_URL: import.meta.env.VITE_GEOPORTAL_DANE_API,
        API_KEY: import.meta.env.VITE_API_KEY_MAPS,
        ENC_KEY: import.meta.env.VITE_ENCRYPTED_KEY
    }
}