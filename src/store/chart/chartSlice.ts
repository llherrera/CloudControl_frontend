import { InitialStateChartInterface, VisualizationRedux } from "@/interfaces/chart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setGenericState, getGenericState } from "@/utils";

const getInitialState = (): InitialStateChartInterface => {
    const chartState = getGenericState("chart");
    if (chartState) return chartState;
    return {
        loading: false,
        error: undefined,
        data: [],
        type: "donut",
        board: [],
        indexSelect: -1,
        categories: [],
        yearSelect: 0,
        execSelect: '',
        cateSelect: '',
    };
};

export const chartSlice = createSlice({
    name: "chart",
    initialState: getInitialState,
    reducers: {
        setData: (state, action: PayloadAction<number[]>) => {
            state.data = action.payload;
            setGenericState('chart', state);
        },
        setType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
            setGenericState('chart', state);
        },
        addBoard: (state, action: PayloadAction<VisualizationRedux[]>) => {
            state.board = action.payload;
            state.indexSelect = action.payload.length-1;
            setGenericState('chart', state);
        },
        removeItemBoard: (state, action: PayloadAction<number>) => {
            state.board.splice(action.payload, 1);
            setGenericState('chart', state);
        },
        setIndexSelect: (state, action: PayloadAction<number>) => {
            state.indexSelect = action.payload;
            setGenericState('chart', state);
        },
        setCategories: (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload;
            setGenericState('chart', state);
        },
        setYearSelect: (state, action: PayloadAction<number>) => {
            state.yearSelect = action.payload;
            setGenericState('chart', state);
        },
        setExecSelect: (state, action: PayloadAction<string>) => {
            state.execSelect = action.payload;
            setGenericState('chart', state);
        },
        setCateSelect: (state, action: PayloadAction<string>) => {
            state.cateSelect = action.payload;
            setGenericState('chart', state);
        },
    }
});

export const {
    setData,
    setType,
    addBoard,
    removeItemBoard,
    setIndexSelect,
    setCategories,
    setYearSelect,
    setExecSelect,
    setCateSelect } = chartSlice.actions;
export const selectChart = (state: RootState) => state.chart.data;

export default chartSlice.reducer;
