import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { ErrorBasicInterface, ParamsAddPqrs, ParamsAddPqrsType,
    ParamsAddPqrsHistory } from '@/interfaces';

import { parseErrorAxios } from '@/utils';

import { getPQRSsByPlan, getPQRSByRadicado, getPQRSTypes, getPQRSHistoryByRadicado,
    addPQRS, addPQRSType, addPQRSHistory } from '@/services/pqrs_api';

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
