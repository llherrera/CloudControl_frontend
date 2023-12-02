import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { PDTInterface, ErrorBasicInterface, GetNodeProps, 
        AddColorsProps, NivelInterface, Nivel, Secretary, 
        PropsSecretary, SecretaryResponse } from '../../interfaces'
import { parseErrorAxios } from '../../utils'

import { getPDTid, addPDT, getColors, getLevelNodes, addColor, 
        getPDTLevelsById, getLevelName, getLogoPlan, getSecretaries,
        addSecretaries } from '@/services/api'

export const thunkGetPDTid = createAsyncThunk<PDTInterface, string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getPDTid',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getPDTid(props)
            return res
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkAddPDT = createAsyncThunk<PDTInterface, PDTInterface, { rejectValue: ErrorBasicInterface }>(
    'pdt/addPDT',
    async (props: PDTInterface, { rejectWithValue }) => {
        try {
            const res = await addPDT(props)
            const { id_plan } = res
            if (id_plan) {
                return res
            } else {
                const result = parseErrorAxios(res)
                return rejectWithValue(result)
            }
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkGetColors = createAsyncThunk<number[], string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getColors',
    async (props: string, { rejectWithValue }) => {
        try {
            const res = await getColors(props)
            if (res.length === 0) {
                const result = parseErrorAxios(res)
                return rejectWithValue(result)
            }
            return [res[0].value1, res[0].value2, res[0].value3, res[0].value4]
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkAddColors = createAsyncThunk<number[], AddColorsProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/addColors',
    async (props: AddColorsProps, { rejectWithValue }) => {
        try {
            const res = await addColor(props)
            return res
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkGetNodes = createAsyncThunk<[], GetNodeProps, { rejectValue: ErrorBasicInterface }>(
    'pdt/getNodes',
    async (props: GetNodeProps, { rejectWithValue }) => {
        try {
            const res = await getLevelNodes(props)
            return res
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkUpdateYears = createAction('plan/updateYears', (years:number[]) => {
    return {
        payload: years
    }
})

export const thunkGetLevelsById = createAsyncThunk<NivelInterface[], string, { rejectValue: ErrorBasicInterface }>(
    'pdt/getLevelsId',
    async (props: string, {rejectWithValue}) => {
        try {
            const res = await getPDTLevelsById(props)
            const resArr = [...res];
            const temp = [] as NivelInterface[]
            resArr.forEach((item: Nivel) => {
                temp.push({
                    id_nivel: item.id_nivel,
                    LevelName: item.Nombre,
                    Description: item.Descripcion,
                })
            })
            return temp
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkGetLevelName = createAsyncThunk<[[]], string[], { rejectValue: ErrorBasicInterface }>(
    'pdt/getLevelName',
    async (props: string[], { rejectWithValue }) => {
        try {
            const res = await getLevelName(props)
            return res
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkGetLogo = createAsyncThunk<string, number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getLogo',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getLogoPlan(props)
            return res[0].UrlLogo
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkAddSecretaries = createAsyncThunk<Secretary[], PropsSecretary, { rejectValue: ErrorBasicInterface }>(
    'pdt/addSecretaries',
    async (props: PropsSecretary, { rejectWithValue }) => {
        try {
            const res = await addSecretaries(props.id_plan, props.secretaries)
            return res
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)

export const thunkGetSecretaries = createAsyncThunk<string[], number, { rejectValue: ErrorBasicInterface }>(
    'pdt/getSecretaries',
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getSecretaries(props)
            return res.map((item: SecretaryResponse) => item.Nombre)
        } catch (err) {
            const result = parseErrorAxios(err)
            return rejectWithValue(result)
        }
    }
)