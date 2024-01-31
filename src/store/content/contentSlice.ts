import { InitialStateContentInterface } from "@/interfaces/content";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { NodeInterface } from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState } from "@/utils";

const getInitialState = (): InitialStateContentInterface => {
    const contentState = getGenericState('content');
    if (contentState) return contentState;
    return {
        loading: false,
        error: undefined,
        index: 0,
        list_department: [],
        id_plan: 0,
        mode: false,
        node: undefined,
        url_logo: '',
        url_logo_plan: '',
        reload: false,
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
        },
        setMode(state, action: PayloadAction<boolean>) {
            state.mode = action.payload;
        },
        setNode(state, action: PayloadAction<NodeInterface>) {
            state.node = action.payload;
        },
        setLogo(state, action: PayloadAction<string>) {
            state.url_logo = action.payload;
        },
        setLogoPlan(state, action: PayloadAction<string>) {
            state.url_logo_plan = action.payload;
        },
        resetContent: (state) => {
            removeGenericState('content');
            return getInitialState();
        },
        setReload: (state, action: PayloadAction<boolean>) => {
            state.reload = action.payload;
        },
    }
});

export const { 
    selectOption, 
    setIdPlan, 
    setMode,
    setNode,
    setLogo,
    resetContent,
    setReload,
    setLogoPlan } = contentSlice.actions;
export const selectContent = (state: RootState) => state.content.index;

export default contentSlice.reducer;