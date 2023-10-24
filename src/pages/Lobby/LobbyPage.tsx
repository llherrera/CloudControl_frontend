import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastPDT } from '../../services/api';
import { ButtonComponent, Header } from '../../components';
import { decode } from '../../utils/decode';
import { Token } from '../../interfaces';
import { getToken, removeToken } from '@/utils';

export const LobbyPage = () => {
    const navigate = useNavigate();

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        const {token} = getToken()
        try {
            if (token !== null && token !== undefined) {
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

    const handleLogout = () => {
        removeToken()
        navigate('/')
    }

    const buttons = [
        <ButtonComponent 
            inside={false} 
            text='Plan indicativo' 
            src="\src\assets\images\Plan-indicativo.png" 
            onClick={handleButton}
            bgColor="greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='Banco de proyectos' 
            src="\src\assets\images\Banco-proyectos.png" 
            onClick={() => navigate('/login')}
            bgColor="greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='POAI' 
            src="\src\assets\images\POAI.png" 
            onClick={() => navigate('/login')}
            bgColor="greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='Plan de accion' 
            src="\src\assets\images\Plan-accion.png" 
            onClick={() => navigate('/login')}
            bgColor="greenBtn"/>
    ]

    return (
        <Header componentes={buttons}/>
    );
}
