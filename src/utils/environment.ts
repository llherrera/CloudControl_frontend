export const getEnvironment = () => {
    return {
        BASE_URL: process.env.VITE_BASE_URL,
        ENC_KEY: process.env.VITE_ENCRYPTED_KEY,
        URL_CHAT: process.env.VITE_URL_CHAT,
        GEOCODER_API: process.env.VITE_GEOCODER_API
    }
}