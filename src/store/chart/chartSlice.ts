import { InitialStateChartInterface } from "@/interfaces/chart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const getInitialState = (): InitialStateChartInterface => {
    return {
        loading: false,
        error: undefined,
        data: [],
        type: "donut",
    };
};

export const chartSlice = createSlice({
    name: "chart",
    initialState: getInitialState,
    reducers: {
        setData: (state, action: PayloadAction<number[]>) => {
            state.data = action.payload;
        },
        setType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
    }
});

export const { setData, setType } = chartSlice.actions;
export const selectChart = (state: RootState) => state.chart.data;

export default chartSlice.reducer;
