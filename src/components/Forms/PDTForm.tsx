/* ------------------------- IMPORTS ------------------------- */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input, Select, SelectDept, BackBtn } from "@/components";
import { PDTInterface } from "@/interfaces";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkAddPDT } from "@/store/plan/thunks";
import { setIdPlan, setLogo, setLogoPlan } from "@/store/content/contentSlice";

import { Box, CircularProgress } from '@mui/material';

/* ------------------------- COMPONENTE ------------------------- */
/*
  PDTForm
  - Formulario para registrar un Plan de Desarrollo Territorial (PDT).
  - Mantiene la coherencia visual con LoginPage: degradado azul oscuro → claro,
    tarjeta blanca central, tipografía consistente y botones estilizados.
  - El archivo está comentado para facilitar mantenimiento y consistencia.
*/
export const PDTForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { plan, loadingPlan } = useAppSelector(store => store.plan);

    const fechaInicio = new Date().getFullYear();
    const startYears = fechaInicio - 4;
    const years = Array.from({ length: 12 }, (_, i) => i + startYears);

    const [planData, setPlanData] = useState<PDTInterface>({
        id_plan: 0,
        name: "",
        department: "",
        municipality: "",
        id_municipality: "",
        start_date: new Date(fechaInicio, 0, 1).toISOString(),
        end_date: new Date(fechaInicio + 3, 11, 31).toISOString(),
        description: "",
        deadline: "",
        uuid: "",
        fill: "vacio",
        shape: "",
    });

    /* ------------------------- EFECTOS ------------------------- */
    useEffect(() => {
        if (!plan?.id_plan) return;
        dispatch(setIdPlan(plan.id_plan));
        dispatch(setLogo(""));
        dispatch(setLogoPlan(""));
        navigate(`/register`, { replace: true });
    }, [plan]);

    /* ------------------------- HANDLERS ------------------------- */
    const handleInputYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const newDate = new Date(parseInt(value), 0, 1).toISOString();
        const endDate = new Date(parseInt(value) + 3, 11, 31).toISOString();
        setPlanData({ ...planData, start_date: newDate, end_date: endDate });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlanData({ ...planData, [name]: value });
    };

    const handleDepartmentChange = (name: string, code: string) => {
        setPlanData({ ...planData, department: name, municipality: "", id_municipality: code });
    };

    const handleMunicipioChange = (name: string, code: string) => {
        setPlanData({ ...planData, municipality: name, id_municipality: code });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(thunkAddPDT(planData));
    };

    /* ------------------------- RENDER ------------------------- */
    return (
        /* Contenedor principal con fondo degradado */
        <div
            className="tw-min-h-screen tw-w-screen tw-flex tw-flex-col tw-items-center tw-justify-center
                       tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6] tw-p-4"
        >
            {/* Tarjeta blanca central */}
            <div
                className="tw-w-[90%] tw-max-w-2xl tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col
                           tw-items-center tw-p-6 md:tw-p-8"
            >
                {/* Botón de retroceso */}
                {/* Encabezado con botón + título centrado */}
                <div className="tw-w-full tw-grid tw-grid-cols-3 tw-items-center tw-mb-4">
                    {/* Columna izquierda → botón */}
                    <div className="tw-flex tw-justify-start">
                        <BackBtn handle={() => navigate(-1)} id={plan?.id_plan ?? 0} />
                    </div>

                    {/* Columna central → título */}
                    <div className="tw-flex tw-justify-center">
                        <h1 className="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#06283b] tw-text-center">
                            Registrar Plan de Desarrollo
                        </h1>
                    </div>

                    {/* Columna derecha → espaciador vacío */}
                    <div></div>
                </div>



                {/* Formulario */}
                <form onSubmit={handleSubmit} className="tw-w-full tw-max-w-4xl">
                    {/* Contenedor principal con grid */}
                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-items-start">

                        {/* Columna izquierda */}
                        <div className="tw-space-y-6">
                            {/* Nombre */}
                            <div className="tw-w-full">
                                <Input
                                    type="text"
                                    label="Nombre:"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                    center={true}
                                    classname="tw-justify-between tw-gap-2"
                                />
                            </div>

                            {/* Fecha de inicio */}
                            <div className="tw-w-full">
                                <Select
                                    label="Fecha de inicio:"
                                    id="start_date"
                                    name="start_date"
                                    onChange={handleInputYearChange}
                                    options={years}
                                />
                            </div>

                            {/* Departamento y Municipio */}
                            <div className="tw-w-full">
                                <SelectDept
                                    callbackDept={handleDepartmentChange}
                                    callbackMuni={handleMunicipioChange}
                                />
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="tw-space-y-6">
                            {/* Descripción */}
                            <div className="tw-w-full">
                                <Input
                                    type="text"
                                    label="Descripción:"
                                    id="description"
                                    name="description"
                                    onChange={handleInputChange}
                                    center={true}
                                    classname="tw-justify-between tw-gap-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botón de submit con loading - Full width */}
                    <div className="tw-flex tw-justify-center tw-mt-8 tw-col-span-full">
                        {loadingPlan ? (
                            <Box sx={{ display: "flex" }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <input
                                type="submit"
                                value="Registrar Plan"
                                title="Añadir plan"
                                className="tw-bg-[#1f4f63] hover:tw-bg-[#06283b] tw-text-white tw-font-bold
                                           tw-py-3 tw-px-8 tw-rounded-xl tw-w-full tw-max-w-xs tw-transition tw-duration-200
                                           tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed
                                           tw-shadow-lg hover:tw-shadow-xl tw-transform hover:tw-scale-105"
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
