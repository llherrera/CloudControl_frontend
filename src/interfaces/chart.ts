import { ErrorTypeInterface } from "./common";

export interface ChartInterface {
    data: number[]
}

export interface InitialStateChartInterface {
    loading: boolean;
    error: ErrorTypeInterface;
    data: number[];
    type: string;
}