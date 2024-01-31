import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import planLogo from '@/assets/icons/plan-indicativo.svg';
import bankLogo from '@/assets/icons/Banco-proyectos.svg';
import POAILogo from '@/assets/icons/Point.svg';

import { Header, ButtonComponent } from '@/components';
import { MapICon } from '@/assets/icons';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption } from '@/store/content/contentSlice';
import { thunkGetLevelsById } from '@/store/plan/thunks';
import { setPlanLocation, setZeroLevelIndex, AddRootTree } from '@/store/plan/planSlice';

import { getEnvironment } from '@/utils';
import { useJsApiLoader } from '@react-google-maps/api';

const { API_KEY } = getEnvironment();

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id_plan } = useAppSelector(state => state.content);
    const { plan } = useAppSelector(store => store.plan);
    const { isLoaded, loadError} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY??''
    });

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan.toString()));
        dispatch(setZeroLevelIndex());
    }, [])

    useEffect(() => {
        const fetchLocation = async () => {
            if (plan === undefined || !isLoaded || loadError) return;
            const geocoder = new google.maps.Geocoder();
            await geocoder.geocode({address: `Colombia, ${plan?.department}, ${plan?.municipality}`})
            .then((res) => {
                let location = res.results[0].geometry.location;
                dispatch(setPlanLocation({
                    lat: location.lat(),
                    lng: location.lng()
                }));
            });
        }
        fetchLocation();
    }, [isLoaded, plan]);

    const buttons: React.ReactNode[] = [
        <ButtonComponent
            inside={false}
            text='Plan indicativo'
            src={planLogo}
            onClick={() => {
                dispatch(AddRootTree([]));
                dispatch(selectOption(0))
                navigate(`/pdt/PlanIndicativo`)
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Banco de proyectos'
            src={bankLogo}
            onClick={() => {
                dispatch(selectOption(1))
                navigate('/PlanIndicativo/Banco-proyectos')
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='POAI'
            src={POAILogo}
            onClick={() => {
                dispatch(selectOption(2))
                navigate('/PlanIndicativo/POAI')
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Mapa de intervención'
            onClick={() => {
                dispatch(selectOption(3))
                navigate('/PlanIndicativo/Mapa')
            }}
            bgColor="tw-bg-greenBtn"
            icon={<MapICon color='white'/>}/>,
    ];

    return (
        <Header components={buttons}/>
    );
}
