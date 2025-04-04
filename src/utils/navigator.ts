import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { notify } from "@/utils";

const ResponseInterceptor = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    const res = error.response.data['msg'];
                    if (res === 'Expired token') {
                        notify('Sesión expirada, vuelva a ingresar', 'error');
                        setTimeout(
                            () => navigate('/login'),
                            5000
                        );
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return null;
};

export default ResponseInterceptor;
