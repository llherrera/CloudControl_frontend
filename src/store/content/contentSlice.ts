import { InitialStateContentInterface } from "@/interfaces/content";
import { createSlice } from "@reduxjs/toolkit";

const getInitialState = (): InitialStateContentInterface => {
  return {
    loading: false,
    error: undefined,
    index: 0,
  };
};

export const contentSlice = createSlice({
    name: "content",
    initialState: getInitialState,
    reducers: {},
    extraReducers: builder => {

    }
});

export default contentSlice.reducer;