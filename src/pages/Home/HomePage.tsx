import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Imports de componentes e íconos */
import { ButtonComponent, Header } from "@/components";
import funcLogo from "@/assets/icons/Funcionario.svg";
import citiLogo from "@/assets/icons/Ciudadanos.svg";

/* Imports de store / thunks / utilidades */
import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogout } from "@/store/auth/thunks";
import { setReload } from "@/store/content/contentSlice";
import { resetPlan } from "@/store/plan/planSlice";
import { resetContent } from "@/store/content/contentSlice";
import { resetEvidence } from "@/store/evidence/evidenceSlice";
import { resetUnit } from "@/store/unit/unitSlice";
import { removeGenericState } from "@/utils";

/*
  Componente HomePage
  - Muestra una tarjeta centrada con título, subtítulo y la opción "Funcionario".
  - Usa Tailwind (clases prefijadas con `tw-`) para estilos.
*/
export const HomePage = () => {
    // dispatch para acciones redux y selector para estado global
    const dispatch = useAppDispatch();
    const { reload } = useAppSelector(store => store.content);

    // navigate para cambiar de ruta
    const navigate = useNavigate();

    // estado local para manejar loading (por ejemplo si activarás la opción Ciudadano)
    const [loading, setLoading] = useState(false);

    /*
      useEffect de inicialización:
      - Si `reload` está activo, recarga la página y resetea el flag en redux.
      - Elimina estados genéricos en localStorage (removeGenericState).
      - Resetea slices relevantes para evitar estados residuales.
    */
    useEffect(() => {
        if (reload) {
            // recarga la página si el store indica recarga
            window.location.reload();
            dispatch(setReload(false));
        }

        // limpiar estados almacenados en localStorage (o similar)
        removeGenericState('unit');
        removeGenericState('content');
        removeGenericState('chart');
        removeGenericState('evidence');
        removeGenericState('plan');

        // dispatch para resetear slices del store
        dispatch(resetContent());
        dispatch(resetPlan());
        dispatch(resetEvidence());
        dispatch(resetUnit());
    }, []); // solo en montaje

    /*
      Handler para la opción "Ciudadano" (no visible por ahora en UI principal,
      lo dejo por si lo necesitas activar). Realiza logout y navega a /escoger.
    */
    const handleBtnCiudadano = async () => {
        setLoading(true); // bloqueo visual si es necesario
        try {
            await dispatch(thunkLogout()); // thunk para cerrar sesión
            navigate('/escoger'); // ruta para escoger tipo ciudadano
        } catch (error) {
            // logging simple y alerta; en producción manejar mejor errores
            console.log(error);
            alert('Algo salió mal');
        } finally {
            setLoading(false);
        }
    };

    /*
      Render del componente:
      - Fondo en degradado oscuro → claro (similar a la imagen).
      - Card centrado con borde redondeado y sombra pronunciada.
      - Card reducido: md:tw-w-[640px] (más compacto en pantallas medianas/desktop).
    */
    return (
        // contenedor full screen con gradiente
        <div
            className="tw-min-h-screen tw-w-screen tw-flex tw-items-center tw-justify-center
                       tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6]"
        >
            {/* Card principal (más compacto: md:tw-w-[640px]) */}
            <div
                className="tw-w-[95%] md:tw-w-[640px] tw-bg-white tw-rounded-2xl tw-shadow-2xl
                           tw-px-6 tw-py-10 md:tw-px-10 md:tw-py-12 tw-flex tw-flex-col tw-items-center"
            >
                {/* --------- TITULO (más pequeño que antes pero aun prominente) --------- */}
                <h1 className="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-[#072b3a] tw-mb-2">
                    ¡Bienvenido a ControlLand!
                </h1>

                {/* --------- SUBTITULO (negrilla requerida) --------- */}
                <p className="tw-text-center tw-text-gray-600 tw-mb-8 tw-font-semibold tw-text-base md:tw-text-lg">
                    Selecciona tu tipo de usuario para continuar
                </p>

                {/*
                  Usamos el Header original como wrapper (por compatibilidad con tu layout).
                  Dentro colocamos el contenido estilo: logo izquierdo | separador | bloque funcionario.
                */}
                <Header>

                    {/* ------------------ BLOQUE FUNCIONARIO ------------------ */}
                    <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">
                        {/* elemento clickable que navega a /login al hacer click o Enter */}
                        <div
                            onClick={() => navigate('/login')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/login'); }}
                            className="tw-cursor-pointer tw-flex tw-items-center tw-gap-4 tw-px-2"
                            aria-label="Ingresar como funcionario"
                        >
                            {/*
                                  Recuadro naranja (más pequeño que versiones anteriores):
                                  - tamaño 80x80 (se ve compacto en la tarjeta reducida)
                                  - sombra pronunciada para simular elevación
                                */}
                            <div
                                className="tw-flex tw-items-center tw-justify-center tw-rounded-md tw-shadow-lg"
                                style={{ width: 80, height: 80, background: "#f59e0b" }}
                            >
                                {/* icono dentro del recuadro */}
                                <img src={funcLogo} alt="Funcionario" style={{ width: 36, height: 'auto' }} />
                            </div>

                            {/* Texto del bloque ("Funcionario") */}
                            <div className="tw-text-lg md:tw-text-xl tw-font-semibold tw-text-gray-700">
                                Funcionario
                            </div>
                        </div>
                    </div>

                </Header>

                {/*
                  BOTÓN CIUDADANO (opcional):
                  - Está comentado; si deseas activarlo, descomenta y personaliza el ButtonComponent.
                  - El handler handleBtnCiudadano ya está definido arriba.
                */}
                {/*
                <div className="tw-mt-8">
                  <ButtonComponent
                    key={1}
                    inside={false}
                    text={loading ? 'Cargando...' : 'Ciudadano'}
                    src={citiLogo}
                    onClick={handleBtnCiudadano}
                    bgColor="tw-bg-greenBtn"
                    className={`tw-w-40 tw-h-12 tw-text-lg tw-mx-2 ${loading ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
                    disabled={loading}
                  />
                </div>
                */}
            </div>
        </div>
    );
};
