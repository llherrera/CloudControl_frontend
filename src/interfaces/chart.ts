import { ErrorTypeInterface } from "./common";

export interface ChartInterface {
    data: number[]
}

export interface InitialStateChartInterface {
    loading: boolean;
    error: ErrorTypeInterface;
    data: number[];
    type: string;
    board: VisualizationRedux[];
    indexSelect: number;
    categories: string[];
    yearSelect: number;
    execSelect: string;
    cateSelect: string;
}

export interface Field {
    id: string;
    name: string;
    value: string;
    title: string;
}

export interface Visualization {
    id: string;
    icon: JSX.Element;
    title: string;
    value: string;
    chart: boolean;
    count: boolean;
}

export interface VisualizationRedux {
    id: string;
    title: string;
    value: string;
    chart: boolean;
    count: boolean;
}

export interface Item {
    value: string;
    name: string;
}