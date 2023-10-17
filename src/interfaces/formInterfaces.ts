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
    Nombre: string;
    Descripcion: string;
}

export interface NodoInterface {
    id_nodo: string;
    Nombre: string;
    Descripcion: string;
    Padre: (string | null);
    id_nivel: number;
    Peso: number;
}

export interface UnidadInterface {
    codigo: string,
    descripcion: string,
    indicador: string,
    base: number,
    meta: number,
}

export interface AñoInterface {
    año: number[];
    programacion: number[];
    ejecFisica: number[];
    ejecFinanciera: number[];
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
