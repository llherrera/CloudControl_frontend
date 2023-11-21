import { ErrorTypeInterface } from "./common";
import { EvidenceInterface } from "./formInterfaces";

export interface InitialStateEvidenceInterface {
    loadingEvidence: boolean;
    errorLoadingEvidence: ErrorTypeInterface;
    evidence?: EvidenceInterface;
}