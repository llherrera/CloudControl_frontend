import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { thunkUpdateSessionActivity, thunkCreateSessionEvent } from '@/store/pqrs/thunks';
import { api } from '@/services/pqrs_api';
import { decode } from "@/utils";

// Hook para actualizar actividad de sesión
export const useSessionActivity = () => {
  const dispatch = useAppDispatch();
  const currentSessionId = useAppSelector(state => state.sessions.currentSessionId);

  const updateTabsCount = useCallback((tabsCount: number) => {
    if (currentSessionId) {
      dispatch(thunkUpdateSessionActivity({
        sessionId: currentSessionId,
        tabsCount
      }));
    }
  }, [dispatch, currentSessionId]);

  const incrementReconnect = useCallback(() => {
    if (currentSessionId) {
      dispatch(thunkUpdateSessionActivity({
        sessionId: currentSessionId,
        incrementReconnect: true
      }));
    }
  }, [dispatch, currentSessionId]);

  // Actualizar contador de pestañas cuando cambie la cantidad
  useEffect(() => {
    const updateTabs = () => {
      // Esta es una aproximación, en una app real podrías usar APIs más específicas
      updateTabsCount(1); // Por defecto 1 pestaña
    };

    // Escuchar cambios de visibilidad (aproximación de actividad)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Usuario regresó, podría ser una reconexión
        incrementReconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Actualizar cada cierto tiempo para mantener sesión activa
    const interval = setInterval(() => {
      updateTabsCount(1); // Mantener contador básico
    }, 5 * 60 * 1000); // Cada 5 minutos

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [updateTabsCount, incrementReconnect]);

  return { updateTabsCount, incrementReconnect };
};

// Hook para crear eventos de sesión
export const useSessionEvents = () => {
  const dispatch = useAppDispatch();
  const currentSessionId = useAppSelector(state => state.sessions.currentSessionId);
  const { id: userId } = useUserInfo();

  const createEvent = useCallback((eventType: string, eventName?: string, eventMetadata?: string) => {
    if (currentSessionId && userId) {
      dispatch(thunkCreateSessionEvent({
        sessionId: currentSessionId,
        userId,
        eventType,
        eventName,
        eventMetadata
      }));
    }
  }, [dispatch, currentSessionId, userId]);

  // Ejemplo: Crear evento al hacer clic en elementos importantes
  const trackClick = useCallback((elementName: string) => {
    createEvent('CLICK', `Click on ${elementName}`);
  }, [createEvent]);

  // Ejemplo: Crear evento de navegación
  const trackNavigation = useCallback((page: string) => {
    createEvent('NAVIGATE', `Navigate to ${page}`);
  }, [createEvent]);

  return { createEvent, trackClick, trackNavigation };
};

// Hook para manejar información del usuario desde el token
export const useUserInfo = () => {
  const [id, setId] = useState<number | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [idPlan, setIdPlan] = useState<number | null>(null);
  
  const { token_info } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token_info?.token !== undefined) {  
    const decoded = decode(token_info.token);
      setId(decoded.id);
      setUser(decoded.user);
      setRol(decoded.rol);
      setIdPlan(decoded.id_plan);
      console.log('Token decodificado:', decoded);
    }
  }, [token_info]);

  return { id, user, rol, idPlan };
};

// Hook para manejar el cierre de sesión al salir de la página
export const useSessionCleanup = () => {
  const dispatch = useAppDispatch();
  const currentSessionId = useAppSelector(state => state.sessions.currentSessionId);
  const { id: userId } = useUserInfo();

  const closeSession = useCallback(() => {
    if (currentSessionId && userId) {
      // Usar sendBeacon para cerrar la sesión de manera confiable
      const url = `${api.defaults.baseURL}/sessions/close`;
      const data = JSON.stringify({
        sessionId: currentSessionId,
        userId
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, data);
      } else {
        // Fallback para navegadores que no soportan sendBeacon
        fetch(url, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
          keepalive: true, // Mantener la petición viva
        }).catch(err => console.error('Error closing session:', err));
      }
    }
  }, [currentSessionId, userId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      closeSession();
    };

    const handleUnload = () => {
      closeSession();
    };

    // Escuchar eventos de salida de la página
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [closeSession]);

  return { closeSession };
};