import { ErrorTypeInterface } from "./common";
import { PDTInterface, NivelInterface } from "./formInterfaces";

export interface InitialStatePlanInterface {
    loading: boolean;
    loadingColors: boolean;
    loadingNodes: boolean;
    loadingLevels: boolean
    errorLoading: ErrorTypeInterface;
    errorColors: ErrorTypeInterface;
    errorNodes: ErrorTypeInterface;
    errorLevels: ErrorTypeInterface;
    plan?: PDTInterface;
    colorimeter: number[];
    color?: boolean;
    nodes: Node[];
    years: number[];
    yearSelect?: number;
    levels: NivelInterface[];
    indexLevel: number | undefined;
    parent: string | null;
}

export interface GetNodeProps {
    id_level: number;
    parent: (string | null);
}

export interface Node {
    id_nodo: string;
    Nombre: string;
    Descripcion: string;
    Padre: number | null;
    id_nivel: number;
}

export interface AddColorsProps {
    id_plan: number;
    colors: number[];
}

export interface Nivel {
    id_plan: number;
    Nombre: string;
    Descripcion: string;
    id_nivel: number;
}