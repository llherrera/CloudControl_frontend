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
    
        if (rol === 'admin') {
            setModulos({
                PlanIndicativo: true,
                PlanDeAccion: true,
                BancoDeProyectos: true,
                POAI: true,
                AtencionCiudadana: true,
                MapaDeIntervencion: true
            });
            return; // No necesitas llamar al thunk si es admin
        }
    
        if (id !== null) {
            dispatch(thunkGetModulosUsuarioById(parseInt(id)))
                .unwrap()
                .then(res => {
                    if (Array.isArray(res) && res.length > 0) {
                        setModulos(res[0]);
                    }
                })
                .catch(err => {
                    console.error('Error al obtener los módulos:', err);
                });
        }
    }, [dispatch]);    

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
