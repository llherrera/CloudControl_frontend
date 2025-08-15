import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from '@/store';
import {
    thunkGetLocations, thunkGetSecretaries,
    thunkUpdateDeadline, thunkGetSloganByPlan, thunkUpdateSloganByPlan, thunkUpdateTextFormatByPlan,
    thunkGetTextFormatByPlan
} from '@/store/plan/thunks';
import { setIdPlan, setIsFullHeight } from "@/store/content/contentSlice";

import {
    Frame, BackBtn, ColorForm, SecretaryForm,
    UploadLogoCity, UploadLogoPlan, LocationsFormPage,
    FileInput, FileFinancialInput, FilePhysicalInput,
    FileUnitInput, DrawerMenu, ListItemComp, UpdateUserForm, ModulesForm
} from '@/components';
import { decode, notify } from "@/utils";

import { Button, Tooltip, Zoom } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const SettingPage = () => {
    return (
        <Frame>
            <SettingPageWrapper />
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
    const [page, setPage] = useState(pageN ?? 1);
    const [rol, setRol] = useState("");
    const [slogan, setSlogan] = useState<string>('');
    const [editSlogan, setEditSlogan] = useState<string>('');
    const [isEditingSlogan, setIsEditingSlogan] = useState(false);
    const [id, setId] = useState(0);
    const [user, setUser] = useState('');
    const [idPlan, setIdPlan] = useState(0);

    const contentRef = useRef<HTMLDivElement>(null);

    const divRef = useRef<HTMLDivElement>(null);
    const [HeigtComponent, setHeigtComponent] = useState("100vh");

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setId(decoded.id);
            setUser(decoded.user);
            setRol(decoded.rol);
            setIdPlan(decoded.id_plan);
            console.log('Token decodificado:', decoded);
        }
    }, []);

    useEffect(() => {
        if (!divRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newHeight = entry.contentRect.height + 5;
                const windowHeight = window.innerHeight;

                if (newHeight > windowHeight) {
                    setHeigtComponent(`${newHeight}px`);
                } else {
                    setHeigtComponent("100vh")
                }
            }
        });

        observer.observe(divRef.current);

        return () => observer.disconnect();
    }, []);

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

    useEffect(() => {
        if (id_plan > 0) {
            dispatch(thunkGetSloganByPlan(id_plan)).then((action: any) => {
                if (action.payload && typeof action.payload === 'string') {
                    setSlogan(action.payload);
                    setEditSlogan(action.payload);
                }
            });
        }
    }, [id_plan]);

    const submitActiveYear = () => {
        if (plan === undefined) return;
        if (yearSelect === undefined) return setModalIsOpen(true);
        if (yearSelect > new Date().getFullYear()) return notify('No se puede asignar año activo a los años venideros', 'warning');
        const date = new Date(yearSelect, 1, 1).toISOString();
        dispatch(thunkUpdateDeadline({ id_plan: id_plan, date: date }));
    };

    const handleInputModal = async () => {
        setModalIsOpen(false);
        const date = new Date(years[0] - 1, 1, 1).toISOString();
        dispatch(thunkUpdateDeadline({ id_plan: id_plan, date: date }));
    };

    const handleSaveSlogan = () => {
        dispatch(thunkUpdateSloganByPlan({ id_plan, slogan: editSlogan })).then((action: any) => {
            if (!action.error) {
                setSlogan(editSlogan);
                setIsEditingSlogan(false);
                notify('Slogan actualizado', 'success');
            } else {
                notify('Error al actualizar el slogan', 'error');
            }
        });
    };

    const handleBack = () => navigate(-1);

    const handlePage = (page: number) => {
        setPage(page);
    };

    const [isEditingNavbarTitle, setIsEditingNavbarTitle] = useState(false);
    const [navbarTitle, setNavbarTitle] = useState('');
    const [editNavbarTitle, setEditNavbarTitle] = useState('');
    const [navbarTitleConfig, setNavbarTitleConfig] = useState({
        color: '#222222',
        size: '1.5rem',
        weight: 'bold',
    });

    const handleSaveNavbarTitle = () => {
        setNavbarTitle(editNavbarTitle);
        setIsEditingNavbarTitle(false);
        // aquí puedes hacer el dispatch para guardar en backend
    };


    const handleSaveTitleConfig = async () => {
        const config: TextFormat = {
            text: titleText,
            color: textColor,
            size: fontSize,
            weight: fontWeight,
            align: textAlign,
        };
    
        const now = new Date().toISOString();
        console.log(`[handleSaveTitleConfig:${now}] Preparando config:`, config, { id_plan });
    
        try {
            // 🔁 Guardar en localStorage (log por cada clave para trazabilidad)
            localStorage.setItem('textFormat', JSON.stringify(config));
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem textFormat`, config);
    
            localStorage.setItem('titleText', titleText);
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem titleText`, titleText);
    
            localStorage.setItem('textColor', textColor);
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem textColor`, textColor);
    
            localStorage.setItem('fontSize', String(fontSize));
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem fontSize`, fontSize);
    
            localStorage.setItem('fontWeight', String(fontWeight));
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem fontWeight`, fontWeight);
    
            localStorage.setItem('textAlign', textAlign);
            console.debug(`[handleSaveTitleConfig:${now}] localStorage.setItem textAlign`, textAlign);
    
            // 🧠 Actualizar en el backend
            console.log(`[handleSaveTitleConfig:${now}] Llamando thunkUpdateTextFormatByPlan con id_plan=${id_plan}`);
            const result = await dispatch(thunkUpdateTextFormatByPlan({ id_plan, format: config }));
            console.log(`[handleSaveTitleConfig:${now}] Resultado del dispatch:`, result);
    
            console.info(`[handleSaveTitleConfig:${now}] Configuración guardada correctamente.`);
        } catch (err) {
            console.error(`[handleSaveTitleConfig:${now}] Error guardando configuración:`, err);
            // opcional: notificar al usuario
            // notify('Error al guardar la configuración'); // descomenta si tienes notify
        }
    };
    ;
    

    interface TextFormat {
        text: string;
        color: string;
        size: string;
        weight: 'normal' | 'bold' | 'lighter';
        align: 'left' | 'center' | 'right' | 'justify';
    }

    function formatTextConfigToString(config: Record<string, string>): string {
        return Object.entries(config)
            .map(([key, value]) => `[${key}: ${value}]`)
            .join(', ');
    }

    const idPlan_localStorage = localStorage.getItem('id_plan') ?? '';

const [textFormat, setTextFormat] = useState<TextFormat | null>(null);

const [titleText, setTitleText] = useState(() => localStorage.getItem('titleText') ?? '');
const [textColor, setTextColor] = useState(() => localStorage.getItem('textColor') ?? '#000000');
const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') ?? '16px');
const [fontWeight, setFontWeight] = useState<'normal' | 'bold' | 'lighter'>(() => {
    const stored = localStorage.getItem('fontWeight');
    return (stored as 'normal' | 'bold' | 'lighter') ?? 'normal';
});
const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>(() => {
    const stored = localStorage.getItem('textAlign');
    return (stored as 'left' | 'center' | 'right' | 'justify') ?? 'center';
});

// 🌀 Cargar desde la base si no hay formato ya cargado
useEffect(() => {
    if (!textFormat && idPlan) {
        dispatch(thunkGetTextFormatByPlan(Number(idPlan)))
            .then((res) => {
                const payload = res.payload as TextFormat | undefined;

                if (payload) {
                    setTextFormat(payload);
                    setTitleText(payload.text || '');
                    setTextColor(payload.color || '#000000');
                    setFontSize(payload.size || '16px');
                    setFontWeight(payload.weight as 'normal' | 'bold' | 'lighter');
                    setTextAlign(payload.align as 'left' | 'center' | 'right' | 'justify');
                }
            })
            .catch((err) => {
                console.error('[TextConfig] Error al obtener formato:', err);
            });
    }
}, [idPlan, dispatch, textFormat]);

// 🧠 Guardar en localStorage cuando cambien
useEffect(() => {
    localStorage.setItem('titleText', titleText);
}, [titleText]);

useEffect(() => {
    localStorage.setItem('textColor', textColor);
}, [textColor]);

useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
}, [fontSize]);

useEffect(() => {
    localStorage.setItem('fontWeight', fontWeight);
}, [fontWeight]);

useEffect(() => {
    localStorage.setItem('textAlign', textAlign);
}, [textAlign]);

// Puedes seguir usando configString como lo tenías:
const configString = formatTextConfigToString({
    text: titleText,
    color: textColor,
    size: fontSize,
    weight: fontWeight,
    align: textAlign,
});

    return (
        (plan === null || plan === undefined) ?
            <div className='tw-text-center'>No hay un plan seleccionado</div> :
            <div className={``}>
                <DrawerMenu height={HeigtComponent}>
                    <ListItemComp
                        page={page}
                        index={1}
                        setPage={() => handlePage(1)}
                        title='Ajustes' />
                    <ListItemComp
                        page={page}
                        index={0}
                        setPage={() => handlePage(0)}
                        title='Cargar plan' />
                    <ListItemComp
                        page={page}
                        index={2}
                        setPage={() => handlePage(2)}
                        title='Secretarías' />
                    <ListItemComp
                        page={page}
                        index={3}
                        setPage={() => handlePage(3)}
                        title='Localidades' />
                    <ListItemComp
                        page={page}
                        index={4}
                        setPage={() => handlePage(4)}
                        title='Usuario' />
                    <ListItemComp
                        page={page}
                        index={5}
                        setPage={() => handlePage(5)}
                        title='Módulos' />
                </DrawerMenu>
                <div ref={divRef} className='sm:tw-ml-2 md:tw-ml-40 tw-mr-2 xl:tw-ml-40
                            tw-mt-24 md:tw-mt-0'>
                    <div className="tw-flex tw-justify-between tw-mt-1">
                        <BackBtn handle={handleBack} id={id_plan} />
                        <p className="tw-bg-white tw-mb-1 tw-rounded tw-p-1 tw-font-bold">Ajustes</p>
                        <div></div>
                    </div>
                    {page === 0 ?
                        <div>
                            <div>
                                {rol === "admin" || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!) ?
                                    <div>
                                        <FileInput />
                                        <br />
                                        <FileFinancialInput />
                                        <br />
                                    </div>
                                    : null
                                }
                            </div>
                            {rol === "admin" ? <FilePhysicalInput /> : null}<br />
                            {rol === "admin" ? <FileUnitInput /> : null}
                        </div> :
                        page === 1 ?
                            <div className='tw-pb-2'>
                                {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan!) ?
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
                                                <InfoIcon color="action" />
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
                                        <Modal isOpen={modalIsOpen}
                                            onRequestClose={() => setModalIsOpen(false)}>
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
                                {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan!) ?
                                    <div className='tw-flex tw-flex-wrap
                                            tw-justify-center tw-gap-6
                                            tw-ml-4 tw-mt-4 tw-p-4
                                            tw-bg-white
                                            tw-rounded'>
                                        <UploadLogoCity />
                                        <UploadLogoPlan />
                                    </div>
                                    : null
                                }
                                <div className=' tw-justify-center
                                        tw-ml-4 tw-mt-4
                                        tw-bg-white
                                        tw-rounded'>
                                    {rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan!) ?
                                        <div className='tw-mt-4'>
                                            <ColorForm id={id_plan} />
                                        </div>
                                        : null
                                    }
                                </div>

                                {(rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan!)) && (
                                    <div className="tw-bg-white tw-rounded tw-shadow tw-p-6 tw-mt-4 tw-mb-8 tw-mx-4 tw-flex tw-flex-col tw-items-center">
                                        <p className="tw-font-bold tw-mb-4 tw-text-xl tw-font-montserrat tw-text-center">Título del Navbar</p>

                                        {!isEditingNavbarTitle ? (
                                            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
                                                <span
                                                    className="tw-font-montserrat tw-text-lg tw-text-center tw-w-full"
                                                    style={{
                                                        color: textColor,
                                                        fontSize: fontSize,
                                                        fontWeight: fontWeight,
                                                        textAlign: textAlign as any,
                                                    }}
                                                >
                                                    {titleText || <span className="tw-text-gray-400">(Sin título personalizado)</span>}
                                                </span>
                                                <button
                                                    className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-1 tw-rounded hover:tw-bg-blue-700"
                                                    onClick={() => setIsEditingNavbarTitle(true)}
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="tw-w-full tw-flex tw-flex-col tw-gap-4">
                                                <input
                                                    type="text"
                                                    className="tw-border tw-rounded tw-p-2 tw-font-montserrat"
                                                    value={titleText}
                                                    onChange={e => setTitleText(e.target.value)}
                                                    placeholder="Escribe un título para el navbar..."
                                                    maxLength={60}
                                                />

                                                <div className="tw-flex tw-flex-wrap tw-gap-2">
                                                    <label className="tw-flex tw-items-center tw-gap-2">
                                                        Color:
                                                        <input
                                                            type="color"
                                                            value={textColor}
                                                            onChange={e => setTextColor(e.target.value)}
                                                        />
                                                    </label>
                                                    <label className="tw-flex tw-items-center tw-gap-2">
                                                        Tamaño:
                                                        <select
                                                            className="tw-border tw-rounded tw-px-1"
                                                            value={fontSize}
                                                            onChange={e => setFontSize(e.target.value)}
                                                        >
                                                            <option value="14px">Pequeño</option>
                                                            <option value="18px">Mediano</option>
                                                            <option value="24px">Grande</option>
                                                            <option value="32px">Extra Grande</option>
                                                        </select>
                                                    </label>
                                                    <label className="tw-flex tw-items-center tw-gap-2">
                                                        Peso:
                                                        <select
                                                            className="tw-border tw-rounded tw-px-1"
                                                            value={fontWeight}
                                                            onChange={e => setFontWeight(e.target.value as 'normal' | 'bold' | 'lighter')}
                                                        >
                                                            <option value="lighter">Ligero</option>
                                                            <option value="normal">Normal</option>
                                                            <option value="bold">Negrita</option>
                                                        </select>
                                                    </label>
                                                    <label className="tw-flex tw-items-center tw-gap-2">
                                                        Alineación:
                                                        <select
                                                            className="tw-border tw-rounded tw-px-1"
                                                            value={textAlign}
                                                            onChange={e => setTextAlign(e.target.value as 'left' | 'center' | 'right' | 'justify')}
                                                        >
                                                            <option value="left">Izquierda</option>
                                                            <option value="center">Centro</option>
                                                            <option value="right">Derecha</option>
                                                        </select>
                                                    </label>
                                                </div>

                                                <div className="tw-flex tw-justify-center tw-gap-4">
                                                    <button
                                                        className="tw-bg-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-green-700"
                                                        onClick={() => {
                                                            handleSaveTitleConfig();
                                                            setIsEditingNavbarTitle(false);
                                                           // window.location.reload(); // 🔄 Recarga la página
                                                        }}

                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        className="tw-bg-gray-300 tw-text-black tw-px-3 tw-py-1 tw-rounded hover:tw-bg-gray-400"
                                                        onClick={() => setIsEditingNavbarTitle(false)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Sección para editar el slogan del plan indicativo, ahora debajo del resto de paneles */}
                                {(rol === "admin" || (rol === 'funcionario' && id_plan === plan.id_plan!)) && (
                                    <div className="tw-bg-white tw-rounded tw-shadow tw-p-6 tw-mt-4 tw-mb-8 tw-mx-4 tw-flex tw-flex-col tw-items-center">
                                        <p className="tw-font-bold tw-mb-4 tw-text-xl tw-font-montserrat tw-text-center">Slogan del Plan Indicativo</p>
                                        {!isEditingSlogan ? (
                                            <div className="tw-flex tw-items-center tw-gap-4 tw-justify-center">
                                                <span className="tw-text-lg tw-font-montserrat tw-text-center">{slogan && slogan !== 'default' ? slogan : <span className="tw-text-gray-400">(Sin slogan personalizado)</span>}</span>
                                                <button
                                                    className="tw-bg-blue-500 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-blue-700"
                                                    onClick={() => setIsEditingSlogan(true)}
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="tw-flex tw-items-center tw-gap-4 tw-justify-center tw-w-full">
                                                <input
                                                    className="tw-border tw-rounded tw-px-2 tw-py-1 tw-w-full tw-font-montserrat"
                                                    type="text"
                                                    value={editSlogan}
                                                    onChange={e => setEditSlogan(e.target.value)}
                                                    maxLength={100}
                                                    placeholder="Escribe un slogan para el plan..."
                                                />
                                                <button
                                                    className="tw-bg-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-green-700"
                                                    onClick={handleSaveSlogan}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="tw-bg-gray-300 tw-text-black tw-px-3 tw-py-1 tw-rounded hover:tw-bg-gray-400"
                                                    onClick={() => { setIsEditingSlogan(false); setEditSlogan(slogan); }}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            :
                            page === 2 ?
                                <div>
                                    {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
                                        <SecretaryForm />
                                        : null}
                                </div> :
                                page === 3 ?
                                    <div>
                                        {((rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id_plan === plan.id_plan!)) ?
                                            <LocationsFormPage />
                                            : null}
                                    </div> :
                                    page === 4 ?
                                        <div>
                                            <UpdateUserForm />
                                        </div> :
                                        page === 5 ?
                                            <div>
                                                {rol === "admin" ?
                                                    <ModulesForm />
                                                    : null}
                                            </div> :
                                            <p>Ha ocurrido un error</p>
                    }
                </div>
            </div>
    );
}