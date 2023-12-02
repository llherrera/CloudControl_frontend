import { ErrorTypeInterface } from "./common";
import { UnitInterface, YearInterface } from "./formInterfaces";

export interface ContentInterface {
    id: number;
}

export interface InitialStateContentInterface {
    loading: boolean;
    error: ErrorTypeInterface;
    index: number;
}

export interface GetUnitProps {
    idPDT: string;
    idNode: string;
}

export interface AddUnitProps {
    idPDT: string;
    idNode: string;
    unit: UnitInterface;
    years: YearInterface[];
}