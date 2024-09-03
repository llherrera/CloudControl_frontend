import { toast } from 'react-toastify';

const existingToast = toast.isActive('notify');
// `One of: 'info', 'success', 'warning', 'error', 'default'`
type ListTypes = 'info' | 'success' | 'warning' | 'error' | 'default';

export const notify = (text: string, type?: ListTypes) => {
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
                type: type ?? 'default'
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
                type: type ?? 'default'
            }
        );
    }
}