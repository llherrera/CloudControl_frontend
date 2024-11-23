import { Field } from "@/interfaces";

export const fields: Field[] = [
    {id:'3', name:'Secretarias', title: 'Secretarias', value: 'secretary'},
    {id:'4', name:'Evidencias', title: 'Evidencias', value: 'evidences'},
    {id:'5', name:'Ejecuciones', title: 'Ejecuciones', value: 'execution'},
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

export const peticion = [
    'Consulta',
    'De interes General',
    'De interes Particular',
    'Reclamo',
    'Reportes',
    'Queja',
    'Solicitud de acceso a la información',
    'Solicitud de Información Entre entidades',
    'Solicitud de copia',
    'Sugerencia'
]