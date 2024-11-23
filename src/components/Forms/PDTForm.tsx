import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input, Select, SelectDept, BackBtn } from "@/components";
import { PDTInterface } from "@/interfaces";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkAddPDT } from "@/store/plan/thunks";
import { setIdPlan, setLogo, setLogoPlan } from "@/store/content/contentSlice";

export const PDTForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { plan } = useAppSelector(store => store.plan);

    const fechaInicio = new Date().getFullYear();
    const years = [];
    for (let i = -1; i <= 4; i++) {
        years.push(fechaInicio + i);
    }

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
        uuid: ''
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
        let newYear = new Date().getFullYear() + parseInt(value) - 1;
        let newDate = new Date(newYear, 0, 1).toISOString();
        let endYear = new Date().getFullYear() + parseInt(value) + 2;
        let endDate = new Date(endYear, 11, 31).toISOString();

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
        <div className="tw-flex tw-justify-center">
            <BackBtn handle={()=>navigate(-1)} id={plan?.id_plan??0}/>
            <form   onSubmit={handleSubmit}
                    className=" tw-rounded tw-shadow-2xl
                                tw-bg-white
                                tw-p-10 tw-my-2">
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