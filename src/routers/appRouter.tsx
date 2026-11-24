import { Route, Routes } from 'react-router-dom';

import { useAppSelector } from '../store';

import { PrivateRouter } from './adminRouter';
import { PublicRouter } from './publicRouter';
import { OfficerRouter } from './funcionarioRoutes';
import { PlanningRouter } from './planningRouter';
import { SectorialistRouter } from './sectorialistRouter';

import { decode } from '@/utils';

const normalizeRole = (role?: string): string => {
    if (!role) return '';
    const cleaned = role
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    if (cleaned === 'administrador' || cleaned === 'superadmin') return 'admin';
    return cleaned;
};

export const AppRouter = () => {
    const { logged, token_info } = useAppSelector(store => store.auth);
    let role = '';
    let hasValidToken = false;

    if (logged && token_info?.token) {
        try {
            const decoded = decode(token_info.token) as { rol?: string; exp?: number };
            const notExpired = !decoded?.exp || Date.now() < decoded.exp * 1000;
            if (notExpired && decoded?.rol) {
                role = normalizeRole(decoded.rol);
                hasValidToken = role !== '' && role !== 'ciudadano';
            }
        } catch {
            hasValidToken = false;
        }
    }

    if (!hasValidToken) {
        return <Routes><Route path="*" element={<PublicRouter />} /></Routes>;
    }

    return role === 'admin' ? <Routes><Route path="*" element={<PrivateRouter />} /></Routes> :
        role === 'funcionario' ? <Routes><Route path="*" element={<OfficerRouter />} /></Routes> :
        role === 'planeacion' ? <Routes><Route path="*" element={<PlanningRouter />} /></Routes> :
        role === 'sectorialista' ? <Routes><Route path="*" element={<SectorialistRouter />} /></Routes> :
        <Routes><Route path="*" element={<PublicRouter />} /></Routes>;
};
