import { Nodo } from "./nodo";

export interface ShowNodoProps {
    callback: (id: number, Padre: (string | null)) => void;
    callback2: (bool: boolean) => void;
    nodos: Nodo[];
    index: number;
    año: number;
    progress: boolean;
    colors: number[];
}

export interface ShowNodoUniProps {
    id: number;
    nodos: Nodo[];
    año: number;
    colors: number[];
}