import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input, Select, SelectDept, BackBtn } from "@/components";
import { PDTInterface } from "@/interfaces";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkAddPDT } from "@/store/plan/thunks";
import { setIdPlan, setLogo, setLogoPlan } from "@/store/content/contentSlice";

import { Box, CircularProgress } from '@mui/material';

export const PDTForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { plan, loadingPlan } = useAppSelector(store => store.plan);

    const fechaInicio = new Date().getFullYear();
    const startYears = new Date().getFullYear() - 4;
    const years = Array.from({ length: 12 }, (_, i) => i + startYears); ;

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
        uuid: '',
        fill: 'vacio',
        shape: ''
    });

    useEffect(() => {
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
        let newDate = new Date(parseInt(value), 0, 1).toISOString();
        let endDate = new Date(parseInt(value) + 3, 11, 31).toISOString();

        setPlanData({
            ...planData,
            start_date: newDate,
            end_date: endDate,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlanData({
            ...planData,
            [name]: value,
        });
    };

    const handleDepartmentChange = (name: string, code: string) => {
        setPlanData({
            ...planData,
            department: name,
            municipality: '',
            id_municipality: code,
        });
    };

    const handleMunicipioChange = (name: string, code: string) => {
        setPlanData({
            ...planData,
            municipality: name,
            id_municipality: code,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(thunkAddPDT(planData))
        //.then(() => {
        //    if (plan === undefined) return;
        //    const { id_plan } = plan;
        //    if (id_plan === undefined) return;
        //    dispatch(setIdPlan(id_plan));
        //    dispatch(setLogo(''));
        //    dispatch(setLogoPlan(''));
        //    navigate(`/register`, {replace: true});
        //})
        //.catch((err) => {
        //    console.log(err);
        //});
    };

    return (
        <div className="tw-min-h-screen tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-100 tw-to-green-300 tw-p-4">
            <div className="tw-w-full tw-max-w-2xl tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col tw-items-center tw-p-6 md:tw-p-8">
                <div className="tw-w-full tw-flex tw-justify-start tw-mb-4">
                    <BackBtn handle={()=>navigate(-1)} id={plan?.id_plan??0}/>
                </div>
                <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700 tw-w-full tw-text-center">Registrar Plan de Desarrollo</h1>
                <form onSubmit={handleSubmit} className="tw-w-full tw-max-w-md tw-space-y-5">
                    <Input  type={"text"}
                            label="Nombre:"
                            id={"name"}
                            name={"name"}
                            onChange={handleInputChange}
                            center={true}
                            classname="tw-justify-between tw-gap-2"
                    />
                    <SelectDept
                        callbackDept={handleDepartmentChange}
                        callbackMuni={handleMunicipioChange}
                    />
                    <Input  type={"text"}
                            label="Descripción:"
                            id={"description"}
                            name={"description"}
                            onChange={handleInputChange}
                            center={true}
                            classname="tw-justify-between tw-gap-2"
                    />
                    <Select label="Fecha de inicio:"
                            id="start_date"
                            name="start_date"
                            onChange={handleInputYearChange}
                            options={years}
                    />
                    <div className="tw-flex tw-justify-center">
                        {loadingPlan ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box> :
                        <input  type="submit"
                                value="Registrar Plan"
                                title="Añadir plan"
                                className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-xl tw-w-full tw-transition tw-duration-200 tw-disabled:tw-opacity-50 tw-disabled:tw-cursor-not-allowed"
                        />
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}