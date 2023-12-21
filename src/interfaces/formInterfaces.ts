export interface RegisterInterface {
    username: string;
    lastname: string;
    email: string;
    password: string;
    confirm_password: string;
    rol: string;
}

export interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface PDTInterface {
    id_plan?: number;
    name: string;
    department: string;
    municipaly: string;
    description: string;
    start_date: string;
    end_date: string;
}

export interface NivelInterface {
    id_level?: number;
    name: string;
    description: string;
}

export interface NodoInterface {
    id_node: string;
    name: string;
    description: string;
    parent: (string | null);
    id_level: number;
    weight: number;
}

export interface UnitInterface {
    code: string,
    description: string,
    indicator: string,
    base: number,
    goal: number,
    responsible: string,
    years: YearInterface[]
}

export interface YearInterface {
    year: number;
    physical_programming: number;
    physical_execution: number;
    financial_execution: number;
}

export interface EvidenceInterface {
    id_evidence: number;
    code: string;
    date: string;
    activitiesDesc: string;
    unit: string;
    amount: number;
    commune: string;
    neighborhood: string;
    corregimiento: string;
    vereda: string;
    benefited_population: string;
    benefited_population_number: number;
    executed_resources: number;
    resources_font: string;
    name_file: string;
    place: string;
    date_file: string;
    file_link: string;
    locations: UbicationDB[];
    state: number;
}

export interface LoginProps {
    username: string
    password: string
}

export interface UbicationDB {
    id_evi_loc: number;
    code: string;
    lat: number;
    lng: number;
}
export enum locationTypes {
    neighborhood = 'Barrio / Vereda',
    commune = 'Comuna / Corregimiento',
}
export interface LocationInterface {
    id_plan: number
    type: locationTypes
    name: string;
    lat?: number
    lng?: number
}
