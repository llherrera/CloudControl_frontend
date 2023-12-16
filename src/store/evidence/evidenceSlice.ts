import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {EvidenceInterface, 
        InitialStateEvidenceInterface, 
        Coordinates } from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState } from "@/utils";

import { thunkGetEvidence, thunkGetEvidences, thunkGetEvidenceCount } from "./thunks";

const getInitialState = (): InitialStateEvidenceInterface => {
    const evidenceState = getGenericState("evidence");
    if (evidenceState) return evidenceState;
    return {
        loadingEvidence: false,
        errorLoadingEvidence: undefined,
        evidence: [],
        eviSelected: undefined,
        eviCount: 0,
        listPoints: [],
    };
};

export const evidenceSlice = createSlice({
    name: "evidence",
    initialState: getInitialState,
    reducers: {
        removeEvidence: (state, action: PayloadAction<number>) => {
            state.evidence = state.evidence?.slice(action.payload, 1);
            removeGenericState('evidence');
        },
        resetEvidence: () => getInitialState(),
        setEvidence: (state, action: PayloadAction<EvidenceInterface>) => {
            state.eviSelected = action.payload;
            setGenericState('evidence', state);
        },
        setPoints: (state, action: PayloadAction<Coordinates[]>) => {
            state.listPoints = action.payload;
            setGenericState('evidence', state);
        },
        setEvidences: (state, action: PayloadAction<EvidenceInterface[]>) => {
            state.evidence = action.payload;
            setGenericState('evidence', state);
        }
    },
    extraReducers: builder => {
        builder.addCase(thunkGetEvidence.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetEvidence.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.evidence = action.payload;
            state.eviSelected = action.payload[0];
            setGenericState('evidence', state);
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
            setGenericState('evidence', state);
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
            setGenericState('evidence', state);
        });
        builder.addCase(thunkGetEvidenceCount.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });
    }
});

export const {  removeEvidence, 
                resetEvidence, 
                setEvidence, 
                setPoints,
                setEvidences } = evidenceSlice.actions;
export const evidenceReducer = evidenceSlice.reducer;