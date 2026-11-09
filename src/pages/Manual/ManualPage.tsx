import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetPDTid, thunkGetLevelsById, thunkGetColors } from '@/store/plan/thunks';

// Componentes Reales del Sistema
import { ButtonComponent, BackBtn, DoubleBackBtn, SettingsBtn, HvBtn } from '@/components/Citizen';
import { ProjectBankIcon, PlanIndicativoIcon, PlanAccionIcon, ChartIcon, MapICon } from '@/assets/icons';
import { MdSupportAgent } from 'react-icons/md';

// Iconos MUI
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TrafficIcon from '@mui/icons-material/Traffic';
import GroupIcon from '@mui/icons-material/Group';
import AppsIcon from '@mui/icons-material/Apps';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ViewListIcon from '@mui/icons-material/ViewList';
import TabIcon from '@mui/icons-material/Tab';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalculateIcon from '@mui/icons-material/Calculate';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { generateManualPdf, notify } from '@/utils';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const ManualPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan, levels, colorimeter } = useAppSelector(store => store.plan);
    const { id_plan, url_logo, url_logo_plan } = useAppSelector(store => store.content);

    const [activeTab, setActiveTab] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');
    const [tabsWrap, setTabsWrap] = useState<boolean>(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const tabsNavRef = useRef<HTMLDivElement>(null);

    const scrollTabs = (direction: 'left' | 'right') => {
        if (tabsNavRef.current) {
            const amount = direction === 'left' ? -250 : 250;
            tabsNavRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const handleDownloadPdf = () => {
        setIsGeneratingPdf(true);
        setTimeout(() => {
            try {
                generateManualPdf({ plan, levels, colorimeter });
                notify("Manual PDF descargado exitosamente", "success");
            } catch (error) {
                console.error("Error al generar PDF:", error);
                notify("Error al generar el manual PDF. Verifique la consola.", "error");
            } finally {
                setIsGeneratingPdf(false);
            }
        }, 80);
    };

    // Cargar datos dinámicos del plan si no están en memoria
    useEffect(() => {
        const storedId = id_plan || Number(localStorage.getItem('id_plan'));
        if (storedId) {
            if (!plan) {
                dispatch(thunkGetPDTid(storedId));
            }
            if (!levels || levels.length === 0) {
                dispatch(thunkGetLevelsById(storedId));
            }
            if (!colorimeter || colorimeter.length === 0) {
                dispatch(thunkGetColors(storedId));
            }
        }
    }, [dispatch, id_plan, plan, levels, colorimeter]);

    // Umbrales de semaforización (con valores por defecto si no están configurados aún)
    const c1 = colorimeter && colorimeter.length > 0 ? colorimeter[0] : 35;
    const c2 = colorimeter && colorimeter.length > 1 ? colorimeter[1] : 70;
    const c3 = colorimeter && colorimeter.length > 2 ? colorimeter[2] : 85;
    const c4 = colorimeter && colorimeter.length > 3 ? colorimeter[3] : 100;

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return 'No definida';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const tabsList = [
        { id: 0, label: '1. Cómo Subir Evidencias', icon: <UploadFileIcon fontSize="small" /> },
        { id: 1, label: '2. Revisión y Validación', icon: <HowToRegIcon fontSize="small" /> },
        { id: 2, label: '3. Interpretación y Semáforo', icon: <CalculateIcon fontSize="small" /> },
        { id: 3, label: '4. Uso del Asistente IA', icon: <SmartToyIcon fontSize="small" /> },
        { id: 4, label: '5. Módulos del Sistema', icon: <AppsIcon fontSize="small" /> },
        { id: 5, label: '6. Estructura y Roles', icon: <AccountTreeIcon fontSize="small" /> },
        { id: 6, label: '7. Preguntas Frecuentes', icon: <HelpOutlineIcon fontSize="small" /> },
    ];

    return (
        <div className="tw-min-h-screen tw-bg-gray-100 tw-font-montserrat print-manual-wrapper">
            {/* Estilos para impresión en PDF */}
            <style>{`
                @media print {
                    body, html, #root {
                        background: #ffffff !important;
                        color: #111827 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    .no-print, header, nav, aside {
                        display: none !important;
                    }
                    .print-manual-wrapper {
                        background: #ffffff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    .print-full-content {
                        display: block !important;
                    }
                    .avoid-break {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .page-break {
                        page-break-before: always !important;
                        break-before: page !important;
                    }
                    .card-print {
                        box-shadow: none !important;
                        border: 1px solid #d1d5db !important;
                        background: #ffffff !important;
                        margin-bottom: 1.5rem !important;
                    }
                }
            `}</style>

            {/* ======================================================== */}
            {/* BARRA SUPERIOR PROPIA DE LA PÁGINA (SIN NAVBARS DEL FRAME)*/}
            {/* ======================================================== */}
            <div className="tw-bg-[#143955] tw-text-white tw-shadow-lg tw-sticky tw-top-0 tw-z-50 no-print">
                <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 tw-py-3 tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-gap-4">
                    <div className="tw-flex tw-items-center tw-gap-3">
                        {url_logo_plan ? (
                            <img
                                src={url_logo_plan}
                                alt="Logo Plan"
                                className="tw-h-11 tw-object-contain tw-rounded bg-white tw-p-1"
                            />
                        ) : url_logo ? (
                            <img
                                src={url_logo}
                                alt="Logo Institución"
                                className="tw-h-11 tw-object-contain tw-rounded bg-white tw-p-1"
                            />
                        ) : null}
                        <div>
                            <span className="tw-text-xs tw-text-green-300 tw-font-bold tw-uppercase tw-tracking-wide">
                                Guía Práctica y Operativa Oficial
                            </span>
                            <h1 className="tw-text-base sm:tw-text-lg tw-font-bold tw-leading-tight">
                                {plan?.name || 'Manual de Usuario - Controland'}
                            </h1>
                        </div>
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-2.5">
                        <button
                            onClick={() => navigate(-1)}
                            className="tw-flex tw-items-center tw-gap-1.5 tw-bg-white/10 hover:tw-bg-white/20 tw-text-white tw-px-3.5 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition-all tw-text-xs sm:tw-text-sm"
                            title="Volver a la vista anterior"
                        >
                            <ArrowBackIcon fontSize="small" />
                            <span>Volver</span>
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isGeneratingPdf}
                            className="tw-flex tw-items-center tw-gap-1.5 tw-bg-[#008432] hover:tw-bg-green-700 disabled:tw-opacity-60 tw-text-white tw-px-4 tw-py-2 tw-rounded-xl tw-font-semibold tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-text-xs sm:tw-text-sm"
                            title="Descargar archivo PDF generado directamente por el aplicativo"
                        >
                            <FileDownloadIcon fontSize="small" />
                            <span>{isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF'}</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="tw-hidden md:tw-flex tw-items-center tw-gap-1 tw-bg-white/10 hover:tw-bg-white/20 tw-text-white tw-px-3 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition-all tw-text-xs"
                            title="Imprimir directamente desde el navegador"
                        >
                            <PrintIcon fontSize="small" />
                            <span>Imprimir</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ======================================================== */}
            {/* CONTENIDO PRINCIPAL                                      */}
            {/* ======================================================== */}
            <div className="tw-max-w-7xl tw-mx-auto tw-p-4 md:tw-p-6">

                {/* Banner de Información Dinámica del Plan */}
                <div className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-5 md:tw-p-6 tw-mb-6 tw-border tw-border-gray-200 card-print avoid-break">
                    <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start md:tw-items-center tw-gap-4 tw-border-b tw-border-gray-200 tw-pb-4">
                        <div>
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <span className="tw-bg-green-100 tw-text-[#006400] tw-text-xs tw-font-bold tw-px-3 tw-py-0.5 tw-rounded-full tw-uppercase">
                                    Documento Operativo Oficial
                                </span>
                                <span className="tw-bg-blue-100 tw-text-blue-800 tw-text-xs tw-font-bold tw-px-3 tw-py-0.5 tw-rounded-full">
                                    Manual del Funcionario
                                </span>
                            </div>
                            <h2 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mt-2">
                                Manual de Uso y Gestión de Metas
                            </h2>
                            <p className="tw-text-xs md:tw-text-sm tw-text-gray-600 tw-mt-1">
                                Instructivo paso a paso enfocado en las acciones del sistema con los botones y controles de la aplicación.
                            </p>
                        </div>

                        {/* Switch de Vista: Tabs vs Ver Todo */}
                        <div className="no-print tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-1 tw-rounded-xl tw-border tw-border-gray-200">
                            <button
                                onClick={() => setViewMode('tabs')}
                                className={`tw-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-xs tw-font-semibold tw-transition-all ${
                                    viewMode === 'tabs'
                                        ? 'tw-bg-white tw-text-[#143955] tw-shadow-sm'
                                        : 'tw-text-gray-600 hover:tw-text-gray-900'
                                }`}
                            >
                                <TabIcon fontSize="small" />
                                <span>Por Pestañas</span>
                            </button>
                            <button
                                onClick={() => setViewMode('all')}
                                className={`tw-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-xs tw-font-semibold tw-transition-all ${
                                    viewMode === 'all'
                                        ? 'tw-bg-[#143955] tw-text-white tw-shadow-sm'
                                        : 'tw-text-gray-600 hover:tw-text-gray-900'
                                }`}
                            >
                                <ViewListIcon fontSize="small" />
                                <span>Ver Todo (Completo)</span>
                            </button>
                        </div>
                    </div>

                    {/* Ficha técnica del plan activo */}
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mt-4">
                        <div className="tw-bg-green-50 tw-p-3.5 tw-rounded-xl tw-border tw-border-green-200">
                            <span className="tw-text-[11px] tw-text-[#006400] tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1">
                                <LocationCityIcon fontSize="inherit" />
                                Municipio / Entidad
                            </span>
                            <p className="tw-text-gray-800 tw-font-bold tw-text-sm tw-mt-0.5">
                                {plan?.municipality || 'Municipio'} {plan?.department ? `(${plan.department})` : ''}
                            </p>
                        </div>

                        <div className="tw-bg-blue-50 tw-p-3.5 tw-rounded-xl tw-border tw-border-blue-200">
                            <span className="tw-text-[11px] tw-text-blue-800 tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1">
                                <CalendarMonthIcon fontSize="inherit" />
                                Vigencia del Plan
                            </span>
                            <p className="tw-text-gray-800 tw-font-bold tw-text-sm tw-mt-0.5">
                                {formatDate(plan?.start_date)} - {formatDate(plan?.end_date)}
                            </p>
                        </div>

                        <div className="tw-bg-amber-50 tw-p-3.5 tw-rounded-xl tw-border tw-border-amber-200">
                            <span className="tw-text-[11px] tw-text-amber-800 tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1">
                                <WarningAmberIcon fontSize="inherit" />
                                Límite de Reporte (Deadline)
                            </span>
                            <p className="tw-text-gray-800 tw-font-bold tw-text-sm tw-mt-0.5">
                                {plan?.deadline ? formatDate(plan.deadline) : 'Sin fecha límite (Abierto)'}
                            </p>
                        </div>

                        <div className="tw-bg-purple-50 tw-p-3.5 tw-rounded-xl tw-border tw-border-purple-200">
                            <span className="tw-text-[11px] tw-text-purple-800 tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1">
                                <AccountTreeIcon fontSize="inherit" />
                                Niveles Jerárquicos
                            </span>
                            <p className="tw-text-gray-800 tw-font-bold tw-text-sm tw-mt-0.5">
                                {levels && levels.length > 0 ? `${levels.length} niveles configurados` : 'Estructura en línea'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* SELECTOR DE PESTAÑAS (NO PRINT)                          */}
                {/* ======================================================== */}
                {viewMode === 'tabs' && (
                    <div className="no-print tw-mb-6 tw-bg-white tw-p-3 tw-rounded-2xl tw-shadow-md tw-border tw-border-gray-200">
                        <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-2.5 tw-px-1 tw-text-xs tw-text-gray-500 tw-font-semibold tw-border-b tw-border-gray-100 tw-pb-2">
                            <span className="tw-flex tw-items-center tw-gap-1.5 tw-text-[#143955]">
                                <MenuBookIcon fontSize="small" className="tw-text-[#008432]" />
                                <span>Barra de Navegación por Capítulos</span>
                            </span>

                            <div className="tw-flex tw-items-center tw-gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTabsWrap((prev) => !prev)}
                                    className="tw-px-2.5 tw-py-1 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-[11px] tw-text-gray-600 tw-transition"
                                    title="Alternar entre lista desplazable o mostrar todas las pestañas ajustadas"
                                >
                                    {tabsWrap ? '↔ Modo Desplazable' : '☷ Ajustar todas en pantalla'}
                                </button>

                                {!tabsWrap && (
                                    <div className="tw-flex tw-items-center tw-gap-1">
                                        <button
                                            type="button"
                                            onClick={() => scrollTabs('left')}
                                            className="tw-p-1 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-gray-600 tw-transition"
                                            title="Desplazar pestañas a la izquierda"
                                        >
                                            <ChevronLeftIcon fontSize="small" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => scrollTabs('right')}
                                            className="tw-p-1 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-gray-600 tw-transition"
                                            title="Desplazar pestañas a la derecha"
                                        >
                                            <ChevronRightIcon fontSize="small" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            ref={tabsNavRef}
                            className={`tw-flex tw-items-center tw-gap-2 tw-pb-1.5 tw-transition-all ${
                                tabsWrap ? 'tw-flex-wrap' : 'tw-overflow-x-auto'
                            }`}
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#94a3b8 #f1f5f9',
                            }}
                        >
                            {tabsList.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2.5 tw-rounded-xl tw-font-semibold tw-text-xs md:tw-text-sm tw-whitespace-nowrap tw-transition-all ${
                                        activeTab === tab.id
                                            ? 'tw-bg-[#008432] tw-text-white tw-shadow-sm'
                                            : 'tw-text-gray-600 hover:tw-bg-gray-100 hover:tw-text-gray-900'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* SECCIONES OPERATIVAS Y PROCEDIMENTALES                   */}
                {/* ======================================================== */}
                <div className="tw-space-y-6">

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 1: CÓMO SUBIR Y CARGAR EVIDENCIAS              */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 0) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-green-100 tw-text-[#008432] tw-rounded-xl">
                                    <UploadFileIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        1. Flujo de Reporte: Cómo Subir y Cargar Evidencias
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Procedimiento paso a paso para funcionarios operativos: desde la barra lateral hasta el cargue de soportes múltiples en el formulario.
                                    </p>
                                </div>
                            </div>

                            {/* Botones del Flujo de Acceso */}
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-5 tw-mb-8">
                                {/* Paso 1: Botón en NavBar Lateral */}
                                <div className="tw-bg-gray-50 tw-p-5 tw-rounded-xl tw-border tw-border-gray-200 tw-flex tw-flex-col tw-justify-between avoid-break">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-gap-2 tw-text-[#143955] tw-font-bold tw-text-sm tw-mb-2">
                                            <span className="tw-bg-[#143955] tw-text-white tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs">1</span>
                                            Acceso en Barra Lateral
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-4">
                                            Haga clic en el botón cuadrado de <strong>Plan indicativo</strong> ubicado en la barra de navegación lateral izquierda:
                                        </p>
                                    </div>
                                    <div className="tw-bg-white tw-p-4 tw-rounded-xl tw-border tw-border-slate-300 tw-flex tw-flex-col tw-items-center tw-gap-2">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón en barra lateral:</span>
                                        {/* ButtonComponent de NavBar */}
                                        <div className="tw-flex tw-items-center tw-justify-center">
                                            <button
                                                type="button"
                                                title="Plan indicativo"
                                                className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow-md pointer-events-none"
                                            >
                                                <PlanIndicativoIcon color="#41a95b" />
                                            </button>
                                        </div>
                                        <span className="tw-text-[11px] tw-font-bold tw-text-[#143955]">Plan indicativo</span>
                                    </div>
                                </div>

                                {/* Paso 2: Botón Añadir Evidencia en UnitNodePage */}
                                <div className="tw-bg-gray-50 tw-p-5 tw-rounded-xl tw-border tw-border-gray-200 tw-flex tw-flex-col tw-justify-between avoid-break">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-gap-2 tw-text-[#143955] tw-font-bold tw-text-sm tw-mb-2">
                                            <span className="tw-bg-[#143955] tw-text-white tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs">2</span>
                                            Botón en Pantalla de Meta
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-4">
                                            Al seleccionar su Meta de Producto, encontrará en la columna derecha el botón de reporte de avances:
                                        </p>
                                    </div>
                                    <div className="tw-bg-white tw-p-4 tw-rounded-xl tw-border tw-border-slate-300 tw-flex tw-flex-col tw-items-center tw-gap-2">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón en la meta:</span>
                                        {/* handleSubmitButton en UnitNodePage.tsx */}
                                        <button
                                            type="button"
                                            className="tw-bg-slate-400 hover:tw-bg-slate-200 tw-rounded tw-p-2 tw-font-bold tw-text-white hover:tw-text-black tw-w-4/5 tw-text-center tw-text-sm pointer-events-none"
                                        >
                                            Añadir evidencia
                                        </button>
                                    </div>
                                </div>

                                {/* Paso 3: Botón Mostrar Evidencias en UnitNodePage */}
                                <div className="tw-bg-gray-50 tw-p-5 tw-rounded-xl tw-border tw-border-gray-200 tw-flex tw-flex-col tw-justify-between avoid-break">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-gap-2 tw-text-[#143955] tw-font-bold tw-text-sm tw-mb-2">
                                            <span className="tw-bg-[#143955] tw-text-white tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs">3</span>
                                            Consultar Historial de Meta
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-4">
                                            Para desplegar la lista de avances de años anteriores cargados a esa misma meta:
                                        </p>
                                    </div>
                                    <div className="tw-bg-white tw-p-4 tw-rounded-xl tw-border tw-border-slate-300 tw-flex tw-flex-col tw-items-center tw-gap-2">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón de consulta:</span>
                                        {/* handleEvidence en UnitNodePage.tsx */}
                                        <button
                                            type="button"
                                            className="tw-bg-blue-500 hover:tw-bg-blue-300 tw-rounded tw-p-2 tw-font-bold tw-text-white hover:tw-text-black tw-w-4/5 tw-text-center tw-text-sm pointer-events-none"
                                        >
                                            Mostrar evidencias
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle práctico de los 5 Bloques del Formulario EvidenceForm */}
                            <h4 className="tw-text-sm tw-font-bold tw-text-gray-800 tw-uppercase tw-tracking-wide tw-mb-3">
                                Instrucciones de Diligenciamiento de los 5 Bloques Obligatorios:
                            </h4>
                            <div className="tw-space-y-4">
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                                        <span className="tw-bg-green-700 tw-text-white tw-font-bold tw-text-xs tw-px-2 tw-py-0.5 tw-rounded">
                                            Bloque 1
                                        </span>
                                        <h5 className="tw-font-bold tw-text-sm tw-text-gray-900">
                                            Avance Cuantitativo y Vigencia (Año)
                                        </h5>
                                    </div>
                                    <ul className="tw-text-xs tw-text-gray-600 tw-space-y-1 tw-list-disc tw-pl-5">
                                        <li><strong>Vigencia (Año):</strong> Seleccione el año de reporte en el selector del formulario. Si la fecha límite (*deadline*) está vencida, el sistema impedirá el cargue.</li>
                                        <li><strong>Cantidad / Magnitud:</strong> Digite el valor físico ejecutado en el periodo en el campo numérico (respetando la unidad de medida indicada, ej: Metros, Familias, Porcentaje).</li>
                                        <li><strong>Descripción de Actividades:</strong> Redacte en el área de texto las actividades específicas desarrolladas en el periodo que soportan la cifra.</li>
                                    </ul>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                                        <span className="tw-bg-green-700 tw-text-white tw-font-bold tw-text-xs tw-px-2 tw-py-0.5 tw-rounded">
                                            Bloque 2
                                        </span>
                                        <h5 className="tw-font-bold tw-text-sm tw-text-gray-900">
                                            Ubicación Territorial y Mapa
                                        </h5>
                                    </div>
                                    <ul className="tw-text-xs tw-text-gray-600 tw-space-y-1 tw-list-disc tw-pl-5">
                                        <li>Seleccione en el desplegable la <strong>Comuna</strong> o <strong>Corregimiento</strong> donde se concentró la acción.</li>
                                        <li>Elija el <strong>Barrio</strong> o <strong>Vereda</strong> (o marque "Todas" si el impacto cubre todo el territorio municipal).</li>
                                        <li><strong>Georreferenciación:</strong> Si su entidad territorial tiene habilitado el geoportal, use el popover para fijar puntos en el mapa que alimentarán el módulo de intervención espacial.</li>
                                    </ul>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                                        <span className="tw-bg-green-700 tw-text-white tw-font-bold tw-text-xs tw-px-2 tw-py-0.5 tw-rounded">
                                            Bloque 3
                                        </span>
                                        <h5 className="tw-font-bold tw-text-sm tw-text-gray-900">
                                            Recursos Financieros Ejecutados (\$ COP) y Fuentes
                                        </h5>
                                    </div>
                                    <ul className="tw-text-xs tw-text-gray-600 tw-space-y-1 tw-list-disc tw-pl-5">
                                        <li><strong>Recursos ejecutados:</strong> Digite el valor real ejecutado en pesos colombianos (\$ COP).</li>
                                        <li><strong>Fuente de recursos:</strong> El formulario ofrece las opciones estándar de ley:
                                            <span className="tw-font-semibold tw-text-gray-800"> SGP Educación, SGP Salud, SGP Libre Inversión, Cofinanciación Departamento, Cofinanciación Nación, Propios, Funcionamiento</span> u <span className="tw-font-semibold tw-text-gray-800">Otros</span> (desplegando campo de texto libre).
                                        </li>
                                    </ul>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-3 tw-mb-1.5">
                                        <div className="tw-flex tw-items-center tw-gap-2">
                                            <span className="tw-bg-green-700 tw-text-white tw-font-bold tw-text-xs tw-px-2 tw-py-0.5 tw-rounded">
                                                Bloque 4
                                            </span>
                                            <h5 className="tw-font-bold tw-text-sm tw-text-gray-900">
                                                Cargue de Soportes Múltiples (Archivos y Enlaces Web)
                                            </h5>
                                        </div>
                                        <div className="tw-flex tw-items-center tw-gap-2">
                                            <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón en formulario:</span>
                                            {/* handleAddSupport en EvidenceForm.tsx */}
                                            <button
                                                type="button"
                                                className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-px-3 tw-py-1.5 tw-rounded tw-border tw-border-black tw-text-xs tw-font-bold pointer-events-none"
                                            >
                                                + Agregar Soporte
                                            </button>
                                        </div>
                                    </div>
                                    <ul className="tw-text-xs tw-text-gray-600 tw-space-y-1 tw-list-disc tw-pl-5">
                                        <li><strong>Tipo Archivo PDF:</strong> Adjunte archivos PDF de actas de entrega, certificaciones o informes con firmas autorizadas.</li>
                                        <li><strong>Tipo Enlace Web (URL):</strong> Para expedientes alojados en SECOP II, visor de mapas o repositorio de Drive institucional, escoja "Enlace Web" y pegue la URL.</li>
                                        <li><strong>Múltiples Soportes:</strong> Use el botón <code>+ Agregar Soporte</code> para ingresar cada documento adicional con su respectivo lugar y fecha. Para retirar un soporte innecesario, use el botón rojo <span className="tw-bg-red-500 tw-text-white tw-px-1.5 tw-py-0.5 tw-rounded tw-font-bold tw-text-[10px]">✕</span>.</li>
                                    </ul>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1.5">
                                        <span className="tw-bg-green-700 tw-text-white tw-font-bold tw-text-xs tw-px-2 tw-py-0.5 tw-rounded">
                                            Bloque 5
                                        </span>
                                        <h5 className="tw-font-bold tw-text-sm tw-text-gray-900">
                                            Población Beneficiaria
                                        </h5>
                                    </div>
                                    <ul className="tw-text-xs tw-text-gray-600 tw-space-y-1 tw-list-disc tw-pl-5">
                                        <li><strong>Grupo Poblacional:</strong> Seleccione en la lista: <em>Adulto Mayor, Afrodescendientes, Docentes, Estudiantes, Habitantes de la Calle, Indígenas, Jóvenes, LGBTI, Mujeres, Niños y Adolescentes, Discapacidad, Víctimas, Todos</em>, entre otros.</li>
                                        <li><strong>Número de beneficiarios:</strong> Registre la cantidad de personas impactadas en el periodo.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Botón de Enviar final de EvidenceForm */}
                            <div className="tw-mt-6 tw-p-4 tw-bg-slate-50 tw-rounded-xl tw-border tw-border-slate-300 tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-between tw-gap-4 avoid-break">
                                <div>
                                    <h5 className="tw-font-bold tw-text-xs tw-text-gray-800 tw-uppercase">Paso final: Guardar evidencia en el formulario</h5>
                                    <p className="tw-text-xs tw-text-gray-600 tw-mt-0.5">Al presionar el botón inferior en <code>EvidenceForm</code>, la evidencia quedará radicada para auditoría de Planeación:</p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-items-center tw-gap-1">
                                    <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón de guardado:</span>
                                    {/* handleSubmitEvidence en EvidenceForm.tsx */}
                                    <button
                                        type="button"
                                        className="tw-w-48 tw-bg-blue-500 hover:tw-bg-blue-300 tw-py-3 tw-rounded tw-text-white hover:tw-text-black tw-font-bold tw-text-sm pointer-events-none"
                                    >
                                        Añadir evidencia
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 2: REVISIÓN Y VALIDACIÓN DE METAS (PLANEACIÓN) */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 1) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-blue-100 tw-text-blue-800 tw-rounded-xl">
                                    <HowToRegIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        2. Flujo de Revisión: Cómo Validar y Auditar Metas
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Procedimiento para auditores de Planeación y Sectorialistas: verificación de coherencia, aprobación y devolución con observaciones motivadas.
                                    </p>
                                </div>
                            </div>

                            {/* Bandeja de ejecuciones por aprobar de ListEvidence.tsx */}
                            <div className="tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-mb-6 avoid-break">
                                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-start sm:tw-items-center tw-justify-between tw-gap-4 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-4">
                                    <div>
                                        <h4 className="tw-font-bold tw-text-gray-900 tw-text-sm">
                                            Bandeja Central de Auditoría de Planeación
                                        </h4>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mt-0.5">
                                            En la vista de listado de evidencias de Plan Indicativo, Planeación accede a las evidencias pendientes con este botón:
                                        </p>
                                    </div>
                                    <div className="tw-flex tw-flex-col tw-items-center tw-gap-1">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón en ListEvidence:</span>
                                        {/* Botón en ListEvidence.tsx */}
                                        <button
                                            type="button"
                                            className="tw-mr-2 tw-mb-2 tw-p-2 tw-rounded tw-border-2 tw-border-black tw-bg-[#008432] hover:tw-bg-green-200 tw-text-white hover:tw-text-black tw-font-bold tw-text-sm pointer-events-none"
                                        >
                                            Ejecuciones por aprobar
                                        </button>
                                    </div>
                                </div>
                                <p className="tw-text-xs tw-text-gray-700">
                                    Esta bandeja lista todas las evidencias cargadas por las dependencias que se encuentran en estado de revisión. Permite examinar actividad, comuna, barrio, unidad de medida, cantidad, recursos y enlaces a los archivos PDF adjuntos.
                                </p>
                            </div>

                            {/* Botones de acción del auditor: Aprobar y Rechazar de EvidenceDetail.tsx */}
                            <h4 className="tw-text-sm tw-font-bold tw-text-gray-800 tw-uppercase tw-tracking-wide tw-mb-3">
                                Botones de Calificación en la Tabla de Evidencias:
                            </h4>
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5 tw-mb-6">
                                <div className="tw-border tw-border-green-300 tw-bg-green-50/50 tw-rounded-xl tw-p-5 tw-flex tw-flex-col tw-justify-between avoid-break">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <span className="tw-text-xs tw-font-bold tw-text-[#008432] tw-uppercase">Opción 1: Aprobación</span>
                                            {/* handleBtnApprove(1) en EvidenceDetail.tsx */}
                                            <button
                                                type="button"
                                                className="tw-bg-[#008432] hover:tw-bg-green-400 tw-text-white hover:tw-text-black tw-rounded tw-py-1 tw-px-3 tw-font-bold tw-text-xs pointer-events-none"
                                            >
                                                Aprobar
                                            </button>
                                        </div>
                                        <h5 className="tw-font-bold tw-text-gray-900 tw-text-sm tw-mb-1">
                                            Suma al avance oficial (Estado 1)
                                        </h5>
                                        <p className="tw-text-xs tw-text-gray-600">
                                            Al presionar <strong>"Aprobar"</strong>, el sistema incorpora el avance físico y financiero a las cifras oficiales del plan. El semáforo de la meta se recalcula de inmediato y el resultado se refleja en los informes ejecutivos.
                                        </p>
                                    </div>
                                </div>

                                <div className="tw-border tw-border-red-300 tw-bg-red-50/50 tw-rounded-xl tw-p-5 tw-flex tw-flex-col tw-justify-between avoid-break">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <span className="tw-text-xs tw-font-bold tw-text-red-700 tw-uppercase">Opción 2: Devolución</span>
                                            {/* handleBtnApprove(2) en EvidenceDetail.tsx */}
                                            <button
                                                type="button"
                                                className="tw-bg-[#FE1700] hover:tw-bg-red-400 tw-text-white hover:tw-text-black tw-rounded tw-py-1 tw-px-3 tw-font-bold tw-text-xs pointer-events-none"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                        <h5 className="tw-font-bold tw-text-gray-900 tw-text-sm tw-mb-1">
                                            Abre ventana de motivo de rechazo (Estado 2)
                                        </h5>
                                        <p className="tw-text-xs tw-text-gray-600">
                                            Al hacer clic en <strong>"Rechazar"</strong>, el sistema despliega una ventana modal con el mensaje <em>"Ingrese el motivo del rechazo"</em> y un campo de texto obligatorio. El auditor debe detallar la inconsistencia y hacer clic en el botón de confirmación:
                                        </p>
                                        <div className="tw-mt-3 tw-flex tw-items-center tw-gap-2">
                                            <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">Botón de confirmación en modal:</span>
                                            {/* Botón modal en EvidenceDetail.tsx */}
                                            <button
                                                type="button"
                                                className="tw-bg-blue-600 hover:tw-bg-blue-400 tw-text-white hover:tw-text-black tw-rounded tw-p-2 tw-font-bold tw-text-xs pointer-events-none"
                                            >
                                                Enviar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subsanación por el funcionario */}
                            <div className="tw-bg-amber-50 tw-p-4 tw-rounded-xl tw-border tw-border-amber-300 avoid-break">
                                <h5 className="tw-font-bold tw-text-amber-900 tw-text-xs tw-uppercase tw-mb-1">
                                    Procedimiento de subsanación para el Funcionario:
                                </h5>
                                <p className="tw-text-xs tw-text-amber-800">
                                    El enlace sectorial ingresa a la meta, localiza la evidencia con observación, lee el requerimiento formulado por Planeación, reemplaza el archivo o corrige la cifra y hace clic en <strong>"Añadir evidencia"</strong> (que actuará como actualización). El registro vuelve automáticamente a la bandeja de pendientes sin perder la trazabilidad cronológica.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 3: INTERPRETACIÓN DE DATOS Y SEMÁFORO          */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 2) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-amber-100 tw-text-amber-700 tw-rounded-xl">
                                    <CalculateIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        3. Interpretación de Datos, Cálculos de Avance y Semáforo
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Cómo leer la caja de ejecución en pantalla, entender los tipos de acumulación y analizar la semaforización configurada para este plan.
                                    </p>
                                </div>
                            </div>

                            {/* Caja de totales de UnitNodePage.tsx */}
                            <div className="tw-mb-6 avoid-break">
                                <h4 className="tw-text-xs tw-font-bold tw-text-gray-700 tw-uppercase tw-mb-2">
                                    Caja de Totales en Pantalla:
                                </h4>
                                <div className="tw-max-w-md tw-mx-auto tw-my-3">
                                    {/* Caja de UnitNodePage.tsx líneas 455-479 */}
                                    <div className="tw-w-full tw-my-2">
                                        <p className="tw-mx-2 tw-border-x tw-border-t tw-border-black tw-text-xl tw-text-center tw-bg-yellow-300 tw-rounded-t tw-font-bold">
                                            Total
                                        </p>
                                        <div className="tw-flex tw-justify-between tw-mx-2 tw-bg-white tw-border tw-border-black tw-p-2">
                                            <div className="tw-flex tw-flex-col tw-justify-center tw-border-r tw-border-black tw-px-3 tw-w-1/2">
                                                <p className="tw-text-center tw-text-xs">Ejecución física</p>
                                                <p className="tw-text-center tw-border-t tw-border-black tw-font-bold tw-text-sm tw-pt-1">
                                                    85.50%
                                                </p>
                                            </div>
                                            <div className="tw-flex tw-flex-col tw-justify-center tw-px-3 tw-w-1/2">
                                                <p className="tw-text-center tw-text-xs">Ejecución financiera</p>
                                                <p className="tw-text-center tw-border-t tw-border-black tw-font-bold tw-text-sm tw-pt-1">
                                                    $125,000,000
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Explicación de los 3 tipos de cálculo */}
                            <h4 className="tw-text-sm tw-font-bold tw-text-gray-800 tw-uppercase tw-tracking-wide tw-mb-3">
                                Reglas de Acumulación de las Metas:
                            </h4>
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mb-6">
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <div className="tw-font-bold tw-text-sm tw-text-[#143955] tw-mb-1.5">
                                        1. Metas de Suma (Acumulativas)
                                    </div>
                                    <p className="tw-text-xs tw-text-gray-600 tw-mb-2">
                                        El avance físico se incrementa adicionando lo ejecutado en cada periodo.
                                    </p>
                                    <div className="tw-bg-white tw-p-2.5 tw-rounded tw-border tw-border-gray-200 tw-text-[11px] tw-text-gray-700">
                                        <strong>Ejemplo:</strong> Meta cuatrienal de 100 kilómetros de vías pavimentadas. Si en 2024 se hacen 20 km y en 2025 se hacen 30 km, el acumulado oficial es 50 km (50% de avance cuatrienal).
                                    </div>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <div className="tw-font-bold tw-text-sm tw-text-[#143955] tw-mb-1.5">
                                        2. Metas Constantes (Mantenimiento)
                                    </div>
                                    <p className="tw-text-xs tw-text-gray-600 tw-mb-2">
                                        Miden el sostenimiento de una capacidad instalada o un servicio permanente. <em>No se suman año a año</em>.
                                    </p>
                                    <div className="tw-bg-white tw-p-2.5 tw-rounded tw-border tw-border-gray-200 tw-text-[11px] tw-text-gray-700">
                                        <strong>Ejemplo:</strong> Mantener 10 bibliotecas públicas abiertas durante el cuatrienio. Si en 2024 operan 10 bibliotecas, el cumplimiento del año es 100%. Los reportes certifican la continuidad del servicio.
                                    </div>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <div className="tw-font-bold tw-text-sm tw-text-[#143955] tw-mb-1.5">
                                        3. Metas Decrecientes (Reducción)
                                    </div>
                                    <p className="tw-text-xs tw-text-gray-600 tw-mb-2">
                                        Indicadores donde el éxito consiste en disminuir una cifra negativa (tasas de deserción, mortalidad, siniestralidad).
                                    </p>
                                    <div className="tw-bg-white tw-p-2.5 tw-rounded tw-border tw-border-gray-200 tw-text-[11px] tw-text-gray-700">
                                        <strong>Ejemplo:</strong> Reducir la tasa de accidentalidad del 15% al 9%. Cuanto más bajo sea el valor reportado respecto a la línea base, mayor será el porcentaje de cumplimiento asignado.
                                    </div>
                                </div>
                            </div>

                            {/* Tarjetas del Semáforo Dinámico con los datos de este plan */}
                            <h4 className="tw-text-sm tw-font-bold tw-text-gray-800 tw-uppercase tw-tracking-wide tw-mb-3">
                                Umbrales de Semaforización Dinámica de este Plan:
                            </h4>
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
                                <div className="tw-border-2 tw-border-red-400 tw-bg-red-50 tw-p-4 tw-rounded-xl avoid-break">
                                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                                        <span className="tw-bg-red600 tw-bg-red-600 tw-text-white tw-font-bold tw-text-xs tw-px-2.5 tw-py-0.5 tw-rounded">CRÍTICO</span>
                                        <ErrorOutlineIcon className="tw-text-red-600" />
                                    </div>
                                    <div className="tw-text-2xl tw-font-extrabold tw-text-red-700">0% - {c1}%</div>
                                    <p className="tw-text-xs tw-text-gray-700 tw-mt-2">
                                        Retraso severo. Alerta automática enviada a la Secretaría de Planeación para plan de contingencia.
                                    </p>
                                </div>

                                <div className="tw-border-2 tw-border-amber-400 tw-bg-amber-50 tw-p-4 tw-rounded-xl avoid-break">
                                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                                        <span className="tw-bg-amber-500 tw-text-white tw-font-bold tw-text-xs tw-px-2.5 tw-py-0.5 tw-rounded">BAJO / ALERTA</span>
                                        <WarningAmberIcon className="tw-text-amber-600" />
                                    </div>
                                    <div className="tw-text-2xl tw-font-extrabold tw-text-amber-800">{c1 + 1}% - {c2}%</div>
                                    <p className="tw-text-xs tw-text-gray-700 tw-mt-2">
                                        Ejecución inferior a la curva programada. Requiere aceleración de procesos precontractuales.
                                    </p>
                                </div>

                                <div className="tw-border-2 tw-border-yellow-400 tw-bg-yellow-50 tw-p-4 tw-rounded-xl avoid-break">
                                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                                        <span className="tw-bg-yellow-500 tw-text-gray-900 tw-font-bold tw-text-xs tw-px-2.5 tw-py-0.5 tw-rounded">MEDIO / REGULAR</span>
                                        <InfoOutlinedIcon className="tw-text-yellow-700" />
                                    </div>
                                    <div className="tw-text-2xl tw-font-extrabold tw-text-yellow-800">{c2 + 1}% - {c3}%</div>
                                    <p className="tw-text-xs tw-text-gray-700 tw-mt-2">
                                        Avance aceptable con cumplimiento de hitos principales pero pendientes de recepción documental.
                                    </p>
                                </div>

                                <div className="tw-border-2 tw-border-green-400 tw-bg-green-50 tw-p-4 tw-rounded-xl avoid-break">
                                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                                        <span className="tw-bg-[#008432] tw-text-white tw-font-bold tw-text-xs tw-px-2.5 tw-py-0.5 tw-rounded">SOBRESALIENTE</span>
                                        <CheckCircleOutlineIcon className="tw-text-green-700" />
                                    </div>
                                    <div className="tw-text-2xl tw-font-extrabold tw-text-[#006400]">{c3 + 1}% - {c4}%</div>
                                    <p className="tw-text-xs tw-text-gray-700 tw-mt-2">
                                        Cumplimiento óptimo conforme a la programación. Evidencias soportadas y aprobadas.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 4: USO DEL ASISTENTE DE INTELIGENCIA ARTIFICIAL*/}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 3) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-indigo-100 tw-text-indigo-700 tw-rounded-xl">
                                    <SmartToyIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        4. Uso del Asistente de Inteligencia Artificial Institucional
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Operación por voz y texto con los controles flotantes idénticos del sistema para consultar avances, cuellos de botella y metas.
                                    </p>
                                </div>
                            </div>

                            {/* Botón flotante y controles de VoiceChatWindow.tsx */}
                            <div className="tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-mb-6 avoid-break">
                                <h4 className="tw-font-bold tw-text-gray-900 tw-text-sm tw-mb-3">
                                    Controles del Asistente IA:
                                </h4>
                                <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-5">
                                    {/* Botón flotante de VoiceChatWindow.tsx líneas 278-292 */}
                                    <div className="tw-flex tw-flex-col tw-items-start tw-gap-1">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">1. Botón flotante inferior:</span>
                                        <button
                                            type="button"
                                            className="tw-flex tw-items-center tw-gap-2.5 tw-px-4 tw-py-3 tw-rounded-full tw-shadow-2xl tw-bg-gradient-to-r tw-from-[#012947] tw-via-[#0d3b66] tw-to-[#143955] tw-text-white tw-font-bold tw-text-xs tw-border tw-border-blue-400/40 pointer-events-none"
                                        >
                                            <span className="tw-text-base">✨</span>
                                            <span>Asistente IA</span>
                                            <span className="tw-bg-emerald-500 tw-w-2 tw-h-2 tw-rounded-full tw-animate-pulse" />
                                        </button>
                                    </div>

                                    {/* Botón de micrófono de VoiceChatWindow.tsx línea 487 */}
                                    <div className="tw-flex tw-flex-col tw-items-start tw-gap-1">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">2. Micrófono de voz:</span>
                                        <button
                                            type="button"
                                            className="tw-p-2.5 tw-rounded-xl tw-border tw-border-slate-300 tw-text-slate-600 tw-bg-slate-50 pointer-events-none"
                                            title="Hablar por micrófono"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Botón Enviar de VoiceChatWindow.tsx línea 503 */}
                                    <div className="tw-flex tw-flex-col tw-items-start tw-gap-1">
                                        <span className="tw-text-[10px] tw-font-bold tw-text-gray-500 tw-uppercase">3. Botón Enviar mensaje:</span>
                                        <button
                                            type="button"
                                            className="tw-px-4 tw-py-2.5 tw-rounded-xl tw-bg-[#012947] hover:tw-bg-blue-800 tw-text-white tw-font-bold tw-text-xs tw-flex tw-items-center tw-gap-1.5 tw-transition tw-shadow-sm pointer-events-none"
                                        >
                                            <span>Enviar</span>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-mb-6">
                                {/* Interacción por voz y texto */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-text-indigo-900 tw-font-bold tw-text-sm tw-mb-2">
                                        <MicIcon className="tw-text-indigo-600" />
                                        Interacción por Voz en Español (es-CO)
                                    </div>
                                    <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                        Al presionar el botón de micrófono, el navegador solicitará permiso de audio. Hable claramente y el motor de reconocimiento transcribirá en tiempo real su requerimiento para consultar la base de datos viva del plan.
                                    </p>
                                    <div className="tw-bg-indigo-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-indigo-900">
                                        <strong>Síntesis de voz:</strong> El asistente también puede leer sus respuestas en voz alta, facilitando comités de gobierno y presentaciones.
                                    </div>
                                </div>

                                {/* Casos de uso recomendados */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-xs">
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-text-indigo-900 tw-font-bold tw-text-sm tw-mb-2">
                                        <AssignmentIcon className="tw-text-indigo-600" />
                                        Ejemplos de Consultas que Puede Responder la IA
                                    </div>
                                    <div className="tw-space-y-1.5 tw-text-xs">
                                        <div className="tw-bg-gray-50 tw-p-2 tw-rounded tw-border tw-border-gray-200 tw-text-gray-800">
                                            💬 <em>"¿Cuál es el porcentaje de avance general del Plan de Desarrollo?"</em>
                                        </div>
                                        <div className="tw-bg-gray-50 tw-p-2 tw-rounded tw-border tw-border-gray-200 tw-text-gray-800">
                                            💬 <em>"¿Qué metas están en semáforo rojo en la Secretaría de Salud?"</em>
                                        </div>
                                        <div className="tw-bg-gray-50 tw-p-2 tw-rounded tw-border tw-border-gray-200 tw-text-gray-800">
                                            💬 <em>"Dame un resumen de la ejecución del Sector Educación en 2024."</em>
                                        </div>
                                        <div className="tw-bg-gray-50 tw-p-2 tw-rounded tw-border tw-border-gray-200 tw-text-gray-800">
                                            💬 <em>"¿Cuáles son las metas con fecha de entrega próxima a vencer?"</em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 5: EXPLICACIÓN DE CADA MÓDULO DEL SISTEMA      */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 4) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-teal-100 tw-text-teal-800 tw-rounded-xl">
                                    <AppsIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        5. Explicación Detallada de Cada Módulo del Sistema
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Finalidad, operación y usuarios de cada módulo con los botones de la barra lateral institucional.
                                    </p>
                                </div>
                            </div>

                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
                                {/* Plan Indicativo */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                Plan Indicativo (PDT)
                                            </div>
                                            {/* ButtonComponent de Plan Indicativo */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="Plan indicativo"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <PlanIndicativoIcon color="#41a95b" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Estructura jerárquica del Plan de Desarrollo, tablero de metas y ponderación sectorial. Punto neurálgico de cargue y validación de evidencias.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Navegar niveles del plan, hojas de vida de indicadores, añadir evidencias y auditar el avance físico/financiero.
                                    </div>
                                </div>

                                {/* Plan de Acción */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                Plan de Acción Anual
                                            </div>
                                            {/* ButtonComponent de Plan de Acción */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="Plan de acción"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <PlanAccionIcon color="#ffffff" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Desagrega metas de producto en actividades operativas con cronogramas trimestrales a ejecutar durante la vigencia fiscal en curso.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Programar actividades por secretaría, ponderaciones porcentuales y reporte de hitos trimestrales.
                                    </div>
                                </div>

                                {/* POAI */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                POAI (Inversiones)
                                            </div>
                                            {/* ButtonComponent de POAI */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="POAI"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <ChartIcon color="#ffffff" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Articula la asignación presupuestal del municipio con las metas de inversión del plan de desarrollo para cada año fiscal.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Techos presupuestales por dependencia, balance de fuentes (SGP, Regalías, ICLD) y seguimiento financiero.
                                    </div>
                                </div>

                                {/* Banco de Proyectos */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                Banco de Proyectos (BPPIM)
                                            </div>
                                            {/* ButtonComponent de Banco de Proyectos */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="Banco de proyectos"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <ProjectBankIcon color="#ffffff" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Registro de proyectos de inversión formulados bajo metodología MGA / BPIN registrados en la entidad territorial.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Articulación de proyectos formulados con metas de producto y trazabilidad contractual.
                                    </div>
                                </div>

                                {/* Mapa de Intervención */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                Mapa de Intervención
                                            </div>
                                            {/* ButtonComponent de Mapa */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="Mapa de intervención"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <MapICon color="#ffffff" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Geoportal cartográfico interactivo que proyecta espacialmente las evidencias y obras sobre el mapa del municipio.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Filtros por comuna/corregimiento, capas satelitales y verificación de cobertura del gasto público.
                                    </div>
                                </div>

                                {/* Atención Ciudadana / PQRS */}
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-bg-white avoid-break shadow-sm tw-flex tw-flex-col tw-justify-between">
                                    <div>
                                        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                                            <div className="tw-text-[#143955] tw-font-bold tw-text-base">
                                                Atención Ciudadana (PQRS)
                                            </div>
                                            {/* ButtonComponent de Atención Ciudadana */}
                                            <div className="tw-flex tw-flex-col tw-items-center">
                                                <button
                                                    type="button"
                                                    title="Atención Ciudadana"
                                                    className="tw-bg-[#143955] hover:tw-bg-navBar tw-border tw-border-[#f59e0b] tw-rounded-2xl tw-w-16 tw-h-16 tw-p-3 tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow pointer-events-none"
                                                >
                                                    <MdSupportAgent color="#ffffff" size={36} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="tw-text-xs tw-text-gray-600 tw-mb-3">
                                            Canal institucional de radicación, trazabilidad y respuesta a peticiones, quejas, reclamos y solicitudes ciudadanas sobre el plan.
                                        </p>
                                    </div>
                                    <div className="tw-bg-gray-50 tw-p-2.5 tw-rounded tw-text-xs tw-text-gray-700">
                                        <strong>Acciones:</strong> Radicar PQRS, asignar a dependencias competentes y consultar el estado mediante el número de radicado.
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 6: ESTRUCTURA DINÁMICA Y ROLES                 */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 5) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-purple-100 tw-text-purple-800 tw-rounded-xl">
                                    <AccountTreeIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        6. Estructura Jerárquica del Plan Activo y Perfiles
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Niveles configurados en la base de datos para este plan institucional y matriz de responsabilidades por rol.
                                    </p>
                                </div>
                            </div>

                            {/* Flujo de niveles */}
                            {levels && levels.length > 0 ? (
                                <div className="tw-mb-6">
                                    <h4 className="tw-text-xs tw-font-bold tw-text-gray-700 tw-uppercase tw-mb-3">
                                        Niveles Configurados en este Plan:
                                    </h4>
                                    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-mb-4">
                                        {levels.map((lvl, idx) => (
                                            <React.Fragment key={lvl.id_level || idx}>
                                                <div className="tw-bg-[#143955] tw-text-white tw-px-4 tw-py-2.5 tw-rounded-xl tw-shadow-sm">
                                                    <span className="tw-text-[10px] tw-text-green-300 tw-block tw-font-bold tw-uppercase">
                                                        Nivel {idx + 1}
                                                    </span>
                                                    <span className="tw-font-bold tw-text-sm">
                                                        {lvl.name}
                                                    </span>
                                                </div>
                                                {idx < levels.length - 1 && (
                                                    <span className="tw-text-[#008432] tw-font-bold tw-text-xl">➔</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <table className="tw-w-full tw-text-left tw-border-collapse tw-text-xs">
                                        <thead>
                                            <tr className="tw-bg-gray-100 tw-text-gray-700">
                                                <th className="tw-py-2.5 tw-px-3 tw-font-bold tw-w-20">Nivel</th>
                                                <th className="tw-py-2.5 tw-px-3 tw-font-bold">Nombre Institucional</th>
                                                <th className="tw-py-2.5 tw-px-3 tw-font-bold">Descripción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tw-divide-y tw-divide-gray-200">
                                            {levels.map((lvl, idx) => (
                                                <tr key={lvl.id_level || idx} className="hover:tw-bg-gray-50">
                                                    <td className="tw-py-2 tw-px-3 tw-font-bold tw-text-[#008432]">Nivel {idx + 1}</td>
                                                    <td className="tw-py-2 tw-px-3 tw-font-semibold tw-text-gray-900">{lvl.name}</td>
                                                    <td className="tw-py-2 tw-px-3 tw-text-gray-600">{lvl.description || 'Nivel estructural de agregación.'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}

                            {/* Resumen de Perfiles */}
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-3 tw-mt-4">
                                <div className="tw-border tw-border-gray-200 tw-p-3 tw-rounded-lg tw-bg-gray-50 avoid-break">
                                    <span className="tw-bg-purple-600 tw-text-white tw-text-[10px] tw-font-bold tw-px-2 tw-py-0.5 tw-rounded">ADMIN</span>
                                    <h5 className="tw-font-bold tw-text-xs tw-text-gray-900 tw-mt-1">Administrador</h5>
                                    <p className="tw-text-[11px] tw-text-gray-600 tw-mt-0.5">Gestión de usuarios, definición de niveles, umbrales de semáforo y fechas de corte.</p>
                                </div>
                                <div className="tw-border tw-border-gray-200 tw-p-3 tw-rounded-lg tw-bg-gray-50 avoid-break">
                                    <span className="tw-bg-blue-700 tw-text-white tw-text-[10px] tw-font-bold tw-px-2 tw-py-0.5 tw-rounded">PLANEACIÓN</span>
                                    <h5 className="tw-font-bold tw-text-xs tw-text-gray-900 tw-mt-1">Planeación / Revisor</h5>
                                    <p className="tw-text-[11px] tw-text-gray-600 tw-mt-0.5">Auditoría de evidencias, aprobación, devolución con observaciones e informes institucionales.</p>
                                </div>
                                <div className="tw-border tw-border-gray-200 tw-p-3 tw-rounded-lg tw-bg-gray-50 avoid-break">
                                    <span className="tw-bg-[#008432] tw-text-white tw-text-[10px] tw-font-bold tw-px-2 tw-py-0.5 tw-rounded">FUNCIONARIO</span>
                                    <h5 className="tw-font-bold tw-text-xs tw-text-gray-900 tw-mt-1">Enlace de Secretaría</h5>
                                    <p className="tw-text-[11px] tw-text-gray-600 tw-mt-0.5">Diligenciamiento de los 5 bloques de evidencia, cargue de actas/soportes y subsanación de observaciones.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* FLUJO 7: PREGUNTAS FRECUENTES Y PROBLEMAS HABITUALES */}
                    {/* ---------------------------------------------------- */}
                    {(viewMode === 'all' || activeTab === 6) && (
                        <section className="tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-6 md:tw-p-8 tw-border tw-border-gray-200 card-print avoid-break print-full-content">
                            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
                                <div className="tw-p-2.5 tw-bg-amber-100 tw-text-amber-800 tw-rounded-xl">
                                    <HelpOutlineIcon />
                                </div>
                                <div>
                                    <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                        7. Preguntas Frecuentes y Solución de Problemas
                                    </h3>
                                    <p className="tw-text-xs md:tw-text-sm tw-text-gray-600">
                                        Respuestas concretas a situaciones reales que se presentan durante el cargue y validación de metas.
                                    </p>
                                </div>
                            </div>

                            <div className="tw-space-y-3.5">
                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <h5 className="tw-font-bold tw-text-xs md:tw-text-sm tw-text-gray-900 tw-mb-1">
                                        1. ¿Por qué el botón "Añadir Evidencia" aparece deshabilitado o no guarda?
                                    </h5>
                                    <p className="tw-text-xs tw-text-gray-600">
                                        Causas más frecuentes: (a) La fecha límite (*deadline*) fijada por Planeación para el periodo ya venció; (b) El usuario no tiene rol de funcionario vinculado a la secretaría responsable de esa meta; o (c) Falta adjuntar al menos un archivo o link de soporte en el Bloque 4.
                                    </p>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <h5 className="tw-font-bold tw-text-xs md:tw-text-sm tw-text-gray-900 tw-mb-1">
                                        2. Si me devolvieron una evidencia, ¿tengo que crear una nueva desde cero?
                                    </h5>
                                    <p className="tw-text-xs tw-text-gray-600">
                                        No. Ingrese a la meta, localice la evidencia rechazada (resaltada en amarillo o rojo), haga clic en el botón de edición (ícono de lápiz), lea el motivo de rechazo remitido por Planeación, reemplace el soporte o corrija la cifra y guarde. Conservará el historial.
                                    </p>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <h5 className="tw-font-bold tw-text-xs md:tw-text-sm tw-text-gray-900 tw-mb-1">
                                        3. ¿Por qué mi meta reportada no suma al avance general del municipio?
                                    </h5>
                                    <p className="tw-text-xs tw-text-gray-600">
                                        Las evidencias en estado de <em>Borrador / Pendiente de Aprobación</em> no impactan el avance oficial. Solo cuando la Secretaría de Planeación o el Sectorialista hacen clic en <em>"Aprobar"</em>, el cálculo matemático se incorpora al tablero del Alcalde y del Concejo.
                                    </p>
                                </div>

                                <div className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-4 tw-bg-gray-50 avoid-break">
                                    <h5 className="tw-font-bold tw-text-xs md:tw-text-sm tw-text-gray-900 tw-mb-1">
                                        4. ¿Qué hago si mi archivo de soporte supera los 20 MB?
                                    </h5>
                                    <p className="tw-text-xs tw-text-gray-600">
                                        En el Bloque 4 seleccione el tipo <strong>"Enlace Web (URL)"</strong>. Cargue el archivo pesado en el repositorio institucional o Google Drive oficial de su secretaría y pegue el enlace de acceso público/institucional en el formulario.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                </div>

                {/* Pie de página institucional */}
                <div className="tw-text-center tw-text-xs tw-text-gray-500 tw-mt-8 tw-pb-6 tw-pt-4 tw-border-t tw-border-gray-200 avoid-break">
                    Sistema de Seguimiento y Evaluación de Planes de Desarrollo Territorial | Controland
                </div>
            </div>
        </div>
    );
};
export default ManualPage;
