// components/UserManager/SessionsTable.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetActiveSessions } from "@/store/pqrs/thunks";
import { useUserInfo } from "@/utils/sessionHooks";
import { Session } from "@/interfaces/session";
import { decode } from "@/utils/decode";

interface SessionsTableProps {
  onShowAdvancedData?: () => void;
}

const SessionsTable: React.FC<SessionsTableProps> = ({ onShowAdvancedData }) => {
  const dispatch = useAppDispatch();

const [rol, setRol] = useState("");
const [id, setId] = useState(0);
const [user, setUser] = useState("");
const [idPlan_token, setIdPlan_token] = useState(0); // Token value
const [idPlan, setIdPlan] = useState<number | null>(null); // Final resolved value

const { token_info } = useAppSelector(store => store.auth);

useEffect(() => {
  if (token_info?.token !== undefined) {
    const decoded = decode(token_info.token);
    setId(decoded.id);
    setUser(decoded.user);
    setRol(decoded.rol);
    setIdPlan_token(decoded.id_plan || 0);
  }
}, [token_info]);

// Nuevo useEffect para resolver idPlan final (token o localStorage)
useEffect(() => {
  if (typeof window === 'undefined') return; // Solo cliente

  // Si token es 0, usa localStorage
  if (idPlan_token === 0) {
    const idPlan_string = localStorage.getItem('id_plan');
    const fallbackId = idPlan_string ? parseInt(idPlan_string, 10) : null;
    setIdPlan(fallbackId);
    console.log("Usando idPlan de localStorage:", fallbackId);
  } else {
    // Prioridad al token
    setIdPlan(idPlan_token);
    console.log("Usando idPlan de token:", idPlan_token);
  }
}, [idPlan_token]);

  
  const { list: sessions, loading } = useAppSelector(state => state.sessions);

  console.log("todas las sesiones:", sessions);
  
  const activeSessions = sessions.filter(session => session.IsActive);

  console.log("sesiones activas:", activeSessions);

  const handleRefresh = () => {
    console.log('[SessionTable] Refresh triggered', { idPlan });
    if (idPlan) {
      dispatch(thunkGetActiveSessions({ planId: idPlan }));
    } else {
      console.warn('[SessionTable] Cannot refresh: idPlan is undefined');
    }
  };

  useEffect(() => {
    console.log('[SessionTable] useEffect triggered', { idPlan });
    handleRefresh();
  }, [idPlan]);
  return (
    <div className="tw-space-y-4">
      <div className="tw-flex tw-justify-between tw-items-center">
        <h2 className="tw-text-xl tw-font-semibold">Sesiones Activas</h2>
        <div className="tw-flex tw-gap-2">
          {onShowAdvancedData && (
            <button
              onClick={() => {
                console.log('[SessionTable] Advanced Data button clicked');
                onShowAdvancedData();
              }}
              className="tw-px-4 tw-py-2 tw-bg-purple-500 tw-text-white tw-rounded tw-hover:tw-bg-purple-600 tw-text-sm tw-font-medium"
            >
              Datos Avanzados
            </button>
          )}
          <button
            onClick={() => {
              console.log('[SessionTable] Refresh button clicked');
              handleRefresh();
            }}
            disabled={loading}
            className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded tw-hover:tw-bg-blue-600 tw-disabled:tw-bg-blue-300 tw-text-sm tw-font-medium"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="tw-text-center tw-py-8">
          <div className="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-blue-600"></div>
          <p className="tw-mt-2 tw-text-gray-600">Cargando sesiones activas...</p>
        </div>
      ) : activeSessions.length === 0 ? (
        <div className="tw-text-center tw-py-6 tw-text-gray-500 tw-text-sm">
          No hay sesiones activas en este momento.
        </div>
      ) : (
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow tw-border tw-border-gray-200 tw-text-sm">
            <thead>
              <tr className="tw-bg-gray-50 tw-text-gray-700">
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Usuario</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Estado</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Inicio</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Fin / Duración</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Dispositivo</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">IP / Ubicación</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-font-semibold">Pestañas / Reconexiones</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((session) => {
                console.log('[SessionTable] Rendering session:', {
                  sessionId: session.SessionId,
                  userId: session.UserId,
                  username: session.username,
                  isActive: session.IsActive,
                  startedAt: session.StartedAtUtc
                });
                return (
                <tr
                  key={session.SessionId}
                  className={`tw-border-t tw-border-gray-100 tw-hover:tw-bg-gray-50 ${
                    session.IsActive ? "tw-bg-green-50" : ""
                  }`}
                >
                  <td className="tw-px-4 tw-py-3 tw-font-medium">
                    {session.username}
                    <div className="tw-text-xs tw-text-gray-500">{session.email}</div>
                  </td>
                  <td className="tw-px-4 tw-py-3">
                    <span
                      className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-[11px] tw-font-semibold ${
                        session.IsActive
                          ? "tw-bg-green-100 tw-text-green-800"
                          : "tw-bg-gray-100 tw-text-gray-700"
                      }`}
                    >
                      {session.IsActive ? "Activa" : "Terminada"}
                    </span>
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-xs">
                    {new Date(session.StartedAtUtc).toLocaleString("es-CO")}
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-xs">
                    {session.IsActive
                      ? "En progreso..."
                      : session.EndedAtUtc
                      ? `${new Date(session.EndedAtUtc).toLocaleString("es-CO")} ${
                          session.DurationSeconds ? `(${Math.floor(session.DurationSeconds / 60)}m ${session.DurationSeconds % 60}s)` : ""
                        }`
                      : "-"}
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-xs tw-text-gray-700">
                    {session.DeviceSummary || `${session.BrowserName || ''} en ${session.OsName || ''}`.trim() || 'Desconocido'}
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-xs tw-text-gray-600">
                    {session.IpTruncatedOrHash}
                    {session.ApproxLocation && (
                      <div className="tw-text-[11px]">📍 {session.ApproxLocation}</div>
                    )}
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-xs tw-text-gray-600">
                    {session.TabsCountMax || 0} pestañas máx.
                    <div className="tw-text-[11px]">{session.ReconnectCount || 0} reconexiones</div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionsTable;
