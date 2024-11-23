import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import planLogo from '@/assets/icons/plan-indicativo.svg';
import bankLogo from '@/assets/icons/BancoProyectoLogo.svg';
import POAILogo from '@/assets/icons/POAI.svg';
import MapaLogo from '@/assets/icons/MapaIndicativoLogo.svg'

import { Header, ButtonComponent } from '@/components';
import { MapICon, PQRSIcon, POAIIcon, CheckICon, MapaIcon } from '@/assets/icons';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption, setProjectPage } from '@/store/content/contentSlice';
import { thunkGetLevelsById, thunkGetPDTid,
    thunkGetLocations, thunkGetSecretaries } from '@/store/plan/thunks';
import {
    setPlanLocation,
    setZeroLevelIndex,
    AddRootTree,
    setBoundingbox } from '@/store/plan/planSlice';

import { getCoords } from '@/services/map_api';

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id_plan } = useAppSelector(store => store.content);
    const { plan, secretaries, locations } = useAppSelector(store => store.plan);

    useEffect(() => {
        if (plan == undefined) dispatch(thunkGetPDTid(id_plan));
    }, []);

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan));
        dispatch(setZeroLevelIndex());
    }, []);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined)
            dispatch(thunkGetSecretaries(id_plan));
        if (locations == undefined)
            dispatch(thunkGetLocations(id_plan));
    }, [id_plan]);

    useEffect(() => {
        const fetchLocation = async () => {
            if (plan === undefined) return;
            await getCoords(
                plan.municipality.toLowerCase().normalize('NFD'), 
                plan.department.toLowerCase().normalize('NFD'), 
                'Colombia')
            .then(res => {
                dispatch(setPlanLocation({
                    lat: parseFloat(res.lat),
                    lng: parseFloat(res.lon)
                }));
                dispatch(setBoundingbox(
                    res.boundingbox.map(b => parseFloat(b))
                ));
            })
        }
        fetchLocation();
    }, [plan]);

    return (
        <Header>
            <ButtonComponent
                key={0}
                inside={false}
                text='Plan indicativo'
                onClick={() => {
                    dispatch(AddRootTree([]));
                    dispatch(selectOption(0));
                    navigate(`/pdt/PlanIndicativo`);
                }}
                bgColor="tw-bg-greenBtn"
                icon={<CheckICon color='white'/>}/>
            <ButtonComponent
                key={1}
                inside={false}
                text='Banco de proyectos'
                src={bankLogo}
                onClick={() => {
                    dispatch(selectOption(1));
                    dispatch(setProjectPage(5));
                    navigate('/PlanIndicativo/Banco-proyectos');
                }}
                bgColor="tw-bg-greenBtn" />
            <ButtonComponent
                key={2}
                inside={false}
                text='POAI'
                src={POAILogo}
                onClick={() => {
                    dispatch(selectOption(2));
                    navigate('/PlanIndicativo/POAI');
                }}
                bgColor="tw-bg-greenBtn"/>
            <ButtonComponent
                key={3}
                inside={false}
                text='Mapa de intervención'
                src={MapaLogo}
                onClick={() => {
                    dispatch(selectOption(3));
                    navigate('/PlanIndicativo/Mapa');
                }}
                bgColor="tw-bg-greenBtn"/>
            {/*<ButtonComponent
                key={4}
                inside={false}
                text='PQRS'
                onClick={() => {
                    dispatch(selectOption(4));
                    navigate('/PQRS');
                }}
                bgColor="tw-bg-greenBtn"
                icon={<PQRSIcon color='white'/>}/>*/}
        </Header>
    );
}
