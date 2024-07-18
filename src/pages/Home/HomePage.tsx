import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonComponent, Header } from "@/components";
import funcLogo from "@/assets/icons/Funcionario.svg";
import citiLogo from "@/assets/icons/Ciudadanos.svg";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from "@/store/auth/thunks";
import { thunkGetLastPDT } from "@/store/plan/thunks";
import { resetContent, setReload } from "@/store/content/contentSlice";
import { resetPlan } from "@/store/plan/planSlice";
import { resetEvidence } from "@/store/evidence/evidenceSlice";
import { resetUnit } from "@/store/unit/unitSlice";
import { removeGenericState } from "@/utils";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { reload } = useAppSelector(store => store.content);
    const navigate = useNavigate();

    useEffect(() => {
        if (reload) {
            window.location.reload();
            dispatch(setReload(false));
        }
    }, []);

    useEffect(() => {
        removeGenericState('unit');
        removeGenericState('content');
        removeGenericState('chart');
        removeGenericState('evidence');
        removeGenericState('plan');
    }, []);

    useEffect(() => {
        dispatch(resetContent());
        dispatch(resetPlan());
        dispatch(resetEvidence());
        dispatch(resetUnit());
    }, []);

    const handleBtnCiudadano = async () => {
        try {
            await dispatch(thunkLogout());
            navigate('/escoger');
        } catch (error) {
            console.log(error);
            alert('Algo salió mal');
        }
    };

    const buttons: JSX.Element[] = [
        <ButtonComponent
            key={0}
            inside={false}
            text='Funcionario'
            src={funcLogo}
            onClick={() => navigate('/login')}
            bgColor="tw-bg-greenBtn"/>,
        <ButtonComponent
            key={1}
            inside={false}
            text='Ciudadano'
            src={citiLogo}
            onClick={handleBtnCiudadano}
            bgColor="tw-bg-greenBtn"/>
    ];

    return (
        <div>
            <Header>
                {buttons}
            </Header>
        </div>
    );
}
