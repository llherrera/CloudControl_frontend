import { InitialStateContentInterface } from "@/interfaces/content";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { EvidencesLocs, NodeInterface } from "@/interfaces";
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
        projectPage: 5,
        mode: false,
        node: undefined,
        url_logo: '',
        url_logo_plan: '',
        reload: false,
        secretary: 'void',
        location: '',
        node_code: '',
        locs: [],
        isFullHeight: false,
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
            setGenericState('content', state);
        },
        setLogo(state, action: PayloadAction<string>) {
            state.url_logo = action.payload;
        },
        setLogoPlan(state, action: PayloadAction<string>) {
            state.url_logo_plan = action.payload;
        },
        resetContent: () => {
            removeGenericState('content');
            return getInitialState();
        },
        setReload: (state, action: PayloadAction<boolean>) => {
            state.reload = action.payload;
        },
        setSecretary: (state, action: PayloadAction<string>) => {
            state.secretary = action.payload;
            setGenericState('content', state);
        },
        setLocation: (state, action: PayloadAction<string>) => {
            state.location = action.payload;
        },
        setCode: (state, action: PayloadAction<string>) => {
            state.node_code = action.payload;
            setGenericState('content', state);
        },
        setLocs: (state, action: PayloadAction<EvidencesLocs[]>) => {
            state.locs = action.payload;
            setGenericState('content', state);
        },
        setProjectPage: (state, action: PayloadAction<number>) => {
            state.projectPage = action.payload;
            setGenericState('content', state);
        },
        setIsFullHeight: (state, action: PayloadAction<boolean>) => {
            state.isFullHeight = action.payload;
            setGenericState('content', state);
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
    setLogoPlan,
    setSecretary,
    setLocation,
    setCode,
    setLocs,
    setProjectPage,
    setIsFullHeight } = contentSlice.actions;
export const selectContent = (state: RootState) => state.content.index;

export default contentSlice.reducer;