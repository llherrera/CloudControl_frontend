import { InitialStateContentInterface } from "@/interfaces/content";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const getInitialState = (): InitialStateContentInterface => {
    return {
        loading: false,
        error: undefined,
        index: 0,
        listDepartment: [],
        id_plan: 0
    };
};

export const contentSlice = createSlice({
    name: "content",
    initialState: getInitialState,
    reducers: {
        selectOption: (state, action: PayloadAction<number>) => {
            state.index = action.payload;
        },
        setIdPlan: (state, action: PayloadAction<number>) => {
            state.id_plan = action.payload;
        }
    }
});

export const { selectOption, setIdPlan } = contentSlice.actions;
export const selectContent = (state: RootState) => state.content.index;

export default contentSlice.reducer;