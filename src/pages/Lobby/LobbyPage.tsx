import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSupportAgent } from 'react-icons/md';

import {
    ProjectBankIcon, PlanIndicativoIcon, ChartIcon,
    MapICon, PlanAccionIcon
} from '@/assets/icons';

import { Header, ButtonComponent } from '@/components';

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

    return (
        <Header>
            <>
                {modulos.PlanIndicativo && (
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
                    />
                )}
            </>
            <>
                {modulos.PlanDeAccion && (

                    <ButtonComponent
                        inside={false}
                        text='Plan de acción'
                        icon={<PlanAccionIcon color='white' />}
                        onClick={() => {
                            dispatch(selectOption(1));
                            navigate('/PlanIndicativo/Plan-accion');
                        }}
                        bgColor="tw-bg-greenBtn"
                    />

                )}
            </>
            <>
                {modulos.BancoDeProyectos && (

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
                    />
                )}
            </>
            <>
                {modulos.POAI && (
                    <ButtonComponent
                        inside={false}
                        text='POAI'
                        icon={<ChartIcon color='white' />}
                        onClick={() => {
                            dispatch(selectOption(3));
                            navigate('/PlanIndicativo/POAI');
                        }}
                        bgColor="tw-bg-greenBtn"
                    />
                )}
            </>
            <>
                {modulos.AtencionCiudadana && (
                    <ButtonComponent
                        inside={false}
                        text="Atención Ciudadana"
                        icon={<MdSupportAgent color="white" size={64} />}
                        onClick={() => {
                            dispatch(selectOption(4));
                            navigate("/AtencionCiudadana");
                        }}
                        bgColor="tw-bg-greenBtn"
                    />
                )}
            </>
            <>
                {modulos.MapaDeIntervencion && (

                    <ButtonComponent
                        inside={false}
                        text='Mapa de intervención'
                        icon={<MapICon color='white' />}
                        onClick={() => {
                            dispatch(selectOption(5));
                            navigate('/PlanIndicativo/Mapa');
                        }}
                        bgColor="tw-bg-greenBtn"
                    />
                )}
            </>
            {/*<ButtonComponent
                inside={false}
                text='PQRS'
                onClick={() => {
                    dispatch(selectOption(5));
                    navigate('/PQRS');
                }}
                bgColor="tw-bg-greenBtn"
                icon={<PQRSIcon color='white'/>}/>*/}
        </Header>
    );
}
