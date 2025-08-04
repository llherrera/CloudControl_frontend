import { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (reload) {
            window.location.reload();
            dispatch(setReload(false));
        }
        removeGenericState('unit');
        removeGenericState('content');
        removeGenericState('chart');
        removeGenericState('evidence');
        removeGenericState('plan');
        dispatch(resetContent());
        dispatch(resetPlan());
        dispatch(resetEvidence());
        dispatch(resetUnit());
    }, []);

    const handleBtnCiudadano = async () => {
        setLoading(true);
        try {
            await dispatch(thunkLogout());
            navigate('/escoger');
        } catch (error) {
            console.log(error);
            alert('Algo salió mal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tw-min-h-screen tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-100 tw-to-green-300">
            <div className="tw-w-[95%] tw-h-auto tw-mx-2 tw-my-4 tw-p-4 tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col tw-items-center
                md:tw-w-[75%] md:tw-h-[85%] md:tw-mx-12 md:tw-my-12 md:tw-p-8 md:tw-max-w-2xl">
                <h1 className="tw-text-3xl tw-font-bold tw-mb-2 tw-text-green-700">¡Bienvenido a ControlLand!</h1>
                <p className="tw-mb-8 tw-text-gray-600 tw-text-center">Selecciona tu tipo de usuario para continuar</p>
                <Header>
                    <ButtonComponent
                        key={0}
                        inside={false}
                        text='Funcionario'
                        src={funcLogo}
                        onClick={() => navigate('/login')}
                        bgColor="tw-bg-greenBtn"
                        className="tw-w-40 tw-h-16 tw-text-lg tw-mx-2 tw-mb-4"/>
                    {/* <ButtonComponent
                        key={1}
                        inside={false}
                        text={loading ? 'Cargando...' : 'Ciudadano'}
                        src={citiLogo}
                        onClick={handleBtnCiudadano}
                        bgColor="tw-bg-greenBtn"
                        className={`tw-w-40 tw-h-16 tw-text-lg tw-mx-2 ${loading ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
                        disabled={loading}
                    /> */}
                </Header>
            </div>
        </div>
    );
}
