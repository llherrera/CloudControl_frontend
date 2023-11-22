import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { EvidenceInterface, ErrorBasicInterface, GetEvidenceProps, GetEvidencesProps } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import { getEvidence, getEvidences, getEvidenceCount } from "@/services/api";

export const thunkGetEvidence = createAsyncThunk<EvidenceInterface[], GetEvidenceProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidence", 
    async (props: GetEvidenceProps, { rejectWithValue }) => {
        try {
            const res = await getEvidence(props.id_plan, props.codigo);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetEvidences = createAsyncThunk<EvidenceInterface[], GetEvidencesProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidences", 
    async (props: GetEvidencesProps, { rejectWithValue }) => {
        try {
            const res = await getEvidences(props.id_plan, props.page);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetEvidenceCount = createAsyncThunk<number, number, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidenceCount", 
    async (id_plan: number, { rejectWithValue }) => {
        try {
            const res = await getEvidenceCount(id_plan);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);