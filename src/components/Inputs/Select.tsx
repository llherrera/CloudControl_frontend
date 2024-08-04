import React, { useState, useEffect } from "react";
import { getDepartmentsGeoportal, getMunicipalities } from "@/services/col_api";
import { SelectProps, DepartmentGeoPortal, MunicipalityGeoPortal } from "@/interfaces";

export const Select = (props: SelectProps) => {
    return(
        <div className={`tw-flex tw-justify-between ${props.classname}`}>
            <label className="tw-mr-4 tw-self-center" htmlFor={props.id}>
                {props.label}
            </label>
            <select name={props.name}
                id={props.id}
                onChange={props.onChange}
                value={props.value}
                className=" tw-m-3 tw-p-2
                            tw-w-1/2
                            tw-rounded
                            tw-border-2 tw-border-gray-400"
                disabled={props.disabled}
                required={!!props.isRequired}>
                {props.optionLabelFn && props.options.map((e, i) => props.optionLabelFn && props.optionLabelFn(e, i))}
                {!props.optionLabelFn && props.options.map((e, i) => <option key={i} value={e}>{e}</option>)}
            </select>
        </div>
    );
}

interface Props {
    callbackDept: (name: string, code: string) => void;
    callbackMuni: (name: string, code: string) => void;
}

export const SelectDept = ({callbackDept, callbackMuni}: Props) => {
    const [departamentOptions, setDepartamentOptions] = useState<DepartmentGeoPortal[]|null>(null);
    const [municipioOptions, setMunicipioOptions] = useState<MunicipalityGeoPortal[]|null>(null);
    const [selectedDepartamento, setSelectedDepartamento] = useState<DepartmentGeoPortal|null>(null);

    useEffect(() => {
        getDepartmentsGeoportal()
        .then(res => {
            const departamentos = res.resultado.map((e: DepartmentGeoPortal) => {
                return {
                    CODIGO_DEPARTAMENTO: e.CODIGO_DEPARTAMENTO,
                    NOMBRE_DEPARTAMENTO: e.NOMBRE_DEPARTAMENTO,
                };
            })
            setDepartamentOptions([{
                CODIGO_DEPARTAMENTO: '',
                NOMBRE_DEPARTAMENTO: '',
            }, ...departamentos]);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (!selectedDepartamento || 
            selectedDepartamento.CODIGO_DEPARTAMENTO === '') return;
        getMunicipalities(selectedDepartamento.CODIGO_DEPARTAMENTO)
        .then(res => {
            const municipios = res.resultado.map(
                (e: MunicipalityGeoPortal) => {
                return {
                    CODIGO_AREA_METRO: e.CODIGO_AREA_METRO,
                    CODIGO_DEPARTAMENTO: e.CODIGO_DEPARTAMENTO,
                    CODIGO_DISTRITO: e.CODIGO_DISTRITO,
                    CODIGO_DPTO_MPIO: e.CODIGO_DPTO_MPIO,
                    CODIGO_MUNICIPIO: e.CODIGO_MUNICIPIO,
                    CODIGO_TIPO_MUNICIPIO: e.CODIGO_TIPO_MUNICIPIO,
                    NOMBRE_MUNICIPIO: e.NOMBRE_MUNICIPIO,
                };
            })
            setMunicipioOptions([{
                CODIGO_AREA_METRO: '',
                CODIGO_DEPARTAMENTO: '',
                CODIGO_DISTRITO: '',
                CODIGO_DPTO_MPIO: '',
                CODIGO_MUNICIPIO: '',
                CODIGO_TIPO_MUNICIPIO: '',
                NOMBRE_MUNICIPIO: '',
            }, ...municipios]);
        })
        .catch(error => {
            console.log(error);
        });
    }, [selectedDepartamento]);

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!departamentOptions) return;
        setMunicipioOptions(null);
        setSelectedDepartamento(departamentOptions[parseInt(value)]);
        callbackDept(departamentOptions[parseInt(value)].NOMBRE_DEPARTAMENTO, departamentOptions[parseInt(value)].CODIGO_DEPARTAMENTO+'000');
    };

    const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!municipioOptions) return;
        callbackMuni(municipioOptions[parseInt(value)].NOMBRE_MUNICIPIO, municipioOptions[parseInt(value)].CODIGO_DPTO_MPIO);
    };

    const optionDept = (e:any, i:any) => (
        <option key={e.CODIGO_DEPARTAMENTO} 
            value={i}>{e.NOMBRE_DEPARTAMENTO}
        </option>
    );

    const optionMuni = (e:any ,i: any) => (
        <option key={e.CODIGO_MUNICIPIO} value={i}>
            {e.NOMBRE_MUNICIPIO}
        </option>
    );

    return (
        <div>
            <Select
                label="Departamento:"
                id="department"
                name="department"
                onChange={handleDepartmentChange}
                options={departamentOptions ?? []}
                optionLabelFn={(e, i) => optionDept(e,i)}
            />
            <Select
                label="Municipio:"
                id="municipality"
                name="municipality"
                onChange={handleMunicipioChange}
                options={municipioOptions ?? []}
                optionLabelFn={(e, i) => optionMuni(e,i)}
                disabled={!selectedDepartamento}
            />
        </div>
    );
}

interface PropsS {
    opts: {
        label: string;
        value: string;
    }[];
}

export const SelectStyled = ({opts}: PropsS) => {
    const [value, setValue] = useState('');

    const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    return(
        <select className=" tw-flex-shrink-0
                            tw-inline-flex tw-items-center
                            tw-py-2.5 tw-w-20 tw-z-10
                            tw-rounded-lg
                            tw-text-sm tw-font-medium tw-text-center tw-text-gray-500
                            tw-bg-gray-100 hover:tw-bg-gray-200 
                            tw-border tw-border-gray-300
                            focus:tw-ring-4 focus:tw-ring-gray-100
                            focus:tw-outline-none"
                value={value}
                onChange={(e) => handleValueChange(e)}>
            <option value=''
                    className=" tw-inline-flex
                                tw-w-full tw-px-4 tw-py-2
                                tw-text-sm tw-text-gray-700
                                hover:tw-bg-gray-100">
                
            </option>
            {opts.map(opt =>
                <option value={opt.value}
                        className=" tw-inline-flex
                                    tw-w-full tw-px-4 tw-py-2
                                    tw-text-sm tw-text-gray-700
                                    hover:tw-bg-gray-100"
                        key={opt.label}>
                    {opt.label}
                </option>
            )}
        </select>
    );
}