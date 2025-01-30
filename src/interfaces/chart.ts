import { ErrorTypeInterface } from "./common";
import { LocationInterface } from "./formInterfaces";

export interface ChartInterface {
    data: number[]
}

export interface InitialStateChartInterface {
    loading: boolean;
    error: ErrorTypeInterface;
    data: number[];
    type: string;
    board: VisualizationRedux[];
    boardInfo: ChartInfo[];
    indexSelect: number;
    categories: string[];
    subCategories: string[];
    yearSelect: number;
    indexLocations: number;
    execSelect: string;
    cateSelect: string;
    subCateSelect: string;
    fieldSelect: string;
    deleteAct: boolean;
}

export interface ChartInfo {
    yearSelect: number;
    execSelect: string;
    cateSelect: string;
    subCateSelect: string;
    categories_: string[];
    subCategories_: string[];
    field: string;
    fieldSelect: string;
    locations_: LocationInterface[];
    locations__: LocationInterface[];
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
    chart?: boolean;
    count?: boolean;
    map?: boolean;
}

export interface VisualizationRedux {
    id: string;
    title: string;
    value: string;
    info: ChartInfo;
    chart?: boolean;
    count?: boolean;
    map?: boolean;
}

export interface Item {
    value: string;
    name: string;
}

export interface PropsChart {
    type: string;
    info: ChartInfo;
    index: number;
}
export interface ComponentProps {
    index: number;
    children: JSX.Element;
    title: string;
    info: ChartInfo;
    type: string;
    callDataX: React.Dispatch<React.SetStateAction<string[] | number[]>>;
    callDataY: React.Dispatch<React.SetStateAction<number[][]>>;
    callTitle: React.Dispatch<React.SetStateAction<string>>;
    callMarkers?: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
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
    physical_progress: number;
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

export interface ResponseChartExecu {
    code: string;
    name: string;
    year: number;
    financial_execution: number;
    physical_progress: number;
}

export interface InfoSelecet {
    execSelect: string;
    yearSelect: number;
    cateSelect: string;
    subCateSelect: string;
    categories_: string[];
    subCategories_: string[];
    fieldSelect: string;
}

export interface PointsMarketDash {
    code: string;
    lat: number;
    lng: number;
    year: number;
    activitiesDesc: string;
    responsible: string;
    name: string;
    done: number;
    benefited_population_number: number;
    benefited_population: string;
    executed_resources: number;
    resource_font: string;
}