import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetUsersByPlanDetailed, thunkGetUserSessionEvents, thunkGetUserSessionAlerts, thunkGetUserSessionHistory } from '@/store/pqrs/thunks';
import { useUserInfo } from '@/utils/sessionHooks';
import { decode } from '@/utils/decode';
import type { Session, UserSessionEvent, UserSessionAlert } from '@/interfaces/session'; // ← Ruta correcta

interface AdvancedSessionDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdvancedSessionDataModal: React.FC<AdvancedSessionDataModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.sessions);
    
    // Estados locales usando los tipos reales de las interfaces
    const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
    const [sessionEvents, setSessionEvents] = useState<UserSessionEvent[]>([]);
    const [sessionAlerts, setSessionAlerts] = useState<UserSessionAlert[]>([]);
    
    const [activeTab, setActiveTab] = useState<'list' | 'events' | 'alerts'>('list');
    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);
    const [user, setUser] = useState("");

    const idPlan_string = localStorage.getItem('id_plan');
    const idPlan = idPlan_string ? parseInt(idPlan_string, 10) : null;

    const { token_info } = useAppSelector(store => store.auth);

    // Efecto para decodificar token
    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setId(decoded.id);
            setUser(decoded.user);
            setRol(decoded.rol);
        }
    }, [token_info]);

    // Efecto para cargar datos y guardarlos en arreglos locales
    useEffect(() => {
        if (isOpen && idPlan) {
            // Limpiar datos anteriores
            setSessionHistory([]);
            setSessionEvents([]);
            setSessionAlerts([]);

            // Session History
            dispatch(thunkGetUserSessionHistory({ planId: idPlan }))
                .unwrap()
                .then((data) => {
                    console.log("📘 Session History:", data);
                    setSessionHistory(Array.isArray(data) ? data : []);
                })
                .catch((err) => {
                    console.error("❌ Error Session History:", err);
                    setSessionHistory([]);
                });

            // Session Events
            dispatch(thunkGetUserSessionEvents({ planId: idPlan }))
                .unwrap()
                .then((data) => {
                    console.log("📗 Session Events:", data);
                    setSessionEvents(Array.isArray(data) ? data : []);
                })
                .catch((err) => {
                    console.error("❌ Error Session Events:", err);
                    setSessionEvents([]);
                });

            // Session Alerts
            dispatch(thunkGetUserSessionAlerts({ planId: idPlan }))
                .unwrap()
                .then((data) => {
                    console.log("📕 Session Alerts:", data);
                    setSessionAlerts(Array.isArray(data) ? data : []);
                })
                .catch((err) => {
                    console.error("❌ Error Session Alerts:", err);
                    setSessionAlerts([]);
                });
        }
    }, [isOpen, idPlan, dispatch]);

    if (!isOpen) return null;

    const renderSessionsTable = () => (
        <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow tw-border tw-border-gray-200 tw-text-sm">
                <thead>
                    <tr className="tw-bg-gray-50 tw-text-gray-700">
                        <th className="tw-px-3 tw-py-2">Session ID</th>
                        <th className="tw-px-3 tw-py-2">Usuario</th>
                        <th className="tw-px-3 tw-py-2">Email</th>
                        <th className="tw-px-3 tw-py-2">Plan</th>
                        <th className="tw-px-3 tw-py-2">Inicio</th>
                        <th className="tw-px-3 tw-py-2">Fin</th>
                        <th className="tw-px-3 tw-py-2">Activa</th>
                        <th className="tw-px-3 tw-py-2">Dispositivo</th>
                        <th className="tw-px-3 tw-py-2">SO</th>
                        <th className="tw-px-3 tw-py-2">Ubicación</th>
                        <th className="tw-px-3 tw-py-2">Reconexiones</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionHistory.map((s) => (
                        <tr key={s.SessionId} className="tw-border-t tw-border-gray-100">
                            <td className="tw-px-3 tw-py-2 tw-font-medium">{s.SessionId}</td>
                            <td className="tw-px-3 tw-py-2">{s.username}</td>
                            <td className="tw-px-3 tw-py-2">{s.email}</td>
                            <td className="tw-px-3 tw-py-2">{s.id_plan}</td>
                            <td className="tw-px-3 tw-py-2 tw-text-xs">
                                {new Date(s.StartedAtUtc).toLocaleString("es-CO")}
                            </td>
                            <td className="tw-px-3 tw-py-2 tw-text-xs">
                                {s.EndedAtUtc
                                    ? new Date(s.EndedAtUtc).toLocaleString("es-CO")
                                    : "-"}
                            </td>
                            <td className="tw-px-3 tw-py-2">
                                <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-[11px] tw-font-semibold ${
                                    s.IsActive
                                        ? "tw-bg-green-100 tw-text-green-800"
                                        : "tw-bg-gray-200 tw-text-gray-700"
                                }`}>
                                    {s.IsActive ? "Activa" : "Cerrada"}
                                </span>
                            </td>
                            <td className="tw-px-3 tw-py-2">{s.DeviceSummary}</td>
                            <td className="tw-px-3 tw-py-2">{s.OsName}</td>
                            <td className="tw-px-3 tw-py-2">{s.ApproxLocation}</td>
                            <td className="tw-px-3 tw-py-2 tw-text-center">{s.ReconnectCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderEventsTable = () => (
        <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow tw-border tw-border-gray-200 tw-text-sm">
                <thead>
                    <tr className="tw-bg-gray-50 tw-text-gray-700">
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">ID Evento</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">ID Sesión</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Usuario</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Tipo</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Nombre</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Fecha/Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionEvents.map((event) => (
                        <tr key={event.EventId} className="tw-border-t tw-border-gray-100 tw-hover:tw-bg-gray-50">
                            <td className="tw-px-4 tw-py-3 tw-font-medium">{event.EventId}</td>
                            <td className="tw-px-4 tw-py-3">{event.SessionId}</td>
                            <td className="tw-px-4 tw-py-3">{event.UserId}</td>
                            <td className="tw-px-4 tw-py-3">{event.EventType}</td>
                            <td className="tw-px-4 tw-py-3">{event.EventName || '-'}</td>
                            <td className="tw-px-4 tw-py-3 tw-text-xs">
                                {new Date(event.EventTimeUtc).toLocaleString("es-CO")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderAlertsTable = () => (
        <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow tw-border tw-border-gray-200 tw-text-sm">
                <thead>
                    <tr className="tw-bg-gray-50 tw-text-gray-700">
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">ID Alerta</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Usuario</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Sesión</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Tipo</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Severidad</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Descripción</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Resuelta</th>
                        <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionAlerts.map((alert) => (
                        <tr key={alert.AlertId} className="tw-border-t tw-border-gray-100 tw-hover:tw-bg-gray-50">
                            <td className="tw-px-4 tw-py-3 tw-font-medium">{alert.AlertId}</td>
                            <td className="tw-px-4 tw-py-3">{alert.UserId}</td>
                            <td className="tw-px-4 tw-py-3">{alert.SessionId || '-'}</td>
                            <td className="tw-px-4 tw-py-3">{alert.AlertType}</td>
                            <td className="tw-px-4 tw-py-3">{alert.SeverityLevel}</td>
                            <td className="tw-px-4 tw-py-3 tw-text-xs">{alert.Description}</td>
                            <td className="tw-px-4 tw-py-3">
                                <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-[11px] tw-font-semibold ${
                                    alert.Resolved
                                        ? "tw-bg-green-100 tw-text-green-800"
                                        : "tw-bg-red-100 tw-text-red-800"
                                }`}>
                                    {alert.Resolved ? "Sí" : "No"}
                                </span>
                            </td>
                            <td className="tw-px-4 tw-py-3 tw-text-xs">
                                {new Date(alert.AlertTimeUtc).toLocaleString("es-CO")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Verificar si hay datos para la pestaña activa
    const hasDataForActiveTab = 
        (activeTab === 'list' && sessionHistory.length > 0) ||
        (activeTab === 'events' && sessionEvents.length > 0) ||
        (activeTab === 'alerts' && sessionAlerts.length > 0);

    return (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-xl tw-max-w-7xl tw-w-full tw-mx-4 tw-max-h-[90vh] tw-overflow-hidden">
                <div className="tw-flex tw-justify-between tw-items-center tw-p-6 tw-border-b">
                    <h2 className="tw-text-2xl tw-font-bold">Datos Avanzados de Sesiones</h2>
                    <button
                        onClick={onClose}
                        className="tw-text-gray-400 tw-hover:tw-text-gray-600 tw-text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="tw-flex tw-border-b">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`tw-px-6 tw-py-3 tw-font-medium tw-text-sm ${
                            activeTab === 'list'
                                ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600'
                                : 'tw-text-gray-500 tw-hover:tw-text-gray-700'
                        }`}
                    >
                        Usuarios (Plan {idPlan})
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`tw-px-6 tw-py-3 tw-font-medium tw-text-sm ${
                            activeTab === 'events'
                                ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600'
                                : 'tw-text-gray-500 tw-hover:tw-text-gray-700'
                        }`}
                    >
                        Eventos de Sesión
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`tw-px-6 tw-py-3 tw-font-medium tw-text-sm ${
                            activeTab === 'alerts'
                                ? 'tw-border-b-2 tw-border-blue-500 tw-text-blue-600'
                                : 'tw-text-gray-500 tw-hover:tw-text-gray-700'
                        }`}
                    >
                        Alertas de Sesión
                    </button>
                </div>

                <div className="tw-p-6 tw-overflow-y-auto tw-max-h-[60vh]">
                    {loading ? (
                        <div className="tw-text-center tw-py-8">
                            <div className="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-blue-600"></div>
                            <p className="tw-mt-2 tw-text-gray-600">Cargando datos...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'list' && renderSessionsTable()}
                            {activeTab === 'events' && renderEventsTable()}
                            {activeTab === 'alerts' && renderAlertsTable()}

                            {!hasDataForActiveTab && (
                                <div className="tw-text-center tw-py-6 tw-text-gray-500 tw-text-sm">
                                    No hay datos disponibles para esta categoría.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedSessionDataModal;
