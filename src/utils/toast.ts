import { toast } from 'react-toastify';

export const notify = (text: string) => toast(text, { 
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});