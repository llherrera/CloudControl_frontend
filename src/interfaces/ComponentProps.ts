import { EvidenceInterface, NodoInterface, PDTInterface } from "./formInterfaces";

export interface ContentProps {
    id: number;
    progress: boolean;
}

export interface NodeListProps {
    id: number;
    nodes: NodoInterface[];
}

export interface BackBtnProps {
    handle: () => void;
    id: number;
}

export interface GraphProps {
    dataValues: number[];
}

export interface TimeLineProps {
    yearProgress: number[];
    yearsProgress: number;
}

export interface BtnProps {
    text: string,
    src?: string,
    inside: boolean,
    icon?: JSX.Element,
    onClick: () => void,
    bgColor?: string,
    textColor?: string
}

export interface BtnPlanProps {
    handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text: string;
    x: number;
    y: number;
}

export interface EvidenceDetailProps {
    evi: EvidenceInterface,
    index: number
};

export interface ColorFromProps {
    id: number;
}

export interface LevelFormProps {
    id: string;
}

export interface NodeFormProps {
    index: number;
    id: number;
}

export interface RegisterFormProps {
    id: number;
}

export interface FrameProps {
    data: React.ReactNode;
}

export interface HeaderProps {
    componentes: React.ReactNode[]
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

export interface NavBarProps {
    buttons: BtnProps[],
    bgColor?: string
}

export interface PDTPageProps {
    data: PDTInterface[],
    rol: string
}