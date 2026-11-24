import { Navigate, Route, Routes } from 'react-router-dom';
import * as pages from '../pages';
import { useAppSelector } from '@/store';

/**
 * Guard de solo lectura para Consulta Ciudadana:
 * Impide abrir vistas internas sin haber seleccionado un plan desde /escoger (evita acceso sin-usuario).
 */
const CitizenReadOnlyGuard = ({ children }: { children: JSX.Element }) => {
    const { id_plan } = useAppSelector(store => store.content);
    const hasCitizenPlan = Number(id_plan) > 0;
    if (!hasCitizenPlan) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export const PublicRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/escoger" element={<pages.ChooseCityPage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path="/contrasena" element={<pages.ChangePasswordPage/>} />

            {/* Rutas públicas de consulta ciudadana (ESTRICTAMENTE SOLO LECTURA: 0 configuración, 0 edición) */}
            <Route path="/lobby" element={<CitizenReadOnlyGuard><pages.LobbyPage/></CitizenReadOnlyGuard>} />
            <Route path='/pdt/PlanIndicativo' element={<CitizenReadOnlyGuard><pages.PDTid/></CitizenReadOnlyGuard>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<CitizenReadOnlyGuard><pages.UnitNodePage/></CitizenReadOnlyGuard>} />
            <Route path="/PlanIndicativo/Mapa" element={<CitizenReadOnlyGuard><pages.InterventionMap/></CitizenReadOnlyGuard>} />
            <Route path='/PlanIndicativo/POAI' element={<CitizenReadOnlyGuard><pages.POAI/></CitizenReadOnlyGuard>} />
            <Route path='/PlanIndicativo/Banco-proyectos' element={<CitizenReadOnlyGuard><pages.ProjectBank/></CitizenReadOnlyGuard>} />
            <Route path='/PlanIndicativo/Plan-accion' element={<CitizenReadOnlyGuard><pages.ActionPlanPage/></CitizenReadOnlyGuard>} />
            <Route path='/PQRS' element={<CitizenReadOnlyGuard><pages.PQRSPage/></CitizenReadOnlyGuard>} />
            <Route path='/PQRS/consultar' element={<CitizenReadOnlyGuard><pages.PQRSStatePage/></CitizenReadOnlyGuard>} />
            <Route path='/plan/:uuid' element={<pages.SearchPage/>} />
            <Route path='/meta/:uuid' element={<pages.SearchUnitPage/>} />
            <Route path='/manual' element={<CitizenReadOnlyGuard><pages.ManualPage/></CitizenReadOnlyGuard>} />

            {/* Bloqueo explícito de rutas administrativas o de escritura */}
            <Route path='/pdt/PlanIndicativo/configuracion' element={<Navigate to="/" replace />} />
            <Route path='/pdt/PlanIndicativo/Meta/configuracion' element={<Navigate to="/" replace />} />
            <Route path='/pdt/PlanIndicativo/Meta/evidencia' element={<Navigate to="/" replace />} />
            <Route path='/gestion-usuarios' element={<Navigate to="/" replace />} />
            <Route path='/anadirPDT' element={<Navigate to="/" replace />} />
            <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    );
};
