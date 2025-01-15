import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStateUnitInterface, UnitInterface } from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState,
    notify } from "@/utils";

import { thunkGetUnit, thunkAddUnit, thunkUpdateUnit, thunkUpdateIndicator,
    thunkUpdateExecution, thunkAddUnitNodeResult,thunkDenegateExecution } from "./thunks";

const getInitialState = (): InitialStateUnitInterface => {
    const unitState = getGenericState("unit");
    if (unitState) return unitState;
    return {
        loadingUnit: false,
        loadingUnitResult: false,
        errorLoadingUnit: undefined,
        errorLoadingUnitResult: undefined,
        unit: {
            code: "",
            id_node: '',
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
            ],
            hv_indicator: ''
        },
        unitResult: undefined
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
            //state.unit = action.payload;
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
            //state.unit = action.payload;
            setGenericState('unit', state);
        });
        builder.addCase(thunkUpdateUnit.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });
        
        
        builder.addCase(thunkUpdateIndicator.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkUpdateIndicator.fulfilled, (state, action) => {
            state.loadingUnit = false;
            state.unit.hv_indicator = action.payload;
            setGenericState('unit', state);
        });
        builder.addCase(thunkUpdateIndicator.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
        });


        builder.addCase(thunkUpdateExecution.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkUpdateExecution.fulfilled, state => {
            //state.plan!.deadline = action.meta.arg.date
            state.loadingUnit = false;
            notify('Ejecucion actualizada', 'success');
        });
        builder.addCase(thunkUpdateExecution.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
            notify(action.payload?.error_description ?? 'Ha ocurrido un error, vuelva a intertarlo más tarde', 'error');
        });


        builder.addCase(thunkDenegateExecution.pending, state => {
            if (!state.loadingUnit) state.loadingUnit = true;
            state.errorLoadingUnit = undefined;
        });
        builder.addCase(thunkDenegateExecution.fulfilled, state => {
            //state.plan!.deadline = action.meta.arg.date
            state.loadingUnit = false;
            notify('Ejecucion rechazada', 'warning');
        });
        builder.addCase(thunkDenegateExecution.rejected, (state, action) => {
            state.loadingUnit = false;
            state.errorLoadingUnit = action.payload;
            notify(action.payload?.error_description ?? 'Ha ocurrido un error, vuelva a intertarlo más tarde', 'error');
        });


        builder.addCase(thunkAddUnitNodeResult.pending, state => {
            if (!state.loadingUnitResult) state.loadingUnitResult = true;
            state.errorLoadingUnitResult = undefined;
        });
        builder.addCase(thunkAddUnitNodeResult.fulfilled, state => {
            state.loadingUnitResult = false;
            notify('Meta añadida', 'success');
        });
        builder.addCase(thunkAddUnitNodeResult.rejected, (state, action) => {
            state.loadingUnitResult = false;
            state.errorLoadingUnitResult = action.payload;
            notify(action.payload?.error_description ?? 'Ha ocurrido un error, vuelva a intertarlo más tarde', 'error');
        });
    }
})

export const { setUnit, resetUnit } = unitSlice.actions;
export default unitSlice.reducer;