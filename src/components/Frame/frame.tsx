import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import cclogo from '@/assets/images/CloudControlIcon.png';

import { useAppDispatch, useAppSelector } from '../../store';
import { thunkLogout } from '@/store/auth/thunks';
import { setLogo } from '@/store/content/contentSlice';

import { NavBar } from '..';
import { 
    BancoProyectoIcon, 
    PlanIndicativoIcon, 
    POAIIcon, 
    MapICon } from '../../assets/icons';
import { FrameProps } from '@/interfaces';

export const Frame = (props: FrameProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector(state => state.plan);
    const { index, url_logo } = useAppSelector(store => store.content);
    
    const bgcolor='greenBtn';
    const logocolor='#008432';
    const textcolor='white';

    const buttons = [
        {
            inside: true,
            onClick: () => navigate('/pdt/PlanIndicativo'), 
            text: 'Plan indicativo', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <PlanIndicativoIcon color={ index === 0 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/Banco-proyectos'), 
            text: 'Banco de proyectos', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <BancoProyectoIcon color={ index === 1 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/POAI'), 
            text: 'POAI', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <POAIIcon color={ index === 2 ? logocolor : textcolor}/>
        },
        {
            inside: true, 
            onClick: () => navigate('/PlanIndicativo/Mapa'),
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
        } else {
            dispatch(setLogo(''));
        }
    }, []);

    const handleBtn = () => {
        dispatch(thunkLogout())
        .unwrap()
        .then(() => {
            navigate('/');
        });
    };

    return (
        <div className='tw-min-h-screen tw-flex tw-flex-col'>
            <header className={`tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl`}>
                <img src={cclogo} alt="" width={100} height={100}/>
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
    );
}