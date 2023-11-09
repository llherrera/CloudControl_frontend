import { createSlice } from "@reduxjs/toolkit";

import { InitialStatePlanInterface } from "@/interfaces";

import { thunkGetPDTid, thunkAddPDT, thunkGetColors } from "./thunks";

const getInitialState = (): InitialStatePlanInterface => {
    return {
        loading: false,
        errorLoading: undefined,
        plan: {
            id_plan: 0,
            Nombre: "",
            Alcaldia: "",
            Municipio: "",
            Descripcion: "",
            Fecha_inicio: new Date().toISOString(),
            Fecha_fin: new Date().toISOString(),
        },
        colorimeter: [],
        color: false,
    };
};

export const planSlice = createSlice({
    name: "plan",
    initialState: getInitialState,
    reducers: {},
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


        builder.addCase(thunkGetColors.pending, state => {
            if (!state.loading) state.loading = true;
            state.errorLoading = undefined;
        });
        builder.addCase(thunkGetColors.fulfilled, (state, action) => {
            state.loading = false;
            state.color = true;
            state.colorimeter = action.payload;
        });
        builder.addCase(thunkGetColors.rejected, (state, action) => {
            state.loading = false;
            state.color = false;
            state.errorLoading = action.payload;
        });
    }
});
export default planSlice.reducer;