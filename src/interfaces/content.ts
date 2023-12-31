import { ErrorTypeInterface } from "./common";
import { UnitInterface, YearInterface, NodoInterface } from "./formInterfaces";

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
    node?: NodoInterface;
    url_logo: string;
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
    id_city: number;
}