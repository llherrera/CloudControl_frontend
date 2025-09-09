// Importaciones de React y hooks principales
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importación de hooks de Redux personalizados
import { useAppDispatch, useAppSelector } from "@/store";
import {
    decrementLevelIndex, setParent, setCalcDone,
    AddRootTree, setZeroLevelIndex
} from "@/store/plan/planSlice";
import { thunkGetNodes, thunkGetSloganByPlan } from '@/store/plan/thunks';
import { setMode } from "@/store/content/contentSlice";

// Tipos e interfaces
import { IdProps } from "@/interfaces";

// Importación de componentes
import {
    NodeForm, NodesList, TimeLine, Graph, BackBtn,
    DoubleBackBtn, SettingsBtn
} from "@/components/Citizen";

// Importación de librerías externas
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { ModalBoard, ModalAi, ModalShare } from "../Modals";
import { decode } from "@/utils";

// Definición del componente principal
export const Content = (props: IdProps) => {
    // Hooks de navegación y dispatch de Redux
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Extracción de estados del store
    const { token_info } = useAppSelector(store => store.auth);
    const { plan, years, indexLevel, levels, parent, progressNodes,
        financial, radioBtn, nodes, colorimeter, rootTree
    } = useAppSelector(store => store.plan);
    const { mode } = useAppSelector(store => store.content);

    // Estados locales
    const [rol, setRol] = useState("");
    const [user, setUser] = useState("");
    const [id, setId] = useState(0);
    const [slogan, setSlogan] = useState<string>('default');

    // Decodifica el token y guarda datos del usuario
    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
            setUser(decoded.user);
        }
    }, []);

    // Carga nodos al cambiar de nivel o de año
    useEffect(() => {
        dispatch(thunkGetNodes({ id_level: levels[indexLevel].id_level!, parent: parent }));
    }, [years, indexLevel]);

    // Carga el slogan del plan
    useEffect(() => {
        if (plan?.id_plan) {
            const id = Number(plan.id_plan);

            dispatch(thunkGetSloganByPlan(id)).then((action: any) => {
                if (action.payload && typeof action.payload === 'string') {
                    setSlogan(action.payload);
                }
            }).catch((error: any) => {
                // Opcional: log de error si falla la API
            });
        }
    }, [plan?.id_plan]);

    // Reinicia al nivel raíz
    const handleStartReturn = () => {
        dispatch(AddRootTree([]));
        dispatch(setZeroLevelIndex());
    };

    // Función para regresar un nivel en el árbol
    const handleBack = () => {
        if (indexLevel === 0) {
            dispatch(setCalcDone(false));
            navigate(-1);
            return;
        }
        try {
            let newRoot = rootTree;
            newRoot = newRoot.slice(0, -1);
            dispatch(AddRootTree(newRoot));

            // Ajusta el "parent" quitando el último nivel
            let temp = parent!.split('.');
            let temp_ = temp.slice(0, temp.length - 1);
            temp.length === 2
                ? dispatch(setParent(null))
                : dispatch(setParent(temp_.join('.')));

            // Decrementa el índice de nivel
            dispatch(decrementLevelIndex(indexLevel - 1));
        } catch (e) {
            console.log(e);
        }
    };

    // Navegar a configuración
    const handleSettings = (page: number = 0) => {
        dispatch(setCalcDone(false));
        navigate(`/pdt/PlanIndicativo/configuracion`, {
            state: { pageN: page }
        });
    };

    // Cambiar entre modo edición / visualización
    const handleMode = () => dispatch(setMode(!mode));

    // Navegar a registro de usuario
    const handleAddUser = () => {
        dispatch(setCalcDone(false));
        navigate(`/register`);
    };

    // Define el color de los círculos de colorimetría
    const colorimeterCircles = (index: number) => (
        index === 0 ? 'tw-bg-redColory hover:tw-bg-red-200' :
            index === 1 ? 'tw-bg-yellowColory hover:tw-bg-yellow-200' :
                index === 2 ? 'tw-bg-greenColory hover:tw-bg-green-200' :
                    index === 3 ? 'tw-bg-blueColory hover:tw-bg-blue-200' : null
    );

    // Componente auxiliar para mostrar rol y permisos
    const HandleRol = () => (
        rol === 'admin' || (rol === 'funcionario' && id === props.id)
            ? <button onClick={() => handleSettings(1)}>Definir colorimetría</button>
            : <p>No se ha definido una colorimetría aún</p>
    );

    // Render principal
    return (
        <div className="tw-h-full">
            {/* Título y barra superior */}
            <h1 className=" tw-mx-6 tw-mt-6
                            tw-text-[#222222]
                            tw-font-bold tw-font-montserrat
                            tw-text-lg tw-text-center md:tw-text-left
                            tw-flex tw-justify-between">

                {/* Sección izquierda */}
                <div className="tw-flex tw-items-center tw-text-white">
                    Plan indicativo

                    {/* Botón de configuración */}
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === props.id)
                        ? <SettingsBtn handle={() => handleSettings(1)} id={props.id} />
                        : null}

                    {/* Botón para compartir */}
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === props.id)
                        ? <ModalShare plan />
                        : null}

                    {/* Usuario visible solo para ciertos roles */}
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === props.id)
                        ? <p className="tw-truncate tw-w-6 hover:tw-w-24" title="usuario"></p>
                        : null}
                </div>

                {/* Sección derecha (colorimetría y AI modal) */}
                <div className="tw-mb-2 tw-flex tw-items-center">
                    {colorimeter.length > 0
                        ? (
                            <ul className="tw-flex tw-gap-2">
                                {/* Círculo gris inicial */}
                                <div className="tw-rounded-full tw-w-8 tw-h-8 tw-bg-gray-400 hover:tw-bg-gray-200" title="No tiene programado ejecuciones">
                                    <p className="tw-invisible">a</p>
                                </div>
                                {/* Círculos de colorimetría */}
                                {colorimeter.map((color, index) => (
                                    <div
                                        key={color}
                                        className={`tw-rounded-full tw-w-8 tw-h-8 ${colorimeterCircles(index)}`}
                                        title={`Ejecutado ${isNaN(colorimeter[index - 1]) ? 0 : colorimeter[index - 1] + 1}% - ${colorimeter[index]}%`}
                                    >
                                        <p className="tw-invisible">a</p>
                                    </div>
                                ))}
                            </ul>
                        )
                        : <HandleRol />
                    }
                    {/* Botón AI (según rol) */}
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === props.id)
                        ? <ModalAi />
                        : null}
                </div>
            </h1>

            {/* Contenedor principal */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-mb-2">
                {/* Columna izquierda (timeline + rutas) */}
                <div className="tw-mx-6 tw-py-3
                                md:tw-ml-12
                                lg:tw-ml-6
                                tw-rounded tw-shadow-lg tw-border
                                tw-bg-white
                                md:tw-col-span-2">
                    <p className="tw-font-montserrat tw-ml-4 tw-font-bold">
                        {slogan !== 'default' ? slogan : `${plan!.name}. ¡Así vamos!`}
                    </p>

                    {/* Ruta del árbol */}
                    <div className="tw-ml-4 tw-mb-3">
                        {rootTree.length <= 0 ? null : (
                            <ul className="tw-flex tw-flex-wrap tw-gap-3 tw-font-montserrat tw-underline tw-underline-offset-2">
                                {rootTree.map((item) => (
                                    <li key={item[0]}>{item[0]}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <TimeLine />
                </div>

                {/* Columna derecha (nodos y controles) */}
                <div className="tw-rounded tw-shadow-lg tw-border
                                tw-bg-white tw-overflow-y-auto
                                tw-mx-6 tw-mt-6
                                md:tw-ml-6 md:tw-mr-3 md:tw-mt-0
                                md:tw-order-first md:tw-w-[290px] md:tw-h-[270px]
                                lg:tw-w-[95%] lg:tw-h-full lg:tw-row-span-2
                                xl:tw-row-span-2">
                    <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                        {/* Botones de navegación */}
                        {indexLevel < 2 ? null : <DoubleBackBtn handle={handleStartReturn} id={props.id} />}
                        <BackBtn
                            handle={handleBack}
                            id={props.id}
                            className={`${indexLevel < 2 ? '' : 'tw--translate-x-6'}`} />

                        {/* Nombre del nivel */}
                        {levels[indexLevel].name}

                        {/* Botón de edición (solo para admin/funcionario) */}
                        {rol === 'admin' || (rol === 'funcionario' && id === props.id)
                            ? (
                                <button
                                    className={`tw-ml-4 tw-p-2 tw-rounded ${mode
                                        ? 'tw-bg-red-300 hover:tw-bg-red-500'
                                        : 'tw-bg-green-300 hover:tw-bg-green-500'}`}
                                    onClick={handleMode}
                                >
                                    Editar
                                </button>
                            )
                            : null}
                    </p>

                    {/* Contenido de nodos */}
                    <div className="tw-pb-1 tw-mb-2">
                        {nodes.length === 0
                            ? (
                                <div>
                                    {(rol === "admin") || (rol === 'funcionario' && id === props.id)
                                        ? <NodeForm index={indexLevel} id={levels[indexLevel].id_level!} />
                                        : <div>
                                            <p className="tw-mx-4 tw-text-center">De momemnto no hay contenido en este Plan</p>
                                        </div>}
                                </div>
                            )
                            : mode
                                ? <NodeForm index={indexLevel} id={levels[indexLevel].id_level!} nodes={nodes} />
                                : <NodesList id={props.id} />}
                    </div>
                </div>

                {/* Columna inferior (gráfico) */}
                <div className="tw-mt-6 tw-mx-6 tw-px-4
                                tw-flex tw-flex-col tw-justify-start
                                tw-bg-white
                                tw-rounded tw-border
                                tw-shadow-lg
                                md:tw-col-span-full
                                lg:tw-col-start-2">
                    <div className="tw-flex tw-justify-between">
                        {/* Texto de cuatrenio */}
                        <p className="tw-font-montserrat tw-ml-2 tw-font-bold tw-mt-3">
                            Cuatrenio {new Date(plan!.start_date).getUTCFullYear()} - {new Date(plan!.end_date).getUTCFullYear()}
                        </p>
                        <ModalBoard />
                    </div>

                    {/* Gráfico de progreso */}
                    <Graph
                        dataValues={radioBtn === 'fisica'
                            ? progressNodes.map(p => Math.round(p * 100))
                            : financial.map(p => Math.round(p * 100) / 100)}
                    />
                </div>
            </div>
        </div>
    );
}
