import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';

import {useAppSelector, useAppDispatch } from '@/store';
import { thunkGetLocations, thunkGetSecretaries,
    thunkUpdateDeadline } from '@/store/plan/thunks';
import { setIsFullHeight } from "@/store/content/contentSlice";

import { Frame, BackBtn, ColorForm, SecretaryForm,
    UploadLogoCity, UploadLogoPlan, LocationsFormPage,
    FileInput, FileFinancialInput, FilePhysicalInput,
    FileUnitInput, DrawerMenu, ListItemComp } from '@/components';
import { decode, notify } from "@/utils";

import { Button, Tooltip, Zoom } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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
    const location = useLocation();
    const { pageN } = location.state || {};

    const { token_info } = useAppSelector(store => store.auth);
    const { plan, secretaries, years, locations } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [yearSelect, setYearSelect] = useState<number | undefined>(plan ? plan.deadline ? parseInt(plan.deadline.split('-')[0]) : undefined : undefined);
    const [page, setPage] = useState(pageN ?? 0);
    const [rol, setRol] = useState("");

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                dispatch(setIsFullHeight(contentRef.current.scrollHeight <= window.innerHeight * 0.8));
            }
        };

        checkHeight();
        window.addEventListener('resize', checkHeight);

        return () => {
            window.removeEventListener('resize', checkHeight);
        };
    }, [page]);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
        }
    }, []);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined)
            dispatch(thunkGetSecretaries(id_plan));
        if (locations == undefined)
            dispatch(thunkGetLocations(id_plan));
    }, []);

    const submitActiveYear = () => {
        if (plan === undefined) return;
        if (yearSelect === undefined) return setModalIsOpen(true);
        if (yearSelect > new Date().getFullYear()) return notify('No se puede asignar año activo a los años venideros', 'warning');
        const date = new Date(yearSelect, 1, 1).toISOString();
        dispatch(thunkUpdateDeadline({id_plan: id_plan, date: date}));
    };

    const handleInputModal = async () => {
        setModalIsOpen(false);
        const date = new Date(years[0]-1, 1, 1).toISOString();
        dispatch(thunkUpdateDeadline({id_plan: id_plan, date: date}));
    };

    const handleBack = () => navigate(-1);

    const handlePage = (page: number) => setPage(page);

    return (
        (plan === null || plan === undefined) ?
        <div className='tw-text-center'>No hay un plan seleccionado</div> :
        <div className={``}>
            <DrawerMenu>
                <ListItemComp
                    page={page}
                    index={0}
                    setPage={() => handlePage(0)}
                    title='Cargar plan'/>
                <ListItemComp
                    page={page}
                    index={1}
                    setPage={() => handlePage(1)}
                    title='Ajustes'/>
                <ListItemComp
                    page={page}
                    index={2}
                    setPage={() => handlePage(2)}
                    title='Secretarías'/>
                <ListItemComp
                    page={page}
                    index={3}
                    setPage={() => handlePage(3)}
                    title='Localidades'/>
            </DrawerMenu>
            <div className='sm:tw-ml-2 md:tw-ml-40 tw-mr-2 xl:tw-ml-40
                            tw-mt-24 md:tw-mt-0'>
                <div className="tw-flex tw-justify-between tw-mt-1">
                    <BackBtn handle={handleBack} id={id_plan}/>
                    <p className="tw-bg-white tw-mb-1 tw-rounded tw-p-1 tw-font-bold">Ajustes</p>
                    <div></div>
                </div>
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
                                <Tooltip
                                    title={`El año activo marca el año del cual se podrá actualizar las ejecuciones`}
                                    slots={{
                                        transition: Zoom,
                                    }}
                                >
                                    <Button>
                                        <InfoIcon color="action"/>
                                    </Button>
                                </Tooltip>
                                <p className='tw-text-[#222222] tw-font-bold tw-text-lg
                                                tw-font-montserrat'>
                                    Año activo
                                </p>
                                <>
                                {years.map(y =>
                                    <button key={y}
                                        className={`${yearSelect ?
                                                        (yearSelect === y ?
                                                            'tw-bg-greenColory hover:tw-bg-green-400 tw-text-white'
                                                            : 'tw-bg-gray-200 hover:tw-bg-gray-400')
                                                        : 'tw-bg-gray-200 hover:tw-bg-gray-400'}
                                                    tw-p-2 tw-rounded`}
                                        onClick={() => setYearSelect(prev => prev === y ? undefined : y)}>
                                        {y}
                                    </button>)}
                                </>
                                <button className=' tw-bg-greenColory hover:tw-bg-green-400
                                                    tw-p-2 tw-my-2 tw-text-white
                                                    tw-font-bold tw-rounded'
                                        onClick={submitActiveYear}>
                                    Guardar
                                </button>
                                <Modal  isOpen={modalIsOpen}
                                        onRequestClose={()=>setModalIsOpen(false)}>
                                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4">
                                        <p className="tw-text-xl tw-font-bold">
                                            Si no selecciona un año para marcar como activo no podrá actualizar las ejecuciones
                                        </p>
                                        <button className="tw-bg-blue-600 hover:tw-bg-blue-400
                                                        tw-text-white hover:tw-text-black
                                                        tw-rounded
                                                        tw-p-3 tw-mt-3"
                                                onClick={handleInputModal}>
                                            Enviar
                                        </button>
                                        <button className=" tw-bg-red-600 hover:tw-bg-red-400
                                                            tw-text-white hover:tw-text-black
                                                            tw-rounded tw-p-3 tw-mt-3"
                                                onClick={() => setModalIsOpen(false)}>
                                            Cerrar
                                        </button>
                                    </div>
                                </Modal>
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