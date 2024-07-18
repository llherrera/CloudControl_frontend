import React, { useState, useCallback } from "react";
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
        .then(() => {
            registerCall();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const optioDate = (e: any) => (
        <option key={e} value={fechaInicio + e}>
            {fechaInicio + e}
        </option>
    );

    return (
        <div className="tw-flex tw-justify-center">
            <BackBtn handle={()=>navigate(-1)} id={plan?.id_plan??0}/>
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
                <SelectDept callbackDept={handleDepartmentChange} callbackMuni={handleMunicipioChange}/>
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