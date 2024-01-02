import { ErrorTypeInterface } from "./common";
import { 
    PDTInterface, 
    NivelInterface, 
    NodoInterface, 
    LocationInterface } from "./formInterfaces";
import { Coordinates } from "./ubication";
import { Secretary } from "./secretary";

export interface InitialStatePlanInterface {
    loadingPlan: boolean;
    loadingColors: boolean;
    loadingNodes: boolean;
    loadingLevels: boolean;
    loadingNamesTree: boolean;
    loadingLogo: boolean;
    loadingSecretaries: boolean;
    loadingReport: boolean;
    loadingLocations: boolean;
    errorLoadingPlan: ErrorTypeInterface;
    errorLoadingColors: ErrorTypeInterface;
    errorLoadingNodes: ErrorTypeInterface;
    errorLoadingLevels: ErrorTypeInterface;
    errorLoadingNamesTree: ErrorTypeInterface;
    errorLoadingLogo: ErrorTypeInterface;
    errorLoadingSecretaries: ErrorTypeInterface;
    errorLoadingLocations: ErrorTypeInterface;
    plan?: PDTInterface;
    colorimeter: number[];
    color?: boolean;
    nodes: NodoInterface[];
    nodesReport: Node[];
    years: number[];
    yearSelect?: number;
    levels: NivelInterface[];
    indexLevel: number | undefined;
    parent: string | null;
    progressNodes: number[];
    financial: number[];
    namesTree: [string[]];
    radioBtn: string;
    secretaries: Secretary[];
    locations: LocationInterface[];
    planLocation: Coordinates | undefined
}

export interface GetNodeProps {
    id_level: number;
    parent: (string | null);
}

export interface Node {
    id_node: string;
    name: string;
    description: string;
    parent: string | null;
    id_level: number;
    weight: number;
}

export interface AddColorsProps {
    id_plan: number;
    colors: number[];
}

export interface Nivel {
    id_plan: number;
    name: string;
    description: string;
    id_level: number;
}

export interface ExcelPlan {
    Descripcion: string;
    Id: string;
    Indicador: string;
    LineaBase: number | null;
    Meta: number | null;
    Niveles: string;
    Nodos: string;
    Peso: number;
    ProgramadoAño1: number | null;
    ProgramadoAño2: number | null;
    ProgramadoAño3: number | null;
    ProgramadoAño4: number | null;
    Responsable: string | null;
}

export interface ExcelFinancial {
    IdNodo: string;
    Año1: number | null;
    Año2: number | null;
    Año3: number | null;
    Año4: number | null;
}

export interface UpdateWProps {
    ids: string[];
    weights: number[];
}