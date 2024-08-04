import { Field } from "@/interfaces";

export const fields: Field[] = [
    {id:'3', name:'Secretarias', title: 'Secretarias', value: 'secretary'},
    {id:'4', name:'Evidencias', title: 'Evidencias', value: 'evidences'},
];

export enum Solicitante {
    Persona_Natural = 'Persona_Natural',
    Persona_Jurídica = 'Persona_Jurídica'
}

export enum Identificacion {
    Tarjeta_de_Identidad = 'Tarjeta_de_Identidad',
	Cédula_de_Ciudadanía = 'Cédula_de_Ciudadanía',
	Cédula_de_Extranjería = 'Cédula_de_Extranjería',
	Pasaporte = 'Pasaporte',
	NIT = 'NIT',
	Permiso_Especial_de_Permanencia = 'Permiso_Especial_de_Permanencia',
	Permiso_Protección_Temporal = 'Permiso_Protección_Temporal',
	Registro_Civil = 'Registro_Civil'
}

export enum Peticion {
    Consulta = 'Consulta',
    De_interes_General = 'De_interes_General',
    De_interes_Particular = 'De_interes_Particular',
    Reclamo = 'Reclamo',
    Reportes = 'Reportes',
    Queja = 'Queja',
    Solicitud_de_acceso_a_la_información = 'Solicitud_de_acceso_a_la_información',
    Solicitud_de_Información_Entre_entidades = 'Solicitud_de_Información_Entre_entidades',
    Solicitud_de_copia = 'Solicitud_de_copia',
    Sugerencia = 'Sugerencia'
}