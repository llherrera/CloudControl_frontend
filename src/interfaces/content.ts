import { ErrorTypeInterface } from "./common";
import { UnitInterface, YearInterface, NodeInterface } from "./formInterfaces";

export interface ContentInterface {
    id: number;
}

export interface InitialStateContentInterface {
    loading: boolean;
    error: ErrorTypeInterface;
    index: number;
    list_department: string[];
    id_plan: number;
    mode: boolean;
    node?: NodeInterface;
    url_logo: string;
    url_logo_plan: string;
    reload: boolean;
    secretary: string;
    location: string;
    node_code: string;
    locs: EvidencesLocs[];
}

export interface GetUnitProps {
    id_plan: string;
    id_node: string;
}

export interface AddUnitProps {
    id_plan: string;
    id_node: string;
    unit: UnitInterface;
    years: YearInterface[];
    id_city?: number;
}

export interface EvidencesLocs {
    date: string;
    name: string;
    responsible: string;
    activitiesDesc: string;
    lat: number;
    lng: number;
    benefited_population_number: number;
    benefited_population: string;
    executed_resources: number;
    resource_font: string;
}