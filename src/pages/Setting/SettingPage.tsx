import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {useAppSelector, useAppDispatch } from '@/store';
import {thunkGetLocations, thunkGetSecretaries } from '@/store/plan/thunks';

import {Frame, 
        BackBtn, 
        ColorForm, 
        SecretaryForm, 
        UploadLogoCity,
        UploadLogoPlan, 
        LocationsForm,
        FileInput,
        FileFinancialInput,
        FilePhysicalInput } from '@/components';
import { decode } from "@/utils";

export const SettingPage = () => {
    return (
        <Frame 
            data={<SettingPageWrapper/>}
        />
    );
}

const SettingPageWrapper = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(state => state.auth);
    const { plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [rol, setRol] = useState("");

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
        }
    }, []);

    useEffect(() => {
        if (id_plan != 0) {
            dispatch(thunkGetSecretaries(id_plan));
            dispatch(thunkGetLocations(id_plan));
        }
    }, []);

    const handleBack = () => navigate(-1);

    return (
        (plan === null || plan === undefined) ? 
        <div className='tw-text-center'>No hay un plan seleccionado</div> :
        <div>
            <BackBtn handle={handleBack} id={id_plan}/><br />
            <div>
                {rol === "admin" || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan! ) ? 
                    <div>
                        <FileInput/>
                        <FileFinancialInput/>
                    </div>
                    : null
                }
            </div>
            {rol === "admin" ?
                <FilePhysicalInput/>
                : null
            }
            {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                <div className='tw-flex tw-justify-center tw-gap-6'>
                    <UploadLogoCity/>
                    <UploadLogoPlan/>
                </div>
                : null
            }
            <div className='tw-border-t-4 tw-mt-4 tw-flex tw-justify-center'>
                {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                    <div className='tw-mt-4'>
                        <ColorForm id={id_plan}/>
                    </div>
                    : null
                }
            </div>
            
            {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
            <SecretaryForm/>
            : null}

            {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
            <LocationsForm/>
            : null}
        </div>
    );
}