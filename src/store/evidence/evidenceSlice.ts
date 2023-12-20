import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {EvidenceInterface, 
        InitialStateEvidenceInterface, 
        Coordinates, 
        UbicationDB} from "@/interfaces";
import {setGenericState, 
        getGenericState, 
        removeGenericState } from "@/utils";

import {thunkGetEvidence, 
        thunkGetEvidences, 
        thunkGetEvidenceCount,
        thunkGetUserEvidences,
        thunkAddEvidenceGoal,
        thunkUpdateEvidence,
        thunkGetUbiEvidence } from "./thunks";

const getInitialState = (): InitialStateEvidenceInterface => {
    const evidenceState = getGenericState("evidence");
    if (evidenceState) return evidenceState;
    return {
        loadingEvidence: false,
        errorLoadingEvidence: undefined,
        evidences: [],
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
            state.evidences = state.evidences?.slice(action.payload, 1);
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
            state.evidences = action.payload;
            setGenericState('evidence', state);
        },
        resetPoints: (state) => {
            state.listPoints = [];
            removeGenericState('evidence');
        },
    },
    extraReducers: builder => {
        builder.addCase(thunkGetEvidence.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetEvidence.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.evidences = action.payload;
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
            state.evidences = action.payload;
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


        builder.addCase(thunkAddEvidenceGoal.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkAddEvidenceGoal.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.eviSelected = action.payload;
            setGenericState('evidence', state);
        });
        builder.addCase(thunkAddEvidenceGoal.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });


        builder.addCase(thunkGetUserEvidences.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetUserEvidences.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.evidences = action.payload;
            setGenericState('evidence', state);
        });
        builder.addCase(thunkGetUserEvidences.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });


        builder.addCase(thunkUpdateEvidence.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkUpdateEvidence.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.eviSelected = action.payload;
            setGenericState('evidence', state);
        });
        builder.addCase(thunkUpdateEvidence.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });


        builder.addCase(thunkGetUbiEvidence.pending, state => {
            if (!state.loadingEvidence) state.loadingEvidence = true;
            state.errorLoadingEvidence = undefined;
        });
        builder.addCase(thunkGetUbiEvidence.fulfilled, (state, action) => {
            state.loadingEvidence = false;
            state.listPoints = action.payload;
            setGenericState('evidence', state);
        });
        builder.addCase(thunkGetUbiEvidence.rejected, (state, action) => {
            state.loadingEvidence = false;
            state.errorLoadingEvidence = action.payload;
        });
    }
});

export const {  removeEvidence, 
                resetEvidence, 
                setEvidence, 
                setPoints,
                setEvidences,
                resetPoints } = evidenceSlice.actions;
export const evidenceReducer = evidenceSlice.reducer;