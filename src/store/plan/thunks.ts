import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { PDTInterface,
        ErrorBasicInterface,
        GetNodeProps,
        AddColorsProps,
        LevelInterface,
        Level,
        Secretary,
        PropsSecretary,
        PropsLocations,
        LocationInterface,
        UpdateWProps } from '../../interfaces';
import { parseErrorAxios } from '../../utils';

import {getPDTid, 
        addPDT,
        getLastPDT,
        getColors, 
        getLevelNodes, 
        addColor,
        updateColor,
        getPDTLevelsById, 
        getLevelName, 
        getSecretaries,
        addSecretaries, 
        addLocations, 
        getLocations,
        updateSecretaries,
        updateWeights } from '@/services/api';

export const thunkGetPDTid = createAsyncThunk<PDTInterface, string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPDTid',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getPDTid(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetLastPDT = createAsyncThunk<PDTInterface, void, { rejectValue: ErrorBasicInterface }>(
    'pdt/getLastPDT',
    async (props: void, { rejectWithValue }) => {
        try {
            const res = await getLastPDT();
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddPDT = createAsyncThunk<PDTInterface, PDTInterface, { rejectValue: ErrorBasicInterface }>(
    'pdt/addPDT',
    async (props: PDTInterface, { rejectWithValue }) => {
        try {
            const res = await addPDT(props);
            const { id_plan } = res;
            if (id_plan) {
                return res;
            } else {
                const result = parseErrorAxios(res);
                return rejectWithValue(result);
            }
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetColors = createAsyncThunk<number[], string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getColors',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getColors(props);
            if (res.length === 0) {
                const result = parseErrorAxios(res);
                return rejectWithValue(result);
            }
            return [res[0].value_1, res[0].value_2, res[0].value_3, res[0].value_4];
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddColors = createAsyncThunk<number[], AddColorsProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/addColors',
    async (props: AddColorsProps, { rejectWithValue }) => {
        try {
            const res = await addColor(props.id_plan, props.colors);
            return res.result;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkUpdateColors = createAsyncThunk<number[], AddColorsProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/updateColors',
    async (props: AddColorsProps, { rejectWithValue }) => {
        try {
            const res = await updateColor(props.id_plan, props.colors);
            return res.result;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetNodes = createAsyncThunk<[], GetNodeProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/getNodes',
    async (props: GetNodeProps, { rejectWithValue }) => {
        try {
            const res = await getLevelNodes(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkUpdateWeight = createAsyncThunk<[], UpdateWProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/updateWeight',
    async (props: UpdateWProps, { rejectWithValue }) => {
        try {
            const res = await updateWeights(props.ids, props.weights);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkUpdateYears = createAction('plan/updateYears', (years:number[]) => {
    return {
        payload: years
    }
})

export const thunkGetLevelsById = createAsyncThunk<LevelInterface[], string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getLevelsId',
    async (props: string, {rejectWithValue}) => {
        try {
            const res = await getPDTLevelsById(props);
            const resArr = [...res];
            const temp = [] as LevelInterface[];
            resArr.forEach((item: Level) => {
                temp.push({
                    id_level: item.id_level,
                    name: item.name,
                    description: item.description,
                })
            });
            return temp;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetLevelName = createAsyncThunk<[[]], string[], { rejectValue: ErrorBasicInterface }>(
    'pdt/getLevelName',
    async (props: string[], { rejectWithValue }) => {
        try {
            const res = await getLevelName(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddSecretaries = createAsyncThunk<Secretary[], PropsSecretary, { rejectValue: ErrorBasicInterface }>(
    'pdt/addSecretaries',
    async (props: PropsSecretary, { rejectWithValue }) => {
        try {
            const res = await addSecretaries(props.id_plan, props.secretaries);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetSecretaries = createAsyncThunk<Secretary[], number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getSecretaries',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getSecretaries(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkUpdateSecretaries = createAsyncThunk<Secretary[], PropsSecretary, { rejectValue: ErrorBasicInterface }>(
    'pdt/updateSecretaries',
    async (props: PropsSecretary, { rejectWithValue }) => {
        try {
            const res = await updateSecretaries(props.id_plan, props.secretaries);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkAddLocations = createAsyncThunk<LocationInterface[], PropsLocations, { rejectValue: ErrorBasicInterface }>(
    'pdt/addLocations',
    async (props: PropsLocations, { rejectWithValue }) => {
        try {
            const { id_plan, locations } = props;
            const res = await addLocations(id_plan, locations);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)

export const thunkGetLocations = createAsyncThunk<LocationInterface[], number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getLocations',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getLocations(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
)
