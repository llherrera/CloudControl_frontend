export const getEnvironment = () => {
    return {
        BASE_URL: import.meta.env.VITE_BASE_URL,
    }
}

export const getColombiaApi = () => {
    return {
        BASE_URL: import.meta.env.VITE_COLOMBIA_API_URL,
    }
}

export const getGeoportalApi = () => {
    return {
        GEOPORTAL_BASE_URL: import.meta.env.VITE_GEOPORTAL_DANE_API,
    }
}

export const getGoogleApiKey = () => {
    return {
        API_KEY: import.meta.env.VITE_API_KEY_MAPS as string
    }
}

export const getEncryptKey = () => {
    return {
        ENC_KEY: import.meta.env.VITE_ENCRYPTED_KEY as string
    }
}