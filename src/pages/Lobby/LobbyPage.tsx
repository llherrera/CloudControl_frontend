import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSupportAgent } from 'react-icons/md';

import {
    ProjectBankIcon, PlanIndicativoIcon, ChartIcon,
    MapICon, PlanAccionIcon
} from '@/assets/icons';

import { Header, ButtonComponent, BackBtn } from '@/components';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption, setProjectPage } from '@/store/content/contentSlice';
import {
    thunkGetLevelsById, thunkGetPDTid, thunkGetLocations,
    thunkGetSecretaries
} from '@/store/plan/thunks';
import {
    setPlanLocation, setZeroLevelIndex, AddRootTree,
    setBoundingbox
} from '@/store/plan/planSlice';

import { getCoords } from '@/services/map_api';
import { thunkGetModulosUsuarioById } from '@/store/pqrs/thunks';
import { log } from 'node:console';

// --- Module Conversion Helpers ---
interface IModules {
    indicative_plan: boolean;
    action_plan: boolean;
    project_bank: boolean;
    poai: boolean;
    citizen_service: boolean;
    intervention_map: boolean;
}

const moduleOrder: (keyof IModules)[] = [
    'indicative_plan', 'action_plan', 'project_bank', 'poai', 'citizen_service', 'intervention_map'
];

const decimalToModules = (mask: number | undefined | null): IModules => {
    const validMask = mask || 0;
    const binaryString = validMask.toString(2).padStart(moduleOrder.length, '0');
    const modules: any = {};
    moduleOrder.forEach((key, index) => {
        modules[key] = binaryString[index] === '1';
    });
    return modules;
};

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id_plan } = useAppSelector(store => store.content);
    const { plan, secretaries, locations } = useAppSelector(store => store.plan);

    const [modulos, setModulos] = useState({
        PlanIndicativo: false,
        PlanDeAccion: false,
        BancoDeProyectos: false,
        POAI: false,
        AtencionCiudadana: false,
        MapaDeIntervencion: false
    });

    const [selectedModuleInfo, setSelectedModuleInfo] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);

    const moduleDescriptions: Record<string, string> = {
        PlanIndicativo: "Consulta y gestión del Plan Indicativo, donde se visualizan y administran las metas estratégicas del plan de desarrollo.",
        PlanDeAccion: "Accede al Plan de Acción para planificar, ejecutar y hacer seguimiento a las actividades anuales.",
        BancoDeProyectos: "Gestiona el Banco de Proyectos, donde se registran, evalúan y priorizan los proyectos institucionales.",
        POAI: "Consulta y administra el Plan Operativo Anual de Inversiones (POAI), que define la asignación de recursos para los proyectos.",
        AtencionCiudadana: "Gestiona la atención ciudadana, permitiendo la recepción y seguimiento de solicitudes, quejas y reclamos.",
        MapaDeIntervencion: "Visualiza el Mapa de Intervención para identificar geográficamente las acciones y proyectos ejecutados.",
    };

    // Explicaciones de cada módulo
    const moduleExplanations: Record<string, string> = {
        PlanIndicativo: 'Permite consultar y gestionar el Plan Indicativo, donde se visualizan y administran las metas y resultados del plan de desarrollo.',
        PlanDeAccion: 'Acceso al Plan de Acción, donde se planifican y hacen seguimiento a las actividades y acciones específicas para cumplir los objetivos.',
        BancoDeProyectos: 'Consulta y gestión del Banco de Proyectos, que contiene los proyectos propuestos o en ejecución dentro del plan.',
        POAI: 'Permite acceder al Plan Operativo Anual de Inversiones (POAI), donde se visualizan las inversiones programadas para el año.',
        AtencionCiudadana: 'Módulo para la atención de solicitudes, quejas, reclamos y sugerencias de la ciudadanía.',
        MapaDeIntervencion: 'Visualiza en un mapa geográfico las intervenciones y proyectos realizados o planificados en el territorio.'
    };

    useEffect(() => {
        if (plan == undefined) dispatch(thunkGetPDTid(id_plan));
    }, []);

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan));
        dispatch(setZeroLevelIndex());
    }, []);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined) dispatch(thunkGetSecretaries(id_plan));
        if (locations == undefined) dispatch(thunkGetLocations(id_plan));
    }, [id_plan]);

    useEffect(() => {
        const id = localStorage.getItem('id');
        const rol = localStorage.getItem('rol');

        // Priority 1: Admin has access to everything
        if (rol === 'admin') {
            setModulos({
                PlanIndicativo: true,
                PlanDeAccion: true,
                BancoDeProyectos: true,
                POAI: true,
                AtencionCiudadana: true,
                MapaDeIntervencion: true
            });
            return;
        }

        // For non-admins, access depends on plan and user permissions
        if (plan && id) {
            // Priority 2: Plan-level permissions from bitmask
            const planModules = decimalToModules(plan.modules);

            // Priority 3: User-level permissions from API
            dispatch(thunkGetModulosUsuarioById(parseInt(id)))
                .unwrap()
                .then(userModulesArray => {
                    if (Array.isArray(userModulesArray) && userModulesArray.length > 0) {
                        const userModules = userModulesArray[0];

                        // Combine permissions: a module is active only if allowed by BOTH plan and user
                        const finalModules = {
                            PlanIndicativo: planModules.indicative_plan && userModules.PlanIndicativo,
                            PlanDeAccion: planModules.action_plan && userModules.PlanDeAccion,
                            BancoDeProyectos: planModules.project_bank && userModules.BancoDeProyectos,
                            POAI: planModules.poai && userModules.POAI,
                            AtencionCiudadana: planModules.citizen_service && userModules.AtencionCiudadana,
                            MapaDeIntervencion: planModules.intervention_map && userModules.MapaDeIntervencion,
                        };

                        // Apply specific business logic/overrides
                        if (plan.id_plan === 10044) {
                            finalModules.AtencionCiudadana = false;
                        }

                        setModulos(finalModules);
                    }
                })
                .catch(err => {
                    console.error('Error al obtener los módulos de usuario:', err);
                     // Fallback to all modules disabled if user permissions fail
                    setModulos({
                        PlanIndicativo: false,
                        PlanDeAccion: false,
                        BancoDeProyectos: false,
                        POAI: false,
                        AtencionCiudadana: false,
                        MapaDeIntervencion: false
                    });
                });
        }
    }, [dispatch, id_plan, plan]);
    

    useEffect(() => {
        const fetchLocation = async () => {
            if (plan === undefined) return;
            const res = await getCoords(
                plan.municipality.toLowerCase().normalize('NFD'),
                plan.department.toLowerCase().normalize('NFD'),
                'Colombia'
            );
            dispatch(setPlanLocation({
                lat: parseFloat(res.lat),
                lng: parseFloat(res.lon)
            }));
            dispatch(setBoundingbox(
                res.boundingbox.map(b => parseFloat(b))
            ));
        }
        fetchLocation();
    }, [plan]);

    // Determinar el título del módulo seleccionado
    let selectedModuleTitle = '';
    if (selectedModuleInfo) {
        selectedModuleTitle = Object.keys(moduleExplanations).find(
            key => moduleExplanations[key] === selectedModuleInfo
        ) || '';
        // Convertir a texto legible
        if (selectedModuleTitle === 'PlanIndicativo') selectedModuleTitle = 'Plan indicativo';
        if (selectedModuleTitle === 'PlanDeAccion') selectedModuleTitle = 'Plan de acción';
        if (selectedModuleTitle === 'BancoDeProyectos') selectedModuleTitle = 'Banco de proyectos';
        if (selectedModuleTitle === 'POAI') selectedModuleTitle = 'POAI';
        if (selectedModuleTitle === 'AtencionCiudadana') selectedModuleTitle = 'Atención Ciudadana';
        if (selectedModuleTitle === 'MapaDeIntervencion') selectedModuleTitle = 'Mapa de intervención';
    }

    // Efecto para manejar la animación
    useEffect(() => {
        if (selectedModuleInfo) {
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
        }
    }, [selectedModuleInfo]);

    return (
        <div className="tw-min-h-screen tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-100 tw-to-green-300">
            <div className="tw-w-[95%] tw-h-auto tw-mx-2 tw-my-4 tw-p-4 tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-justify-start
                md:tw-w-[80%] md:tw-h-[85%] md:tw-mx-4 md:tw-my-4 md:tw-p-8">
                <Header columns={3} rightPanel={(
                    <div className="tw-bg-gray-100 tw-p-3 tw-rounded-xl tw-shadow-md tw-min-w-[180px] tw-max-w-[260px] tw-text-black tw-mx-auto tw-text-center tw-text-base tw-transition-all tw-duration-500 tw-ease-in-out"
                        style={{
                            opacity: 1,
                            transition: 'opacity 0.5s, transform 0.5s',
                            transform: selectedModuleInfo ? 'translateY(0)' : 'translateY(10px)'
                        }}>
                        {selectedModuleInfo ? (
                            <>
                                {selectedModuleTitle && <h3 className="tw-font-bold tw-text-lg tw-mb-2">{selectedModuleTitle}</h3>}
                                <span>{selectedModuleInfo}</span>
                            </>
                        ) : (
                            <span className="tw-text-black tw-opacity-60">Selecciona un módulo para ver su descripción.</span>
                        )}
                    </div>
                )}>
                    {/* Columna 1: BackBtn y logo (ya está en Header) */}
                    <div className="tw-flex tw-flex-col tw-items-start">
                        <div className="tw-mb-4">
                            <BackBtn handle={() => navigate(-1)} id={0} />
                        </div>
                    </div>
                    {/* Columna 2: módulos */}
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-2 tw-justify-center tw-items-center">
                        {Object.values(modulos).every(v => !v) ? (
                            <div className="tw-col-span-2 tw-text-center tw-text-red-600 tw-font-semibold tw-p-8">
                                No tienes módulos disponibles para este plan. Por favor, contacta al administrador si crees que esto es un error.
                            </div>
                        ) : (
                            <>
                        {modulos.PlanIndicativo && (
                    <div key="PlanIndicativo" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.PlanIndicativo)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text='Plan indicativo'
                            icon={<PlanIndicativoIcon color='white' />}
                            onClick={() => {
                                dispatch(AddRootTree([]));
                                dispatch(selectOption(0));
                                navigate(`/pdt/PlanIndicativo`);
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                        />
                    </div>
                        )}
                        {modulos.PlanDeAccion && (
                    <div key="PlanDeAccion" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.PlanDeAccion)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text='Plan de acción'
                            icon={<PlanAccionIcon color='white' />}
                            onClick={() => {
                                dispatch(selectOption(1));
                                navigate('/PlanIndicativo/Plan-accion');
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                        />
                    </div>
                        )}
                        {modulos.BancoDeProyectos && (
                    <div key="BancoDeProyectos" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.BancoDeProyectos)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text='Banco de proyectos'
                            icon={<ProjectBankIcon color='white' />}
                            onClick={() => {
                                dispatch(selectOption(2));
                                dispatch(setProjectPage(5));
                                navigate('/PlanIndicativo/Banco-proyectos');
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                        />
                    </div>
                        )}
                        {modulos.POAI && (
                    <div key="POAI" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.POAI)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text='POAI'
                            icon={<ChartIcon color='white' />}
                            onClick={() => {
                                dispatch(selectOption(3));
                                navigate('/PlanIndicativo/POAI');
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                        />
                    </div>
                        )}
                        {modulos.AtencionCiudadana && (
                    <div key="AtencionCiudadana" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.AtencionCiudadana)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text="Atención Ciudadana"
                                    icon={<MdSupportAgent color="white" size={64} />}
                            onClick={() => {
                                dispatch(selectOption(4));
                                navigate("/AtencionCiudadana");
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                        />
                    </div>
                        )}
                        {modulos.MapaDeIntervencion && (
                    <div key="MapaDeIntervencion" onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.MapaDeIntervencion)} onMouseLeave={() => setSelectedModuleInfo("")}>
                        <ButtonComponent
                            inside={false}
                            text='Mapa de intervención'
                            icon={<MapICon color='white' />}
                            onClick={() => {
                                dispatch(selectOption(5));
                                navigate('/PlanIndicativo/Mapa');
                            }}
                            bgColor="tw-bg-greenBtn"
                                    className="tw-w-16 tw-h-16 tw-text-[8px]"
                                />
                            </div>
                        )}
                    </>
                        )}
                    </div>
                </Header>
            </div>
        </div>
    );
}
