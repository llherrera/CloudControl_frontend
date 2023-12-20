import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header, ButtonComponent } from '../../components';
import { MapICon } from '@/assets/icons';
import { decode } from '../../utils/decode';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption } from '@/store/content/contentSlice';
import { thunkGetLevelsById } from '@/store/plan/thunks';
import { setPlanLocation, setZeroLevelIndex } from '@/store/plan/planSlice';

import { getGoogleApiKey } from '@/utils';
import { useJsApiLoader } from '@react-google-maps/api';

const { API_KEY } = getGoogleApiKey();

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token_info } = useAppSelector(state => state.auth)
    const { id_plan } = useAppSelector(state => state.content)
    const { plan } = useAppSelector(store => store.plan)
    const { isLoaded, loadError} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    let rol = "";

    if (token_info?.token !== undefined) {
        const decoded = decode(token_info.token)
        rol = decoded.rol
    }

    useEffect(() => {
        dispatch(thunkGetLevelsById(id_plan.toString()));
        dispatch(setZeroLevelIndex());
    }, [])

    useEffect(() => {
        if (!plan || !isLoaded || loadError) return;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: `Colombia, ${plan?.Departamento}, ${plan?.Municipio}`}).then((res) => {
            let location = res.results[0].geometry.location;
            dispatch(setPlanLocation({
                lat: location.lat(),
                lng: location.lng()
            }));
        });
    });

    const buttons: React.ReactNode[] = [
        <ButtonComponent
            inside={false}
            text='Plan indicativo'
            src="/src/assets/icons/plan-indicativo.svg"
            onClick={() => {
                dispatch(selectOption(0))
                navigate(`/pdt/PlanIndicativo`, {state: {id: id_plan}})
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Banco de proyectos'
            src="/src/assets/icons/Banco-proyectos.svg"
            onClick={() => {
                dispatch(selectOption(1))
                navigate('/PlanIndicativo/Banco-proyectos', {state: {id: id_plan}})
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='POAI'
            src="/src/assets/icons/POAI.svg"
            onClick={() => {
                dispatch(selectOption(2))
                navigate('/PlanIndicativo/POAI', {state: {id: id_plan}})
            }}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Mapa de intervención'
            onClick={() => {
                dispatch(selectOption(3))
                navigate('/PlanIndicativo/Mapa', {state: {id: id_plan}})
            }}
            bgColor="tw-bg-greenBtn"
            icon={<MapICon color='white'/>}/>,
    ]

    return (
        <Header componentes={buttons}/>
    );
}
