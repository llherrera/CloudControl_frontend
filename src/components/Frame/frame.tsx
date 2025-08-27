// -------------------- React y librerías base --------------------
import { useEffect, useRef, useState } from 'react';       // Hooks de React
import { useNavigate } from 'react-router-dom';           // Navegación entre rutas

// -------------------- Componentes de Material UI --------------------
import { Button, Divider, IconButton, Typography } from '@mui/material';  // Componentes UI básicos
import { Menu, MenuItem, Badge } from '@mui/material';                    // Menú desplegable, items y badge
import LogoutIcon from '@mui/icons-material/Logout';                      // Icono de logout
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';          // Icono de añadir persona
import { Notifications } from '@mui/icons-material';                      // Icono de notificaciones

// -------------------- Iconos externos --------------------
import { MdSupportAgent } from 'react-icons/md';                          // Icono de soporte (React Icons)

// -------------------- Imágenes/Recursos --------------------
// import cclogo from '@/assets/images/logo-cc.png';                      // Logo alternativo (comentado)
// import cclogo from "@/assets/images/ControlLand.png";                  // Logo alternativo (comentado)
import cclogo from "@/assets/images/ControlLand2.png";                    // Logo actual utilizado

// -------------------- Utilidades --------------------
import { decode } from '@/utils';                                         // Función utilitaria decode

// -------------------- Store: Hooks y slices --------------------
import { useAppDispatch, useAppSelector } from '@/store';                 // Hooks personalizados Redux
import { thunkLogout } from '@/store/auth/thunks';                        // Thunk para cerrar sesión

import {
    setLogo, setLogoPlan, setReload, selectOption,
    setProjectPage, setIsFullHeight
} from '@/store/content/contentSlice';                                    // Acciones del slice content

import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";  // Acciones del slice plan

// -------------------- Componentes propios --------------------
import { NavBar, ButtonComponent } from '@/components';                   // Navbar y botón reutilizable

// -------------------- Iconos propios --------------------
import {
    ProjectBankIcon, PlanIndicativoIcon, PlanAccionIcon,
    ChartIcon, MapICon
} from '@/assets/icons';                                                  // Conjunto de iconos custom

// -------------------- Interfaces --------------------
import { FrameProps } from '@/interfaces';                                // Interface para props de Frame

// -------------------- Thunks adicionales --------------------
import {
    thunkGetAllSolicitudes,
    thunkGetModulosUsuarioById,
} from '@/store/pqrs/thunks';                                             // Thunks para PQRS

import { thunkGetTextFormatByPlan } from '@/store/plan/thunks';           // Thunk para formatos de texto

// -------------------- Otros componentes --------------------
import VoiceChatWindow from '@/components/ChatAI/VoiceChatWindow';        // Componente de chat de voz con IA

// -------------------- Module Conversion Helpers --------------------

// Interface que define la estructura de los módulos disponibles
interface IModules {
    indicative_plan: boolean;       // Plan indicativo
    action_plan: boolean;           // Plan de acción
    project_bank: boolean;          // Banco de proyectos
    poai: boolean;                  // POAI
    citizen_service: boolean;       // Atención al ciudadano
    intervention_map: boolean;      // Mapa de intervención
}

// Arreglo que define el orden de los módulos (clave de IModules)
const moduleOrder: (keyof IModules)[] = [
    'indicative_plan',
    'action_plan',
    'project_bank',
    'poai',
    'citizen_service',
    'intervention_map'
];

// Convierte un número decimal (máscara) en un objeto de tipo IModules
const decimalToModules = (mask: number | undefined | null): IModules => {
    const validMask = mask || 0;                                    // Si mask es null/undefined, usar 0
    const binaryString = validMask.toString(2).padStart(moduleOrder.length, '0'); // Convertir a binario con padding
    const modules: any = {};                                        // Objeto temporal para almacenar módulos

    // Asigna a cada módulo un valor booleano en función del binario
    moduleOrder.forEach((key, index) => {
        modules[key] = binaryString[index] === '1';
    });

    return modules;                                                 // Devuelve el objeto con los módulos activos
};

export const Headerbase = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  
    const { url_logo, url_logo_plan } = useAppSelector(store => store.content);
  
    const [solicitudes, setSolicitudes] = useState<any[]>([]);
  
    // ================== NOTIFICACIONES ==================
    useEffect(() => {
      const fetchSolicitudes = async () => {
        const id_plan = localStorage.getItem('id_plan');
        if (!id_plan) return;
        dispatch(thunkGetAllSolicitudes({ id_plan }))
          .unwrap()
          .then((result: any) => setSolicitudes(result))
          .catch(() => setSolicitudes([]));
      };
      fetchSolicitudes();
    }, [dispatch]);
  
    // ================== FORMATO DE TEXTO ==================
    interface TextFormat {
      text: string;
      color: string;
      size: string;
      weight: 'normal' | 'bold' | 'lighter';
      align: 'left' | 'center' | 'right' | 'justify';
    }
  
    const id_plan = localStorage.getItem('id_plan') ?? '';
    const cachedFormat = localStorage.getItem('textFormat');
    const initialTextFormat = cachedFormat ? JSON.parse(cachedFormat) as TextFormat : null;
    const [textFormat, setTextFormat] = useState<TextFormat | null>(initialTextFormat);
  
    useEffect(() => {
      if (!textFormat && id_plan) {
        dispatch(thunkGetTextFormatByPlan(Number(id_plan)))
          .then((res) => {
            const payload = res.payload as TextFormat | undefined;
            if (payload) setTextFormat(payload);
          });
      }
    }, [id_plan, dispatch, textFormat]);
  
    const text = textFormat?.text || '';
    const color = textFormat?.color || '#000000';
    const size = textFormat?.size || '16px';
    const weight = textFormat?.weight || 'normal';
    const align = textFormat?.align || 'center';
  
    // ================== ACCIONES ==================
    const handleBtn = () => {
      dispatch(thunkLogout())
        .unwrap()
        .then(() => {
          dispatch(setReload(true));
          navigate('/');
        });
    };
  
    const handleAddUser = () => navigate(`/gestion-usuarios`);
  
    return (
      <header
        className="
          tw-bg-white tw-drop-shadow-xl
          tw-flex tw-flex-col md:tw-flex-row tw-items-center
          md:tw-justify-between
          tw-py-2 tw-px-4
          tw-gap-4 md:tw-gap-0
        "
      >
        {/* ============================= */}
        {/*   LOGOS                       */}
        {/* ============================= */}
        <div className="tw-flex tw-items-center tw-gap-4 tw-overflow-x-auto">
          <img src={cclogo} alt="ControlLand" className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]" />
          {url_logo && <img src={url_logo} alt="Municipio" className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]" />}
          {url_logo_plan && <img src={url_logo_plan} alt="Plan" className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]" />}
        </div>
  
        {/* ============================= */}
        {/* TEXTO DEL PLAN + ADMIN BTN   */}
        {/* ============================= */}
        <div className="tw-w-[45%] tw-flex tw-justify-center">
          <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-w-full tw-justify-center">
            <p
              className="tw-font-semibold tw-text-center tw-px-4 tw-py-1 tw-rounded-md tw-shadow-sm"
              style={{ color, fontSize: size, fontWeight: weight, textAlign: align }}
            >
              {text}
            </p>
            {localStorage.getItem('rol') === 'admin' && (
              <button
                onClick={handleAddUser}
                className="tw-flex tw-items-center tw-gap-2 tw-bg-green-100 hover:tw-bg-green-200
                           tw-text-[#006400] tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-md
                           tw-transition-all tw-duration-200 tw-text-[clamp(0.9rem,2.2vw,1.3rem)]"
              >
                <PersonAddAltIcon sx={{ fontSize: 24, color: '#006400' }} />
                <span className="tw-font-montserrat tw-font-semibold">Gestión de usuarios</span>
              </button>
            )}
          </div>
        </div>
  
        {/* ============================= */}
        {/* DATOS USUARIO + ICONOS        */}
        {/* ============================= */}
        <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap tw-justify-end tw-w-full md:tw-w-auto">
          <div className="tw-flex tw-flex-col tw-bg-green-50 tw-p-3 tw-rounded-md tw-shadow-md">
            <span className="tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
              Usuario: <span className="tw-font-normal">{localStorage.getItem('user')}</span>
            </span>
            <span className="tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
              Rol: <span className="tw-font-normal">{localStorage.getItem('rol')}</span>
            </span>
            {localStorage.getItem('rol') === 'funcionario' && (
              <span className="tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
                Oficina: <span className="tw-font-normal">{localStorage.getItem('office')}</span>
              </span>
            )}
          </div>
  
          {localStorage.getItem('rol') === 'funcionario' && (
            <IconButton title="Notificaciones">
              <Badge badgeContent={solicitudes.length} color="error">
                <Notifications sx={{ fontSize: 28, color: '#333' }} />
              </Badge>
            </IconButton>
          )}
  
          <IconButton onClick={handleBtn} title="Cerrar sesión">
            <LogoutIcon sx={{ color: '#006400', fontSize: 28 }} />
          </IconButton>
        </div>
      </header>
    );
  };
  

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

        // Priority 1: Admin has access to everything
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

        // For non-admins, access depends on plan and user permissions
        if (plan && id) {
            // Priority 2: Plan-level permissions from bitmask
            const planModules = decimalToModules(plan.modules);

            // Priority 3: User-level permissions from API
            dispatch(thunkGetModulosUsuarioById(parseInt(id)))
                .unwrap()
                .then(userModulesArray => {
                    if (Array.isArray(userModulesArray) && userModulesArray.length > 0) {
                        const userModules = userModulesArray[0];

                        // Combine permissions: a module is active only if allowed by BOTH plan and user
                        const finalModules = {
                            PlanIndicativo: planModules.indicative_plan && userModules.PlanIndicativo,
                            PlanDeAccion: planModules.action_plan && userModules.PlanDeAccion,
                            BancoDeProyectos: planModules.project_bank && userModules.BancoDeProyectos,
                            POAI: planModules.poai && userModules.POAI,
                            AtencionCiudadana: planModules.citizen_service && userModules.AtencionCiudadana,
                            MapaDeIntervencion: planModules.intervention_map && userModules.MapaDeIntervencion,
                        };

                        // Apply specific business logic/overrides
                        if (plan.id_plan === 10044) {
                            finalModules.AtencionCiudadana = false;
                        }

                        setModulos(finalModules);
                    }
                })
                .catch(err => {
                    console.error('Error al obtener los módulos de usuario:', err);
                    // Fallback to all modules disabled if user permissions fail
                    setModulos({
                        PlanIndicativo: false,
                        PlanDeAccion: false,
                        BancoDeProyectos: false,
                        POAI: false,
                        AtencionCiudadana: false,
                        MapaDeIntervencion: false
                    });
                });
        }
    }, [dispatch, plan]);


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

    interface TextFormat {
        text: string;
        color: string;
        size: string;
        weight: 'normal' | 'bold' | 'lighter';
        align: 'left' | 'center' | 'right' | 'justify';
    }

    const id_plan = localStorage.getItem('id_plan') ?? '';

    // 🔁 Leer desde localStorage al iniciar
    const cachedFormat = localStorage.getItem('textFormat');
    const initialTextFormat = cachedFormat ? (JSON.parse(cachedFormat) as TextFormat) : null;

    const [textFormat, setTextFormat] = useState<TextFormat | null>(initialTextFormat);

    // 📦 Guardar en localStorage cada vez que cambia
    useEffect(() => {
        if (textFormat) {
            localStorage.setItem('textFormat', JSON.stringify(textFormat));
        }
    }, [textFormat]);

    useEffect(() => {
        if (!textFormat && id_plan) {
            console.log('[TextConfig] Solicitando configuración para el plan:', id_plan);

            dispatch(thunkGetTextFormatByPlan(Number(id_plan)))
                .then((res) => {
                    console.log('[TextConfig] Respuesta recibida del thunk:', res);
                    const payload = res.payload as TextFormat | undefined;

                    if (payload) {
                        console.log('[TextConfig] Payload válido:', payload);
                        setTextFormat(payload); // Esto también actualizará localStorage gracias al otro useEffect
                    } else {
                        console.warn('[TextConfig] Payload inválido o vacío:', res.payload);
                    }
                })
                .catch((error) => {
                    console.error('[TextConfig] Error al obtener la configuración:', error);
                });
        }
    }, [id_plan, dispatch, textFormat]);

    // 👁️ Puedes seguir accediendo a los valores como antes
    const text = textFormat?.text || '';
    const color = textFormat?.color || '#000000';
    const size = textFormat?.size || '16px';
    const weight = textFormat?.weight || 'normal';
    const align = textFormat?.align || 'center';

    return (
        <div className='tw-min-h-screen tw-flex tw-flex-col'>
            <header
                className="
        tw-bg-white tw-drop-shadow-xl
        tw-flex tw-flex-col md:tw-flex-row tw-items-center
        md:tw-justify-between
        tw-py-2 tw-px-4
        tw-gap-4 md:tw-gap-0
      "
            >
                {/* ============================= */}
                {/*   CONTENEDOR DE LOS 3 LOGOS   */}
                {/* ============================= */}
                <div
                    className="
          tw-flex tw-items-center tw-gap-4 tw-flex-nowrap
          tw-overflow-x-auto
        "
                >
                    {/* Logo de ControlLand */}
                    <img
                        src={cclogo}
                        title="ControlLand"
                        className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]"
                        alt="ControlLand"
                    />

                    {/* Logo del Municipio */}
                    {url_logo && (
                        <img
                            src={url_logo}
                            title="Municipio"
                            className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]"
                            alt="Municipio"
                        />
                    )}

                    {/* Logo del Plan */}
                    {url_logo_plan && (
                        <img
                            src={url_logo_plan}
                            title="Plan"
                            className="tw-h-[60px] sm:tw-h-[80px] md:tw-h-[100px]"
                            alt="Plan"
                        />
                    )}
                </div>

                {/* ============================= */}
                {/*        BOTÓN DE ADMIN         */}
                {/* (solo visible en md+ o según rol) */}
                {/* ============================= */}
                <div className="tw-w-[45%] tw-flex tw-justify-center">
                    <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-w-full tw-justify-center">
                        <p
                            className="tw-font-semibold tw-break-words tw-text-center tw-px-4 tw-py-1 tw-rounded-md tw-shadow-sm"
                            style={{
                                color: color,
                                fontSize: size,
                                fontWeight: weight,
                                textAlign: align,
                            }}
                        >
                            {text || ''}
                        </p>

                        {localStorage.getItem('rol') === 'admin' && (
                            <button
                                onClick={handleAddUser}
                                className="
                        tw-flex tw-items-center tw-justify-center tw-gap-2
                        tw-bg-green-100 hover:tw-bg-green-200
                        tw-text-[#006400]
                        tw-px-4 tw-py-2
                        tw-rounded-xl
                        tw-shadow-md
                        tw-transition-all tw-duration-200
                        tw-text-[clamp(0.9rem,2.2vw,1.3rem)]
                    "
                                title="Agregar funcionario al plan"
                            >
                                <PersonAddAltIcon sx={{ fontSize: 24, color: '#006400' }} />
                                <span className="tw-font-montserrat tw-font-semibold">
                                    Gestión de usuarios
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ============================= */}
                {/*    DATOS DE USUARIO + ÍCONOS   */}
                {/* ============================= */}
                <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap tw-justify-end tw-w-full md:tw-w-auto">
                    {/* Caja con Usuario / Rol / Oficina */}
                    <div
                        className="
                tw-flex tw-flex-col tw-items-start tw-gap-2
                tw-bg-green-50 tw-p-3 tw-rounded-md tw-shadow-md
                tw-w-full sm:tw-w-auto
            "
                    >
                        <div
                            className="
                    tw-flex tw-flex-col sm:tw-flex-row
                    tw-gap-2 sm:tw-gap-4
                "
                        >
                            <span className="tw-font-montserrat tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
                                Usuario:{' '}
                                <span className="tw-font-normal">
                                    {localStorage.getItem('user')}
                                </span>
                            </span>
                            <span className="tw-font-montserrat tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
                                Rol:{' '}
                                <span className="tw-font-normal">
                                    {localStorage.getItem('rol')}
                                </span>
                            </span>
                            {/* Oficina solo si es funcionario */}
                            {localStorage.getItem('rol') === 'funcionario' && (
                                <span className="tw-font-montserrat tw-text-sm sm:tw-text-base tw-text-[#006400] tw-font-semibold">
                                    Oficina:{' '}
                                    <span className="tw-font-normal">
                                        {localStorage.getItem('office')}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ícono de notificaciones (solo funcionario) */}
                    {localStorage.getItem('rol') === 'funcionario' && (
                        <IconButton
                            onClick={handleClickNotifications}
                            className="tw-relative"
                            title="Notificaciones"
                        >
                            <Badge badgeContent={solicitudes.length} color="error">
                                <Notifications sx={{ fontSize: 28, color: '#333' }} />
                            </Badge>
                        </IconButton>
                    )}

                    {/* Ícono de cerrar sesión */}
                    <IconButton
                        onClick={handleBtn}
                        title="Cerrar sesión"
                        className="tw-self-center"
                    >
                        <LogoutIcon sx={{ color: '#006400', fontSize: 28 }} />
                    </IconButton>
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
                                icon={<PlanIndicativoIcon color={index === 0 ? "#41a95b" : "#ffffff"} />}
                                bgColor={index === 0 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 0 ? "tw-text-[#143955]" : "tw-text-white"}
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
                                icon={<PlanAccionIcon color={index === 1 ? "#41a95b" : "#ffffff"} />}
                                bgColor={index === 1 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 1 ? "tw-text-[#143955]" : "tw-text-white"}
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
                                icon={<ProjectBankIcon color={index === 2 ? "#41a95b" : "#ffffff"} />}
                                bgColor={index === 2 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 2 ? "tw-text-[#143955]" : "tw-text-white"}
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
                                icon={<ChartIcon color={index === 3 ? "#41a95b" : "#ffffff"} />}
                                bgColor={index === 3 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 3 ? "tw-text-[#143955]" : "tw-text-white"}
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
                                icon={<MdSupportAgent color={index === 4 ? "#41a95b" : "#ffffff"} size={64} />}
                                bgColor={index === 4 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 4 ? "tw-text-[#143955]" : "tw-text-white"}
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
                                icon={<MapICon color={index === 5 ? "#41a95b" : "#ffffff"} />}
                                bgColor={index === 5 ? "tw-bg-gray-200" : "tw-bg-[#143955]"}
                                textColor={index === 5 ? "tw-text-[#143955]" : "tw-text-white"}
                            />
                        )}
                    </>
                </NavBar>
                <div
                    ref={contentRef}
                    className={`${isFullHeight ? 'tw-h-[calc(100vh-100px)]' : ''} 
              tw-w-full tw-border
              tw-bg-gradient-to-b 
              tw-from-[#06283b] 
              tw-via-[#1f4f63] 
              tw-to-[#dbeff6]`}
                >
                    <div>
                        <VoiceChatWindow />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}