import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { EvidenceInterface, ErrorBasicInterface, getEvidenceProps } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import { getEvidence, getEvidences } from "@/services/api";

export const thunkGetEvidence = createAsyncThunk<EvidenceInterface[], getEvidenceProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidence", 
    async (props: getEvidenceProps, { rejectWithValue }) => {
        try {
            const res = await getEvidence(props.id_plan, props.codigo );
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetEvidences = createAsyncThunk<EvidenceInterface[], number, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidences", 
    async (props: number, { rejectWithValue }) => {
        try {
            const res = await getEvidences(props);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);