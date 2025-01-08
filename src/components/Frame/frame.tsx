import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
//import cclogo from '@/assets/images/logo-cc.png';
import cclogo from "@/assets/images/ControlLand.png";

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from '@/store/auth/thunks';
import { setLogo, setLogoPlan, setReload, selectOption,
    setProjectPage, setIsFullHeight } from '@/store/content/contentSlice';
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";

import { NavBar, ButtonComponent } from '@/components';
import { ProjectBankIcon, PlanIndicativoIcon, PlanAccionIcon,
    ChartIcon, MapICon } from '@/assets/icons';
import { FrameProps } from '@/interfaces';

export const Frame = ({children}: FrameProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector(store => store.plan);
    const { index, isFullHeight, url_logo,
        url_logo_plan } = useAppSelector(store => store.content);

    const bgcolor='greenBtn';
    const logocolor='#008432';
    const textcolor='white';

//    const [isFullHeight, setIsFullHeight] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                dispatch(setIsFullHeight(contentRef.current.scrollHeight <= window.innerHeight * 0.8));
            }
        };

        checkHeight();
        window.addEventListener('resize', checkHeight);

        return () => {
            window.removeEventListener('resize', checkHeight);
        };
    }, [index]);

    useEffect(() => {
        if (plan !== undefined) {
            const { logo_link_plan, logo_link_city } = plan;
            if (logo_link_plan) dispatch(setLogoPlan(logo_link_plan));
            else dispatch(setLogoPlan(''));

            if (logo_link_city) dispatch(setLogo(logo_link_city));
            else dispatch(setLogo(''));
        } else {
            dispatch(setLogo(''));
            dispatch(setLogoPlan(''));
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
            <header className='tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl'>
                <img src={cclogo} title='ControlLand' width={100}/>
                <div className='tw-flex tw-gap-3'>
                    {url_logo && <img src={url_logo} title='Municipio' className='tw-h-[100px]' /> }
                    {url_logo_plan && <img src={url_logo_plan} title='Plan' className='tw-h-[100px]' /> }
                </div>
                <IconButton onClick={handleBtn}
                            title='Cerrar sesión'
                            type='button'>
                    <LogoutIcon sx={{color: 'green'}}/>
                </IconButton>
            </header>
            <div className='tw-flex tw-flex-col xl:tw-flex-row tw-flex-grow'>
                <NavBar>
                    <ButtonComponent
                        text={`Plan indicativo`}
                        inside={true}
                        onClick={ () => {
                            dispatch(selectOption(0));
                            dispatch(AddRootTree([]));
                            dispatch(setZeroLevelIndex());
                            navigate('/pdt/PlanIndicativo', {replace: true});
                        }}
                        icon={<PlanIndicativoIcon color={ index === 0 ? logocolor : textcolor}/>}
                        bgColor={0 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                        textColor={0 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                    />
                    <ButtonComponent
                        text={`Banco de proyectos`}
                        inside={true}
                        onClick={ () => {
                            dispatch(selectOption(1));
                            dispatch(setProjectPage(5));
                            dispatch(AddRootTree([]));
                            dispatch(setZeroLevelIndex());
                            navigate('/PlanIndicativo/Banco-proyectos', {replace: true});
                        }}
                        icon={<ProjectBankIcon color={ index === 1 ? logocolor : textcolor}/>}
                        bgColor={1 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                        textColor={1 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                    />
                    <ButtonComponent
                        text={`POAI`}
                        inside={true}
                        onClick={ () => {
                            dispatch(selectOption(2));
                            dispatch(AddRootTree([]));
                            dispatch(setZeroLevelIndex());
                            navigate('/PlanIndicativo/POAI', {replace: true});
                        }}
                        icon={<ChartIcon color={ index === 2 ? logocolor : textcolor}/>}
                        bgColor={2 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                        textColor={2 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                    />
                    <ButtonComponent
                        text={`Mapa de intervención`}
                        inside={true}
                        onClick={ () => {
                            dispatch(selectOption(3));
                            dispatch(AddRootTree([]));
                            dispatch(setZeroLevelIndex());
                            navigate('/PlanIndicativo/Mapa', {replace: true});
                        }}
                        icon={<MapICon color={ index === 3 ? logocolor : textcolor}/>}
                        bgColor={3 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                        textColor={3 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                    />
                    <ButtonComponent
                        text='PLan de acción'
                        inside={true}
                        onClick={() => {
                            dispatch(selectOption(4));
                            dispatch(AddRootTree([]));
                            dispatch(setZeroLevelIndex());
                            navigate('/PlanIndicativo/Plan-accion', {replace: true});
                        }}
                        icon={<PlanAccionIcon color={ index === 4 ? logocolor : textcolor}/>}
                        bgColor={4 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                        textColor={4 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                    />
                    {/*<ButtonComponent
                        inside={false}
                        text='PQRS'
                        onClick={() => {
                            dispatch(selectOption(5));
                            navigate('/PQRS', {replace: true});
                        }}
                        bgColor="tw-bg-greenBtn"
                        icon={<PQRSIcon color='white'/>}/>*/}
                </NavBar>
                <div ref={contentRef} 
                    className={`${isFullHeight ? 'tw-h-[calc(100vh-100px)]' : ''} 
                                tw-w-full tw-border
                                tw-bg-[url('/src/assets/images/bg-pi-1.png')]
                                tw-bg-cover
                                tw-opacity-80`}>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}