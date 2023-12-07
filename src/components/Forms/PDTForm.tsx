import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Input, Select } from "../Inputs";
import { PDTInterface } from "../../interfaces";

import { useAppDispatch } from '@/store';
import { thunkAddPDT } from "@/store/plan/thunks";
import { getDepartmentCities, getDepartments } from "@/services/col_api";

interface selectOption {
    id: number
    name: string
}
export const PDTForm = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const fechaInicio = new Date().getFullYear()

    const [departamentOptions, setDepartamentOptions] = useState<selectOption[]|null>(null);
    const [municipioOptions, setMunicipioOptions] = useState<selectOption[]|null>(null);
    const [selectedDepartamento, setSelectedDepartamento] = useState<selectOption|null>(null);
    const [planData, setPlanData] = useState<PDTInterface>({
        Nombre: "",
        Departamento: "",
        Municipio: "",
        Fecha_inicio: new Date().getUTCFullYear().toString(),
        Fecha_fin: (new Date().getUTCFullYear() + 3).toString(),
        Descripcion: "",
    });

    useEffect(() => {
        getDepartments()
            .then((res) => {
                setDepartamentOptions([{id: -1, name: ''}, ...res]);
            });
    }, []);
    
    useEffect(() => {
        if (!selectedDepartamento || selectedDepartamento.id < 0) return
        getDepartmentCities(selectedDepartamento.id)
            .then((res) => {
                setMunicipioOptions([{id: -1, name: ''}, ...res]);
            });
    }, [selectedDepartamento]);

    const handleInputYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setPlanData({
            ...planData,
            Fecha_inicio: new Date(parseInt(value), 0, 1).toISOString(),
            Fecha_fin: new Date(parseInt(value) + 3, 11, 31).toISOString(),
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
            Departamento: departamentOptions[parseInt(value)].name,
            Municipio: ''
        });
    };

    const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!municipioOptions) return;
        setPlanData({
            ...planData,
            Municipio: municipioOptions[parseInt(value)].name,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dispatch(thunkAddPDT(planData))
            .unwrap()
            .then((res) => {
                navigate(`/pdt/PlanIndicativo`, { state: { id: res.id_plan } })
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
        )
    }

    return (
        <div className="tw-flex tw-justify-center">
            {backIconButton()}
            <form   onSubmit={handleSubmit}
                    className=" tw-rounded tw-shadow-2xl
                                tw-p-10">
                <h1 className="tw-mb-4 tw-grow tw-text-center tw-text-xl">Registrar Plan de Desarrollo</h1>
                <div>
                <Input  type={"text"}
                        label="Nombre:"
                        id={"Nombre"}
                        name={"Nombre"}
                        value={planData.Nombre}
                        onChange={handleInputChange}/>
                <Select label="Departamento:"
                        id="Departamento"
                        name="Departamento"
                        onChange={handleDepartmentChange}
                        options={departamentOptions ? departamentOptions : []}
                        optionLabelFn={(e, i) => <option key={e.id} value={i}>{e.name}</option>}
                />
                <Select label="Municipio:"
                        id="Municipio"
                        name="Municipio"
                        onChange={handleMunicipioChange}
                        options={municipioOptions ? municipioOptions : []}
                        optionLabelFn={(e, i) => <option key={e.id} value={i}>{e.name}</option>}
                        disabled={!selectedDepartamento}
                />
                <Input  type={"text"}
                        label="Descripción:"
                        id={"Descripcion"}
                        name={"Descripcion"}
                        value={planData.Descripcion}
                        onChange={handleInputChange}/>

                <Select label="Fecha de inicio:"
                        id="Fecha_inicio"
                        name="Fecha_inicio"
                        onChange={handleInputYearChange}
                        options={Array.from(Array(5).keys())}
                        optionLabelFn={(e) => <option key={e} value={fechaInicio + e}>{fechaInicio + e}</option>}
                />
                </div>
                <input  type="submit"
                        value="Registrar Plan"
                        title="Añadir plan"
                        className=" tw-bg-green-500 hover:tw-bg-green-300
                                    tw-text-white tw-font-bold hover:tw-text-black
                                    tw-rounded
                                    tw-p-2"
                />

            </form>
        </div>
    )
}