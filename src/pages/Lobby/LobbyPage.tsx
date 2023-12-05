import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header, ButtonComponent } from '../../components';
import { MapICon } from '@/assets/icons';
import { Token } from '@/interfaces';

import { getLastPDT } from '../../services/api';
import { decode } from '../../utils/decode';
import { getToken } from '@/utils';

import { useAppDispatch } from '@/store';
import { selectOption } from '@/store/content/contentSlice';

export const LobbyPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        const gettoken = getToken()
        try {
            let {token} = gettoken
            if (token !== null || token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleButton = () => {
        if (rol === "admin") {
            navigate('/pdt')
            return
        }else if (rol === "funcionario") {
            navigate(`/pdt/PlanIndicativo`, {state: {id}})
            return
        }
        getLastPDT()
            .then((e) => {
                console.log(e);
                if (e.id_plan)
                    navigate(`/pdt/PlanIndicativo`, {state: {id: e.id_plan}})
                else
                    alert("No hay un PDT disponible")             
            })
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
