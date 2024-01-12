import { ChangeEventHandler } from "react";
import { EvidenceInterface, LocationInterface, PDTInterface } from "./formInterfaces";

export interface ContentProps {
    id: number;
}

export interface NodeListProps {
    id: number;
}

export interface BackBtnProps {
    handle: () => void;
    id: number;
}

export interface GraphProps {
    dataValues: number[];
}

export interface TimeLineProps {
    year_progress: number[];
    years_progress: number;
}

export interface BtnProps {
    text: string;
    src?: string;
    inside: boolean;
    icon?: JSX.Element;
    onClick: () => void;
    bgColor?: string;
    textColor?: string;
}

export interface BtnPlanProps {
    handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text: string;
    x: number;
    y: number;
}

export interface EvidenceDetailProps {
    evi: EvidenceInterface;
    index: number;
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
    components: React.ReactNode[];
}

export interface InputProps {
    type: string;
    label: string;
    id: string;
    name: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index:(number | void)) => void;
    isRequired?: boolean;
}

export interface SelectProps {
    id: string;
    label: string;
    name: string;
    options: any[];
    onChange: ChangeEventHandler<HTMLSelectElement>;
    optionLabelFn?: (option: any, index?: number) => any;
    isRequired?: boolean;
    disabled?: boolean;
}

export interface NavBarProps {
    buttons: BtnProps[];
    bgColor?: string;
}

export interface PDTPageProps {
    data: PDTInterface[];
    rol: string;
}

export interface PopoverProps {
    callback: Function;
    index: number;
    item: LocationInterface;
}