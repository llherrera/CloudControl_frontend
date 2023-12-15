import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStateUnitInterface, UnitInterface } from "@/interfaces";

import { thunkGetUnit, thunkAddUnit } from "./thunks";

const getInitialState = (): InitialStateUnitInterface => {
    return {
        loadingUnit: false,
        errorLoadingUnit: undefined,
        unit: {
            code: "",
            description: "",
            indicator: "",
            base: 0,
            goal: 0,
            responsible: "",
            years: [
                {
                    year: 0,
                    programed: 0,
                    phisicalExecuted: 0,
                    finalcialExecuted: 0
                },
                {
                    year: 0,
                    programed: 0,
                    phisicalExecuted: 0,
                    finalcialExecuted: 0
                },
                {
                    year: 0,
                    programed: 0,
                    phisicalExecuted: 0,
                    finalcialExecuted: 0
                },
                {
                    year: 0,
                    programed: 0,
                    phisicalExecuted: 0,
                    finalcialExecuted: 0
                },
            ]
        
        },
    };
};

export const unitSlice = createSlice({
    name: "unit",
    initialState: getInitialState,
    reducers: {
        setUnit: (state, action: PayloadAction<UnitInterface>) => {
            state.unit = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(thunkGetUnit.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkGetUnit.fulfilled, (state, action) => {
            state.loadingUnit = false;
            if (action.payload === null) return;
            state.unit = action.payload;
        });
        builder.addCase(thunkGetUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });


        builder.addCase(thunkAddUnit.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkAddUnit.fulfilled, (state, action) => {
            state.loadingUnit = false;
            state.unit = action.payload;
        });
        builder.addCase(thunkAddUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });
    }
})

export const { setUnit } = unitSlice.actions;
export default unitSlice.reducer;