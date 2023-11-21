import { ErrorTypeInterface } from "./common";
import { UnitInterface } from "./formInterfaces";

export interface InitialStateUnitInterface {
    loadingUnit: boolean;
    errorLoadingUnit: ErrorTypeInterface;
    unit?: UnitInterface;
}