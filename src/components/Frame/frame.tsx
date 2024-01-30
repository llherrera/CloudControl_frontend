import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import cclogo from '@/assets/images/logo-cc.png';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from '@/store/auth/thunks';
import { setLogo, setReload } from '@/store/content/contentSlice';

import { NavBar } from '@/components';
import { 
    BancoProyectoIcon, 
    PlanIndicativoIcon, 
    POAIIcon, 
    MapICon } from '@/assets/icons';
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
            onClick: () => navigate('/pdt/PlanIndicativo', {replace: true}),
            text: 'Plan indicativo',
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <PlanIndicativoIcon color={ index === 0 ? logocolor : textcolor}/>
        },
        {
            inside: true,
            onClick: () => navigate('/PlanIndicativo/Banco-proyectos', {replace: true}),
            text: 'Banco de proyectos',
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <BancoProyectoIcon color={ index === 1 ? logocolor : textcolor}/>
        },
        {
            inside: true,
            onClick: () => navigate('/PlanIndicativo/POAI', {replace: true}),
            text: 'POAI',
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <POAIIcon color={ index === 2 ? logocolor : textcolor}/>
        },
        {
            inside: true,
            onClick: () => navigate('/PlanIndicativo/Mapa', {replace: true}),
            text: 'Mapa de intervención',
            bgColor: bgcolor,
            textColor: textcolor,
            icon: <MapICon color={ index === 3 ? logocolor : textcolor}/>
        }
    ];

    useEffect(() => {
        if (plan !== undefined) {
            const { logo_link_plan } = plan;
            if (logo_link_plan)
                dispatch(setLogo(logo_link_plan));
            else
                dispatch(setLogo(''));
        } else {
            dispatch(setLogo(''));
        }
    }, [plan]);

    const handleBtn = () => {
        dispatch(thunkLogout())
        .unwrap()
        .then(() => {
            dispatch(setReload(true));
            navigate('/');
        });
    };

    return (
        <div className='tw-min-h-screen tw-flex tw-flex-col'>
            <header className={`tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl`}>
                <img src={cclogo} alt="" width={100} height={100}/>
                {url_logo && <img src={url_logo} alt="" width={100} /> }
                <IconButton onClick={handleBtn}
                type='button'>
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