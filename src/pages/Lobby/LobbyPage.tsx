// Importaciones necesarias de React y librerías
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSupportAgent } from 'react-icons/md';

// Importación de íconos personalizados
import {
    ProjectBankIcon, PlanIndicativoIcon, ChartIcon,
    MapICon, PlanAccionIcon
} from '@/assets/icons';

// Importación de componentes comunes
import { Header, ButtonComponent, BackBtn } from '@/components/Citizen';

// Importación de hooks y acciones de Redux
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

// --- Interfaces y helpers para conversión de permisos ---
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

// Función que convierte un número en permisos de módulos
const decimalToModules = (mask: number | undefined | null): IModules => {
    const validMask = mask || 0;
    const binaryString = validMask.toString(2).padStart(moduleOrder.length, '0');
    const modules: any = {};
    moduleOrder.forEach((key, index) => {
        modules[key] = binaryString[index] === '1';
    });
    return modules;
};

// --- Componente principal ---
export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Estados globales de Redux
    const { id_plan } = useAppSelector(store => store.content);
    const { plan, secretaries, locations } = useAppSelector(store => store.plan);

    // Estado local de módulos habilitados
    const [modulos, setModulos] = useState({
        PlanIndicativo: false,
        PlanDeAccion: false,
        BancoDeProyectos: false,
        POAI: false,
        AtencionCiudadana: false,
        MapaDeIntervencion: false
    });

    // Estado de módulo seleccionado para mostrar descripción
    const [selectedModuleInfo, setSelectedModuleInfo] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);

    // Descripciones de cada módulo
    const moduleExplanations: Record<string, string> = {
        PlanIndicativo: 'Permite consultar y gestionar el Plan Indicativo...',
        PlanDeAccion: 'Acceso al Plan de Acción...',
        BancoDeProyectos: 'Consulta y gestión del Banco de Proyectos...',
        POAI: 'Permite acceder al POAI...',
        AtencionCiudadana: 'Módulo para la atención ciudadana...',
        MapaDeIntervencion: 'Visualiza en un mapa las intervenciones...'
    };

    // --- Efectos de inicialización ---
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

    // Control de permisos de módulos
    useEffect(() => {
        const id = localStorage.getItem('id');
        const rol = localStorage.getItem('rol');

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

        if (plan && id) {
            const planModules = decimalToModules(plan.modules);

            dispatch(thunkGetModulosUsuarioById(parseInt(id)))
                .unwrap()
                .then(userModulesArray => {
                    if (Array.isArray(userModulesArray) && userModulesArray.length > 0) {
                        const userModules = userModulesArray[0];

                        const finalModules = {
                            PlanIndicativo: planModules.indicative_plan && userModules.PlanIndicativo,
                            PlanDeAccion: planModules.action_plan && userModules.PlanDeAccion,
                            BancoDeProyectos: planModules.project_bank && userModules.BancoDeProyectos,
                            POAI: planModules.poai && userModules.POAI,
                            AtencionCiudadana: planModules.citizen_service && userModules.AtencionCiudadana,
                            MapaDeIntervencion: planModules.intervention_map && userModules.MapaDeIntervencion,
                        };

                        setModulos(finalModules);
                    }
                })
                .catch(() => {
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

    // Cargar coordenadas de ubicación
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

    // Control de animación al mostrar descripción
    useEffect(() => {
        setIsAnimating(!!selectedModuleInfo);
    }, [selectedModuleInfo]);

    return (
        // Contenedor full-screen con el degradado solicitado
        <div className="tw-min-h-screen tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center 
                        tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6]">

            {/* Card principal */}
            <div className="tw-w-[95%] tw-h-auto tw-mx-2 tw-my-4 tw-p-4 tw-bg-white tw-rounded-2xl tw-shadow-lg 
                            tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-justify-start
                            md:tw-w-[80%] md:tw-h-[85%] md:tw-mx-4 md:tw-my-4 md:tw-p-8">

                {/* Header con botón atrás y descripción */}
                <Header columns={3} rightPanel={(
                    <div
                        className="tw-bg-gray-100 tw-p-3 tw-rounded-xl tw-shadow-md 
                               tw-min-w-[180px] tw-text-black tw-mx-auto 
                               tw-text-center tw-text-base tw-transition-all 
                               tw-duration-500 tw-ease-in-out tw-whitespace-normal tw-break-words"
                        style={{
                            opacity: 1,
                            transition: 'opacity 0.5s, transform 0.5s',
                            transform: selectedModuleInfo ? 'translateY(0)' : 'translateY(10px)'
                        }}
                    >
                        {selectedModuleInfo ? (
                            <>
                                <h3 className="tw-font-bold tw-text-lg tw-mb-2">
                                    {selectedModuleInfo}
                                </h3>
                            </>
                        ) : (
                            <span className="tw-text-black tw-opacity-60">
                                Selecciona un módulo para ver su descripción.
                            </span>
                        )}
                    </div>

                )}>

                    {/* Botón volver */}
                    <div className="tw-flex tw-flex-col tw-items-start">
                        <div className="tw-mb-4">
                            <BackBtn handle={() => navigate(-1)} id={0} />
                        </div>
                    </div>

                    {/* Grid de módulos */}
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-2 tw-justify-center tw-items-center">
                        {Object.values(modulos).every(v => !v) ? (
                            <div className="tw-col-span-2 tw-text-center tw-text-red-600 tw-font-semibold tw-p-8">
                                No tienes módulos disponibles para este plan.
                            </div>
                        ) : (
                            <>
                                {/* Plan Indicativo */}
                                {modulos.PlanIndicativo && (
                                    <div key="PlanIndicativo"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.PlanIndicativo)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text='Plan indicativo'
                                            icon={<PlanIndicativoIcon color='white' />}
                                            onClick={() => {
                                                dispatch(AddRootTree([]));
                                                dispatch(selectOption(0));
                                                navigate(`/pdt/PlanIndicativo`);
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
                                        />
                                    </div>
                                )}
                                {/* Plan de Acción */}
                                {modulos.PlanDeAccion && (
                                    <div key="PlanDeAccion"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.PlanDeAccion)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text='Plan de acción'
                                            icon={<PlanAccionIcon color='white' />}
                                            onClick={() => {
                                                dispatch(selectOption(1));
                                                navigate('/PlanIndicativo/Plan-accion');
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
                                        />
                                    </div>
                                )}
                                {/* Banco de Proyectos */}
                                {modulos.BancoDeProyectos && (
                                    <div key="BancoDeProyectos"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.BancoDeProyectos)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text='Banco de proyectos'
                                            icon={<ProjectBankIcon color='white' />}
                                            onClick={() => {
                                                dispatch(selectOption(2));
                                                dispatch(setProjectPage(5));
                                                navigate('/PlanIndicativo/Banco-proyectos');
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
                                        />
                                    </div>
                                )}
                                {/* POAI */}
                                {modulos.POAI && (
                                    <div key="POAI"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.POAI)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text='POAI'
                                            icon={<ChartIcon color='white' />}
                                            onClick={() => {
                                                dispatch(selectOption(3));
                                                navigate('/PlanIndicativo/POAI');
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
                                        />
                                    </div>
                                )}
                                {/* Atención Ciudadana */}
                                {modulos.AtencionCiudadana && (
                                    <div key="AtencionCiudadana"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.AtencionCiudadana)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text="Atención Ciudadana"
                                            icon={<MdSupportAgent color="white" size={64} />}
                                            onClick={() => {
                                                dispatch(selectOption(4));
                                                navigate("/AtencionCiudadana");
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
                                        />
                                    </div>
                                )}
                                {/* Mapa de Intervención */}
                                {modulos.MapaDeIntervencion && (
                                    <div key="MapaDeIntervencion"
                                        onMouseEnter={() => setSelectedModuleInfo(moduleExplanations.MapaDeIntervencion)}
                                        onMouseLeave={() => setSelectedModuleInfo("")}>
                                        <ButtonComponent
                                            inside={false}
                                            text='Mapa de intervención'
                                            icon={<MapICon color='white' />}
                                            onClick={() => {
                                                dispatch(selectOption(5));
                                                navigate('/PlanIndicativo/Mapa');
                                            }}
                                            bgColor="tw-bg-[#012947]"
                                            className="tw-w-16 tw-h-16 tw-text-[8px] tw-font-bold"
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
