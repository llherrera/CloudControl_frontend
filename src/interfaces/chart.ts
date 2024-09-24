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
    subCategories: string[];
    yearSelect: number;
    indexLocations: number;
    execSelect: string;
    cateSelect: string;
    subCateSelect: string;
    fieldSelect: string;
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

export interface PropsChart {
    type?: string;
    index: number;
}
export interface ComponentProps {
    index: number;
    children: JSX.Element;
    title: string;
    type?: string;
    callDataX: React.Dispatch<React.SetStateAction<string[] | number[]>>;
    callDataY: React.Dispatch<React.SetStateAction<number[][]>>;
    callTitle: React.Dispatch<React.SetStateAction<string>>;
}
export interface ChartData {
    name: string;
    y: number | number[];
}

export interface ResponseChartSecre {
    responsible: string;
    name: null | string;
    year: number;
    financial_execution: number;
    physical_execution: number;
    physical_programming: number;
}

export interface ResponseChartLocat {
    neighborhood: string;
    year: number;
    executed_resources: number;
    amount: number;
}

export interface ResponseChartEvide {
    code?: string;
    year: number;
    done: number;
    benefited_population_number: number;
    executed_resources: number;
}