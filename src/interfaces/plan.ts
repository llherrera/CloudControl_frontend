import { ErrorTypeInterface } from "./common";
import { PDTInterface } from "./formInterfaces";

export interface InitialStatePlanInterface {
    loading: boolean;
    errorLoading: ErrorTypeInterface;
    plan: PDTInterface;
}