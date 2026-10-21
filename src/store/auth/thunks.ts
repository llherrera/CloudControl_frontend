import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { AuthInterface, ErrorBasicInterface, LoginProps } from '../../interfaces'
import { parseErrorAxios } from '../../utils'

import { doLogin, doRefreshToken, doLogout } from '@/services/api'
import { thunkCreateSession, thunkCloseSession } from '../pqrs/thunks'
import jwtDecode from 'jwt-decode'

// Función helper para obtener información del dispositivo
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const browserName = (() => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  })();

  const osName = (() => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  })();

  return {
    deviceSummary: `${browserName} on ${osName}`,
    browserName,
    osName,
    approxLocation: Intl.DateTimeFormat().resolvedOptions().timeZone, // Aproximado
    ipTruncatedOrHash: 'unknown' // El backend debería obtener la IP real
  };
};

export const thunkLogin = createAsyncThunk<AuthInterface, LoginProps, { rejectValue: ErrorBasicInterface }>(
  'auth/login',
  async (props: LoginProps, { rejectWithValue, dispatch }) => {
    try {
      const res = await doLogin(props)
      const { token } = res
      if (token) {
        // Decodificar token para obtener userId
        const decoded: any = jwtDecode(token);
        
        // Después de login exitoso, crear sesión
        try {
          const deviceInfo = getDeviceInfo();
          await dispatch(thunkCreateSession({
            userId: decoded.id, // Usar ID del token decodificado
            ...deviceInfo
          })).unwrap();
        } catch (sessionError) {
          console.warn('Error creando sesión:', sessionError);
          // No fallar el login por error en sesión
        }
        return res
      }else {
        const result = parseErrorAxios(res)
        return rejectWithValue(result)
      }
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const thunkRefreshToken = createAsyncThunk<AuthInterface>(
  'auth/refreshToken',
  async (props, { rejectWithValue }) => {
    try {
      const { data } = await doRefreshToken()
      return data.data
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const thunkLogout = createAsyncThunk<AuthInterface>(
  'auth/thunkLogout', 
  async (props, { rejectWithValue, dispatch, getState }) => {
    try {
      // Intentar cerrar sesión activa antes de logout
      const state = getState() as any; // TypeScript workaround
      const currentSessionId = state.sessions?.currentSessionId;
      if (currentSessionId) {
        try {
          await dispatch(thunkCloseSession({ sessionId: currentSessionId })).unwrap();
        } catch (sessionError) {
          console.warn('Error cerrando sesión:', sessionError);
          // No fallar el logout por error en cerrar sesión
        }
      }

      const res = await doLogout()
      return res
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const logout = createAction('auth/logout')
