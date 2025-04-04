import { ErrorTypeInterface } from "./common";

export interface InitialStateReportInterface {
    report: ReportPDTInterface;
    reportLoading: boolean;
    reportError: ErrorTypeInterface;
}

export interface ReportPDTInterface {
    responsible: string;
    goalCode: string;
    goalDescription: string;
    percentExecuted: number[];
    planSpecific: string[];
    indicator: string;
    base: number;
    executed: number[];
    programed: number[];
}

export interface PropsGetReport {
    id_plan: number;
    type: number;
}

export interface ModalPDTProps {
    modalIsOpen: boolean,
    callback: React.Dispatch<React.SetStateAction<boolean>>,
    callback2?: ()=>void,
    data: ReportPDTInterface[]
}

export interface ModalProps {
    modalIsOpen: boolean
    callback: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface ModalProps2 extends ModalProps {
    index: number;
    id: number;
}

type Keys = 'plan' | 'meta' | 'result';
export interface ModalShareProps {
    [key: string]: boolean;
}

export interface ProntProps {
    readonly id_input: number;
    input: string;
    id_user: number;
}