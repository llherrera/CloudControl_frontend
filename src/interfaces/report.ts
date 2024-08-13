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

