import { InitialStateContentInterface } from "@/interfaces/content";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setGenericState, getGenericState, removeGenericState } from "@/utils";

const getInitialState = (): InitialStateContentInterface => {
    const contentState = getGenericState('content');
    if (contentState) return contentState;
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
            setGenericState('content', state);
        },
        setIdPlan: (state, action: PayloadAction<number>) => {
            state.id_plan = action.payload;
            setGenericState('content', state);
        }
    }
});

export const { selectOption, setIdPlan } = contentSlice.actions;
export const selectContent = (state: RootState) => state.content.index;

export default contentSlice.reducer;