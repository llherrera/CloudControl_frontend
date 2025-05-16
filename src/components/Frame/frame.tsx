import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { MdSupportAgent } from 'react-icons/md';
//import cclogo from '@/assets/images/logo-cc.png';
//import cclogo from "@/assets/images/ControlLand.png";
import cclogo from "@/assets/images/ControlLand2.png";
import NotificationsIcon from '@mui/icons-material/Notifications';

import { Menu, MenuItem, Badge } from '@mui/material';
import { Notifications } from '@mui/icons-material';


import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from '@/store/auth/thunks';
import {
    setLogo, setLogoPlan, setReload, selectOption,
    setProjectPage, setIsFullHeight
} from '@/store/content/contentSlice';
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";

import { NavBar, ButtonComponent } from '@/components';
import {
    ProjectBankIcon, PlanIndicativoIcon, PlanAccionIcon,
    ChartIcon, MapICon
} from '@/assets/icons';
import { FrameProps } from '@/interfaces';
import { thunkGetAllSolicitudes, thunkGetModulosUsuarioById } from '@/store/pqrs/thunks';

export const Frame = ({ children }: FrameProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector(store => store.plan);
    const { index, isFullHeight, url_logo,
        url_logo_plan } = useAppSelector(store => store.content);

    const bgcolor = 'greenBtn';
    const logocolor = '#008432';
    const textcolor = 'white';

    const [modulos, setModulos] = useState({
        PlanIndicativo: false,
        PlanDeAccion: false,
        BancoDeProyectos: false,
        POAI: false,
        AtencionCiudadana: false,
        MapaDeIntervencion: false
    });

    useEffect(() => {
        const id = localStorage.getItem('id');
        const rol = localStorage.getItem('rol');

        if (rol === 'admin') {
            setModulos({
                PlanIndicativo: true,
                PlanDeAccion: true,
                BancoDeProyectos: true,
                POAI: true,
                AtencionCiudadana: true,
                MapaDeIntervencion: true
            });
            return;
        }

        if (id !== null) {
            dispatch(thunkGetModulosUsuarioById(parseInt(id)))
                .unwrap()
                .then(res => {
                    if (Array.isArray(res) && res.length > 0) {
                        setModulos(res[0]);
                    }
                })
                .catch(err => {
                    console.error('Error al obtener los módulos:', err);
                });
        }
    }, [dispatch]);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClickNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null);
    };


    interface FormData {
        id?: string;
        fecha?: string;
        nombre: string;
        tipoDocumento: string;
        documento: string;
        genero: string;
        grupoEtario: string;
        poblacional: string;
        otroPoblacional?: string;
        discapacidad: string;
        otraDiscapacidad?: string;
        escolaridad: string;
        otraEscolaridad?: string;
        nacionalidad: string;
        telefono?: string;
        correo?: string;
        area: string;
        barrio?: string;
        comuna?: string;
        corregimiento?: string;
        vereda?: string;
        servicio: string;
        otroServicio?: string;
        prioridad: string;
        tipoAtencion: string;
        modoAtencion?: string;
        duracion?: string;
        exclusividad?: string;
        tipoUsuario?: string;
        redireccionar: boolean;
        oficinaDestino?: string;
        dependencia?: string;
        funcionario: string;
        estado: 'pendiente' | 'en proceso' | 'resuelto';
        fechaResolucion?: string | null;
        solicitudPadre?: string;
        usuarioId?: string;
        razonRedireccionamiento?: string;
    }

    const [solicitudes, setSolicitudes] = useState<FormData[]>([]);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const id_plan = localStorage.getItem('id_plan');
            const office = localStorage.getItem('office');
            if (!id_plan) {
                console.error("No se encontró id_plan en localStorage");
                return;
            }
            dispatch(thunkGetAllSolicitudes({ id_plan }))
                .unwrap()
                .then((result: any) => {
                    setSolicitudes(result); // Actualiza el estado con las solicitudes obtenidas
                })
                .catch((error: any) => {
                    console.error("Error al obtener solicitudes:", error);
                });
        };
        fetchSolicitudes();
    }, [dispatch]);


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

    const handleAddUser = () => {
        navigate(`/gestion-usuarios`);
    };

    return (
        <div className='tw-min-h-screen tw-flex tw-flex-col'>
            <header className='tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl'>
                <div className='tw-flex tw-items-center tw-gap-4'>
                    {/* Logo */}
                    <img src={cclogo} title='ControlLand' width={100} />

                    {/* Botón de gestión de usuarios (solo para admin) */}
                    {localStorage.getItem('rol') === 'admin' && (
                        <button
                            onClick={handleAddUser}
                            className='tw-flex tw-items-center tw-gap-2 hover:tw-bg-green-200 tw-p-2 tw-rounded-lg'
                            title="Agregar funcionario al plan"
                        >
                            <PersonAddAltIcon sx={{ fontSize: 30, color: '#006400' }} />
                            <span className='tw-text-[#006400] tw-font-montserrat tw-font-semibold tw-text-xl'>
                                Gestión de usuarios
                            </span>
                        </button>
                    )}
                </div>
                <div className='tw-flex tw-gap-3'>
                    {url_logo && <img src={url_logo} title='Municipio' className='tw-h-[100px]' />}
                    {url_logo_plan && <img src={url_logo_plan} title='Plan' className='tw-h-[100px]' />}
                </div>
                <div className='tw-flex tw-items-center tw-gap-4'>
                    <div className='tw-flex tw-flex-col tw-items-start tw-gap-2'>
                        <div className="tw-flex tw-gap-6 tw-bg-green-50 tw-p-4 tw-rounded-md tw-shadow-md tw-items-center">
                            <span className="tw-font-montserrat tw-text-base tw-text-[#006400] tw-font-semibold">
                                Usuario: <span className="tw-font-normal">{localStorage.getItem('user')}</span>
                            </span>
                            <span className="tw-font-montserrat tw-text-base tw-text-[#006400] tw-font-semibold">
                                Rol: <span className="tw-font-normal">{localStorage.getItem('rol')}</span>
                            </span>
                            {localStorage.getItem('rol') === 'funcionario' && (
                                <span className="tw-font-montserrat tw-text-base tw-text-[#006400] tw-font-semibold">
                                    Oficina: <span className="tw-font-normal">{localStorage.getItem('office')}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ícono de notificación solo visible para rol 'funcionario' */}
                    {localStorage.getItem('rol') === 'funcionario' && (
                        <div className='tw-px-4'>
                            <IconButton
                                onClick={handleClickNotifications}
                                className='tw-relative'
                                title="Notificaciones"
                            >
                                <Badge badgeContent={solicitudes.length} color="error">
                                    <Notifications sx={{ fontSize: 28, color: '#333' }} />
                                </Badge>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseNotifications}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 250,
                                        maxHeight: 300,
                                    },
                                }}
                            >
                                {solicitudes.length > 0 ? (
                                    solicitudes.map(solicitud => (
                                        <MenuItem
                                            key={solicitud.documento}
                                            onClick={handleCloseNotifications}
                                            title={solicitud.nombre}
                                        >
                                            {`Solicitud ${solicitud.documento}: ${solicitud.nombre}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No hay solicitudes pendientes</MenuItem>
                                )}

                                <MenuItem
                                    onClick={() => {
                                        handleCloseNotifications();
                                        navigate('/AtencionCiudadana'); // <-- Redirecciona aquí
                                    }}
                                    sx={{ justifyContent: 'center', fontWeight: 'bold' }}
                                >
                                    <Button variant="contained" color="primary" fullWidth>
                                        Ver todas las solicitudes
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </div>
                    )}

                    <div className='tw-px-4'>
                        <IconButton onClick={handleBtn}
                            title='Cerrar sesión'
                            type='button'
                            className='tw-self-center'>
                            <LogoutIcon sx={{ color: '#006400' }} />
                        </IconButton>
                    </div>
                </div>
            </header>
            <div className='tw-flex tw-flex-col xl:tw-flex-row tw-flex-grow'>
                <NavBar>
                    <>
                        {modulos.PlanIndicativo && (
                            <ButtonComponent
                                text={`Plan indicativo`}
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(0));
                                    dispatch(AddRootTree([]));
                                    dispatch(setZeroLevelIndex());
                                    navigate('/pdt/PlanIndicativo', { replace: true });
                                }}
                                icon={<PlanIndicativoIcon color={index === 0 ? logocolor : textcolor} />}
                                bgColor={0 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={0 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>
                    <>
                        {modulos.PlanDeAccion && (
                            <ButtonComponent
                                text='Plan de acción'
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(1));
                                    dispatch(AddRootTree([]));
                                    dispatch(setZeroLevelIndex());
                                    navigate('/PlanIndicativo/Plan-accion', { replace: true });
                                }}
                                icon={<PlanAccionIcon color={index === 1 ? logocolor : textcolor} />}
                                bgColor={1 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={1 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>
                    <>
                        {modulos.BancoDeProyectos && (
                            <ButtonComponent
                                text={`Banco de proyectos`}
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(2));
                                    dispatch(setProjectPage(5));
                                    dispatch(AddRootTree([]));
                                    dispatch(setZeroLevelIndex());
                                    navigate('/PlanIndicativo/Banco-proyectos', { replace: true });
                                }}
                                icon={<ProjectBankIcon color={index === 2 ? logocolor : textcolor} />}
                                bgColor={2 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={2 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>
                    <>
                        {modulos.POAI && (
                            <ButtonComponent
                                text={`POAI`}
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(3));
                                    dispatch(AddRootTree([]));
                                    dispatch(setZeroLevelIndex());
                                    navigate('/PlanIndicativo/POAI', { replace: true });
                                }}
                                icon={<ChartIcon color={index === 3 ? logocolor : textcolor} />}
                                bgColor={3 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={3 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>
                    <>
                        {modulos.AtencionCiudadana && (
                            <ButtonComponent
                                text={"Atención Ciudadana"}
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(4));
                                    navigate("/AtencionCiudadana");
                                }}
                                icon={<MdSupportAgent color={index === 4 ? logocolor : textcolor} size={64} />}
                                bgColor={4 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={4 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>
                    <>
                        {modulos.MapaDeIntervencion && (
                            <ButtonComponent
                                text={`Mapa de intervención`}
                                inside={true}
                                onClick={() => {
                                    dispatch(selectOption(5));
                                    dispatch(AddRootTree([]));
                                    dispatch(setZeroLevelIndex());
                                    navigate('/PlanIndicativo/Mapa', { replace: true });
                                }}
                                icon={<MapICon color={index === 5 ? logocolor : textcolor} />}
                                bgColor={5 === index ? `tw-bg-${textcolor}` : `tw-bg-${bgcolor}`}
                                textColor={5 === index ? `tw-text-${bgcolor}` : `tw-text-${textcolor}`}
                            />
                        )}
                    </>

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