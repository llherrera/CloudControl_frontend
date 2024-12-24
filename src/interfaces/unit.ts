import { ErrorTypeInterface } from "./common";
import { UnitInterface, UnitNodeResultInterface } from "./formInterfaces";

export interface InitialStateUnitInterface {
    loadingUnit: boolean;
    loadingUnitResult: boolean;
    errorLoadingUnit: ErrorTypeInterface;
    errorLoadingUnitResult: ErrorTypeInterface;
    unit: UnitInterface;
    unitResult?: UnitNodeResultInterface;
}

export interface propsIndicator {
    id_node: string;
    file: File;
}

export interface PropsExecution {
    date: Date;
    value: number;
    code: string;
    user_id: number;
    plan_id: number;
    reason?: string;
}

export interface PropsAddUnitResult {
    id_plan: number;
    id_node: string;
    node: UnitNodeResultInterface;
    nodes: string[];
}