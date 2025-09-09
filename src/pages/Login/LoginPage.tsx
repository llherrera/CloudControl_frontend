// LoginPage.tsx
// Página de login con el mismo background (degradado oscuro -> claro) que HomePage.
// TODO: Este archivo está completamente comentado en español para facilitar mantenimiento.

/* ------------------------- IMPORTS ------------------------- */
// Import de React (aunque no siempre es necesario en versiones modernas de React,
// se mantiene por claridad y compatibilidad).
import React from "react";

// Import del formulario de login (componente reutilizable).
import { LoginForm } from "@/components/Citizen";

// Import del Header específico (tú lo importabas desde "@/components/Header").
import { Header } from "@/components/Header";

/* ------------------------- COMPONENTE ------------------------- */
/*
  LoginPage
  - Componente funcional que renderiza la vista de inicio de sesión.
  - Aplica el mismo fondo degradado que el HomePage: de un azul oscuro/verde en la parte superior
    a un azul claro en la parte inferior (clases Tailwind con prefijo `tw-`).
  - La tarjeta blanca central contiene el Header (wrapper) y el LoginForm.
  - Todo el fichero está comentado para explicar la estructura y clases.
*/
export const LoginPage = () => {
    return (
        /* 
          Contenedor principal full-screen:
          - tw-min-h-screen / tw-w-screen: ocupa toda la pantalla.
          - tw-flex / tw-items-center / tw-justify-center: centra el contenido.
          - tw-bg-gradient-to-b tw-from[...] tw-via[...] tw-to[...]: mismo degradado que HomePage.
        */
        <div
            className="tw-min-h-screen tw-w-screen tw-flex tw-flex-col tw-items-center tw-justify-center
                       tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6]"
        >
            {/* 
              Tarjeta blanca central (card) - ANCHO REDUCIDO:
              - En móviles se mantiene tw-w-[90%], pero en pantallas medianas/desktop se fija a md:tw-w-[560px]
                para que el recuadro sea menos ancho (solicitado).
              - md:tw-max-w-2xl asegura un máximo razonable si el layout cambia.
              - tw-bg-white: fondo blanco para la tarjeta.
              - tw-rounded-2xl: esquinas redondeadas pronunciadas.
              - tw-shadow-lg: sombra para elevar la tarjeta sobre el fondo.
              - tw-flex tw-flex-col tw-items-center: layout interno centrado verticalmente.
              - Ajustes de padding responsive para mantener proporciones.
            */}
            <div
                className="tw-w-[90%] tw-h-auto tw-mx-2 tw-my-4 tw-p-4 tw-bg-white tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-col tw-items-center
                           md:tw-flex-row md:tw-items-center md:tw-justify-center md:tw-w-[560px] md:tw-h-auto md:tw-mx-12 md:tw-my-12 md:tw-p-8 md:tw-max-w-2xl"
            >
                {/*
                  Contenedor interno que ocupa todo el ancho disponible dentro de la tarjeta.
                  - tw-w-full / md:tw-w-full: asegura que el contenido use todo el espacio en mobile y desktop.
                  - tw-flex tw-flex-col tw-items-center tw-justify-center: centra vertical y horizontalmente.
                */}
                <div className="tw-w-full md:tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center">
                    {/*
                      Usamos el Header original como wrapper:
                      - Mantiene coherencia con el resto de la app si Header aplica paddings o grid.
                      - Dentro del Header colocamos el contenido: párrafo explicativo + LoginForm.
                    */}
                    <Header>
                        {/*
                          React.Fragment vacío (no necesario, pero lo dejamos en la estructura original).
                          A continuación, el bloque que contiene el texto explicativo y el formulario.
                        */}
                        <React.Fragment />
                        <div
                            className="tw-w-full md:tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center
                                       tw-mb-4 tw-mt-4 md:tw-mt-0 md:tw-mb-0"
                        >
                            {/*
                              Párrafo explicativo:
                              - tw-mb-4: margen inferior para separar del formulario.
                              - tw-text-gray-700: color gris oscuro para una lectura cómoda.
                              - tw-text-center: centrado para mantener simetría en la tarjeta.
                              - tw-text-base md:tw-text-lg: tamaño responsivo del texto.
                            */}
                            <p className="tw-mb-4 tw-text-gray-700 tw-text-center tw-text-base md:tw-text-lg tw-w-[75%]">
                                Por favor, ingresa tus datos para acceder a la plataforma:
                            </p>

                            {/*
                              Componente LoginForm:
                              - Componente reutilizable que contiene los inputs, validaciones y submit.
                              - Se pasa key={0} como en tu versión original (no estrictamente necesario).
                              - El formulario se renderiza centrado dentro del card.
                            */}
                            <LoginForm key={0} />
                        </div>
                    </Header>
                </div>
            </div>
        </div>
    );
};
