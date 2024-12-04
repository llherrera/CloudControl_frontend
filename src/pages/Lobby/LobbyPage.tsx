import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectBankIcon, PlanIndicativoIcon, ChartIcon,
    MapICon } from '@/assets/icons';

import { Header, ButtonComponent } from '@/components';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption, setProjectPage } from '@/store/content/contentSlice';
import { thunkGetLevelsById, thunkGetPDTid, thunkGetLocations,
    thunkGetSecretaries } from '@/store/plan/thunks';
import { setPlanLocation, setZeroLevelIndex, AddRootTree,
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
        if (secretaries == undefined) dispatch(thunkGetSecretaries(id_plan));
        if (locations == undefined) dispatch(thunkGetLocations(id_plan));
    }, [id_plan]);

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
            <ButtonComponent
                inside={false}
                text='Plan indicativo'
                icon={<PlanIndicativoIcon color='white'/>}
                onClick={() => {
                    dispatch(AddRootTree([]));
                    dispatch(selectOption(0));
                    navigate(`/pdt/PlanIndicativo`);
                }}
                bgColor="tw-bg-greenBtn"/>
            <ButtonComponent
                inside={false}
                text='Banco de proyectos'
                icon={<ProjectBankIcon color='white'/>}
                onClick={() => {
                    dispatch(selectOption(1));
                    dispatch(setProjectPage(5));
                    navigate('/PlanIndicativo/Banco-proyectos');
                }}
                bgColor="tw-bg-greenBtn" />
            <ButtonComponent
                inside={false}
                text='POAI'
                icon={<ChartIcon color='white'/>}
                onClick={() => {
                    dispatch(selectOption(2));
                    navigate('/PlanIndicativo/POAI');
                }}
                bgColor="tw-bg-greenBtn"/>
            <ButtonComponent
                inside={false}
                text='Mapa de intervención'
                icon={<MapICon color='white'/>}
                onClick={() => {
                    dispatch(selectOption(3));
                    navigate('/PlanIndicativo/Mapa');
                }}
                bgColor="tw-bg-greenBtn"/>
            {/*<ButtonComponent
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
