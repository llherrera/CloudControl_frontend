export interface Porcentaje {
    progreso: number;
    año: number;
    programacion: number;
}

export interface PesosNodos {
    Nombre: string;
    id_nodo: string;
    Peso: number;
    Padre: string | null;
    porcentajes: Porcentaje[] | null;
}

export interface DetalleAño {
    id_nodo: string;
    Año: number;
    Programacion_fisica: number;
    Ejecucion_Fisica: number;
    Ejecucion_financiera: number;
}