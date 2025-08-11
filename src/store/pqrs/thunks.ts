import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { ErrorBasicInterface, ParamsAddPqrs, ParamsAddPqrsType,
    ParamsAddPqrsHistory } from '@/interfaces';

import { parseErrorAxios } from '@/utils';

import { getPQRSsByPlan, getPQRSByRadicado, getPQRSTypes, getPQRSHistoryByRadicado,
    addPQRS, addPQRSType, addPQRSHistory, 
    getModulosUsuarioById,
    updateModulosUsuarioById,
    addModulosUsuario,
    getUsersByPlan,
    addSolicitud,
    getAllSolicitudes,
    getOficinasByPlan,
    addServicio,
    getServiciosByPlan,
    updateUserData,
    updateRolUserOffice,
    getUserOfficeById,
    redirectionSolicitud,
    solveSolicitud,
    addServiciosBulk,
    buscarSolicitudesPorDocumentoApi, } from '@/services/pqrs_api';
import { log } from 'node:console';

export const thunkGetPQRSs = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPQRSByPlan',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getPQRSsByPlan(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetPQRSRadicado = createAsyncThunk<{}, string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPQRSRadicado',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getPQRSByRadicado(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetPQRSHistoryRadicado = createAsyncThunk<{}, string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPQRSRadicado',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getPQRSHistoryByRadicado(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetPQRSTypes = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPQRSTypes',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getPQRSTypes(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddPQRS = createAsyncThunk<{}, ParamsAddPqrs, { rejectValue: ErrorBasicInterface }>(
    'pdt/addPQRSTypes',
    async (props: ParamsAddPqrs, { rejectWithValue }) => {
        try {
            const res = await addPQRS(props.id_plan, props.pqrs);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddPQRSTypes = createAsyncThunk<{}, ParamsAddPqrsType, { rejectValue: ErrorBasicInterface }>(
    'pdt/addPQRSTypes',
    async (props: ParamsAddPqrsType, { rejectWithValue }) => {
        try {
            const res = await addPQRSType(props.id_plan, props.type);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddPQRSHistory = createAsyncThunk<{}, ParamsAddPqrsHistory, { rejectValue: ErrorBasicInterface }>(
    'pdt/addPQRSTypes',
    async (props: ParamsAddPqrsHistory, { rejectWithValue }) => {
        try {
            const res = await addPQRSHistory(props.radicado);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetModulosUsuarioById = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'misc/getModulosUsuarioById',
    async (idUsuario: number, { rejectWithValue }) => {
        try {
            const res = await getModulosUsuarioById(idUsuario);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateModulosUsuarioById = createAsyncThunk<{}, { idUsuario: number, modulos: any }, { rejectValue: ErrorBasicInterface }>(
    'misc/updateModulosUsuarioById',
    async ({ idUsuario, modulos }, { rejectWithValue }) => {
        try {
            const res = await updateModulosUsuarioById(idUsuario, modulos);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddModulosUsuario = createAsyncThunk<{}, any, { rejectValue: ErrorBasicInterface }>(
    'misc/addModulosUsuario',
    async (modulos, { rejectWithValue }) => {
        try {
            const res = await addModulosUsuario(modulos);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetUsersByPlan = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'misc/getUsersByPlan',
    async (idPlan: number, { rejectWithValue }) => {
        try {
            const res = await getUsersByPlan(idPlan);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddSolicitud = createAsyncThunk<{}, any, { rejectValue: ErrorBasicInterface }>(
    'misc/addSolicitud',
    async (solicitud, { rejectWithValue }) => {
        try {
            const res = await addSolicitud(solicitud);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetAllSolicitudes = createAsyncThunk<{}, { id_plan: string}, { rejectValue: ErrorBasicInterface }>(
    'misc/getAllSolicitudes/id_plan',
    async ({ id_plan }, { rejectWithValue }) => {
        try {
            const res = await getAllSolicitudes(id_plan);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetServiciosByPlan = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'misc/getServiciosByPlan',
    async (idPlan: number, { rejectWithValue }) => {
        console.log('[thunkGetServiciosByPlan] idPlan recibido:', idPlan);
        try {
            const res = await getServiciosByPlan(idPlan);
            console.log('[thunkGetServiciosByPlan] Respuesta exitosa:', res);
            return res;
        } catch (err) {
            console.error('[thunkGetServiciosByPlan] Error:', err);
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddServicio = createAsyncThunk<{}, { SERVICIO: string, id_plan: number, tipo: 'N/A' | 'Valor' }, { rejectValue: ErrorBasicInterface }>(
    'misc/addServicio',
    async ({ SERVICIO, id_plan, tipo }, { rejectWithValue }) => {
        try {
            const res = await addServicio({ SERVICIO, tipo }, id_plan);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetOficinasByPlan = createAsyncThunk<{}, number, { rejectValue: ErrorBasicInterface }>(
    'misc/getOficinasByPlan',
    async (idPlan: number, { rejectWithValue }) => {
        try {
            const res = await getOficinasByPlan(idPlan);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddServiciosBulk = createAsyncThunk<
  any,
  { id_plan: number; servicios: { nombre: string; tipo: 'N/A' | 'Valor' }[] },
  { rejectValue: ErrorBasicInterface }
>(
  'misc/addServiciosBulk',
  async ({ id_plan, servicios }, { rejectWithValue }) => {
    try {
      const res = await addServiciosBulk(id_plan, servicios);
      return res;
    } catch (err) {
      const result = parseErrorAxios(err);
      return rejectWithValue(result);
    }
  }
);


export const thunkUpdateUserData = createAsyncThunk<{}, { id_user: number, office: string, isActive: boolean }, { rejectValue: ErrorBasicInterface }>(
    'user/updateUserData',
    async ({ id_user, office, isActive }, { rejectWithValue }) => {
        try {
            const res = await updateUserData(id_user, office, isActive);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateUserRol = createAsyncThunk<{}, { id_user: number, rol: string }, { rejectValue: ErrorBasicInterface }>(
    'user/updateUserRol',
    async ({ id_user, rol }, { rejectWithValue }) => {
        try {
            const res = await updateRolUserOffice(id_user, rol);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

interface OfficeResponse {
    office: string;
  }

export const thunkGetUserOfficeById = createAsyncThunk<
OfficeResponse, // <- tipo del payload que retorna el thunk
{ id_user: number } // <- tipo del parámetro que recibe el thunk
>(
    'user/getUserOfficeById',
    async ({ id_user }, { rejectWithValue }) => {
        try {
            const res = await getUserOfficeById(id_user);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkSolveSolicitud = createAsyncThunk<{}, { id_solicitud: string }, { rejectValue: ErrorBasicInterface }>(
    'solicitud/solveSolicitud',
    async ({ id_solicitud }, { rejectWithValue }) => {
        try {
            const res = await solveSolicitud(id_solicitud);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkRedirectionSolicitud = createAsyncThunk<{}, { id_solicitud: string, oficinaDestino: string }, { rejectValue: ErrorBasicInterface }>(
    'solicitud/redirectionSolicitud',
    async ({ id_solicitud, oficinaDestino }, { rejectWithValue }) => {
        try {
            const res = await redirectionSolicitud(id_solicitud, oficinaDestino);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export interface SolicitudShort {
    id: number;
    nombre: string;
    tipoDocumento: string;
    documento: string;
    genero?: string;
    grupo?: string;
    poblacional?: string;
    discapacidad?: string;
    escolaridad?: string;
    nacionalidad?: string;
    telefono?: string;
    correo?: string;
    barrio?: string;
    comuna?: string;
    corregimiento?: string;
    vereda?: string;
  }

  export const thunkBuscarSolicitudesPorDocumento = createAsyncThunk<
  SolicitudShort[],           // retorno exitoso
  string,                     // argumento: documento (string)
  { rejectValue: ErrorBasicInterface }
>(
  'solicitud/buscarPorDocumento',
  async (documento: string, { rejectWithValue }) => {
    try {
      const res = await buscarSolicitudesPorDocumentoApi(documento);
      return res;
    } catch (err) {
      const result = parseErrorAxios(err);
      return rejectWithValue(result);
    }
  }
);