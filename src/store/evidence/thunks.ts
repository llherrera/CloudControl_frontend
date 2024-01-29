import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    EvidenceInterface, 
    ErrorBasicInterface, 
    GetEvidenceProps, 
    GetEvidencesProps, 
    AddEvidenceProps,
    UpdateEvidenceProps,
    Coordinates,
    UbicationDB,
    GetUserEviProps } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import { 
    getEvidence, 
    getEvidences, 
    getEvidenceCount, 
    getUserEvidences,
    addEvicenceGoal,
    updateEvicenceGoal,
    getUbiEvidences } from "@/services/api";

export const thunkGetEvidence = createAsyncThunk<EvidenceInterface[], GetEvidenceProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/getEvidence", 
    async (props: GetEvidenceProps, { rejectWithValue }) => {
        try {
            const res = await getEvidence(props.id_plan, props.code);
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

export const thunkGetUserEvidences = createAsyncThunk<EvidenceInterface[], GetUserEviProps, { rejectValue: ErrorBasicInterface}>(
    "evidence/getUserEvidences", 
    async (props: GetUserEviProps, { rejectWithValue }) => {
        try {
            const res = await getUserEvidences(props.page, props.id_plan);
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
            const res = await addEvicenceGoal(props.id_plan, props.code, props.data, props.file, props.list_points);
            return res[0];
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
            const res = await updateEvicenceGoal(props.id_evidence, props.data, props.file, props.list_points);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkGetUbiEvidence = createAsyncThunk<Coordinates[], number, { rejectValue: ErrorBasicInterface}>(
    "evidence/getUbiEvidence", 
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await getUbiEvidences(undefined,id);
            const result: Coordinates[] = res.map((item: UbicationDB) => {
                return {lat: item.lat, lng: item.lng};
            });
            return result;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);