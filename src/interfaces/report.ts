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
    base: string;
    executed: number[];
    programed: number[];
}

export interface PropsGetReport {
    id_plan: number;
    type: number;
}