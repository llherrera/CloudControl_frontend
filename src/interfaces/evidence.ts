import { ErrorTypeInterface } from "./common";
import { EvidenceInterface, ExecutionInterface } from "./formInterfaces";
import { Coordinates } from "./ubication";

export interface InitialStateEvidenceInterface {
    loadingEvidence: boolean;
    loadingExecuted: boolean;
    errorLoadingEvidence: ErrorTypeInterface;
    errorLoadingExecuted: ErrorTypeInterface;
    evidences: EvidenceInterface[];
    executes: ExecutionInterface[];
    evi_selected?: EvidenceInterface;
    evi_count: number;
    list_points: Coordinates[];
}

export interface GetEvidenceProps {
    id_plan: number;
    code: string;
}

export interface GetEvidencesProps {
    id: number;
    page: number;
}

export interface AddEvidenceProps {
    id_plan: number;
    code: string;
    data: EvidenceInterface;
    file: File;
    list_points: Coordinates[];
}

export interface UpdateEvidenceProps {
    id_evidence: number;
    data: EvidenceInterface;
    file: File;
    list_points: Coordinates[];
}

export interface GetUserEviProps {
    page: number;
    id_plan: number;
}

export interface Codes {
    code: string;
    name: string;
    responsible: string;
}