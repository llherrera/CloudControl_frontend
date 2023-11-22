import { ErrorTypeInterface } from "./common";
import { PDTInterface, NivelInterface } from "./formInterfaces";

export interface InitialStatePlanInterface {
    loadingPlan: boolean;
    loadingColors: boolean;
    loadingNodes: boolean;
    loadingLevels: boolean;
    loadingNamesTree: boolean;
    errorLoadingPlan: ErrorTypeInterface;
    errorLoadingColors: ErrorTypeInterface;
    errorLoadingNodes: ErrorTypeInterface;
    errorLoadingLevels: ErrorTypeInterface;
    errorLoadingNamesTree: ErrorTypeInterface;
    plan?: PDTInterface;
    colorimeter: number[];
    color?: boolean;
    nodes: Node[];
    years: number[];
    yearSelect?: number;
    levels: NivelInterface[];
    indexLevel: number | undefined;
    parent: string | null;
    progressNodes: number[];
    financial: number[];
    namesTree: [string[]];
    radioBtn: string;
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