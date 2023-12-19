import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import {
    EvidenceInterface, 
    ErrorBasicInterface, 
    GetEvidenceProps, 
    GetEvidencesProps, 
    AddEvidenceProps,
    UpdateEvidenceProps} from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import { 
    getEvidence, 
    getEvidences, 
    getEvidenceCount, 
    getUserEvidences,
    addEvicenceGoal,
    updateEvicenceGoal } from "@/services/api";

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
            const res = await getEvidences(props.id, props.page);
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

export const thunkGetUserEvidences = createAsyncThunk<EvidenceInterface[], number, { rejectValue: ErrorBasicInterface}>(
    "evidence/getUserEvidences", 
    async (page: number, { rejectWithValue }) => {
        try {
            const res = await getUserEvidences(page);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddEvidenceGoal = createAsyncThunk<EvidenceInterface, AddEvidenceProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/addEvidenceGoal", 
    async (props: AddEvidenceProps, { rejectWithValue }) => {
        try {
            const res = await addEvicenceGoal(props.id_plan, props.code, props.data, props.file, props.listPoints);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateEvidence = createAsyncThunk<EvidenceInterface, UpdateEvidenceProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/updateEvidence",
    async (props: UpdateEvidenceProps, { rejectWithValue}) => {
        try {
            const res = await updateEvicenceGoal(props.data, props.file, props.listPoints);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);