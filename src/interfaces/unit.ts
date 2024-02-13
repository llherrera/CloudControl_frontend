import { ErrorTypeInterface } from "./common";
import { UnitInterface } from "./formInterfaces";

export interface InitialStateUnitInterface {
    loadingUnit: boolean;
    errorLoadingUnit: ErrorTypeInterface;
    unit: UnitInterface;
}

export interface propsIndicator {
    id_node: string;
    file: File;
}

export interface PropsExecution {
    year: number;
    value: number;
    code: string;
}