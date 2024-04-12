export interface DepartmentGeoPortal {
    CODIGO_DEPARTAMENTO: string;
    NOMBRE_DEPARTAMENTO: string;
}

export interface MunicipalityGeoPortal {
    CODIGO_AREA_METRO: string;
    CODIGO_DEPARTAMENTO: string;
    CODIGO_DISTRITO: string;
    CODIGO_DPTO_MPIO: string;
    CODIGO_MUNICIPIO: string;
    CODIGO_TIPO_MUNICIPIO: string;
    NOMBRE_MUNICIPIO: string;
}

export interface InfoMunicipalityGeoPortal {
    CODIGO_DEPARTAMENTO: string;
    CODIGO_TIPO_DPTO: string;
    CPT_NOMBRE: string;
    DPTO_ACT_ADM: string;
    DPTO_ANNIO_CREA: string;
    DPTO_SUPERF_KM2: string;
    DPTO_URL_BANDERA: string;
    DPTO_URL_ESCUDO: string;
    DPTO_URL_MAPA_DVP: string;
    DPTO_URL_PAG_WEB: string;
    HISTORIA: string;
    NOMBRE_DEPARTAMENTO: string;
    TERRITORIAL_DANE: string;
}

export interface ResponseGeocoder {
    addresstype: string;
    boundingbox: string[];
    class: string;
    display_name: string;
    importance: number;
    lat: string;
    lon: string;
    licence: string;
    name: string;
    osm_id: number;
    osm_type: string;
    place_id: number;
    place_rank: number;
    type: string;
}