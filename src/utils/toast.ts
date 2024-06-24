import { toast } from 'react-toastify';

const existingToast = toast.isActive('notify');

export const notify = (text: string) => {
    if (existingToast) {
        toast.update(
            text, { 
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
    } else {
        toast(
            text, { 
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                toastId: 'notify',
            }
        );
    }
}