import { ErrorTypeInterface } from "./common";
import { EvidenceInterface } from "./formInterfaces";
import { Coordinates } from "./ubication";

export interface InitialStateEvidenceInterface {
    loadingEvidence: boolean;
    errorLoadingEvidence: ErrorTypeInterface;
    evidence: EvidenceInterface[];
    eviSelected?: EvidenceInterface;
    eviCount: number;
    listPoints: Coordinates[];
}

export interface GetEvidenceProps {
    id_plan: number;
    codigo: string;
}

export interface GetEvidencesProps {
    id_plan: number;
    page: number;
}
