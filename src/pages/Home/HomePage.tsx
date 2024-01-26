import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonComponent, Header } from "@/components";
import funcLogo from "@/assets/icons/Funcionario.svg";
import citiLogo from "@/assets/icons/Ciudadanos.svg";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from "@/store/auth/thunks";
import { thunkGetLastPDT } from "@/store/plan/thunks";
import { setIdPlan, resetContent } from "@/store/content/contentSlice";
import { removeGenericState } from "@/utils";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { logged } = useAppSelector(store => store.auth);
    const navigate = useNavigate();

    removeGenericState('unit');
    removeGenericState('content');
    removeGenericState('chart');
    removeGenericState('evidence');
    removeGenericState('plan');

    useEffect(() => {
        dispatch(resetContent());
    }, [dispatch]);

    const handleBtnCiudadano = async () => {
        try {
            if (logged) {
                await dispatch(thunkLogout())
                .unwrap()
                .then(() => navigate('/lobby'));
            } else {
                await dispatch(thunkGetLastPDT())
                .unwrap()
                .then((res) => {
                    if (res === undefined) return alert("No hay un PDT activo");
                    dispatch(setIdPlan(res.id_plan!));
                    navigate('/lobby');
                });
                
            }
        } catch (error) {}
    };

    const buttons: React.ReactNode[] = [
        <ButtonComponent 
            inside={false} 
            text='Funcionario' 
            src={funcLogo} 
            onClick={() => navigate('/login')}
            bgColor="tw-bg-greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='Ciudadano' 
            src={citiLogo} 
            onClick={handleBtnCiudadano}
            bgColor="tw-bg-greenBtn"/>
    ];

    return (
        <div>
            <Header components={buttons} />
        </div>
    );
}
