import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStateEvidenceInterface } from "@/interfaces";

import { thunkGetEvidence, thunkGetEvidences, thunkGetEvidenceCount } from "./thunk";

const getInitialState = (): InitialStateEvidenceInterface => {
    return {
        loadingEvidence: false,
        errorLoadingEvidence: undefined,
        evidence: undefined,
        eviCount: 0
    };
};

export const evidenceSlice = createSlice({
    name: "evidence",
    initialState: getInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(thunkGetEvidence.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetEvidence.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.evidence = action.payload;
        });
        builder.addCase(thunkGetEvidence.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });


        builder.addCase(thunkGetEvidences.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetEvidences.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.evidence = action.payload;
        });
        builder.addCase(thunkGetEvidences.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });


        builder.addCase(thunkGetEvidenceCount.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetEvidenceCount.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.eviCount = action.payload;
        });
        builder.addCase(thunkGetEvidenceCount.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });
    }
});

export const evidenceReducer = evidenceSlice.reducer;