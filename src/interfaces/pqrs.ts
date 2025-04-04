import { ErrorTypeInterface } from "./common";

import { PQRSInform } from "./formInterfaces";

export interface InitialStatePQRSInterface {
    loadingPQRS: boolean;
    errorLoadingPQRS: ErrorTypeInterface;
    pqrs?: PQRSInform
}

export interface ParamsAddPqrs {
    id_plan: number;
    pqrs: {}
}

export interface ParamsAddPqrsType {
    id_plan: number;
    type: {}
}

export interface ParamsAddPqrsHistory {
    radicado: string;
}