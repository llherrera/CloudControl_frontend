import { ErrorTypeInterface } from "./common";
import { PDTInterface, NivelInterface, NodoInterface } from "./formInterfaces";
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
    errorLoadingPlan: ErrorTypeInterface;
    errorLoadingColors: ErrorTypeInterface;
    errorLoadingNodes: ErrorTypeInterface;
    errorLoadingLevels: ErrorTypeInterface;
    errorLoadingNamesTree: ErrorTypeInterface;
    errorLoadingLogo: ErrorTypeInterface;
    errorLoadingSecretaries: ErrorTypeInterface;
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
    url?: string;
    secretaries: string[];
}

export interface GetNodeProps {
    id_level: number;
    parent: (string | null);
}

export interface Node {
    id_nodo: string;
    Nombre: string;
    Descripcion: string;
    Padre: string | null;
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

export interface SecretaryResponse {
    Nombre: string;
}