import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '../../store';
import { thunkLogout } from '@/store/auth/thunks';
import { setLogo } from '@/store/content/contentSlice';

import { NavBar } from '..';
import { BancoProyectoIcon, PlanIndicativoIcon, 
        POAIIcon, MapICon } from '../../assets/icons';
import { FrameProps } from '@/interfaces';

export const Frame = (props: FrameProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector(state => state.plan);
    const { index, id_plan, url_logo } = useAppSelector(store => store.content);
    
    const bgcolor='greenBtn';
    const logocolor='#008432';
    const textcolor='white';

    const buttons = [
        {
            inside: true,
            onClick: () => navigate('/pdt/PlanIndicativo', {state: {id: id_plan}}), 
            text: 'Plan indicativo', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <PlanIndicativoIcon color={ index === 0 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/Banco-proyectos', {state: {id: id_plan}}), 
            text: 'Banco de proyectos', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <BancoProyectoIcon color={ index === 1 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/POAI', {state: {id: id_plan}}), 
            text: 'POAI', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <POAIIcon color={ index === 2 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/Mapa', {state: {id: id_plan}}),
            text: 'Mapa de intervención', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <MapICon color={ index === 3 ? logocolor : textcolor}/>
        }
    ];

    useEffect(() => {
        if (plan !== undefined) {
            const { logo_link_plan } = plan;
            if (logo_link_plan) {
                dispatch(setLogo(logo_link_plan));
            }
        }
    }, []);

    const handleBtn = () => {
        dispatch(thunkLogout())
            .unwrap()
            .then(() => {
                navigate('/')
            })
    };

    return (
        <div className='tw-min-h-screen tw-flex tw-flex-col'>
            <header className={`tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl`}>
                <img src="\src\assets\images\CloudControlIcon.png" alt="" width={100} height={100}/>
                {url_logo && <img src={url_logo} alt="" width={200} /> }
                <IconButton onClick={handleBtn}>
                    <LogoutIcon sx={{color: 'green'}}/>
                </IconButton>
            </header>
            <div className='tw-flex tw-flex-col xl:tw-flex-row tw-flex-grow'>
                <NavBar buttons={buttons}/>
                <div className='tw-flex-grow'>
                    {props.data}
                </div>
            </div>
        </div>
    )
}