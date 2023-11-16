export interface RegisterInterface {
    usuario: string;
    apellido: string;
    correo: string;
    contraseña: string;
    confirmarContraseña: string;
    rol: string;
}

export interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface PDTInterface {
    id_plan?: number;
    Nombre: string;
    Alcaldia: string;
    Municipio: string;
    Descripcion: string;
    Fecha_inicio: string;
    Fecha_fin: string;
}

export interface NivelInterface {
    id_nivel?: number;
    LevelName: string;
    Description: string;
}

export interface NodoInterface {
    id_node: string;
    NodeName: string;
    Description: string;
    Parent: (string | null);
    id_level: number;
    Weight: number;
}

export interface UnidadInterface {
    code: string,
    description: string,
    indicator: string,
    base: number,
    goal: number,
    years: YearInterface[]
}

export interface YearInterface {
    year: number;
    programed: number;
    phisicalExecuted: number;
    finalcialExecuted: number;
}

export interface EvidenceInterface {
    fecha: string;
    descripcionActividades: string;
    unidad: string;
    cantidad: number;
    comuna: string;
    barrio: string;
    correguimiento: string;
    vereda: string;
    poblacionBeneficiada: string;
    numeroPoblacionBeneficiada: number;
    recursosEjecutados: number;
    fuenteRecursos: string;
    nombreDocumento: string;
    lugar: string;
    fechaArchivo: string;
}
