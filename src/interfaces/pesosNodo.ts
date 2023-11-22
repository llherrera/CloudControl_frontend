export interface Porcentaje {
    progreso: number;
    año: number;
    programacion: number;
    ejecucionFinanciera: number;
}

export interface PesosNodos {
    Nombre: string;
    id_nodo: string;
    Peso: number;
    Padre: string | null;
    porcentajes: Porcentaje[] | null;
}

export interface YearDetail {
    id_nodo: string;
    Año: number;
    Programacion_fisica: number;
    Ejecucion_fisica: number;
    Ejecucion_financiera: number;
}