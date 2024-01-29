import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStateUnitInterface, UnitInterface } from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState } from "@/utils";

import { thunkGetUnit, thunkAddUnit, thunkUpdateUnit } from "./thunks";

const getInitialState = (): InitialStateUnitInterface => {
    const unitState = getGenericState("unit");
    if (unitState) return unitState;
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
                    physical_programming: 0,
                    physical_execution: 0,
                    financial_execution: 0
                },
                {
                    year: 0,
                    physical_programming: 0,
                    physical_execution: 0,
                    financial_execution: 0
                },
                {
                    year: 0,
                    physical_programming: 0,
                    physical_execution: 0,
                    financial_execution: 0
                },
                {
                    year: 0,
                    physical_programming: 0,
                    physical_execution: 0,
                    financial_execution: 0
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
            setGenericState('unit', state);
        },
        resetUnit: (state) => {
            removeGenericState('unit');
            return getInitialState();
        }
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
            setGenericState('unit', state);
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
            setGenericState('unit', state);
        });
        builder.addCase(thunkAddUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });


        builder.addCase(thunkUpdateUnit.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkUpdateUnit.fulfilled, (state, action) => {
            state.loadingUnit = false;
            state.unit = action.payload;
            setGenericState('unit', state);
        });
        builder.addCase(thunkUpdateUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });
    }
})

export const { setUnit, resetUnit } = unitSlice.actions;
export default unitSlice.reducer;