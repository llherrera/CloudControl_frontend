import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header, ButtonComponent } from '../../components';
import { MapICon } from '@/assets/icons';
import { Token } from '@/interfaces';

import { getLastPDT } from '../../services/api';
import { decode } from '../../utils/decode';
import { getToken } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption } from '@/store/content/contentSlice';

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token_info } = useAppSelector(state => state.auth)
    const { id_plan } = useAppSelector(state => state.content)

    let rol = "";
    let id = id_plan !== 0 ? id_plan : 0;
    
    if (token_info?.token !== undefined) {
        const decoded = decode(token_info.token)
        rol = decoded.rol
        id = decoded.id_plan
    }

    const handleButton = () => {
        navigate(`/pdt/PlanIndicativo`, {state: {id}})
    }

    const buttons: React.ReactNode[] = [
        <ButtonComponent
            inside={false}
            text='Plan indicativo'
            src="/src/assets/icons/plan-indicativo.svg"
            onClick={()=>{
                dispatch(selectOption(0))
                handleButton()}}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Banco de proyectos'
            src="/src/assets/icons/Banco-proyectos.svg"
            onClick={() => {
                dispatch(selectOption(1))
                navigate('/PlanIndicativo/Banco-proyectos')}}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='POAI'
            src="/src/assets/icons/POAI.svg"
            onClick={() => {
                dispatch(selectOption(2))
                navigate('/PlanIndicativo/POAI')}}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Plan de acción'
            onClick={() => {
                dispatch(selectOption(3))
                navigate('/PlanIndicativo/Mapa')}}
            bgColor="tw-bg-greenBtn"
            icon={<MapICon color='white'/>}/>,
    ]

    return (
        <Header componentes={buttons}/>
    );
}
