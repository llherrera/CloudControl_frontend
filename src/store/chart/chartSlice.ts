import { InitialStateChartInterface, VisualizationRedux, ChartInfo, LocationInterface, InfoSelecet } from "@/interfaces";
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
        boardInfo: [],
        indexSelect: -1,
        categories: [],
        subCategories: [],
        yearSelect: 0,
        indexLocations: 0,
        execSelect: '',
        cateSelect: '',
        subCateSelect: '',
        fieldSelect: '',
        deleteAct: false
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
        setBoardInfo: (state, action: PayloadAction<{index: number, info: ChartInfo}>) => {
            const { index, info } = action.payload;
            if (index < 0 || index >= state.board.length) return;
            state.board[index].info = info;
            state.indexSelect = index;
            setGenericState('chart', state);
        },
        setBoardInfoCamp: (state, action: PayloadAction<
            {
                index: number,
                name: keyof ChartInfo,
                value: (number | string | string[] | LocationInterface[] | Map<LocationInterface, LocationInterface[]>)
            }
        >) => {
            const { index, name, value } = action.payload;
            if (index < 0 || index >= state.board.length) return;
            if (name in state.board[index].info) {
                (state.board[index].info as any)[name] = value;
            }
            setGenericState('chart', state);
        },
        setInfoBoard: (state, action: PayloadAction<{index: number, info: ChartInfo}>) => {
            state.boardInfo[action.payload.index] = action.payload.info;
            setGenericState('chart', state);
        },
        removeItemBoard: (state, action: PayloadAction<number>) => {
            state.board.splice(action.payload, 1);
            state.deleteAct = false;
            state.indexSelect = -1;
            setGenericState('chart', state);
        },
        setIndexSelect: (state, action: PayloadAction<number>) => {
            state.indexSelect = action.payload;
            setGenericState('chart', state);
        },
        setInfoSelect: (state, action: PayloadAction<
            {
                index: number,
                deleteAct: boolean,
                data: InfoSelecet
            }
        >) => {
            const { index, deleteAct, data } = action.payload;
            state.indexSelect = index;
            state.execSelect = data.execSelect;
            state.yearSelect = data.yearSelect;
            state.cateSelect = data.cateSelect;
            state.subCateSelect = data.subCateSelect;
            state.categories = data.categories_;
            state.subCategories = data.subCategories_;
            state.fieldSelect = data.fieldSelect;
            if (deleteAct) {
                state.deleteAct = deleteAct;
            }
        },
        setCategories: (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload;
            setGenericState('chart', state);
        },
        setSubCategories: (state, action: PayloadAction<string[]>) => {
            state.subCategories = action.payload;
            setGenericState('chart', state);
        },
        setYearSelect: (state, action: PayloadAction<number>) => {
            state.yearSelect = action.payload;
            setGenericState('chart', state);
        },
        setIndexLocations: (state, action: PayloadAction<number>) => {
            state.indexLocations = action.payload;
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
        setSubCateSelect: (state, action: PayloadAction<string>) => {
            state.subCateSelect = action.payload;
            setGenericState('chart', state);
        },
        setFieldSelect: (state, action: PayloadAction<string>) => {
            state.fieldSelect = action.payload;
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
    setSubCategories,
    setYearSelect,
    setExecSelect,
    setCateSelect,
    setFieldSelect,
    setSubCateSelect,
    setIndexLocations,
    setInfoBoard,
    setBoardInfo,
    setBoardInfoCamp,
    setInfoSelect } = chartSlice.actions;
export const selectChart = (state: RootState) => state.chart.data;

export default chartSlice.reducer;
