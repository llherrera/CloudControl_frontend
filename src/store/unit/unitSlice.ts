import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStateUnitInterface } from "@/interfaces";

import { thunkGetUnit } from "./thunks";

const getInitialState = (): InitialStateUnitInterface => {
    return {
        loadingUnit: false,
        errorLoadingUnit: undefined,
        unit: undefined,
    };
};

export const unitSlice = createSlice({
    name: "unit",
    initialState: getInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(thunkGetUnit.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkGetUnit.fulfilled, (state, action) => {
            state.loadingUnit = false;
            state.unit = action.payload;
        });
        builder.addCase(thunkGetUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });
    }
})

export default unitSlice.reducer;