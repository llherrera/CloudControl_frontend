export interface Porcentaje {
    progress: number;
    year: number;
    physical_programming: number;
    financial_execution: number;
}

export interface PesosNodos {
    name: string;
    id_node: string;
    weight: number;
    parent: string | null;
    percents: Porcentaje[] | null;
}

export interface YearDetail {
    id_node: string;
    year: number;
    code: string;
    description: string;
    indicator: string;
    base_line: number;
    goal: number;
    responsible: string|null;
    physical_programming: number;
    physical_execution: number;
    financial_execution: number;
}