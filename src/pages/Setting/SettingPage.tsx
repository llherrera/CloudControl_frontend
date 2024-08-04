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
    LocationsFormPage,
    FileInput,
    FileFinancialInput,
    FilePhysicalInput,
    FileUnitInput,
    InfoPopover,
    DrawerMenu } from '@/components';
import { decode, notify } from "@/utils";

export const SettingPage = () => {
    return (
        <Frame>
            <SettingPageWrapper/>
        </Frame>
    );
}

const SettingPageWrapper = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);
    const { plan, loadingPlan, secretaries } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [page, setPage] = useState(0);
    const [rol, setRol] = useState("");
    const [deadline, setDeadline] = useState<Date>(
        plan === undefined ? new Date() :
        plan.deadline === null ? new Date() : new Date(plan.deadline)
    );

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
        }
    }, []);

    useEffect(() => {
        if (id_plan != 0 && secretaries.length === 0) {
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
    
    const handlePage = (page: number) => setPage(page);
    
    return (
        (plan === null || plan === undefined) ? 
        <div className='tw-text-center'>No hay un plan seleccionado</div> :
        <div className={`tw-flex tw-flex-col xl:tw-flex-row`}>
            <div className='tw-flex md:tw-flex-col tw-self-start'>
                <BackBtn handle={handleBack} id={id_plan}/>
                <DrawerMenu page={page} callback={handlePage}/>
            </div>
            <div className='tw-mt-28 tw-mr-4 tw-pb-4
                            sm:tw-mt-20
                            md:tw-mt-0 md:tw-ml-40
                            xl:tw-mt-12 xl:tw-ml-28
                            tw-flex-grow'>
                {page === 0 ?
                    <div>
                        <div>
                            {rol === "admin" || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan! ) ? 
                                <div>
                                    <FileInput/>
                                    <br />
                                    <FileFinancialInput/>
                                    <br />
                                </div>
                                : null
                            }
                        </div>
                        {rol === "admin" ? <FilePhysicalInput/>: null}<br />
                        {rol === "admin" ? <FileUnitInput/>: null}
                    </div> :
                page === 1 ?
                    <div>
                        {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                            <div className='tw-flex tw-justify-center 
                                            tw-gap-6 tw-items-center
                                            tw-ml-4
                                            tw-bg-white
                                            tw-rounded'>
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
                            <div className='tw-flex tw-flex-wrap
                                            tw-justify-center tw-gap-6
                                            tw-ml-4 tw-mt-4 tw-p-4
                                            tw-bg-white
                                            tw-rounded'>
                                <UploadLogoCity/>
                                <UploadLogoPlan/>
                            </div>
                            : null
                        }
                        <div className='tw-flex tw-justify-center
                                        tw-ml-4 tw-mt-4
                                        tw-bg-white
                                        tw-rounded'>
                            {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan! ) ?
                                <div className='tw-mt-4'>
                                    <ColorForm id={id_plan}/>
                                </div>
                                : null
                            }
                        </div>
                    </div> :
                page === 2 ?
                    <div>
                        {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
                        <SecretaryForm/>
                        : null}
                    </div> :
                page === 3 ?
                    <div>
                        {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
                        <LocationsFormPage/>
                        : null}
                    </div> :
                    <p>Ha ocurrido un error</p>
                }
            </div>
        </div>
    );
}