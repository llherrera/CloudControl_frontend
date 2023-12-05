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
