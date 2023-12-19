import { ErrorTypeInterface } from "./common";
import { EvidenceInterface } from "./formInterfaces";
import { Coordinates } from "./ubication";

export interface InitialStateEvidenceInterface {
    loadingEvidence: boolean;
    errorLoadingEvidence: ErrorTypeInterface;
    evidences: EvidenceInterface[];
    eviSelected?: EvidenceInterface;
    eviCount: number;
    listPoints: Coordinates[];
}

export interface GetEvidenceProps {
    id_plan: number;
    codigo: string;
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
    listPoints: Coordinates[];
}

export interface UpdateEvidenceProps {
    data: EvidenceInterface;
    file: File;
    listPoints: Coordinates[];
}