import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Input, Select } from "@/components";
import { 
    PDTInterface, 
    DepartmentGeoPortal, 
    MunicipalityGeoPortal } from "@/interfaces";
import { 
    getDepartmentsGeoportal, 
    getMunicipalities } from "@/services/col_api";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkAddPDT } from "@/store/plan/thunks";
import { setIdPlan, setLogo, setLogoPlan } from "@/store/content/contentSlice";

export const PDTForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { plan } = useAppSelector((state) => state.plan);

    const fechaInicio = new Date().getFullYear();

    const [departamentOptions, setDepartamentOptions] = 
        useState<DepartmentGeoPortal[]|null>(null);
    const [municipioOptions, setMunicipioOptions] = 
        useState<MunicipalityGeoPortal[]|null>(null);
    const [selectedDepartamento, setSelectedDepartamento] = 
        useState<DepartmentGeoPortal|null>(null);
    const [planData, setPlanData] = useState<PDTInterface>({
        name: "",
        department: "",
        municipality: "",
        id_municipality: "",
        start_date: new Date(fechaInicio, 0, 1).toISOString(),
        end_date: new Date(fechaInicio + 3, 11, 31).toISOString(),
        description: "",
        deadline: ""
    });

    useEffect(() => {
        getDepartmentsGeoportal()
        .then((res) => {
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
        });
    }, []);
    
    useEffect(() => {
        if (!selectedDepartamento || 
            selectedDepartamento.CODIGO_DEPARTAMENTO === '') return;
        getMunicipalities(selectedDepartamento.CODIGO_DEPARTAMENTO)
        .then((res) => {
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
        });
    }, [selectedDepartamento]);

    const registerCall = useCallback(() => {
        if (plan === undefined) return;
        const { id_plan } = plan;
        if (id_plan === undefined) return;
        dispatch(setIdPlan(id_plan));
        dispatch(setLogo(''));
        dispatch(setLogoPlan(''));
        navigate(`/register`, {replace: true});
    }, [plan]);

    const handleInputYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setPlanData({
            ...planData,
            start_date: new Date(parseInt(value), 0, 1).toISOString(),
            end_date: new Date(parseInt(value) + 3, 11, 31).toISOString(),
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlanData({
            ...planData,
            [name]: value,
        });
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!departamentOptions) return;
        setMunicipioOptions(null);
        setSelectedDepartamento(departamentOptions[parseInt(value)]);
        setPlanData({
            ...planData,
            department: departamentOptions[parseInt(value)].NOMBRE_DEPARTAMENTO,
            municipality: '',
            id_municipality: departamentOptions[parseInt(value)].CODIGO_DEPARTAMENTO+'000',
        });
    };

    const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!municipioOptions) return;
        setPlanData({
            ...planData,
            municipality: municipioOptions[parseInt(value)].NOMBRE_MUNICIPIO,
            id_municipality: municipioOptions[parseInt(value)].CODIGO_DPTO_MPIO,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(thunkAddPDT(planData))
        .then(() => {
            registerCall();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        );
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

    const optioDate = (e: any) => (
        <option key={e} value={fechaInicio + e}>
            {fechaInicio + e}
        </option>
    );

    return (
        <div className="tw-flex tw-justify-center">
            {backIconButton()}
            <form   onSubmit={handleSubmit}
                    className=" tw-rounded tw-shadow-2xl
                                tw-p-10">
                <h1 className=" tw-mb-4 tw-grow 
                                tw-text-center tw-text-xl tw-font-bold">
                    Registrar Plan de Desarrollo
                </h1>
                <div>
                <Input  type={"text"}
                        label="Nombre:"
                        id={"name"}
                        name={"name"}
                        onChange={handleInputChange}
                />
                <Select label="Departamento:"
                        id="department"
                        name="department"
                        onChange={handleDepartmentChange}
                        options={departamentOptions ?? []}
                        optionLabelFn={(e, i) => optionDept(e,i)}
                />
                <Select label="Municipio:"
                        id="municipality"
                        name="municipality"
                        onChange={handleMunicipioChange}
                        options={municipioOptions ?? []}
                        optionLabelFn={(e, i) => optionMuni(e,i)}
                        disabled={!selectedDepartamento}
                />
                <Input  type={"text"}
                        label="Descripción:"
                        id={"description"}
                        name={"description"}
                        onChange={handleInputChange}
                />

                <Select label="Fecha de inicio:"
                        id="start_date"
                        name="start_date"
                        onChange={handleInputYearChange}
                        options={Array.from(Array(5).keys())}
                        optionLabelFn={(e) => optioDate(e)}
                />
                </div>
                <div className="tw-flex tw-justify-center">
                    <input  type="submit"
                            value="Registrar Plan"
                            title="Añadir plan"
                            className=" tw-bg-green-500 hover:tw-bg-green-300
                                        tw-text-white tw-font-bold 
                                        hover:tw-text-black
                                        tw-rounded
                                        tw-p-2"
                    />
                </div>
            </form>
        </div>
    );
}