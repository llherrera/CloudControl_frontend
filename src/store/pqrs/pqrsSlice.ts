import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
    InitialStatePQRSInterface } from "@/interfaces";
import {
    setGenericState, getGenericState,
    removeGenericState, notify } from "@/utils";


const getInitialState = (): InitialStatePQRSInterface => {
    const planState = getGenericState('plan');
    if (planState) return planState;
    return {
        loadingPQRS: false,
        errorLoadingPQRS: undefined,
        pqrs: undefined,
    };
};

export const planSlice = createSlice({
    name: "plan",
    initialState: getInitialState,
    reducers: {},
    extraReducers: builder => {}
});

export const {  } = planSlice.actions;
export default planSlice.reducer;