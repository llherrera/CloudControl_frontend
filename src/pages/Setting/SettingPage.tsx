import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {useAppSelector, useAppDispatch } from '@/store';
import {
    thunkGetLocations, 
    thunkGetSecretaries, 
    thunkUpdateDeadline } from '@/store/plan/thunks';

import {
    Frame, 
    BackBtn, 
    ColorForm, 
    SecretaryForm, 
    UploadLogoCity,
    UploadLogoPlan, 
    LocationsForm,
    FileInput,
    FileFinancialInput,
    FilePhysicalInput,
    InfoPopover } from '@/components';
import { decode, notify } from "@/utils";
import { ToastContainer } from 'react-toastify';

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
    const { plan, loadingPlan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [rol, setRol] = useState("");
    const [deadline, setDeadline] = useState<Date>(
        plan === undefined ? new Date() : plan.deadline === null ? new Date() : new Date(plan.deadline)
    );

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

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newDate = new Date(value);
        setDeadline(newDate);
    };

    const submitDate = () => {
        if (plan === undefined) return;
        const date = deadline.toISOString();
        dispatch(thunkUpdateDeadline({id_plan: id_plan, date: date}))
        .unwrap()
        .then(() => notify('Fecha de corte actualizada'));
    };

    const handleBack = () => navigate(-1);

    return (
        (plan === null || plan === undefined) ? 
        <div className='tw-text-center'>No hay un plan seleccionado</div> :
        <div>
            <ToastContainer />
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
            {rol === "admin" ? <FilePhysicalInput/>: null}
            {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                <div className='tw-flex tw-justify-center tw-gap-6 tw-items-center'>
                    <p className='tw-text-[#222222] tw-font-bold tw-text-lg
                                    tw-font-montserrat'>
                        Fecha de corte
                    </p>
                    <input
                        type="date"
                        value={deadline.toISOString().substring(0,10)}
                        className='tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'
                        onChange={handleDate}/>
                    <button 
                        className=' tw-bg-greenColory hover:tw-bg-green-400
                                    tw-text-white hover:tw-text-black
                                    tw-font-bold 
                                    tw-p-2 tw-rounded'
                        type='button'
                        onClick={()=>submitDate()}>
                        {loadingPlan ? 'Cargando...' : 'Establecer fecha'}
                    </button>
                    <InfoPopover content={'Al seleccionar la fecha de corte, será la misma en cada año.\nSe bloqueará la opción de subir o actualizar evidencias para el año anterior.'}/>
                </div>
                : null
            }
            {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                <div className='tw-border-t-4 tw-mt-4 tw-flex tw-justify-center tw-gap-6'>
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