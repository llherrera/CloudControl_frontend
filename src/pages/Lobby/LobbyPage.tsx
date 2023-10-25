import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastPDT } from '../../services/api';
import { Header, ButtonComponent } from '../../components';
import { decode } from '../../utils/decode';
import { Token } from '../../interfaces';
import { getToken, removeToken } from '@/utils';
import { thunkLogout } from '@/store/auth/thunks';
import { useDispatch } from 'react-redux';

export const LobbyPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        const gettoken = getToken()
        try {
            let {token} = gettoken ? gettoken : null
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
            src="/src/assets/images/plan-indicativo.png"
            onClick={handleButton}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Banco de proyectos'
            src="/src/assets/images/Banco-proyectos.png"
            onClick={() => navigate('/')}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='POAI'
            src="/src/assets/images/POAI.png"
            onClick={() => navigate('/')}
            bgColor="tw-bg-greenBtn" />,
        <ButtonComponent
            inside={false}
            text='Plan de acción'
            src="/src/assets/images/Plan-accion.png"
            onClick={() => navigate('/')}
            bgColor="tw-bg-greenBtn" />,
        //{
        //    inside: false,
        //    text: 'Salir',
        //    src: "/src/assets/images/exit.png",
        //    onClick: handleLogout,
        //    bgColor: "tw-bg-red-500"
        //}
    ]

    return (
        <Header componentes={buttons}/>
    );
}
