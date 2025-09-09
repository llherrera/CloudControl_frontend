import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { useAppSelector, useAppDispatch } from "@/store";
import { setIdPlan } from "@/store/content/contentSlice";
import { thunkGetPDTid } from "@/store/plan/thunks";
import { resetPlan } from "@/store/plan/planSlice";

import { getPDTs } from "@/services/api";
import { PDTInterface, PDTPageProps } from "@/interfaces";
import { decode } from "@/utils";
import { BackBtn, Header } from "@/components/Citizen";

/*
  PDT Page - ahora con el mismo estilo visual que HomePage / LoginPage:
  - Fondo: degradado (tw-from-[#06283b] -> tw-via-[#1f4f63] -> tw-to-[#dbeff6])
  - Card central: blanco, esquinas redondeadas y sombra pronunciada
*/
export const PDT = () => {
    // estado local para lista de PDTs
    const [data, setData] = useState<PDTInterface[]>([]);

    // info de auth (token) desde el store
    const { token_info } = useAppSelector(store => store.auth);

    // rol decodificado (si hay token)
    let rol = "";
    if (token_info?.token !== undefined) {
        const decoded = decode(token_info.token);
        rol = decoded.rol;
    }

    // fetch inicial de PDTs
    useEffect(() => {
        getPDTs()
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        // contenedor full-screen con el mismo degradado que las otras páginas
        <div className="tw-min-h-screen tw-w-screen tw-flex tw-items-center tw-justify-center
                        tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6]">
            {/* tarjeta central con estilo consistente (ancho responsivo) */}
            <div className="tw-w-[95%] md:tw-w-[760px] tw-bg-white tw-rounded-2xl tw-shadow-2xl
                            tw-px-6 tw-py-10 md:tw-px-12 md:tw-py-14 tw-flex tw-flex-col tw-items-center">
                {/* Header wrapper como en las otras páginas */}
                <Header>
                    <>
                        {/* Lista de PDTs; pasamos data y rol */}
                        <ListPDT data={data} rol={rol} key={data.length} />
                    </>
                </Header>
            </div>
        </div>
    );
};

/* Componente interno que renderiza la lista de PDTs */
const ListPDT = ( props: PDTPageProps ) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // navegar a agregar PDT (resetea plan actual)
    const handleAddPdt = () => {
        dispatch(resetPlan());
        navigate('/anadirPDT');
    };

    // seleccionar un PDT: guarda id en localStorage, actualiza redux y navega al lobby
    const handlePdtid = (id: number) => {
        localStorage.removeItem('id_plan');
        localStorage.setItem('id_plan', id.toString());
        dispatch(setIdPlan(id));
        dispatch(thunkGetPDTid(id));
        navigate(`/lobby`);
    };
    
    // agregar (por ejemplo) funcionario al plan -> navega a registro
    const handleAdd = (id: number) => {
        dispatch(setIdPlan(id));
        navigate(`/register`);
    };

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-relative tw-w-full tw-mt-6">
            {/* Back button posicionado arriba a la izquierda */}
            <div className="tw-absolute tw-left-0 tw-top-[-50px]">
                <BackBtn handle={()=>navigate(-1)} id={props.data.length}/>
            </div>

            {/* indicación para el usuario */}
            <p className="tw-text-gray-700 tw-text-center tw-mb-4 tw-text-base md:tw-text-lg">
                Selecciona un plan de desarrollo territorial existente o crea uno nuevo.
            </p>

            {props.rol === "admin" ? (
                // lista de planes con scroll si supera la altura
                <ul className="tw-p-6 tw-border-2 tw-rounded-2xl tw-bg-gray-50 tw-w-full tw-max-w-xl tw-mt-2 tw-max-h-[40vh] tw-overflow-y-auto">
                    <li>
                        {/* botón para añadir un nuevo plan */}
                        <button
                            className="tw-bg-greenBtn hover:tw-bg-green-300 
                                       tw-text-white hover:tw-text-black tw-font-bold
                                       tw-rounded tw-w-full tw-py-3 tw-mb-6 tw-text-lg tw-transition-colors"
                            onClick={handleAddPdt}
                            type="button"
                            title="Agregar un nuevo plan"
                        >
                            Añadir Plan +
                        </button>
                    </li>

                    {/* mensaje si no hay planes */}
                    {props.data.length === 0 ? (
                        <p className="tw-text-center tw-text-gray-500 tw-my-8">No hay planes de momento</p>
                    ) : null}

                    {/* mapeo de planes */}
                    {props.data.map((e: PDTInterface) => (
                        <li className="tw-flex tw-items-center tw-gap-2 tw-mb-4" key={e.id_plan}>
                            <button
                                className="tw-flex tw-justify-between tw-items-center tw-w-full 
                                           tw-p-3 tw-rounded-lg tw-bg-gray-200 hover:tw-bg-gray-300
                                           tw-border-4 tw-border-gray-400 tw-transition-colors"
                                onClick={() => handlePdtid(e.id_plan!)}
                                type="button"
                                title={e.description}
                            >
                                <span className="tw-mr-4 tw-font-semibold">{e.name}</span>
                                <span className="tw-ml-4 tw-text-gray-600">{e.department}</span>
                            </button>

                            {/* icon button para añadir funcionario */}
                            <IconButton
                                color="success"
                                aria-label="Agregar funcionario"
                                type="button"
                                onClick={() => handleAdd(e.id_plan!)}
                                title="Agregar funcionario al plan"
                            >
                                <PersonAddAltIcon />
                            </IconButton>
                        </li>
                    ))}
                </ul>
            ) : (
                // mensaje si el usuario no es admin
                <p className="tw-text-2xl tw-font-bold tw-text-center tw-mt-16">No tiene suficientes permisos</p>
            )}
        </div>
    );
};
    