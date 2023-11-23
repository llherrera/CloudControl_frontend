import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLastPDT } from '../../services/api';
import { Header, ButtonComponent } from '../../components';
import { decode } from '../../utils/decode';
import { Token } from '@/interfaces';
import { getToken } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectOption } from '@/store/content/contentSlice';

export const LobbyPage = () => {
    const index = useAppSelector((state) => state.content.index);
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
            navigate(`/pdt/${id}`)
            return
        }
        getLastPDT()
            .then((e) => {
                console.log(e);
                if (e.id_plan)
                    navigate(`/pdt/${e.id_plan}`)
                else
                    alert("No hay un PDT disponible")             
            })
    }

    //const handleLogout = () => {
    //    dispatch(thunkLogout())
    //    navigate('/')
    //}

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
                navigate('/')}}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='POAI'
            src="/src/assets/icons/POAI.svg"
            onClick={() => {
                dispatch(selectOption(2))
                navigate('/')}}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Plan de acción'
            src="/src/assets/icons/Plan-accion.svg"
            onClick={() => {
                dispatch(selectOption(3))
                navigate('/')}}
            bgColor="tw-bg-greenBtn" />,
    ]

    return (
        <Header componentes={buttons}/>
    );
}
