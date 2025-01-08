import { ChangeEventHandler } from "react";
import {
    EvidenceInterface,
    LocationInterface,
    PDTInterface,
    ExecutionInterface,
    NodeInterface, 
    UnitNodeResultInterface} from "./formInterfaces";

export interface IdProps {
    id: number;
}

export interface BackBtnProps {
    className?: string;
    handle: (param: any) => void;
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

export interface ExecutedProps {
    ex: ExecutionInterface;
    index: number;
};

export interface LevelFormProps {
    id: string;
}

export interface NodeFormProps {
    index: number;
    id: number;
}

export interface FrameProps {
    children: JSX.Element | JSX.Element[];
}

export interface HeaderProps {
    children: JSX.Element | JSX.Element[];
}

export interface InputProps {
    type: string;
    label: string;
    id: string;
    name: string;
    value?: string | number;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index:(number | void)) => void;
    isRequired?: boolean;
    classname?: string;
    center: boolean;
}

export interface SelectInputProps {
    label: string;
    id: string;
    name: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>, index:(number | void)) => void;
    isRequired?: boolean;
    disabled?: boolean;
    classname?: string;
    center: boolean;
    options: string[] | number[];
}

export interface InputPropChild {
    label: string;
    id: string;
    classname?: string;
    center: boolean;
    children: JSX.Element;
}

export interface SelectProps {
    id: string;
    label: string;
    name: string;
    value?: string | number;
    options: string[] | number[];
    onChange: ChangeEventHandler<HTMLSelectElement>;
    isRequired?: boolean;
    disabled?: boolean;
    classname?: string;
}

export interface SelectOpts {
    opts: {
        label: string;
        value: string;
    }[];
    value: string;
    callback: React.Dispatch<React.SetStateAction<string>>;
    classname?: string;
}

export interface SelectDetsOps {
    callbackDept: (name: string, code: string) => void;
    callbackMuni: (name: string, code: string) => void;
}

export interface NavBarProps {
    children: JSX.Element | JSX.Element[];
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

export interface LocFormProps {
    locs?: LocationInterface[];
    loc?: LocationInterface;
}

export interface PaginationProps {
    array: Array<any>;
    page: number;
    callback: (page: number) => void;
}

export interface DrawerProps {
    children: JSX.Element[];
    height?: string;
}

export interface ListItemProps {
    title: string;
    page: number;
    index: number;
    setPage: (page: number) => void;
    setTitle?: (title: string) => void;
}

export interface DropdownProps {
    title: string;
    children: JSX.Element | JSX.Element[];
    m: string;
    bg?: string;
    textColor?: string;
}

export interface EvidenceProps {
    evidence: EvidenceInterface;
};

export interface UnitFrameProps {
    children: (JSX.Element | null)[] | JSX.Element
}

export interface PQRSBtnProps {
    title: string;
    desc: string;
    navigate: () => void;
}

export interface PropsModalSettingProy {
    index: number;
    id: number;
}

export interface PlotOpt {
    [key:string]:{}
}

export interface PropsMessage {
    children: string;
    callback: (msg: string) => void;
    className?: string;
}

export interface PropsCallback {
    callback: (data: any) => void;
}

export interface PropsModalActionPlan {
    i: number;
    className?: string;
    bclassName?: string;
}

export interface PropsInputLabel {
    name: string;
    label: string;
    id: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {[key: string]: string};
    className?: string;
}

export interface PropsInputTable {
    name: string;
    type: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {[key: string]: string};
    className?: string;
}

export interface UnitInfoProps {
    unit?: UnitNodeResultInterface
}