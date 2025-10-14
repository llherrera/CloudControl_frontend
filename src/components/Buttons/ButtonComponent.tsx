import { BtnProps, PQRSBtnProps } from "@/interfaces";

/* #012947
   Componente de botón reutilizable.
   Recibe propiedades (texto, ícono, colores, eventos, etc.) desde BtnProps.
*/
export const ButtonComponent = (props: BtnProps) => {
    return (
        <div className="tw-flex">
            <button
                type="submit"  /* #012947 Tipo del botón (submit para formularios) */
                title={props.text}  /* #012947 Texto alternativo (tooltip al pasar el mouse) */
                onClick={props.onClick}  /* #012947 Evento que se ejecuta al hacer clic */
                className={`hover:tw-bg-navBar ${props.bgColor ?? "tw-bg-[#f59e0b]"}
                            tw-border tw-border-[#f59e0b] tw-rounded-2xl
                            tw-w-16 tw-h-16 tw-p-4
                            md:tw-w-20 md:tw-h-20
                            xl:tw-w-24 xl:tw-h-24
                            2xl:tw-w-28 2xl:tw-h-28
                            tw-flex tw-flex-col
                            tw-justify-center tw-items-center
                            tw-font-bold
                            ${props.className ?? ""}`}
                disabled={props.disabled}  /* #012947 Permite desactivar el botón */
            >
                {props.src ? (
                    /* #012947 Si existe una imagen en props.src, la renderiza dentro del botón */
                    <img src={props.src} alt="icon" className="tw-w-10 tw-h-10" />
                ) : null}

                {props.icon ? props.icon : null /* #012947 Si existe un ícono en props.icon, lo muestra */}
            </button>

            {props.inside ? null : (
                /* #012947 Texto adicional al lado del botón (visible solo en pantallas medianas en adelante) */
                <p
                    className="tw-text-base md:tw-text-lg 
                               tw-ml-3
                               tw-font-montserrat tw-font-bold
                               tw-self-center
                               sm:tw-block tw-break-words tw-max-w-full
                               "
                >
                    {props.text}
                </p>
            )}
        </div>
    );
};

/* #012947
   Botón específico para PQRS (Peticiones, Quejas, Reclamos, Sugerencias).
   Recibe un título, descripción y una función de navegación.
*/
export const PQRSButton = ({ title, desc, navigate }: PQRSBtnProps) => (
    <button
        className="tw-bg-gradient-to-b tw-from-[#06283b] tw-to-[#1e3a5f]
                   tw-text-white tw-font-bold
                   tw-w-40 tw-p-3
                   tw-rounded-2xl
                   tw-flex tw-flex-col
                   tw-justify-between
                   tw-text-left tw-shadow-md
                   hover:tw-bg-[#f59e0b] hover:tw-text-black
                   transition-all"
        onClick={navigate}  /* #012947 Ejecuta la función de navegación al hacer clic */
    >
        <p className="tw-font-bold">{title}</p> {/* #012947 Muestra el título del botón */}
        <p className="tw-text-sm">{desc}</p>    {/* #012947 Muestra la descripción */}
        <span className="tw-rotate-90 tw-self-end">▲</span> {/* #012947 Icono de flecha decorativo */}
    </button>
);
