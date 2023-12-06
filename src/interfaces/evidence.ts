import { ErrorTypeInterface } from "./common";
import { EvidenceInterface } from "./formInterfaces";

export interface InitialStateEvidenceInterface {
    loadingEvidence: boolean;
    errorLoadingEvidence: ErrorTypeInterface;
    evidence: EvidenceInterface[];
    ubications: UbicationDB[];
    eviCount: number;
}

export interface GetEvidenceProps {
    id_plan: number;
    codigo: string;
}

export interface GetEvidencesProps {
    id_plan: number;
    page: number;
}

export interface UbicationDB {
    id_ubicacion_evi: number;
    codigo: string;
    Latitud: number;
    Longitud: number;
}