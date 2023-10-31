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
    id_nodo: string;
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
    years: AñoInterface[]
}

export interface AñoInterface {
    year: number;
    programed: number;
    phisicalExecuted: number;
    finalcialExecuted: number;
}

export interface EvidenciaInterface {
    Fecha: string;
    DescripcionActividades: string;
    Unidad: string;
    Cantidad: number;
    Comuna: string;
    Barrio: string;
    Correguimiento: string;
    Vereda: string;
    PoblacionBeneficiada: string;
    NumeroPoblacionBeneficiada: number;
    RecursosEjecutados: number;
    FuenteRecursos: string;
    NombreDocumento: string;
    Lugar: string;
    Fecha2: string;
}
