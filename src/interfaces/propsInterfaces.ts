import { NivelInterface, NodoInterface } from "./formInterfaces";

export interface ButtonProps {
    lado : String,
    dir : String
}

export interface ButtonPlanProps {
    handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text: string;
    x: number;
    y: number;
}

export interface ColorProps {
    id: number;
    callback: (bool: boolean) => void;
}

export interface ContentProps {
    index: number;
    len: number;
    data: NivelInterface;
    callback: (index: number, padre: (string | null)) => void;
    Padre: (string | null);
    id: number;
    progress: boolean;
}

export interface InputProps {
    type: string;
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index:(number | void)) => void;
    isRequired?: boolean;
}

export interface NivelProps {
    id: string;
}

export interface NodoProps {
    index: number;
    id: number;
    Padre: string | null;
    callback: (index: number, Padre: (string | null)) => void;
}

export interface RegisterProps {
    id: number;
}

export interface ShowNodoProps {
    callback: (id: number, Padre: (string | null)) => void;
    callback2: (bool: boolean) => void;
    nodos: NodoInterface[];
    index: number;
    año: number;
    progress: boolean;
    colors: number[];
}

export interface ShowNodoUniProps {
    id: number;
    nodos: NodoInterface[];
    año: number;
    colors: number[];
}

export interface TableroProps {
    data: NivelInterface[];
}