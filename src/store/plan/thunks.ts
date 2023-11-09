import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { PDTInterface, ErrorBasicInterface } from '../../interfaces'
import { parseErrorAxios } from '../../utils'

import { getPDTid, addPDT, getColors } from '@/services/api'

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