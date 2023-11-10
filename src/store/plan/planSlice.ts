import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStatePlanInterface } from "@/interfaces";

import { thunkGetPDTid, thunkAddPDT, 
    thunkGetColors, thunkAddColors,
    thunkGetNodes, thunkUpdateYears, thunkGetLevelsById } from "./thunks";

const getInitialState = (): InitialStatePlanInterface => {
    return {
        loading: false,
        loadingColors: false,
        loadingNodes: false,
        loadingLevels: false,
        errorLoading: undefined,
        errorColors: undefined,
        errorNodes: undefined,
        errorLevels: undefined,
        plan: undefined,
        colorimeter: [],
        color: undefined,
        nodes: [],
        years: [],
        yearSelect: undefined,
        levels: [],
        indexLevel: undefined,
        parent: null
    };
};

export const planSlice = createSlice({
    name: "plan",
    initialState: getInitialState,
    reducers: {
        selectYear: (state, action: PayloadAction<number>) => {
            state.yearSelect = action.payload
        },
        incrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload
        },
        decrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload
        },
        setParent: (state, action: PayloadAction<string | null>) => {
            state.parent = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(thunkGetPDTid.pending, state => {
            if (!state.loading) state.loading = true;
            state.errorLoading = undefined;
        });
        builder.addCase(thunkGetPDTid.fulfilled, (state, action) => {
            state.loading = false;
            state.plan = action.payload;
        });
        builder.addCase(thunkGetPDTid.rejected, (state, action) => {
            state.loading = false;
            state.errorLoading = action.payload;
        });


        builder.addCase(thunkAddPDT.pending, state => {
            if (!state.loading) state.loading = true;
            state.errorLoading = undefined;
        });
        builder.addCase(thunkAddPDT.fulfilled, (state, action) => {
            state.loading = false;
            state.plan = action.payload;
        });
        builder.addCase(thunkAddPDT.rejected, (state, action) => {
            state.loading = false;
            state.errorLoading = action.payload;
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 404:
                        alert("Usuario o contraseña incorrecto.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
            }
        });

        builder.addCase(thunkAddColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorColors = undefined;
        });
        builder.addCase(thunkAddColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
        });
        builder.addCase(thunkAddColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorColors = action.payload;
        });

        builder.addCase(thunkGetColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorColors = undefined;
        });
        builder.addCase(thunkGetColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
        });
        builder.addCase(thunkGetColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorColors = action.payload;
        });


        builder.addCase(thunkGetNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorNodes = undefined;
        });
        builder.addCase(thunkGetNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            state.nodes = action.payload;
        });
        builder.addCase(thunkGetNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorNodes = action.payload;
        });


        builder.addCase(thunkUpdateYears, (state, action) => {
            state.years = action.payload;
        })
        //builder.addCase()


        builder.addCase(thunkGetLevelsById.pending, state => {
            state.errorLoading = undefined;
        });
        builder.addCase(thunkGetLevelsById.fulfilled, (state, action) => {
            state.levels = action.payload;
        });
        builder.addCase(thunkGetLevelsById.rejected, (state, action) => {
            state.errorLoading = action.payload;
        });
    }
});
export const { selectYear, incrementLevelIndex, decrementLevelIndex, setParent } = planSlice.actions;
export default planSlice.reducer;