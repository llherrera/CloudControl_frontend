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
    readonly id_plan: number;
    name: string;
    department: string;
    municipality: string;
    id_municipality: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_link_plan?: string;
    logo_link_city?: string;
    deadline: null | string;
    uuid: string;
}

export interface LevelInterface {
    id_level?: number;
    name: string;
    description: string;
}

export interface NodeInterface {
    id_node: string;
    code: string;
    name: string;
    description: string;
    parent: (string | null);
    id_level: number;
    weight: number;
    responsible?: (string | null);
}

export interface UnitInterface {
    code: string,
    id_node: string,
    description: string,
    indicator: string,
    base: number,
    goal: number,
    responsible: string,
    years: YearInterface[],
    hv_indicator: string
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
    name?: string;
    responsible?: string;
}

export interface ExecutionInterface {
    year: Date;
    code: string;
    readonly id_node: string;
    physical_execution: number;
    modified_execution: number;
    modified_date: Date;
    id_user: number;
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
    neighborhood = 'Barrio',
    vereda = 'Vereda',
    center = 'Centro poblado',
}
export interface LocationInterface {
    id_plan: number;
    type: string;
    name: string;
    lat?: number;
    lng?: number;
    belongs?: string;
}

export interface PQRSInform {
    id_plan: number;
    tipo_solicitante: string;
	tipo_identificacion: string; 
	numero_identificacion: number;
	razon_social: string;
	primer_nombre: string;
	segundo_nombre?: string;
	primer_apellido: string;
	segundo_apellido: string;
	email: string;
	telefono: number
	direccion: string;
	barrio: string;
	ciudad: string;
	departamento: string;
	pais: string;
    fecha: Date;
    tipo_peticion: string;
    secretaria: string;
    asunto: string;
    peticion: string;
}